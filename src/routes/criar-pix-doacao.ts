import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  enviarPedidoParaUtmify,
  getParadiseKey,
  getParadiseProductHash,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/criar-pix-doacao")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { valorDoacao } = (await request.json()) as any;
          if (!valorDoacao) {
            return new Response(JSON.stringify({ success: false }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const valorEmCentavos = Math.round(parseFloat(valorDoacao) * 100);
          const referenceId = `DOACAO-${Date.now()}`;
          const emailDoador = `doador.${Date.now()}.${Math.floor(
            Math.random() * 9999
          )}@nobre.site`;

          const payloadDoacao = {
            amount: valorEmCentavos,
            description: "Apoio Motoboy",
            reference: referenceId,
            productHash: getParadiseProductHash(),
            customer: {
              name: "Apoiador Nobre",
              email: emailDoador,
              document: "73793362906",
              phone: "99999999999",
            },
          };

          const paradiseRes = await fetch(
            `${PARADISE_API_URL}/transaction.php`,
            {
              method: "POST",
              headers: {
                "X-API-Key": getParadiseKey(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadDoacao),
            }
          );

          const apiData: any = await paradiseRes.json();
          const transactionId = apiData.transaction_id;
          let qrCodeFinal = apiData.qr_code_base64;

          if (!qrCodeFinal || !String(qrCodeFinal).startsWith("data:image")) {
            qrCodeFinal = `https://quickchart.io/qr?text=${encodeURIComponent(
              apiData.qr_code
            )}&size=300&ecLevel=L&margin=1`;
          } else {
            qrCodeFinal = `data:image/png;base64,${qrCodeFinal}`;
          }

          const payloadDoacaoUtmify = {
            orderId: transactionId,
            platform: "nobre-paradise-doacao",
            paymentMethod: "pix",
            status: "waiting_payment",
            createdAt: nowUtcSqlString(),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: "Apoiador nobre",
              email: emailDoador,
              phone: "99999999999",
            },
            products: [
              {
                id: "nobre-DOACAO",
                name: "Apoio Motoboy nobre",
                quantity: 1,
                priceInCents: valorEmCentavos,
                planId: null,
                planName: null,
              },
            ],
            trackingParameters: {
              src: null,
              sck: null,
              utm_source: null,
              utm_campaign: null,
              utm_medium: null,
              utm_content: null,
              utm_term: null,
            },
            commission: {
              totalPriceInCents: valorEmCentavos,
              gatewayFeeInCents: 1,
              userCommissionInCents: valorEmCentavos - 1,
              currency: "BRL",
            },
            isTest: false,
          };

          enviarPedidoParaUtmify(payloadDoacaoUtmify);
          pendingOrders[transactionId] = payloadDoacaoUtmify;

          return new Response(
            JSON.stringify({
              success: true,
              qrCodeData: qrCodeFinal,
              pixCopiaECola: apiData.qr_code,
              transactionId,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          console.error("Erro Doação Paradise:", error?.message ?? error);
          return new Response(
            JSON.stringify({ success: false, message: "Erro na doação" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

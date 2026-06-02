import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  enviarPedidoParaUtmify,
  getParadiseKey,
  getParadiseProductHash,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/criar-pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;
          console.log("Recebido pedido para criar PIX (Paradise com UTMs):", body);

          const {
            valorTotal,
            nome,
            whatsapp,
            cep,
            products,
            trackingParameters = {},
          } = body;

          const cepLimpo = cep ? String(cep).replace(/\D/g, "") : "";

          if (!valorTotal || !nome || !whatsapp) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Dados do pedido incompletos.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // 1. ViaCEP (opcional)
          if (cepLimpo.length === 8) {
            try {
              await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            } catch (e: any) {
              console.error("Erro ViaCEP:", e?.message ?? e);
            }
          }

          // 2. Valores
          const valorEmCentavos = Math.round(parseFloat(valorTotal) * 100);
          const referenceId = `REF-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;

          // 3. Email randômico para evitar duplicidade
          const emailCliente = `cliente.${Date.now()}.${Math.floor(
            Math.random() * 9999
          )}@nobre.site`;

          // 4. Payload Paradise
          const payloadParadise = {
            amount: valorEmCentavos,
            description: "Nobre",
            reference: referenceId,
            productHash: getParadiseProductHash(),
            customer: {
              name: nome,
              email: emailCliente,
              document: "73793362906",
              phone: String(whatsapp).replace(/\D/g, ""),
            },
            tracking: {
              utm_source: trackingParameters.utm_source || "",
              utm_medium: trackingParameters.utm_medium || "",
              utm_campaign: trackingParameters.utm_campaign || "",
              utm_content: trackingParameters.utm_content || "",
              utm_term: trackingParameters.utm_term || "",
              src: trackingParameters.src || "",
              sck: trackingParameters.sck || "",
            },
          };

          // 5. Chamada Paradise
          console.log("Enviando payload para Paradise...");
          const paradiseRes = await fetch(
            `${PARADISE_API_URL}/transaction.php`,
            {
              method: "POST",
              headers: {
                "X-API-Key": getParadiseKey(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadParadise),
            }
          );

          const apiData: any = await paradiseRes.json();
          console.log("Paradise respondeu:", apiData);

          const transactionId = apiData.transaction_id;
          const pixCopiaECola = apiData.qr_code;
          let qrCodeFinal = apiData.qr_code_base64;

          if (!transactionId || !pixCopiaECola) {
            throw new Error(
              "Resposta da Paradise incompleta. Verifique no painel se o produto está Ativo."
            );
          }

          if (!qrCodeFinal || !String(qrCodeFinal).startsWith("data:image")) {
            qrCodeFinal = `https://quickchart.io/qr?text=${encodeURIComponent(
              pixCopiaECola
            )}&size=300&ecLevel=L&margin=1`;
          } else {
            qrCodeFinal = `data:image/png;base64,${qrCodeFinal}`;
          }

          // 6. Utmify
          const produtosUtmify = Array.isArray(products)
            ? products.map((p: any) => ({
                id: p.id || "JAPA-SKU",
                name: p.name,
                planId: null,
                planName: null,
                quantity: p.quantity,
                priceInCents: Math.round(parseFloat(p.price) * 100),
              }))
            : [];

          const payloadUtmify = {
            orderId: String(transactionId),
            platform: "nobre-paradise",
            paymentMethod: "pix",
            status: "waiting_payment",
            createdAt: nowUtcSqlString(),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: nome,
              email: emailCliente,
              phone: String(whatsapp).replace(/\D/g, ""),
              document: "73793362906",
              country: "BR",
              ip: request.headers.get("x-forwarded-for") || null,
            },
            products: produtosUtmify,
            trackingParameters: {
              src: trackingParameters.src || null,
              sck: trackingParameters.sck || null,
              utm_source: trackingParameters.utm_source || null,
              utm_medium: trackingParameters.utm_medium || null,
              utm_campaign: trackingParameters.utm_campaign || null,
              utm_content: trackingParameters.utm_content || null,
              utm_term: trackingParameters.utm_term || null,
            },
            commission: {
              totalPriceInCents: valorEmCentavos,
              gatewayFeeInCents: 1,
              userCommissionInCents: valorEmCentavos - 1,
              currency: "BRL",
            },
            isTest: false,
          };

          // 7. Envia + guarda
          enviarPedidoParaUtmify(payloadUtmify);
          pendingOrders[transactionId] = payloadUtmify;

          return new Response(
            JSON.stringify({
              success: true,
              qrCodeData: qrCodeFinal,
              pixCopiaECola,
              transactionId,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          console.error("Erro na criação PIX Paradise:", error?.message ?? error);
          return new Response(
            JSON.stringify({
              success: false,
              message: "Erro ao gerar PIX na Paradise.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

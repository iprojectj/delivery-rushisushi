import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  enviarPedidoParaUtmify,
  gerarEmailRandomico,
  getParadiseSecretKey,
  montarDescricaoPedido,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/criar-pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as any;

          const {
            valorTotal,
            nome,
            whatsapp,
            cep,
            products,
            trackingParameters = {},
          } = body;

          if (!valorTotal || !nome || !whatsapp) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Dados do pedido incompletos.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const cepLimpo = cep ? String(cep).replace(/\D/g, "") : "";
          if (cepLimpo.length === 8) {
            try {
              await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            } catch {
              /* noop */
            }
          }

          const valorEmCentavos = Math.round(parseFloat(valorTotal) * 100);
          const referenceId = `RUSHI-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;
          const emailCliente = gerarEmailRandomico();
          const telefoneLimpo = String(whatsapp).replace(/\D/g, "");
          const descricaoPedido = montarDescricaoPedido(products);

          const origin =
            request.headers.get("origin") ||
            (() => {
              try {
                return new URL(request.url).origin;
              } catch {
                return "https://rushisushi.delivery";
              }
            })();
          const postbackUrl = `${origin}/webhook-paradise`;

          const payloadParadise = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            reference: referenceId,
            source: "api_externa",
            postback_url: postbackUrl,
            customer: {
              name: nome,
              email: emailCliente,
              phone: telefoneLimpo,
              document: "73793362906",
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

          const paradiseRes = await fetch(
            `${PARADISE_API_URL}/api/v1/transaction.php`,
            {
              method: "POST",
              headers: {
                "X-API-Key": getParadiseSecretKey(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadParadise),
            }
          );

          const apiData: any = await paradiseRes.json();

          if (!paradiseRes.ok || apiData?.status === "error") {
            console.error("Resposta Paradise erro:", apiData);
            throw new Error(
              `Paradise HTTP ${paradiseRes.status}: ${JSON.stringify(apiData)}`
            );
          }

          const transactionId = apiData?.transaction_id;
          const pixCopiaECola = apiData?.qr_code;
          const qrCodeBase64 = apiData?.qr_code_base64;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta Paradise inesperada:", apiData);
            throw new Error("Resposta da Paradise incompleta.");
          }

          const qrCodeFinal =
            qrCodeBase64 ||
            `https://quickchart.io/qr?text=${encodeURIComponent(
              pixCopiaECola
            )}&size=300&ecLevel=L&margin=1`;

          const produtosUtmify = Array.isArray(products)
            ? products.map((p: any, idx: number) => ({
                id: p.id || `RUSHI-SKU-${idx + 1}`,
                name: p.name || "Produto",
                planId: null,
                planName: null,
                quantity: p.quantity || 1,
                priceInCents: Math.round(parseFloat(p.price) * 100),
              }))
            : [];

          const payloadUtmify = {
            orderId: String(transactionId),
            platform: "rushi-paradise",
            paymentMethod: "pix",
            status: "pending",
            createdAt: nowUtcSqlString(),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: nome,
              email: emailCliente,
              phone: telefoneLimpo,
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
              fbclid: trackingParameters.fbclid || null,
              gclid: trackingParameters.gclid || null,
              ttclid: trackingParameters.ttclid || null,
              xcod: trackingParameters.xcod || null,
            },
            commission: {
              totalPriceInCents: valorEmCentavos,
              gatewayFeeInCents: 1,
              userCommissionInCents: valorEmCentavos - 1,
              currency: "BRL",
            },
            isTest: false,
          };

          enviarPedidoParaUtmify(payloadUtmify);
          pendingOrders[String(transactionId)] = payloadUtmify;

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
          console.error("Erro criar-pix Paradise:", error?.message ?? error);
          return new Response(
            JSON.stringify({
              success: false,
              message: "Erro ao gerar PIX.",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

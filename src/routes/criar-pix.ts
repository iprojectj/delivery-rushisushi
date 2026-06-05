import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  enviarPedidoParaUtmify,
  gerarEmailRandomico,
  getParadiseKey,
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
            // ViaCEP é opcional, apenas para validação leve
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

          // Payload Paradise — usa source=api_externa (dispensa productHash)
          // e description com o nome real do(s) produto(s) comprado(s).
          const payloadParadise = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            reference: referenceId,
            source: "api_externa",
            customer: {
              name: nome,
              email: emailCliente,
              document: "73793362906",
              phone: telefoneLimpo,
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

          const transactionId = apiData.transaction_id;
          const pixCopiaECola = apiData.qr_code;
          let qrCodeFinal = apiData.qr_code_base64;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta Paradise inesperada:", apiData);
            throw new Error("Resposta da Paradise incompleta.");
          }

          if (!qrCodeFinal || !String(qrCodeFinal).startsWith("data:image")) {
            qrCodeFinal = `https://quickchart.io/qr?text=${encodeURIComponent(
              pixCopiaECola
            )}&size=300&ecLevel=L&margin=1`;
          }

          // Produtos para Utmify com nomes reais do carrinho
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

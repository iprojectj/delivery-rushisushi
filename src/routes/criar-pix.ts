import { createFileRoute } from "@tanstack/react-router";
import {
  FLEVOPAY_API_URL,
  enviarPedidoParaUtmify,
  gerarEmailRandomico,
  getFlevoAuthHeader,
  montarDescricaoPedido,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/flevopay.server";

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

          // Itens para FlevoPay (unit_price em centavos)
          const itensFlevo = Array.isArray(products) && products.length > 0
            ? products.map((p: any, idx: number) => ({
                title: (p.name || "Item").substring(0, 120),
                unit_price: Math.round(parseFloat(p.price) * 100),
                quantity: p.quantity || 1,
                tangible: true,
                external_ref: p.id || `RUSHI-SKU-${idx + 1}`,
              }))
            : [
                {
                  title: descricaoPedido,
                  unit_price: valorEmCentavos,
                  quantity: 1,
                  tangible: true,
                  external_ref: referenceId,
                },
              ];

          // postback_url baseada na origem da requisição
          const origin =
            request.headers.get("origin") ||
            (() => {
              try {
                return new URL(request.url).origin;
              } catch {
                return "https://rushisushi.delivery";
              }
            })();
          const postbackUrl = `${origin}/webhook-flevopay`;

          const payloadFlevo = {
            amount: valorEmCentavos,
            payment_method: "pix",
            postback_url: postbackUrl,
            customer: {
              name: nome,
              email: emailCliente,
              document: {
                number: "73793362906",
                type: "cpf",
              },
              phone: telefoneLimpo,
              external_ref: referenceId,
            },
            items: itensFlevo,
            pix: { expires_in_days: 1 },
            metadata: {
              reference: referenceId,
              provider_name: "Rushi Sushi",
              utm_source: trackingParameters.utm_source || "",
              utm_medium: trackingParameters.utm_medium || "",
              utm_campaign: trackingParameters.utm_campaign || "",
              utm_content: trackingParameters.utm_content || "",
              utm_term: trackingParameters.utm_term || "",
              src: trackingParameters.src || "",
              sck: trackingParameters.sck || "",
            },
            ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
            traceable: true,
          };

          const flevoRes = await fetch(
            `${FLEVOPAY_API_URL}/v1/payment-transaction/create`,
            {
              method: "POST",
              headers: {
                Authorization: getFlevoAuthHeader(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payloadFlevo),
            }
          );

          const apiData: any = await flevoRes.json();

          if (!flevoRes.ok) {
            console.error("Resposta FlevoPay erro:", apiData);
            throw new Error(
              `FlevoPay HTTP ${flevoRes.status}: ${JSON.stringify(apiData)}`
            );
          }

          // FlevoPay pode retornar { data: [...] } ou objeto direto.
          const tx = Array.isArray(apiData?.data)
            ? apiData.data[0]
            : apiData?.data || apiData;

          const transactionId = tx?.id;
          const pixObj = Array.isArray(tx?.pix) ? tx.pix[0] : tx?.pix;
          const pixCopiaECola = pixObj?.qr_code;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta FlevoPay inesperada:", apiData);
            throw new Error("Resposta da FlevoPay incompleta.");
          }

          // FlevoPay envia apenas o texto do PIX; geramos a imagem do QR
          const qrCodeFinal = `https://quickchart.io/qr?text=${encodeURIComponent(
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
            platform: "rushi-flevopay",
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
          console.error("Erro criar-pix FlevoPay:", error?.message ?? error);
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

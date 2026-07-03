import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  enviarPedidoParaUtmify,
  gerarEmailRandomico,
  getParadiseAccountId,
  getParadiseProductHash,
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
            rua,
            numero,
            bairro,
            complemento,
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

          const secretKey = getParadiseSecretKey();
          const accountId = getParadiseAccountId();
          const productHash = getParadiseProductHash();
          if (!secretKey) {
            throw new Error("Chave secreta Paradise não configurada.");
          }

          const valorNumerico = Number.parseFloat(
            String(valorTotal).replace(",", ".")
          );
          const valorEmCentavos = Math.round(valorNumerico * 100);
          if (!Number.isFinite(valorEmCentavos) || valorEmCentavos < 100) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Valor do pedido inválido.",
              }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const referenceId = `RUSHI-${Date.now()}-${Math.floor(
            Math.random() * 1000
          )}`;
          const emailCliente = gerarEmailRandomico();
          const cpfCliente = "02152976959";
          const telefoneLimpo = String(whatsapp).replace(/\D/g, "");
          const cepLimpo = cep ? String(cep).replace(/\D/g, "") : "";
          const descricaoPedido = montarDescricaoPedido(products);

          const rawOrigin =
            request.headers.get("origin") ||
            (() => {
              try {
                return new URL(request.url).origin;
              } catch {
                return "https://rushisushi.delivery";
              }
            })();
          const origin = rawOrigin.includes("localhost")
            ? "https://rushisushi.delivery"
            : rawOrigin;
          const postbackUrl = `${origin}/webhook-paradise`;

          const enderecoStr = [rua, numero, complemento, bairro]
            .map((item) => String(item || "").trim())
            .filter(Boolean)
            .join(", ");

          const payloadParadise: any = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            reference: referenceId,
            source: "api_externa",
            postback_url: postbackUrl,
            customer: {
              name: String(nome).trim(),
              email: emailCliente,
              document: cpfCliente,
              phone: telefoneLimpo,
              address: enderecoStr || undefined,
              zip_code: cepLimpo.length === 8 ? cepLimpo : undefined,
            },
            tracking: {
              utm_source: trackingParameters.utm_source || undefined,
              utm_medium: trackingParameters.utm_medium || undefined,
              utm_campaign: trackingParameters.utm_campaign || undefined,
              utm_content: trackingParameters.utm_content || undefined,
              utm_term: trackingParameters.utm_term || undefined,
              src: trackingParameters.src || undefined,
              sck: trackingParameters.sck || undefined,
            },
          };

          if (productHash) payloadParadise.productHash = productHash;
          if (accountId) payloadParadise.account_id = accountId;

          const payloadLimpo = JSON.parse(JSON.stringify(payloadParadise));

          const paradiseRes = await fetch(
            `${PARADISE_API_URL}/api/v1/transaction.php`,
            {
              method: "POST",
              headers: {
                "X-API-Key": secretKey,
                "Content-Type": "application/json",
                Origin: origin,
                Referer: `${origin}/`,
              },
              body: JSON.stringify(payloadLimpo),
            }
          );

          const apiData: any = await paradiseRes.json().catch(() => ({}));

          if (!paradiseRes.ok) {
            console.error(
              "Resposta Paradise erro:",
              paradiseRes.status,
              apiData
            );
            throw new Error(
              `Paradise HTTP ${paradiseRes.status}: ${JSON.stringify(apiData)}`
            );
          }

          const respostaNormalizada = apiData?.data ?? apiData;
          const transactionId =
            respostaNormalizada?.id ||
            respostaNormalizada?.idTransaction ||
            respostaNormalizada?.transaction_id ||
            respostaNormalizada?.hash;
          const pixCopiaECola =
            respostaNormalizada?.pix?.pix_qr_code ||
            respostaNormalizada?.pix_copy_paste ||
            respostaNormalizada?.qrcode ||
            respostaNormalizada?.qr_code ||
            respostaNormalizada?.pix_code;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta Paradise inesperada:", apiData);
            throw new Error("Resposta da Paradise incompleta.");
          }

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
              document: cpfCliente,
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

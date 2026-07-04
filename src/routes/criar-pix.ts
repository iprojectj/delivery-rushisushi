import { createFileRoute } from "@tanstack/react-router";
import {
  INVICTUS_API_URL,
  enviarPedidoParaUtmify,
  gerarCpfValido,
  gerarEmailRandomico,
  getInvictusOfferHash,
  getInvictusProductHash,
  getInvictusToken,
  montarDescricaoPedido,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/invictus.server";

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

          const apiToken = getInvictusToken();
          const offerHash = getInvictusOfferHash();
          const productHash = getInvictusProductHash();
          if (!apiToken || !offerHash || !productHash) {
            throw new Error("Credenciais InvictusPay não configuradas.");
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
          const postbackUrl = `${origin}/api/public/invictus-webhook`;

          const enderecoStr = [rua, numero, complemento, bairro]
            .map((item) => String(item || "").trim())
            .filter(Boolean)
            .join(", ");

          const payloadInvictus: any = {
            offer_hash: offerHash,
            amount: valorEmCentavos,
            payment_method: "pix",
            installments: 1,
            postback_url: postbackUrl,
            customer: {
              name: String(nome).trim(),
              email: emailCliente,
              document: cpfCliente,
              document_type: "cpf",
              phone_number: telefoneLimpo,
              street_name: enderecoStr || undefined,
              zip_code: cepLimpo.length === 8 ? cepLimpo : undefined,
            },
            cart: [
              {
                product_hash: productHash,
                title: descricaoPedido,
                price: valorEmCentavos,
                quantity: 1,
                operation_type: 1,
                tangible: false,
              },
            ],
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

          const payloadLimpo = JSON.parse(JSON.stringify(payloadInvictus));

          const invictusRes = await fetch(
            `${INVICTUS_API_URL}/transactions?api_token=${encodeURIComponent(
              apiToken
            )}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify(payloadLimpo),
            }
          );

          const apiData: any = await invictusRes.json().catch(() => ({}));

          if (!invictusRes.ok || apiData?.success === false) {
            console.error(
              "Resposta InvictusPay erro:",
              invictusRes.status,
              apiData
            );
            throw new Error(
              `Invictus HTTP ${invictusRes.status}: ${JSON.stringify(apiData)}`
            );
          }

          const transactionId = apiData?.hash || apiData?.id;
          const pixCopiaECola =
            apiData?.pix?.pix_qr_code ||
            apiData?.pix?.pix_url ||
            apiData?.pix_code;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta InvictusPay inesperada:", apiData);
            throw new Error("Resposta da InvictusPay incompleta.");
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
            platform: "rushi-invictus",
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
          console.error("Erro criar-pix Invictus:", error?.message ?? error);
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

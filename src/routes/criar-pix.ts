import { createFileRoute } from "@tanstack/react-router";
import {
  VENOPAY_API_URL,
  enviarPedidoParaUtmify,
  gerarCpfValido,
  gerarEmailRandomico,
  getVenopayApiKey,
  montarDescricaoPedido,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/venopay.server";

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

          const apiKey = getVenopayApiKey();
          if (!apiKey) {
            throw new Error("VENOPAY_API_KEY não configurada.");
          }

          const valorNumerico = Number.parseFloat(String(valorTotal).replace(",", "."));
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
          const cpfCliente = gerarCpfValido();
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
          const callbackUrl = `${origin}/webhook-venopay`;

          const endereco = [rua, numero, complemento, bairro]
            .map((item) => String(item || "").trim())
            .filter(Boolean)
            .join(", ");
          const payerBase: Record<string, string> = {
            name: String(nome).trim(),
            email: emailCliente,
          };
          if (telefoneLimpo) payerBase.phone = telefoneLimpo;
          if (endereco) payerBase.address = endereco;
          if (cepLimpo.length === 8) payerBase.zip_code = cepLimpo;

          const payloadPix: any = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            external_id: referenceId,
            callback_url: callbackUrl,
            payer: payerBase,
            utm_source: trackingParameters.utm_source || undefined,
            utm_medium: trackingParameters.utm_medium || undefined,
            utm_campaign: trackingParameters.utm_campaign || undefined,
            utm_content: trackingParameters.utm_content || undefined,
            utm_term: trackingParameters.utm_term || undefined,
            src: trackingParameters.src || undefined,
            sck: trackingParameters.sck || undefined,
          };

          const payloadsParaTentar = [
            { endpoint: "/api/v1/pix", payload: payloadPix },
            {
              endpoint: "/api/v1/pix",
              payload: { ...payloadPix, payer: { ...payerBase, document: cpfCliente } },
            },
            { endpoint: "/api/v1/pix", payload: { ...payloadPix, payer: undefined } },
          ];

          let apiData: any = null;
          let ultimoErro: any = null;

          for (const tentativa of payloadsParaTentar) {
            const payloadLimpo = JSON.parse(JSON.stringify(tentativa.payload));
            const venoRes = await fetch(`${VENOPAY_API_URL}${tentativa.endpoint}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Origin: origin,
                Referer: `${origin}/`,
              },
              body: JSON.stringify(payloadLimpo),
            });

            const resposta: any = await venoRes.json().catch(() => ({}));

            if (venoRes.ok) {
              apiData = resposta;
              break;
            }

            ultimoErro = { endpoint: tentativa.endpoint, status: venoRes.status, body: resposta };
            console.error("Resposta VenoPay erro:", tentativa.endpoint, venoRes.status, resposta);
          }

          if (!apiData) {
            throw new Error(`VenoPay ${ultimoErro?.endpoint} HTTP ${ultimoErro?.status}: ${JSON.stringify(ultimoErro?.body)}`);
          }

          const respostaNormalizada = apiData?.data ?? apiData;
          const transactionId =
            respostaNormalizada?.id || respostaNormalizada?.idTransaction;
          const pixCopiaECola =
            respostaNormalizada?.pix_copy_paste ||
            respostaNormalizada?.qrcode ||
            respostaNormalizada?.qr_code ||
            respostaNormalizada?.qr_code_image;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta VenoPay inesperada:", apiData);
            throw new Error("Resposta da VenoPay incompleta.");
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
            platform: "rushi-venopay",
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
          console.error("Erro criar-pix VenoPay:", error?.message ?? error);
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

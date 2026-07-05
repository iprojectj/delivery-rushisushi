import { createFileRoute } from "@tanstack/react-router";
import {
  NEXUSPAG_API_URL,
  enviarPedidoParaUtmify,
  gerarCpfValido,
  gerarEmailRandomico,
  getNexuspagApiKey,
  montarDescricaoPedido,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/nexuspag.server";

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

          const apiKey = getNexuspagApiKey();
          if (!apiKey) {
            throw new Error("Credencial NexusPag não configurada.");
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
          const valorEmReais = Number((valorEmCentavos / 100).toFixed(2));

          const emailCliente = gerarEmailRandomico();
          const cpfCliente = gerarCpfValido();
          const telefoneLimpo = String(whatsapp).replace(/\D/g, "");
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
          const webhookUrl = `${origin}/api/public/nexuspag-webhook`;

          const externalId = `rushi-${Date.now()}-${Math.floor(
            Math.random() * 999999
          )}`;

          const payloadNexus = {
            amount: valorEmReais,
            description: descricaoPedido,
            external_id: externalId,
            webhook_url: webhookUrl,
            expiration: 1800,
          };

          const nexusRes = await fetch(`${NEXUSPAG_API_URL}/api/pix/create`, {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(payloadNexus),
          });

          const apiData: any = await nexusRes.json().catch(() => ({}));

          if (!nexusRes.ok || apiData?.success === false) {
            console.error("Resposta NexusPag erro:", nexusRes.status, apiData);
            throw new Error(
              `NexusPag HTTP ${nexusRes.status}: ${JSON.stringify(apiData)}`
            );
          }

          const tx = apiData?.transaction ?? apiData;
          const transactionId = tx?.id;
          const pixCopiaECola = tx?.pix_copia_cola;
          const qrCodeBase64 = tx?.qr_code_base64;

          if (!transactionId || !pixCopiaECola) {
            console.error("Resposta NexusPag inesperada:", apiData);
            throw new Error("Resposta da NexusPag incompleta.");
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
            platform: "rushi-nexuspag",
            paymentMethod: "pix",
            status: "waiting_payment",
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

          pendingOrders[String(transactionId)] = payloadUtmify;
          // Também indexa por external_id para casar webhook que use external_id
          pendingOrders[externalId] = payloadUtmify;
          await enviarPedidoParaUtmify(payloadUtmify);

          // Registra o lead + submissão de checkout no admin
          try {
            const { supabaseAdmin } = await import(
              "@/integrations/supabase/client.server"
            );
            const whatsappDigits = telefoneLimpo || null;
            let leadId: string | null = null;
            if (whatsappDigits) {
              const { data: existing } = await supabaseAdmin
                .from("leads")
                .select("id, nome, email")
                .eq("whatsapp", whatsappDigits)
                .maybeSingle();
              if (existing) {
                leadId = existing.id;
                await supabaseAdmin
                  .from("leads")
                  .update({
                    last_seen_at: new Date().toISOString(),
                    nome: nome ?? existing.nome,
                    email: emailCliente ?? existing.email,
                  })
                  .eq("id", leadId);
              } else {
                const { data: inserted } = await supabaseAdmin
                  .from("leads")
                  .insert({ whatsapp: whatsappDigits, nome, email: emailCliente })
                  .select("id")
                  .single();
                leadId = inserted?.id ?? null;
              }
            }
            await supabaseAdmin.from("lead_submissions").insert({
              lead_id: leadId,
              form_type: "checkout",
              order_id: String(transactionId),
              nome,
              whatsapp: whatsappDigits,
              email: emailCliente,
              fields: {
                products,
                valorTotal: valorEmReais,
                trackingParameters,
                external_id: externalId,
                ...(body?.endereco ?? {}),
              },
              page_url:
                request.headers.get("referer") ??
                request.headers.get("origin") ??
                null,
              user_agent: request.headers.get("user-agent"),
              ip: request.headers.get("x-forwarded-for"),
            });
          } catch (err: any) {
            console.error("Falha ao registrar lead no admin:", err?.message ?? err);
          }


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
          console.error("Erro criar-pix NexusPag:", error?.message ?? error);
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

import { createFileRoute } from "@tanstack/react-router";
import {
  VENOPAY_API_BASE_URL,
  enviarPedidoParaUtmify,
  gerarCpfValido,
  gerarEmailRandomico,
  getVenopayAuth,
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
          const { valorTotal, nome, whatsapp, products, trackingParameters = {} } = body;

          const auth = getVenopayAuth();
          const valorNumerico = Number.parseFloat(String(valorTotal).replace(",", "."));
          const valorEmCentavos = Math.round(valorNumerico * 100);

          const emailCliente = gerarEmailRandomico();
          const cpfCliente = gerarCpfValido();
          const telefoneLimpo = String(whatsapp).replace(/\D/g, "");
          const descricaoPedido = montarDescricaoPedido(products);

          // Products: soma de price*quantity DEVE ser igual a amount (em centavos)
          const productsArr = Array.isArray(products) && products.length > 0
            ? products.map((p: any, i: number) => ({
                external_ref: p.id || `sku-${i + 1}`,
                name: String(p.name || "Item"),
                price: Math.round(Number(p.price) * 100),
                quantity: Math.max(1, Number(p.quantity) || 1),
              }))
            : [];

          const somaProducts = productsArr.reduce((s, p) => s + p.price * p.quantity, 0);
          // Se não bater com o total, colapsa em um único item para garantir consistência
          const productsFinal = somaProducts === valorEmCentavos && productsArr.length > 0
            ? productsArr
            : [{
                external_ref: "rushi-combo",
                name: descricaoPedido.slice(0, 100),
                price: valorEmCentavos,
                quantity: 1,
              }];

          const payloadVeno: any = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            external_id: `rushi-${Date.now()}`,
            callback_url: `${new URL(request.url).origin}/api/public/venopay-webhook`,
            payer: {
              name: nome,
              email: emailCliente,
              document: cpfCliente,
              phone: telefoneLimpo,
            },
            products: productsFinal,
          };

          // UTM tracking (opcional, top-level conforme docs)
          const utmKeys = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src", "sck"] as const;
          for (const k of utmKeys) {
            if (trackingParameters?.[k]) payloadVeno[k] = String(trackingParameters[k]);
          }

          const venoRes = await fetch(`${VENOPAY_API_BASE_URL}/pix`, {
            method: "POST",
            headers: {
              Authorization: auth,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadVeno),
          });

          const rawText = await venoRes.text();
          let apiData: any = {};
          try { apiData = JSON.parse(rawText); } catch { apiData = { raw: rawText }; }

          if (!venoRes.ok) {
            console.error("[VENOPAY] Erro criar PIX:", venoRes.status, rawText);
            throw new Error(`VenoPay ${venoRes.status}: ${rawText || "sem corpo"}`);
          }

          const transactionId = apiData.id || apiData.txid;
          const pixCopiaECola = apiData.pix_copy_paste || apiData.qr_code_image || apiData.qr_code || "";
          const qrCodeFinal = pixCopiaECola
            ? `https://quickchart.io/qr?text=${encodeURIComponent(pixCopiaECola)}&size=300`
            : "";

          const payloadUtmify = {
            orderId: String(transactionId),
            platform: "RushiSushi",
            paymentMethod: "pix" as const,
            status: "waiting_payment" as const,
            createdAt: nowUtcSqlString(),
            approvedDate: null,
            refundedAt: null,
            customer: {
              name: nome,
              email: emailCliente,
              phone: telefoneLimpo,
              document: cpfCliente,
              ip: request.headers.get("cf-connecting-ip") || "127.0.0.1",
            },
            products: Array.isArray(products) ? products.map((p: any) => ({
              id: p.id || "SKU",
              name: p.name,
              planId: null,
              planName: null,
              quantity: p.quantity || 1,
              priceInCents: Math.round(p.price * 100),
            })) : [],
            trackingParameters,
            commission: {
              totalPriceInCents: valorEmCentavos,
              gatewayFeeInCents: 0,
              userCommissionInCents: valorEmCentavos,
            },
          };

          pendingOrders[String(transactionId)] = payloadUtmify;

          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("lead_submissions").insert({
              form_type: "checkout",
              order_id: String(transactionId),
              nome,
              whatsapp: telefoneLimpo,
              email: emailCliente,
              fields: { products, valorTotal: valorNumerico, utmify_payload: payloadUtmify },
            });
          } catch (e) { console.error("Supabase Error:", e); }

          await enviarPedidoParaUtmify(payloadUtmify);

          return new Response(JSON.stringify({
            success: true,
            qrCodeData: qrCodeFinal,
            pixCopiaECola,
            transactionId,
          }), { headers: { "Content-Type": "application/json" } });

        } catch (error: any) {
          console.error("[criar-pix] fatal:", error);
          return new Response(JSON.stringify({ success: false, message: error?.message || String(error) }), { status: 500 });
        }
      },
    },
  },
});

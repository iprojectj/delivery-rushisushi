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

          const payloadVeno = {
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
            ...trackingParameters
          };

          const venoRes = await fetch(`${VENOPAY_API_BASE_URL}/pix`, {
            method: "POST",
            headers: {
              "Authorization": auth,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payloadVeno),
          });

          const apiData: any = await venoRes.json().catch(() => ({}));
          
          if (!venoRes.ok) {
            throw new Error(`VenoPay Error: ${JSON.stringify(apiData)}`);
          }

          const transactionId = apiData.idTransaction || apiData.id;
          const pixCopiaECola = apiData.qrcode || apiData.pix_code;
          const qrCodeFinal = apiData.qr_code_image_url || `https://quickchart.io/qr?text=${encodeURIComponent(pixCopiaECola)}&size=300`;

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

          // Registrar no Supabase (Lead)
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
          return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
        }
      },
    },
  },
});

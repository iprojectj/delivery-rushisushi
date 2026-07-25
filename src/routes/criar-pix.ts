import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_BASE_URL,
  enviarPedidoParaUtmify,
  gerarCpfValido,
  gerarEmailRandomico,
  getParadiseHeaders,
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
          const { valorTotal, nome, whatsapp, products, trackingParameters = {} } = body;

          const valorNumerico = Number.parseFloat(String(valorTotal).replace(",", "."));
          const valorEmCentavos = Math.max(100, Math.round(valorNumerico * 100));

          const emailCliente = gerarEmailRandomico();
          const cpfCliente = gerarCpfValido();
          const telefoneLimpo = String(whatsapp).replace(/\D/g, "");
          const descricaoPedido = montarDescricaoPedido(products);

          const reference = `rushi-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

          const payloadParadise: any = {
            amount: valorEmCentavos,
            description: descricaoPedido,
            reference: reference,
            productHash: "prod_d9f9e0dcba8c763c",
            offer_link: "https://rushisushi.delivery",
            customer: {
              name: nome,
              email: emailCliente,
              phone: telefoneLimpo,
              document: cpfCliente,
            },
          };

          // Adicionar tracking se houver
          if (trackingParameters && typeof trackingParameters === "object") {
            const utmKeys = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src", "sck"] as const;
            const tracking: any = {};
            let hasTracking = false;
            for (const k of utmKeys) {
              if (trackingParameters[k]) {
                tracking[k] = String(trackingParameters[k]);
                hasTracking = true;
              }
            }
            if (hasTracking) {
              payloadParadise.tracking = tracking;
            }
          }

          console.log("[PARADISE] Enviando payload:", JSON.stringify(payloadParadise));
          const response = await fetch(`${PARADISE_API_BASE_URL}/transaction.php`, {
            method: "POST",
            headers: getParadiseHeaders(),
            body: JSON.stringify(payloadParadise),
          });

          const rawText = await response.text();
          let apiData: any = {};
          try { apiData = JSON.parse(rawText); } catch { apiData = { raw: rawText }; }

          if (!response.ok || apiData.status !== "success") {
            console.error("[PARADISE] Erro criar PIX:", response.status, rawText);
            throw new Error(`Paradise ${response.status}: ${apiData.message || rawText || "Erro desconhecido"}`);
          }

          const transactionId = apiData.transaction_id || apiData.id;
          const pixCopiaECola = apiData.qr_code || "";
          const qrCodeFinal = apiData.qr_code_base64 || (pixCopiaECola 
            ? `https://quickchart.io/qr?text=${encodeURIComponent(pixCopiaECola)}&size=300` 
            : "");

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
              fields: { products, valorTotal: valorNumerico, utmify_payload: payloadUtmify, gateway: "paradise" },
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
          const errorMessage = error?.message || String(error);
          return new Response(JSON.stringify({ 
            success: false, 
            message: errorMessage.includes("Paradise") ? errorMessage : `Erro interno: ${errorMessage}` 
          }), { 
            status: 200,
            headers: { "Content-Type": "application/json" } 
          });
        }
      },
    },
  },
});
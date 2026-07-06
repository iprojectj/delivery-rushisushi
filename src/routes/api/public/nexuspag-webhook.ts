import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import {
  enviarPedidoParaUtmify,
  getNexuspagWebhookSecret,
  normalizeNexuspagStatus,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/nexuspag.server";

function verificarAssinatura(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!secret) return true; // sem secret configurado, aceita
  if (!signatureHeader) return false;
  // Formato: t=<unix>,v1=<hmac_hex>
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k.trim(), (v || "").trim()];
    })
  );
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const expected = createHmac("sha256", secret)
    .update(`${t}.${rawBody}`)
    .digest("hex");
  try {
    const a = Buffer.from(v1, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/nexuspag-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const secret = getNexuspagWebhookSecret();
          const signature = request.headers.get("x-nexuspag-signature");

          if (!verificarAssinatura(rawBody, signature, secret)) {
            console.warn("[NEXUSPAG] Assinatura de webhook inválida.");
            return new Response("invalid signature", { status: 401 });
          }

          const evento: any = JSON.parse(rawBody || "{}");
          console.log(
            "🔔 Webhook NexusPag:",
            JSON.stringify(evento, null, 2)
          );

          const transactionId = String(
            evento?.transaction_id ?? evento?.id ?? ""
          );
          const externalId = String(evento?.external_id ?? "");
          const rawStatus = String(evento?.status ?? "");
          const eventName = String(evento?.event ?? "");

          if (!transactionId && !externalId) {
            return new Response("ok", { status: 200 });
          }

          const finalStatus =
            eventName === "payment.confirmed"
              ? "paid"
              : normalizeNexuspagStatus(rawStatus);

          // Recupera payload UTMify — memória (mesmo isolate) OU Supabase (fallback
          // obrigatório em Cloudflare Workers, pois o webhook geralmente cai em
          // outro isolate e o Record em memória está vazio).
          let pedidoPendente: any =
            pendingOrders[transactionId] ||
            (externalId ? pendingOrders[externalId] : undefined);

          if (!pedidoPendente) {
            try {
              const { supabaseAdmin } = await import(
                "@/integrations/supabase/client.server"
              );
              const lookupId = transactionId || externalId;
              const { data: sub } = await supabaseAdmin
                .from("lead_submissions")
                .select("fields")
                .eq("order_id", lookupId)
                .eq("form_type", "checkout")
                .maybeSingle();
              const saved = (sub?.fields as any)?.utmify_payload;
              if (saved) pedidoPendente = saved;
            } catch (err: any) {
              console.error(
                "[NEXUSPAG] Falha ao carregar utmify_payload do Supabase:",
                err?.message ?? err
              );
            }
          }

          if (finalStatus === "paid" && pedidoPendente) {
            pedidoPendente.status = "paid";
            pedidoPendente.approvedDate = nowUtcSqlString();
            await enviarPedidoParaUtmify(pedidoPendente);
            delete pendingOrders[transactionId];
            if (externalId) delete pendingOrders[externalId];
          }

          if (finalStatus === "paid") {
            // Registra no admin que o PIX foi efetivamente pago (para sinalizar
            // leads que tentaram cartão e mesmo assim concluíram no PIX).
            try {
              const { supabaseAdmin } = await import(
                "@/integrations/supabase/client.server"
              );
              const orderId = transactionId || externalId;
              const { data: checkoutSub } = await supabaseAdmin
                .from("lead_submissions")
                .select("lead_id, nome, whatsapp, email")
                .eq("order_id", orderId)
                .eq("form_type", "checkout")
                .maybeSingle();
              await supabaseAdmin.from("lead_submissions").insert({
                lead_id: checkoutSub?.lead_id ?? null,
                form_type: "pix_paid",
                order_id: orderId,
                nome: checkoutSub?.nome ?? null,
                whatsapp: checkoutSub?.whatsapp ?? null,
                email: checkoutSub?.email ?? null,
                fields: {
                  status: "paid",
                  approved_at: new Date().toISOString(),
                },
              });
            } catch (err: any) {
              console.error(
                "Falha ao registrar pix_paid no admin:",
                err?.message ?? err
              );
            }
          }

          if (
            (finalStatus === "refunded" || finalStatus === "failed") &&
            pedidoPendente
          ) {
            // UTMify aceita: waiting_payment | paid | refused | refunded | chargedback
            pedidoPendente.status =
              finalStatus === "failed" ? "refused" : "refunded";
            if (finalStatus === "refunded")
              pedidoPendente.refundedAt = nowUtcSqlString();
            await enviarPedidoParaUtmify(pedidoPendente);
            delete pendingOrders[transactionId];
            if (externalId) delete pendingOrders[externalId];
          } else if (!pedidoPendente) {
            console.warn(
              `[NEXUSPAG] Pedido ${transactionId}/${externalId} não encontrado (memória + Supabase).`
            );
          }


          return new Response("ok", { status: 200 });
        } catch (e: any) {
          console.error("Erro webhook NexusPag:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

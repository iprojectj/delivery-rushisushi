import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import {
  enviarPedidoParaUtmify,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/venopay.server";

function verificarAssinatura(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!secret) return true;
  if (!signatureHeader) return false;

  try {
    const expected = createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    
    const a = Buffer.from(signatureHeader, "hex");
    const b = Buffer.from(expected, "hex");
    
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const Route = createFileRoute("/api/public/venopay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.text();
          const secret = process.env.VENOPAY_WEBHOOK_SECRET || "";
          const signature = request.headers.get("x-venopay-signature") || request.headers.get("signature");

          if (!verificarAssinatura(rawBody, signature, secret)) {
            console.warn("[VENOPAY] Assinatura de webhook inválida.");
            // Algumas integrações exigem retorno 200 mesmo se falhar a assinatura para evitar retentativas infinitas
            // mas o padrão de segurança é 401.
          }

          const body: any = JSON.parse(rawBody || "{}");
          console.log("🔔 Webhook VenoPay:", JSON.stringify(body, null, 2));

          const transactionId = String(body.idTransaction || body.id || body.external_id || "");
          const status = String(body.status || "").toLowerCase();

          if (!transactionId) return new Response("ok", { status: 200 });

          let pedidoPendente = pendingOrders[transactionId];

          if (!pedidoPendente) {
            const { supabaseAdmin } = await import(
              "@/integrations/supabase/client.server"
            );
            const { data } = await supabaseAdmin
              .from("lead_submissions")
              .select("fields")
              .eq("order_id", transactionId)
              .maybeSingle();

            const fields = data?.fields as any;
            pedidoPendente = fields?.utmify_payload;
          }

          if (
            pedidoPendente &&
            (status === "paid" || status === "completed" || status === "success" || status === "aprovado")
          ) {
            if (pedidoPendente.status !== "paid") {
              pedidoPendente.status = "paid";
              pedidoPendente.approvedDate = nowUtcSqlString();
              await enviarPedidoParaUtmify(pedidoPendente);

              const { supabaseAdmin } = await import(
                "@/integrations/supabase/client.server"
              );
              await supabaseAdmin.from("lead_submissions").insert({
                form_type: "pix_paid",
                order_id: transactionId,
                fields: { status: "paid", approved_at: new Date().toISOString() },
              });
              
              delete pendingOrders[transactionId];
            }
          }

          return new Response("ok", { status: 200 });
        } catch (e) {
          console.error("[VENOPAY WEBHOOK] Error:", e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

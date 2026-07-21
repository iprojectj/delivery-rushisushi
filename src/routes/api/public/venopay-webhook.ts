import { createFileRoute } from "@tanstack/react-router";
import {
  enviarPedidoParaUtmify,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/venopay.server";

export const Route = createFileRoute("/api/public/venopay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const transactionId = String(body.idTransaction || body.id);
          const status = String(body.status).toLowerCase();

          let pedidoPendente = pendingOrders[transactionId];

          if (!pedidoPendente) {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data } = await supabaseAdmin
              .from("lead_submissions")
              .select("fields")
              .eq("order_id", transactionId)
              .maybeSingle();
            pedidoPendente = data?.fields?.utmify_payload;
          }

          if (pedidoPendente && (status === "paid" || status === "completed" || status === "success")) {
            pedidoPendente.status = "paid";
            pedidoPendente.approvedDate = nowUtcSqlString();
            await enviarPedidoParaUtmify(pedidoPendente);

            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("lead_submissions").insert({
              form_type: "pix_paid",
              order_id: transactionId,
              fields: { status: "paid", approved_at: new Date().toISOString() },
            });
          }

          return new Response("ok", { status: 200 });
        } catch (e) {
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

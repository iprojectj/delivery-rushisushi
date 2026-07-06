import { createFileRoute } from "@tanstack/react-router";
import {
  NEXUSPAG_API_URL,
  enviarPedidoParaUtmify,
  getNexuspagApiKey,
  normalizeNexuspagStatus,
  nowUtcSqlString,
} from "@/lib/nexuspag.server";

async function sincronizarPagamentoUtmify(orderId: string) {
  try {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: sub } = await supabaseAdmin
      .from("lead_submissions")
      .select("id, fields")
      .eq("order_id", orderId)
      .eq("form_type", "checkout")
      .maybeSingle();

    const fields = (sub?.fields as any) ?? null;
    const payload = fields?.utmify_payload;
    if (!sub?.id || !payload || fields?.utmify_paid_sent_at) return;

    const payloadPago = {
      ...payload,
      status: "paid" as const,
      approvedDate: payload.approvedDate ?? nowUtcSqlString(),
      refundedAt: payload.refundedAt ?? null,
    };
    const resultado = await enviarPedidoParaUtmify(payloadPago);

    if (resultado.ok) {
      await supabaseAdmin
        .from("lead_submissions")
        .update({
          fields: {
            ...fields,
            utmify_payload: payloadPago,
            utmify_paid_sent_at: new Date().toISOString(),
          },
        })
        .eq("id", sub.id);
    }
  } catch (error: any) {
    console.error(
      `[UTMIFY] Falha no fallback de status pago ${orderId}:`,
      error?.message ?? error
    );
  }
}

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const apiKey = getNexuspagApiKey();
          const url = `${NEXUSPAG_API_URL}/api/pix/${encodeURIComponent(id)}`;
          const res = await fetch(url, {
            headers: {
              "x-api-key": apiKey,
              Accept: "application/json",
            },
          });
          const data: any = await res.json().catch(() => ({}));
          const raw = String(data?.status ?? "").toLowerCase();
          const statusFinal = normalizeNexuspagStatus(raw);

          if (statusFinal === "paid") {
            await sincronizarPagamentoUtmify(id);
          }

          return new Response(JSON.stringify({ status: statusFinal }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(
            `Erro status NexusPag ID ${params.id}:`,
            error?.message ?? error
          );
          return new Response(JSON.stringify({ status: "error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { PARADISE_API_BASE_URL, getParadiseHeaders } from "@/lib/paradise.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          // Paradise documentação sugere que transaction_id pode ser usado em query.php ou transaction.php dependendo da versão
          // Mas no guia rápido fala em GET /api/v1/transaction.php?id=...
          const res = await fetch(`${PARADISE_API_BASE_URL}/query.php?action=get_transaction&id=${params.id}`, {
            headers: getParadiseHeaders(),
          });
          
          const data: any = await res.json().catch(() => ({}));
          const rawStatus = String(data.status || "").toLowerCase();

          let statusFinal = "pending";
          // Status comuns em gateways: paid, success, completed, approved
          if (["paid", "completed", "success", "approved"].includes(rawStatus)) {
            statusFinal = "paid";
          } else if (["expired", "cancelled", "refused", "failed"].includes(rawStatus)) {
            statusFinal = "failed";
          }

          return new Response(JSON.stringify({ status: statusFinal }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch {
          return new Response(JSON.stringify({ status: "error" }), { status: 500 });
        }
      },
    },
  },
});
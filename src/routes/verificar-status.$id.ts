import { createFileRoute } from "@tanstack/react-router";
import { PARADISE_API_URL, getParadiseSecretKey } from "@/lib/paradise.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const secretKey = getParadiseSecretKey();
          const url = `${PARADISE_API_URL}/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(
            id
          )}`;
          const res = await fetch(url, {
            headers: { "X-API-Key": secretKey },
          });
          const data: any = await res.json().catch(() => ({}));
          const norm = data?.data ?? data;
          const raw = String(norm?.status ?? "").toLowerCase();

          let statusFinal: string = raw;
          if (raw === "paid" || raw === "approved" || raw === "captured")
            statusFinal = "paid";
          else if (
            raw === "pending" ||
            raw === "waiting_payment" ||
            raw === "authorized"
          )
            statusFinal = "pending";
          else if (raw === "refunded" || raw === "chargeback")
            statusFinal = "refunded";
          else if (
            raw === "expired" ||
            raw === "cancelled" ||
            raw === "canceled" ||
            raw === "denied" ||
            raw === "failed"
          )
            statusFinal = "failed";

          return new Response(JSON.stringify({ status: statusFinal }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(
            `Erro status Paradise ID ${params.id}:`,
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

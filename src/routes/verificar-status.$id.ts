import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  getParadiseSecretKey,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const res = await fetch(
            `${PARADISE_API_URL}/api/v1/query.php?action=get_transaction&id=${encodeURIComponent(
              id
            )}`,
            {
              headers: { "X-API-Key": getParadiseSecretKey() },
            }
          );
          const data: any = await res.json();
          const raw = String(data?.status ?? "").toLowerCase();
          let statusFinal: string = raw;
          if (raw === "approved" || raw === "paid") statusFinal = "paid";
          else if (raw === "pending" || raw === "processing" || raw === "under_review")
            statusFinal = "pending";
          else if (raw === "refunded") statusFinal = "refunded";
          else if (raw === "failed" || raw === "chargeback")
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

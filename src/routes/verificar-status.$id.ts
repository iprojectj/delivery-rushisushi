import { createFileRoute } from "@tanstack/react-router";
import {
  PARADISE_API_URL,
  getParadiseKey,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const res = await fetch(
            `${PARADISE_API_URL}/query.php?action=get_transaction&id=${encodeURIComponent(
              id
            )}`,
            {
              headers: { "X-API-Key": getParadiseKey() },
            }
          );
          const data: any = await res.json();
          let statusFinal = data.status;
          if (statusFinal === "approved") statusFinal = "paid";
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

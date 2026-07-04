import { createFileRoute } from "@tanstack/react-router";
import {
  INVICTUS_API_URL,
  getInvictusToken,
  normalizeInvictusStatus,
} from "@/lib/invictus.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const apiToken = getInvictusToken();
          const url = `${INVICTUS_API_URL}/transactions/${encodeURIComponent(
            id
          )}?api_token=${encodeURIComponent(apiToken)}`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          const data: any = await res.json().catch(() => ({}));
          const raw = String(
            data?.payment_status ?? data?.status ?? ""
          ).toLowerCase();
          const statusFinal = normalizeInvictusStatus(raw);

          return new Response(JSON.stringify({ status: statusFinal }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(
            `Erro status Invictus ID ${params.id}:`,
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

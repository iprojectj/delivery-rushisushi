import { createFileRoute } from "@tanstack/react-router";
import {
  NEXUSPAG_API_URL,
  getNexuspagApiKey,
  normalizeNexuspagStatus,
} from "@/lib/nexuspag.server";

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

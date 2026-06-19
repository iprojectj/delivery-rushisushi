import { createFileRoute } from "@tanstack/react-router";
import {
  FLEVOPAY_API_URL,
  getFlevoAuthHeader,
} from "@/lib/flevopay.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const res = await fetch(
            `${FLEVOPAY_API_URL}/v1/payment-transaction/info/${encodeURIComponent(
              id
            )}`,
            {
              headers: { Authorization: getFlevoAuthHeader() },
            }
          );
          const data: any = await res.json();
          const raw = String(data?.status ?? data?.Status ?? "").toLowerCase();
          let statusFinal: string = raw;
          if (raw === "paid" || raw === "approved") statusFinal = "paid";
          else if (raw === "pending") statusFinal = "pending";
          else if (raw === "refunded") statusFinal = "refunded";
          else if (raw === "refused" || raw === "expired" || raw === "error")
            statusFinal = "failed";
          return new Response(JSON.stringify({ status: statusFinal }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(
            `Erro status FlevoPay ID ${params.id}:`,
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

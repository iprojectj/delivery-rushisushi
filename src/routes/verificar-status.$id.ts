import { createFileRoute } from "@tanstack/react-router";
import { VENOPAY_API_URL, getVenopayApiKey } from "@/lib/venopay.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;
          const apiKey = getVenopayApiKey();
          const headers = { Authorization: `Bearer ${apiKey}` };
          let res = await fetch(
            `${VENOPAY_API_URL}/api/v1/pix/${encodeURIComponent(id)}/status`,
            { headers }
          );
          let data: any = await res.json().catch(() => ({}));

          if (!res.ok) {
            res = await fetch(
              `${VENOPAY_API_URL}/api/v1/charges/${encodeURIComponent(id)}`,
              { headers }
            );
            data = await res.json().catch(() => ({}));
          }

          const raw = String(data?.status ?? "").toLowerCase();
          let statusFinal: string = raw;
          if (raw === "paid" || raw === "captured") statusFinal = "paid";
          else if (
            raw === "pending" ||
            raw === "authorized" ||
            raw === "disputed"
          )
            statusFinal = "pending";
          else if (raw === "refunded" || raw === "chargeback")
            statusFinal = "refunded";
          else if (
            raw === "expired" ||
            raw === "cancelled" ||
            raw === "denied"
          )
            statusFinal = "failed";
          return new Response(JSON.stringify({ status: statusFinal }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error(
            `Erro status VenoPay ID ${params.id}:`,
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

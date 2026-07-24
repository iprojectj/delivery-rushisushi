import { createFileRoute } from "@tanstack/react-router";
import { VENOPAY_API_BASE_URL, getVenopayAuth } from "@/lib/venopay.server";

export const Route = createFileRoute("/verificar-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const auth = getVenopayAuth();
          const res = await fetch(`${VENOPAY_API_BASE_URL}/pix/${params.id}`, {
            headers: { "Authorization": auth },
          });
          const data = await res.json();
          const rawStatus = String(data.status).toLowerCase();
          
          let statusFinal = "pending";
          if (rawStatus === "paid" || rawStatus === "completed" || rawStatus === "success") statusFinal = "paid";
          else if (rawStatus === "expired" || rawStatus === "cancelled") statusFinal = "failed";

          return new Response(JSON.stringify({ status: statusFinal }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ status: "error" }), { status: 500 });
        }
      },
    },
  },
});

import { createFileRoute } from "@tanstack/react-router";
import {
  enviarPedidoParaUtmify,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/venopay.server";

export const Route = createFileRoute("/webhook-venopay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const evento: any = await request.json();
          console.log(
            "🔔 Webhook VenoPay:",
            JSON.stringify(evento, null, 2)
          );

          const data = evento?.data ?? evento ?? {};
          const eventName = String(evento?.event ?? "").toLowerCase();
          const status = String(data?.status ?? "").toLowerCase();
          const transactionId = String(data?.id ?? "");

          if (!transactionId) return new Response("ok", { status: 200 });

          const pedidoPendente = pendingOrders[transactionId];

          const isPaid =
            status === "paid" ||
            status === "captured" ||
            eventName === "pix.paid" ||
            eventName === "deposit.paid";
          const isRefunded =
            status === "refunded" ||
            status === "chargeback" ||
            eventName === "pix.refunded" ||
            eventName === "deposit.refunded";
          const isFailed =
            status === "expired" ||
            status === "cancelled" ||
            status === "denied" ||
            eventName === "pix.expired" ||
            eventName === "deposit.expired" ||
            eventName === "deposit.cancelled";

          if (isPaid) {
            if (pedidoPendente) {
              pedidoPendente.status = "paid";
              pedidoPendente.approvedDate = nowUtcSqlString();
              enviarPedidoParaUtmify(pedidoPendente);
              delete pendingOrders[transactionId];
            } else {
              console.error(
                `[UTMIFY] Pedido ${transactionId} não encontrado nos pendentes.`
              );
            }
          } else if (isRefunded || isFailed) {
            if (pedidoPendente) {
              pedidoPendente.status = isRefunded ? "refunded" : "failed";
              if (isRefunded) pedidoPendente.refundedAt = nowUtcSqlString();
              enviarPedidoParaUtmify(pedidoPendente);
              delete pendingOrders[transactionId];
            }
          }

          return new Response("ok", { status: 200 });
        } catch (e: any) {
          console.error("Erro webhook VenoPay:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

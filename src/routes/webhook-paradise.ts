import { createFileRoute } from "@tanstack/react-router";
import {
  enviarPedidoParaUtmify,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/paradise.server";

export const Route = createFileRoute("/webhook-paradise")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const evento: any = await request.json();
          console.log(
            "🔔 Webhook Paradise:",
            JSON.stringify(evento, null, 2)
          );

          const data = evento?.data ?? evento ?? {};
          const eventName = String(evento?.event ?? "").toLowerCase();
          const status = String(data?.status ?? evento?.status ?? "").toLowerCase();
          const transactionId = String(
            data?.id ?? evento?.id ?? data?.transaction_id ?? ""
          );

          if (!transactionId) return new Response("ok", { status: 200 });

          const pedidoPendente = pendingOrders[transactionId];

          const isPaid =
            status === "paid" ||
            status === "approved" ||
            status === "captured" ||
            eventName.includes("paid") ||
            eventName.includes("approved");
          const isRefunded =
            status === "refunded" ||
            status === "chargeback" ||
            eventName.includes("refund");
          const isFailed =
            status === "expired" ||
            status === "cancelled" ||
            status === "canceled" ||
            status === "denied" ||
            status === "failed" ||
            eventName.includes("expired") ||
            eventName.includes("cancel") ||
            eventName.includes("fail");

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
          console.error("Erro webhook Paradise:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

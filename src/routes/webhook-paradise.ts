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
            "🔔 Webhook Paradise Recebido:",
            JSON.stringify(evento, null, 2)
          );

          const status = String(evento.status ?? "").toLowerCase();
          const transactionId = String(
            evento.transaction_id ?? evento.id ?? ""
          );

          if (!transactionId) {
            return new Response("ok", { status: 200 });
          }

          const pedidoPendente = pendingOrders[transactionId];

          if (status === "approved" || status === "paid") {
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
          } else if (
            status === "refunded" ||
            status === "failed" ||
            status === "chargeback"
          ) {
            if (pedidoPendente) {
              pedidoPendente.status =
                status === "refunded" ? "refunded" : "failed";
              if (status === "refunded") {
                pedidoPendente.refundedAt = nowUtcSqlString();
              }
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

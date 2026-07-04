import { createFileRoute } from "@tanstack/react-router";
import {
  enviarPedidoParaUtmify,
  normalizeInvictusStatus,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/invictus.server";

export const Route = createFileRoute("/api/public/nexuspag-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const evento: any = await request.json().catch(() => ({}));
          console.log(
            "🔔 Webhook InvictusPay:",
            JSON.stringify(evento, null, 2)
          );

          const transactionId = String(
            evento?.transaction_hash ??
              evento?.hash ??
              evento?.id ??
              ""
          );
          const rawStatus = String(
            evento?.status ?? evento?.payment_status ?? ""
          );

          if (!transactionId) return new Response("ok", { status: 200 });

          const finalStatus = normalizeInvictusStatus(rawStatus);
          const pedidoPendente = pendingOrders[transactionId];

          if (finalStatus === "paid") {
            if (pedidoPendente) {
              pedidoPendente.status = "paid";
              pedidoPendente.approvedDate = nowUtcSqlString();
              await enviarPedidoParaUtmify(pedidoPendente);
              delete pendingOrders[transactionId];
            } else {
              console.error(
                `[UTMIFY] Pedido ${transactionId} não encontrado nos pendentes.`
              );
            }
          } else if (finalStatus === "refunded" || finalStatus === "failed") {
            if (pedidoPendente) {
              pedidoPendente.status = finalStatus;
              if (finalStatus === "refunded")
                pedidoPendente.refundedAt = nowUtcSqlString();
              await enviarPedidoParaUtmify(pedidoPendente);
              delete pendingOrders[transactionId];
            }
          }

          return new Response("ok", { status: 200 });
        } catch (e: any) {
          console.error("Erro webhook Invictus:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

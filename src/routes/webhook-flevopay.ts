import { createFileRoute } from "@tanstack/react-router";
import {
  enviarPedidoParaUtmify,
  nowUtcSqlString,
  pendingOrders,
} from "@/lib/flevopay.server";

export const Route = createFileRoute("/webhook-flevopay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const evento: any = await request.json();
          console.log(
            "🔔 Webhook FlevoPay Recebido:",
            JSON.stringify(evento, null, 2)
          );

          const status = String(
            evento.Status ?? evento.status ?? ""
          ).toUpperCase();
          const transactionId = evento.Id ?? evento.id;

          if (status === "PAID" && transactionId) {
            console.log(`✅ Pagamento APROVADO ID: ${transactionId}`);
            const pedidoPendente = pendingOrders[transactionId];
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
          }
          return new Response("ok", { status: 200 });
        } catch (e: any) {
          console.error("Erro webhook FlevoPay:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

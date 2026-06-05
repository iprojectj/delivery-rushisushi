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

          const status = evento.status;
          const transactionId = evento.transaction_id;

          if (status === "approved") {
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
          console.error("Erro webhook Paradise:", e?.message ?? e);
          return new Response("error", { status: 500 });
        }
      },
    },
  },
});

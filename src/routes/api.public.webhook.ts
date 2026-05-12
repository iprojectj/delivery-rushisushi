import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const payload = await request.json();
        console.log("🔔 Webhook Paradise Recebido:", JSON.stringify(payload, null, 2));

        const { status, transaction_id } = payload;

        if (status === "approved") {
          console.log(`✅ Pagamento APROVADO ID: ${transaction_id}`);
          // Here we would update the order in a database if we had one.
          // For now we just log it.
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});

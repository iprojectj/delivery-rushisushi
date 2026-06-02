// Shared Paradise/Utmify config and in-memory order store.
// NOTE: pendingOrders lives only in this Worker isolate's memory.
// It is good enough for the short window between PIX creation and webhook,
// but is NOT a durable store. If durability is needed later, swap to KV/DB.

export const PARADISE_API_URL = "https://multi.paradisepags.com/api/v1";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

export function getParadiseKey() {
  return (
    process.env.PARADISE_SECRET_KEY ||
    "sk_786bdaeb9a5c572a3e54b82a51b6462eb637f216822e12c11bcdf3c24dc066ce"
  );
}

export function getParadiseProductHash() {
  return process.env.PARADISE_PRODUCT_HASH || "prod_951a6a3476f8e39e";
}

export function getUtmifyToken() {
  return (
    process.env.UTMIFY_API_TOKEN || "ngrNdnLvTqawutDZesHf6ZcIAh5LTq4rYRAY"
  );
}

// Module-level in-memory store
export const pendingOrders: Record<string, any> = {};

export async function enviarPedidoParaUtmify(payload: any) {
  const token = getUtmifyToken();
  if (!token) {
    console.warn("[UTMIFY] Envio ignorado. Token não configurado.");
    return;
  }
  try {
    console.log(
      `[UTMIFY] Enviando pedido ${payload.orderId} com status [${payload.status}]...`
    );
    const res = await fetch(UTMIFY_API_URL, {
      method: "POST",
      headers: {
        "x-api-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[UTMIFY] ERRO ${res.status} ao enviar ${payload.orderId}:`,
        text
      );
    } else {
      console.log(`[UTMIFY] Pedido ${payload.orderId} enviado com sucesso.`);
    }
  } catch (error: any) {
    console.error(
      `[UTMIFY] ERRO ao enviar pedido ${payload.orderId}:`,
      error?.message ?? error
    );
  }
}

export function nowUtcSqlString() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

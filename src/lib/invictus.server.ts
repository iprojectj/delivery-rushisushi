// InvictusPay Gateway helpers. Docs: https://docs.invictuspay.app.br/
// Base URL: https://api.invictuspay.app.br/api/public/v1
// Auth: ?api_token=... (query string). Values in cents.

export const INVICTUS_API_URL =
  "https://api.invictuspay.app.br/api/public/v1";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

export function getInvictusToken() {
  return process.env.INVICTUS_API_TOKEN || "";
}

export function getInvictusOfferHash() {
  return process.env.INVICTUS_OFFER_HASH || "";
}

export function getInvictusProductHash() {
  return process.env.INVICTUS_PRODUCT_HASH || "";
}

export function getUtmifyToken() {
  return (
    process.env.UTMIFY_API_TOKEN || "uPiTze9M8IsOlMxtyqabrMvaXyOEUIqwVKrV"
  );
}

// In-memory store (volátil) para casar webhook -> pedido pendente
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
      console.log(`[UTMIFY] Pedido ${payload.orderId} enviado.`);
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

export function gerarEmailRandomico(prefixo = "cliente") {
  return `${prefixo}.${Date.now()}.${Math.floor(
    Math.random() * 9999
  )}@rushisushi.site`;
}

export function montarDescricaoPedido(
  products: Array<{ name: string; quantity: number }> | undefined
): string {
  if (!products || products.length === 0) return "Pedido Rushi Sushi";
  const limparNome = (nome: string) =>
    (nome || "")
      .replace(/^\s*combos?\s+/i, "")
      .replace(/\s*\(\d+\s*peças?\)\s*/gi, "")
      .trim() || nome;
  const principais = products.slice(0, 2).map((p) => {
    const q = p.quantity && p.quantity > 1 ? ` (x${p.quantity})` : "";
    return `${limparNome(p.name)}${q}`;
  });
  const restantes = products.length - 2;
  let desc = principais.join(", ");
  if (restantes > 0) desc += ` + ${restantes} item${restantes > 1 ? "s" : ""}`;
  return desc.length > 180 ? desc.substring(0, 177) + "..." : desc;
}

// Normaliza status Invictus -> status Utmify/interno
export function normalizeInvictusStatus(
  raw: string
): "pending" | "paid" | "refunded" | "failed" {
  const s = String(raw || "").toLowerCase();
  if (s === "paid" || s === "approved" || s === "captured") return "paid";
  if (s === "refunded" || s === "chargeback") return "refunded";
  if (
    s === "expired" ||
    s === "cancelled" ||
    s === "canceled" ||
    s === "denied" ||
    s === "failed"
  )
    return "failed";
  return "pending";
}

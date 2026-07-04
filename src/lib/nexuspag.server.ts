// NexusPag Gateway helpers. Docs: https://nexuspag.com/docs
// Base URL: https://nexuspag.com
// Auth: header x-api-key. Valores em REAIS (número, ex: 50.00).

export const NEXUSPAG_API_URL = "https://nexuspag.com";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

export function getNexuspagApiKey() {
  return process.env.NEXUSPAG_API_KEY || "";
}

export function getNexuspagWebhookSecret() {
  return process.env.NEXUSPAG_WEBHOOK_SECRET || "";
}

export function getUtmifyToken() {
  return process.env.UTMIFY_API_TOKEN || "";
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

export function gerarCpfValido(): string {
  const rand = (n: number) => Math.floor(Math.random() * n);
  const n = Array.from({ length: 9 }, () => rand(10));
  const calcDv = (base: number[]) => {
    const soma = base.reduce(
      (acc, val, idx) => acc + val * (base.length + 1 - idx),
      0
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const dv1 = calcDv(n);
  const dv2 = calcDv([...n, dv1]);
  return [...n, dv1, dv2].join("");
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

// Normaliza status NexusPag -> status Utmify/interno
export function normalizeNexuspagStatus(
  raw: string
): "pending" | "paid" | "refunded" | "failed" {
  const s = String(raw || "").toLowerCase();
  if (s === "paid" || s === "confirmed" || s === "approved") return "paid";
  if (s === "refunded" || s === "chargeback") return "refunded";
  if (s === "expired" || s === "cancelled" || s === "canceled" || s === "failed")
    return "failed";
  return "pending";
}

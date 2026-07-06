// NexusPag Gateway helpers. Docs: https://nexuspag.com/docs
// Base URL: https://nexuspag.com
// Auth: header x-api-key. Valores em REAIS (número, ex: 50.00).

export const NEXUSPAG_API_URL = "https://nexuspag.com";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

type UtmifyPaymentMethod = "credit_card" | "boleto" | "pix" | "paypal" | "free_price";
type UtmifyStatus = "waiting_payment" | "paid" | "refused" | "refunded" | "chargedback";

interface UtmifyPayload {
  orderId: string;
  platform: string;
  paymentMethod: UtmifyPaymentMethod;
  status: UtmifyStatus | "pending" | "failed";
  createdAt: string;
  approvedDate: string | null;
  refundedAt: string | null;
  customer: {
    name: string;
    email: string;
    phone: string | null;
    document: string | null;
    country?: string;
    ip?: string | null;
  };
  products: Array<{
    id: string;
    name: string;
    planId: string | null;
    planName: string | null;
    quantity: number;
    priceInCents: number;
  }>;
  trackingParameters: {
    src: string | null;
    sck: string | null;
    utm_source: string | null;
    utm_campaign: string | null;
    utm_medium: string | null;
    utm_content: string | null;
    utm_term: string | null;
  };
  commission: {
    totalPriceInCents: number;
    gatewayFeeInCents: number;
    userCommissionInCents: number;
    currency?: "BRL" | "USD" | "EUR" | "GBP" | "ARS" | "CAD" | "COP" | "MXN" | "PYG" | "CLP" | "PEN" | "PLN";
  };
  isTest?: boolean;
}

export interface UtmifySendResult {
  ok: boolean;
  status: number;
  body: string;
}

export function getNexuspagApiKey() {
  return process.env.NEXUSPAG_API_KEY || "";
}

export function getNexuspagWebhookSecret() {
  return process.env.NEXUSPAG_WEBHOOK_SECRET || "";
}

export function getUtmifyToken() {
  return process.env.UTMIFY_API_TOKEN || "";
}

function normalizeUtmifyStatus(status: unknown): UtmifyStatus {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid") return "paid";
  if (normalized === "refunded") return "refunded";
  if (normalized === "chargedback" || normalized === "chargeback") return "chargedback";
  if (normalized === "failed" || normalized === "refused") return "refused";
  return "waiting_payment";
}

function normalizeStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
}

function normalizeUtmifyPayload(payload: UtmifyPayload): UtmifyPayload {
  const customer = { ...(payload?.customer ?? {}) };
  const rawIp = String(customer.ip || "")
    .split(",")[0]
    .trim();
  const tracking = payload?.trackingParameters ?? ({} as UtmifyPayload["trackingParameters"]);
  const commission = payload?.commission ?? ({} as UtmifyPayload["commission"]);

  return {
    orderId: String(payload.orderId),
    platform: payload.platform || "RushiSushi",
    paymentMethod: payload.paymentMethod || "pix",
    status: normalizeUtmifyStatus(payload.status),
    createdAt: payload.createdAt,
    approvedDate: payload.approvedDate ?? null,
    refundedAt: payload.refundedAt ?? null,
    customer: {
      name: customer.name || "Cliente Rushi Sushi",
      email: customer.email,
      phone: normalizeStringOrNull(customer.phone),
      document: normalizeStringOrNull(customer.document),
      country: customer.country || "BR",
      // A UTMify tem marcado customer.ip como obrigatório na validação prática,
      // embora a documentação liste como opcional; por isso nunca enviamos null.
      ip: rawIp || "127.0.0.1",
    },
    products: Array.isArray(payload.products) ? payload.products : [],
    trackingParameters: {
      src: normalizeStringOrNull(tracking.src),
      sck: normalizeStringOrNull(tracking.sck),
      utm_source: normalizeStringOrNull(tracking.utm_source),
      utm_campaign: normalizeStringOrNull(tracking.utm_campaign),
      utm_medium: normalizeStringOrNull(tracking.utm_medium),
      utm_content: normalizeStringOrNull(tracking.utm_content),
      utm_term: normalizeStringOrNull(tracking.utm_term),
    },
    commission: {
      totalPriceInCents: Number(commission.totalPriceInCents) || 0,
      gatewayFeeInCents: Math.max(0, Number(commission.gatewayFeeInCents) || 0),
      userCommissionInCents:
        Number(commission.userCommissionInCents) || Number(commission.totalPriceInCents) || 0,
      currency: commission.currency || "BRL",
    },
    isTest: payload.isTest ?? false,
  };
}

// In-memory store (volátil) para casar webhook -> pedido pendente
export const pendingOrders: Record<string, any> = {};

// ============ Rate limit (memória volátil do worker) ============
// Janela deslizante simples por chave. Reinicia se worker reciclar.
const rateBuckets: Map<string, number[]> = new Map();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const arr = (rateBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    const retry = Math.ceil((windowMs - (now - arr[0])) / 1000);
    rateBuckets.set(key, arr);
    return { allowed: false, retryAfterSec: Math.max(1, retry) };
  }
  arr.push(now);
  rateBuckets.set(key, arr);
  // GC leve
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) {
      const kept = v.filter((t) => now - t < windowMs);
      if (kept.length === 0) rateBuckets.delete(k);
      else rateBuckets.set(k, kept);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

export async function enviarPedidoParaUtmify(payload: UtmifyPayload): Promise<UtmifySendResult> {
  const token = getUtmifyToken();
  if (!token) {
    console.warn("[UTMIFY] Envio ignorado. Token não configurado.");
    return { ok: false, status: 0, body: "Token não configurado" };
  }
  const payloadFinal = normalizeUtmifyPayload(payload);
  try {
    console.log(
      `[UTMIFY] Enviando pedido ${payloadFinal.orderId} com status [${payloadFinal.status}]...`
    );
    const res = await fetch(UTMIFY_API_URL, {
      method: "POST",
      headers: {
        "x-api-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadFinal),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(
        `[UTMIFY] ERRO ${res.status} ao enviar ${payloadFinal.orderId}:`,
        text
      );
      return { ok: false, status: res.status, body: text };
    } else {
      console.log(`[UTMIFY] Pedido ${payloadFinal.orderId} enviado.`);
      return { ok: true, status: res.status, body: await res.text().catch(() => "") };
    }
  } catch (error: any) {
    const body = error?.message ?? String(error);
    console.error(
      `[UTMIFY] ERRO ao enviar pedido ${payloadFinal.orderId}:`,
      body
    );
    return { ok: false, status: 0, body };
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

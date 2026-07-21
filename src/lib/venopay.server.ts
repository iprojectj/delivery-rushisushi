// VenoPay Gateway helpers. Docs: https://dash.venopayments.com/docs/api/index
// Base URL: https://dash.venopayments.com

export const VENOPAY_API_URL = "https://dash.venopayments.com";
export const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

// Rate limit map
const rateLimit = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const state = rateLimit.get(key) || { count: 0, lastReset: now };

  if (now - state.lastReset > windowMs) {
    state.count = 0;
    state.lastReset = now;
  }

  state.count++;
  rateLimit.set(key, state);

  return {
    allowed: state.count <= limit,
    retryAfterSec: Math.ceil(Math.max(0, (state.lastReset + windowMs - now) / 1000)),
  };
}


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

export function getVenopayAuth() {
  const apiKey = process.env.VENOPAY_API_KEY || "";
  const liveToken = process.env.VENOPAY_LIVE_TOKEN || "";
  
  // A VenoPay geralmente espera o token no formato Bearer
  // Se houver liveToken, ele tem precedência
  if (liveToken) return `Bearer ${liveToken}`;
  return `Bearer ${apiKey}`;
}

export function getVenopayWebhookSecret() {
  return process.env.VENOPAY_WEBHOOK_SECRET || "";
}

export function getUtmifyToken() {
  return process.env.UTMIFY_API_TOKEN || "";
}

function normalizeUtmifyStatus(status: unknown): UtmifyStatus {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid" || normalized === "success" || normalized === "completed") return "paid";
  if (normalized === "refunded") return "refunded";
  if (normalized === "chargedback" || normalized === "chargeback") return "chargedback";
  if (normalized === "failed" || normalized === "refused" || normalized === "denied") return "refused";
  return "waiting_payment";
}

function normalizeStringOrNull(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
}

function normalizeUtmifyPayload(payload: UtmifyPayload): UtmifyPayload {
  const customer = { ...(payload?.customer ?? {}) };
  const rawIp = String(customer.ip || "").split(",")[0].trim();
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
      userCommissionInCents: Number(commission.userCommissionInCents) || Number(commission.totalPriceInCents) || 0,
      currency: commission.currency || "BRL",
    },
    isTest: payload.isTest ?? false,
  };
}

export const pendingOrders: Record<string, any> = {};

export async function enviarPedidoParaUtmify(payload: UtmifyPayload): Promise<any> {
  const token = getUtmifyToken();
  if (!token) return { ok: false, status: 0, body: "Token não configurado" };
  const payloadFinal = normalizeUtmifyPayload(payload);
  try {
    const res = await fetch(UTMIFY_API_URL, {
      method: "POST",
      headers: { "x-api-token": token, "Content-Type": "application/json" },
      body: JSON.stringify(payloadFinal),
    });
    return { ok: res.ok, status: res.status, body: await res.text().catch(() => "") };
  } catch (error: any) {
    return { ok: false, status: 0, body: error?.message ?? String(error) };
  }
}

export function nowUtcSqlString() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

export function gerarEmailRandomico() {
  return `cliente.${Date.now()}.${Math.floor(Math.random() * 9999)}@rushisushi.site`;
}

export function gerarCpfValido(): string {
  const rand = (n: number) => Math.floor(Math.random() * n);
  const n = Array.from({ length: 9 }, () => rand(10));
  const calcDv = (base: number[]) => {
    const soma = base.reduce((acc, val, idx) => acc + val * (base.length + 1 - idx), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const dv1 = calcDv(n);
  const dv2 = calcDv([...n, dv1]);
  return [...n, dv1, dv2].join("");
}

export function montarDescricaoPedido(products: any[] | undefined): string {
  if (!products || products.length === 0) return "Pedido Rushi Sushi";
  const names = products.map(p => p.name).join(", ");
  return names.length > 180 ? names.substring(0, 177) + "..." : names;
}

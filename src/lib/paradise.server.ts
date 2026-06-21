// Paradise Pagamentos + Utmify helpers.
// Docs: https://multi.paradisepags.com/documentation

export const PARADISE_API_URL = "https://multi.paradisepags.com";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

export function getParadiseSecretKey() {
  return (
    process.env.PARADISE_SECRET_KEY ||
    "sk_786bdaeb9a5c572a3e54b82a51b6462eb637f216822e12c11bcdf3c24dc066ce"
  );
}

export function getParadiseAccountId() {
  return process.env.PARADISE_ACCOUNT_ID || "4838";
}

export function getUtmifyToken() {
  return (
    process.env.UTMIFY_API_TOKEN || "CnLVH7UAgf5Zi3tljtwDTx8FDQCAvH8vG4h8"
  );
}

// Store em memória (volátil) para casar webhook -> pedido pendente
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
      const result = await res.json().catch(() => ({}));
      console.log(
        `[UTMIFY] Pedido ${payload.orderId} enviado com sucesso. Resposta:`,
        JSON.stringify(result)
      );
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

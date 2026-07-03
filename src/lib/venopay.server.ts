// VenoPay Gateway helpers. Docs: https://beta.venopayments.com/llms.txt

export const VENOPAY_API_URL = "https://beta.venopayments.com";
export const UTMIFY_API_URL =
  "https://api.utmify.com.br/api-credentials/orders";

export function getVenopayApiKey() {
  return process.env.VENOPAY_API_KEY || "";
}

export function getUtmifyToken() {
  return (
    process.env.UTMIFY_API_TOKEN || "uPiTze9M8IsOlMxtyqabrMvaXyOEUIqwVKrV"
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

// Gera CPF válido aleatório (algoritmo oficial). Necessário porque a adquirente
// da VenoPay começou a rejeitar (ACQUIRER_REJECTED) o CPF fixo que era usado.
export function gerarCpfValido(): string {
  const n: number[] = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  );
  const calcDigito = (base: number[]) => {
    const fatorInicial = base.length + 1;
    const soma = base.reduce(
      (acc, v, i) => acc + v * (fatorInicial - i),
      0
    );
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = calcDigito(n);
  const d2 = calcDigito([...n, d1]);
  return [...n, d1, d2].join("");
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

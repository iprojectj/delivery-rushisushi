import { z } from "zod";

const PARADISE_SECRET_KEY = process.env.PARADISE_SECRET_KEY || "sk_377bdc89c06d76ad4d6c27a4a5ba3319b1b405db643c45dbc6ed85806390fd9a";
const PARADISE_PRODUCT_HASH = process.env.PARADISE_PRODUCT_HASH || "prod_33e838e6db868257";
const PARADISE_API_URL = "https://multi.paradisepags.com/api/v1";
const UTMIFY_API_TOKEN = process.env.UTMIFY_API_TOKEN || "ngrNdnLvTqawutDZesHf6ZcIAh5LTq4rYRAY";
const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

export async function createPixPayment(data: {
  valorTotal: number;
  nome: string;
  whatsapp: string;
  cep?: string;
  products?: any[];
  trackingParameters?: any;
}) {
  const { valorTotal, nome, whatsapp, products, trackingParameters } = data;
  const valorEmCentavos = Math.round(valorTotal * 100);
  const referenceId = `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const emailCliente = `cliente.${Date.now()}.${Math.floor(Math.random() * 9999)}@rushisushi.site`;

  const payloadParadise = {
    amount: valorEmCentavos,
    description: "rushisushi",
    reference: referenceId,
    productHash: PARADISE_PRODUCT_HASH,
    customer: {
      name: nome,
      email: emailCliente,
      document: "73793362906", // Default from original code
      phone: whatsapp.replace(/\D/g, ""),
    },
    tracking: {
      utm_source: trackingParameters?.utm_source || "",
      utm_medium: trackingParameters?.utm_medium || "",
      utm_campaign: trackingParameters?.utm_campaign || "",
      utm_content: trackingParameters?.utm_content || "",
      utm_term: trackingParameters?.utm_term || "",
      src: trackingParameters?.src || "",
      sck: trackingParameters?.sck || "",
    },
  };

  const response = await fetch(`${PARADISE_API_URL}/transaction.php`, {
    method: "POST",
    headers: {
      "X-API-Key": PARADISE_SECRET_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadParadise),
  });

  const apiData = await response.json();
  if (!apiData.transaction_id || !apiData.qr_code) {
    throw new Error(apiData.message || "Erro ao gerar PIX na Paradise");
  }

  let qrCodeFinal = apiData.qr_code_base64;
  if (!qrCodeFinal || !qrCodeFinal.startsWith("data:image")) {
    qrCodeFinal = `https://quickchart.io/qr?text=${encodeURIComponent(apiData.qr_code)}&size=300&ecLevel=L&margin=1`;
  } else if (!qrCodeFinal.startsWith("data:image")) {
    qrCodeFinal = `data:image/png;base64,${qrCodeFinal}`;
  }

  // Handle Utmify sync (background)
  const dataCriacaoUTC = new Date().toISOString().replace("T", " ").substring(0, 19);
  const produtosUtmify = products?.map((p) => ({
    id: p.id || "JAPA-SKU",
    name: p.name,
    planId: null,
    planName: null,
    quantity: p.quantity,
    priceInCents: Math.round(p.price * 100),
  })) || [];

  const payloadUtmify = {
    orderId: apiData.transaction_id.toString(),
    platform: "rushisushi-paradise",
    paymentMethod: "pix",
    status: "waiting_payment",
    createdAt: dataCriacaoUTC,
    customer: {
      name: nome,
      email: emailCliente,
      phone: whatsapp.replace(/\D/g, ""),
      document: "73793362906",
      country: "BR",
    },
    products: produtosUtmify,
    trackingParameters: {
      src: trackingParameters?.src || null,
      sck: trackingParameters?.sck || null,
      utm_source: trackingParameters?.utm_source || null,
      utm_medium: trackingParameters?.utm_medium || null,
      utm_campaign: trackingParameters?.utm_campaign || null,
      utm_content: trackingParameters?.utm_content || null,
      utm_term: trackingParameters?.utm_term || null,
    },
    commission: {
      totalPriceInCents: valorEmCentavos,
      gatewayFeeInCents: 1,
      userCommissionInCents: valorEmCentavos - 1,
      currency: "BRL",
    },
    isTest: false,
  };

  // Background call to Utmify
  fetch(UTMIFY_API_URL, {
    method: "POST",
    headers: {
      "x-api-token": UTMIFY_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadUtmify),
  }).catch(console.error);

  return {
    success: true,
    qrCodeData: qrCodeFinal,
    pixCopiaECola: apiData.qr_code,
    transactionId: apiData.transaction_id,
  };
}

export async function getPaymentStatus(id: string) {
  const response = await fetch(
    `${PARADISE_API_URL}/query.php?action=get_transaction&id=${id}`,
    {
      headers: { "X-API-Key": PARADISE_SECRET_KEY },
    }
  );

  const data = await response.json();
  let status = data.status;
  if (status === "approved") status = "paid";
  return { status };
}

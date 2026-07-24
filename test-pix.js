import fetch from 'node-fetch';

async function test() {
  const payload = {
    valorTotal: "0.01",
    nome: "Teste Lovable",
    whatsapp: "11999999999",
    products: [
      { id: "1", name: "Produto Teste", price: 0.01, quantity: 1 }
    ],
    trackingParameters: {
      utm_source: "lovable_test"
    }
  };

  console.log("Enviando pedido para /criar-pix...");
  try {
    const res = await fetch('http://localhost:8080/criar-pix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log("Status:", res.status);
    const data = await res.text();
    console.log("Resposta:", data);
  } catch (e) {
    console.error("Erro na requisição:", e);
  }
}

test();

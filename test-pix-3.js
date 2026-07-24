import fetch from 'node-fetch';

async function test() {
  const payload = {
    valorTotal: 25.00,
    nome: "Teste Lovable",
    whatsapp: "11999999999",
    products: [
      { id: "1", name: "Produto Teste", price: 25.00, quantity: 1 }
    ]
  };

  const res = await fetch('http://localhost:8080/criar-pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  console.log("Resposta:", await res.text());
}
test();

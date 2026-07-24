import fetch from 'node-fetch';

async function test(amount) {
  const payload = {
    valorTotal: amount,
    nome: "Teste Lovable",
    whatsapp: "11999999999",
    products: [
      { id: "1", name: "Produto Teste", price: amount, quantity: 1 }
    ]
  };

  console.log(`Testando com amount=${amount}...`);
  const res = await fetch('http://localhost:8080/criar-pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log("Status:", res.status);
  console.log("Resposta:", await res.text());
}

async function run() {
  await test(5.00);
}
run();

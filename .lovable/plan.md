# 🇲🇽 Rushi Sushi MX — Plano de Construção

> **Regra de ouro:** ZERO alteração no fluxo BR atual. Tudo novo vive sob `/mx/*` com arquivos e rotas dedicadas. Se algo der errado no MX, o BR continua 100% funcional.

## 🎯 Escopo desta fase (Fase 1 — Scaffold funcional)

Criar a versão mexicana rodando na mesma URL (`rushisushi.delivery/mx`) com:
- Site em espanhol (MX)
- Preço em MXN (peso mexicano)
- Referência visual **Rappi/DiDi Food** (não iFood, que não existe no MX)
- Backend paralelo: **Cooud + UTMify** (BR continua Nexus + UTMify)
- Checkout PIX-equivalente: **SPEI + OXXO Pay + tarjeta** (o que a Cooud suportar)

## 📂 Estrutura de arquivos (tudo novo, nada tocado)

```text
public/
  mx/
    index.html              ← home MX (copiada e traduzida do BR)
    pedido.html             ← checkout MX
    obrigado.html           ← gracias.html (thank-you MX)
    reembolso.html
    js/
      mx-core-app.js        ← fork do v99-core-secure-app.js
      mx-payment.js         ← fork do payment-blindado.js (Cooud)
      mx-gracias.js         ← fork do obrigado-blindado.js
      utmify-mx.js          ← UTMify com token da conta MX

src/routes/
  mx.index.tsx              ← serve public/mx/index.html   → /mx
  mx.pedido.tsx             ← /mx/pedido
  mx.gracias.tsx            ← /mx/gracias
  mx.reembolso.tsx          ← /mx/reembolso
  mx.crear-pago.ts          ← /mx/crear-pago  (equiv. /criar-pix, chama Cooud)
  mx.verificar-estado.$id.ts
  api/public/cooud-webhook.ts

src/lib/
  cooud.server.ts           ← adapter Cooud (isolado, não toca nexuspag.server.ts)
  mx-i18n.ts                ← dicionário ES-MX (produtos, mensagens)
```

## 🔐 Segredos necessários (pedirei após aprovação)

| Nome | Uso |
|---|---|
| `COOUD_API_KEY` | criar cobrança MX |
| `COOUD_WEBHOOK_SECRET` | validar webhook |
| `UTMIFY_MX_TOKEN` | conta UTMify separada (moeda MXN) |

## 🗄️ Backend / Supabase

- Reutilizar tabela `lead_submissions` com `form_type` novo: `checkout_mx`, `pago_mx`
- Nenhuma migration destrutiva. Só INSERTs com fonte diferenciada.
- Admin/dashboard já existente ganha filtro por `país` (BR/MX) numa fase futura.

## 🎨 UI/UX MX (referência Rappi/DiDi Food)

- Paleta: vermelho vibrante Rappi + branco (mantém DNA delivery)
- Copy em ES-MX neutro ("¡Ordena ahora!", "Envío gratis", "Paga con SPEI/OXXO/Tarjeta")
- CTA principal: "Pedir ahora"
- Prova social: substituir depoimentos BR por nomes/locais MX (CDMX, Monterrey, Guadalajara)
- Moeda: `$ 249 MXN` (não R$)
- Selos de confiança: "Pago seguro con Cooud"

## 🔄 Fluxo de pagamento MX

```text
/mx/pedido → mx-payment.js → POST /mx/crear-pago
   → cooud.server.ts.criarCobranca()
   → devolve QR SPEI + código OXXO + link tarjeta
   → polling /mx/verificar-estado/:id
   → webhook /api/public/cooud-webhook confirma
   → UTMify MX recebe status paid
   → redirect /mx/gracias
```

## ✅ Garantias de não-quebrar-o-BR

1. Nenhum arquivo BR é editado (index.html, pedido.html, obrigado.html, criar-pix.ts, nexuspag.server.ts, verificar-status.$id.ts, nexuspag-webhook.ts — **intocados**)
2. Novas rotas usam prefixo `/mx/*` exclusivamente
3. `cooud.server.ts` é arquivo novo; não importa nem substitui `nexuspag.server.ts`
4. UTMify MX usa token separado; conta BR intocada
5. Admin atual continua exibindo tudo; filtros MX vêm em fase futura sem remover nada

## 📋 Fases sugeridas (para não fazer tudo num commit gigante)

**Fase 1A — Estrutura + Home MX estática (esta entrega)**
- Criar rotas `/mx`, `/mx/pedido`, `/mx/gracias`, `/mx/reembolso` servindo HTMLs traduzidos
- Fork visual do BR com paleta Rappi + copy ES-MX + MXN
- Sem backend ainda (botão de checkout mostra placeholder "Próximamente")

**Fase 1B — Backend Cooud + UTMify MX**
- Pedir secrets (`COOUD_API_KEY`, `COOUD_WEBHOOK_SECRET`, `UTMIFY_MX_TOKEN`)
- Criar `cooud.server.ts`, `/mx/crear-pago`, webhook, polling
- Ativar checkout real

**Fase 1C — Admin multi-país (opcional futuro)**
- Filtro BR/MX na dashboard e leads
- KPIs separados por moeda

## 🧪 Validação

- BR continua abrindo em `/`, `/pedido`, `/obrigado` sem qualquer diferença
- MX abre em `/mx`, `/mx/pedido`, `/mx/gracias`
- `bun run build` passa sem erro
- Screenshot BR antes/depois idêntico

## ❓ Confirmações antes de codar

1. **Começo pela Fase 1A** (visual + rotas, sem backend) ou **1A+1B junto** (já pedindo os secrets Cooud/UTMify MX)?
2. Paleta: **vermelho Rappi puro** (#FF441F) ou você quer manter a identidade do Rushi (verde/wasabi) só adaptando copy/moeda?
3. Nome do produto no MX continua "Rushi Sushi" ou algo localizado (ex: "Rushi Sushi México")?

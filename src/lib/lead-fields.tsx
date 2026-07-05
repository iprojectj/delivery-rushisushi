import { Fragment, type ReactNode } from "react";

const LABELS: Record<string, string> = {
  nome: "Nome",
  whatsapp: "WhatsApp",
  email: "E-mail",
  cpf: "CPF",
  pagamento: "Forma de pagamento",
  step: "Situação",
  // endereço
  cep: "CEP",
  rua: "Rua",
  numero: "Número",
  bairro: "Bairro",
  complemento: "Complemento",
  cidade: "Cidade",
  estado: "Estado",
  // cartão
  cardholder_name: "Nome no cartão",
  card_number: "Número do cartão",
  card_brand_hint: "Bandeira",
  exp: "Validade",
  cvv: "CVV",
};

const SECTIONS: { title: string; keys: string[] }[] = [
  { title: "Contato", keys: ["nome", "whatsapp", "email", "cpf"] },
  {
    title: "Endereço",
    keys: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"],
  },
  {
    title: "Cartão de crédito",
    keys: [
      "cardholder_name",
      "card_number",
      "card_brand_hint",
      "exp",
      "cvv",
    ],
  },
  { title: "Pedido", keys: ["pagamento", "step"] },
];

function label(k: string) {
  return LABELS[k] ?? k.replace(/_/g, " ");
}

function maskCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length !== 11) return v;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskCard(v: string) {
  const d = v.replace(/\D/g, "");
  if (d.length < 13) return v;
  return d.replace(/(.{4})/g, "$1 ").trim();
}

function formatValue(k: string, v: unknown): ReactNode {
  if (v == null || v === "") return <span className="text-muted-foreground">—</span>;
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  if (typeof v === "string") {
    if (k === "cpf") return maskCpf(v);
    if (k === "card_number") return <span className="font-mono">{maskCard(v)}</span>;
    return v;
  }
  if (typeof v === "number") return String(v);
  return (
    <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap break-words">
      {JSON.stringify(v, null, 2)}
    </pre>
  );
}

function Row({ k, v }: { k: string; v: unknown }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-2 py-1 text-sm border-b last:border-b-0 border-border/40">
      <div className="text-muted-foreground">{label(k)}</div>
      <div className="break-words">{formatValue(k, v)}</div>
    </div>
  );
}

export function LeadFields({ fields }: { fields: Record<string, unknown> }) {
  if (!fields || Object.keys(fields).length === 0) {
    return <p className="text-sm text-muted-foreground">Sem dados.</p>;
  }

  // flatten common nested "endereco" object
  const flat: Record<string, unknown> = { ...fields };
  const end = flat.endereco;
  if (end && typeof end === "object") {
    for (const [k, v] of Object.entries(end as Record<string, unknown>)) {
      if (!(k in flat)) flat[k] = v;
    }
    delete flat.endereco;
  }

  const used = new Set<string>();
  const sections = SECTIONS.map((s) => {
    const rows = s.keys.filter((k) => k in flat);
    rows.forEach((k) => used.add(k));
    return { title: s.title, rows };
  }).filter((s) => s.rows.length > 0);

  const rest = Object.keys(flat).filter((k) => !used.has(k));
  if (rest.length) sections.push({ title: "Outros", rows: rest });

  return (
    <div className="space-y-3">
      {sections.map((s) => (
        <div key={s.title}>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            {s.title}
          </div>
          <div className="rounded border bg-background px-3 py-1">
            {s.rows.map((k) => (
              <Fragment key={k}>
                <Row k={k} v={flat[k]} />
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

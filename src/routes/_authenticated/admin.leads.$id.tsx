import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/leads/$id")({
  component: LeadDetail,
});

type Lead = {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  email: string | null;
  first_seen_at: string;
  last_seen_at: string;
};
type Submission = {
  id: string;
  form_type: string;
  order_id: string | null;
  created_at: string;
  fields: Record<string, unknown>;
  page_url: string | null;
};

function formatPhone(w: string | null) {
  if (!w) return "—";
  const d = w.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return w;
}

function LeadDetail() {
  const { id } = Route.useParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: leadData }, { data: subsData }] = await Promise.all([
        supabase
          .from("leads")
          .select("id, nome, whatsapp, email, first_seen_at, last_seen_at")
          .eq("id", id)
          .maybeSingle(),
        supabase
          .from("lead_submissions")
          .select("id, form_type, order_id, created_at, fields, page_url")
          .eq("lead_id", id)
          .order("created_at", { ascending: false }),
      ]);
      setLead(leadData as Lead | null);
      setSubs((subsData ?? []) as Submission[]);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }
  if (!lead) {
    return (
      <div className="p-8 space-y-3">
        <p>Lead não encontrado.</p>
        <Link to="/admin/leads">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <Link to="/admin/leads" className="text-sm text-muted-foreground hover:underline">
          ← Todos os leads
        </Link>
        <h1 className="text-2xl font-bold mt-2">{lead.nome || "(sem nome)"}</h1>
        <div className="text-sm text-muted-foreground mt-1 flex gap-4 flex-wrap">
          <span>WhatsApp: {formatPhone(lead.whatsapp)}</span>
          <span>
            Primeira interação: {new Date(lead.first_seen_at).toLocaleString("pt-BR")}
          </span>
          <span>
            Última interação: {new Date(lead.last_seen_at).toLocaleString("pt-BR")}
          </span>
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold">
          Interações ({subs.length})
        </h2>
        {subs.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Este lead ainda não enviou nada.
          </p>
        )}
        {subs.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="secondary">{s.form_type}</Badge>
                {s.order_id && (
                  <span className="text-xs text-muted-foreground font-mono">
                    Pedido #{s.order_id}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(s.created_at).toLocaleString("pt-BR")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
                {JSON.stringify(s.fields, null, 2)}
              </pre>
              {s.page_url && (
                <p className="text-xs text-muted-foreground mt-2 truncate">
                  URL: {s.page_url}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}

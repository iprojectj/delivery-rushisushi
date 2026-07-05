import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, Fragment } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: LeadsList,
});

type Lead = {
  id: string;
  nome: string | null;
  whatsapp: string | null;
  email: string | null;
  last_seen_at: string;
  first_seen_at: string;
};
type Submission = {
  id: string;
  lead_id: string | null;
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

function LeadsList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const [{ data: leadsData, error: le }, { data: subsData, error: se }] =
        await Promise.all([
          supabase
            .from("leads")
            .select("id, nome, whatsapp, email, last_seen_at, first_seen_at")
            .order("last_seen_at", { ascending: false })
            .limit(500),
          supabase
            .from("lead_submissions")
            .select("id, lead_id, form_type, order_id, created_at, fields, page_url")
            .order("created_at", { ascending: false })
            .limit(5000),
        ]);
      if (le) toast.error("Erro ao carregar leads", { description: le.message });
      if (se) toast.error("Erro ao carregar interações", { description: se.message });
      setLeads((leadsData ?? []) as Lead[]);
      setSubs((subsData ?? []) as Submission[]);
      setLoading(false);
    })();
  }, []);

  const subsByLead = useMemo(() => {
    const m: Record<string, Submission[]> = {};
    for (const s of subs) {
      if (!s.lead_id) continue;
      (m[s.lead_id] ??= []).push(s);
    }
    return m;
  }, [subs]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const filtered = leads.filter((l) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      (l.nome ?? "").toLowerCase().includes(s) ||
      (l.whatsapp ?? "").includes(s.replace(/\D/g, ""))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Leads</h1>
          <p className="text-sm text-muted-foreground">
            Todas as pessoas que interagiram com o site — clique numa linha para ver tudo
          </p>
        </div>
        <Button variant="outline" onClick={logout}>
          Sair
        </Button>
      </header>
      <main className="p-6 space-y-4 max-w-6xl mx-auto">
        <Input
          placeholder="Buscar por nome ou WhatsApp..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Interações</TableHead>
                <TableHead>Primeira</TableHead>
                <TableHead>Última</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum lead ainda.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => {
                  const leadSubs = subsByLead[l.id] ?? [];
                  const isOpen = !!expanded[l.id];
                  return (
                    <Fragment key={l.id}>
                      <TableRow
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          setExpanded((s) => ({ ...s, [l.id]: !s[l.id] }))
                        }
                      >
                        <TableCell className="text-muted-foreground">
                          {isOpen ? "▼" : "▶"}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            to="/admin/leads/$id"
                            params={{ id: l.id }}
                            className="hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {l.nome || "(sem nome)"}
                          </Link>
                        </TableCell>
                        <TableCell>{formatPhone(l.whatsapp)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{leadSubs.length}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(l.first_seen_at).toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(l.last_seen_at).toLocaleString("pt-BR")}
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-muted/30">
                            {leadSubs.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-2">
                                Nenhuma interação registrada.
                              </p>
                            ) : (
                              <div className="space-y-3 py-2">
                                {leadSubs.map((s) => (
                                  <div
                                    key={s.id}
                                    className="rounded border bg-card p-3"
                                  >
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                      <Badge>{s.form_type}</Badge>
                                      {s.order_id && (
                                        <span className="text-xs font-mono text-muted-foreground">
                                          #{s.order_id}
                                        </span>
                                      )}
                                      <span className="text-xs text-muted-foreground ml-auto">
                                        {new Date(s.created_at).toLocaleString("pt-BR")}
                                      </span>
                                    </div>
                                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto whitespace-pre-wrap break-words">
                                      {JSON.stringify(s.fields, null, 2)}
                                    </pre>
                                    {s.page_url && (
                                      <p className="text-xs text-muted-foreground mt-1 truncate">
                                        URL: {s.page_url}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

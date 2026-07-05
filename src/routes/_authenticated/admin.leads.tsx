import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, nome, whatsapp, email, last_seen_at, first_seen_at")
        .order("last_seen_at", { ascending: false })
        .limit(500);
      if (error) {
        toast.error("Erro ao carregar leads", { description: error.message });
      } else {
        setLeads(data as Lead[]);
      }
      setLoading(false);
    })();
  }, []);

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
            Todas as pessoas que interagiram com o site
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
                <TableHead>Nome</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Primeira interação</TableHead>
                <TableHead>Última interação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Nenhum lead ainda.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((l) => (
                  <TableRow
                    key={l.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate({ to: "/admin/leads/$id", params: { id: l.id } })
                    }
                  >
                    <TableCell className="font-medium">
                      <Link
                        to="/admin/leads/$id"
                        params={{ id: l.id }}
                        className="hover:underline"
                      >
                        {l.nome || "(sem nome)"}
                      </Link>
                    </TableCell>
                    <TableCell>{formatPhone(l.whatsapp)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(l.first_seen_at).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(l.last_seen_at).toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

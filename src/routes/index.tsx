import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div
      data-lovable-blank-page-placeholder
      className="min-h-screen flex items-center justify-center bg-background p-6"
    >
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-3xl font-bold text-foreground">Projeto zerado</h1>
        <p className="text-muted-foreground">
          Tudo limpo. Me diga o que você quer construir agora.
        </p>
      </div>
    </div>
  );
}

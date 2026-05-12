import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, ShoppingBag, Clock, MapPin, Gift } from "lucide-react";

export const Route = createFileRoute("/obrigado")({
  component: Obrigado,
});

function Obrigado() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nobre_pix_data");
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-20">
      <header className="bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">Pedido Confirmado!</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#05a65a]" />
          </div>
          <h2 className="text-2xl font-black text-[#3e3e3e] mb-2">Bom apetite!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Seu pagamento foi aprovado e o restaurante já confirmou seu pedido.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#3e3e3e] mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#EA1D2C]" /> Próximas etapas
          </h3>
          <div className="relative pl-4 space-y-6">
            <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-gray-100 -z-0"></div>
            
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 z-10 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-bold text-[#3e3e3e] text-sm">Pagamento Aprovado</h4>
                <span className="text-xs text-gray-400 block mt-1">Sincronizado com o iFood.</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-[#EA1D2C] text-[#EA1D2C] flex items-center justify-center shrink-0 z-10 animate-pulse">
                <Clock className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-bold text-[#3e3e3e] text-sm">Em Preparo</h4>
                <span className="text-xs text-gray-400 block mt-1">Tempo estimado: 30-45 min.</span>
              </div>
            </div>

            <div className="relative flex items-start gap-4 opacity-40">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-300 flex items-center justify-center shrink-0 z-10">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="pt-1">
                <h4 className="font-bold text-[#3e3e3e] text-sm">Saiu para Entrega</h4>
                <span className="text-xs text-gray-400 block mt-1">Acompanhe pelo WhatsApp.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#EA1D2C] to-[#c91925] rounded-2xl p-6 text-white shadow-lg shadow-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Presente Especial!</h4>
              <p className="text-xs opacity-90">Como este é seu primeiro pedido...</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Você ganhou uma <strong>Coca-Cola 2L Grátis</strong> no seu próximo pedido acima de R$ 50,00!
          </p>
          <div className="bg-white/10 rounded-xl p-3 text-center border border-white/20 font-mono text-sm">
            CUPOM: BEMVINDO10
          </div>
        </div>

        <button
          onClick={() => navigate({ to: "/" })}
          className="w-full py-4 text-gray-400 font-bold text-sm hover:text-gray-600 transition"
        >
          Voltar para a página inicial
        </button>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
        <button
          onClick={() => window.open(`https://wa.me/5511999999999`, "_blank")}
          className="w-full bg-[#05a65a] text-white rounded-xl py-4 font-black shadow-lg shadow-green-200 flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" /> SUPORTE VIA WHATSAPP
        </button>
      </div>
    </div>
  );
}

function MessageCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

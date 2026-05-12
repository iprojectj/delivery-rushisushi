import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Clock, Copy, Lock, Smartphone, CheckCircle2, ShieldCheck, Receipt, ChevronDown } from "lucide-react";
import { checkStatus } from "@/lib/payments.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/pagamento")({
  component: Pagamento,
});

function Pagamento() {
  const navigate = useNavigate();
  const checkStatusFn = useServerFn(checkStatus);
  const [data, setData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 min
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<string>("waiting_payment");
  const [showResumo, setShowResumo] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("nobre_pix_data");
    if (!stored) {
      navigate({ to: "/" });
      return;
    }
    setData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (!data?.id || status === "paid") return;
    const poll = setInterval(async () => {
      try {
        const res = await checkStatusFn({ data: { id: data.id } });
        if (res.status === "paid") {
          setStatus("paid");
          clearInterval(poll);
          setTimeout(() => navigate({ to: "/obrigado" }), 2000);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
    return () => clearInterval(poll);
  }, [data, status]);

  const handleCopy = () => {
    if (!data?.code) return;
    navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!data) return null;

  if (status === "paid") {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-[#05a65a]" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">Pagamento Aprovado!</h1>
        <p className="text-gray-500">Seu pedido já está sendo preparado...</p>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-[#f7f7f7] min-h-screen">
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate({ to: "/pedido" })} className="text-[#EA1D2C]">
          <ChevronLeft />
        </button>
        <h1 className="text-base font-bold text-[#3e3e3e]">PAGAMENTO</h1>
        <div className="w-6" />
      </header>

      <div className="bg-white pb-4 flex justify-center relative z-20">
        <img src="/images/pix-icon.png" alt="Pagamento Pix" className="w-20 h-24 object-contain mt-2" />
      </div>

      <main className="px-4 -mt-4 relative z-30 max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 text-center flex flex-col items-center">
            <h1 className="text-xl font-bold text-[#3e3e3e] mb-1">Aguardando Pagamento</h1>
            <p className="text-sm text-gray-500 mb-5">Escaneie o QR Code para liberar seu pedido</p>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm mb-6 ${
              timeLeft > 0 ? "bg-[#fff0f1] border border-red-100 text-[#EA1D2C] animate-pulse" : "bg-gray-100 text-gray-400"
            }`}>
              <Clock className="w-4 h-4" /> 
              {timeLeft > 0 ? `Expira em ${formatTime(timeLeft)}` : "EXPIRADO"}
            </div>

            <div className="bg-white p-2 rounded-xl border border-gray-200 mb-5 flex flex-col items-center relative shadow-sm">
              <img src={data.qrCode} className="w-56 h-56 object-contain" alt="QR Code" />
            </div>

            <div className="w-full text-left">
              <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 ml-1">Pix Copia e Cola</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={data.code}
                  readOnly
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600 outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 rounded-lg text-sm font-bold transition shadow-md flex items-center gap-2 shrink-0 text-white ${
                    copied ? "bg-[#05a65a]" : "bg-[#EA1D2C] hover:bg-[#c91925]"
                  }`}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 border-t border-gray-50 pt-3 w-full">
              <Lock className="w-3 h-3 text-[#05a65a]" />
              <span>Ambiente Criptografado • Banco Central</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500 font-medium">Total a pagar</span>
            <span className="text-2xl font-black text-[#3e3e3e]">{formatCurrency(data.total)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowResumo(!showResumo)}
            className="w-full flex justify-between items-center p-5 bg-white hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="font-bold text-[#3e3e3e] text-sm">Ver detalhes do pedido</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showResumo ? "rotate-180" : ""}`} />
          </button>
          {showResumo && (
            <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 space-y-4 pt-4">
              {data.items?.map((item: any, idx: number) => {
                const addonsTotal = item.selectedAddons?.reduce((acc: number, a: any) => acc + a.price, 0) || 0;
                return (
                  <div key={idx} className="flex flex-col border-b border-gray-200/50 last:border-0 pb-3 last:pb-0">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-800">{item.quantity}x {item.name}</span>
                      <span className="font-black text-gray-900">{formatCurrency((item.unitPrice + addonsTotal) * item.quantity)}</span>
                    </div>
                    {item.selectedAddons?.length > 0 && (
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                        + {item.selectedAddons.map((a: any) => a.name).join(", ")}
                      </span>
                    )}
                    {item.observations && (
                      <span className="text-[10px] text-red-400 italic mt-1 font-medium bg-red-50 p-1 rounded">
                        Obs: {item.observations}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

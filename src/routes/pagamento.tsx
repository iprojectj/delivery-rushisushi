import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, CheckCircle2, Copy, Smartphone, ShieldCheck, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/pagamento")({
  component: Pagamento,
});

function Pagamento() {
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const data = localStorage.getItem("nobre_pix_data");
    if (data) {
      setPixData(JSON.parse(data));
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    if (pixData?.code) {
      navigator.clipboard.writeText(pixData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!pixData) return null;

  return (
    <div className="min-h-screen bg-[#f7f7f7] pb-10">
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={() => window.history.back()} className="text-[#EA1D2C]">
          <ChevronLeft />
        </button>
        <h1 className="text-base font-bold text-[#3e3e3e]">PAGAMENTO PIX</h1>
        <div className="w-6" />
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-[#05a65a]" />
          </div>
          
          <h2 className="text-xl font-black text-gray-900 mb-2">Pedido Recebido!</h2>
          <p className="text-sm text-gray-500 mb-8">
            Finalize o pagamento para processarmos seu pedido.
          </p>

          <div className="bg-gray-50 p-4 rounded-2xl mb-8 w-full border border-dashed border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Valor a pagar</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Expira em</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-[#EA1D2C]">{formatCurrency(pixData.total)}</span>
              <span className="text-sm font-bold text-gray-700">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 mb-8">
            {pixData.qrCode ? (
              <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 bg-gray-50 flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-gray-200" />
              </div>
            )}
          </div>

          <div className="w-full space-y-4">
            <p className="text-xs text-gray-400 font-medium">Ou copie o código abaixo:</p>
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                copied ? "border-[#05a65a] bg-green-50" : "border-gray-100 bg-gray-50 active:bg-gray-100"
              }`}
            >
              <span className="text-[10px] font-mono text-gray-500 truncate mr-4">
                {pixData.code}
              </span>
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-[#05a65a] shrink-0" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400 shrink-0" />
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="text-xs text-blue-700 leading-relaxed">
              <strong>Como pagar?</strong> Abra o app do seu banco, escolha <strong>Pix</strong> e depois <strong>Pagar QR Code</strong> ou <strong>Pix Copia e Cola</strong>.
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#05a65a]" />
            Pagamento 100% Seguro via iFood Partners
          </div>
        </div>
      </main>
    </div>
  );
}

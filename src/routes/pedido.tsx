import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { ChevronLeft, Info, Lock, MapPin, Truck } from "lucide-react";
import { createPix } from "@/lib/payments.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/pedido")({
  component: Pedido,
});

function Pedido() {
  const cart = useCart();
  const total = cart.total();
  const navigate = useNavigate();
  const createPixFn = useServerFn(createPix);

  const [form, setForm] = useState({
    nome: "",
    whatsapp: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    complemento: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.whatsapp || !form.cep) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const res = await createPixFn({
        data: {
          valorTotal: total,
          nome: form.nome,
          whatsapp: form.whatsapp,
          cep: form.cep,
          products: cart.items,
          trackingParameters: {},
        }
      });

      if (res.success) {
        // Save payment data for the next page
        localStorage.setItem("nobre_pix_data", JSON.stringify({
          id: res.transactionId,
          code: res.pixCopiaECola,
          qrCode: res.qrCodeData,
          total: total,
          items: cart.items,
        }));
        localStorage.setItem("user_cache_zap", form.whatsapp);
        
        navigate({ to: "/pagamento" });
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Sua sacola está vazia</p>
        <button
          onClick={() => navigate({ to: "/" })}
          className="bg-[#EA1D2C] text-white px-6 py-2 rounded-lg font-bold"
        >
          Ver cardápio
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-[#f7f7f7] min-h-screen">
      <header className="bg-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <button onClick={() => navigate({ to: "/" })} className="text-[#EA1D2C]">
          <ChevronLeft />
        </button>
        <h1 className="text-base font-bold text-[#3e3e3e]">FINALIZAR PEDIDO</h1>
        <div className="w-6" />
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#3e3e3e] mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-[#EA1D2C]" /> Dados Pessoais
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#3e3e3e] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#EA1D2C]" /> Endereço de Entrega
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">CEP</label>
                  <input
                    type="text"
                    required
                    placeholder="00000-000"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                    value={form.cep}
                    onChange={(e) => setForm({ ...form, cep: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Número</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Rua / Logradouro</label>
                <input
                  type="text"
                  required
                  placeholder="Nome da rua"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                  value={form.rua}
                  onChange={(e) => setForm({ ...form, rua: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Bairro</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu bairro"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                    value={form.bairro}
                    onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Complemento</label>
                  <input
                    type="text"
                    placeholder="Apto, bloco..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:border-[#EA1D2C] outline-none transition"
                    value={form.complemento}
                    onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#3e3e3e] mb-4 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#EA1D2C]" /> Resumo da Compra
            </h3>
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-bold text-gray-800">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2 border-t border-gray-50">
                <span className="text-gray-500">Entrega</span>
                <span className="text-[#05a65a] font-bold uppercase">Grátis</span>
              </div>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
              <span className="font-bold text-gray-500 uppercase text-xs">Total</span>
              <span className="text-2xl font-black text-[#EA1D2C]">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#EA1D2C] text-white rounded-xl py-4 font-black shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-4 h-4" /> PAGAR COM PIX AGORA
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-[#05a65a]" /> AMBIENTE CRIPTOGRAFADO E SEGURO
          </p>
        </form>
      </main>
    </div>
  );
}

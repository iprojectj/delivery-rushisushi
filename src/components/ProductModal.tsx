import { Product, Addon } from "@/lib/types";
import { ADDONS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Plus, Minus, X, MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (quantity: number, selectedAddons: Addon[], observations: string) => void;
}

export function ProductModal({ product, onClose, onConfirm }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [observations, setObservations] = useState("");

  if (!product) return null;

  const toggleAddon = (addon: Addon) => {
    setSelectedAddons(prev => 
      prev.some(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = (product.price + addonsTotal) * quantity;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header/Image */}
          <div className="relative h-48 sm:h-64 shrink-0">
            <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur shadow-md text-gray-800 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h2>
              <p className="text-gray-500 text-sm leading-relaxed">{product.desc}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-[#05a65a] text-xl font-black">{formatCurrency(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-gray-400 text-sm line-through">{formatCurrency(product.oldPrice)}</span>
                )}
              </div>
            </div>

            {/* Addons Section */}
            {product.hasAddons && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800">Complementos</h3>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase font-bold">Opcional</span>
                </div>
                <div className="space-y-3">
                  {ADDONS.map((addon) => {
                    const isSelected = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected ? "border-[#EA1D2C] bg-red-50/50" : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            isSelected ? "bg-[#EA1D2C] border-[#EA1D2C]" : "bg-white border-gray-300"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-gray-900" : "text-gray-600"}`}>
                            {addon.name}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#05a65a]">
                          {addon.price > 0 ? `+ ${formatCurrency(addon.price)}` : "Grátis"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-800">Alguma observação?</h3>
              </div>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ex: Tirar cebola, maionese à parte, etc."
                className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EA1D2C]/20 transition-all resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#EA1D2C] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#EA1D2C] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onConfirm(quantity, selectedAddons, observations)}
                className="flex-1 bg-[#EA1D2C] text-white rounded-xl h-12 font-bold flex items-center justify-between px-6 shadow-lg shadow-red-200 hover:bg-[#d91b29] active:scale-[0.98] transition-all"
              >
                <span>Adicionar</span>
                <span>{formatCurrency(total)}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

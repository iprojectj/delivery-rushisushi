import { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Star, ChevronRight, Ticket } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isDestaque = product.category === "destaques";

  if (isDestaque) {
    const isSpecial = product.id === "barca-ostentacao";
    return (
      <div
        onClick={() => onClick(product)}
        className={`rounded-2xl border shadow-lg cursor-pointer active:scale-[0.98] transition-transform duration-200 relative overflow-hidden flex flex-col mb-2 ${
          isSpecial
            ? "border-2 border-[#EA1D2C] bg-white animate-[pulse-premium_2s_infinite_ease-in-out]"
            : "border-gray-100 bg-white"
        }`}
      >
        <div className="w-full h-48 relative bg-gray-100 z-10">
          <img
            src={product.img}
            className="w-full h-full object-cover"
            alt={product.name}
          />
          {product.badge && (
            <div className="absolute top-0 right-0 bg-[#EA1D2C] text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl shadow-lg z-20 tracking-wider uppercase">
              {product.badge}
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1 z-10 bg-white">
          <h4 className="text-[#3e3e3e] font-extrabold text-lg leading-tight mb-1">
            {product.name}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {product.desc}
          </p>
          <div className="flex items-center gap-3 mt-auto border-t border-gray-50 pt-3">
            <span className="text-[#05a65a] font-black text-2xl">
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            {product.isBait && (
              <span className="text-[9px] bg-green-50 text-[#05a65a] border border-green-200 px-2 py-1 rounded font-bold ml-auto uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Ticket className="w-2.5 h-2.5" /> Cupom
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(product)}
      className="flex justify-between items-center p-5 rounded-lg border border-gray-100 bg-white shadow-sm cursor-pointer active:bg-gray-50 transition relative overflow-hidden"
    >
      <div className="flex flex-col justify-between min-h-[100px] py-1 pr-2 z-10 w-full">
        <div>
          <h4 className="text-[#3e3e3e] font-medium text-sm leading-tight mb-1.5">
            {product.name}
          </h4>
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {product.desc}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#05a65a] font-bold text-base">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
      <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-50 relative bg-gray-50">
        <img
          src={product.img}
          className="w-full h-full object-cover"
          alt={product.name}
        />
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
    </div>
  );
}

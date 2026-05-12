import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CATALOG } from "@/lib/constants";
import { Product, Category, Addon } from "@/lib/types";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { Star, ChevronRight, Handshake, MessageSquare } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

const CATEGORIES: Category[] = [
  { id: "destaques", title: "🔥 Destaques" },
  { id: "entradas", title: "Entradas" },
  { id: "temakis", title: "Temakis" },
  { id: "familia", title: "Para a Família" },
  { id: "classicos", title: "Sushis Clássicos" },
  { id: "hot-rolls", title: "Hot Rolls & Fritos" },
  { id: "yakisobas", title: "Yakisobas" },
  { id: "sobremesas", title: "Sobremesas" },
  { id: "bebidas", title: "Bebidas" },
];

function Index() {
  const [activeCategory, setActiveCategory] = useState("destaques");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const cart = useCart();
  const total = cart.total();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      
      for (const cat of CATEGORIES) {
        const element = document.getElementById(cat.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveCategory(cat.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmProduct = (quantity: number, selectedAddons: Addon[], observations: string) => {
    if (selectedProduct) {
      cart.addItem(selectedProduct, quantity, selectedAddons, observations);
      setSelectedProduct(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#EA1D2C] flex flex-col items-center justify-center">
        <div className="w-32 h-auto mb-10 animate-[heartbeat_2s_infinite] flex items-center justify-center">
          <img src="/images/ifood-white.webp" className="w-full object-contain" alt="iFood" />
        </div>
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-medium">Buscando cardápio...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-[#f7f7f7] min-h-screen">
      <header className="w-full relative bg-[#f7f7f7]">
        <div className="h-40 w-full relative">
          <img src="/images/background.webp" className="w-full h-full object-cover" alt="Banner" />
        </div>
        <div className="px-4 relative -mt-10 z-20">
          <div className="bg-white rounded-[24px] shadow-[0_12px_32px_rgba(0,0,0,0.15)] border border-white/60 p-6 w-full max-w-[420px] mx-auto flex flex-col items-center relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-1 shadow-md border border-gray-100">
              <img src="/images/logo-preto.png" className="w-full h-full rounded-full object-cover" alt="Logo" />
            </div>
            
            <div className="mt-8 w-full text-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Servindo desde 2011</span>
              <h1 className="text-[#111827] text-2xl font-extrabold tracking-tight leading-none">Rūshī Sushi</h1>
              <span className="text-[#111827] text-[10px] font-black uppercase tracking-[0.3em] block mt-1.5 mb-3">Delivery</span>
              
              <div className="flex items-center justify-center gap-2 text-[#717171] text-[13px] font-medium mb-4">
                <span>Centro</span>
                <span className="text-gray-300">•</span>
                <span>Valor min. R$ 19,90</span>
              </div>

              <div className="w-full h-[1px] bg-gray-100 mb-2"></div>

              <div className="flex items-center justify-between w-full py-2 cursor-pointer hover:bg-gray-50 transition rounded-lg text-left">
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" />
                  <span className="text-[#3e3e3e] font-bold text-sm">4.8 <span className="text-gray-400 font-normal ml-0.5">(3.248 avaliações)</span></span>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-300" />
              </div>

              <div className="w-full h-[1px] bg-gray-100 mb-2"></div>

              <div className="flex flex-col w-full text-left py-1">
                <div className="text-[14px] text-[#3e3e3e] font-medium">
                  Entrega padrão (30-60 min) <span className="text-[#05a65a] font-bold ml-1">Grátis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 mt-6">
        <div className="bg-gradient-to-r from-red-50 to-white rounded-2xl p-4 border border-red-100 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="flex -space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-white flex items-center justify-center">
              <img src="/images/ifood-smile.png" className="w-full h-full object-contain p-1" alt="iFood" />
            </div>
          </div>
          <div className="flex flex-col z-10 w-full">
            <div className="flex justify-between items-center mb-0.5">
              <p className="text-[10px] font-black text-[#EA1D2C] uppercase tracking-tight flex items-center gap-1">
                <Handshake className="w-3 h-3" /> PARCERIA DE SUCESSO
              </p>
              <div className="bg-[#EA1D2C] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">RESTAM 7</div>
            </div>
            <h4 className="text-[13px] font-extrabold text-gray-800 leading-tight mb-1">Cupom máximo ativado!</h4>
            <p className="text-[10.5px] text-gray-600 leading-snug">iFood Parceiros e TikTok juntos por você! Cupons exclusivos.</p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <CategoryNav
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryClick={(id) => {
            setActiveCategory(id);
            const element = document.getElementById(id);
            if (element) {
              const offset = 80; // Adjusted for sticky header
              const bodyRect = document.body.getBoundingClientRect().top;
              const elementRect = element.getBoundingClientRect().top;
              const elementPosition = elementRect - bodyRect;
              const offsetPosition = elementPosition - offset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
              });
            }
          }}
        />
      </div>

      <main className="p-4 space-y-8">
        {CATEGORIES.map((cat) => {
          const items = CATALOG.filter((p) => p.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <h3 className="text-lg font-bold text-[#3e3e3e] mb-4 flex items-center gap-2">
                {cat.title}
                {cat.id === "destaques" && (
                  <span className="text-[9px] bg-green-50 text-[#05a65a] border border-green-100 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap">
                    Válido no 1º pedido
                  </span>
                )}
              </h3>
              <div className="grid gap-4">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={handleProductClick}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <section className="bg-[#f7f7f7] pb-10 px-4">
        <h3 className="font-bold text-[#3e3e3e] text-lg mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#EA1D2C]" />
          Dúvidas Frequentes
        </h3>
        <div className="space-y-2">
          {[
            { q: "Qual o prazo de entrega?", a: "Nosso prazo médio é de 30 a 45 minutos." },
            { q: "Quais formas de pagamento?", a: "Aceitamos PIX (Aprovação Imediata)." },
            { q: "Os produtos são frescos?", a: "Sim! Recebemos peixe fresco todos os dias." },
          ].map((faq, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
              <h4 className="font-semibold text-sm text-gray-700">{faq.q}</h4>
              <p className="mt-2 text-xs text-gray-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Summary Bar */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
          <button
            onClick={() => window.location.href = "/pedido"}
            className="w-full bg-[#EA1D2C] text-white rounded-xl py-4 px-6 flex items-center justify-between font-bold shadow-lg shadow-red-200 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-2 py-1 rounded text-xs">
                {cart.items.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
              <span>Ver sacola</span>
            </div>
            <span>{formatCurrency(total)}</span>
          </button>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={handleConfirmProduct}
      />
    </div>
  );
}

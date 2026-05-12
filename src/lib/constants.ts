import { Product, Addon } from "./types";

export const CATALOG: Product[] = [
  { id: "barca-ostentacao", category: "destaques", name: "Combo Ryūjin (120 peças)", desc: "O maior do cardápio! 40 Sashimis, 20 Joes, Camarão e muito mais.", price: 92.90, oldPrice: 319.90, img: "/images/combo-presidencial.webp", badge: "🔥 70% OFF APLICADO", hasAddons: true, isBait: true },
  { id: "combo-rodízio", category: "destaques", name: "Combo Taiyo (68 peças)", desc: "Sashimis variados + Niguiris + Uramakis + Joe e Hot Holls variados.", price: 47.90, oldPrice: 149.80, img: "/images/combo3.webp", badge: "MAIS VENDIDO", hasAddons: true, isBait: true },
  { id: "combo-individual", category: "destaques", name: "Combo Yamato (56 peças)", desc: "Para quem quer comer bem pagando pouco. Variedade incrível.", price: 39.90, oldPrice: 59.80, img: "/images/combo-koi.webp", badge: "CUPOM ATIVADO", hasAddons: true, isBait: true },
  { id: "temaki-isca", category: "destaques", name: "Combo Fujin (24 peças)", desc: "Oferta limitada. O melhor custo benefício para sua fome.", price: 29.90, oldPrice: 54.90, img: "/images/combo1.webp", badge: "PREÇO DE CUSTO", hasAddons: true, isBait: true },
  { id: "combo-hot-24", category: "destaques", name: "Combo Inari (19 peças)", desc: "Os melhores hot rolls, crocantes e recheados com muito cream cheese.", price: 19.90, oldPrice: 69.90, img: "/images/hothothot.webp", badge: "NOVIDADE", hasAddons: true, isBait: true },
  
  { id: "ceviche-tilapia", category: "entradas", name: "Ceviche Clássico", desc: "Cubos de peixe branco marinados no limão, cebola roxa, pimenta e coentro.", price: 29.90, img: "/images/ceviche_classico.webp", hasAddons: true },
  { id: "shimeji-manteiga", category: "entradas", name: "Shimeji na Manteiga", desc: "Cogumelos frescos refogados na manteiga, shoyu e cebolinha. 200g.", price: 24.90, img: "/images/entrada_shimeji.webp", hasAddons: true },
  { id: "carpaccio-salmao", category: "entradas", name: "Carpaccio de Salmão Trufado", desc: "Lâminas finíssimas de salmão com azeite trufado, flor de sal e raspas de limão siciliano.", price: 39.90, img: "/images/entrada_carpaccio.webp", badge: "PREMIUM", hasAddons: true },
  { id: "sunomono-especial", category: "entradas", name: "Sunomono Especial", desc: "Salada de pepino agridoce com kani, gergelim e cubos de salmão.", price: 14.90, img: "/images/entrada_sunomono.webp", hasAddons: true },
  
  { id: "temaki-salmao-grelhado", category: "temakis", name: "Temaki Salmão Grelhado", desc: "Salmão grelhado, cream cheese e tarê.", price: 22.90, img: "/images/temaki-grelhado.webp", hasAddons: true },
  { id: "temaki-camarao", category: "temakis", name: "Temaki Ebi (Camarão)", desc: "Camarões empanados crocantes, cream cheese e cebolinha.", price: 26.90, img: "/images/temaki-camarao.webp", hasAddons: true },
  { id: "temaki-sem-arroz", category: "temakis", name: "Temaki Fit (Sem Arroz)", desc: "Apenas salmão fresco, cream cheese e cebolinha enrolados na alga.", price: 29.90, img: "/images/temaki-sem-arroz.webp", badge: "LOW CARB", hasAddons: true },
  { id: "temaki-hot", category: "temakis", name: "Temaki Hot (Frito)", desc: "Temaki inteiro empanado e frito, com recheio de salmão e cream cheese.", price: 24.90, img: "/images/temaki-hot.webp", hasAddons: true },
  
  { id: "combo-salmao-lovers", category: "familia", name: "Combo Salmão Lovers (32 peças)", desc: "06 Sachimi salmão 10 joy Doritos 04 joy salmão 04 uramaki salmão 04 tatu-zinho de salmão 04 niguiri salmão.", price: 44.91, oldPrice: 119.90, img: "/images/combo-sakura.webp", hasAddons: true },
  { id: "combo-casal", category: "familia", name: "Combo Sushi Trufado (32 peças)", desc: "Variedade de sushis trufados e flambados com azeite trufado e flor de sal.", price: 69.90, oldPrice: 149.90, img: "/images/combo-casal.webp", hasAddons: true },
  
  { id: "uramakis-filadelfia", category: "classicos", name: "Uramaki Filadélfia (8 peças)", desc: "Arroz por fora, salmão e cream cheese por dentro.", price: 22.90, img: "/images/uramaki-filadelfia.webp", hasAddons: true },
  { id: "hossomaki-salmao", category: "classicos", name: "Hossomaki Salmão (8 peças)", desc: "O clássico rolinho com alga por fora e arroz por dentro.", price: 19.90, img: "/images/hossomaki-salmao.webp", hasAddons: true },
  { id: "joy-salmao", category: "classicos", name: "Joy Salmão (4 peças)", desc: "Bolinho de arroz envolto por salmão, coberto com batidinho de salmão e cebolinha.", price: 24.90, img: "/images/joy-salmao.webp", hasAddons: true },
  
  { id: "combo-hot-crocante", category: "hot-rolls", name: "Festival Hot Roll (30 peças)", desc: "30 Hot Rolls com MUITO Cream Cheese e Tarê. Crocância absurda.", price: 34.91, oldPrice: 89.90, img: "/images/combo-hot-fire.webp", hasAddons: true },
  { id: "hot-roll-camarao", category: "hot-rolls", name: "Hot Roll Camarão (10 peças)", desc: "Recheado com camarão e cream cheese.", price: 29.90, img: "/images/hot-roll-camarao.webp", hasAddons: true },
  
  { id: "yakisoba-misto", category: "yakisobas", name: "Yakisoba Clássico Misto", desc: "Carne e Frango com legumes e macarrão frito.", price: 29.90, img: "/images/yakisoba-misto.webp" },
  { id: "yakisoba-camarao", category: "yakisobas", name: "Yakisoba Camarão Premium", desc: "Camarões frescos, lula e legumes.", price: 34.90, img: "/images/yakisoba-camarao.webp" },
  
  { id: "harumaki-choco", category: "sobremesas", name: "Harumaki Nutella (2 peças)", desc: "Rolinho primavera crocante recheado com Nutella original.", price: 12.90, img: "/images/harumaki-nutella.webp" },
  { id: "banana-flambada", category: "sobremesas", name: "Banana Empanada com Canela", desc: "4 unidades. Crocante por fora, macia por dentro.", price: 9.90, img: "/images/banana-flambada.webp" },
  
  { id: "coca-cola", category: "bebidas", name: "Coca-Cola 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_1-BjLnVhPo.webp" },
  { id: "coca-zero", category: "bebidas", name: "Coca-Cola Zero 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_2-BcAIyQh4.webp" },
  { id: "coca-cola-2l", category: "bebidas", name: "Coca-Cola 2 Litros", desc: "Bebida Gelada.", price: 12.90, img: "/images/coca2lt.webp" },
  { id: "agua-sem-gas", category: "bebidas", name: "Água sem gás", desc: "Bebida Gelada.", price: 2.50, img: "/images/aguasemgas.avif" },
];

export const ADDONS: Addon[] = [
  { id: "cc-extra", name: "Cream Cheese Extra", price: 4.90 },
  { id: "wasabi", name: "Wasabi Extra", price: 0.00 },
  { id: "gengibre", name: "Gengibre Extra", price: 0.00 },
  { id: "tare", name: "Tarê Extra", price: 0.00 },
  { id: "hashi", name: "Hashi Extra", price: 0.00 }
];

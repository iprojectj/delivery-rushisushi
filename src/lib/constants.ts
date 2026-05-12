import { Product } from "./types";

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
  
  { id: "combo-salmao-lovers", category: "familia", name: "Combo Salmão Lovers (32 peças)", desc: "06 Sachimi salmão 10 joy Doritos 04 joy salmão 04 uramaki salmão 04 tatu-zinho de salmão 04 niguiri salmão. Sem arroz pra encher linguiça.", price: 44.91, oldPrice: 119.90, img: "/images/combo-sakura.webp", hasAddons: true },
  { id: "combo-casal", category: "familia", name: "Combo Sushi Trufado (32 peças)", desc: "04 Niguiri salmao flambado 04 Niguiri salmao com azeite trufado, raspa de limao ciciliano e flor de sal 04 Sashimi salmao com azeite trufado, raspa de limao ciciliano e flor de sal 04 Sashimi salmao flambado 04 Hot com couve 04 jyo flambado com couve 04 Jyo de salmao com azeite trufado 04 Jyo salmao flambado with shimeji", price: 69.90, oldPrice: 149.90, img: "/images/combo-casal.webp", hasAddons: true },
  
  { id: "uramakis-filadelfia", category: "classicos", name: "Uramaki Filadélfia (8 peças)", desc: "Arroz por fora, salmão e cream cheese por dentro.", price: 22.90, img: "/images/uramaki-filadelfia.webp", hasAddons: true },
  { id: "hossomaki-salmao", category: "classicos", name: "Hossomaki Salmão (8 peças)", desc: "O clássico rolinho com alga por fora e arroz por dentro.", price: 19.90, img: "/images/hossomaki-salmao.webp", hasAddons: true },
  { id: "joy-salmao", category: "classicos", name: "Joy Salmão (4 peças)", desc: "Bolinho de arroz envolto por salmão, coberto com batidinho de salmão e cebolinha.", price: 24.90, img: "/images/joy-salmao.webp", hasAddons: true },
  
  { id: "combo-hot-crocante", category: "hot-rolls", name: "Festival Hot Roll (30 peças)", desc: "30 Hot Rolls com MUITO Cream Cheese e Tarê. Crocância absurda.", price: 34.91, oldPrice: 89.90, img: "/images/combo-hot-fire.webp", hasAddons: true },
  { id: "hot-roll-camarao", category: "hot-rolls", name: "Hot Roll Camarão (10 peças)", desc: "Recheado com camarão e cream cheese.", price: 29.90, img: "/images/hot-roll-camarao.webp", hasAddons: true },
  
  { id: "yakisoba-misto", category: "yakisobas", name: "Yakisoba Clássico Misto", desc: "Carne e Frango com legumes e macarrão frito.", price: 29.90, img: "/images/yakisoba-misto.webp" },
  { id: "yakisoba-camarao", category: "yakisobas", name: "Yakisoba Camarão Premium", desc: "Camarões frescos, lula e legumes.", price: 34.90, img: "/images/yakisoba-camarao.webp" },
  { id: "yakisoba-vegetariano", category: "yakisobas", name: "Yakisoba Vegetariano", desc: "Legumes selecionados e shimeji na manteiga.", price: 24.90, img: "/images/yakisoba-vegetariano.webp" },
  
  { id: "harumaki-choco", category: "sobremesas", name: "Harumaki Nutella (2 peças)", desc: "Rolinho primavera crocante recheado com Nutella original.", price: 12.90, img: "/images/harumaki-nutella.webp" },
  { id: "banana-flambada", category: "sobremesas", name: "Banana Empanada com Canela", desc: "4 unidades. Crocante por fora, macia por dentro.", price: 9.90, img: "/images/banana-flambada.webp" },
  { id: "harumaki-doce-leite", category: "sobremesas", name: "Harumaki Doce de Leite (2 peças)", desc: "Recheio cremoso de doce de leite argentino.", price: 12.90, img: "/images/harumaki-doce.webp" },
  
  { id: "coca-cola", category: "bebidas", name: "Coca-Cola 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_1-BjLnVhPo.webp" },
  { id: "coca-zero", category: "bebidas", name: "Coca-Cola Zero 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_2-BcAIyQh4.webp" },
  { id: "fanta-guarana", category: "bebidas", name: "Fanta Guaraná 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_3-BB39tchP.webp" },
  { id: "fanta-uva", category: "bebidas", name: "Fanta Uva 350ml", desc: "Bebida Gelada.", price: 4.90, img: "/images/bebida_4-BU0jDof2.webp" },
  { id: "refri-jap-morango", category: "bebidas", name: "Refrigerante Japonês 350ml (Morango)", desc: "Bebida Gelada.", price: 6.90, img: "/images/japonesmorango.webp" },
  { id: "refri-jap-uva", category: "bebidas", name: "Refrigerante Japonês 350ml (Uva)", desc: "Bebida Gelada.", price: 6.90, img: "/images/japonesuva.webp" },
  { id: "coca-cola-2l", category: "bebidas", name: "Coca-Cola 2 Litros", desc: "Bebida Gelada.", price: 12.90, img: "/images/coca2lt.webp" },
  { id: "coca-cola-2l-zero", category: "bebidas", name: "Coca-Cola 2 Litros Zero", desc: "Bebida Gelada.", price: 12.90, img: "/images/coca2ltzero.webp" },
  { id: "fanta-laranja-2l", category: "bebidas", name: "Fanta Laranja 2 Litros", desc: "Bebida Gelada.", price: 12.90, img: "/images/fantalaranja2l.webp" },
  { id: "agua-sem-gas", category: "bebidas", name: "Água sem gás", desc: "Bebida Gelada.", price: 2.50, img: "/images/aguasemgas.avif" },
  { id: "agua-com-gas", category: "bebidas", name: "Água com gás", desc: "Bebida Gelada.", price: 2.50, img: "/images/bebida_6-CBZjy4rh.webp" }
];

export const ADDONS = [
  { name: "Cream Cheese Extra", price: 4.90, img: "/images/add_creamcheese.webp" },
  { name: "Wasabi Extra", price: 0.00, img: "/images/add_wasabi.webp" },
  { name: "Gengibre Extra", price: 0.00, img: "/images/add_gengibre.webp" },
  { name: "Tarê Extra", price: 0.00, img: "/images/add_tare.webp" },
  { name: "Hashi Extra", price: 0.00, img: "/images/add_hashi.webp" }
];

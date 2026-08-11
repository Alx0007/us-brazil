/**
 * ============================================================================
 *  CONFIGURAÇÃO DO SITE — é o único arquivo que muda de cliente para cliente.
 * ============================================================================
 *
 *  Para publicar uma nova loja:
 *    1. Duplique este arquivo, ajuste tudo abaixo e troque os arquivos de
 *       `public/assets/`.
 *    2. Não edite `app/page.tsx` nem `app/globals.css` — eles são o produto.
 *
 *  ATENÇÃO antes de colocar no ar (ver SETUP.md):
 *    - `reviews` e `proof` abaixo são DADOS DE DEMONSTRAÇÃO. Substitua por
 *      avaliações e números reais, ou remova. Publicar depoimento inventado
 *      como se fosse real é propaganda enganosa.
 *    - `contact` está com dados fictícios de propósito. Preencher é
 *      obrigatório: se escapar, o site manda ligação para o lugar errado.
 */

export type Burger = {
  name: string;
  kicker: string;
  /**
   * `null` enquanto o preço não estiver confirmado: a página mostra
   * "A definir" e o item sai dos dados estruturados, em vez de publicar um
   * número inventado.
   */
  price: number | null;
  ingredients: string[];
  description: string;
  image: string;
  /** Cor do brilho de fundo quando este item está ativo. */
  tone: string;
};

export type LineItem = {
  name: string;
  description: string;
  price: number;
};

export type Review = {
  quote: string;
  author: string;
  source: string;
};

export type StatItem = {
  icon: string;
  label: string;
  /** Número que conta até o valor ao entrar na tela. `null` = texto fixo. */
  value: number | null;
  /** Sufixo do número animado, ex.: "+". */
  suffix?: string;
  /** Texto exibido quando `value` é null, ex.: "100%". */
  display?: string;
};

// ---------------------------------------------------------------------------
// Marca
// ---------------------------------------------------------------------------

export const brand = {
  name: "US BRAZIL",
  logo: "/assets/brand-logo.webp",
  /** Frase curta do rodapé. */
  tagline: "Feito na hora, do jeito certo.",
};

// ---------------------------------------------------------------------------
// Idioma, moeda e formatação
// ---------------------------------------------------------------------------

export const locale = {
  /** Vai para o atributo <html lang>. */
  lang: "pt-BR",
  currency: "R$",
  /** "prefix" => R$ 32 · "suffix" => 32 DZD */
  currencyPosition: "prefix" as "prefix" | "suffix",
};

/** Texto no lugar do preço enquanto ele não foi confirmado. */
export const PRICE_TBD = "A definir";

export function formatPrice(value: number | null): string {
  if (value === null) return PRICE_TBD;
  // Preço redondo sai sem centavos ("R$ 32"); com centavos, sempre com as duas
  // casas ("R$ 29,90", nunca "R$ 29,9").
  const amount = value.toLocaleString(locale.lang, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return locale.currencyPosition === "prefix"
    ? `${locale.currency} ${amount}`
    : `${amount} ${locale.currency}`;
}

/** 1 -> "01", 12 -> "12". Usado nos contadores das seções. */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Tema — injetado como CSS custom properties pelo layout
// ---------------------------------------------------------------------------

export const theme = {
  /** Cor principal da marca. */
  brand: "#feb506",
  /** Mesma cor em canais RGB, para uso em rgba(). Precisa acompanhar `brand`. */
  brandRgb: "254, 181, 6",
  /** Texto e ícones sobre superfícies preenchidas com `brand`. */
  onBrand: "#0b0b0b",
  /** Texto secundário sobre `brand`. */
  onBrandSoft: "rgba(11, 11, 11, .62)",
  /** Destaque suave — preços, olhos-de-boi, detalhes. */
  accent: "#ffd970",
  ink: "#0b0b0b",
  ink2: "#151515",
  paper: "#f3efe8",
};

/** Converte `theme` em um bloco `:root { --brand: …; }`. */
export function themeToCss(): string {
  const vars = Object.entries(theme)
    .map(([key, value]) => {
      const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      return `--${name}:${value}`;
    })
    .join(";");
  return `:root{${vars}}`;
}

// ---------------------------------------------------------------------------
// Contato
// ---------------------------------------------------------------------------

export const contact = {
  phoneDisplay: "(11) 98272-3746",
  phoneHref: "tel:+5511982723746",
  whatsappHref: "https://wa.me/5511982723746",
  /**
   * Cardápio online. É o destino de todo botão "Pedir agora" e de cada item do
   * cardápio. Deixe "" para os botões voltarem a cair no telefone.
   */
  orderHref: "https://usbrazilsteakhouse.menudino.com/",
  address: {
    street: "R. Comendador João Torquarto Lazarini, 170",
    district: "Vila Nova Bonsucesso",
    city: "Guarulhos",
    region: "SP",
    postalCode: "07175-060",
    /** Código de país de duas letras. */
    country: "BR",
  },
  mapsHref:
    "https://www.google.com/maps/place/us+brazil+steak+house/data=!4m2!3m1!1s0x94ce89425d9256b1:0xce833dc08ddbcace",
  instagramHref: "https://www.instagram.com/usbrazilsteakhouse/",
  /** Opcional — deixe "" para esconder o link no rodapé. */
  facebookHref: "https://www.facebook.com/usbrazilsteakhose/",
  /** Horário por extenso, como aparece na página. */
  hours: "Segunda a sábado, das 11h às 23h",
  services: "Salão · Retirada · iFood · 99Food · Keeta",
  /** Tipo de cozinha e faixa de preço, para os dados estruturados. */
  cuisine: "Hambúrguer",
  /** "$" a "$$$$", ou uma faixa como "R$ 30 - R$ 60". */
  priceRange: "$$",
};

/** Endereço quebrado em linhas para exibição. */
export function addressLines(): string[] {
  const { street, district, city, region, postalCode } = contact.address;
  return [
    district ? `${street} — ${district}` : street,
    `${city}, ${region} ${postalCode}`.trim(),
  ];
}

/**
 * Horário estruturado, lido pelo Google para exibir "aberto agora" na busca.
 * Precisa bater com `contact.hours`, que é o texto mostrado na página.
 *
 * Os nomes dos dias são vocabulário do schema.org e ficam em inglês mesmo.
 * Separe em várias entradas quando o horário variar na semana, por exemplo
 * uma para Monday–Thursday e outra para Friday–Sunday.
 */
export const openingHours = [
  {
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    opens: "11:00",
    closes: "23:00",
  },
];

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const seo = {
  /** Domínio final do cliente. Necessário para o preview de link funcionar. */
  url: "https://exemplo.com.br",
  title: "US BRAZIL — Carne na Brasa | Guarulhos",
  description:
    "Hambúrgueres artesanais, batatas recheadas e molhos da casa em Guarulhos. Salão, retirada e delivery.",
  /** Imagem do preview em WhatsApp e redes. 1200×630 é o ideal. */
  ogImage: "/assets/hero-burger.webp",
};

// ---------------------------------------------------------------------------
// Navegação
// ---------------------------------------------------------------------------

export const navLinks: Array<[label: string, href: string]> = [
  ["Início", "#home"],
  ["Cardápio", "#menu"],
  ["A casa", "#about"],
  ["Avaliações", "#reviews"],
  ["Contato", "#contact"],
];

// ---------------------------------------------------------------------------
// Seções da página
// ---------------------------------------------------------------------------

export type SectionKey =
  | "hero"
  | "manifesto"
  | "assembly"
  | "menu"
  | "explode"
  | "fries"
  | "pasta"
  | "sides"
  | "drinks"
  | "about"
  | "stats"
  | "reviews"
  | "contact";

/**
 * Quais seções aparecem e em que ordem. Remova uma linha para desligar a seção
 * (uma pizzaria não precisa de "batatas recheadas"); mova para reordenar.
 *
 * Links de navegação que apontem para seções removidas somem sozinhos.
 *
 * Ao reordenar, olhe o resultado: as seções alternam fundo claro e escuro de
 * propósito. `manifesto`, `fries`, `drinks` e `reviews` são claras; o resto é
 * escuro. Duas claras seguidas achatam o ritmo visual da página.
 */
export const sections: SectionKey[] = [
  "hero",
  "manifesto",
  "assembly",
  "menu",
  "explode",
  "fries",
  // `drinks` vem depois de `about` para não ficar clara logo após `fries`.
  "about",
  "drinks",
  "stats",
  "reviews",
  "contact",
];

// ---------------------------------------------------------------------------
// Textos das seções
// ---------------------------------------------------------------------------

export const copy = {
  hero: {
    overline: "Hambúrguer artesanal · Guarulhos",
    titleTop: "CARNE",
    titleOutline: "NA BRASA.",
    labelLeft: "Vila Nova Bonsucesso\nGuarulhos · SP",
    labelRight: "Seg a Sáb\n11h às 23h",
    ctaPrimary: "Ver opções",
    ctaSecondary: "Pedir agora",
    image: "/assets/hero-burger.webp",
    /** ⚠️ "500+" ainda é número de demonstração — confirme antes de publicar. */
    proof: [
      { value: "4,5", label: "★★★★★", note: "Nota no Google" },
      { value: "500+", label: "Avaliações", note: "De clientes reais" },
      { value: "03", label: "Formas de pedir", note: "Salão · Retirada · Delivery" },
    ],
    scrollLabel: "Role",
  },

  manifesto: {
    index: "01 / A CASA",
    lineTop: "NÃO É FAST FOOD.",
    lineBottom: "É COMIDA, FEITA RÁPIDO.",
    side: "Cada mordida conta: carne de verdade, molhos da casa, camadas generosas e nenhum atalho.",
  },

  assembly: {
    eyebrow: "Montado, não empilhado",
    titleTop: "CADA CAMADA",
    titleBottom: "TEM SEU LUGAR.",
    body: "Crocância na hora, carne quente, queijo derretido e molhos feitos aqui. Veja o clássico da casa se montando.",
    note: "Role para montar",
    image: "/assets/burger-assembly-real.png",
  },

  menu: {
    eyebrow: "Os clássicos da casa",
    titleTop: "ESCOLHA SEU",
    titleBottom: "PERSONAGEM.",
    intro: "Cada um com sua personalidade. Role para conhecer a coleção.",
  },

  explode: {
    eyebrow: "O cardápio continua",
    titleTop: "MUITO ALÉM DO",
    titleBottom: "HAMBÚRGUER.",
  },

  fries: {
    eyebrow: "Porções",
    titleTop: "VAI COM",
    titleBottom: "TUDO.",
    intro: "Porções de 300g para dividir — batata dourada, cheddar, bacon flocado e dadinho de tapioca.",
    image: "/assets/loaded-fries.webp",
    orbit: "PARA DIVIDIR · QUENTE · GENEROSA · ",
  },

  pasta: {
    eyebrow: "Não é acompanhamento",
    titleTop: "MASSA COM",
    titleBottom: "PRESENÇA.",
    image: "/assets/pasta.webp",
    imageNote: "Servida quente\nFinalizada na chama",
  },

  sides: {
    eyebrow: "Para acompanhar",
    titleTop: "COISA PEQUENA.",
    titleBottom: "ENERGIA GRANDE.",
  },

  drinks: {
    eyebrow: "Bem gelado",
    titleTop: "O ACOMPANHANTE",
    titleBottom: "PERFEITO.",
    items: [
      { name: "Refrigerante 350ml", price: 8 },
      { name: "Refrigerante 600ml", price: 12 },
    ],
  },

  about: {
    eyebrow: "Feito diferente",
    titleTop: "GENEROSIDADE",
    titleMiddle: "É NOSSA",
    titleBottom: "ASSINATURA.",
    cards: [
      {
        modifier: "beef",
        title: "Carne de verdade",
        body: "Sabor grande começa na base certa: carne suculenta, no ponto, em todos os clássicos da casa.",
      },
      {
        modifier: "sauces",
        title: "Molhos da casa",
        body: "Clássico, chimichurri, chorizo ou queijo: nossos molhos dão a cada item um caráter próprio.",
      },
      {
        modifier: "portions",
        title: "Nada de porção pequena",
        body: "Venha com fome. A gente monta pratos generosos, que ficam tão bons quanto parecem.",
      },
    ],
  },

  /** ⚠️ "500+" ainda é número de demonstração — confirme antes de publicar. */
  stats: [
    { icon: "★", value: 4.5, suffix: "", label: "Nota no Google" },
    { icon: "↗", value: 500, suffix: "+", label: "Avaliações reais" },
    { icon: "◆", value: null, display: "100%", label: "Artesanal" },
    { icon: "⚡", value: null, display: "RÁPIDO", label: "Seg a Sáb" },
  ] as StatItem[],

  reviews: {
    eyebrow: "O que dizem",
    titleTop: "APROVADO",
    titleBottom: "NA VIZINHANÇA.",
    intro: "Centenas de avaliações — e muita embalagem vazia.",
  },

  contact: {
    eyebrow: "Seu próximo passo",
    title: "COM FOME?",
    body: "Monte seu pedido no cardápio online e a gente prepara.",
    cta: "Pedir agora",
    labels: {
      phone: "Telefone",
      address: "Onde estamos",
      services: "Serviços",
      hours: "Funcionamento",
    },
  },

  footer: {
    backToTop: "Voltar ao topo ↑",
    instagram: "Instagram",
    facebook: "Facebook",
    maps: "Google Maps",
  },
};

// ---------------------------------------------------------------------------
// Cardápio
// ---------------------------------------------------------------------------

/** ⚠️ Os 5 preços estão `null` — nenhum veio nas cartelas. Preencher antes de publicar. */
export const burgers: Burger[] = [
  {
    name: "Us Brazil",
    kicker: "A obra da casa.",
    price: null,
    ingredients: [
      "Blend 160g",
      "Hambúrguer de Catupiry empanado",
      "Pão brioche",
      "Couve crispy",
      "Cheddar e geleia agridoce",
    ],
    description: "Blend de 160g com hambúrguer de Catupiry empanado, couve crispy e geleia agridoce levemente apimentada.",
    image: "/assets/burger-us-brazil.webp",
    tone: "#feb506",
  },
  {
    name: "Us Cheddar",
    kicker: "Cheddar até o fim.",
    price: null,
    ingredients: [
      "Blend 160g",
      "Pão australiano",
      "Creme de cheddar",
      "Cebola caramelizada",
      "Bacon flocado",
    ],
    description: "Creme de cheddar escorrendo, cebola caramelizada e bacon flocado no pão australiano.",
    image: "/assets/burger-us-cheddar.webp",
    tone: "#ffc93c",
  },
  {
    name: "Us Chicken",
    kicker: "Crocância de verdade.",
    price: null,
    ingredients: [
      "Filé empanado no panko",
      "Pão francês",
      "Molho especial",
      "Alface americana",
      "Tomate",
    ],
    description: "Filé empanado no panko, muita crocância, molho especial e salada no pão francês.",
    image: "/assets/burger-us-chicken.webp",
    tone: "#ffdc6b",
  },
  {
    name: "Us Nachos",
    kicker: "Sabor de nachos.",
    price: null,
    ingredients: [
      "Blend 160g",
      "Pão brioche",
      "Fatias de bacon",
      "Creme de cheddar",
      "Doritos",
    ],
    description: "Creme de cheddar, fatias de bacon e Doritos por cima: um verdadeiro sabor de nachos.",
    image: "/assets/burger-us-nachos.webp",
    tone: "#f5a623",
  },
  {
    name: "Us Tasty",
    kicker: "O clássico bem feito.",
    price: null,
    ingredients: [
      "Blend 160g",
      "Pão de gergelim",
      "Cebola caramelizada",
      "Queijo prato",
      "Maionese verde da casa",
    ],
    description: "Cebola caramelizada, queijo prato, alface, tomate e nossa maionese verde no pão de gergelim.",
    image: "/assets/burger-us-tasty.webp",
    tone: "#ffb020",
  },
];

/** Seção "Porções" — a chave continua `fries` porque é o que a página usa. */
export const fries: LineItem[] = [
  { name: "Batata Simples", price: 19.97, description: "Porção de batata 300g" },
  { name: "Batata Turbo", price: 29.9, description: "Batata 300g · cheddar · bacon flocado" },
  { name: "Dadinho de Tapioca", price: 35.9, description: "Dadinho de tapioca 300g · geleia agridoce levemente apimentada" },
];

export const pasta: LineItem[] = [
  { name: "Mamma Mia", price: 44, description: "Talharim · creme de frango · cogumelo · queijo gratinado" },
  { name: "Bad MF", price: 48, description: "Talharim · carne · pastrami · molho de chorizo · queijo gratinado" },
];

export const sides: LineItem[] = [
  { name: "Crunchbox", price: 28, description: "Frango empanado 200g + molho" },
  { name: "Fryzza", price: 22, description: "Muçarela empanada + molho" },
  { name: "Crispz", price: 16, description: "Batata frita + molho" },
  { name: "Crispy Balls", price: 26, description: "Frango · carne · queijo · 6 un" },
];

/**
 * ⚠️ DEMONSTRAÇÃO. Substitua por avaliações reais (copiadas do perfil do
 * cliente) ou deixe a lista vazia — a seção some sozinha.
 */
export const reviews: Review[] = [
  { quote: "Um dos melhores hambúrgueres da região.", author: "Ana P.", source: "Avaliação de cliente" },
  { quote: "O melhor lanche que já comi, sem exagero.", author: "Rafael M.", source: "Avaliação de cliente" },
  { quote: "Atendimento rápido e qualidade impecável.", author: "Juliana S.", source: "Avaliação de cliente" },
  { quote: "Porção generosa e sabor absurdo.", author: "Bruno T.", source: "Avaliação de cliente" },
];

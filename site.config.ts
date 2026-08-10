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
  price: number;
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

export function formatPrice(value: number): string {
  const amount = value.toLocaleString(locale.lang, {
    minimumFractionDigits: 0,
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
// Contato  ⚠️  DADOS FICTÍCIOS — trocar antes de publicar
// ---------------------------------------------------------------------------

export const contact = {
  phoneDisplay: "(11) 90000-0000",
  phoneHref: "tel:+5511900000000",
  whatsappHref: "https://wa.me/5511900000000",
  address: {
    street: "Rua Exemplo, 123",
    district: "Centro",
    city: "Guarulhos",
    region: "SP",
    postalCode: "07000-000",
    /** Código de país de duas letras. */
    country: "BR",
  },
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Rua+Exemplo+123+Guarulhos",
  instagramHref: "https://www.instagram.com/seu_usuario/",
  /** Horário por extenso, como aparece na página. */
  hours: "Todos os dias, das 18h à 1h",
  services: "Salão · Retirada · Delivery",
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
      "Sunday",
    ],
    opens: "18:00",
    closes: "01:00",
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
  "pasta",
  "drinks",
  "about",
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
    labelLeft: "Centro\nDesde o primeiro dia",
    labelRight: "Todo dia\nAté 1h",
    ctaPrimary: "Ver cardápio",
    ctaSecondary: "Ligar agora",
    image: "/assets/hero-burger.webp",
    /** ⚠️ Números de demonstração — confirme antes de publicar. */
    proof: [
      { value: "4,8", label: "★★★★★", note: "Nota no Google" },
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
    eyebrow: "Batatas recheadas",
    titleTop: "VAI COM",
    titleBottom: "TUDO.",
    intro: "Batata dourada, molhos da casa e recheio sem economia. Feita para dividir — se você quiser.",
    image: "/assets/loaded-fries.webp",
    orbit: "RECHEADA · CREMOSA · GENEROSA · ",
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

  /** ⚠️ Números de demonstração — confirme antes de publicar. */
  stats: [
    { icon: "★", value: 4.8, suffix: "", label: "Nota no Google" },
    { icon: "↗", value: 500, suffix: "+", label: "Avaliações reais" },
    { icon: "◆", value: null, display: "100%", label: "Artesanal" },
    { icon: "⚡", value: null, display: "RÁPIDO", label: "Todo dia" },
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
    body: "Ligue e a gente prepara seu pedido.",
    cta: "Ligar agora",
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
    maps: "Google Maps",
  },
};

// ---------------------------------------------------------------------------
// Cardápio
// ---------------------------------------------------------------------------

export const burgers: Burger[] = [
  {
    name: "Cruncher",
    kicker: "Crocante. Direto. Clássico.",
    price: 32,
    ingredients: ["Frango empanado", "Queijo", "Molho da casa"],
    description: "O crocante essencial, feito para acertar já na primeira mordida.",
    image: "/assets/burger-cruncher.webp",
    tone: "#feb506",
  },
  {
    name: "Grillz",
    kicker: "Direto da chapa.",
    price: 34,
    ingredients: ["Carne grelhada", "Queijo", "Molho da casa"],
    description: "Carne suculenta e queijo derretendo, sem nada para esconder.",
    image: "/assets/burger-grillz.webp",
    tone: "#ffc93c",
  },
  {
    name: "Cheesy AF",
    kicker: "Queijo no limite.",
    price: 46,
    ingredients: ["Frango ou carne", "Muçarela empanada", "Molho de queijo"],
    description: "Uma pilha derretida para quem leva queijo a sério. Escolha frango ou carne.",
    image: "/assets/burger-cheesy-af.webp",
    tone: "#ffdc6b",
  },
  {
    name: "Seaquel",
    kicker: "O mar, remixado.",
    price: 52,
    ingredients: ["Peixe empanado", "Camarão empanado", "Kani", "Molho rouille"],
    description: "Ousado, crocante e fresco, com um final marcante de molho rouille.",
    image: "/assets/burger-seaquel.webp",
    tone: "#f5a623",
  },
  {
    name: "Bad Guy",
    kicker: "Perigosamente bom.",
    price: 49,
    ingredients: ["Carne", "Pastrami", "Cebola caramelizada", "Molho de chorizo"],
    description: "Pastrami defumado, carne encorpada e cebola doce com um chute de chorizo.",
    image: "/assets/burger-bad-guy.webp",
    tone: "#e8890c",
  },
  {
    name: "Bad Girl",
    kicker: "Doce, com fio de corte.",
    price: 49,
    ingredients: ["Frango defumado", "Queijo", "Cebola caramelizada", "Tomate com chorizo"],
    description: "Frango defumado na casa, cebola caramelizada e tomate apimentado.",
    image: "/assets/burger-bad-girl.webp",
    tone: "#ffb020",
  },
  {
    name: "US BRAZIL",
    kicker: "A obra da casa.",
    price: 56,
    ingredients: ["Carne", "Filé", "Muçarela empanada", "Chimichurri"],
    description: "Nossa composição assinada de carne dupla, fechada com muçarela crocante e chimichurri.",
    image: "/assets/burger-signature.webp",
    tone: "#feb506",
  },
];

export const fries: LineItem[] = [
  { name: "Brux", price: 34, description: "Frango empanado · molho de queijo · gratinado" },
  { name: "Chunk", price: 36, description: "Carne · gouda · molho de queijo · gratinado" },
  { name: "Butter Chicken", price: 38, description: "Frango · creme de manteiga · especiarias suaves" },
  { name: "Spice", price: 36, description: "Frango · molho de queijo · gratinado" },
  { name: "Rage", price: 42, description: "Carne · pastrami · chorizo · gratinado" },
  { name: "Badass", price: 42, description: "Frango defumado · tomate com chorizo · gratinado" },
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

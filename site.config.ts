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
 *  REGRAS QUE NÃO MUDAM DE CLIENTE (ver SETUP.md):
 *    - `reviews` só aceita avaliação real, copiada do perfil do cliente.
 *      Encurtar cabe; reescrever não — o que está entre aspas precisa ter sido
 *      dito. Depoimento inventado é propaganda enganosa. Lista vazia esconde
 *      a seção, o que é sempre melhor que inventar.
 *    - `contact` precisa ser preenchido antes de publicar: se um dado de
 *      exemplo escapar, o site manda ligação para o lugar errado.
 *    - Nota e volume de avaliações (`copy.stats`, `copy.hero.proof`) têm que
 *      bater com o perfil real.
 *
 *  Nesta instância: contato e avaliações são reais. O "500+" em `proof` e
 *  `stats` ainda é número de demonstração — confirmar antes de publicar.
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
  /** Foto do lanche recortada, em PNG/WebP com fundo transparente. */
  image: string;
  /**
   * Arte do cartão: fundo branco já com nome, subtítulo e chama. O `image`
   * acima é sobreposto a ela. Exportar do Canva em 1563×1563, deixando vazio
   * o espaço onde o lanche entra.
   */
  card: string;
  /** Cor do brilho de fundo quando este item está ativo. */
  tone: string;
};

export type LineItem = {
  name: string;
  /** Opcional: sem ela, o item mostra só nome e preço. */
  description?: string;
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
  /**
   * Endereço público do site. Alimenta o preview de link, o sitemap e os
   * dados estruturados.
   *
   * O Netlify e a Vercel expõem a URL do deploy em variável de ambiente, então
   * em teste isso se resolve sozinho — não precisa de domínio. Quando o
   * domínio definitivo existir, troque o valor de baixo ou configure
   * `SITE_URL` no painel da hospedagem.
   */
  url:
    process.env.SITE_URL ??
    process.env.URL ??                 // Netlify
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    "http://localhost:3000",
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
  | "dish"
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
  // `dish` é escura e separa `fries` de `drinks`, que são claras — resolve o
  // mesmo problema que antes obrigava `drinks` a vir depois de `about`.
  "dish",
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
    image: "/assets/porcoes.webp",
    /** Texto que gira dentro do círculo. Vazio esconde o elemento. */
    orbit: "",
  },

  /**
   * Seção de prato principal. Nome genérico de propósito: no template original
   * era massa, aqui é prato feito, e no próximo cliente pode ser pizza.
   *
   * A foto é o prato recortado do fundo preto, para o degradê do container
   * aparecer em volta e a sombra seguir a borda redonda do prato.
   */
  dish: {
    eyebrow: "Almoço feito na hora",
    titleTop: "PRATO QUE",
    titleBottom: "SUSTENTA.",
    image: "/assets/prato-feito.webp",
    imageNote: "Prato no ponto\nSai direto do fogão",
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
      /**
       * `art` posiciona a foto no cenário, sem mexer na ordem do texto:
       *   spot   — "bottom" (esquerda, embaixo) ou "top" (direita, em cima)
       *   height — altura da foto em px, antes do ajuste de celular
       *   offset — quanto vaza para fora da seção; mais negativo, mais some
       *            atrás da borda. A seção corta o excesso.
       */
      {
        name: "Refrigerante",
        price: 7.9,
        image: "/assets/drink-refri.webp",
        art: { spot: "top" as const, height: 360, offset: -40 },
      },
      {
        name: "Suco",
        price: 11.9,
        image: "/assets/drink-suco.webp",
        art: { spot: "bottom" as const, height: 610, offset: -225 },
      },
    ],
  },

  about: {
    eyebrow: "Feito diferente",
    titleTop: "GENEROSIDADE",
    titleMiddle: "É NOSSA",
    titleBottom: "ASSINATURA.",
    /** A foto entra atrás do texto, esmaecida. Paisagem funciona melhor. */
    cards: [
      {
        title: "Carne de verdade",
        body: "Sabor grande começa na base certa: carne suculenta, no ponto, em todos os clássicos da casa.",
        image: "/assets/about-beef.webp",
      },
      {
        title: "Molhos da casa",
        body: "Clássico, chimichurri, chorizo ou queijo: nossos molhos dão a cada item um caráter próprio.",
        image: "/assets/about-sauces.webp",
      },
      {
        title: "Nada de porção pequena",
        body: "Venha com fome. A gente monta pratos generosos, que ficam tão bons quanto parecem.",
        image: "/assets/about-portions.webp",
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
/**
 * Onde o hambúrguer recortado fica sobre o cartão. Os dois valores são
 * porcentagens do cartão — é aqui que se ajusta o encaixe, sem tocar no CSS.
 *
 * Na arte atual o texto termina em 18% da altura e a chama começa em 66%,
 * então o espaço livre vai de ~20% até a base.
 */
export const cardPhoto = {
  /** Centro vertical do lanche. Menor sobe, maior desce. */
  top: 60,
  /** Centro horizontal. 50 = centralizado; acima disso, desloca à direita. */
  left: 50,
  /** Largura do lanche. Maior aumenta. */
  width: 78,
};

export const burgers: Burger[] = [
  {
    name: "Us Brazil",
    kicker: "A obra da casa.",
    price: 41.9,
    ingredients: [
      "Blend 160g",
      "Hambúrguer de Catupiry empanado",
      "Pão brioche",
      "Couve crispy",
      "Cheddar e geleia agridoce",
    ],
    description: "Blend de 160g com hambúrguer de Catupiry empanado, couve crispy e geleia agridoce levemente apimentada.",
    image: "/assets/burger-us-brazil.webp",
    card: "/assets/card-us-brazil.webp",
    tone: "#feb506",
  },
  {
    name: "Us Cheddar",
    kicker: "Cheddar até o fim.",
    price: 40.9,
    ingredients: [
      "Blend 160g",
      "Pão australiano",
      "Creme de cheddar",
      "Cebola caramelizada",
      "Bacon flocado",
    ],
    description: "Creme de cheddar escorrendo, cebola caramelizada e bacon flocado no pão australiano.",
    image: "/assets/burger-us-cheddar.webp",
    card: "/assets/card-us-cheddar.webp",
    tone: "#ffc93c",
  },
  {
    name: "Us Chicken",
    kicker: "Crocância de verdade.",
    price: 28.9,
    ingredients: [
      "Filé empanado no panko",
      "Pão francês",
      "Molho especial",
      "Alface americana",
      "Tomate",
    ],
    description: "Filé empanado no panko, muita crocância, molho especial e salada no pão francês.",
    image: "/assets/burger-us-chicken.webp",
    card: "/assets/card-us-chicken.webp",
    tone: "#ffdc6b",
  },
  {
    name: "Us Nachos",
    kicker: "Sabor de nachos.",
    price: 36.9,
    ingredients: [
      "Blend 160g",
      "Pão brioche",
      "Fatias de bacon",
      "Creme de cheddar",
      "Doritos",
    ],
    description: "Creme de cheddar, fatias de bacon e Doritos por cima: um verdadeiro sabor de nachos.",
    image: "/assets/burger-us-nachos.webp",
    card: "/assets/card-us-nachos.webp",
    tone: "#f5a623",
  },
  {
    name: "Us Tasty",
    kicker: "O clássico bem feito.",
    price: 28.9,
    ingredients: [
      "Blend 160g",
      "Pão de gergelim",
      "Cebola caramelizada",
      "Queijo prato",
      "Maionese verde da casa",
    ],
    description: "Cebola caramelizada, queijo prato, alface, tomate e nossa maionese verde no pão de gergelim.",
    image: "/assets/burger-us-tasty.webp",
    card: "/assets/card-us-tasty.webp",
    tone: "#ffb020",
  },
];

/** Seção "Porções" — a chave continua `fries` porque é o que a página usa. */
export const fries: LineItem[] = [
  { name: "Batata Simples", price: 19.97, description: "Porção de batata 300g" },
  { name: "Batata Turbo", price: 29.9, description: "Batata 300g · cheddar · bacon flocado" },
  { name: "Dadinho de Tapioca", price: 35.9, description: "Dadinho de tapioca 300g · geleia agridoce levemente apimentada" },
];

/**
 * Pratos feitos. Sem `description` por enquanto — o item mostra só nome e
 * preço. Para listar o que acompanha cada um, é só preencher.
 */
export const dish: LineItem[] = [
  {
    name: "Filé de Frango",
    price: 22.9,
    description: "Grelhado. Acompanha arroz branco, feijão carioca, fritas e salada",
  },
  {
    name: "Parmegiana Contra Filé",
    price: 49.9,
    description: "Acompanha arroz e fritas",
  },
  {
    name: "Panquecas",
    price: 36.9,
    description: "Acompanha arroz, fritas e salada",
  },
];

export const sides: LineItem[] = [
  { name: "Crunchbox", price: 28, description: "Frango empanado 200g + molho" },
  { name: "Fryzza", price: 22, description: "Muçarela empanada + molho" },
  { name: "Crispz", price: 16, description: "Batata frita + molho" },
  { name: "Crispy Balls", price: 26, description: "Frango · carne · queijo · 6 un" },
];

/**
 * Avaliações reais de clientes. As duas primeiras foram encurtadas para caber
 * no card, usando as palavras da própria pessoa — cortar é aceitável, reescrever
 * não: o que está entre aspas precisa ter sido dito.
 *
 * Lista vazia esconde a seção.
 */
export const reviews: Review[] = [
  {
    quote: "Todos muito bem servidos, bem montados e incrivelmente saborosos. O molho caseiro é um destaque à parte.",
    author: "Paula Spineli",
    source: "Avaliação no Google",
  },
  {
    quote: "A qualidade dos ingredientes e o sabor dos hambúrgueres foram incríveis. Atendimento muito atencioso.",
    author: "Jackson Oliveira",
    source: "Avaliação no Google",
  },
  {
    quote: "Tudo maravilhoso. O atendimento da Andressa e da Vitória foi muito bom, e o lanche é incrível.",
    author: "Erica Cardoso",
    source: "Avaliação no Google",
  },
  {
    quote: "Ambiente muito gostoso, atendimento maravilhoso e comida muito boa.",
    author: "Khetlelin Khawane",
    source: "Avaliação no Google",
  },
];

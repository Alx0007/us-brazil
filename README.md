# Landing page para restaurante

Site de página única para hamburgueria, construído com Next.js 16 (App Router),
React 19 e Tailwind CSS 4. Animações no scroll, cardápio completo e pedido por
clique-para-ligar.

Feito para ser revendido: **todo o conteúdo de um cliente vive em um único
arquivo**, `site.config.ts`. Publicar uma nova loja é preencher esse arquivo e
trocar as imagens — sem tocar em componente ou CSS.

Para colocar um cliente no ar, siga o [SETUP.md](SETUP.md).

## Requisitos

- Node.js `>=22.13.0`
- npm

## Começando

```bash
npm install
npm run dev
```

Depois abra http://localhost:3000.

## Scripts

| Script | Função |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | Roda o ESLint |
| `npm run images` | Regera o manifesto de dimensões das imagens |

`images` roda sozinho antes de `dev` e `build` — só chame na mão se trocar uma
imagem com o servidor já rodando.

Os quatro funcionam em Windows, macOS e Linux.

## Estrutura

```
site.config.ts        ⭐ conteúdo, contato, cardápio, cores e SEO do cliente
brand/                arte original da marca em alta (não é servida na web)
app/
  page.tsx            estrutura das seções — igual para todos os clientes
  layout.tsx          shell do documento, fontes, metadados, injeção do tema
  globals.css         só encadeia os arquivos de styles/ na ordem da cascata
  styles/             um arquivo por seção — igual para todos os clientes
  picture.tsx         imagem otimizada com dimensões automáticas
  structured-data.tsx JSON-LD de Restaurant, montado a partir da config
  sitemap.ts          sitemap.xml
  robots.ts           robots.txt
  image-manifest.json gerado — dimensões de public/assets/
scripts/
  image-manifest.mjs  gera o manifesto (roda antes de dev e build)
public/assets/        fotos dos produtos e das seções
```

A separação é proposital: `page.tsx` e `globals.css` são **o produto**, e
`site.config.ts` é **a instância**. Corrigir um bug em `page.tsx` vale para a
carteira inteira; editar `page.tsx` por cliente joga essa vantagem fora.

## Como funciona a personalização

**Cores.** Definidas em `theme`, dentro de `site.config.ts`, e injetadas pelo
layout como CSS custom properties que sobrescrevem os padrões do `globals.css`.
Nenhuma cor de marca fica escrita à mão no CSS.

Atenção ao par `brand` / `brandRgb`: são a mesma cor em formatos diferentes
(hex e canais RGB, este último para transparências). Precisam ser atualizados
juntos.

E ao `onBrand`: é a cor do texto sobre superfícies preenchidas com a cor da
marca. Marca clara pede texto escuro, marca escura pede texto claro. Errar aqui
deixa botões ilegíveis.

**Cardápio e listas.** `burgers`, `fries`, `pasta`, `sides` e `reviews` são
arrays. Contadores, numeração e grades se ajustam à quantidade de itens. Lista
vazia esconde a seção correspondente.

**Seções.** O array `sections` define quais seções existem e em que ordem —
remover uma linha desliga a seção, mover reordena. Links de navegação que
apontem para seções desligadas são filtrados automaticamente, então não sobra
link morto.

**Imagens.** `npm run images` lê `public/assets/` e grava as dimensões em
`app/image-manifest.json`; o componente `Picture` usa esse manifesto para
alimentar o `next/image`. É o que permite trocar fotos por cliente sem anotar
largura e altura em lugar nenhum, mantendo a reserva de espaço que evita
layout shift.

**Dados estruturados.** O JSON-LD de `Restaurant` é montado a partir de
`contact`, `openingHours` e `burgers`. Mantenha `contact.hours` (texto exibido)
e `openingHours` (estruturado) coerentes entre si.

**Moeda e idioma.** `locale` controla o `<html lang>`, o símbolo da moeda e se
ele vem antes ou depois do valor. Os preços são números; a formatação é
centralizada em `formatPrice`.

**Textos.** Todos em `copy`, agrupados por seção.

## Publicação

O site é totalmente estático, então roda em qualquer lugar que hospede Next.js.

**Vercel** — suba o repositório para o GitHub e importe em
[vercel.com/new](https://vercel.com/new). Framework, comando de build e
diretório de saída são detectados sozinhos; não há variável de ambiente.

**Qualquer outro lugar** — `npm run build` seguido de `npm start`.

## Acessibilidade e performance

- Respeita `prefers-reduced-motion` — toda animação é desligada quando pedido
- Imagens via `next/image`, com dimensões declaradas (sem layout shift)
- Landmarks semânticos e elementos interativos rotulados
- Texto sobre a cor da marca usa o token `onBrand`, calibrado para contraste

### Backlog de performance mobile

Auditoria de 10/08/2026: **6/10**. A estrutura mobile é sólida — navegação
dedicada, carrossel com scroll-snap no cardápio, zero overflow horizontal,
imagens com dimensões declaradas. O que pesa é carga de renderização.

Resolvido em 11/08/2026:

- As três fotos da seção "A casa" passaram de `background-image` para
  `next/image`, então deixaram de baixar em tamanho cheio no celular.
- Geist Mono saiu — era baixado e nunca aplicado.
- Os desfuques pesados caíram de 100px/82px/55px para no máximo 30px. Os dois
  maiores eram um círculo sólido borrado; viraram degradê radial, que suaviza
  de graça e deixa o desfoque só para tirar bandeamento.
- Nenhum alvo de toque abaixo de 44px, verificado em 320, 360, 390 e 430px.
- A escala tipográfica do celular foi refeita por seção: cinco títulos eram
  cortados pelo `overflow` das seções ou quebravam em cinco linhas, porque a
  escala vinha do texto original em inglês e as palavras em português são mais
  longas. A página encurtou ~2.200px.

Ainda em aberto:

- **13 regras com animação infinita** simultâneas (6 partículas, 3 vapores,
  2 órbitas, 2 fumaças, entre outras). Pausar as de seções fora da viewport
  reaproveitando o `IntersectionObserver` que o projeto já usa.
- A nota 6/10 era de análise estática — mede custos declarados, não fluidez
  observada. Para virar nota medida, falta um Lighthouse mobile com CPU
  throttling 4×.

### Outras limitações conhecidas

- O CSS usa propriedades físicas (`left`/`right`), então não suporta idiomas
  RTL sem reescrita.
- A otimização de imagem depende do runtime do Next. Em host estático puro
  (sem `next start` nem Vercel) é preciso configurar um loader ou
  `images.unoptimized`.
- A animação de montagem é calibrada para uma foto específica — ver o fim do
  [SETUP.md](SETUP.md).
- Rodar `npm run build` com o `next dev` ativo derruba o servidor de
  desenvolvimento: os dois escrevem no mesmo `.next`.
- Edições em CSS às vezes não recompilam com o servidor de desenvolvimento
  ligado — se um ajuste não aparecer, apague `.next` e reinicie.

## Licença

Defina os termos com o cliente por escrito antes da entrega. Se este código veio
de terceiros, confirme que a licença de origem permite revenda.

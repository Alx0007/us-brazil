# Checklist de publicação

Passo a passo para colocar uma nova loja no ar. Tudo acontece em
`site.config.ts` e em `public/assets/` — **não edite `app/page.tsx` nem
`app/globals.css`**, eles são o produto e valem para todos os clientes.

---

## 1. Marca

- [ ] `brand.name` — nome da loja (aparece no topo, no rodapé e na marca d'água da seção "A casa")
- [ ] `brand.logo` — trocar `public/assets/brand-logo.webp`
- [ ] `brand.tagline` — frase do rodapé
- [ ] `public/favicon.svg` — favicon

## 2. Cores

Só `theme.brand` e `theme.brandRgb` precisam mudar na maioria dos casos.

- [ ] `theme.brand` — cor principal em hex
- [ ] `theme.brandRgb` — **a mesma cor** em canais RGB (usada em transparências).
      Se esquecer de sincronizar, brilhos e sombras ficam na cor antiga.
- [ ] `theme.onBrand` — texto sobre a cor da marca. **Verifique o contraste.**
      Cor clara (amarelo, lima, ciano) pede texto escuro; cor escura (vinho,
      azul, roxo) pede texto claro. Abaixo de 4,5:1 o texto fica ilegível e
      reprova em acessibilidade.
- [ ] `theme.accent` — destaque secundário (preços, olhos-de-boi)

## 3. Contato ⚠️ obrigatório

Os valores que vêm no template são fictícios de propósito. Se algum escapar, o
site do cliente manda ligação para o lugar errado.

- [ ] `contact.phoneDisplay` e `contact.phoneHref` — **os dois**. O href usa
      formato internacional (`tel:+5511...`) para funcionar em qualquer celular.
- [ ] `contact.whatsappHref`
- [ ] `contact.address` — rua, bairro, cidade, UF e CEP em campos separados.
      As linhas exibidas na página são montadas a partir daí, e os mesmos
      dados alimentam os dados estruturados do Google.
- [ ] `contact.mapsHref` — de preferência o link real do perfil no Google Maps,
      não a busca por texto
- [ ] `contact.instagramHref`
- [ ] `contact.hours` — horário real, com hora de abertura, como texto
- [ ] `openingHours` — **o mesmo horário em formato estruturado**. É o que o
      Google lê para mostrar "aberto agora". Se divergir do texto acima, o site
      diz uma coisa e a busca mostra outra.
- [ ] `contact.services`, `contact.cuisine`, `contact.priceRange`

## 4. Cardápio

- [ ] `burgers` — nome, preço, ingredientes, descrição, foto e `tone` (cor do
      brilho de fundo) de cada item
- [ ] `fries`, `pasta`, `sides`, `copy.drinks.items`
- [ ] Fotos em `public/assets/`. Recorte em fundo escuro, quadradas, 1080×1080.
      Nada abaixo de 900px de lado: o site exibe até ~700px e imagem menor
      aparece borrada.
- [ ] Confirme alérgenos (peixe, crustáceo, leite, glúten) nas descrições

Listas são dinâmicas: contadores, numeração e grades se ajustam sozinhos à
quantidade de itens. Lista vazia esconde a seção.

As dimensões das imagens são lidas do arquivo por `npm run images`, que roda
sozinho antes de `dev` e `build`. Trocou uma foto, não precisa anotar tamanho
em lugar nenhum.

## 4b. Quais seções aparecem

O array `sections` controla **presença e ordem** ao mesmo tempo. Remova uma
linha para desligar a seção; mova para reordenar.

- [ ] Remova o que não se aplica ao cliente (uma pizzaria não tem "batatas
      recheadas"; uma loja sem massas não tem `pasta`)
- [ ] Confira o ritmo de fundo claro/escuro depois de reordenar — `manifesto`,
      `fries`, `drinks` e `reviews` são as seções claras

Links de navegação que apontem para seções removidas somem sozinhos, então não
há risco de link morto.

## 5. Conteúdo ⚠️ risco legal

- [ ] `reviews` — **substituir pelas avaliações reais do cliente** (copiadas do
      perfil dele) ou deixar `[]`. Publicar depoimento inventado como se fosse
      real é propaganda enganosa, e o risco volta para quem construiu o site.
- [ ] `copy.stats` e `copy.hero.proof` — nota e volume de avaliações precisam
      bater com a realidade. Prefira números arredondados ("4,5+", "500+") para
      não envelhecerem sozinhos.
- [ ] `copy.*` — todos os títulos e textos das seções

## 6. SEO e preview de link

- [ ] `seo.url` — domínio final. Sem isso o preview em WhatsApp não carrega, e
      o sitemap e os dados estruturados saem com URL errada.
- [ ] `seo.title` e `seo.description`
- [ ] `seo.ogImage` — imagem do preview, ideal 1200×630

O JSON-LD de `Restaurant`, o `sitemap.xml` e o `robots.txt` são gerados a partir
da config — não há nada para escrever à mão. Depois de publicar, valide em
[search.google.com/test/rich-results](https://search.google.com/test/rich-results)
e cadastre o site no Google Search Console.

Os dados estruturados **não declaram nota média** de propósito. Nota informada
pelo próprio site, sem avaliação verificável por trás, é motivo de penalização
pelo Google. A nota que aparece na busca vem do perfil do Google Business.

## 7. Antes de entregar

- [ ] `npm run lint` — sem erros
- [ ] `npm run build` — passa
- [ ] Testar no celular de verdade, não só no navegador redimensionado
- [ ] Clicar em todos os botões de ligar e conferir se o número está certo
- [ ] Buscar no projeto por dados do template que tenham escapado:
      `exemplo.com.br`, `90000-0000`, `Rua Exemplo`, `seu_usuario`

---

## A animação de montagem

A seção "cada camada tem seu lugar" recorta **uma foto específica** em 8 fatias
horizontais, com valores calibrados à mão em `globals.css` (`.ingredient--bottom`
até `.ingredient--top`).

Trocar a foto exige recalibrar os 8 `clip-path`. Não é automático. Ao orçar,
trate como serviço à parte — ou reaproveite a foto padrão, que funciona para
qualquer hamburgueria.

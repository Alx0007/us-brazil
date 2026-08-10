# Arte original da marca

Fontes em resolução cheia, **fora de `public/`** de propósito: nada aqui é
servido na web nem entra no manifesto de imagens. Serve para regerar os
derivados quando precisar de outro enquadramento ou tamanho.

| arquivo | o que é |
|---|---|
| `logo-original.png` | lockup completo, 1254×1254 — emblema + "US BRAZIL" + "STEAK HOUSE" |

## Derivados em uso

Gerados a partir daqui e versionados em `public/`:

- `public/assets/brand-logo.webp` — só o emblema (fogo + garfo e espátula),
  512×512, usado na barra do topo e no rodapé
- `public/assets/brand-lockup.webp` — lockup completo em 800px
- `public/icon-*.png` e `public/apple-icon.png` — favicons, gerados
  automaticamente do `brand-logo.webp` por `npm run icons`

## Como o emblema foi recortado

A caixa não foi escolhida no olho: as réguas brancas horizontais foram
mascaradas e o recorte saiu da caixa delimitadora do que sobrou — `x 443..845`,
`y 205..588` na arte de 1254px, mais 10% de respiro, completado para quadrado
com preto.

Duas armadilhas, se for refazer com outra arte:

1. O limite inferior precisa parar **antes** do texto. Cortar por fração fixa
   da altura pega as primeiras linhas das letras e estraga a medição — detecte
   a faixa horizontal vazia entre o emblema e o texto.
2. A máscara das réguas precisa de alguns pixels de folga, senão o contorno
   suavizado sobra como retângulos cinza sobre o preto.

Depois de trocar qualquer derivado, **apague `.next`**: o cache de imagem do
Next é indexado pelo caminho do arquivo, então regravar por cima com o mesmo
nome continua servindo a versão antiga.

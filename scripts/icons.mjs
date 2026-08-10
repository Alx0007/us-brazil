/**
 * Gera os ícones do site a partir de `public/assets/brand-logo.webp`.
 *
 * Roda junto do manifesto, antes de `dev` e `build`, para que trocar a logo do
 * cliente troque o favicon sem ninguém precisar lembrar.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "public", "assets", "brand-logo.webp");
const PUB = join(ROOT, "public");

/** Fundo usado quando a logo tem transparência — iOS não aceita alfa. */
const FUNDO = "#000000";

const saidas = [
  { arquivo: "icon-32.png", tamanho: 32 },
  { arquivo: "icon-192.png", tamanho: 192 },
  { arquivo: "icon-512.png", tamanho: 512 },
  { arquivo: "apple-icon.png", tamanho: 180 },
];

for (const { arquivo, tamanho } of saidas) {
  const buf = await sharp(SRC)
    .resize(tamanho, tamanho, { fit: "contain", background: FUNDO })
    .flatten({ background: FUNDO })
    .png()
    .toBuffer();
  await writeFile(join(PUB, arquivo), buf);
  console.log(`icons: ${arquivo} (${tamanho}px, ${Math.round(buf.length / 1024)} KB)`);
}

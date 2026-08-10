/**
 * Lê as dimensões de tudo que está em `public/assets/` e grava em
 * `app/image-manifest.json`.
 *
 * Existe porque o `next/image` precisa saber largura e altura, e num template
 * as imagens trocam a cada cliente. Em vez de obrigar quem publica a anotar
 * dimensões na config, elas são lidas do arquivo.
 *
 * Roda sozinho antes de `npm run dev` e `npm run build`. Para rodar na mão:
 *   npm run images
 */
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { dirname, extname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(ROOT, "public", "assets");
const OUT = join(ROOT, "app", "image-manifest.json");
const EXTS = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif", ".gif"]);

async function walk(dir, prefix = "/assets") {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = {};

  for (const entry of entries) {
    const full = join(dir, entry.name);
    const url = posix.join(prefix, entry.name);

    if (entry.isDirectory()) {
      Object.assign(found, await walk(full, url));
      continue;
    }
    if (!EXTS.has(extname(entry.name).toLowerCase())) continue;

    const { width, height } = await sharp(full).metadata();
    if (width && height) found[url] = { width, height };
  }

  return found;
}

const manifest = await walk(ASSETS);
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(sorted, null, 2) + "\n", "utf8");

console.log(`image-manifest: ${Object.keys(sorted).length} imagens mapeadas`);

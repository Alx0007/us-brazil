"use client";

import Image from "next/image";
import type { ReactEventHandler } from "react";
import manifest from "./image-manifest.json";

const dimensions: Record<string, { width: number; height: number }> = manifest;

type PictureProps = {
  src: string;
  alt: string;
  className?: string;
  /** Carrega com prioridade. Use só na imagem principal da dobra. */
  priority?: boolean;
  draggable?: boolean;
  /** Dica de tamanho renderizado, para o browser escolher a variante certa. */
  sizes?: string;
  onError?: ReactEventHandler<HTMLImageElement>;
};

/**
 * Imagem otimizada, com largura e altura vindas de `app/image-manifest.json`
 * (gerado por `npm run images` a partir de `public/assets/`).
 *
 * Ter as dimensões é o que evita layout shift e permite ao Next servir WebP
 * redimensionado. Imagens fora do manifesto — uma URL externa, por exemplo —
 * caem para `<img>` comum, que funciona mas não é otimizado.
 */
export function Picture({ src, alt, onError, ...rest }: PictureProps) {
  const size = dimensions[src];

  if (!size) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" onError={onError} {...rest} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size.width}
      height={size.height}
      onError={onError}
      {...rest}
    />
  );
}

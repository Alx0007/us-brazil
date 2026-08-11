import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * O Next só serve as qualidades declaradas aqui. 75 é o padrão e serve para
     * fundos de seção; 90 fica reservado às fotos de produto recortadas, onde a
     * compressão aparece na borda do recorte e no brilho do pão.
     */
    qualities: [75, 90],
  },
};

export default nextConfig;

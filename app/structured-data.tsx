import {
  addressLines,
  brand,
  burgers,
  contact,
  locale,
  openingHours,
  seo,
} from "@/site.config";

const absolute = (path: string) =>
  path.startsWith("http") ? path : new URL(path, seo.url).toString();

/**
 * Dados estruturados schema.org/Restaurant.
 *
 * É o que faz o Google exibir horário, telefone, endereço e faixa de preço
 * direto no resultado da busca — de longe o item de maior retorno para negócio
 * local.
 *
 * Não inclui `aggregateRating` de propósito. Nota média declarada pelo próprio
 * site, sem avaliações verificáveis por trás, é motivo de penalização pelo
 * Google e vira afirmação falsa se o número não for real. A nota que o Google
 * mostra vem do perfil do Google Business, não daqui.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: brand.name,
    description: seo.description,
    url: seo.url,
    telephone: contact.phoneHref.replace("tel:", ""),
    image: absolute(seo.ogImage),
    logo: absolute(brand.logo),
    servesCuisine: contact.cuisine,
    priceRange: contact.priceRange,
    currenciesAccepted: "BRL",
    address: {
      "@type": "PostalAddress",
      streetAddress: addressLines()[0],
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    },
    openingHoursSpecification: openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    hasMenu: {
      "@type": "Menu",
      url: `${seo.url}/#menu`,
      hasMenuSection: {
        "@type": "MenuSection",
        name: "Hambúrgueres",
        hasMenuItem: burgers.map((burger) => ({
          "@type": "MenuItem",
          name: burger.name,
          description: burger.description,
          // Item sem preço confirmado vai sem `offers`: melhor omitir do que
          // declarar um valor que não é o que o cliente cobra.
          offers:
            burger.price === null
              ? undefined
              : {
                  "@type": "Offer",
                  price: burger.price,
                  priceCurrency: "BRL",
                },
        })),
      },
    },
    potentialAction: contact.orderHref
      ? {
          "@type": "OrderAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: contact.orderHref,
            inLanguage: locale.lang,
          },
        }
      : undefined,
    sameAs: [
      contact.instagramHref,
      contact.facebookHref,
      contact.mapsHref,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

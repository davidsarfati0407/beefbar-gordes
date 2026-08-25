import { identity, site, photos, isTBD } from "@/data/beefbar";
import { photoExists } from "./photos";

/**
 * JSON-LD Restaurant — uniquement les champs réellement renseignés.
 * Aucun champ inventé : tout ce qui vaut [À COMPLÉTER] est simplement omis.
 */
export function restaurantJsonLd(): Record<string, unknown> {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: identity.name,
    description: site.description,
    url: site.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gordes",
      addressRegion: "Provence",
      addressCountry: "FR",
    },
    containedInPlace: {
      "@type": "LodgingBusiness",
      name: identity.domain,
    },
  };

  if (!isTBD(identity.address)) {
    (data.address as Record<string, unknown>).streetAddress = identity.address;
  }
  if (!isTBD(identity.phone)) data.telephone = identity.phone;
  if (!isTBD(identity.email)) data.email = identity.email;
  if (!isTBD(identity.hours)) data.openingHours = identity.hours;
  if (!isTBD(identity.instagram)) data.sameAs = [identity.instagram];
  if (!isTBD(identity.reservationExternalUrl)) {
    data.acceptsReservations = identity.reservationExternalUrl;
  }
  if (photoExists(photos.hero.src)) {
    data.image = new URL(photos.hero.src, site.url).toString();
  }

  return data;
}

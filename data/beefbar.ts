/**
 * SOURCE DE VÉRITÉ UNIQUE DU SITE.
 *
 * Règle absolue : aucun contenu inventé.
 * Toute information non fournie par le client est écrite `TBD` ("[À COMPLÉTER]")
 * et rendue visible telle quelle sur le site (italique, opacité 60 %).
 * Aucun texte en dur dans les composants.
 */

export const TBD = "[À COMPLÉTER]" as const;

/** `true` si la valeur est un placeholder non renseigné. */
export const isTBD = (value: unknown): boolean => value === TBD;

/* ------------------------------------------------------------------ */
/* 4.1 — Identité                                                      */
/* ------------------------------------------------------------------ */

export const identity = {
  name: "Beefbar Gordes",
  domain: "Airelles Gordes, La Bastide",
  location: "Gordes, Luberon, Provence",
  address: TBD,
  phone: TBD,
  email: TBD,
  hours: TBD,
  instagram: TBD,
  /** Lien de réservation officiel si existant. */
  reservationExternalUrl: TBD,
  /** Nom de la plateforme externe, utilisé pour le libellé du bouton secondaire. */
  reservationExternalLabel: TBD,
} as const;

export const agency = {
  name: "Atlas Studio",
  url: "https://atlas-studio.net",
} as const;

/* ------------------------------------------------------------------ */
/* 4.2 — Photos fournies                                               */
/* ------------------------------------------------------------------ */

export type Photo = {
  /** Chemin public attendu, une fois la photo copiée dans /public/photos/. */
  src: string;
  /** Fichier source fourni par le client. */
  source: string;
  alt: string;
  usage: string;
};

/**
 * Les fichiers sources n'ont pas encore été transmis (chemin du dossier = TBD).
 * Déposer les photos dans /public/photos/ sous les noms `src` ci-dessous :
 * le site les affiche automatiquement, sans autre modification.
 * Tant qu'un fichier est absent, une plaque « [À COMPLÉTER] » est rendue à sa place.
 */
export const photosSourceFolder = TBD;

export const photos = {
  hero: {
    src: "/photos/terrasse-crepuscule.jpg",
    source: "IMG_5331.jpeg",
    alt: "Terrasse au crépuscule, guirlandes lumineuses, terrain de pétanque éclairé, vue sur les collines",
    usage: "Hero",
  },
  lieu: {
    src: "/photos/airelles-gordes-vue.jpg",
    source: "IMG_5332.jpeg",
    alt: "Vue d'ensemble de La Bastide à flanc de colline, cyprès",
    usage: "Section Le Lieu",
  },
  terrasse: {
    src: "/photos/millefeuille-terrasse.jpg",
    source: "IMG_5333.jpeg",
    alt: "Enseigne « beefbar », tables dressées et convives sur la terrasse, millefeuille en premier plan",
    usage: "Section Le Lieu (pleine largeur) + Carte (desserts)",
  },
  plat: {
    src: "/photos/salade-kale.jpg",
    source: "IMG_5330.jpeg",
    alt: "Plat en gros plan servi dans un bol noir, vaisselle et ambiance de table",
    usage: "Section Carte",
  },
} as const satisfies Record<string, Photo>;

/* ------------------------------------------------------------------ */
/* 4.3 — La Carte                                                      */
/* ------------------------------------------------------------------ */

export type MenuItem = {
  name: string;
  description?: string;
  price: number | string;
  note?: string;
  forTwo?: boolean;
};

export type MenuCategory = {
  /** Libellé de l'onglet. */
  tab: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
  /** Mention de bas de catégorie (ex. sauces au choix). */
  footnote?: string;
  /** Catégorie non fournie par le client : rendue en [À COMPLÉTER]. */
  pending?: boolean;
  /** Sous-groupes manquants à signaler explicitement. */
  pendingGroups?: string[];
};

/**
 * Seules les pages 4 et 5 de la carte papier ont été fournies.
 * Entrées, accompagnements et boissons sont manquants → catégorie `pending`,
 * aucun plat inventé.
 */
export const menu: MenuCategory[] = [
  {
    tab: "Signatures",
    title: "Les Viandes — Signatures",
    subtitle: "Origines : Double R Ranch US · Creekstone Farms US · Black Onyx Australie",
    items: [
      {
        name: "Paleron de Wagyu",
        description: "Confit et grillé, jus d'une daube aux olives",
        price: 46,
      },
      { name: "Filet Mignon", price: 68 },
      { name: "Fondant d'Entrecôte", price: 58 },
      { name: "Cœur d'Entrecôte", price: 85 },
      { name: "Cœur de Filet", price: 89 },
      { name: "Chateaubriand", price: 178, note: "600 g", forTwo: true },
      {
        name: "À la Japonaise",
        description: "Sésame croustillant, sauce goma",
        price: 68,
      },
      { name: "Double Entrecôte", price: 210, note: "500 g", forTwo: true },
      { name: "Tomahawk", price: 450, note: "± 1,4 kg · pour 2/3" },
    ],
  },
  {
    tab: "Signatures du Monde",
    title: "Les Signatures du Monde",
    items: [
      { name: "Korean BBQ", description: "Bœuf mariné au gochujang", price: 49 },
      {
        name: "Poulet au Citron",
        description: "Poulet mariné au citron, cuit au barbecue",
        price: 39,
      },
      {
        name: "Loup de Méditerranée",
        description: "Filet de loup vapeur, câpres & gingembre frais",
        price: 52,
      },
    ],
  },
  {
    tab: "Smash & Stacks",
    title: "Smash & Stacks",
    items: [
      {
        name: "Ultimate Smash Cheeseburger",
        description:
          "Double steak de bœuf Black Angus USA, fromage, ketchup, moutarde, frites",
        price: 35,
      },
      {
        name: "Beefbar Secret Smash",
        description:
          "Double steak de bœuf Black Angus USA, fromage, sauce Beefbar, frites",
        price: 39,
      },
      {
        name: "Smash Burger « Au Poivre »",
        description:
          "Double Black Angus USA smashé, fromage, sauce au poivre, frites",
        price: 39,
      },
    ],
  },
  {
    tab: "Viandes en Sauces",
    title: "Les Viandes en Sauces",
    subtitle: "Au choix, 200 g",
    items: [
      { name: "Steak-Frites Traditionnel", price: 39 },
      { name: "Filet du Terroir", price: 45 },
      { name: "Filet de Wagyu", price: 95 },
    ],
    footnote:
      "Sauces au choix : Sauce Signature Beefbar · Sauce Traditionnelle au Poivre",
  },
  {
    tab: "Beefbar Réserve",
    title: "Beefbar Réserve",
    subtitle: "Exclusivité mondiale · Wagyu japonais · 200 g · selon arrivage",
    items: [
      { name: "Bavette Miyazaki Sunflower", price: 80, note: "selon arrivage" },
      { name: "Picanha Katana Miyazaki Citrus", price: 80, note: "selon arrivage" },
      { name: "Kobe Beef Kiss", price: 80, note: "selon arrivage" },
    ],
  },
  {
    tab: "Découpes de l'Empereur",
    title: "Découpes de l'Empereur",
    subtitle: "Prix / 100 g · selon arrivage · minimum 200 g",
    items: [
      { name: "Matsusaka", price: 130, note: "/100 g" },
      { name: "Kobe Beef", price: 130, note: "/100 g" },
      { name: "Hida", price: 95, note: "/100 g" },
      { name: "Numamoto", price: 95, note: "/100 g" },
      { name: "Wine-Gyu", price: 80, note: "/100 g" },
      { name: "Miyazaki", price: 80, note: "/100 g" },
      { name: "Hokkaido", price: 80, note: "/100 g" },
      { name: "Kagoshima", price: 80, note: "/100 g" },
    ],
  },
  {
    tab: "Desserts",
    title: "Desserts",
    items: [
      {
        name: "Soufflé Pêche Melba",
        description: "Soufflé Signature — pêche, amande et framboise",
        price: 28,
        forTwo: true,
      },
      {
        name: "Marbled Chocolate Bar",
        description:
          "Tout ce que l'on aime dans une barre chocolatée : chocolat, biscuit croustillant, caramel coulant",
        price: 34,
        forTwo: true,
      },
      {
        name: "Millefeuille XXL",
        description:
          "Feuilleté caramélisé, crème vanille, compotée de fraise au Grand Marnier",
        price: 12,
      },
      {
        name: "Exotique Cheesecake",
        description:
          "Cheesecake au chocolat blanc, mangue et fruit de la passion, croûte aux noix de macadamia et noix de coco",
        price: 14,
      },
      {
        name: "Gelato Mantecato",
        description: "Glace fleur de lait minute, sauces & toppings gourmands",
        price: 30,
        forTwo: true,
      },
    ],
  },
  {
    tab: TBD,
    title: "Entrées · Accompagnements · Boissons",
    subtitle:
      "Ces pages de la carte n'ont pas encore été fournies. Aucun plat n'est inventé.",
    items: [],
    pending: true,
    pendingGroups: ["Entrées", "Accompagnements", "Boissons"],
  },
];

/* ------------------------------------------------------------------ */
/* 6 — Hero                                                            */
/* ------------------------------------------------------------------ */

export const hero = {
  title: identity.name,
  subtitle: "Airelles Gordes · Luberon",
  cta: "Réserver une table",
  ctaShort: "Réserver",
} as const;

/* ------------------------------------------------------------------ */
/* 7.2 — Le Lieu                                                       */
/* ------------------------------------------------------------------ */

export const lieu = {
  title: "Une terrasse suspendue au-dessus du Luberon",
  /** Aucune histoire du lieu n'a été fournie : rien n'est inventé. */
  paragraph: TBD,
  /** Uniquement des faits observables sur les photos fournies. */
  facts: [
    "Terrasse en pierre sèche",
    "Vue sur les collines du Luberon",
    "Dîner sous les guirlandes",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* 8 — Réservation                                                     */
/* ------------------------------------------------------------------ */

/**
 * PROVISOIRE — les créneaux réels n'ont pas été fournis ([À COMPLÉTER]).
 * En attendant : 19:00 → 22:30 par pas de 30 minutes.
 * À remplacer par les créneaux officiels dès réception.
 */
export const reservationSlotsArePlaceholder = true;

export const reservationSlots: string[] = (() => {
  const slots: string[] = [];
  for (let minutes = 19 * 60; minutes <= 22 * 60 + 30; minutes += 30) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
})();

export const reservation = {
  title: "Réserver une table",
  /** Aucun texte d'accroche fourni. */
  intro: TBD,
  minGuests: 1,
  maxGuests: 12,
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: "Le Lieu", href: "#le-lieu" },
  { label: "La Carte", href: "#la-carte" },
  { label: "Réservation", href: "#reservation" },
] as const;

export const site = {
  title: `${identity.name} — ${identity.domain}`,
  description: `${identity.name}, restaurant de viande premium au sein du domaine ${identity.domain}, ${identity.location}.`,
  /** Renseigner l'URL de production pour les metadata absolues et le sitemap. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://beefbar-gordes.vercel.app",
} as const;

import { Playfair_Display, Cormorant_Garamond, Jost } from "next/font/google";

/** Display — serif italique élégant, écho aux titres calligraphiés de la carte. */
export const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["italic", "normal"],
  variable: "--font-display-src",
  display: "swap",
});

/** Corps — serif de lecture sobre. */
export const body = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body-src",
  display: "swap",
});

/** Labels, navigation, noms de plats — sans-serif géométrique en capitales espacées. */
export const label = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-label-src",
  display: "swap",
});

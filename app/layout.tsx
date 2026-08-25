import type { Metadata } from "next";
import { display, body, label } from "./fonts";
import { site, identity, agency } from "@/data/beefbar";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${identity.name}`,
  },
  description: site.description,
  applicationName: identity.name,
  authors: [{ name: agency.name, url: agency.url }],
  creator: agency.name,
  keywords: [
    identity.name,
    "Gordes",
    "Luberon",
    "Provence",
    "Airelles Gordes",
    "restaurant",
    "wagyu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: site.url,
    siteName: identity.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${label.variable}`}
    >
      <head>
        {/* Sans JavaScript, GSAP ne peut pas révéler les blocs : on annule
            l'état masqué de la recette `reveal` pour ne rien perdre. */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Lieu } from "@/components/sections/Lieu";
import { Carte } from "@/components/sections/Carte";
import { Reservation } from "@/components/sections/Reservation";
import { restaurantJsonLd } from "@/lib/jsonld";

/**
 * One-page + ancres.
 * Rythme jour/nuit : deux sections sombres seulement — le Hero et la Réservation.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Données strictement contrôlées (lib/jsonld.ts), aucune entrée utilisateur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
      />

      <Header />

      <main>
        <Hero />
        <Lieu />
        <Carte />
        <Reservation />
      </main>

      <Footer />
    </>
  );
}

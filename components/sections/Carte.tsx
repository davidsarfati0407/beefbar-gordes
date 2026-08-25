import { menu, photos } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { SectionParticles } from "@/components/ui/SectionParticles";
import { CarteTabs } from "./CarteTabs";

export function Carte() {
  return (
    <section id="la-carte" className="relative bg-stone-50 py-40">
      {/* Intro de section — particules allégées. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]">
        <SectionParticles />
      </div>

      <Container className="relative z-10">
        <Reveal>
          <SectionTitle eyebrow="La Carte">Nos viandes d&rsquo;exception</SectionTitle>
        </Reveal>

        <div className="mt-24">
          <CarteTabs categories={menu} />
        </div>

        {/* Deux photos plats en accompagnement, hover zoom très lent. */}
        <div className="mt-32 grid grid-cols-2 gap-10">
          <Figure
            photo={photos.plat}
            ratio="4 / 5"
            hoverZoom
            mask
            sizes="(min-width: 1200px) 560px, 50vw"
          />
          <Figure
            photo={photos.terrasse}
            ratio="4 / 5"
            hoverZoom
            mask
            sizes="(min-width: 1200px) 560px, 50vw"
            /* Recadrage sur le dessert (millefeuille au premier plan). */
            imageClassName="object-[center_72%]"
          />
        </div>
      </Container>
    </section>
  );
}

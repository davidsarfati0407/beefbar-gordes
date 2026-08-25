import { lieu, photos, isTBD } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { Placeholder } from "@/components/ui/Placeholder";
import { SectionParticles } from "@/components/ui/SectionParticles";

export function Lieu() {
  return (
    <section id="le-lieu" className="relative bg-stone-50 py-40">
      {/* Intro de section — particules allégées, même fil rouge que le hero. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px]">
        <SectionParticles />
      </div>

      <Container className="relative z-10">
        {/* Layout éditorial asymétrique : 60 % image / 40 % texte. */}
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center gap-20">
          <Figure
            photo={photos.lieu}
            ratio="4 / 5"
            mask
            sizes="(min-width: 1200px) 660px, 60vw"
          />

          <Reveal stagger className="flex flex-col items-start">
            <SectionTitle align="left" eyebrow="Le Lieu">
              {lieu.title}
            </SectionTitle>

            {isTBD(lieu.paragraph) ? (
              <Placeholder
                as="p"
                label="Texte de présentation du lieu"
                className="mt-10 text-[1.1rem] leading-relaxed"
              />
            ) : (
              <p className="mt-10 text-[1.1rem] leading-relaxed text-taupe-700">
                {lieu.paragraph}
              </p>
            )}

            <ul className="mt-14 flex flex-col gap-5 border-l border-gold-500/45 pl-8">
              {lieu.facts.map((fact) => (
                <li key={fact} className="label-caps text-[0.68rem] text-taupe-700">
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>

      {/* Second bloc : pleine largeur, parallaxe verticale GSAP. */}
      <div className="relative z-10 mt-32">
        <Figure
          photo={photos.terrasse}
          ratio="21 / 9"
          parallax
          mask
          sizes="100vw"
          caption={photos.terrasse.alt}
          captionClassName="mx-auto w-full max-w-[1560px] px-10"
          className="w-full"
        />
      </div>
    </section>
  );
}

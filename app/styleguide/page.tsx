import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { MenuItemRow } from "@/components/sections/MenuItemRow";
import { menu } from "@/data/beefbar";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const palette = [
  { token: "stone-50", hex: "#F4EFE6", role: "Fond principal (pierre claire / lin)", cls: "bg-stone-50" },
  { token: "stone-100", hex: "#E9E1D3", role: "Fonds de cartes, séparateurs", cls: "bg-stone-100" },
  { token: "sand-300", hex: "#C9B48E", role: "Accents chauds (rotin, sable)", cls: "bg-sand-300" },
  { token: "gold-500", hex: "#B08D57", role: "Or doux (filets, hover, titres sur fond sombre)", cls: "bg-gold-500" },
  { token: "taupe-700", hex: "#5A4E43", role: "Texte secondaire", cls: "bg-taupe-700" },
  { token: "ink-900", hex: "#1C1A17", role: "Texte principal, sections sombres", cls: "bg-ink-900" },
  { token: "dusk-800", hex: "#2B2F3A", role: "Bleu nuit des sections crépuscule", cls: "bg-dusk-800" },
];

export default function Styleguide() {
  return (
    <main className="bg-stone-50 py-32">
      <Container>
        <SectionTitle align="left" eyebrow="Design system" as="h1">
          Styleguide
        </SectionTitle>

        {/* ---------------------------------------------------------- */}
        <Block title="Palette">
          <div className="grid grid-cols-4 gap-6">
            {palette.map((color) => (
              <div key={color.token} className="flex flex-col gap-3">
                <div
                  className={`h-28 w-full border border-ink-900/10 ${color.cls}`}
                  aria-hidden="true"
                />
                <p className="label-caps text-[0.6rem] text-ink-900">{color.token}</p>
                <p className="text-[0.9rem] text-taupe-700">{color.hex}</p>
                <p className="text-[0.9rem] leading-snug text-taupe-700">{color.role}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-[70ch] text-[0.95rem] leading-relaxed text-taupe-700">
            Contrastes mesurés sur stone-50 : ink-900 15,2:1 · taupe-700 7,0:1 ·
            gold-500 2,7:1. L&rsquo;or ne porte donc jamais de texte sur fond clair —
            il reste la signature sous forme de filets. Sur ink-900, gold-500
            atteint 5,6:1 et peut porter les titres.
          </p>
        </Block>

        {/* ---------------------------------------------------------- */}
        <Block title="Typographie">
          <div className="flex flex-col gap-10">
            <div>
              <p className="label-caps mb-4 text-[0.6rem] text-taupe-700">
                Display — Playfair Display Italic
              </p>
              <p className="font-display italic text-6xl leading-tight text-ink-900">
                Une terrasse suspendue
              </p>
            </div>
            <div>
              <p className="label-caps mb-4 text-[0.6rem] text-taupe-700">
                Labels — Jost, capitales espacées (0.18em)
              </p>
              <p className="label-caps text-[0.8rem] text-ink-900">
                Terrasse en pierre sèche
              </p>
            </div>
            <div>
              <p className="label-caps mb-4 text-[0.6rem] text-taupe-700">
                Corps — Cormorant Garamond
              </p>
              <p className="max-w-[62ch] text-[1.1rem] leading-relaxed text-taupe-700">
                Confit et grillé, jus d&rsquo;une daube aux olives. Sésame croustillant,
                sauce goma. Feuilleté caramélisé, crème vanille, compotée de fraise au
                Grand Marnier.
              </p>
            </div>
          </div>
        </Block>

        {/* ---------------------------------------------------------- */}
        <Block title="Composants">
          <div className="flex flex-col gap-14">
            <div className="flex flex-wrap items-center gap-6">
              <Button variant="outline">Outline · light</Button>
              <Button variant="solid">Solid · light</Button>
              <Button variant="ghost">Ghost · light</Button>
            </div>

            <div className="flex flex-wrap items-center gap-6 bg-dusk-800 p-10">
              <Button variant="outline" tone="dark">
                Outline · dark
              </Button>
              <Button variant="solid" tone="dark">
                Solid · dark
              </Button>
              <Button variant="ghost" tone="dark">
                Ghost · dark
              </Button>
            </div>

            <div>
              <p className="label-caps mb-6 text-[0.6rem] text-taupe-700">
                SectionTitle · fond clair
              </p>
              <SectionTitle eyebrow="La Carte">Nos viandes d&rsquo;exception</SectionTitle>
            </div>

            <div className="bg-dusk-800 py-16">
              <p className="label-caps mb-6 text-center text-[0.6rem] text-sand-300">
                SectionTitle · fond sombre
              </p>
              <SectionTitle tone="dark" eyebrow="Réservation">
                Réserver une table
              </SectionTitle>
            </div>

            <div>
              <p className="label-caps mb-6 text-[0.6rem] text-taupe-700">
                Ligne de carte · filet pointillé
              </p>
              <ul className="max-w-[560px]">
                {menu[0].items.slice(0, 3).map((item) => (
                  <MenuItemRow key={item.name} item={item} />
                ))}
              </ul>
            </div>

            <div>
              <p className="label-caps mb-6 text-[0.6rem] text-taupe-700">
                Placeholder — contenu non fourni
              </p>
              <Placeholder as="p" label="Horaires" />
            </div>

            <div>
              <p className="label-caps mb-6 text-[0.6rem] text-taupe-700">
                Reveal — fondu + translation Y 24 px, power2.out, stagger 0.08
              </p>
              <Reveal stagger className="flex gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="flex h-24 w-24 items-center justify-center border border-gold-500/40 bg-stone-100"
                  >
                    <span className="label-caps text-[0.6rem] text-taupe-700">{n}</span>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </Block>
      </Container>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-28 border-t border-stone-100 pt-16">
      <h2 className="label-caps mb-12 text-[0.68rem] text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

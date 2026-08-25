import { photos, TBD } from "@/data/beefbar";
import { photoExists } from "@/lib/photos";
import { HeroStage } from "./HeroStage";

export function Hero() {
  const available = photoExists(photos.hero.src);

  return (
    <section
      id="hero"
      aria-label="Beefbar Gordes"
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-ink-900"
    >
      <HeroStage src={photos.hero.src} alt={photos.hero.alt} photoAvailable={available} />

      {!available ? (
        <p className="placeholder-tbd-dark absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-center text-[0.9rem]">
          Photo du hero {TBD} — déposer «&nbsp;{photos.hero.source}&nbsp;» dans{" "}
          <code>/public{photos.hero.src}</code>
        </p>
      ) : null}
    </section>
  );
}

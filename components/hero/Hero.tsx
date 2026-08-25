import { photos, TBD } from "@/data/beefbar";
import { photoExists } from "@/lib/photos";
import { HeroStage } from "./HeroStage";

export function Hero() {
  const available = photoExists(photos.hero.src);

  return (
    <section
      id="hero"
      aria-label="Beefbar Gordes"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink-900"
    >
      <HeroStage src={photos.hero.src} alt={photos.hero.alt} photoAvailable={available} />

      {!available ? (
        <p className="placeholder-tbd-dark absolute inset-x-6 bottom-6 z-20 text-center text-[0.8rem] md:inset-x-0 md:bottom-8 md:text-[0.9rem]">
          Photo du hero {TBD} — déposer «&nbsp;{photos.hero.source}&nbsp;» dans{" "}
          <code>/public{photos.hero.src}</code>
        </p>
      ) : null}
    </section>
  );
}

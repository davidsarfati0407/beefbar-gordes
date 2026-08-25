"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroContent } from "./HeroContent";
import { HeroFallback } from "./HeroFallback";

/** Le Canvas n'est jamais rendu côté serveur. */
const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export function HeroStage({
  src,
  alt,
  /** `false` tant que la photo n'a pas été fournie par le client. */
  photoAvailable,
}: {
  src: string;
  alt: string;
  photoAvailable: boolean;
}) {
  const [mode, setMode] = useState<"pending" | "3d" | "photo" | "static">("pending");

  useEffect(() => {
    // prefers-reduced-motion : ni particules ni parallaxe (contrainte section 9).
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && supportsWebGL()) {
      setMode("3d");
    } else {
      setMode(photoAvailable ? "photo" : "static");
    }
  }, [photoAvailable]);

  // Rendu serveur / première peinture : fond crépusculaire, aucun saut visuel.
  const backdrop = (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_15%,var(--color-dusk-800)_0%,var(--color-ink-900)_70%)]"
    />
  );

  return (
    <div className="absolute inset-0">
      {backdrop}

      {mode === "3d" ? (
        // Sans photo, le canvas ne rend que les particules au-dessus du dégradé.
        <HeroCanvas src={photoAvailable ? src : null} />
      ) : mode === "photo" ? (
        <HeroFallback src={src} alt={alt} />
      ) : null}

      <div className="absolute inset-0">
        <HeroContent />
      </div>
    </div>
  );
}

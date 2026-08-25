"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Canvas = dynamic(() => import("./SectionParticlesCanvas"), { ssr: false });

/**
 * Bandeau décoratif d'intro de section.
 * Désactivé si `prefers-reduced-motion` est actif (contrainte section 9).
 */
export function SectionParticles() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = (() => {
      try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    setEnabled(!reduced && webgl);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <Canvas />
    </div>
  );
}

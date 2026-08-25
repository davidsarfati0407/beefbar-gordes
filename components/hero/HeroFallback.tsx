"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * Fallback obligatoire — aussi soigné que la version 3D.
 * Photo pure + parallaxe GSAP à la souris + overlay dégradé ink-900 → transparent.
 * Le système typographique superposé est strictement le même.
 */
export function HeroFallback({ src, alt }: { src: string; alt: string }) {
  const image = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = image.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      // La photo « respire » à l'entrée, comme dans la version 3D.
      gsap.fromTo(
        el,
        { scale: 1.06, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" },
      );
    }, el);

    const quickX = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      quickX(nx * 8); // ± 8 px max
      quickY(ny * 8);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-900">
      <div ref={image} className="absolute -inset-[2%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/45 to-transparent"
      />
    </div>
  );
}

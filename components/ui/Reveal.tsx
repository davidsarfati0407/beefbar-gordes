"use client";

import { useEffect, useRef, type ElementType, type FC, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * LA recette d'animation du site — une seule, réutilisée partout :
 * fondu + translation Y de 24 px, power2.out, stagger 0.08.
 * Rien ne dépasse 1,2 s (hors hero).
 *
 * `stagger` anime les enfants directs ; sinon le bloc entier.
 */
export function Reveal({
  children,
  as = "div",
  stagger = false,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  stagger?: boolean;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-done");
      el.querySelectorAll<HTMLElement>(":scope > *").forEach((c) =>
        c.classList.add("reveal-done"),
      );
      return;
    }

    const targets = stagger
      ? Array.from(el.querySelectorAll<HTMLElement>(":scope > *"))
      : [el];

    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          delay,
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay]);

  // Idem Button : ElementType dynamique, signature forcée au point d'appel.
  const Tag = as as unknown as FC<Record<string, unknown>>;

  return (
    <Tag
      ref={ref as never}
      className={`${stagger ? "" : "reveal"} ${className}`}
      data-reveal={stagger ? "stagger" : "block"}
    >
      {children}
    </Tag>
  );
}

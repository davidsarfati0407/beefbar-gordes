"use client";

import { motion, useReducedMotion } from "framer-motion";
import { hero, nav } from "@/data/beefbar";
import { Button } from "@/components/ui/Button";

/**
 * Typographie superposée en HTML (jamais en 3D) : accessible, sélectionnable
 * et indexable. Entrée en stagger léger, après la respiration de la photo.
 */
export function HeroContent() {
  const reduced = useReducedMotion();
  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={
        reduced ? { duration: 0 } : { staggerChildren: 0.14, delayChildren: 0.9 }
      }
      className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center"
    >
      <motion.h1
        variants={rise}
        transition={{ duration: 1, ease }}
        className="font-display italic text-[clamp(3.5rem,7vw,7rem)] leading-[1.02] font-normal text-stone-50"
      >
        {hero.title}
      </motion.h1>

      <motion.p
        variants={rise}
        transition={{ duration: 0.9, ease }}
        className="label-caps mt-8 text-[0.72rem] text-sand-300"
      >
        {hero.subtitle}
      </motion.p>

      <motion.div
        variants={rise}
        transition={{ duration: 0.9, ease }}
        className="mt-14"
      >
        <Button as="a" href={nav[2].href} variant="outline" tone="dark">
          {hero.cta}
        </Button>
      </motion.div>
    </motion.div>
  );
}

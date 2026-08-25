"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { identity, nav, hero } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useScrollControls } from "./SmoothScroll";

/**
 * Fixe. Transparent sur le hero, puis fond stone-50 avec léger blur au scroll.
 * Aucun logo image n'a été fourni → logo textuel en display.
 *
 * En portrait, la navigation passe dans un panneau plein écran : trois liens
 * dans la même typographie display que le reste du site, jamais un menu
 * générique posé par-dessus.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { stop, start } = useScrollControls();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Panneau ouvert : on fige le défilement de la page derrière.
  useEffect(() => {
    if (open) stop();
    else start();
    return () => start();
  }, [open, stop, start]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Sur fond sombre : hero non scrollé, ou panneau ouvert.
  const onDark = !scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-out ${
          scrolled && !open
            ? "border-b border-stone-100 bg-stone-50/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <Container wide className="flex items-center justify-between py-5 md:py-6">
          <a
            href="#hero"
            onClick={() => setOpen(false)}
            className={`font-display italic text-xl leading-none transition-colors duration-700 md:text-2xl ${
              onDark ? "text-stone-50" : "text-ink-900"
            }`}
          >
            {identity.name}
          </a>

          {/* Navigation desktop */}
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-12">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`label-caps link-underline text-[0.68rem] transition-colors duration-700 ${
                      scrolled
                        ? "text-taupe-700 hover:text-ink-900"
                        : "text-stone-100 hover:text-stone-50"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* `hidden` et `inline-flex` sont deux utilitaires `display` : leur ordre
              dans la chaîne de classes ne tranche pas. On masque via un conteneur. */}
          <div className="hidden lg:block">
            <Button
              as="a"
              href={nav[2].href}
              variant="outline"
              tone={onDark ? "dark" : "light"}
              className="py-3"
            >
              {hero.ctaShort}
            </Button>
          </div>

          {/* Déclencheur portrait */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-portrait"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
          >
            <span
              aria-hidden="true"
              className={`block h-px w-7 transition-all duration-500 ${
                onDark ? "bg-stone-50" : "bg-ink-900"
              } ${open ? "translate-y-[4px] rotate-45" : ""}`}
            />
            <span
              aria-hidden="true"
              className={`block h-px w-7 transition-all duration-500 ${
                onDark ? "bg-stone-50" : "bg-ink-900"
              } ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
            />
          </button>
        </Container>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="menu-portrait"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-ink-900 px-8 lg:hidden"
          >
            <nav aria-label="Navigation principale">
              <ul className="flex flex-col items-center gap-8">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.12 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="font-display italic text-4xl text-stone-50"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4"
            >
              <Button
                as="a"
                href={nav[2].href}
                variant="outline"
                tone="dark"
                onClick={() => setOpen(false)}
              >
                {hero.cta}
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

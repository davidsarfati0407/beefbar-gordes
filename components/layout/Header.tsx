"use client";

import { useEffect, useState } from "react";
import { identity, nav, hero } from "@/data/beefbar";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Fixe. Transparent sur le hero, puis fond stone-50 avec léger blur au scroll.
 * Aucun logo image n'a été fourni → logo textuel en display.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ease-out ${
        scrolled
          ? "border-b border-stone-100 bg-stone-50/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container wide className="flex items-center justify-between py-6">
        <a
          href="#hero"
          className={`font-display italic text-2xl leading-none transition-colors duration-700 ${
            scrolled ? "text-ink-900" : "text-stone-50"
          }`}
        >
          {identity.name}
        </a>

        <nav aria-label="Navigation principale">
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

        <Button
          as="a"
          href={nav[2].href}
          variant="outline"
          tone={scrolled ? "light" : "dark"}
          className="py-3"
        >
          {hero.ctaShort}
        </Button>
      </Container>
    </header>
  );
}

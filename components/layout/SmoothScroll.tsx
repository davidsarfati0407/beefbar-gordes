"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollControls = {
  /** Fige le défilement (menu mobile ouvert). */
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollControls>({
  stop: () => {},
  start: () => {},
});

export const useScrollControls = () => useContext(ScrollContext);

/** Smooth scroll global (lerp 0.08), synchronisé avec ScrollTrigger. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.08 });
    lenisRef.current = lenis;
    setReady(true);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Ancres du header — Lenis gère le défilement (et respecte scroll-margin-top).
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const controls = useMemo<ScrollControls>(
    () => ({
      stop: () => {
        lenisRef.current?.stop();
        // Filet de sécurité quand Lenis est absent (prefers-reduced-motion).
        document.documentElement.style.overflow = "hidden";
      },
      start: () => {
        lenisRef.current?.start();
        document.documentElement.style.overflow = "";
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={controls}>{children}</ScrollContext.Provider>;
}

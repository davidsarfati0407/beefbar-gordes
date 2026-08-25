"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Un canvas ne doit tourner que s'il est réellement regardé :
 * visible dans le viewport ET onglet au premier plan.
 * Évite de faire chauffer le GPU (et la batterie) pour rien.
 */
export function useCanvasActive<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let inView = false;

    const sync = () => setActive(inView && document.visibilityState === "visible");

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return { ref, active };
}

import type { ReactNode } from "react";

/** Largeur de lecture éditoriale. Desktop-first, sans largeur fixe. */
export function Container({
  children,
  className = "",
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${wide ? "max-w-[1560px]" : "max-w-[1200px]"} px-6 md:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

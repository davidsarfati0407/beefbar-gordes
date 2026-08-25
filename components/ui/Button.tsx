import type { ComponentPropsWithoutRef, ElementType, FC, ReactNode } from "react";

type Variant = "outline" | "solid" | "ghost";
type Tone = "light" | "dark";

const base =
  "label-caps inline-flex items-center justify-center gap-3 text-[0.7rem] leading-none " +
  "px-7 py-4 transition-colors duration-500 ease-out disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, Record<Tone, string>> = {
  outline: {
    light:
      "border border-gold-500 text-ink-900 hover:bg-gold-500/12 focus-visible:bg-gold-500/12",
    dark: "border border-gold-500 text-stone-50 hover:bg-gold-500/20 focus-visible:bg-gold-500/20",
  },
  solid: {
    light: "bg-ink-900 text-stone-50 hover:bg-taupe-700",
    dark: "bg-stone-50 text-ink-900 hover:bg-stone-100",
  },
  ghost: {
    light: "text-taupe-700 hover:text-ink-900",
    dark: "text-stone-100 hover:text-stone-50",
  },
};

type Props<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  tone?: Tone;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "outline",
  tone = "light",
  children,
  className = "",
  ...rest
}: Props<T>) {
  // Composant polymorphe : TS ne peut pas résoudre les props d'une ElementType
  // dynamique, on force donc la signature au point d'appel.
  const Tag = (as ?? "button") as unknown as FC<Record<string, unknown>>;
  return (
    <Tag className={`${base} ${variants[variant][tone]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

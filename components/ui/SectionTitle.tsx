import type { ReactNode } from "react";

/**
 * Titre de section en display italique, encadré de deux filets fins gold-500,
 * comme les titres de catégorie de la carte papier.
 *
 * Sur fond clair le titre est en ink-900 : gold-500 sur stone-50 plafonne à
 * 2.7:1 et ne peut donc pas porter de texte. L'or reste la signature, mais
 * sous forme de filets. Sur fond sombre (tone="dark") le titre passe en or.
 */
export function SectionTitle({
  children,
  eyebrow,
  tone = "light",
  align = "center",
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  eyebrow?: ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col ${centered ? "items-center text-center" : "items-start text-left"} ${className}`}
    >
      {eyebrow ? (
        <p
          className={`label-caps mb-6 text-[0.68rem] ${tone === "dark" ? "text-sand-300" : "text-taupe-700"}`}
        >
          {eyebrow}
        </p>
      ) : null}

      <span
        aria-hidden="true"
        className={`block h-px w-16 bg-gold-500 ${centered ? "" : "ml-0"}`}
      />

      <Tag
        className={`font-display italic my-7 text-[clamp(2.25rem,3.6vw,3.5rem)] leading-[1.15] font-normal ${
          tone === "dark" ? "text-gold-500" : "text-ink-900"
        }`}
      >
        {children}
      </Tag>

      <span aria-hidden="true" className="block h-px w-16 bg-gold-500" />
    </div>
  );
}

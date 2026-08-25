import { TBD } from "@/data/beefbar";

/**
 * Rend littéralement « [À COMPLÉTER] », en italique et discret.
 * Utilisé partout où le client n'a pas fourni l'information.
 */
export function Placeholder({
  label,
  className = "",
  as: Tag = "span",
}: {
  /** Précision facultative : « Adresse », « Horaires »… */
  label?: string;
  className?: string;
  as?: "span" | "p" | "div";
}) {
  return (
    <Tag className={`placeholder-tbd ${className}`}>
      {label ? `${label} — ` : ""}
      {TBD}
    </Tag>
  );
}

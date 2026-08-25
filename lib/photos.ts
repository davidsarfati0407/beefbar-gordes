import fs from "node:fs";
import path from "node:path";

/**
 * Les photos du client n'ont pas encore été transmises (dossier source = [À COMPLÉTER]).
 * Plutôt que d'afficher une image cassée ou — interdit — une image de stock,
 * on vérifie côté serveur la présence du fichier dans /public.
 * Absent → une plaque « [À COMPLÉTER] » est rendue à la place, aux bonnes dimensions.
 *
 * Déposer simplement les fichiers dans /public/photos/ : le site les affiche
 * automatiquement, sans aucune modification de code.
 */
export function photoExists(src: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  } catch {
    return false;
  }
}

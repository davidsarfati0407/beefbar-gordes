import Image from "next/image";
import type { Photo } from "@/data/beefbar";
import { TBD } from "@/data/beefbar";
import { photoExists } from "@/lib/photos";
import { MaskReveal } from "./MaskReveal";
import { Parallax } from "./Parallax";

/**
 * Affiche une photo fournie par le client.
 *
 * Aucune image de stock, aucune image générée : tant que le fichier n'est pas
 * déposé dans /public/photos/, on rend une plaque « [À COMPLÉTER] » aux bonnes
 * proportions, qui rappelle le fichier source attendu.
 */
export function Figure({
  photo,
  ratio = "4 / 3",
  priority = false,
  sizes = "(min-width: 1560px) 1560px, 100vw",
  caption,
  captionClassName = "",
  mask = false,
  parallax = false,
  hoverZoom = false,
  className = "",
  imageClassName = "",
}: {
  photo: Photo;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  caption?: string;
  captionClassName?: string;
  mask?: boolean;
  parallax?: boolean;
  hoverZoom?: boolean;
  className?: string;
  imageClassName?: string;
}) {
  const available = photoExists(photo.src);

  const frame = (
    <div
      className={`relative w-full overflow-hidden bg-stone-100 ${
        hoverZoom ? "group" : ""
      } ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {available ? (
        parallax ? (
          <Parallax className="absolute inset-x-0 -top-[6%]">
            <div className="relative h-full w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={priority}
                sizes={sizes}
                className={`object-cover ${imageClassName}`}
              />
            </div>
          </Parallax>
        ) : (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority={priority}
            sizes={sizes}
            className={`object-cover transition-transform duration-[1200ms] ease-out ${
              hoverZoom ? "group-hover:scale-[1.04]" : ""
            } ${imageClassName}`}
          />
        )
      ) : (
        <PhotoPending photo={photo} />
      )}
    </div>
  );

  return (
    <figure className="m-0">
      {mask ? <MaskReveal>{frame}</MaskReveal> : frame}
      {caption ? (
        <figcaption
          className={`label-caps mt-4 text-[0.62rem] text-taupe-700 ${captionClassName}`}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Plaque affichée tant que la photo n'a pas été fournie. */
function PhotoPending({ photo }: { photo: Photo }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-gold-500/35 bg-stone-100 px-8 text-center">
      <span aria-hidden="true" className="block h-px w-10 bg-gold-500" />
      <p className="placeholder-tbd font-display text-2xl">{TBD}</p>
      <p className="label-caps text-[0.6rem] text-taupe-700">Photo · {photo.usage}</p>
      <p className="placeholder-tbd text-[0.95rem] leading-relaxed">
        Déposer «&nbsp;{photo.source}&nbsp;» dans <code>/public{photo.src}</code>
      </p>
      <span aria-hidden="true" className="block h-px w-10 bg-gold-500" />
    </div>
  );
}

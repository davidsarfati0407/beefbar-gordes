import type { MenuItem } from "@/data/beefbar";

function formatPrice(price: MenuItem["price"]): string {
  return typeof price === "number" ? `${price} €` : price;
}

/**
 * Rendu inspiré de la carte papier : nom en capitales espacées, description en
 * serif, prix aligné à droite avec filet pointillé.
 */
export function MenuItemRow({ item }: { item: MenuItem }) {
  const mentions = [item.note, item.forTwo ? "pour 2" : null].filter(
    (m): m is string => Boolean(m),
  );

  return (
    <li className="mb-10 break-inside-avoid">
      <div className="flex items-baseline gap-4">
        <h4 className="label-caps text-[0.76rem] leading-snug text-ink-900">
          {item.name}
        </h4>
        <span aria-hidden="true" className="leader-dots min-w-8 flex-1" />
        <p className="font-display text-[1.05rem] leading-none whitespace-nowrap text-ink-900 tabular-nums">
          {formatPrice(item.price)}
        </p>
      </div>

      {item.description ? (
        <p className="mt-2.5 max-w-[46ch] text-[1.02rem] leading-relaxed text-taupe-700">
          {item.description}
        </p>
      ) : null}

      {mentions.length > 0 ? (
        <p className="label-caps mt-2.5 text-[0.58rem] text-taupe-700">
          {mentions.join(" · ")}
        </p>
      ) : null}
    </li>
  );
}

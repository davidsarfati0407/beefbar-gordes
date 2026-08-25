"use client";

import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuCategory } from "@/data/beefbar";
import { TBD } from "@/data/beefbar";
import { MenuItemRow } from "./MenuItemRow";

/**
 * Navigation par onglets horizontaux, indicateur glissant (layoutId).
 *
 * ANTI-BUG « cellule vide » (section 7.3) :
 * le rendu n'utilise AUCUNE grille. Les plats coulent dans des colonnes CSS
 * fluides (`columns-2`) : une catégorie au nombre impair d'items ne laisse donc
 * jamais de cellule vide, elle termine simplement sa colonne. Et une catégorie
 * à 0 item (onglet [À COMPLÉTER]) rend un bloc dédié, jamais une zone blanche.
 */
export function CarteTabs({ categories }: { categories: MenuCategory[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const active = categories[activeIndex];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Catégories de la carte"
        className="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 border-y border-stone-100 py-4"
      >
        {categories.map((category, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={category.title}
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              className={`label-caps relative px-5 py-3 text-[0.63rem] transition-colors duration-400 ${
                selected ? "text-ink-900" : "text-taupe-700 hover:text-ink-900"
              }`}
            >
              {selected ? (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  aria-hidden="true"
                  className="absolute inset-x-2 bottom-0 h-px bg-gold-500"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <span className="relative">{category.tab}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeIndex}
          id={`${baseId}-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${activeIndex}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="pt-20"
        >
          <CategoryHeading category={active} />

          {active.pending ? (
            <PendingCategory category={active} />
          ) : (
            <ul className="mt-16 columns-2 gap-x-24 [column-fill:balance]">
              {active.items.map((item) => (
                <MenuItemRow key={item.name} item={item} />
              ))}
            </ul>
          )}

          {active.footnote ? (
            <p className="label-caps mt-6 text-center text-[0.6rem] text-taupe-700">
              {active.footnote}
            </p>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/** Titre de catégorie en display italique, encadré de deux filets fins gold-500. */
function CategoryHeading({ category }: { category: MenuCategory }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span aria-hidden="true" className="block h-px w-24 bg-gold-500" />
      <h3 className="font-display italic my-5 text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight font-normal text-ink-900">
        {category.title}
      </h3>
      <span aria-hidden="true" className="block h-px w-24 bg-gold-500" />

      {category.subtitle ? (
        <p
          className={`mt-6 max-w-[68ch] text-[0.98rem] leading-relaxed ${
            category.pending ? "placeholder-tbd" : "text-taupe-700"
          }`}
        >
          {category.subtitle}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Onglet [À COMPLÉTER] — pages de la carte non fournies.
 * Aucun plat inventé, et surtout aucune zone blanche : un bloc explicite.
 */
function PendingCategory({ category }: { category: MenuCategory }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-8 border border-gold-500/30 bg-stone-100/60 px-14 py-16 text-center">
      {(category.pendingGroups ?? []).map((group) => (
        <div key={group} className="flex flex-col items-center gap-2">
          <p className="label-caps text-[0.68rem] text-ink-900">{group}</p>
          <p className="placeholder-tbd text-[1.05rem]">{TBD}</p>
        </div>
      ))}
    </div>
  );
}

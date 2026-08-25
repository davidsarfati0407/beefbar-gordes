# Beefbar Gordes — site vitrine

Site vitrine haut de gamme du **Beefbar Gordes**, restaurant de viande premium
au sein du domaine **Airelles Gordes, La Bastide** (Gordes, Luberon, Provence).

Réalisé par [Atlas Studio](https://atlas-studio.net).

---

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
npm run typecheck
```

- `/` — le site (one-page + ancres)
- `/styleguide` — palette, typographies et composants (non indexé)

## Stack

Next.js 15 (App Router, Server Components, TypeScript strict) · Tailwind CSS v4
(tokens de marque) · React Three Fiber + drei + postprocessing · GSAP + ScrollTrigger ·
Framer Motion · Lenis · Supabase · Resend · déploiement Vercel.

---

## ⚠️ Règle du projet : aucun contenu inventé

Rien n'est inventé — ni horaires, ni téléphone, ni prix, ni plat, ni histoire du
lieu, ni avis client. Tout contenu non fourni est écrit `[À COMPLÉTER]` dans le
code **et rendu visible tel quel** sur le site (italique, discret).

**Tout le contenu est centralisé dans `data/beefbar.ts`.** Aucun texte en dur
dans les composants : pour mettre le site à jour, il suffit d'éditer ce fichier.

### Ce qui reste à fournir

| # | Élément | Où le renseigner |
| - | ------- | ---------------- |
| 1 | Adresse postale | `identity.address` |
| 2 | Téléphone | `identity.phone` |
| 3 | Email | `identity.email` |
| 4 | Horaires d'ouverture | `identity.hours` |
| 5 | Compte Instagram (URL) | `identity.instagram` |
| 6 | Lien de réservation officiel + nom de la plateforme | `identity.reservationExternalUrl` / `…Label` |
| 7 | **Les 4 photos** | `public/photos/` — voir [le guide](public/photos/README.md) |
| 8 | Paragraphe de présentation du lieu | `lieu.paragraph` |
| 9 | Texte d'intro de la réservation | `reservation.intro` |
| 10 | Carte : **Entrées · Accompagnements · Boissons** (pages non fournies) | `menu` — dernière catégorie |
| 11 | Créneaux horaires réels de réservation | `reservationSlots` |

> **Créneaux de réservation** : la liste actuelle (19:00 → 22:30 par pas de 30 min)
> est **provisoire**. Elle est marquée `reservationSlotsArePlaceholder = true` dans
> `data/beefbar.ts` et signalée comme telle sous le champ dans le formulaire.

La carte est fidèle aux **pages 4 et 5** de la carte papier, seules fournies :
Signatures, Signatures du Monde, Smash & Stacks, Viandes en Sauces, Beefbar Réserve,
Découpes de l'Empereur, Desserts. Les autres pages apparaissent dans un onglet
`[À COMPLÉTER]` dédié, sans aucun plat inventé.

---

## Réservation

Formulaire `components/ReservationForm.tsx` → `POST /api/reservation`.
Validation **zod partagée** client et serveur (`lib/reservation.ts`), dates passées
désactivées, états `idle / loading / success / error` animés.

Le Route Handler insère dans la table Supabase `reservations` puis envoie deux
emails via Resend (confirmation client + notification restaurant).

### Variables d'environnement

Copier `.env.example` vers `.env.local` :

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESTAURANT_EMAIL=
RESEND_FROM_EMAIL=      # optionnel — expéditeur vérifié côté Resend
```

**Sans ces variables, le site fonctionne en mode démo** : la demande est validée
et loguée côté serveur, l'utilisateur voit l'écran de succès, et ni le build ni le
déploiement ne cassent. C'est l'état actuel du site en ligne.

Le schéma SQL de la table est dans [`supabase/schema.sql`](supabase/schema.sql)
(RLS activée, aucune policy publique : la table n'est accessible que depuis le
serveur, via la service role key).

---

## Direction artistique

Une seule signature visuelle : **la lumière du crépuscule**. Pas d'empilement
d'effets, pas de glassmorphism, pas de gradient néon, pas de curseur custom.

**Palette** (tokens Tailwind) — `stone-50` `#F4EFE6` · `stone-100` `#E9E1D3` ·
`sand-300` `#C9B48E` · `gold-500` `#B08D57` · `taupe-700` `#5A4E43` ·
`ink-900` `#1C1A17` · `dusk-800` `#2B2F3A`.

Sections claires par défaut, **deux sections sombres seulement** (Hero et
Réservation) pour installer le rythme jour/nuit.

> **Note contraste** : `gold-500` sur `stone-50` plafonne à 2,7:1 et ne peut donc
> pas porter de texte. Sur fond clair l'or reste la signature **sous forme de
> filets** et les titres sont en `ink-900` (15,2:1) ; sur fond sombre `gold-500`
> atteint 5,6:1 et porte les titres. C'est ce qui permet de tenir 100 en
> accessibilité sans renoncer à l'identité.

**Typographies** (`next/font`) — Display : Playfair Display Italic · Labels :
Jost en capitales espacées (0.18em) · Corps : Cormorant Garamond.

**Animations** — une seule recette réutilisée partout (`components/ui/Reveal.tsx`) :
fondu + translation Y 24 px, `power2.out`, stagger 0.08. Masques `clip-path` sur les
grandes photos, soulignement or au survol, rien au-delà de 1,2 s hors hero.
`prefers-reduced-motion` est respecté : particules, parallaxe et reveals désactivés.

---

## Hero 3D

Hero **photo-led augmenté**, pas une scène modélisée — aucun modèle 3D chargé.

1. La photo est rendue dans un `Canvas` R3F via un shader de profondeur : la
   parallaxe suit la souris (± 8 px max, easing lent), les bords se déplaçant plus
   que le centre.
2. 220 particules dorées (« lucioles »), plus denses vers le haut du cadre, en
   mouvement organique très lent.
3. Postprocessing discret : bloom 0.4, vignettage, grain film. Pas d'aberration
   chromatique.
4. La typographie est **superposée en HTML**, jamais en 3D : accessible, sélectionnable
   et indexable.

**Performance** — `dpr` limité à `[1, 1.5]`, `Canvas` chargé en
`dynamic(..., { ssr: false })`, et rendu **mis en pause** dès que le hero quitte le
viewport ou que l'onglet passe en arrière-plan (`lib/useCanvasActive.ts`).

**Fallback** — si WebGL est absent (ou si `prefers-reduced-motion` est actif), le
hero bascule sur la photo pure avec parallaxe GSAP et overlay dégradé
`ink-900 → transparent`, avec **exactement le même système typographique**.
Le même système de particules, en version allégée (60 points), sert d'intro aux
sections « Le Lieu » et « La Carte ».

---

## Qualité

Lighthouse desktop, build de production :

| | Score |
| - | - |
| Accessibilité | **100** |
| Bonnes pratiques | **100** |
| SEO | **100** |
| Performance | **100** *(voir note)* |

FCP 0,3 s · LCP 0,7 s · CLS 0 · TBT 0 ms.

> *Note* : la mesure de performance ci-dessus est faite sur le chemin sans WebGL.
> Auditée avec WebGL **émulé en logiciel** (machine sans GPU), la page tombe à 66 —
> le rendu 3D s'exécute alors sur le thread principal. Sur un poste desktop réel
> doté d'un GPU, ce coût est déporté sur la carte graphique. À re-mesurer sur le
> déploiement Vercel depuis une vraie machine.

Autres points traités :

- **Aucune cellule vide dans la carte.** Le rendu n'utilise aucune grille : les plats
  coulent dans des colonnes CSS fluides. Une catégorie au nombre impair d'items
  termine simplement sa colonne, et l'onglet `[À COMPLÉTER]` (0 item) rend un bloc
  dédié. Les 8 onglets ont été vérifiés un par un.
- Metadata complètes, OG image générée, `sitemap.ts`, `robots.ts`.
- JSON-LD `Restaurant` **limité aux champs réellement renseignés** — aucun champ inventé.
- Pas de débordement horizontal.
- Sans JavaScript, les blocs `reveal` restent visibles (garde `<noscript>`).

---

## Périmètre

**Desktop-first uniquement.** Le responsive mobile fera l'objet d'une passe dédiée
et n'est pas traité ici ; rien n'a été cassé pour autant (pas de `overflow-x`, pas
de largeur fixe).

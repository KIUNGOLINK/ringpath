# Design — RingPath

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page — extend or amend this file when the
system needs to grow.

This system was not invented by Hallmark — it already existed (`src/app/globals.css`,
`@theme` block) and is documented here as-is. **Never introduce new colors, fonts,
or radii outside this list.**

## Genre
modern-minimal (function-first product app; no marketing enrichment on app pages)

## Macrostructure family
- App pages (Spar booking flow, Compét screens): **Workbench** — a persistent
  identity/status header, one dominant primary action, content organized as
  scannable cards/lists below. No hero, no enrichment — the data is the content.
- Marketing pages (`/`): Marquee Hero (unchanged, out of scope for this pass).

## Theme (existing Tailwind v4 `@theme`, `src/app/globals.css`)
- `--color-obsidian` #070707 — page background
- `--color-carbon` #101010 — first-level surface (cards)
- `--color-graphite` #181818 — second-level surface (nested/hover)
- `--color-steel` #292929 — borders, dividers
- `--color-smoke` #767676 — secondary/muted text
- `--color-mist` #b7b7b7 — tertiary text, between smoke and bone
- `--color-bone` #f5f3ee — primary text, primary mark color
- `--color-fight-red` #e31b23 — the only accent. ≤ one dominant use per screen
  (the single primary action). Never used for large fills or backgrounds.
- Semantic (never used as decorative accent): success #30d158, verified #4c8dff,
  warning #ffb020, error #e5484d, information #7dd3fc

## Typography
- Display: `font-condensed` (Barlow Condensed), bold/semibold, uppercase for
  headings and labels. Used for numerals, screen titles, section heads.
- Body: `font-sans` (Instrument Sans), regular/medium/semibold. Used for
  everything else — copy, buttons, form fields.
- No third face. No italics anywhere (headings or body).

## Spacing & radius
- `rounded-card` (16px) for surfaces/cards, `rounded-pill` (999px) for buttons
  and chips, `rounded-md` (12px) for inputs. Never an arbitrary radius value.
- Existing Tailwind spacing scale (px-5, py-4, gap-3, etc.) — stay on the scale,
  no arbitrary pixel values unless matching an existing pattern in the file.

## Motion
- `--ease-standard` / `--ease-entrance` / `--ease-exit` already defined.
  Reduced-motion fallback already global (globals.css § media query).
- Keep interaction motion minimal: opacity/transform only, short durations.

## Microinteractions stance
- Silent success over celebratory toasts (existing pattern: optimistic list
  updates, no confirmation modals for reversible actions).
- No hover-tooltip delays needed — this is primarily a touch-first mobile-web
  surface; design for tap targets ≥ 44px, not hover states.

## CTA voice
- Primary CTA: `bg-fight-red text-pure-white`, `rounded-pill`, bold, one per
  screen maximum — the single action that matters most on that screen.
- Secondary CTA: `bg-carbon` or `border border-steel`, `text-bone`, `rounded-pill`.
- Tertiary/ghost: text-only, `text-smoke`, underline on tap targets that need
  to be discoverable but not competing (e.g. "Signaler un problème").

## Per-page allowances
- App pages (Spar, Compét): function first. No decorative imagery, no
  gradients beyond what already exists (e.g. subtle radial on generated
  marketing posts — not in-app).
- Marketing page (`/`): may use enrichment. Out of scope here.

## What pages MUST share
- The RingPath wordmark (Compét) / Spar mark (red diagonal variant) in the
  header of every screen.
- Fight Red reserved for exactly one primary action per screen.
- Barlow Condensed for headings/numerals, Instrument Sans for body — no
  exceptions.
- Card surfaces at `bg-carbon`, `rounded-card`, never a raw border-only card
  without a filled surface (flat-on-flat reads unfinished).

## What pages MAY differ on
- Internal layout of the Workbench macrostructure (stacked cards vs. a
  single-focus card + list, depending on how many things the screen tracks).
- Whether a screen shows a back-chevron header or a full masthead header.

## Scope of this pass
Applies to: `src/components/spar/SparHome.tsx`, `FindSpar.tsx`,
`SparSessionDetail.tsx` — the booking journey a first-time visitor from
Instagram takes (browse → view a session → request to join). Everything else
in the app is unchanged by this pass.

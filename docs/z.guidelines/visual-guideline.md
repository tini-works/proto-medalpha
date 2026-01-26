# DocliQ – Visual Guideline (Brand Guide 2025)

This is the **strict** visual system for DocliQ-aligned UI in this repo (incl. Booking N3).

**Sources of truth**
- Brand PDF: `docs/z.guidelines/Docliq Brand Guide 2025.pdf`
- Tokens (extracted from the PDF): `docs/z.guidelines/docliq-tokens.json`
- Booking N3 implementation reference: `apps/appointment-booking-N3/src/index.css`

If anything conflicts, prefer the **brand PDF**, then `docliq-tokens.json`, then app CSS.

## Design intent (non-negotiable)
- **Trust, efficiency, humanity** (professional healthcare tone; calm, not “startup flashy”).
- **Mobile-first**: single-column, one primary action per screen, predictable navigation.
- **Germany + i18n-first**: support long German strings; avoid truncation; avoid idioms.
- **White-label ready**: use **semantic tokens** (roles), not hard-coded colors.

## Color (use semantic tokens only)
Do not invent palettes. Use `docs/z.guidelines/docliq-tokens.json` → `color.semantic.*`.

**Core surfaces**
- App background: `background.primary` = `#FAF8F5` (Cream 100)
- Card/surface: `background.secondary` = `#FFFFFF`
- Subtle section: `background.tertiary` = `#F5F3EF` (Cream 200)
- Inverse surface: `background.inverse` = `#1C2A30` (Charcoal 500)

**Primary action**
- Default: `interactive.primary` = `#13A3B5` (Teal 500)
- Hover: `interactive.primaryHover` = `#0F8A99` (Teal 600)
- Active: `interactive.primaryActive` = `#0B6F7C` (Teal 700)
- Text on primary: `text.onBrand` = `#FFFFFF`

**Text**
- Primary: `text.primary` = `#1C2A30`
- Secondary: `text.secondary` = `#5E7A86`
- Tertiary: `text.tertiary` = `#7C939D` (large text only)
- Links: `text.link` = `#0F8A99`

**Status (never color-only)**
- Success: Teal-based (background `#E8F6F8`, border `#13A3B5`, icon/text `#0B6F7C`)
- Error: Coral-based (background `#FDF3F0`, border `#E06A4F`, icon/text `#A03D2D`)
- Warning: Coral-based (background `#FAE0D9`, border `#E88A73`, icon/text `#C9503A`)
- Info: Slate-based (background `#EEF1F3`, border `#5E7A86`, icon/text `#3E5159`)

## Typography (DM Sans)
Use `typography.*` from `docliq-tokens.json`.
- Font family: **DM Sans** with system fallbacks.
- Default body: **16px**, line-height **1.5**.
- Labels/navigation: weight **500**.
- Headlines: weight **600–700**; line-height **tight/snug**.
- Overlines: uppercase, wider tracking (use sparingly).

Rules:
- No fixed-height text containers.
- Prefer wrapping; allow hyphenation where appropriate (`de-DE`).

## Layout, spacing, and density
Use `spacing.*` (4px base). Defaults:
- Page padding: 16–24px
- Card padding: 20–24px
- Section gaps: 24–32px
- Minimum tap target: **44px**

## Radius and elevation
Use `radius.*` and `shadow.*`:
- Buttons/inputs/cards: `radius.md` (8px) to `radius.lg` (12px)
- Modals/large surfaces: up to `radius.xl` (16px)
- Shadows: prefer `shadow.sm`/`shadow.md`; avoid heavy elevation except dialogs.

## Motion
Use `motion.duration` and `motion.easing`:
- Micro interactions: **150ms**
- Default transitions: **200ms**
- Page/sheet transitions: **300ms**
- Respect `prefers-reduced-motion`.

## Component rules (Booking N3)
- **Primary CTA**: Teal background + white label; disabled state uses neutral surface + muted text (not “ghost teal”).
- **Secondary CTA**: neutral surface with border; avoid competing accents.
- **Forms**: 16px inputs (avoid iOS zoom); clear error text with icon + message (not color-only).
- **Headers**: sticky only when needed; keep titles short; provide back affordance.
- **Bottom navigation**: calm, neutral; active state can use stronger text/underline, not aggressive brand blocks.
- **Bottom sheets/modals**: rounded top (`radius.lg`/`xl`), dim overlay, close button with 44px target.

## Content & tone
- Prefer German, formal “Sie” for production strings.
- Short, direct, reassuring; no exclamation marks; no marketing claims.
- Avoid diagnostic language; describe actions and next steps.

## Avoid
- Arbitrary blues/greens that don’t map to DocliQ tokens
- Decorative gradients, glassmorphism, fintech “shine”
- Dense dashboards on mobile; too many CTAs per screen

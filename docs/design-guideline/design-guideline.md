# Design Guideline (Warm Wellness)

This document translates the moodboard into a consistent, approachable system.
Direction: warm, soft, calm, and premium with rounded shapes, airy spacing, and
gentle contrast.

## Design Principles
- Calm first: reduce visual noise, favor soft surfaces and light borders.
- Friendly warmth: use clementine accents and creamy neutrals.
- Rounded comfort: large radii, pill chips, and soft shadows.
- Clear hierarchy: strong type scale with generous line-height.

## Color Palette
Use warm neutrals as the base, with clementine for primary actions and sage for
supportive accents.

### Core Brand
| Token | Hex | Usage |
| --- | --- | --- |
| brand.50 | #FFF3ED | Subtle brand surfaces |
| brand.100 | #FFE3D6 | Card fills, highlights |
| brand.300 | #F7A97E | Hover, emphasis |
| brand.500 | #F28C5C | Primary accents, illustrations |
| brand.600 | #E57748 | Active fills, large text on light backgrounds |
| brand.700 | #CC6236 | Large text on white, secondary buttons |
| brand.800 | #B04D28 | Primary buttons, small text on white |

### Neutrals
| Token | Hex | Usage |
| --- | --- | --- |
| neutral.50 | #FFFBF7 | App background |
| neutral.100 | #F6F0E9 | Secondary background |
| neutral.200 | #E7DED6 | Borders, dividers |
| neutral.400 | #B8ADA3 | Secondary text |
| neutral.600 | #6C6158 | Body text |
| neutral.900 | #1F1A16 | Headings, primary text |

### Accents
| Token | Hex | Usage |
| --- | --- | --- |
| sage.100 | #DDEDE4 | Wellness surfaces |
| sage.500 | #7DBA99 | Supportive accents |
| sky.100 | #DFEAF2 | Card fills, illustrations |
| sky.500 | #89AFC6 | Data highlights |

### Feedback
| Token | Hex | Usage |
| --- | --- | --- |
| success.500 | #4FA57A | Success states |
| warning.500 | #F2B663 | Warnings |
| error.500 | #E26A5E | Errors |
| info.500 | #7AA7C7 | Informational |

### Gradients
- sunrise: linear-gradient(135deg, #FFDCC9 0%, #F28C5C 100%)
- sage-wash: linear-gradient(135deg, #E8F2EC 0%, #CFE6D8 100%)

## Typography
Typeface direction: warm, modern sans with clear numerals.

- Primary font: Manrope (fallback: Inter, system-ui, sans-serif)
- Mono: JetBrains Mono (for data-only areas)

### Type Scale
| Style | Size/Line | Weight | Usage |
| --- | --- | --- | --- |
| Display L | 40/44 | 700 | Month titles, hero metrics |
| Display M | 32/36 | 700 | Section hero cards |
| H1 | 28/32 | 700 | Page titles |
| H2 | 22/28 | 600 | Section headers |
| H3 | 18/24 | 600 | Subheaders |
| Body L | 20/30 | 400 | Primary body (large) |
| Body M | 18/28 | 400 | Primary body (default) |
| Body S | 16/24 | 500 | Secondary body, labels |
| Caption | 14/20 | 500 | Metadata, chips |

### Pairing Rules
- Use weight and size for hierarchy; avoid mixing multiple fonts.
- Use Display L/M only when a visual hero is needed.
- For cards, use H3 + Body M.
- For chips and tabs, use Caption with 600 weight.
- Default body copy should be 18/28 or larger for accessibility.

## Spacing System
Base: 4pt grid. Recommended scale (px):
0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

Common patterns:
- Page padding: 24
- Card padding: 20
- Section gap: 24 to 32
- Chip padding: 6 x 12

## Border Radius
Soft, rounded shapes dominate the system.

- radius.4: 4 (inputs, small tags)
- radius.8: 8 (small cards)
- radius.12: 12 (standard cards)
- radius.16: 16 (feature cards)
- radius.24: 24 (hero cards, nav pill)
- radius.full: 9999 (chips, pills)

## Shadows and Elevation
Warm, diffused shadows to avoid harsh contrast.

- elev.0: none
- elev.1: 0 1px 2px rgba(31, 26, 22, 0.06)
- elev.2: 0 6px 16px rgba(31, 26, 22, 0.08)
- elev.3: 0 14px 28px rgba(31, 26, 22, 0.12)

## Opacity and Transparency
Use low opacities to keep surfaces soft.

- 90% for overlays on cards
- 70% for secondary text on light backgrounds
- 40% for disabled icons
- 20% for subtle separators

## Animations and Transitions
Motion should feel calm and supportive.

- Duration: 120ms (micro), 200ms (standard), 320ms (hero)
- Easing: cubic-bezier(0.2, 0.8, 0.2, 1)
- Default: opacity + translateY(4px) on entry
- Tabs and chips: 200ms color/underline transitions
- Reduce motion when system prefers-reduced-motion is set

## Component Styles
### Buttons
- Primary: brand.500 background, white text, rounded-2xl
- Secondary: neutral.100 background, neutral.900 text
- Ghost: transparent, neutral.600 text, subtle hover fill

### Cards
- Large radius (16-24)
- Soft border (neutral.200) optional
- Use gradients for monthly/hero cards

### Chips and Tabs
- Pill shape, Caption 600
- Active: brand.500 text on brand.50 fill
- Inactive: neutral.600 text on neutral.100 fill

### Inputs
- Rounded 12
- Neutral border with brand focus ring
- Inline helper text in neutral.400

## Contrast and Accessibility
Contrast checks (WCAG 2.1 AA):
- brand.500 on white: 2.42:1 (fails)
- brand.600 on white: 2.97:1 (fails)
- brand.700 on white: 3.91:1 (large text only)
- brand.800 on white: 5.33:1 (passes)

Guidance:
- White text on brand.500 does not meet WCAG AA; use brand.800 or dark text if AA is required.
- Use brand.700+ for text on white backgrounds.
- Use neutral.900 for body text on light surfaces.

### Bottom Navigation
- Floating pill container
- Active icon filled, inactive outlined

## Common Tailwind CSS Usage (Proposed)
These classes assume new tokens will be added to the Tailwind preset.

Layout and spacing:
- `px-6`, `py-5`, `gap-3`, `space-y-4`, `rounded-2xl`

Color usage:
- `bg-neutral-50`, `bg-neutral-100`, `bg-brand-50`
- `text-neutral-900`, `text-neutral-600`, `text-brand-700`
- `border-neutral-200`
- `bg-brand-500`, `hover:bg-brand-600`

Elevation and motion:
- `shadow-elev-1`, `shadow-elev-2`
- `transition-all duration-200 ease-smooth`

Typography:
- `text-2xl font-bold`, `text-lg font-semibold`, `text-sm font-medium`

## Example Component Reference (Design Code)
```tsx
export function MonthlyRecapCard() {
  return (
    <div className="rounded-3xl bg-brand-500 text-white p-6 shadow-elev-2">
      <p className="text-sm/5 font-medium opacity-80">Activity Recap</p>
      <h2 className="mt-3 text-4xl/10 font-bold tracking-tight">October</h2>
      <div className="mt-6 flex items-center gap-2">
        <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
          25 days
        </span>
        <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
          +8% vs last month
        </span>
      </div>
    </div>
  )
}
```

## Accessibility Notes
- Aim for 4.5:1 contrast on body text.
- Use larger type sizes for key summaries.
- Make tap targets at least 44x44.

## Token Update Plan (After Approval)
Update:
- `packages/tokens/src/colors.json`
- `packages/tokens/src/typography.json`
- `packages/tokens/src/spacing.json`
Then rebuild tokens to update the Tailwind preset.

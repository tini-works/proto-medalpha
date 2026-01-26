---
created: 2026/01/19 17:05:07
updated: 2026/01/19 17:05:39
---

## 1. German Market Considerations

### Cultural and regulatory sensibility

- **Tone**: More formal, less “friendly SaaS”.
    - Reduce playful microcopy.
    - Prefer neutral, factual phrasing over motivational language.
- **Trust signals matter more than delight**.
    - Clear provenance of data.
    - Explicit labelling of metrics, sources, and timeframes.

### Visual implications

- Lower tolerance for:
    - Excessive gradients.
    - Decorative imagery without function.
- Higher tolerance for:
    - Structured layouts.
    - Clear grouping.
    - Slightly denser information, if logically organised.

### Colour and emphasis

- Lime green usage should be **further restricted**.
    - Use it strictly for deltas, improvements, or compliance-safe “positive” signals.
- Avoid any colour usage that could imply **medical advice or urgency**.

### Numbers and formatting

- European formatting by default:
    - Decimal comma (8,65 %).
    - Thousands separator with dot (1.000.000 €).
- Currency always explicit.
- Dates in DD.MM.YYYY.

---

## 2. Multi-Language Support (i18n-First Design)

### Layout resilience

- All components must assume **30–40% text expansion**.
    - German strings will break tight layouts if not planned.
- Avoid fixed-width KPI labels.
- Use flexible containers, not truncation, for:
    - Card titles.
    - Chart legends.
    - Filter labels.

### Typography strategy

- Use a typeface with:
    - Full Latin Extended support.
    - Clear numerals and diacritics.
- Maintain numeric hierarchy; words can grow, numbers must not shrink.

### UI copy rules

- Prefer nouns over verbs in labels.
- Avoid idioms, metaphors, or culturally specific phrases.
- No text baked into charts or images.

### Directionality and scalability

- Prepare for future RTL support, even if not required now.
- Icons should not encode meaning through direction alone.

---

## 3. Mobile-First Adaptation

### Information architecture

- Reframe dashboards as **stacked insight modules**.
- One primary insight per screen.
- Secondary metrics behind taps, not shown by default.

### Card behaviour

- Cards become:
    - Vertically scrollable.
    - Expandable.
    - Context-aware (summary → detail).
- Remove “overview overload”; mobile is for **decisions**, not audits.

### Data visualisation on mobile

- Prefer:
    - Spark lines.
    - Mini bar charts.
    - Delta indicators.
- Avoid:
    - Multi-axis charts.
    - Dense legends.
    - Hover-dependent interactions.

### Touch ergonomics

- Larger tap targets.
- Clear separation between scroll and tap zones.
- No hidden gestures without visual cues.

---

## 4. White-Label Product Requirements

### Brand abstraction

- Brand identity must be **tokenised**, not hardcoded.
    - Colour roles, not colours.
    - Typography scales, not fonts.
    - Radius, elevation, and motion as variables.

### What can be themed

- Primary and accent colours.
- Logo placement.
- Header treatment.
- Card radius and surface tone.
- Chart highlight colour.

### What must remain fixed

- Information hierarchy.
- Accessibility contrast ratios.
- Data semantics (positive, neutral, negative).
- Interaction patterns.

### Visual neutrality

- Default theme should be:
    - Conservative.
    - Non-opinionated.
    - Slightly “boring” in the best sense.
- Avoid strong brand personality leaking into structure.

---

## 5. Combined Constraints: Where It Gets Tricky

### Germany + White-Label

- Some clients will demand:
    - Strong corporate branding.
    - Conservative UI.
- System must support both **minimal** and **heavy-brand** skins without breaking usability.

### Mobile + Multi-Language

- German + mobile is the stress test.
- If it works in German on a phone, it will work everywhere.

### Healthcare context

- Never imply causality where there is correlation.
- Avoid visual language that feels diagnostic or prescriptive.
- Data clarity beats visual flair every time.

---

## 6. Updated Design North Star

> A configurable, regulation-aware healthcare analytics system that remains calm, precise, and legible across languages, brands, and devices.

If you want, I can next:

- Convert this into a **design-system readiness checklist**.
- Define **token categories for white-label theming**.
- Redesign one existing dashboard screen as **mobile-first German UI**.
- Pressure-test the system with a worst-case scenario, long German strings, dense KPIs, small screen.

Tell me which direction to push.

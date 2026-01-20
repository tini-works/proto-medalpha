
# 2. TYPOGRAPHY GUIDELINES

## Google Sans – Implementation and Usage

### 2.1 Why Google Sans

* Excellent Latin Extended coverage.
* High x-height; strong legibility at small sizes.
* Neutral tone; suitable for healthcare and regulated products.
* Clear numerals; works well with tabular figures.

---

## 2.2 Font Stack Rules

```css
font-family: "Google Sans", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Rules:

* Google Sans is primary.
* Inter is mandatory fallback.
* Never remove system fallbacks.

---

## 2.3 Type Roles and Usage

### Body Text

* Token: `font-size-md`
* Weight: Regular (400)
* Line height: 1.5
* Use for:

  * Descriptions
  * Explanatory copy
  * Legal and compliance text

---

### Labels and UI Meta

* Token: `font-size-sm`
* Weight: Regular (400)
* Line height: 1.4
* Never bold labels.
* Never use all caps.

---

### Section Headings

* Token: `font-size-lg`
* Weight: Medium (500)
* Line height: 1.35
* Use sparingly; hierarchy comes from spacing, not size alone.

---

### KPIs and Key Numbers

* Token: `font-size-kpi`
* Weight: Semibold (600)
* Line height: 1.2
* Numeric features enabled:

```css
font-feature-settings: "tnum";
```

Rules:

* Numbers must never wrap.
* KPIs must visually dominate labels.

---

## 2.4 Font Scaling Behaviour

* All sizes are `rem`-based.
* User font-size setting applies a scale factor:

  * Default: 1.0
  * Large: 1.15
  * Extra Large: 1.3

Typography hierarchy ratios remain fixed.

---

## 2.5 Internationalisation Constraints

Mandatory checks:

* German compound nouns must wrap cleanly.
* Diacritics must remain readable at `font-size-sm`.
* No truncation for medical or legal terms.

---

## 2.6 What Is Explicitly Disallowed

* Condensed fonts.
* Decorative alternates.
* Letter-spacing used as emphasis.
* Font weight as the only semantic indicator.

---

## Final Note

This system is now:

* **Tailwind-compatible**
* **Multi-language safe**
* **Mobile-first**
* **White shows through branding without letting branding distort meaning**

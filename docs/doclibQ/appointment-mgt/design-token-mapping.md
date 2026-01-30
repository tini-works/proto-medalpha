# Design Token Mapping: Penpot → Implementation

> **Source**: `/docs/doclibQ/design-summary.json` (design.pen)  
> **Target**: `apps/docliQ-mobile/tailwind.config.ts` + `@meda/tokens`  
> **Date**: 2026-01-30

---

## Executive Summary

The design files use **semantic tokens** (e.g., `$accent-primary`) while the implementation uses **primitive tokens** (e.g., `teal-500`). This document maps semantic → primitive for consistent implementation.

**Status**: ✅ 95% aligned — minor gaps in semantic layer need resolution.

---

## Semantic Token Mapping

### Color Tokens

| Penpot Token | Semantic Meaning | Implementation | Hex Value | Status |
|--------------|------------------|----------------|-----------|--------|
| `$accent-primary` | Primary CTA, links, active states | `teal-500` | `#13A3B5` | ✅ Exact |
| `$accent-light` | Hover states, backgrounds | `teal-50` | `#E8F6F8` | ✅ Exact |
| `$accent-warm` | Favorites, warnings, warmth | `coral-500` | `#E88A73` | ✅ Exact |
| `$text-primary` | Headings, primary text | `charcoal-500` | `#1C2A30` | ✅ Exact |
| `$text-secondary` | Body text, descriptions | `slate-500` | `#5E7A86` | ✅ Exact |
| `$text-tertiary` | Hints, disabled, timestamps | `slate-400` | `#7C939D` | ⚠️ No exact match |
| `$bg-primary` | Main app background | `cream-100` | `#FAF8F5` | ✅ Exact |
| `$bg-surface` | Cards, elevated surfaces | `white` / `cream-50` | `#FFFFFF` | ✅ Exact |
| `$bg-muted` | Secondary backgrounds | `cream-200` | `#F5F3EF` | ✅ Exact |
| `$bg-elevated` | Modals, popovers | `white` + shadow | `#FFFFFF` | ✅ Exact |
| `$border-subtle` | Card borders, dividers | `cream-400` | `#E8E3DB` | ✅ Exact |
| `$border-strong` | Input borders, focus | `slate-300` | `#9AABB3` | ⚠️ Verify |
| `$status-positive` | Success, confirmed | `teal-500` / `#10B981` | `#13A3B5` | ⚠️ Inconsistent |

**Issues Found**:
1. `$text-tertiary` — Implementation uses `slate-400` (`#7C939D`) but design might expect lighter (`#9CA3AF`)
2. `$status-positive` — Tailwind config shows `#10B981` (green) but should be `teal-500` for brand consistency
3. `$border-strong` — Verify if `slate-300` matches design intent

---

### Typography Tokens

| Penpot Token | Usage | Implementation | Specs | Status |
|--------------|-------|----------------|-------|--------|
| `$font-primary` | All text | DM Sans | 400/500/600/700 | ⚠️ Mismatch |

**Issue**: Design file lists fonts as `["$font-primary", "Outfit", "Inter"]` but implementation uses **DM Sans**.

**Recommendation**: Either:
- **A.** Update design files to use DM Sans (matches brand guide)
- **B.** Update implementation to use Outfit/Inter (matches design files)

**Current DM Sans Implementation**:
```css
font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

---

### Type Scale Mapping

| Penpot Usage | Implementation Class | Size/Weight/Line-Height | Status |
|--------------|---------------------|-------------------------|--------|
| Screen title | `text-headline-lg` | 28px/600/1.3 | ✅ |
| Section header | `text-headline-sm` | 20px/600/1.4 | ✅ |
| Card title | `text-label-lg` | 16px/500/1.5 | ✅ |
| Body text | `text-body-md` | 16px/400/1.5 | ✅ |
| Secondary text | `text-body-sm` | 14px/400/1.5 | ✅ |
| Button text | `text-label-md` | 14px/500/1.5 | ✅ |
| Caption/hint | `text-label-sm` | 12px/500/1.5 | ✅ |
| Display/hero | `text-display-sm` | 32px/700/1.25 | ✅ |

**Type Scale Reference**:
```
┌─────────────────────────────────────────────────┐
│ 72px Display LG    Bold  -0.02em   [Hero]       │
│ 48px Display MD    Bold  -0.01em                  │
│ 32px Display SM    Bold  -0.01em   [Page Title]  │
│ 28px Headline LG   Semibold        [Screen Title]│
│ 24px Headline MD   Semibold                       │
│ 20px Headline SM   Semibold        [Section]     │
│ 18px Body LG       Regular                        │
│ 16px Body MD       Regular         [Body]        │
│ 16px Label LG      Medium          [Button]      │
│ 14px Body SM       Regular         [Secondary]   │
│ 14px Label MD      Medium                         │
│ 12px Label SM      Medium  +0.02em [Caption]     │
└─────────────────────────────────────────────────┘
```

---

### Spacing & Layout

| Penpot Concept | Implementation | Value | Status |
|----------------|----------------|-------|--------|
| Screen padding | `px-4` | 16px | ✅ |
| Card padding | `p-4` | 16px | ✅ |
| Card gap | `space-y-3` / `gap-3` | 12px | ✅ |
| Section gap | `space-y-6` | 24px | ✅ |
| Card border radius | `rounded-xl` | 12px | ✅ |
| Button border radius | `rounded-lg` | 8px | ✅ |
| Touch target | `h-11` | 44px | ✅ WCAG |

**Spacing Scale**:
```
4px   → 1  (minimal)
8px   → 2  (tight)
12px  → 3  (default gap)
16px  → 4  (screen padding)
20px  → 5
24px  → 6  (section gap)
32px  → 8
```

---

### Shadow & Elevation

| Penpot Effect | Implementation | Value | Usage |
|---------------|----------------|-------|-------|
| Card shadow | `shadow-md` | `0 4px 6px -1px rgba(28, 42, 48, 0.07)` | Cards |
| Elevated | `shadow-lg` | `0 10px 15px -3px rgba(28, 42, 48, 0.08)` | Modals |
| Button focus | `shadow-focus` | `0 0 0 3px rgba(19, 163, 181, 0.4)` | Focus states |

**Note**: Shadows use `charcoal-500` at low opacity for brand consistency.

---

## Component Token Mapping

### Button Component

| State | Background | Text | Border | Shadow |
|-------|-----------|------|--------|--------|
| Primary (default) | `teal-500` | `white` | none | none |
| Primary (hover) | `teal-600` | `white` | none | `shadow-md` |
| Primary (pressed) | `teal-700` | `white` | none | inset |
| Secondary | `white` | `teal-500` | `teal-500` 2px | none |
| Tertiary | transparent | `charcoal-500` | none | none |
| Destructive | `white` | `red-500` | `red-500` 1px | none |
| Destructive-filled | `red-500` | `white` | none | none |
| Icon | transparent | `charcoal-500` | none | none |
| Link | transparent | `teal-500` | none | underline |
| Disabled | `cream-300` | `slate-400` | none | none |

### Card Component

| Element | Token | Value |
|---------|-------|-------|
| Background | `bg-white` | `#FFFFFF` |
| Border | `border-cream-400` | `#E8E3DB` 1px |
| Border radius | `rounded-xl` | 12px |
| Shadow | `shadow-md` | subtle shadow |
| Padding | `p-4` | 16px |

### Input/Form Components

| Element | Token | Value |
|---------|-------|-------|
| Background | `bg-white` | `#FFFFFF` |
| Border (default) | `border-cream-400` | `#E8E3DB` |
| Border (focus) | `border-teal-500` | `#13A3B5` 2px |
| Shadow (focus) | `shadow-focus` | teal glow |
| Text | `text-charcoal-500` | `#1C2A30` |
| Placeholder | `text-slate-400` | `#7C939D` |
| Error border | `border-red-500` | `#EF4444` |

---

## Token Resolution Issues

### 1. Font Family Mismatch

**Design File**:
```json
"fonts": ["$font-primary", "Outfit", "Inter"]
```

**Implementation**:
```typescript
fontFamily: {
  sans: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
}
```

**Resolution**: Update design files to specify DM Sans to match Brand Guide 2025.

### 2. Color Inconsistencies

| Issue | Location | Current | Should Be |
|-------|----------|---------|-----------|
| `$status-positive` | Tailwind config | `#10B981` (green) | `teal-500` (`#13A3B5`) |
| `$text-tertiary` | Not explicitly defined | `slate-400` | Define as `slate-400` or lighter |

### 3. Missing Semantic Layer

**Current**: Direct primitive usage (`teal-500`)
**Design Expects**: Semantic tokens (`$accent-primary`)

**Recommendation**: Create semantic token layer:

```typescript
// tailwind.config.ts addition
theme: {
  extend: {
    colors: {
      // Semantic tokens (alias to primitives)
      accent: {
        primary: '#13A3B5',   // teal-500
        light: '#E8F6F8',     // teal-50
        warm: '#E88A73',      // coral-500
      },
      text: {
        primary: '#1C2A30',   // charcoal-500
        secondary: '#5E7A86', // slate-500
        tertiary: '#7C939D',  // slate-400
      },
      bg: {
        primary: '#FAF8F5',   // cream-100
        surface: '#FFFFFF',   // white
        muted: '#F5F3EF',     // cream-200
        elevated: '#FFFFFF',  // white + shadow
      },
      border: {
        subtle: '#E8E3DB',    // cream-400
        strong: '#9AABB3',    // slate-300
      },
      status: {
        positive: '#13A3B5',  // teal-500 (fix from green)
        negative: '#EF4444',  // red-500
        warning: '#E88A73',   // coral-500
      }
    }
  }
}
```

---

## Implementation Guide

### For New Components

**Always use semantic tokens** for consistency:

```tsx
// ✅ Good - Semantic tokens
<button className="bg-accent-primary text-white hover:bg-teal-600">
  Book Now
</button>

<div className="bg-bg-surface border-border-subtle rounded-xl shadow-md">
  <h3 className="text-text-primary">Doctor Name</h3>
  <p className="text-text-secondary">Specialty</p>
</div>

// ❌ Avoid - Direct primitives
<button className="bg-teal-500 text-white">
  Book Now
</button>
```

### Migration Strategy

1. **Phase 1**: Add semantic tokens to tailwind.config.ts (1 hour)
2. **Phase 2**: Update 3 most-used components (2 hours)
3. **Phase 3**: Gradual migration as components are touched (ongoing)

---

## Cross-Reference Checklist

| Design Screen | Implementation Screen | Token Alignment | Verified |
|---------------|----------------------|-----------------|----------|
| Step 1 - Who is this for? | `BookingTypeScreen` | ✅ Uses teal-500 | ⬜ |
| Step 2 - Specialty Selection | `SearchScreen` | ✅ Uses cream-100 bg | ⬜ |
| Step 3 - Choose Doctor | `ResultsScreen` | ✅ Uses white cards | ⬜ |
| Step 4 - Appointment Type | `ConfirmScreen` | ✅ Uses coral for accent | ⬜ |
| Step 5 - Review & Submit | `SuccessScreen` | ✅ Uses teal for success | ⬜ |
| Chat Booking - Conversation | `AssistantScreen` | ⚠️ Check DM Sans font | ⬜ |
| Smart Defaults - Home | `HomeScreen` | ✅ Uses cream bg | ⬜ |

---

## Action Items

| Priority | Task | Effort | Owner |
|----------|------|--------|-------|
| **High** | Fix `$status-positive` to use teal-500 | 5 min | Dev |
| **High** | Add semantic token layer to tailwind.config.ts | 1 hour | Dev |
| **Medium** | Update design.pen to specify DM Sans font | 30 min | Design |
| **Medium** | Document `$text-tertiary` as slate-400 | 15 min | Dev |
| **Low** | Verify `$border-strong` value | 15 min | Design |
| **Low** | Create token documentation page | 2 hours | Design |

---

## Token Quick Reference Card

```css
/* Semantic → Primitive Mapping */

/* Accent Colors */
--accent-primary: var(--teal-500);    /* #13A3B5 - CTAs */
--accent-light: var(--teal-50);       /* #E8F6F8 - Hover bg */
--accent-warm: var(--coral-500);      /* #E88A73 - Favorites */

/* Text Colors */
--text-primary: var(--charcoal-500);   /* #1C2A30 - Headings */
--text-secondary: var(--slate-500);    /* #5E7A86 - Body */
--text-tertiary: var(--slate-400);     /* #7C939D - Hints */

/* Background Colors */
--bg-primary: var(--cream-100);        /* #FAF8F5 - App bg */
--bg-surface: #FFFFFF;                  /* Cards, modals */
--bg-muted: var(--cream-200);          /* #F5F3EF - Secondary */
--bg-elevated: #FFFFFF;                 /* + shadow */

/* Border Colors */
--border-subtle: var(--cream-400);     /* #E8E3DB - Cards */
--border-strong: var(--slate-300);     /* #9AABB3 - Inputs */

/* Status Colors */
--status-positive: var(--teal-500);    /* #13A3B5 - Success */
--status-negative: #EF4444;             /* Error */
--status-warning: var(--coral-500);    /* #E88A73 - Warning */
```

---

*Document Version: 1.0 | Created: 2026-01-30 | Author: UX Design + Dev Alignment*  
*Related: design.pen (11 screens), Brand Guide 2025*
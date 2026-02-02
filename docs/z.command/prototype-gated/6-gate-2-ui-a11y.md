---
name: prototype-gated:6-gate-2-ui-a11y
description: Quick UI consistency and accessibility check before validation (Recommended gate)
---

# Gate 2: UI CONSISTENCY & A11Y (Recommended)

**Purpose:** Quick check before user testing - catch obvious issues that would block validation

## When to Use

- Use when prototype will be shown to users
- Use when testing with accessibility needs
- Skip for internal-only quick tests

## Input

- Built prototype(s) from BUILD step
- Design system reference (if available)

## Process

1. **Review UI consistency** - colors, typography, spacing, components, icons
2. **Spot-check accessibility** - contrast, touch targets, text, focus, labels
3. **Categorize issues:**
   - BLOCKERS (must fix before testing)
   - NOTES (ok to test with, fix later)
4. **Make decision** - PASS / PASS WITH NOTES / FIX REQUIRED

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ GATE 2: UI & A11Y CHECK        Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 REVIEWING: [Prototype name/location]                         │
├─────────────────────────────────────────────────────────────────┤
│ 🎨 UI CONSISTENCY                                               │
│ ┌────────────────────┬────────┬─────────────────────┐           │
│ │ Check              │ Status │ Notes               │           │
│ ├────────────────────┼────────┼─────────────────────┤           │
│ │ Colors match DS    │ 🟢/🟡/🔴│                     │           │
│ │ Typography matches │ 🟢/🟡/🔴│                     │           │
│ │ Spacing consistent │ 🟢/🟡/🔴│                     │           │
│ │ Components from DS │ 🟢/🟡/🔴│                     │           │
│ │ Icons consistent   │ 🟢/🟡/🔴│                     │           │
│ └────────────────────┴────────┴─────────────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ ♿ ACCESSIBILITY SPOT-CHECK                                      │
│ ┌────────────────────┬────────┬─────────────────────┐           │
│ │ Check              │ Status │ Notes               │           │
│ ├────────────────────┼────────┼─────────────────────┤           │
│ │ Color contrast     │ 🟢/🟡/🔴│ [ratio if measured] │           │
│ │ Touch targets 44px │ 🟢/🟡/🔴│                     │           │
│ │ Text readable      │ 🟢/🟡/🔴│                     │           │
│ │ Focus states       │ 🟢/🟡/🔴│ [if interactive]    │           │
│ │ Alt text/labels    │ 🟢/🟡/🔴│                     │           │
│ └────────────────────┴────────┴─────────────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ BLOCKERS (must fix before testing)                           │
│ • [issue 1] - blocks [validation because...]                    │
│                                                                 │
│ 📝 NOTES (ok to test with, fix later)                           │
│ • [issue 2] - cosmetic, won't affect validation                 │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: PASS / PASS WITH NOTES / FIX REQUIRED                    │
├─────────────────────────────────────────────────────────────────┤
│ ✅ GATE DECISION:                                               │
│ [ ] PASS - proceed to validation                                │
│ [ ] PASS WITH NOTES - proceed, fix noted issues later           │
│ [ ] FIX REQUIRED - fix blockers before testing                  │
│ Decided by: _____________ Date: _____________                   │
└─────────────────────────────────────────────────────────────────┘
```

## UI Consistency Checks

| Check | What to Look For |
|-------|------------------|
| **Colors match DS** | Using correct palette, not random hex codes |
| **Typography matches** | Correct font, sizes, weights |
| **Spacing consistent** | Using design system spacing scale |
| **Components from DS** | Buttons, inputs, cards match system |
| **Icons consistent** | Same icon set, same size/weight |

## Accessibility Spot-Checks

| Check | What to Look For | Standard |
|-------|------------------|----------|
| **Color contrast** | Text readable against background | 4.5:1 minimum |
| **Touch targets** | Tappable areas large enough | 44x44px minimum |
| **Text readable** | Font size sufficient | 16px minimum |
| **Focus states** | Interactive elements show focus | Visible outline |
| **Alt text/labels** | Images/icons have descriptions | Present and meaningful |

## Status Codes

| Code | Meaning |
|------|---------|
| 🟢 | Pass - meets standard |
| 🟡 | Warning - minor issue, ok for testing |
| 🔴 | Fail - blocks validation |

## Issue Categories

| Category | Description | Action |
|----------|-------------|--------|
| **BLOCKERS** | Issues that would invalidate test results | Fix before testing |
| **NOTES** | Cosmetic issues, won't affect validation | Fix later |

## Gate Decisions

| Decision | When to Use |
|----------|-------------|
| **PASS** | All checks green, no blockers |
| **PASS WITH NOTES** | Some yellow warnings, no red blockers |
| **FIX REQUIRED** | Red blockers exist, fix before testing |

## Next Step

After PASS → **Step: Validation**

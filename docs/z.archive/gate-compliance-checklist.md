# Product Designer Checklist - Merge-Safe Implementation

**Date:** 2026-01-22
**Author:** Claude
**Status:** Draft

## Context

Assessment against product designer checklist revealed compliance gaps. This plan implements **only modifications to existing files**.

## Scope

**In Scope (No New Screens):**
1. Touch target fixes (component-level)
2. Booking confirmation dialog (existing page)
3. GDPR consent checkboxes (existing page, links to existing privacy page)

**Deferred (Adds New Screens):**
- Terms of Service page
- About page (certification labels)
- Glossary page
- Data privacy page
- E-Prescription flow

---

## Implementation

### 1. Touch Target Fixes
**Why:** WCAG 2.1 AA requires 44x44px minimum touch targets.

**Files:**
- `client/src/components/ui/button.tsx`
  - Change `min-h-9` (36px) → `min-h-11` (44px) for default
  - Change `min-h-8` (32px) → `min-h-10` (40px) for sm variant
- `client/src/components/ui/checkbox.tsx`
  - Add wrapper div with min 44px touch area around 16px checkbox
- `client/src/components/ui/switch.tsx`
  - Increase from `h-5 w-9` to `h-6 w-11` (24x44px)

**Effort:** ~10 tool calls

### 2. Booking Confirmation Dialog
**Why:** IEC 62366-1 error prevention for critical actions.

**Files:**
- `client/src/pages/booking/review.tsx`
  - Import AlertDialog from shadcn/ui
  - Wrap "Confirm Booking" button action in AlertDialog
  - Show summary: Doctor name, Date, Time
  - Add note: "Cancellation may incur fees"
  - Buttons: "Cancel" / "Confirm Booking"

**Effort:** ~10 tool calls

### 3. GDPR Consent Checkboxes
**Why:** German health apps require explicit consent at registration.

**Files:**
- `client/src/pages/register/account.tsx`
  - Add 2 required checkboxes before submit button:
    1. "I agree to the Privacy Policy" (link to /static/privacy)
    2. "I consent to processing of my health data as described in the Privacy Policy"
  - Disable "Create Account" button until both checked
  - Store consent timestamp in registration data

**Effort:** ~15 tool calls

---

## Deferred Items

| Item | Reason | When |
|------|--------|------|
| Terms of Service page | New screen | After merge |
| About page (CE/DiGA labels) | New screen | After merge |
| Glossary page | New screen | After merge |
| Data privacy UI | New screen | After merge |
| E-Prescription | Out of V1 scope | V2 |
| Full WCAG audit | Production | V2 |
| 14+ languages | Production | V2 |

---

## Files Modified (No New Files)

- `client/src/components/ui/button.tsx`
- `client/src/components/ui/checkbox.tsx`
- `client/src/components/ui/switch.tsx`
- `client/src/pages/booking/review.tsx`
- `client/src/pages/register/account.tsx`

**No changes to App.tsx routes.**

---

## Estimated Effort

| Item | Tool Calls |
|------|------------|
| Touch targets | ~10 |
| Booking dialog | ~10 |
| Consent checkboxes | ~15 |
| **Total** | ~35 |

---

## Verification

1. **Touch targets:** Open DevTools, inspect button/checkbox/switch elements, verify min 44px hit area
2. **Booking dialog:** Go through booking flow → review page → click Confirm → dialog appears with summary
3. **Consent:** Go to /register/account → checkboxes visible → button disabled until both checked → links work

# Product Designer Checklist - Deferred Items

**Date:** 2026-01-22
**Author:** Claude
**Status:** Deferred (pending merge)

## Context

These items add new screens/routes. 

---

## Implementation

### 1. Terms of Service Page
**Why:** Required for complete GDPR consent flow.

**Files to Create:**
- `client/src/pages/static/terms.tsx`

**Files to Modify:**
- `client/src/App.tsx` (add route)
- `client/src/pages/profile/legal.tsx` (update placeholder link)
- `client/src/pages/register/account.tsx` (update consent link from /static/privacy to /static/terms)

**Effort:** ~10 tool calls

### 2. About Page (Certification Labels)
**Why:** DiGA/MDR requires visible CE mark and registration info.

**Files to Create:**
- `client/src/pages/static/about.tsx`
  - CE mark icon
  - DiGA ID: "DiGA-2024-XXXXXX" (placeholder)
  - BfArM registration number
  - Device classification statement

**Files to Modify:**
- `client/src/App.tsx` (add route)
- `client/src/pages/static/legal.tsx` (add link to About)

**Effort:** ~15 tool calls

### 3. Medical Glossary Page
**Why:** Plain language requirement for accessibility.

**Files to Create:**
- `client/src/pages/static/glossary.tsx`
  - 10-15 German health terms: GKV, PKV, ePA, DiGA, gematik, Rezept, Kassenrezept, Zuzahlung, etc.

**Files to Modify:**
- `client/src/App.tsx` (add route)
- `client/src/pages/profile/legal.tsx` (add Glossary link)
- `client/src/pages/register/insurance-type.tsx` (add tooltip for GKV/PKV)

**Effort:** ~15 tool calls

### 4. Data Privacy Placeholder UI
**Why:** GDPR Articles 15-20 (access, portability, erasure rights).

**Files to Create:**
- `client/src/pages/profile/data.tsx`
  - "Download My Data" button (toast: "Feature coming soon")
  - "Delete My Account" button (toast: "Contact support")
  - List of data categories stored

**Files to Modify:**
- `client/src/App.tsx` (add route)
- `client/src/pages/profile/index.tsx` (add "My Data" menu item)

**Effort:** ~10 tool calls

---

## V2+ (Production Requirements)

| Item | Reason | Dependency |
|------|--------|------------|
| E-Prescription / gematik code | Core DiGA feature | Backend + gematik API |
| Full WCAG 2.1 AA audit | Accessibility certification | Testing tools + designer |
| 14+ language translations | Market requirement | Professional translators |
| RTL support | Arabic/Hebrew markets | i18n infrastructure |
| FHIR/ePA integration | Interoperability | Backend + gematik |
| Real data export | GDPR compliance | Backend aggregation |
| Account deletion | GDPR compliance | Backend cascade delete |
| Cookie consent banner | Analytics compliance | When analytics added |
| Contrast ratio fixes | Accessibility | Design system review |

---

## Summary

| Priority | Items | Effort |
|----------|-------|--------|
| Post-merge | 4 items | ~50 tool calls |
| V2+ | 9 items | TBD |

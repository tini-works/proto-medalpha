---
name: impl-plan:booking-n3:v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
created: 2026-01-26
updated: 2026-01-26
status: draft
scope: planning-only
sources:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md
  - docs/appointment-booking/2-design-plan-Reschedule-flow-v2.md
  - docs/appointment-booking/2-design-plan-Book-again-flow-v2.md
  - apps/appointment-booking-N3/src/App.tsx
  - apps/appointment-booking-N3/src/routes/paths.ts
guidelines:
  - docs/z.guidelines/visual-guidelines-abstract.md
  - docs/z.guidelines/visual-guideline.md
notes:
  - "This file is a plan only. Do not implement any code changes without explicit confirmation."
last_updated_by: nganpham
---

# Booking N3 — Implementation Plan (Guided Wizard + Reschedule v2 + Book Again v2)

This plan translates the 3 design-lite documents into implementable work packages for `apps/appointment-booking-N3/`. It is intentionally **docs-only** (no implementation).

## 0) Preconditions (must confirm before any code)

1. Confirm **policy decisions** listed in “Open decisions”.
2. Confirm whether we will implement the v2 flows by:
   - **Reusing current routes** where possible (recommended for prototype velocity), or
   - Introducing new routes for wizard steps / modal sheets (cleaner architecture, more churn).
3. Confirm whether “Confirm sheet (S09)” is a true **modal** (sheet) or a full route (current app uses `/booking/confirm`).

## 1) Deliverables (what “done” means)

- Guided Wizard v2 implemented end-to-end per `BOOK-001..BOOK-022`.
- Reschedule Flow v2 implemented per `RESCH-001..RESCH-006` (R01–R03) and `BOOK-017` safety rules.
- Book Again Flow v2 implemented per `AGAIN-001..AGAIN-005` (B01 + reuse S08/S09/S10).
- IA updated (canonical IA map remains `docs/artifacts/ia-map/IA.md`; comparison doc separate).

## 2) Milestones (suggested sequence)

- **M0 — Decisions + scaffolding**: confirm open decisions, agree on route/modal strategy, define screen-id mapping, add i18n scaffolding for German-first copy.
- **M1 — Wizard funnel (S01–S05)**: specialty → location → insurance → results with persistence, filters/sort, empty states.
- **M2 — Doctor → slot → confirm → success (S06–S10)**: doctor profile + reviews, slot picker, confirm, success, calendar/maps hooks, slot-taken handling.
- **M3 — Manage appointments (S11–S13)**: upcoming/history, appointment details, cancel confirm dialog, navigation consistency.
- **M4 — Reschedule v2 (R01–R03)**: suggested slots + calendar fallback + safety “book new before cancel old”.
- **M5 — Book again v2 (B01)**: prefill context from history, edit fields, reuse S08/S09/S10.
- **M6 — Quality gates**: a11y checks, offline/poor connectivity behaviors, basic analytics, e2e smoke.

## 3) Work breakdown (epics → tasks)

### Epic A — Navigation + screen-id mapping (Sxx/Bxx/Rxx)

- Map current screens/routes to design-lite screens:
  - Current booking: `/booking/search|location|results|doctor/:id|doctor/:id/slots|confirm|success` → S02/S03/S05/S06/S08/S09?/S10
  - Current history: `/history|history/:id` → S11/S12
  - Current reschedule: `/reschedule/:id|confirm|success` → R01/R02/R03
  - Current book-again: `/book-again/:id` → B01
- Decide what becomes **modal** vs **route**:
  - S09 Confirm sheet (modal)
  - S13 Cancel confirm dialog (modal)
- Define back-stack behavior to match specs (e.g., reschedule confirm returns to origin screen).

### Epic B — Wizard funnel (BOOK-001..006)

- S01 entry (“Termin buchen”) and consistent `Schritt X von 4`.
- S02 Specialty (BOOK-001): autocomplete (2+ chars), recents (max 5), chips, “HNO/ENT” mapping, “Ich bin nicht sicher”.
- S03 Location + radius (BOOK-002): GPS CTA, fallback copy, saved locations (max 3), default radius 10 km.
- S04 Insurance step (BOOK-003): prefill from profile, `Nur Kassenärzte` toggle behavior, tags and “no match” warning.
- S05 Results list (BOOK-004/005/006): filters sheet, active filter count, sort options, doctor cards with 3 slot pills + “Mehr Termine”, correct tap behaviors and empty states.
- Persistence across back/edit and app restarts (global constraint in Guided Wizard v2).

### Epic C — Doctor detail + trust (BOOK-007..009)

- S06 Doctor profile (BOOK-007): required content sections + sticky CTA `Termin auswählen`.
- S07 Reviews list (BOOK-009): safe truncation, `Mehr lesen`, `Alle Bewertungen`, sort rules.

### Epic D — Time selection + commit (BOOK-008..014, BOOK-010/011/012 focus)

- S08 Slot picker (BOOK-008/010): week navigation, `Heute`, duration, “slot taken” pre-confirm handling and exact error copy.
- S09 Confirm sheet (BOOK-011 + BOOK-021): for whom selector, optional “Grund” (200 chars), cost/coverage area (needs decision), CTAs, offline behavior.
- S10 Success (BOOK-012/013/014): booking number, calendar add, route open, confirmation comms notes.

### Epic E — Manage appointments (BOOK-015..018 + cancel)

- S11 Upcoming + history (BOOK-015/018): 12 months history, sort, empty states, `Erneut buchen` entry point.
- S12 Appointment details (BOOK-014/016/017): actions to cancel/reschedule, route/map, status handling.
- S13 Cancel confirm dialog (BOOK-016): policy display + move to history.

### Epic F — Reschedule v2 (RESCH-001..006 + BOOK-017)

- R01 Suggested slots (RESCH-001/002): 3–5 suggestions, reason labels always shown, expand/collapse “Warum”.
- R02 Confirm sheet (RESCH-003/005): comparison view, safety note, slot-taken error returns to origin (R01 or S08).
- R03 Success (RESCH-006): updated comms, new number if applicable, follow-up actions.
- Safety rule (RESCH-005 / BOOK-017): “book new before cancel old” + retry policy.

### Epic G — Book Again v2 (AGAIN-001..005)

- Entry point from S11 history list (AGAIN-001): `Erneut buchen` button (44px), works for cancelled/completed.
- B01 Pre-filled context (AGAIN-002/003): review screen, editable fields per spec, prefill logic and refresh rules.
- Reuse S08/S09/S10 (AGAIN-004/005) with context passed through.

### Epic H — Cross-cutting quality (BOOK-019/020 + analytics)

- A11y baseline (BOOK-019): 16px+, 44px targets, no timers, color-not-only signals, focus order.
- Poor connectivity (BOOK-020): 5 min cache, offline indicator, skeletons, retry and queue policy (needs decision).
- Basic analytics hooks aligned to success metrics (conversion, time-to-book, slot-taken errors).

## 4) Open decisions (need your confirmation)

From the design-lite docs (summarized):

- **Offline queuing policy** (BOOK-020): queue confirm when offline vs hard-block.
- **Cost/coverage truth source** (BOOK-011): authoritative pricing/coverage vs label-only.
- **Confirm UI shape** (S09): modal sheet vs full page (route).
- **Insurance “no matches” policy**: warn + allow proceed vs block (BOOK-003).
- **Doctor unavailable in Book Again**: dead-end vs suggest alternatives (Book Again v2 notes).
- **Rating/distance freshness** on B01 (Book Again v2): refresh strategy.

## 5) Acceptance checklist (high level)

- Guided Wizard funnel supports Specialty → Location → Insurance → Results with persistence.
- Results list supports filters, sort, doctor cards with 3 slot pills and correct navigation behaviors.
- Confirm supports slot-taken handling, offline behavior, and patient selector.
- Reschedule supports 3–5 suggestions with reason labels, safe “book new before cancel old”, and origin-aware back navigation.
- Book Again supports B01 review/edit and reuses calendar + confirm + success.


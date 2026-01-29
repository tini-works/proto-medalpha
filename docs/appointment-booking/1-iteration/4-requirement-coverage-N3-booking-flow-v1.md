---
name: coverage:n3-booking-flow-v1
feature: MEDA-BOOK (Appointment Booking N3 / Terminbuchung N3)
created: 2026-01-27
updated: 2026-01-27
status: draft
compares:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
evaluates:
  - docs/appointment-booking/2-design-plan-N3-booking-flow-v1.md
sources:
  - docs/appointment-booking/z.details/2-design-plan-Guided-wizard-v2.md
  - docs/appointment-booking/z.details/2-design-plan-Reschedule-flow-v2.md
  - docs/appointment-booking/z.details/2-design-plan-Book-again-flow-v2.md
---

# Requirement Coverage — Booking N3 end-to-end (v1)

This report checks requirement coverage of `docs/appointment-booking/2-design-plan-N3-booking-flow-v1.md` against the baseline requirements in `docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md`.

Legend:
- **C** = Covered (acceptance criteria specified in linked plans)
- **P** = Partial (some criteria or policy decisions missing)
- **M** = Missing (not specified)

## 1) Functional requirements (BOOK-001…BOOK-022)

Authority note: the N3 plan is a wrapper; detailed acceptance criteria live in the linked design plans under `docs/appointment-booking/z.details/`.

| ID | Scope requirement (short) | Coverage | Authority / notes |
|---|---|---:|---|
| BOOK-001 | Specialty search | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-002 | Location + radius | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-003 | Insurance filtering | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-004 | Filters | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-005 | Sort | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-006 | Doctor cards | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-007 | Doctor profile | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-008 | Full calendar | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-009 | Reviews | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-010 | Slot selection + real-time check | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-011 | Confirm sheet | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-012 | Success screen | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-013 | Calendar integration | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-014 | Maps integration | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-015 | Upcoming appointments | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-016 | Cancel (policy + move to history) | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-017 | Reschedule (same doctor + release timing) | C | `z.details/2-design-plan-Guided-wizard-v2.md` + reschedule v2 details |
| BOOK-018 | History + “Erneut buchen” | C | `z.details/2-design-plan-Guided-wizard-v2.md` + book-again v2 details |
| BOOK-019 | Accessibility baseline | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-020 | Poor connectivity | P | Open decision: offline confirm policy (queue vs hard-block) |
| BOOK-021 | Book for children | C | `z.details/2-design-plan-Guided-wizard-v2.md` |
| BOOK-022 | Reminders | C | `z.details/2-design-plan-Guided-wizard-v2.md` |

### Functional gaps (vs scope)

- **BOOK-020 remains Partial** until the offline confirm policy is decided and locked as acceptance criteria.

## 2) Non-functional requirements (Scope §5)

| Category | Requirement | Coverage | Notes |
|---|---|---:|---|
| Performance | Search results &lt;2s on 3G | P | Not specified as measurable AC in the N3 plan set |
| Performance | Booking confirm &lt;3s | P | Not specified as measurable AC in the N3 plan set |
| Availability | 99.5% uptime | M | Not addressed in design plan |
| Accessibility | WCAG 2.1 AA | P | Design plan sets baseline behaviors; not a full WCAG compliance spec |
| Localization | DE primary, EN launch, 14-language roadmap | P | DE/EN + text expansion covered; roadmap not specified as requirement handling |
| Security | Encrypt at rest/in transit | M | Not addressed in design plan |
| Analytics | Track Search→Result→Profile→Book | P | Mentioned at a high level; no event taxonomy/AC |

## 3) Out of scope alignment (Scope §6)

The N3 design plan does not introduce scope creep beyond the baseline:
- Guest checkout, multi-appointment booking, waitlist, and video-visit booking remain out of scope.

## 4) Dependencies (Scope §7)

Dependencies are not explicitly modeled as assumptions/risks in the N3 plan set (Curaay API, push, calendar SDK, maps deep-linking). If desired, add an “Assumptions & Dependencies” section to the N3 wrapper plan.

## 5) Success metrics (Scope §8)

Scope targets (completion rate, time-to-book, show-up rate, repeat booking) are not repeated in the N3 wrapper plan. If needed, add a “Success metrics” section that references the scope targets and defines measurement points/events.

---
name: gate:comparison-summary
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
created: 2026-01-22
scope: "Approaches discussed in Gate 4b runs: Assisted Discovery (A), Guided Wizard (C), Voice Guided Booking (G), Predictive Booking (I)."
inputs:
  approach_a_card: docs/appointment-booking/gate-4b-ethics-inclusive-ux-card-assisted-discovery.md
  approach_c_card: docs/appointment-booking/gate-4b-ethics-inclusive-ux-card-guided-wizard.md
  approach_g_card: docs/appointment-booking/gate-4b-ethics-inclusive-ux-card-voice-guided-booking.md
  approach_i_card: docs/appointment-booking/gate-4b-ethics-inclusive-ux-card-predictive-booking.md
status: draft
---

# Comparison Summary

## At-a-glance

| Approach | Short concept | Gate 4b AI result | Primary ethical risk | “Must-have” mitigation to proceed |
|---|---|---|---|---|
| **A — Assisted Discovery** | AI-ranked appointment suggestions from user intent + history | **CAUTION 🟡** | Ranking as a nudge + explainability + privacy | Make ranking transparent (“why this”), keep manual browse equally prominent, minimize stored sensitive text |
| **C — Guided Wizard** | Step-by-step narrowing with progress + explicit confirmations | **PASS WITH NOTES** | “Urgency” and cost/coverage steps can create anxiety/false certainty; can feel slow | Frame urgency as scheduling preference (not triage), avoid false price certainty, keep steps skippable |
| **G — Voice Guided Booking** | Conversational voice booking flow | **FAIL ❌** (as default flow) | Exclusion (speech/hearing/privacy), misrecognition errors, consent quality | Only optional assistive mode + mandatory visual review + tap-to-confirm |
| **I — Predictive Booking** | Proactive push suggestions + (as written) auto-confirm | **FAIL ❌** (as described) | Notification pressure + surveillance perception + privacy inference + auto-confirm risk | Opt-in, low-frequency, generic lock-screen copy, never auto-confirm (always review/confirm) |

## Audit Matrix

This is a condensed cross-approach view of the category scores captured in each Gate card.

| Category | A Assisted Discovery | C Guided Wizard | G Voice Guided | I Predictive Booking |
|---|---|---|---|---|
| Cognitive load | 🟡 | 🟢 | 🟡 | 🟡 |
| Dark pattern check | 🟡 | 🟢 | 🟢 | 🟡 |
| Accessibility (a11y) | 🟡 | 🟢 | 🔴 | 🟡 |
| Inclusion (language, culture) | 🟡 | 🟡 | 🔴 | 🟡 |
| Data privacy | 🔴 | 🟡 | 🔴 | 🔴 |
| User wellbeing | 🟡 | 🟢 | 🟡 | 🔴 |

## What to prototype (ethics-first lens)

- **Best candidate:** **C — Guided Wizard** (inclusive-by-default, calm flow; manageable notes)
- **Conditional prototype:** **A — Assisted Discovery** *only* as “transparent sorting/suggestions” (avoid opaque “AI rank”)
- **Not recommended now:** **G** and **I** unless redesigned to remove default voice/push pressure and add strong consent + privacy safeguards



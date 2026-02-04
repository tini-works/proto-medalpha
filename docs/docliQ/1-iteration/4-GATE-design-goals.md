---
name: prototype-gated:4-filter
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
inputs:
  framing: docs/appointment-booking/design-lite-1-framing.md
   select_9: docs/appointment-booking/step-5-solution-approaches-full-iteration2.md
  criteria: docs/appointment-booking/benchmarking-criteria.md
created: 2026-01-22
status: pending
---

# Gate: FILTER (Mandatory)

```
┌─────────────────────────────────────────────────────────────────┐
│ ⭐ FILTER GATE (MANDATORY)     Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 FILTERING: 9 solutions (A–I)                                 │
│ Hypothesis under test:                                           │
│ IF we implement a 4-step booking funnel with explicit progress + │
│ real-time availability handling + clear success actions,         │
│ THEN booking completion increases and time-to-book decreases     │
│ for Sarah/Marc.                                                  │
│ Success metrics: completion >60% (fail <45%); median <2 min (fail │
│ >3 min).                                                         │
├─────────────────────────────────────────────────────────────────┤
│ 📊 BENCHMARK SCORING (prototype gate criteria)                  │
│ Scales: 1–5 where 5 is best / easiest / lowest risk              │
│ Max score = 80 (5*5 + 5*4 + 5*4 + 5*3)                           │
│                                                                 │
│ │ Criteria               │ Wt │  A │  B │  C │  D │  E │  F │  G │
│ ├────────────────────────┼────┼────┼────┼────┼────┼────┼────┼────┤
│ │ Validates hypothesis    │ 5  │ 2  │ 1  │ 4  │ 2  │ 1  │ 1  │ 2  │
│ │ Build effort (prototype)│ 4  │ 2  │ 2  │ 4  │ 2  │ 1  │ 1  │ 1  │
│ │ Learning potential      │ 4  │ 5  │ 3  │ 4  │ 3  │ 2  │ 2  │ 3  │
│ │ Risk (low = better)     │ 3  │ 2  │ 1  │ 3  │ 2  │ 1  │ 1  │ 1  │
│ ├────────────────────────┼────┼────┼────┼────┼────┼────┼────┼────┤
│ │ TOTAL (out of 80)       │    │ 44 │ 28 │ 61 │ 36 │ 20 │ 20 │ 29 │
│                                                                 │
│ │ Criteria               │ Wt │  H │  I │                          │
│ ├────────────────────────┼────┼────┼────┤                          │
│ │ Validates hypothesis    │ 5  │ 2  │ 2  │                          │
│ │ Build effort (prototype)│ 4  │ 2  │ 2  │                          │
│ │ Learning potential      │ 4  │ 4  │ 4  │                          │
│ │ Risk (low = better)     │ 3  │ 2  │ 2  │                          │
│ ├────────────────────────┼────┼────┼────┤                          │
│ │ TOTAL (out of 80)       │    │ 40 │ 40 │                          │
├─────────────────────────────────────────────────────────────────┤
│ ⚖️ TRADE-OFF ANALYSIS (per approach)                            │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A: Assisted Discovery (AI recommendations)                   │ │
│ │ ✅ Primary benefit: reduces discovery effort via ranked options│ │
│ │ 👤 Benefit: Marc, Helga (guided suggestions)                 │ │
│ │ 👤 Suffer: Thomas (trust), all (privacy + explainability)    │ │
│ │ 💥 Risk scenario: Users don’t trust “AI-picked” doctor/slot; │ │
│ │ abandonment rises even if speed improves.                    │ │
│ │ 💡 If wrong, we still learn: which defaults/prefs help most  │ │
│ │ without AI ranking.                                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B: Slot Racing (live urgency feed)                           │ │
│ │ ✅ Primary benefit: fastest capture of scarce slots           │ │
│ │ 👤 Benefit: Elena, Marc                                      │ │
│ │ 👤 Suffer: Helga, Sarah (stress + accessibility)             │ │
│ │ 💥 Risk scenario: “healthcare flash sale” feels wrong/unfair; │ │
│ │ trust drop outweighs speed gains.                            │ │
│ │ 💡 If wrong, we still learn: urgency mechanics are rejected  │ │
│ │ → keep booking calm and explicit.                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ C: Guided Wizard (step-by-step narrowing)                    │ │
│ │ ✅ Primary benefit: highest clarity and recovery via steps    │ │
│ │ 👤 Benefit: Helga, Sarah (family accuracy)                   │ │
│ │ 👤 Suffer: Marc (speed), Elena (form-like)                   │ │
│ │ 💥 Risk scenario: adds steps → misses <2 min target for Sarah │ │
│ │ /Marc despite clarity.                                       │ │
│ │ 💡 If wrong, we still learn: which steps are truly required  │ │
│ │ vs skippable.                                                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ D: Social Matching (reviews/community)                       │ │
│ │ ✅ Primary benefit: trust via social proof and transparency   │ │
│ │ 👤 Benefit: Elena, Thomas                                    │ │
│ │ 👤 Suffer: MVP scope (critical mass + moderation + privacy)  │ │
│ │ 💥 Risk scenario: low review volume = no value; high risk of │ │
│ │ privacy issues; slows booking.                               │ │
│ │ 💡 If wrong, we still learn: which trust signals work without│ │
│ │ UGC.                                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ E: Subscription Slots (paid priority access)                 │ │
│ │ ✅ Primary benefit: revenue + priority access                  │ │
│ │ 👤 Benefit: Marc, some Thomas                                │ │
│ │ 👤 Suffer: equity concerns; V1 excludes payment processing    │ │
│ │ 💥 Risk scenario: backlash (“pay to access care”) + billing   │ │
│ │ complexity blocks MVP.                                       │ │
│ │ 💡 If wrong, we still learn: willingness to pay for speed.    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ F: Auction Bidding                                            │ │
│ │ ✅ Primary benefit: allocates scarcity via willingness-to-pay │ │
│ │ 👤 Benefit: small subset only                                │ │
│ │ 👤 Suffer: most users (fairness + confusion)                 │ │
│ │ 💥 Risk scenario: reputational/compliance risk; violates      │ │
│ │ healthcare expectations.                                     │ │
│ │ 💡 If wrong, we still learn: avoid monetizing access to care. │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ G: Voice Guided Booking                                      │ │
│ │ ✅ Primary benefit: hands-free + accessibility angle          │ │
│ │ 👤 Benefit: Helga, Sarah (multitask)                         │ │
│ │ 👤 Suffer: privacy + error recovery risks                     │ │
│ │ 💥 Risk scenario: misrecognition creates wrong booking details│ │
│ │ with low user confidence.                                    │ │
│ │ 💡 If wrong, we still learn: voice belongs in help/support.   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ H: Collaborative Family Booking (shared hub)                 │ │
│ │ ✅ Primary benefit: family coordination + permissions         │ │
│ │ 👤 Benefit: Sarah                                            │ │
│ │ 👤 Suffer: complexity + privacy edge cases; MVP misalignment │ │
│ │ 💥 Risk scenario: permission errors expose dependent data.     │ │
│ │ 💡 If wrong, we still learn: minimum viable family booking.   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ I: Predictive Booking (proactive suggestions)                │ │
│ │ ✅ Primary benefit: reduces search by suggesting slots         │ │
│ │ 👤 Benefit: Marc, Thomas (routine)                            │ │
│ │ 👤 Suffer: privacy + notification fatigue risks               │ │
│ │ 💥 Risk scenario: wrong/too many suggestions → opt-out; harms │ │
│ │ trust.                                                       │ │
│ │ 💡 If wrong, we still learn: what triggers indicate intent.   │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION:                                           │
│ BUILD: C because it best validates the core clarity/confirmation │
│ hypothesis with the lowest prototype effort among high-signal    │
│ options.                                                        │
│ DEFER: A as a “fake AI” prototype if wizard proves too slow; I   │
│ if we want to explore proactive nudges later.                    │
│ DROP: B, D, E, F, G, H for MVP prototyping due to mismatch with  │
│ constraints (fairness, privacy, payment, complexity).            │
├─────────────────────────────────────────────────────────────────┤
│ ⭐ GATE DECISION (REQUIRED):                                    │
│ [ ] BUILD C only                                                │
│ [ ] BUILD C + A (parallel prototypes)                           │
│ [ ] BUILD A only (override AI)                                  │
│ [ ] RETURN (need different approaches)                          │
│ [ ] ABORT (hypothesis not worth testing)                        │
│                                                                 │
│ Rationale: _________________________________                    │
│ Decided by: _____________ Date: _____________                   │
└─────────────────────────────────────────────────────────────────┘
```


## Priority Matrix (Who Benefits Most)

Personas priority (from MEDA-BOOK scope): **Primary** = Sarah, Marc; **Secondary** = Helga, Thomas; **Tertiary** = Elena.

Legend: `⬤` = strong fit for that priority tier; `○` = not a focus.

| Approach | Primary (Sarah+Marc) | Secondary (Helga+Thomas) | Tertiary (Elena) |
|---|---|---|---|
| A Assisted Discovery (AI recommendations) | ⬤ | ⬤ | ○ |
| B Slot Racing (live urgency feed) | ○ | ○ | ⬤ |
| C Guided Wizard (step-by-step narrowing) | ⬤ | ⬤ | ○ |
| D Social Matching (reviews/community + profiles) | ○ | ⬤ | ⬤ |
| E Subscription Slots (paid priority access) | ⬤ | ○ | ○ |
| F Auction Bidding (slots auctioned) | ○ | ○ | ○ |
| G Voice Guided Booking (conversational) | ○ | ⬤ | ○ |
| H Collaborative Family Booking (shared hub) | ⬤ | ○ | ○ |
| I Predictive Booking (proactive suggestions) | ⬤ | ⬤ | ○ |

Notes:
- This is intentionally coarse (tier-level) to support prototype investment decisions.
- “Auction” is marked ○ across tiers due to poor fit with healthcare norms and MVP constraints, not because no one could ever use it.

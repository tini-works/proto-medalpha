---
name: design-lite:1-framing
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
source_requirement: docs/appointment-booking/appointment-booking-scope.md
created: 2026-01-21
status: accepted
---

# DESIGN-LITE: FRAMING

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: FRAMING           Status: ✅ ACCEPTED              │
├─────────────────────────────────────────────────────────────────┤
│ 📋 ORIGINAL REQUEST                                             │
│ Build “Appointment Booking (Terminbuchung)” (MEDA-BOOK) so users │
│ can search (specialty + location), compare doctors, select a     │
│ time slot, confirm booking via Curaay API, then sync calendar +  │
│ open navigation; include upcoming appointments, cancel,          │
│ reschedule, family booking, accessibility, and poor-network UX.  │
├─────────────────────────────────────────────────────────────────┤
│ 🔄 PROBLEM FRAMINGS (3)                                         │
│                                                                 │
│ A: Reduce Booking Friction                                       │
│    Problem: Users who need care can’t quickly find and lock an   │
│    available slot without extra steps or uncertainty.            │
│    Root cause: Availability discovery is fragmented + phone-based│
│    + “slot uncertainty” during selection/confirmation.           │
│    Direction: Fast search → trustworthy results → held slot →    │
│    explicit confirmation + success actions (calendar/maps).      │
│                                                                 │
│ B: Make Commitments Feel Safe (Trust + Cost Clarity)             │
│    Problem: Users hesitate to book because they’re unsure what   │
│    they’re agreeing to (coverage, cost, policies, next steps).   │
│    Root cause: Healthcare booking has hidden rules (insurance,   │
│    referrals, cancellation windows) and weak confirmations.      │
│    Direction: “Tell me before it happens”: clear coverage/cost   │
│    indicators, policies, confirmations, recoverability.          │
│                                                                 │
│ C: Book Within Real-Life Constraints (Family + Accessibility)    │
│    Problem: Booking fails when users are busy, distracted, older,│
│    or booking for dependents with different data needs.          │
│    Root cause: Linear flows don’t adapt to family context,       │
│    accessibility needs, and intermittent connectivity.           │
│    Direction: Patient selector, saved defaults, step indicator,  │
│    large targets, resilient offline/retry, reminders.            │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ KEY ASSUMPTIONS (top 3-5)                                    │
│                                                                 │
│ │ # │ Assumption                                   │ Risk │ Val? │
│ ├───┼──────────────────────────────────────────────┼──────┼──────┤
│ │ 1 │ Curaay supports reliable slot-hold/confirm    │ 🔴High│ ✅Yes │
│ │ 2 │ Family booking (child profiles) is permitted  │ 🔴High│ ✅Yes │
│ │ 3 │ We can show meaningful coverage/cost signals  │ 🟡Med │ ✅Yes │
│ │ 4 │ Calendar + reminder flows increase show-up    │ 🟡Med │ ✅Yes │
│ │ 5 │ Users will share location for nearby search   │ 🟢Low │ ❌No  │
│                                                                 │
│ Risk = likelihood wrong × impact if wrong                       │
├─────────────────────────────────────────────────────────────────┤
│ 🧪 HYPOTHESIS (for selected framing)                            │
│                                                                 │
│ Selected framing: A                                             │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ IF we implement a 4-step booking funnel (Search → Results → │ │
│ │ Doctor → Slot Hold/Confirm) with explicit progress +         │ │
│ │ real-time availability handling + clear success actions      │ │
│ │ (calendar sync + navigation),                               │ │
│ │ THEN booking completion rate will increase and time-to-book  │ │
│ │ will decrease,                                              │ │
│ │ FOR primary users (Sarah, Marc),                            │ │
│ │ BECAUSE they can discover availability and commit with low   │ │
│ │ uncertainty and minimal wasted steps.                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Key assumptions this depends on:                                │
│ • Assumption #1 (slot hold/confirm reliability)                 │
│ • Assumption #3 (enough clarity at confirm to reduce hesitation)│
│                                                                 │
│ Success metric: Booking completion rate → Pass: >60% / Fail: <45%│
│ Secondary: Median time-to-book → Pass: <2 min / Fail: >3 min     │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Recommend framing A because it targets the core drop-off  │
│ point (availability → commitment) and de-risks the end-to-end    │
│ funnel; B and C can be layered once the core booking is solid.   │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [x] Accept framing A + hypothesis                               │
│ [ ] Modify hypothesis                                           │
│ [ ] Try different framing                                       │
│ Notes: Accepted by user on 2026-01-21                           │
└─────────────────────────────────────────────────────────────────┘
```


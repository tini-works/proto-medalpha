---
name: design-lite:4-design
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "C — Guided Wizard (step-by-step narrowing)"
inputs:
  framing: docs/appointment-booking/design-lite-1-framing.md
  approach_source: docs/appointment-booking/step-5-solution-approaches-full.md
  requirement: docs/appointment-booking/appointment-booking-scope.md
  criteria: docs/appointment-booking/benchmarking-criteria.md
created: 2026-01-22
status: pending
---

# DESIGN-LITE: DESIGN (Approach C — Guided Wizard)

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: DESIGN            Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                      │
│ Selected approach: C — Guided Wizard (step-by-step narrowing)    │
│ Hypothesis: IF we implement a 4-step booking funnel (Search →    │
│ Results → Doctor → Slot Hold/Confirm) with explicit progress +   │
│ real-time availability handling + clear success actions (calendar│
│ sync + navigation), THEN booking completion rate will increase   │
│ and time-to-book will decrease, FOR primary users (Sarah, Marc), │
│ BECAUSE they can discover availability and commit with low       │
│ uncertainty and minimal wasted steps.                            │
├─────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                 │
│                                                                 │
│ │ Job │ Statement                               │ Key Actions  ││
│ ├─────┼─────────────────────────────────────────┼──────────────┤│
│ │ J1  │ When I need an appointment, I want to   │ start wizard, ││
│ │     │ answer a few questions so options are   │ answer, edit  ││
│ │     │ narrowed to the right choices.          │              ││
│ │ J2  │ When I pick a doctor/time, I want to    │ select slot,  ││
│ │     │ confirm clearly (who/where/when/cost).  │ confirm       ││
│ │ J3  │ After booking, I want to add to calendar│ add, route,   ││
│ │     │ and manage appointments (cancel/move).  │ cancel, move  ││
│                                                                 │
│ Flow diagram (simplified):                                      │
│ ┌─────────────┐   ┌───────────────┐   ┌──────────────┐         │
│ │ Entry point │→→ │ Wizard (1..4)  │→→ │ Confirm sheet │ →Success│
│ └─────────────┘   └───────┬───────┘   └───────┬───────┘         │
│                            │                   │                 │
│                       (edit/back)          (slot taken)          │
│                            │                   │                 │
│                            v                   v                 │
│                      ┌──────────┐       ┌──────────────┐         │
│                      │ Adjust    │       │ Re-pick slot │         │
│                      └──────────┘       └──────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                             │
│                                                                 │
│ ✅ IN SCOPE (MVP):                                              │
│ • Wizard steps w/ progress + back/edit (J1)                     │
│ • Specialty selection (with “not sure” escape) (J1)             │
│ • Location + travel constraints (J1)                            │
│ • Insurance/coverage messaging (no payment) (J1/J2)             │
│ • Doctor selection + time slot selection (J1/J2)                │
│ • Confirm sheet (clarity gate) + booking creation (J2)          │
│ • Success screen + confirmation number (J2/J3)                  │
│ • Calendar add + route open (J3)                                │
│ • My appointments list + details (J3)                           │
│ • Cancel + reschedule (J3)                                      │
│ • Reminders (24h + 1h) + settings (J3)                          │
│ • Accessibility baseline (Helga) + slow network UX              │
│                                                                 │
│ ❌ OUT OF SCOPE (deferred):                                     │
│ • Guest booking, waitlist, video-visit booking, payments         │
│ • “Flash sale” urgency mechanics, auctions, subscription tiers   │
│ • UGC reviews/community layer                                   │
│ • Predictive push-based auto-booking                             │
│                                                                 │
│ 📏 SUCCESS METRICS (from scope + criteria):                      │
│ • Primary: Booking completion rate → Target: >60% / Fail: <45%   │
│ • Primary: Time to book → Target: <2 min / Fail: >3 min          │
│ • Leading: Detail recall at confirm → ≥90% correct restate       │
│ • Guardrail: Critical confusion → ≤1 per session                │
├─────────────────────────────────────────────────────────────────┤
│ 🎨 UX INTERACTIONS                                              │
│                                                                 │
│ Job J1 — Wizard narrowing                                       │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Tap “Termin buchen”           │ Wizard Step 1 opens w/    ││
│ │   │                               │ progress (“Schritt 1/4”)  ││
│ │ 2 │ Choose “Für wen?” (optional)  │ Sets patient context;     ││
│ │   │                               │ can skip until confirm    ││
│ │ 3 │ Pick specialty / need type    │ Shows common specialties +││
│ │   │ (or “Ich bin nicht sicher”)   │ search; validates         ││
│ │ 4 │ Pick urgency (scheduling)     │ Explains as preference,   ││
│ │   │                               │ not triage; defaults safe ││
│ │ 5 │ Pick location + radius        │ Uses last-used; supports  ││
│ │   │                               │ manual entry if no perm   ││
│ │ 6 │ Coverage step (GKV/PKV)       │ Shows “Kosten & Versicherung”││
│ │   │                               │ with known vs unknown info││
│ │ 7 │ Arrive at doctor list (filtered)│ Shows list; sort options││
│ │ 8 │ Select doctor → slots         │ Opens slot picker         ││
│                                                                 │
│ Conditional logic:                                              │
│ • IF location permission denied → allow manual city/zip entry   │
│ • IF “not sure” specialty → show top specialties + search       │
│ • IF referral required known → show “Überweisung nötig” info    │
│                                                                 │
│ Job J2 — Confirm booking (clarity gate)                          │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Tap a time slot               │ Opens confirm sheet w/ all││
│ │   │                               │ booking details           ││
│ │ 2 │ Tap “Bearbeiten” on any field │ Jumps back to relevant step││
│ │ 3 │ Tap “Termin bestätigen”       │ Creates booking; shows     ││
│ │   │                               │ progress + error handling ││
│                                                                 │
│ Conditional logic:                                              │
│ • IF slot taken at confirm → show message + next available slots│
│ • IF offline → block confirm w/ retry (see open decision)       │
│                                                                 │
│ Job J3 — Post-booking management                                 │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Tap “Zum Kalender hinzufügen” │ Opens native picker; prefill││
│ │ 2 │ Tap “Route öffnen”            │ Maps deep link; fallback copy││
│ │ 3 │ Open “Meine Termine”          │ Upcoming list + empty state ││
│ │ 4 │ Tap “Termin absagen”          │ Shows policy + confirm dialog││
│ │ 5 │ Tap “Termin verschieben”      │ Slot picker (same doctor) +  ││
│ │   │                               │ confirm new time            ││
├─────────────────────────────────────────────────────────────────┤
│ 📱 DERIVED SCREENS                                              │
│                                                                 │
│ │ ID  │ Screen Name                   │ From Jobs │ Purpose     ││
│ ├─────┼───────────────────────────────┼───────────┼─────────────┤│
│ │ S01 │ Entry: “Termin buchen”        │ J1        │ Start flow  ││
│ │ S02 │ Wizard Step 1: Need/Specialty │ J1        │ Choose need ││
│ │ S03 │ Wizard Step 2: Location/Radius│ J1        │ Travel prefs││
│ │ S04 │ Wizard Step 3: Insurance/Cost │ J1        │ Set clarity ││
│ │ S05 │ Wizard Step 4: Doctor list    │ J1        │ Choose doc  ││
│ │ S06 │ Slot picker                   │ J1,J2,J3  │ Choose slot ││
│ │ S07 │ Confirm sheet (modal)         │ J2        │ Clarity gate││
│ │ S08 │ Success screen                │ J2,J3     │ Proof + next││
│ │ S09 │ My appointments (upcoming)    │ J3        │ Manage list ││
│ │ S10 │ Appointment details           │ J3        │ Actions     ││
│ │ S11 │ Cancel confirm dialog         │ J3        │ Confirm     ││
│ │ S12 │ Reschedule flow (same doc)    │ J3        │ Pick new    ││
│                                                                 │
│ Screen flow:                                                    │
│ [S01]→[S02]→[S03]→[S04]→[S05]→[S06]→[S07]→[S08]                  │
│ Post: [S08]→[S09]→[S10]→([S11] or [S12])                         │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                   │
│                                                                 │
│ │ Scenario              │ User Action       │ System Response  │ │
│ ├───────────────────────┼───────────────────┼──────────────────┤ │
│ │ “Not sure” specialty  │ Tap option        │ Suggest top 6 +  │ │
│ │                       │                   │ search + help    │ │
│ │ No results            │ Finish wizard     │ Empty state with │ │
│ │                       │                   │ broaden radius/  │ │
│ │                       │                   │ time window      │ │
│ │ Slot taken at confirm │ Tap confirm       │ Explain + show   │ │
│ │                       │                   │ next slots       │ │
│ │ Slow network          │ Any step          │ Skeleton + retry │ │
│ │ Offline               │ Tap confirm       │ Block w/ explanation│
│ │ Referral required     │ Confirm           │ Inform + reminder│ │
│ │ Child booking         │ Select “Für wen”  │ Consent check +  │ │
│ │                       │                   │ clear patient name│
│ │ Accessibility         │ Any               │ 16pt+, 48dp taps,│
│ │                       │                   │ step indicator   │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Design is complete enough for prototyping, but needs     │
│ decisions on (a) “urgency” wording (triage vs preference),      │
│ (b) offline booking policy, and (c) cost/coverage truth source. │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [ ] Accept design                                               │
│ [ ] Simplify (remove urgency step)                              │
│ [ ] Add a fast-lane (skip to doctor list) for Marc              │
│ Notes: _______________________                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Open Decisions / Need Your Input

1. **Urgency step**: should it exist? If yes, what are the options and copy so it’s clearly a *scheduling preference* (not medical triage)?
2. **Offline behavior**: scope mentions “booking confirmation queued if offline”; do you want to **block confirm when offline** instead for safety?
3. **Cost/coverage preview**: do we show only messaging (“kann Kosten verursachen”), or do we have a reliable source for more detail?
4. **Wizard vs speed**: do you want an explicit “skip wizard” shortcut for Marc (e.g., “Direkt zur Liste”)?


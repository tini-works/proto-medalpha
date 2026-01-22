---
name: design-lite:4-design
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
inputs:
  framing: docs/appointment-booking/design-lite-1-framing.md
  ideation: docs/appointment-booking/design-lite-2-ideation.md
  requirement: docs/appointment-booking/appointment-booking-scope.md
  criteria: docs/appointment-booking/benchmarking-criteria.md
created: 2026-01-21
status: pending
notes:
  - "Proceeding without a separate Step 3 SELECT doc; using Step 2 decision (Approach E) as the selected approach."
---

# DESIGN-LITE: DESIGN

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: DESIGN            Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                      │
│ Selected approach: E — Two-Lane Hybrid (QuickBook list +         │
│ “Nächster Termin” CTA for earliest options)                      │
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
│ │ J1  │ When I need a doctor, I want to search  │ search,      ││
│ │     │ and browse options so I can pick the    │ filter,      ││
│ │     │ right doctor and time.                  │ compare      ││
│ │ J2  │ When I just want the earliest slot, I   │ choose       ││
│ │     │ want the app to suggest next available  │ constraints, ││
│ │     │ options so I can book fast.             │ select       ││
│ │ J3  │ When I’m ready, I want to confirm my    │ review,      ││
│ │     │ booking so I know exactly what I booked │ confirm      ││
│ │     │ (who/where/when/cost).                  │              ││
│ │ J4  │ After booking, I want to manage my      │ view,        ││
│ │     │ appointments (add to calendar, route,   │ cancel,      ││
│ │     │ reschedule) so I stay on track.         │ reschedule   ││
│                                                                 │
│ Flow diagram (simplified):                                      │
│ ┌─────────────┐   ┌───────────────┐   ┌──────────────┐         │
│ │ Entry point │→→ │ Search/Results │→→ │ Confirm sheet │ →Success│
│ └─────────────┘   └───────┬───────┘   └───────┬───────┘         │
│                            │                   │                 │
│                 “Nächster Termin”              │                 │
│                            │                   │                 │
│                            v                   v                 │
│                    ┌───────────────┐     ┌───────────────┐       │
│                    │ Top 3 options │ →→  │ Booking create │       │
│                    └───────────────┘     └───────────────┘       │
│                                                                 │
│ Post-success: “Zum Kalender hinzufügen” + “Route öffnen” +       │
│ “Meine Termine” (manage/cancel/reschedule)                       │
├─────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                             │
│                                                                 │
│ ✅ IN SCOPE (MVP, aligned to MEDA-BOOK):                         │
│ • Search (specialty + location) and results list (J1)            │
│ • Doctor profile + time selection (J1)                           │
│ • Two-lane: “Nächster Termin” CTA returning top 3 options (J2)   │
│ • Confirm sheet with explicit details + coverage messaging (J3)  │
│ • Success screen + confirmation number (J3)                      │
│ • Add to calendar + open route (J4)                              │
│ • Upcoming appointments list + details (J4)                      │
│ • Cancel + reschedule flows (J4)                                 │
│ • Reminders (push 24h + 1h) + preferences (J4)                   │
│ • Accessibility baseline (Helga) + slow-network handling         │
│                                                                 │
│ ❌ OUT OF SCOPE (deferred):                                     │
│ • Guest booking (explicitly out in V1)                           │
│ • Waitlist / notify earlier slot (explicitly out in V1)          │
│ • Video visit booking (separate Telemedicine feature)            │
│ • Payment processing for private appointments (explicitly out)   │
│ • Multi-appointment series booking (explicitly out in V1)        │
│ • Map-first booking (only deep-link to Maps for routing)         │
│                                                                 │
│ 📏 SUCCESS METRICS:                                             │
│ • Primary: Booking completion rate → Pass: >60% / Fail: <45%     │
│ • Primary: Time to book → Pass: <2:00 / Fail: >3:00              │
│ • Leading: Confirm-sheet detail recall → Target: ≥90% correct    │
│ • Guardrail: Critical booking errors → Must not exceed 1/session │
├─────────────────────────────────────────────────────────────────┤
│ 🤝 UX INTERACTIONS (key moments)                                 │
│                                                                 │
│ J1 — Search/Browse                                               │
│ │ User Action                 │ System Response                │ │
│ ├─────────────────────────────┼────────────────────────────────┤ │
│ │ Tap “Termin buchen”         │ Opens Search with last-used    │ │
│ │                             │ specialty/location (if exists) │ │
│ │ Enter specialty + location  │ Validates input; shows inline  │ │
│ │ + tap “Suchen”              │ loading + results <2s target   │ │
│ │ Adjust filters              │ Updates results; keeps scroll  │ │
│ │ Tap a doctor card           │ Opens doctor profile            │ │
│ │ Tap a time slot             │ Opens confirm sheet (no payment)│ │
│                                                                 │
│ J2 — “Nächster Termin” (Earliest)                                │
│ │ User Action                 │ System Response                │ │
│ ├─────────────────────────────┼────────────────────────────────┤ │
│ │ Tap “Nächster Termin” CTA   │ Opens mini-step: radius + time  │ │
│ │ Select constraints          │ Returns top 3 options with      │ │
│ │                             │ “why” labels (earliest + km)   │ │
│ │ Select an option            │ Opens confirm sheet with same   │ │
│ │                             │ detail set as standard flow    │ │
│                                                                 │
│ J3 — Confirm (Clarity gate)                                      │
│ │ User Action                 │ System Response                │ │
│ ├─────────────────────────────┼────────────────────────────────┤ │
│ │ Review details              │ Shows: Doctor, specialty, date/ │ │
│ │                             │ time, address, “Für wen”, and  │ │
│ │                             │ “Kosten & Versicherung” block  │ │
│ │ Change “Für wen”            │ Updates patient context; shows  │ │
│ │                             │ eligibility warning if needed  │ │
│ │ Tap “Termin bestätigen”     │ Creates booking; shows progress │
│ │                             │ + handles slot-taken fallback  │ │
│                                                                 │
│ J4 — Post-booking management                                     │
│ │ User Action                 │ System Response                │ │
│ ├─────────────────────────────┼────────────────────────────────┤ │
│ │ Tap “Zum Kalender hinzufügen”│ Opens native calendar picker;  │ │
│ │                             │ pre-fills event + reminders     │ │
│ │ Tap “Route öffnen”          │ Opens Maps deep link; fallback  │ │
│ │                             │ copy address                    │
│ │ View “Meine Termine”        │ Lists upcoming; empty state     │ │
│ │ Tap “Termin absagen”        │ Shows policy + confirm dialog;  │ │
│ │                             │ updates status + notifications  │ │
│ │ Tap “Termin verschieben”    │ Opens same-doctor slots; confirm│
│ │                             │ new time then release old       │ │
├─────────────────────────────────────────────────────────────────┤
│ 🧩 DERIVED SCREENS                                              │
│                                                                 │
│ │ ID  │ Screen Name                 │ From Jobs │ Purpose      │ │
│ ├─────┼─────────────────────────────┼───────────┼──────────────┤ │
│ │ S01 │ Entry: “Termin buchen”      │ J1        │ Start booking│ │
│ │ S02 │ Search                       │ J1        │ Input/filters│ │
│ │ S03 │ Results list                 │ J1,J2     │ Browse + CTA │
│ │ S04 │ Doctor profile               │ J1        │ Trust + info │
│ │ S05 │ Time selection               │ J1,J4     │ Pick slot    │
│ │ S06 │ Confirm sheet (modal)        │ J3        │ Clarity gate │
│ │ S07 │ Success screen               │ J3,J4     │ Proof + next │
│ │ S08 │ “Nächster Termin” mini-step  │ J2        │ Constraints  │
│ │ S09 │ “Top 3 options” list         │ J2        │ Pick fastest │
│ │ S10 │ My appointments (upcoming)   │ J4        │ Manage       │
│ │ S11 │ Appointment details           │ J4        │ Cancel/move  │
│ │ S12 │ Cancel confirm dialog         │ J4        │ Confirm      │
│ │ S13 │ Reschedule picker             │ J4        │ Choose new   │
│                                                                 │
│ Screen flow:                                                    │
│ [S01]→[S02]→[S03]→[S04]→[S05]→[S06]→[S07]                        │
│                 └→[S08]→[S09]→[S06]                              │
│ Post: [S07]→[S10]→[S11]→([S12] or [S13])                         │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                   │
│                                                                 │
│ │ Scenario              │ User Action      │ System Response   │ │
│ ├───────────────────────┼──────────────────┼───────────────────┤ │
│ │ No results            │ Search           │ Empty state +     │ │
│ │                       │                  │ broaden filters   │ │
│ │ Slot taken at confirm │ Tap confirm      │ Message + show    │ │
│ │                       │                  │ next available    │ │
│ │ Slow network          │ Browse/confirm   │ Skeleton + retry; │ │
│ │                       │                  │ avoid spinners    │ │
│ │ Offline mid-flow      │ Tap confirm      │ Block booking;    │ │
│ │                       │                  │ queue NOT allowed │
│ │ Calendar permission    │ Add to calendar │ Show fallback     │ │
│ │ denied                │                  │ “Copy details”    │ │
│ │ Maps unavailable       │ Route öffnen    │ Copy address      │ │
│ │ Cancel deadline passed │ Cancel attempt  │ Show policy +     │ │
│ │                       │                  │ disable cancel    │ │
│ │ Referral required      │ Confirm         │ Clear guidance    │ │
│                                                                 │
│ Note: Offline booking queue in scope doc conflicts with the      │
│ need for a confirmed slot; assume booking requires connectivity. │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Design needs validation of partner API capabilities       │
│ (hold/reschedule/policy fields) but is otherwise MVP-complete    │
│ and aligned with Clarity+Speed+Effort criteria.                  │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [ ] Accept design                                               │
│ [ ] Simplify (remove “Nächster Termin” lane)                     │
│ [ ] Add edge cases for referrals/policy                          │
│ Notes: _______________________                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Open Decisions / Need Your Input

1. “Nächster Termin” defaults: preferred **radius** and **time window** defaults (e.g., 10km + “diese Woche”)?
2. Offline behavior: scope text suggests “booking confirmation queued if offline” (`docs/appointment-booking/appointment-booking-scope.md:195`), but confirmed booking generally can’t be queued safely—should we instead **block confirm when offline**?
3. Referrals: should we block booking if referral required, or allow booking but show “bring referral” reminder?


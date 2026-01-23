---
name: design-lite:4-design
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "A — Assisted Discovery (AI-ranked suggestions)"
inputs:
  framing: docs/appointment-booking/design-lite-1-framing.md
   approach_source: docs/appointment-booking/step-5-solution-approaches-full-iteration2.md
  requirement: docs/appointment-booking/appointment-booking-scope.md
  criteria: docs/appointment-booking/benchmarking-criteria.md
created: 2026-01-22
status: pending
notes:
  - "This is a prototype/design spec; not committing to true ML. Can be prototyped as transparent rules-based ranking (“fake AI”)."
---

# DESIGN-LITE: DESIGN (Approach A — Assisted Discovery)

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: DESIGN            Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                      │
│ Selected approach: A — Assisted Discovery (AI-ranked suggestions)│
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
│ │ J1  │ When I need an appointment, I want to   │ describe need,││
│ │     │ describe my need so the app proposes    │ set prefs,    ││
│ │     │ good options quickly.                   │ refine        ││
│ │ J2  │ When I see suggestions, I want to       │ compare,      ││
│ │     │ understand “why this” and adjust filters│ change sort,  ││
│ │     │ so I stay in control.                   │ browse all    ││
│ │ J3  │ When I pick an option, I want to confirm│ review, confirm││
│ │     │ clearly (who/where/when/cost).          │               ││
│ │ J4  │ After booking, I want to add to calendar│ add, route,   ││
│ │     │ and manage/cancel/reschedule.           │ cancel, move  ││
│                                                                 │
│ Flow diagram (simplified):                                      │
│ ┌─────────────┐   ┌──────────────────┐   ┌──────────────┐      │
│ │ Entry point │→→ │ Assist input +    │→→ │ Suggested     │      │
│ └─────────────┘   │ preferences       │   │ options (3–5) │      │
│                   └───────┬──────────┘   └───────┬───────┘      │
│                           │                      │              │
│                     “Browse all”                │              │
│                           │                      v              │
│                           v               ┌──────────────┐     │
│                     Full results          │ Confirm sheet │→Success│
│                                           └──────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                             │
│                                                                 │
│ ✅ IN SCOPE (MVP):                                              │
│ • Assisted intake (need + preferences) (J1)                     │
│ • Suggested options list (3–5) with “why this” (J1/J2)           │
│ • Controls to refine (filters/sort) + “Browse all results” (J2) │
│ • Doctor profile + slot selection (J2/J3)                       │
│ • Confirm sheet (clarity gate) + booking creation (J3)          │
│ • Success screen + confirmation number (J3/J4)                  │
│ • Calendar add + route open (J4)                                │
│ • My appointments list + details (J4)                           │
│ • Cancel + reschedule flows (J4)                                │
│ • Reminders (24h + 1h) + settings (J4)                          │
│ • Accessibility baseline + slow-network UX                      │
│                                                                 │
│ ❌ OUT OF SCOPE (deferred):                                     │
│ • True ML personalization/learning loop (ship “fake AI” first)  │
│ • Health-history-driven inference beyond explicit inputs         │
│ • Predictive push suggestions, auctions/subscriptions, UGC       │
│ • Guest booking, waitlist, video booking, payments               │
│                                                                 │
│ 📏 SUCCESS METRICS (from scope + criteria):                      │
│ • Primary: Booking completion rate → Target: >60% / Fail: <45%   │
│ • Primary: Time to book → Target: <2 min / Fail: >3 min          │
│ • Leading: “Why this” comprehension → ≥90% can restate reason    │
│ • Guardrail: “Feels manipulative/opaque” reports → low + tracked │
├─────────────────────────────────────────────────────────────────┤
│ 🎨 UX INTERACTIONS                                              │
│                                                                 │
│ Job J1 — Assisted intake                                         │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Tap “Termin buchen”           │ Opens assist input screen ││
│ │   │                               │ with progress indicator   ││
│ │ 2 │ Enter need (free text OR pick │ Offers chips (specialties)││
│ │   │ specialty)                    │ + autocomplete; “Skip text”││
│ │ 3 │ Set prefs (location, radius,  │ Uses last-used defaults;  ││
│ │   │ time window)                  │ allows manual entry       ││
│ │ 4 │ Tap “Vorschläge anzeigen”     │ Shows 3–5 options with    ││
│ │   │                               │ loading + skeleton        ││
│                                                                 │
│ Conditional logic:                                              │
│ • IF user doesn’t want symptom text → allow specialty-only flow │
│ • IF location denied → manual city/zip input                    │
│                                                                 │
│ Job J2 — Suggestions + control (anti-nudge)                      │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ View suggestion card           │ Shows: doctor, slot,     ││
│ │   │                                │ distance, and “Warum?”  ││
│ │ 2 │ Tap “Warum dieser Vorschlag?”  │ Expands simple reasons:  ││
│ │   │                                │ earliest slot, distance,││
│ │   │                                │ matches preferences      ││
│ │ 3 │ Tap “Alle Ergebnisse anzeigen” │ Opens full results list  ││
│ │ 4 │ Change sort (Soonest/Nearest)  │ Recomputes list (explicit││
│ │   │                                │ sort, not hidden rank)  ││
│                                                                 │
│ Job J3 — Confirm booking (clarity gate)                          │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Select suggestion / slot       │ Opens confirm sheet w/   ││
│ │   │                                │ full details + “Für wen”││
│ │ 2 │ Tap “Termin bestätigen”        │ Creates booking; handles ││
│ │   │                                │ slot-taken fallback      ││
│                                                                 │
│ Job J4 — Post-booking management                                 │
│ │ # │ User Action                    │ System Response          ││
│ ├───┼───────────────────────────────┼──────────────────────────┤│
│ │ 1 │ Add to calendar / open route   │ Native integrations       ││
│ │ 2 │ Cancel / reschedule             │ Policy + confirm; update ││
├─────────────────────────────────────────────────────────────────┤
│ 📱 DERIVED SCREENS                                              │
│                                                                 │
│ │ ID  │ Screen Name                   │ From Jobs │ Purpose     ││
│ ├─────┼───────────────────────────────┼───────────┼─────────────┤│
│ │ S01 │ Entry: “Termin buchen”        │ J1        │ Start       ││
│ │ S02 │ Assist input (need + prefs)   │ J1        │ Capture need││
│ │ S03 │ Suggestions (3–5)             │ J1,J2     │ Propose     ││
│ │ S04 │ Full results list             │ J2        │ Browse all  ││
│ │ S05 │ Doctor profile                │ J2        │ Trust/info  ││
│ │ S06 │ Slot picker                    │ J2,J3,J4  │ Pick slot   ││
│ │ S07 │ Confirm sheet (modal)         │ J3        │ Clarity gate││
│ │ S08 │ Success screen                │ J3,J4     │ Proof + next││
│ │ S09 │ My appointments (upcoming)    │ J4        │ Manage list ││
│ │ S10 │ Appointment details           │ J4        │ Cancel/move ││
│                                                                 │
│ Screen flow:                                                    │
│ [S01]→[S02]→[S03]→[S07]→[S08]                                   │
│             └→[S04]→[S05]→[S06]→[S07]                           │
│ Post: [S08]→[S09]→[S10]                                         │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                   │
│                                                                 │
│ │ Scenario                  │ User Action  │ System Response   │ │
│ ├───────────────────────────┼──────────────┼───────────────────┤ │
│ │ Sensitive free text        │ Enter need   │ Warn “optional”;  │ │
│ │                            │              │ do not store by   │ │
│ │                            │              │ default           │ │
│ │ Suggestions feel wrong     │ Tap “why”    │ Show reasons +    │ │
│ │                            │ / browse all │ escape hatch      │ │
│ │ No suggestions available   │ Submit       │ Fall back to full │ │
│ │                            │              │ results list      │ │
│ │ Slot taken at confirm      │ Confirm      │ Explain + offer   │ │
│ │                            │              │ next slot         │ │
│ │ Slow network               │ Any          │ Skeleton + retry  │ │
│ │ Offline                    │ Confirm      │ Block confirm +   │ │
│ │                            │              │ explain why       │ │
│ │ Family/minor booking       │ “Für wen”    │ Explicit selector │ │
│ │                            │              │ + consent guardrail│ │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Design is prototype-ready if we treat “AI” as transparent │
│ ranking and keep manual browse equally prominent; otherwise it   │
│ risks trust/ethics issues and MVP feasibility.                  │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [ ] Accept design                                               │
│ [ ] Simplify (remove free text; specialty-only)                 │
│ [ ] Force “browse all” default (no ranking)                     │
│ Notes: _______________________                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Open Decisions / Need Your Input

1. Do we allow **free-text “symptom/need”** in MVP, or only specialty + filters (privacy/ethics)?
2. What exact **“Warum?” reasons** are acceptable to display (distance, earliest slot, language match, insurance match)?
3. Do we store any of the user’s “need” inputs/history? Default recommendation is **do not store** free text.


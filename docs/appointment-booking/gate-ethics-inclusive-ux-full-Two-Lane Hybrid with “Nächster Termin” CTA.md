# Gate 4b — Ethics & Inclusive UX (Full Notes)

**Reviewed design:** `docs/appointment-booking/design-lite-4-design.md`  
**Date:** 2026-01-22  
**Reviewer mode:** senior product/design ethics + inclusive UX

## 1) Cognitive & Emotional Load

- **10-second understanding:** Likely yes for “book appointment” and “search results”, but **less clear** that there are two parallel ways to proceed (“browse” vs “Nächster Termin”) without careful copy and visual hierarchy.
- **Overload moments (specific):**
  - **S03 Results list**: results browsing + inline slots + prominent CTA can become “too many ways to proceed”.
  - **S06 Confirm sheet**: must carry high-stakes detail (doctor/time/address/patient/coverage). If any info is hidden behind accordions, it increases anxiety (“did I miss something?”).
  - **S08/S09** (“Nächster Termin” mini-step + Top 3 options): adds a decision layer that can feel like the system is “deciding for me” unless the “why” is explicit and simple.
- **Progressive disclosure:** Generally good (confirm is a clarity gate), but the **second lane** risks being exposed too early. “Fastest” should appear as an optional helper, not a competing primary path.
- **Defaults and wellbeing:** Defaults should optimize for calm completion (no timers, no pressure). The design is consistent with that, as long as “fastest” isn’t framed as urgent.

## 2) Manipulation & Dark Patterns

- **Opt-out vs opt-in:** Needs explicit definition for reminders. If reminders are default-on, ensure it’s transparent and editable in settings without hunting.
- **Urgency/FOMO:** None present in the design; good. Watch copy like “nur noch wenige Termine” / countdowns—those would be dark-pattern-adjacent in healthcare.
- **Hidden options / soft penalties:** Potential “soft penalty” if the UI makes browse feel harder than “Nächster Termin”. Mitigate via balanced emphasis and clear description.

## 3) Inclusion & Fairness

- **Who may be disadvantaged:**
  - **Helga (moderate proficiency)**: can be overwhelmed by dense results + alternate lane; needs simple, consistent next step and large targets.
  - **Low energy / stressed users**: may misinterpret “Nächster Termin” as “best doctor” rather than “earliest slot”.
  - **Low literacy / non-native German**: “constraints” concepts (radius/time window) can be confusing unless copy is plain and examples are shown.
- **Forgotten user (callout):** A user booking while **cognitively overloaded** (pain/stress) who can’t compare options—needs a clear “good enough” path without feeling judged.
- **Assumptions about attention/memory:** Confirm step assumes users will read and verify. Provide easy “edit” affordances, not just a block of text.

## 4) Intentional Trade-offs

- **Wellbeing-protective deferrals (good):**
  - No auction/paid priority mechanics in this design (avoids inequity and pressure).
  - No waitlist/notify earlier slot (reduces engagement loops/notification pressure).
- **Where wellbeing could be sacrificed for metrics:** If “Nächster Termin” is optimized for conversion, it can push speed over informed choice. Make it a helper, not a funnel hack.
- **Overuse/misuse:** Repeated booking isn’t inherently harmful, but **notification strategy** (reminders + any future “predictive booking”) can become spammy. Treat notification fatigue as a bug.

## Concrete Changes (prioritized)

- **P1:** Make “Nächster Termin” explanation explicit: “Earliest available within your filters” + show **why** (earliest time + distance) on S09.
- **P1:** Decide offline policy: for booking confirmation, **block when offline** and explain why; do not “queue confirmation” unless you can safely guarantee slot validity.
- **P1:** Family booking safety: require explicit “Für wen” selection on confirm; add guardrails for minors (consent copy, relationship, and patient identity confirmation).
- **P2:** Reduce results density for Helga: accessible typography, avoid too many inline actions per card; ensure a single primary action per screen.
- **P2:** Add a “calm mode” for high-stress users: clear step indicator + “You can change details before confirming” reassurance on confirm sheet.
- **P3:** Add a “why we need location” explainer and allow manual location entry without forcing permission.

## One Hard Question (must answer before shipping)

Is “Nächster Termin” optimized as a **user-controlled convenience** (earliest slot within explicit constraints), or as a **conversion lever** that nudges users into less-informed choices?

## Gate Result (AI)

**CAUTION 🟡** until: offline-confirm behavior is decided; “Nächster Termin” transparency is specified; and family/minor consent guardrails are explicitly designed.


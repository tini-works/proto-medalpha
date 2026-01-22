---
name: design-lite:2-ideation
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
inputs:
  framing: docs/appointment-booking/design-lite-1-framing.md
  requirement: docs/appointment-booking/appointment-booking-scope.md
  evaluation_criteria: docs/appointment-booking/benchmarking-criteria.md
created: 2026-01-21
status: accepted
---

# DESIGN-LITE: IDEATION

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: IDEATION          Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                      │
│ Hypothesis: IF we implement a 4-step booking funnel (Search →    │
│ Results → Doctor → Slot Hold/Confirm) with explicit progress +   │
│ real-time availability handling + clear success actions (calendar│
│ sync + navigation), THEN booking completion rate will increase   │
│ and time-to-book will decrease, FOR primary users (Sarah, Marc), │
│ BECAUSE they can discover availability and commit with low       │
│ uncertainty and minimal wasted steps.                            │
│ User risk: Medium                                               │
│ Primary goal: Book a confirmed appointment quickly with the      │
│ right doctor/time and insurance coverage.                        │
├─────────────────────────────────────────────────────────────────┤
│ 📊 EVALUATION CRITERIA (5)                                      │
│                                                                 │
│ │ # │ Criterion                 │ Type           │ Wt │ Measure │ │
│ ├───┼───────────────────────────┼────────────────┼────┼─────────┤ │
│ │ 1 │ Clarity                   │ 🔴 Must-have   │ 5  │ ≥90% can │ │
│ │   │                           │                │    │ restate  │ │
│ │   │                           │                │    │ details; │ │
│ │   │                           │                │    │ ≤1 crit  │ │
│ │   │                           │                │    │ confusion│ │
│ │ 2 │ Speed                     │ 🟡 Should-have │ 5  │ Median   │ │
│ │   │                           │                │    │ <2:00    │ │
│ │ 3 │ Effort                    │ 🟡 Should-have │ 4  │ ≤8 core  │ │
│ │   │                           │                │    │ inter-   │ │
│ │   │                           │                │    │ actions; │ │
│ │   │                           │                │    │ ≥85% no  │ │
│ │   │                           │                │    │ backtrack│ │
│ │ 4 │ Implementation Complexity │ 🔵 Feasibility │ 4  │ ≤2 sprints│ │
│ │   │                           │                │    │; no new  │ │
│ │   │                           │                │    │ deps     │ │
│ │ 5 │ Business Impact           │ 🟣 Viability   │ 4  │ Bookings  │ │
│ │   │                           │                │    │/Search>60%│ │
│                                                                 │
│ Summary: Prioritize Clarity + Speed + Effort constrained by      │
│ Implementation Complexity and Business Impact.                   │
├─────────────────────────────────────────────────────────────────┤
│ 💡 SOLUTION APPROACHES (5)                                      │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A: Fast List + Inline Availability (QuickBook)               │ │
│ │ Core concept: Keep the standard Search → Results flow, but   │ │
│ │ make “availability” visible early (next slots right in the   │ │
│ │ results) and allow a one-tap path into confirm once a slot is │
│ │ selected.                                                    │ │
│ │ How it works: • Search specialty+location (smart defaults)   │ │
│ │            • Results list shows “Next available” chips       │ │
│ │            • Tap slot → confirm sheet (holds slot)           │ │
│ │            • Success → add to calendar / open route          │ │
│ │ Pros: Fastest end-to-end; minimal steps; aligns to MVP flow. │ │
│ │ Cons: Needs reliable slot/hold semantics; list can feel dense│ │
│ │ Best for: Sarah, Marc; also fine for Thomas if details clear │ │
│ │ 🌍 Inspiration: Doctolib-style list + “next slot” chips      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B: Map-First Nearby Booking                                  │ │
│ │ Core concept: Start with a map to optimize for proximity and  │ │
│ │ navigation; users pick a pin, then view slots.                │ │
│ │ How it works: • Map opens with current location + specialty  │ │
│ │            • Pins cluster; selecting pin shows doctor card    │ │
│ │            • Slot selection on card → confirm sheet           │ │
│ │ Pros: Great for “near me”; strong tie-in to route opening.   │ │
│ │ Cons: Slower to scan availability; accessibility risks; more  │ │
│ │ complexity (map states, clustering, permissions).             │ │
│ │ Best for: Thomas (pragmatic “closest”), some Sarah cases      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ C: “Find Me the Next Appointment” Wizard                     │ │
│ │ Core concept: Optimize for speed by collecting constraints    │ │
│ │ (when/where) and returning the best 3 options (ranked).       │ │
│ │ How it works: • Choose specialty + max travel radius          │ │
│ │            • Choose time window (today/this week/custom)      │ │
│ │            • System returns top options with earliest slots    │ │
│ │            • Pick one → confirm sheet                          │ │
│ │ Pros: Very fast when user is flexible; reduces browsing.      │ │
│ │ Cons: Requires ranking logic + strong transparency to avoid   │ │
│ │ trust issues (“why this doctor?”); harder to implement well.  │ │
│ │ Best for: Marc; busy Sarah when flexible                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ D: Doctor-First Trust Browse                                 │ │
│ │ Core concept: Put detailed doctor profiles/reviews up front   │ │
│ │ to maximize confidence, then pick time slots.                 │ │
│ │ How it works: • Results emphasize profile quality + reviews   │ │
│ │            • Doctor detail becomes primary decision screen    │ │
│ │            • Time selection as secondary step                 │ │
│ │ Pros: Highest clarity and trust; good for higher-stakes care. │ │
│ │ Cons: Slower; more reading; risk to <2 min goal.              │ │
│ │ Best for: Helga, Thomas (if info is simple + clear)           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ E: Two-Lane Hybrid (QuickBook + “Next Slot” CTA)             │ │
│ │ Core concept: Default to the fast list (A), but offer a “find │
│ │ next appointment” CTA that uses a lightweight version of (C)  │
│ │ when users just want the earliest slot.                       │ │
│ │ How it works: • Results list = A                              │ │
│ │            • CTA “Nächster Termin” collects 1-2 constraints    │ │
│ │            • Returns 3 options (no heavy ranking explanation) │ │
│ │ Pros: Covers both browsing and “just book fast” modes.        │ │
│ │ Cons: More scope than A; risk to MVP feasibility.             │ │
│ │ Best for: Sarah + Marc mix; repeat users                       │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 📊 SCORING MATRIX                                               │
│ (1–5 where 5 is best; feasibility=low complexity)               │
│                                                                 │
│ │ Criterion                 │ Wt │  A  │  B  │  C  │  D  │  E  │ │
│ ├───────────────────────────┼────┼─────┼─────┼─────┼─────┼─────┤ │
│ │ Clarity                   │ 5  │ 4/5 │ 3/5 │ 4/5 │ 5/5 │ 4/5 │ │
│ │ Speed                     │ 5  │ 5/5 │ 3/5 │ 5/5 │ 2/5 │ 5/5 │ │
│ │ Effort                    │ 4  │ 5/5 │ 3/5 │ 4/5 │ 2/5 │ 4/5 │ │
│ │ Implementation Complexity │ 4  │ 4/5 │ 3/5 │ 3/5 │ 4/5 │ 3/5 │ │
│ │ Business Impact           │ 4  │ 5/5 │ 3/5 │ 4/5 │ 3/5 │ 5/5 │ │
│ ├───────────────────────────┼────┼─────┼─────┼─────┼─────┼─────┤ │
│ │ WEIGHTED TOTAL (max 110)  │ 22 │ 101 │  66 │  89 │  71 │  93 │ │
│                                                                 │
│ Risk: A 🟡 (depends on slot-hold) | B 🟡 | C 🔴 | D 🟢 | E 🔴     │
│ Effort: A M | B M/H | C H | D M | E H                             │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Recommend A because it best meets the <2 min goal with   │
│ strong clarity and low wasted steps, while staying feasible for │
│ MVP; keep E as a V1.1 enhancement if we confirm API readiness.  │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [ ] A  [ ] B  [ ] C  [ ] D  [x] E  [ ] Combine: ___  [ ] New    │
│ Notes: Changed by user to E on 2026-01-21                       │
└─────────────────────────────────────────────────────────────────┘
```

## Locked Assumptions

1. **Slot hold / reservation**
   - **Assumption:** Do not rely on a true “slot hold” API in V1; treat slots as volatile and re-check at confirm (or handle “slot just taken”).
   - **Why / evidence:** Partner responsibilities mention “availability” + “booking confirmation” only (no hold semantics) in `docs/z.product-context/product-context.md:344`.

2. **Cancel + reschedule**
   - **Assumption:** Curaay supports cancellation; reschedule is modeled as cancel + rebook unless a first-class reschedule API exists.
   - **Why / evidence:** Cancel + reschedule are required UX outcomes in `docs/appointment-booking/appointment-booking-scope.md:186` and `docs/appointment-booking/appointment-booking-scope.md:187`, while cancellation policy is explicitly partner-dependent in `docs/appointment-booking/appointment-booking-scope.md:253`.

3. **Coverage / cost in V1**
   - **Assumption:** Do not show exact prices in V1; show insurance/coverage messaging + disclaimers without payment.
   - **Why / evidence:** “Payment processing for private appointments” is out of scope in `docs/appointment-booking/appointment-booking-scope.md:221`, and insurance info is a required dependency in `docs/appointment-booking/appointment-booking-scope.md:231`. Cost clarity remains a must-have criterion in `docs/appointment-booking/benchmarking-criteria.md:12`.

4. **Ratings / reviews**
   - **Assumption:** No ratings/reviews in V1; rely on objective signals only (distance, next slots, languages, specialization).
   - **Why / evidence:** Ratings/reviews aren’t required fields in the MEDA-BOOK scope; partner table doesn’t mention reviews data in `docs/z.product-context/product-context.md:344`.

5. **Family profiles / minors**
   - **Assumption:** Implement lightweight “Für wen ist der Termin?” selector using existing family profiles when available; avoid full family-account system in MVP.
   - **Why / evidence:** Family booking is required in `docs/appointment-booking/appointment-booking-scope.md:196`, while “Family accounts (book for dependents)” is listed as out-of-scope for MVP in `docs/z.product-context/product-context.md:374`.

## Additional Assumptions (specific to selected Approach E)

6. **“Nächster Termin” option generation**
   - **Assumption:** We can generate “top 3 next appointment” options using the same availability data used for standard results (via API-side sorting/filtering or client-side ranking over the fetched result set), without introducing new platform dependencies.
   - **Why / evidence:** Feasibility expects delivery within ~2 sprints and no new dependencies beyond calendar/maps in `docs/appointment-booking/benchmarking-criteria.md:15`. Partner integration detail is high-level in `docs/z.product-context/product-context.md:344`, so this is a product/engineering assumption to validate during SELECT.

7. **Transparency for auto-suggested options**
   - **Assumption:** Keep trust high by labeling this as a convenience feature (e.g., “Earliest available within your filters”) and showing the key reasons (earliest time + distance), without using opaque “doctor quality” ranking.
   - **Why / evidence:** “Explicit over implicit” and “confirmation over assumption” are core UX principles in `docs/z.product-context/product-context.md:305` and `docs/z.product-context/product-context.md:308`. Cost/commitment clarity remains a must-have in `docs/appointment-booking/benchmarking-criteria.md:12`.

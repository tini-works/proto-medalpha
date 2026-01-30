# Design Goals: Appointment Booking

**Context:** Appointment booking flow for MedAlpha (MEDA-BOOK)  
**Assumed hypothesis:** Users can book a confirmed in-person appointment in under 2 minutes with clear, error-free confirmation.  
**User risk level:** Medium  
**Primary user goal:** Book a confirmed appointment quickly with the right doctor/time and insurance coverage.  
**System stage:** MVP V1  
**Constraints (from product context):** German-first, accessibility baseline, partner co-branding visible, mobile-first.

| Criterion | Type | Weight | Why Essential | How to Measure |
|-----------|------|--------|---------------|----------------|
| Clarity | 🔴 Must-have | 5 | Medium-risk booking requires users to clearly understand doctor, time, location, and cost before confirming | ≥90% of test users correctly restate booking details before confirm; ≤1 critical confusion per session |
| Speed | 🟡 Should-have | 5 | Primary goal is fast booking without phone calls | Median time-to-book &lt; 2:00 from search to confirmation |
| Effort | 🟡 Should-have | 4 | Users should complete booking with minimal steps and friction | ≤8 core interactions to confirm; ≥85% complete without backtracking |
| Implementation Complexity | 🔵 Feasibility | 4 | MVP scope must be deliverable with current team and Curaay API | Est. ≤2 sprints; no new platform dependencies beyond calendar/maps |
| Business Impact | 🟣 Viability | 4 | Booking is core adoption driver for the product | Booking completion rate > 60% of search sessions; repeat booking > 40% in 90 days |

**Summary:** Prioritize Clarity + Speed + Effort constrained by Implementation Complexity and Business Impact.

## Scoring Template

| Criterion | Weight | Solution A | Solution B | Solution C | Solution D |
|-----------|--------|------------|------------|------------|------------|
| Clarity | 5 | | | | |
| Speed | 5 | | | | |
| Effort | 4 | | | | |
| Implementation Complexity | 4 | | | | |
| Business Impact | 4 | | | | |
| **Total** | **22** | | | | |

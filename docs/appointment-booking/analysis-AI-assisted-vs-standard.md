---
name: analysis:ai-assisted-vs-standard
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
scope: Reschedule & Book Again flows
created: 2026-01-23
updated: 2026-01-23
status: complete
decision: V1 Hybrid Approach
sources:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
  - docs/appointment-booking/2-design-plan-Reschedule-flow.md
  - docs/appointment-booking/2-design-plan-Book-again-flow.md
---

# Analysis: AI-Assisted vs Standard Approach

## Reschedule & Book Again Flows

This document analyzes the trade-offs between AI-assisted and standard (non-AI) approaches for the Reschedule and Book Again flows, leading to the V1 Hybrid recommendation.

---

## Context from Scope

| Requirement | Implication for Design |
|-------------|------------------------|
| **Sarah (34)**: <2 min completion | Speed is critical; fewer steps better |
| **Helga (68)**: Simple, clear | Complexity must be optional, not forced |
| **Time to book**: <2 minutes | Every screen adds friction |
| **Completion rate**: >60% | Drop-offs = failure |
| **Repeat booking**: >40% | Book Again flow is strategic |
| **WCAG AA** | No dark patterns, clear explanations |

---

## Option A: Standard (No AI-Assisted)

### Reschedule Flow (Standard)
```
[Appointment Details] → [Full Calendar] → [Confirm] → [Success]
```

### Book Again Flow (Standard)
```
[History] → [Doctor Profile] → [Full Calendar] → [Confirm] → [Success]
```

### Pros

| Benefit | Details |
|---------|---------|
| **Simpler implementation** | No ranking logic, no "why" explanations needed |
| **Predictable behavior** | Users always see same calendar view |
| **Fewer edge cases** | No "AI got it wrong" scenarios |
| **Faster V1 ship** | Less design, less engineering |
| **Helga-friendly** | No new concepts to learn |
| **Full transparency** | User picks from all options equally |
| **Lower maintenance** | No tuning of suggestion algorithms |
| **Privacy-simple** | No pattern detection or analysis |

### Cons

| Drawback | Impact on Scope |
|----------|-----------------|
| **More taps** | 4-5 screens vs 2-3; threatens <2 min target |
| **Manual comparison** | User must remember original time, compare mentally |
| **No context reuse** | Book Again doesn't leverage history data |
| **No timing guidance** | User doesn't know "6 months since last visit" |
| **Full calendar overwhelm** | Helga may struggle with week-view navigation |
| **Lower completion** | More steps = more drop-off points |
| **Slot hunting burden** | User scrolls through days to find good time |
| **No unavailability handling** | Doctor not available = dead end |

### Metrics Impact (Estimated)

| Metric | Standard Approach |
|--------|-------------------|
| Time to reschedule | ~90–120 seconds |
| Time to book again | ~90–120 seconds |
| Completion rate | ~55–65% |
| AI acceptance | N/A |

---

## Option B: Full AI-Assisted

### Reschedule Flow (AI-Assisted)
```
[Appointment Details] → [Optional Reason] → [3-5 Suggestions] → [Confirm] → [Success]
                                                    └→ [Full Calendar fallback]
```

### Book Again Flow (AI-Assisted)
```
[History] → [Pre-filled Context] → [3-5 Suggestions] → [Confirm] → [Success]
                     └→ [Similar Doctors if unavailable]
```

### Pros

| Benefit | Details |
|---------|---------|
| **Faster completion** | 2-3 screens; supports <2 min target |
| **Context reuse** | Pre-fills doctor, insurance, patient from history |
| **Smart defaults** | Suggests similar time to original (less cognitive load) |
| **Timing intelligence** | "6 months since last visit" helps users plan |
| **Unavailability handling** | Shows alternatives instead of dead end |
| **Comparison built-in** | Reschedule shows old vs new clearly |
| **Pattern leverage** | Learns user prefers "Tuesday mornings" |
| **Higher completion** | Fewer steps, less effort |
| **Differentiation** | Doctolib/Jameda don't offer this |

### Cons

| Drawback | Mitigation in Design |
|----------|---------------------|
| **Complexity** | Optional reason step; skip available |
| **"Why this?" skepticism** | Transparent "Warum" for every suggestion |
| **Algorithm opacity risk** | Rules-based (not ML); fully explainable |
| **Helga confusion** | Full calendar always available as escape |
| **Development cost** | More screens, more logic |
| **Wrong suggestions** | User can always browse all |
| **Privacy perception** | Pattern detection is local, session-only |
| **Maintenance burden** | Tuning suggestion logic over time |

### Metrics Impact (Estimated)

| Metric | AI-Assisted Approach |
|--------|----------------------|
| Time to reschedule | ~45–60 seconds |
| Time to book again | ~30–45 seconds |
| Completion rate | ~70–80% |
| AI acceptance | ~50–60% (rest use fallback) |

---

## Persona-by-Persona Analysis

| Persona | Standard | AI-Assisted | Winner |
|---------|----------|-------------|--------|
| **Sarah (34)** | Too slow; needs <2 min for lunch break | Fast suggestions fit her pace | AI |
| **Marc (42)** | Manual = inefficient | "No wasted time" via smart defaults | AI |
| **Helga (68)** | Familiar calendar view | May confuse; needs clear fallback | Tie* |
| **Thomas (51)** | Transparent but slow | Transparent "Warum" + fast | AI |
| **Elena (23)** | Dated UX feel | Modern, smart UX | AI |

*Helga tie requires: clear "Alle Termine" escape, no forced AI path, simple language

---

## Requirement Coverage Comparison

| Scope Requirement | Standard | AI-Assisted |
|-------------------|----------|-------------|
| BOOK-017: Same doctor constraint | ✓ | ✓ |
| BOOK-017: Release after confirm | ✓ | ✓ |
| BOOK-018: "Erneut buchen" action | ✓ | ✓ |
| BOOK-018: History for 12 months | ✓ | ✓ |
| <2 min time-to-book | ⚠️ Risk | ✓ Likely |
| >60% completion rate | ⚠️ Risk | ✓ Likely |
| >40% repeat booking | Neutral | ✓ Easier rebooking helps |
| WCAG AA | ✓ | ✓ (with "Warum" transparency) |
| Helga usability | ✓ | ⚠️ Needs fallback |

---

## Decision: V1 Hybrid Approach

### Recommendation

| Flow | Recommendation | Rationale |
|------|----------------|-----------|
| **Reschedule** | AI-Assisted (simplified) | High value; user already has context; suggestions save time |
| **Book Again** | AI-Assisted (pre-fill only) | Pre-fill is low-risk; suggestions can be V1.1 |

### Simplifications for V1

1. **Reschedule**: Skip optional reason step; use default ranking (similar time, soonest)
2. **Book Again**: Pre-fill context, but show full calendar instead of suggestions
3. **Both**: Always show "Alle Termine anzeigen" prominently
4. **Both**: "Warum" is optional to expand (not shown by default for Helga)

### Migration Path

| Version | Reschedule | Book Again |
|---------|------------|------------|
| V1 | 3-5 suggestions + fallback | Pre-fill + full calendar |
| V1.1 | Add reason capture (optional) | Add slot suggestions |
| V2 | Calendar integration | Similar doctors + timing hints |

---

## Summary

| Aspect | Standard | AI-Assisted | Verdict |
|--------|----------|-------------|---------|
| **Speed** | Slower | Faster | AI wins |
| **Simplicity** | Simpler | More complex | Standard wins |
| **Completion rate** | Lower | Higher | AI wins |
| **Development cost** | Lower | Higher | Standard wins |
| **User satisfaction** | Neutral | Higher (if done right) | AI wins |
| **Scope compliance** | At risk (<2 min) | Compliant | AI wins |
| **Helga safety** | Safe | Safe with fallback | Tie |

**Bottom line**: AI-Assisted is worth the investment for these flows because:
1. Users already have context (existing appointment/history)
2. Suggestions reduce cognitive load, not add complexity
3. Transparent "Warum" maintains trust (DocliQ brand value)
4. Fallback to full calendar always available (no lock-in)
5. Repeat booking rate (>40% target) directly benefits from easier rebooking

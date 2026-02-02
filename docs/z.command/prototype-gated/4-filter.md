---
name: prototype-gated:4-filter
description: Critical decision - which solution(s) to invest prototype effort in (MANDATORY GATE)
---

# Gate: FILTER (MANDATORY ⭐)

**Purpose:** Critical decision - which solution(s) to invest prototype effort in

## Why Mandatory

- Prototype effort is expensive (hours/days)
- Forces articulation of WHY this approach
- Creates audit trail for learning
- Prevents building wrong thing

## Input

- 4-6 solution approaches from Ideations step
- Hypothesis and success metrics from Framing

## Process

1. **Score each approach** against weighted criteria
2. **Analyze trade-offs** per approach (benefit, users, risk)
3. **Recommend** BUILD / DEFER / DROP for each
4. **Human decides** which approach(es) to prototype

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ ⭐ FILTER GATE (MANDATORY)     Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 FILTERING: [N] solutions from Ideations                      │
├─────────────────────────────────────────────────────────────────┤
│ 📊 BENCHMARK SCORING                                            │
│ ┌──────────┬───────────┬───────────┬───────────┬───────────┐    │
│ │ Criteria │ Weight    │ A         │ B         │ C         │    │
│ ├──────────┼───────────┼───────────┼───────────┼───────────┤    │
│ │ Validates│ 5 (must)  │ ⬤⬤⬤⬤⬤   │ ⬤⬤⬤⬤○   │ ⬤⬤⬤○○   │    │
│ │ hypothesis                                                │    │
│ │ Build    │ 4         │ ⬤⬤⬤⬤⬤   │ ⬤⬤⬤○○   │ ⬤⬤○○○   │    │
│ │ effort                                                    │    │
│ │ Learning │ 4         │ ⬤⬤⬤○○   │ ⬤⬤⬤⬤○   │ ⬤⬤⬤⬤⬤   │    │
│ │ potential                                                 │    │
│ │ Risk     │ 3         │ ⬤⬤⬤⬤○   │ ⬤⬤⬤○○   │ ⬤⬤○○○   │    │
│ ├──────────┼───────────┼───────────┼───────────┼───────────┤    │
│ │ TOTAL    │           │ 72/80     │ 58/80     │ 48/80     │    │
│ └──────────┴───────────┴───────────┴───────────┴───────────┘    │
├─────────────────────────────────────────────────────────────────┤
│ ⚖️ TRADE-OFF ANALYSIS (per approach)                            │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A: [APPROACH NAME]                                          │ │
│ │                                                             │ │
│ │ ✅ Primary benefit: [main value delivered]                  │ │
│ │                                                             │ │
│ │ 👤 User types who benefit:                                  │ │
│ │    ✓ [user segment 1]                                       │ │
│ │    ✓ [user segment 2]                                       │ │
│ │                                                             │ │
│ │ 👤 User types who may suffer:                               │ │
│ │    ✗ [user segment 3]                                       │ │
│ │    ✗ [user segment 4]                                       │ │
│ │                                                             │ │
│ │ 💥 Risk scenario: [concrete failure case - what happens     │ │
│ │    if this approach fails? Be specific.]                    │ │
│ │                                                             │ │
│ │ 💡 If wrong, we still learn: [insight gained from failure]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B: [APPROACH NAME]                                          │ │
│ │                                                             │ │
│ │ ✅ Primary benefit: [main value delivered]                  │ │
│ │                                                             │ │
│ │ 👤 User types who benefit:                                  │ │
│ │    ✓ [user segment 1]                                       │ │
│ │    ✓ [user segment 2]                                       │ │
│ │                                                             │ │
│ │ 👤 User types who may suffer:                               │ │
│ │    ✗ [user segment 3]                                       │ │
│ │                                                             │ │
│ │ 💥 Risk scenario: [concrete failure case]                   │ │
│ │                                                             │ │
│ │ 💡 If wrong, we still learn: [insight gained from failure]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ (C, D, E, F if applicable...)                                   │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION:                                           │
│ BUILD: [A] because [highest validation + lowest effort]         │
│ DEFER: [B] as backup if A invalidates hypothesis                │
│ DROP: [C] because [doesn't validate core hypothesis]            │
├─────────────────────────────────────────────────────────────────┤
│ ⭐ GATE DECISION (REQUIRED):                                    │
│ [ ] BUILD A only                                                │
│ [ ] BUILD A + B (parallel prototypes)                           │
│ [ ] BUILD B only (override AI)                                  │
│ [ ] RETURN to Ideations (need better options)                   │
│ [ ] ABORT (hypothesis not worth testing)                        │
│                                                                 │
│ Rationale: _________________________________                    │
│ Decided by: _____________ Date: _____________                   │
└─────────────────────────────────────────────────────────────────┘
```

## Scoring Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| Validates hypothesis | 5 (must) | Does it test the core IF-THEN? |
| Build effort | 4 | How long to build prototype? |
| Learning potential | 4 | What do we learn regardless of outcome? |
| Risk | 3 | What could go wrong? |

## Trade-off Analysis per Approach

| Field | Description |
|-------|-------------|
| **Primary benefit** | Main value delivered |
| **User types who benefit** | Segments with ✓ checkmarks |
| **User types who may suffer** | Segments with ✗ marks |
| **Risk scenario** | Concrete failure case (be specific) |
| **If wrong, we still learn** | Insight gained even from failure |

## AI Recommendation Categories

| Category | Meaning |
|----------|---------|
| **BUILD** | Highest priority - prototype this |
| **DEFER** | Backup option if BUILD fails |
| **DROP** | Don't prototype - doesn't validate hypothesis |

## Gate Decisions

| Decision | When to Use |
|----------|-------------|
| **BUILD A only** | Single best approach, clear winner |
| **BUILD A + B** | Want to test multiple directions in parallel |
| **BUILD B only** | Override AI recommendation with rationale |
| **RETURN to Ideations** | None of the approaches are good enough |
| **ABORT** | Hypothesis not worth testing anymore |

## Required Fields

Human MUST provide:
- Selected approach(es) to build
- Rationale for decision
- Name and date

## Next Step

After BUILD decision → **Step: BUILD** (create interactive HTML prototypes)

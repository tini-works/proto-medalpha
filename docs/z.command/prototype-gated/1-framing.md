---
name: prototype-gated:1-framing
description: Generate 3-5 problem framings, each with a testable hypothesis
---

# Step: FRAMING

**Purpose:** Generate 3-5 problem framings, each with a testable hypothesis

## Input

- User's original problem/request
- Any existing context (personas, research, constraints)

## Process

1. **Understand the original request** - What is the user trying to solve?
2. **Generate 3-5 distinct framings** - Each should offer a different angle on the same problem
3. **For each framing, define:**
   - Problem statement (1-2 sentence reframe)
   - Root cause hypothesis (why this happens)
   - Testable hypothesis (IF-THEN-FOR-BECAUSE format)
   - Key assumptions (1-3 things that must be true)
   - Success metric with pass/fail thresholds
4. **Compare framings** - Evaluate each on: validates core need, build effort, learning value
5. **Recommend** - AI suggests best framing with rationale
6. **Decision** - Human selects framing to proceed with

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ PROTOTYPE FRAMING              Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 ORIGINAL REQUEST                                             │
│ [User's original problem/request]                               │
├─────────────────────────────────────────────────────────────────┤
│ 🔄 PROBLEM FRAMINGS (3-5)                                       │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ A: [FRAMING NAME]                                           │ │
│ │ Problem: [1-2 sentence reframe]                             │ │
│ │ Root cause: [why this happens]                              │ │
│ │ Hypothesis: IF [X] THEN [Y] FOR [Z] BECAUSE [mechanism]     │ │
│ │ Key assumptions: • [assumption 1] • [assumption 2]          │ │
│ │ Success metric: [metric] → Pass: [X] / Fail: [Y]            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ B: [FRAMING NAME]                                           │ │
│ │ Problem: [different angle on same issue]                    │ │
│ │ Root cause: [alternative root cause]                        │ │
│ │ Hypothesis: IF [X] THEN [Y] FOR [Z] BECAUSE [mechanism]     │ │
│ │ Key assumptions: • [assumption 1] • [assumption 2]          │ │
│ │ Success metric: [metric] → Pass: [X] / Fail: [Y]            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ C: [FRAMING NAME]                                           │ │
│ │ ...                                                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 📊 FRAMING COMPARISON                                           │
│ ┌──────────┬────────────┬────────────┬────────────┐             │
│ │          │ Validates  │ Build      │ Learning   │             │
│ │          │ core need? │ effort     │ value      │             │
│ ├──────────┼────────────┼────────────┼────────────┤             │
│ │ A        │ ✅ Direct  │ 🟢 Low     │ 🟢 High    │             │
│ │ B        │ ⚠️ Indirect│ 🟡 Med     │ 🟡 Med     │             │
│ │ C        │ ✅ Direct  │ 🔴 High    │ 🟢 High    │             │
│ └──────────┴────────────┴────────────┴────────────┘             │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [A/B/C] because [rationale]               │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION: [ ] A  [ ] B  [ ] C  [ ] Combine  [ ] Reframe      │
│ Notes: _______________________                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Fields per Framing

| Field | Description |
|-------|-------------|
| **Problem** | 1-2 sentence reframe of the issue from this angle |
| **Root cause** | Why this problem exists (the underlying mechanism) |
| **Hypothesis** | IF [action] THEN [outcome] FOR [user] BECAUSE [reason] |
| **Key assumptions** | 1-3 things that must be true for hypothesis to work |
| **Success metric** | Measurable outcome with pass/fail thresholds |

## Comparison Criteria

| Criteria | Options |
|----------|---------|
| Validates core need? | ✅ Direct / ⚠️ Indirect / ❌ Tangential |
| Build effort | 🟢 Low / 🟡 Med / 🔴 High |
| Learning value | 🟢 High / 🟡 Med / 🔴 Low |

## Decision Options

- **Select A/B/C** - Proceed with chosen framing
- **Combine** - Merge elements from multiple framings
- **Reframe** - None are right, generate new framings

## Next Step

After selecting a framing → proceed to **Gate 1: Ideation Input** (optional) or **Step: Ideations**

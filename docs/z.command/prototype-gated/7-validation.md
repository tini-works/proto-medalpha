---
name: prototype-gated:7-validation
description: Test prototype against hypothesis, capture learnings
---

# Step: VALIDATION (TEST)

**Purpose:** Test prototype against hypothesis, capture learnings

## Input

- Built prototype(s) from BUILD step
- Hypothesis and success metrics from Framing
- Test results (user testing, stakeholder review, self-test)

## Process

1. **Conduct testing** - user testing, stakeholder review, or self-test
2. **Compare results** to hypothesis predictions
3. **Record evidence** - observations, quotes, surprises
4. **Capture learnings** - what we learned, what we still don't know
5. **Determine verdict** - Validated / Invalidated / Inconclusive
6. **Decide next action** - Proceed / Iterate / Pivot / Abandon

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ VALIDATION RESULTS             Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 TESTED: [Prototype name]                                     │
│ METHOD: [User testing / Stakeholder review / Self-test / ...]   │
│ PARTICIPANTS: [N users, segments]                               │
├─────────────────────────────────────────────────────────────────┤
│ 🧪 HYPOTHESIS RESULT                                            │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ IF [we built X]           → DID WE? ✅/❌                    │ │
│ │ THEN [outcome Y]          → OBSERVED: [what happened]       │ │
│ │ Success metric: [target]  → ACTUAL: [result]                │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ VERDICT: ✅ VALIDATED / ❌ INVALIDATED / ⚠️ INCONCLUSIVE        │
├─────────────────────────────────────────────────────────────────┤
│ 📊 EVIDENCE                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ What we observed:                                           │ │
│ │ • [observation 1]                                           │ │
│ │ • [observation 2]                                           │ │
│ │                                                             │ │
│ │ User quotes:                                                │ │
│ │ • "[quote 1]" - P1                                          │ │
│ │ • "[quote 2]" - P2                                          │ │
│ │                                                             │ │
│ │ Surprises:                                                  │ │
│ │ • [unexpected finding]                                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 💡 LEARNINGS                                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ What we learned:                                            │ │
│ │ • [learning 1]                                              │ │
│ │ • [learning 2]                                              │ │
│ │                                                             │ │
│ │ What we still don't know:                                   │ │
│ │ • [open question 1]                                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION:                                           │
│ [PROCEED to full build / PIVOT hypothesis / ITERATE prototype / │
│  ABANDON direction]                                             │
│ Because: [rationale]                                            │
├─────────────────────────────────────────────────────────────────┤
│ ✅ NEXT ACTION:                                                 │
│ [ ] PROCEED - run full NEW FEATURE workflow                     │
│ [ ] ITERATE - build another prototype (new hypothesis)          │
│ [ ] PIVOT - reframe problem entirely                            │
│ [ ] ABANDON - not worth pursuing                                │
│                                                                 │
│ If PROCEED, carry forward:                                      │
│ • Validated hypothesis: [statement]                             │
│ • Key constraint: [from learnings]                              │
│ • Must include: [from user feedback]                            │
│                                                                 │
│ Decided by: _____________ Date: _____________                   │
└─────────────────────────────────────────────────────────────────┘
```

## Testing Methods

| Method | When to Use | Participants |
|--------|-------------|--------------|
| **User testing** | Validating with real users | 3-5 users per segment |
| **Stakeholder review** | Getting buy-in | Key decision makers |
| **Self-test** | Quick internal check | Team members |
| **A/B test** | Comparing approaches | Split user groups |

## Hypothesis Result

| Field | Description |
|-------|-------------|
| **IF [we built X]** | Did we actually build what we said? ✅/❌ |
| **THEN [outcome Y]** | What actually happened vs. predicted |
| **Success metric** | Target vs. actual measurement |

## Verdict Options

| Verdict | Meaning | Next Step |
|---------|---------|-----------|
| ✅ **VALIDATED** | Hypothesis proved true | Proceed to full build |
| ❌ **INVALIDATED** | Hypothesis proved false | Pivot or abandon |
| ⚠️ **INCONCLUSIVE** | Can't determine | Iterate with better test |

## Evidence Categories

| Category | Description |
|----------|-------------|
| **Observations** | What we saw users do |
| **User quotes** | Direct quotes from participants |
| **Surprises** | Unexpected findings |

## Learnings

| Category | Description |
|----------|-------------|
| **What we learned** | Confirmed insights |
| **What we still don't know** | Open questions for future |

## Next Action Options

| Action | When to Use | What Happens |
|--------|-------------|--------------|
| **PROCEED** | Hypothesis validated | Run full NEW FEATURE workflow |
| **ITERATE** | Need to test different approach | Build another prototype |
| **PIVOT** | Problem framing was wrong | Return to Framing step |
| **ABANDON** | Not worth pursuing | Archive learnings, move on |

## Carry Forward (if PROCEED)

When proceeding to full build, document:
- **Validated hypothesis** - statement that was proven
- **Key constraint** - limitation discovered during testing
- **Must include** - features/requirements from user feedback

## Workflow Complete

After Validation, PROTOTYPE-GATED workflow is complete.

If PROCEED → Start **NEW FEATURE** workflow with validated hypothesis.

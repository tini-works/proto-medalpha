---
name: prototype-gated:2-gate-1-ideation-input
description: Gather context inputs for ideation - hypothesis, IA, user flow, scope, UX (Optional gate)
---

# Gate 1: IDEATION INPUT (Optional)

**Purpose:** Gather context inputs for ideation - hypothesis, IA, user flow, scope, UX

## When to Use

- Use when you need structured context before generating solutions
- Skip if context is already clear and you want to move fast

## Input

- Selected framing from Step 1
- Existing IA documentation (if available)
- User flow documentation (if available)

## Process

1. **Pull hypothesis** from selected framing
2. **Document IA** - page/screen hierarchy relevant to prototype
3. **Map user flow** - entry → steps → outcome with pain points
4. **Define scope** (optional) - explicit in/out boundaries
5. **Identify UX patterns** (optional) - interactions to reuse or create
6. **Check readiness** - all mandatory inputs present?

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│ GATE 1: IDEATION INPUT         Status: 🟡 PENDING               │
├─────────────────────────────────────────────────────────────────┤
│ 📋 MANDATORY INPUTS                                             │
│                                                                 │
│ 🧪 HYPOTHESIS (from Step 1)                        ✅/❌        │
│ Selected: [Framing A/B/C]                                       │
│ IF [X] THEN [Y] FOR [Z] BECAUSE [mechanism]                     │
│ Key assumptions: • [1] • [2]                                    │
│                                                                 │
│ 🗺️ INFORMATION ARCHITECTURE (IA)                   ✅/❌        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Page/Screen hierarchy relevant to prototype]               │ │
│ │ • [Parent] → [Child 1] → [Child 2]                          │ │
│ │ • [Affected areas highlighted]                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 🔄 USER FLOW                                        ✅/❌        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [Entry] → [Step 1] → [Step 2] → [Outcome]                   │ │
│ │ Key decision points: [where user chooses]                   │ │
│ │ Pain points in current flow: [what's broken]                │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 📋 OPTIONAL INPUTS                                              │
│                                                                 │
│ 📐 SCOPE                                            ✅/❌/⏭️     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ IN:  [what prototype must include]                          │ │
│ │ OUT: [explicitly excluded]                                  │ │
│ │ Screens: [max N]  Features: [max N]                         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 🎨 UX INTERACTIONS                                  ✅/❌/⏭️     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Key interactions: [tap, swipe, long-press, etc.]            │ │
│ │ Existing patterns to reuse: [from design system]            │ │
│ │ New patterns needed: [if any]                               │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ 📊 INPUT CHECKLIST                                              │
│ ┌──────────────────┬──────────┬─────────────────────┐           │
│ │ Input            │ Required │ Status              │           │
│ ├──────────────────┼──────────┼─────────────────────┤           │
│ │ Hypothesis       │ ⭐ YES   │ ✅/❌               │           │
│ │ IA               │ ⭐ YES   │ ✅/❌               │           │
│ │ User Flow        │ ⭐ YES   │ ✅/❌               │           │
│ │ Scope            │ Optional │ ✅/❌/⏭️ Skip       │           │
│ │ UX Interactions  │ Optional │ ✅/❌/⏭️ Skip       │           │
│ └──────────────────┴──────────┴─────────────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: PROCEED (all mandatory ✅) / BLOCKED (missing inputs)    │
├─────────────────────────────────────────────────────────────────┤
│ ✅ GATE DECISION:                                               │
│ [ ] PROCEED - all mandatory inputs ready                        │
│ [ ] GATHER MORE - need [IA / User Flow / ...]                   │
│ [ ] RETURN to Framing - hypothesis unclear                      │
│ [ ] ABORT - not worth prototyping                               │
│ Decided by: _____________ Date: _____________                   │
└─────────────────────────────────────────────────────────────────┘
```

## Mandatory Inputs

| Input | Description | Source |
|-------|-------------|--------|
| **Hypothesis** | Selected IF-THEN-FOR-BECAUSE | From Step 1: Framing |
| **IA** | Page/screen hierarchy | Existing docs or create |
| **User Flow** | Entry → steps → outcome | Existing docs or create |

## Optional Inputs

| Input | Description | When Useful |
|-------|-------------|-------------|
| **Scope** | IN/OUT boundaries | Complex prototypes |
| **UX Interactions** | Patterns to use | Reusing design system |

## Gate Decisions

| Decision | When to Use |
|----------|-------------|
| **PROCEED** | All mandatory inputs ready (✅) |
| **GATHER MORE** | Missing IA or User Flow |
| **RETURN to Framing** | Hypothesis unclear |
| **ABORT** | Not worth prototyping |

## Next Step

After PROCEED → **Step: Ideations**

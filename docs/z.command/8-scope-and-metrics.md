---
description: Define scope boundaries and success metrics
---

## Input

**Required:** Solution approaches, Hypothesis, User goals, Available resources
**Optional:** Timeline context, Dependencies, Technical constraints, Current baseline metrics, Analytics infrastructure

📎 Attach file OR paste inline below

---

## Command

### Part 1: Define Scope

Define what's in scope and out of scope for the current implementation phase.

**Derive scope from Step 7 Jobs (User Flows):**

| Job (from Step 7) | → Capability (Scope Item) | In/Out | Why |
|-------------------|---------------------------|--------|-----|
| J1: [Job name] | [What user can do] | ✅/❌ | [Constraint or reason] |
| J2: [Job name] | [What user can do] | ✅/❌ | [Constraint or reason] |

**In Scope (MVP):**
- List capabilities derived from Jobs
- For each, specify simplified version vs. full vision
- Frame as "Let user..." (capability-driven, not UI-driven)

**Out of Scope (Future):**
- List capabilities explicitly excluded
- Categorize: Phase 2 / Future / Won't do
- Explain why deferred (complexity, constraints, validation needed)

**Scope boundaries:**
- Technical boundaries (what systems are touched)
- User boundaries (which personas are served)
- Capability boundaries (what users can/cannot do)

**Dependencies:**
- What must exist before this can ship
- What can be built in parallel
- External dependencies (APIs, data, approvals)

### Part 1b: Task Breakdown (Sprint-Ready)

Break down in-scope features into Epics → User Stories → Acceptance Criteria.

**Format: User Story + Capability-driven ACs**

| User Story | Acceptance Criteria |
|------------|---------------------|
| **[Story Name]** | AC1: [What system allows/does] |
| As [persona] I want to [action] so I [outcome] | AC2: [What system allows/does] |
| | AC3: [What system allows/does] |

**AC Style Guide:**
- Start with "Let user..." or verb describing system behavior
- Focus on WHAT, not HOW (no click-by-click steps)
- Include edge cases and constraints
- Examples:
  - "Let user define if consent is required BEFORE or AFTER profile creation"
  - "Show checkbox only when partner has granted consent"
  - "Default consent toggle to OFF"
  - "Mark meals as logged by [Partner name] when shared"

**Summary Table:**
| Epic | Stories | Total ACs | Priority |
|------|---------|-----------|----------|
| **1. [Epic Name]** | X | Y | P0/P1 |
| **Total** | **X** | **Y** | |

**Definition of Done:**
- [ ] Code complete
- [ ] Tests passing
- [ ] Design verified
- [ ] Accessibility checked

### Part 2: Define Success Metrics

Define success metrics for the selected solution approaches.

**Primary success indicators:**
- 2-3 key metrics that prove the hypothesis
- Target values or thresholds for success
- Measurement method and data source

**Leading indicators:**
- Early signals that predict primary success
- Observable within first week of launch
- Actionable if trending wrong

**Guardrail metrics:**
- What should NOT get worse
- Acceptable trade-off ranges
- Red flags that require immediate action

**Per-approach metrics:**
For each solution approach, specify:
- Specific metric(s) to validate this approach
- Success threshold
- Failure threshold (when to reconsider)

---

## Output Format (choose one)

### Format 1: Decision Card 📋 ⭐ Recommended

One-page summary card optimized for:
- 30-second scan by managers
- Clear decision checkboxes
- AI recommendation with rationale
- Decision history tracking

**Use when:** Need quick approval, tracking decisions, or scaling across many CRs.

```
┌─────────────────────────────────────────────────────────────┐
│ CR-ID: ________            Step: 8-Scope & Metrics          │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Defining scope for: [solution from Step 5]                  │
├─────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                         │
│ ┌─────────────────────────┬─────────────────────────┐       │
│ │ ✅ IN SCOPE             │ ❌ OUT OF SCOPE         │       │
│ ├─────────────────────────┼─────────────────────────┤       │
│ │ • [item 1]              │ • [item 1]              │       │
│ │ • [item 2]              │ • [item 2]              │       │
│ │ • [item 3]              │ • [item 3]              │       │
│ └─────────────────────────┴─────────────────────────┘       │
│                                                             │
│ 📏 SUCCESS METRICS                                          │
│ • [Metric 1]: [target] (how measured)                       │
│ • [Metric 2]: [target] (how measured)                       │
│                                                             │
│ 🚧 DEPENDENCIES: [count] items                              │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Accept/Reduce scope] because [why]   │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Accept scope  [ ] Expand  [ ] Reduce  [ ] Defer items   │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-8-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-8-card.md`

---

### Format 2: OKR-Style Canvas
Objectives (scope) paired with Key Results (metrics) - industry standard, easy to review

```
Objective: [What we're building]
├── In Scope: [features]
├── KR1: [metric] → [target]
├── KR2: [metric] → [target]
└── Out of Scope: [deferred items]
```

### Format 2: Goals-Signals-Metrics (GSM) Framework
Google's approach connecting user goals → observable signals → measurable metrics
- Clear causality chain from user intent to measurement
- Prevents vanity metrics by requiring signal justification

### Format 3: Definition of Done Checklist
Simple checklist format with:
- Scope items as checkbox tasks
- Success criteria as acceptance criteria
- Metrics as verification steps with pass/fail thresholds

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 9.**

After AI generates output:
1. **Review** the scope boundaries and success metrics
2. **Decide** to accept, expand, reduce, or defer items
3. **Confirm** by telling AI: `"Step 8 decision: [your choice]"`

**Example confirmations:**
- "Step 8 decision: Accept scope"
- "Step 8 decision: Reduce scope, remove feature X"
- "Step 8 decision: Defer item Y to Phase 2"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 9
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 9 (or Gates 2/3/4b if enabled)

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

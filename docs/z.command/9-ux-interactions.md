---
description: Define UX flows and interaction patterns
---

## Input

**Required:** Step 7 Jobs (User Flows), Step 8 Scope (Capabilities + Constraints)
**Optional:** Design system constraints, Existing UI patterns

📎 Attach file OR paste inline below

---

## Command

Define UX interactions for each Job from Step 7, constrained by Scope from Step 8.

**Derivation chain:**
```
Step 7 Jobs → Step 8 Scope → Step 9 Interactions → Screens (OUTPUT)
```

**Key principle:** Screens are OUTPUT of interactions, not input. Define WHAT happens and HOW, then derive WHERE (screens) from that.

### For each Job, specify:

**1. Source (Job → Capability mapping):**

| Job (Step 7) | Capability (Step 8) | Constraint |
|--------------|---------------------|------------|
| [Job name] | [What system allows] | [Limitation] |

**2. Interaction: User Action → System Response**

| # | User Action | System Response | Constraint Applied |
|---|-------------|-----------------|-------------------|
| 1 | User does X | System responds with Y | [Which constraint] |
| 2 | User does Z | System responds with W | [Which constraint] |

**Interaction Style Guide:**
- Focus on WHAT user does and WHAT system responds
- Include constraint that applies to each interaction
- No screen references (screens are derived, not assumed)
- Examples:
  - "User enters name" → "System validates (required, ≤20 chars)"
  - "User checks 'log for both'" → "System shows confirmation"
  - "User confirms" → "System creates meal in both profiles"

**3. Conditional Logic (if applicable):**

| Condition | System Response |
|-----------|-----------------|
| [If state X] | [Show/Hide/Enable Y] |
| [If state Z] | [Show/Hide/Enable W] |

**4. Derived Screen Needs:**

From the interactions above, list UI requirements:
- [ ] [Component/screen needed for interaction #1]
- [ ] [Component/screen needed for interaction #2]

**5. Edge Cases:**

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| [Edge case] | [What user does] | [What system does] |

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
┌─────────────────────────────────────────────────────────────────────────┐
│ CR-ID: ________            Step: 9-UX Interactions                      │
│ Status: 🟡 PENDING         Date: ____________                           │
├─────────────────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                              │
│ Interactions derived from: [X] Jobs + [Y] Capabilities                  │
│ Derivation: Job → User Action → System Response → Screen (output)       │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔄 INTERACTION OVERVIEW                                                 │
│ ┌──────────────────────────┬──────────────┬─────────────┐               │
│ │ Job → Capability         │ User Actions │ Sys Responses│              │
│ ├──────────────────────────┼──────────────┼─────────────┤               │
│ │ J1: [job name]           │ X            │ Y           │               │
│ │ J2: [job name]           │ X            │ Y           │               │
│ │ J3: [job name]           │ X            │ Y           │               │
│ └──────────────────────────┴──────────────┴─────────────┘               │
│                                                                         │
│ 📦 DERIVED SCREENS: [count] components needed                           │
├─────────────────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Accept/Simplify] because [reason]                │
├─────────────────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                             │
│ [ ] Accept interactions  [ ] Simplify  [ ] Add error paths              │
│ Notes: _______________________________________________                  │
│ Decided by: ________________  Date: ______________                      │
├─────────────────────────────────────────────────────────────────────────┤
│ 🔗 Full details: step-9-interactions-full.md                            │
└─────────────────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-9-card.md`

---

### Format 2: Mermaid Sequence Diagram
Step-by-step interaction flow showing user actions and system responses

### Format 3: HTML Interactive Flow
Clickable prototype-style flow with states, transitions, and persona annotations

### Format 4: Action-Response Table
Markdown table: User Action | System Response | Constraint | Derived Screen

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 10.**

After AI generates output:
1. **Review** the interactions (User Action → System Response)
2. **Validate** against Jobs: "Does this let user accomplish J#?"
3. **Confirm** by telling AI: `"Step 9 decision: [your choice]"`

**Example confirmations:**
- "Step 9 decision: Accept interactions"
- "Step 9 decision: Simplify J2 flow"
- "Step 9 decision: Add error path for [scenario]"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 10
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 10

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

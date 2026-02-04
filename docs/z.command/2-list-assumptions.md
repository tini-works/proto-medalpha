---
description: Identify and risk-rate assumptions in the selected problem framing
---

## Input

**Required:** Selected problem framing
**Optional:** Known facts, Existing research

📎 Attach file OR paste inline below

---

## Command

List all assumptions embedded in the selected problem framing. Group them into:
- User behavior assumptions
- Context assumptions  
- Constraint assumptions

For each assumption, mark the risk level (Low/Medium/High/Risky) and explain why.

Highlight the 3-5 highest-risk assumptions that need validation before building.

Suggest quick validation methods for the riskiest assumptions.

---

## Output Format (choose one)

### Format 1: Decision Card  ⭐ Recommended

One-page summary card optimized for:
- 30-second scan by managers
- Clear decision checkboxes
- AI recommendation with rationale
- Decision history tracking

**Use when:** Need quick approval, tracking decisions, or scaling across many CRs.

```
┌─────────────────────────────────────────────────────────────┐
│ CR-ID: ________            Step: 2-List Assumptions         │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Problem framing: [selected from Step 1]                     │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ TOP ASSUMPTIONS (max 5)                                  │
│ ┌──────────────────────┬────────┬────────┬─────────┐        │
│ │ Assumption           │ Impact │ Risk   │ Validate│        │
│ ├──────────────────────┼────────┼────────┼─────────┤        │
│ │ 1. [assumption]      │ 🔴High │ 🔴High │ [ ] Yes │        │
│ │ 2. [assumption]      │ 🟡Med  │ 🟡Med  │ [ ] Yes │        │
│ │ 3. [assumption]      │ 🟡Med  │ 🔴High │ [ ] Yes │        │
│ │ 4. [assumption]      │ 🟢Low  │ 🟡Med  │ [ ] No  │        │
│ │ 5. [assumption]      │ 🟢Low  │ 🟢Low  │ [ ] No  │        │
│ └──────────────────────┴────────┴────────┴─────────┘        │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: Validate #1, #2, #3 before proceeding │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ Validate: [ ] #1  [ ] #2  [ ] #3  [ ] #4  [ ] #5            │
│ [ ] Skip validation - proceed with risk                     │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-2-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-2-card.md`

---

### Format 2: HTML Risk Matrix
Interactive 2×2 matrix (Risk vs Impact) with color-coded assumption cards, hover for details

### Format 3: Assumption Stack Rank
Prioritized markdown list: highest-risk first, with validation method for each

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 3.**

After AI generates output:
1. **Review** the assumptions and risk ratings
2. **Decide** which assumptions to validate (or skip validation)
3. **Confirm** by telling AI: `"Step 2 decision: [your choice]"`

**Example confirmations:**
- "Step 2 decision: Validate #1, #2, #3"
- "Step 2 decision: Skip validation, proceed with risk"
- "Step 2 decision: Add assumption #6 about X"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 3
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 3

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

---
description: Generate 3-5 problem framings with root causes and solution directions
---

## Input

**Required:** Problem statement, User context, Personas
**Optional:** Constraints, Scope document

📎 Attach file OR paste inline below

---

## Command

Reframe the current problem in 3-5 distinct ways. Each framing should:
- Imply a different root cause
- Suggest different solution directions
- Be stated as a single sentence capturing the core issue

For each framing, specify:
- Root cause
- Solution direction
- Which user persona this resonates with most

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
│ CR-ID: ________            Step: 1-Reframe Problem          │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Original request: [user's raw request]                      │
├─────────────────────────────────────────────────────────────┤
│ 🔄 PROBLEM FRAMINGS                                         │
│ ┌───────────────┬───────────────┬───────────────┐           │
│ │ A: [framing]  │ B: [framing]  │ C: [framing]  │           │
│ │ Root: [cause] │ Root: [cause] │ Root: [cause] │           │
│ │ Solve: [how]  │ Solve: [how]  │ Solve: [how]  │           │
│ │ Persona: [X]  │ Persona: [Y]  │ Persona: [Z]  │           │
│ └───────────────┴───────────────┴───────────────┘           │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [A/B/C] because [1 reason]            │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ Selected: [ ] A  [ ] B  [ ] C  [ ] Other: ___               │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-1-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-1-card.md`

---

### Format 2: Decision Matrix (Priority Grid)

A 2D grid mapping each problem framing against **Impact** (Low → High) and **Effort/Feasibility** (Low → High).
This helps designers quickly spot **quick wins** (high impact, low effort) versus **strategic bets** (high impact, high effort).

#### Example Layout

| Effort ↓ / Impact → | Low Impact | Medium Impact | High Impact |
|----------------------|------------|---------------|-------------|
| **Low Effort**       | Framing A  | Framing B     | Framing C   |
| **High Effort**      | Framing D  | Framing E     | Framing F   |

#### Usage Notes
- Place each framing as a card or dot in the grid.
- Add short labels for **root cause** and **persona fit** on each card.
- Designers can visually prioritize which framings to pursue first.
- Works well in workshops or digital whiteboards (Figma, Miro, MURAL).

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 2.**

After AI generates output:
1. **Review** the Decision Card and problem framings
2. **Make decision** by selecting one or more framings
3. **Confirm** by telling AI: `"Step 1 decision: [your choice]"`

**Example confirmations:**
- "Step 1 decision: Accept framing A"
- "Step 1 decision: Accept A and E"
- "Step 1 decision: Reject all, add new framing F"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 2
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 2

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation


---
description: Analyze benefits, costs, and risks per approach
---

## Input

**Required:** Solution approaches, User segments
**Optional:** Evaluation criteria (from step 4)

📎 Attach file OR paste inline below

---

## Command

For each solution approach, analyze:

**Primary benefit:** What's the main value delivered?

**Main cost or risk:** What's the biggest downside?

**User types who benefit:** List specific user segments with checkmarks

**User types who may suffer:** List specific user segments with X marks

**Risk scenario:** Describe one concrete failure case

If evaluation criteria provided, include a comparison matrix scoring all approaches on those criteria. Otherwise, use default dimensions: Effort, Clarity, Accuracy, Trust, Control.

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
│ CR-ID: ________            Step: 6-Solution Tradeoffs       │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Analyzing: [selected solution from Step 5]                  │
├─────────────────────────────────────────────────────────────┤
│ ⚖️ TRADEOFF ANALYSIS                                        │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ ✅ BENEFITS (what we gain)                          │     │
│ │ • [benefit 1]                                       │     │
│ │ • [benefit 2]                                       │     │
│ ├─────────────────────────────────────────────────────┤     │
│ │ 💰 COSTS (what we pay)                              │     │
│ │ • [cost 1]                                          │     │
│ │ • [cost 2]                                          │     │
│ ├─────────────────────────────────────────────────────┤     │
│ │ ⚠️ RISKS (what could go wrong)                      │     │
│ │ • [risk 1] → Mitigation: [how]                      │     │
│ │ • [risk 2] → Mitigation: [how]                      │     │
│ └─────────────────────────────────────────────────────┘     │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Proceed/Reconsider] because [reason] │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Accept tradeoffs  [ ] Reconsider solution  [ ] Mitigate │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-6-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-6-card.md`

---

### Format 2: Trade-off Comparison Table
Markdown table: Approach | Primary Benefit | Main Risk | Best For | Worst For

### Format 3: HTML Trade-off Matrix
Expandable table with benefit/risk/impact per approach, sortable columns

### Format 4: SVG Heat Map
Grid showing approach × persona fit with color intensity, hover for risk scenarios

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 7.**

After AI generates output:
1. **Review** the trade-off analysis (benefits, costs, risks)
2. **Decide** to accept trade-offs, reconsider solution, or add mitigations
3. **Confirm** by telling AI: `"Step 6 decision: [your choice]"`

**Example confirmations:**
- "Step 6 decision: Accept trade-offs"
- "Step 6 decision: Reconsider, risk too high"
- "Step 6 decision: Accept with mitigation for risk #2"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 7
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 7

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

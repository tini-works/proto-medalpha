---
description: Create testable if-then-for-because hypotheses
---

## Input

**Required:** High-risk assumptions, Target metric, User segment
**Optional:** Validated assumptions, Research insights

📎 Attach file OR paste inline below

---

## Command

Based on the validated assumptions, form a testable hypothesis using this structure:

**If** [we implement this specific solution/change]
**then** [this measurable outcome will occur]
**for** [this specific user segment]
**because** [this is the underlying mechanism/insight]

Requirements:
- The outcome must be measurable (include target metric and threshold)
- The user segment must be specific (reference persona if available)
- The "because" must connect assumptions to the expected outcome
- State what success looks like numerically (e.g., "20%+ increase")

Also provide:
- **Supporting assumptions:** Which 2-3 key assumptions does this depend on?
- **Research insight:** What evidence supports the "because"?
- **Falsification criteria:** What result would prove this wrong?

If multiple strong hypotheses emerge, rank them by:
1. **Assumptions solved:** How many high-risk assumptions does this validate?
2. **Impact potential:** What's the upside if true?
3. **Confidence level:** How strong is the supporting evidence?
4. **Speed to validate:** How quickly can we test and learn?

---

## Output Format (choose one)

### Format 1: Decision Card Recommended

One-page summary card optimized for:
- 30-second scan by managers
- Clear decision checkboxes
- AI recommendation with rationale
- Decision history tracking

**Use when:** Need quick approval, tracking decisions, or scaling across many CRs.

```
┌─────────────────────────────────────────────────────────────┐
│ CR-ID: ________            Step: 3-Form Hypothesis          │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Testing assumption: [from Step 2]                           │
├─────────────────────────────────────────────────────────────┤
│ 🧪 HYPOTHESIS                                               │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ IF [we do this]                                     │     │
│ │ THEN [this outcome]                                 │     │
│ │ FOR [this user segment]                             │     │
│ │ BECAUSE [this reason]                               │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
│ 📏 SUCCESS METRIC: [metric] → Target: [threshold]           │
│ 🔬 VALIDATION: [method]                                     │
│ ❌ FALSIFICATION: [what proves it wrong]                    │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Accept/Refine] because [reason]      │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Accept hypothesis  [ ] Refine  [ ] Reject & restart     │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-3-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-3-card.md`

---

### Format 2: Mermaid Validation Tree
Decision tree showing: Hypothesis → Test → (if true → next step / if false → pivot)

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 4.**

After AI generates output:
1. **Review** the hypothesis(es) and validation plan
2. **Decide** which hypothesis to accept, defer, or reject
3. **Confirm** by telling AI: `"Step 3 decision: [your choice]"`

**Example confirmations:**
- "Step 3 decision: Accept hypothesis A only"
- "Step 3 decision: Accept A and B"
- "Step 3 decision: Reject, try different approach"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 4
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 4 (or Gate 4a if enabled)

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation


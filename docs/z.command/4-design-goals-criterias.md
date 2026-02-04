---
description: Define 5 evaluation criteria covering desirability, feasibility, and viability
---

## Input

**Required:** Selected hypothesis (from step 3), User risk level, Primary user goal, System stage
**Optional:** Constraints, Stakeholder priorities

📎 Attach file OR paste inline below

---

## Command

Based on your hypothesis, suggest 5 evaluation criteria that will guide solution development and design goals.

**Purpose:** These criteria will be used to:
- Generate targeted solutions in step 5 (solution approaches)
- Evaluate and compare trade-offs in step 6 (solution tradeoffs)

**Three Dimensions:** Ensure criteria cover all aspects:
- **Desirability** (users want it) - Does it solve the user problem?
- **Feasibility** (we can build it) - Can we implement with available resources?
- **Viability** (business can sustain it) - Is it financially sustainable?

**Type Badge Mapping:**
- **Desirability** uses 3 badges (priority levels):
  - 🔴 Must-have = Can't ship without this
  - 🟡 Should-have = Core to user success
  - 🟢 Could-have = Improves quality
- **Feasibility** uses 1 badge:
  - 🔵 Feasibility = Can we build it?
- **Viability** uses 1 badge:
  - 🟣 Viability = Can business sustain it?

*Note: Weight (1-5) shows priority. Two 🟡 criteria can have different weights (5 vs 3).*

Follow this selection framework:

### Step 1: Identify Must-have Criteria (1)
Based on **User Risk** - what can't we ship without?
- High risk (payment, data deletion) → Accuracy, Trust, Error Recovery
- Medium risk (settings, configuration) → Clarity, Control
- Low risk (browsing content) → Speed, Effort

### Step 2: Select Should-have Criteria (2)
Based on **Primary User Goal** - what's core to user success?
- Do it fast → Speed, Effort
- Understand & decide correctly → Clarity, Accuracy
- Control the system → Control
- Feel confident → Trust
- Learn & explore → Learnability

### Step 3: Add System-Level + Feasibility + Viability (2)
Based on **System Stage** and **Constraints** - what ensures we can build AND sustain this?

**Choose 1 Feasibility:**
- **Implementation Complexity** - How hard to build? (story points, dev time)
- **Technical Risk** - Dependencies on unproven tech?
- **Maintenance Burden** - Ongoing engineering cost?

**Choose 1 Viability:**
- **Cost Efficiency** - Infrastructure or operational costs?
- **Business Impact** - Revenue, retention, or strategic value?
- **Scalability** - Can it handle 10x growth without linear cost?

### Step 4: Validate Selection
For each criterion, answer:
- Can you explain this to PM/stakeholders?
- If removed, what risk occurs?
- Is it measurable/comparable?

### Master Criteria List (choose from):

**Desirability - Efficiency:**
- Speed
- Effort

**Desirability - Understanding:**
- Clarity
- Learnability

**Desirability - Safety & Trust:**
- Trust
- Accuracy
- Error Recovery

**Desirability - User Agency:**
- Control

**Desirability - System Quality:**
- Consistency
- Accessibility
- Emotional Impact

**Feasibility:**
- Implementation Complexity
- Technical Risk
- Team Capability
- Maintenance Burden
- Time to Build

**Viability:**
- Cost Efficiency
- Business Impact
- Scalability (cost at scale)
- Competitive Advantage
- Strategic Alignment

### Output Requirements:

Present as a **concise table** for quick scanning:

| Criterion | Type | Weight | Why Essential | How to Measure |
|-----------|------|--------|---------------|----------------|
| [name] | [badge] | [1-5] | [context factor] | [target/threshold] |

Include **one-sentence summary**:
"Prioritize [top 3] constrained by [feasibility] and [viability]."

**Example:**
| Criterion | Type | Weight | Why Essential | How to Measure |
|-----------|------|--------|---------------|----------------|
| Speed | 🔴 Must-have | 5 | Hypothesis: 60s→5s | Target: &lt;50ms |
| Effort | 🟡 Should-have | 5 | Primary goal: Do it fast | Target: 2 taps |
| Clarity | 🟡 Should-have | 4 | Users abandon if confused | 9/10 understand |
| Implementation Complexity | 🔵 Feasibility | 4 | MVP: 1 week limit | Target: &lt;5 story points |
| Cost Efficiency | 🟣 Viability | 4 | MVP: No budget | Target: $0 incremental |

**Summary:** "Prioritize Speed + Effort + Clarity constrained by &lt;1 week build and $0 cost."

**Golden Rule:** "If missing, users (or business) pay the price."

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
│ CR-ID: ________            Step: 4-Design Goals Criteria      │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Evaluating solutions for: [problem from Step 1]             │
├─────────────────────────────────────────────────────────────┤
│ 📊 EVALUATION CRITERIA (5 max)                              │
│ ┌─────────────────────────┬────────┬──────────────────┐     │
│ │ Criterion               │ Weight │ Type             │     │
│ ├─────────────────────────┼────────┼──────────────────┤     │
│ │ 1. [criterion]          │ 5      │ 🔴 Must-have     │     │
│ │ 2. [criterion]          │ 5      │ 🟡 Should-have   │     │
│ │ 3. [criterion]          │ 4      │ 🟡 Should-have   │     │
│ │ 4. [criterion]          │ 4      │ 🔵 Feasibility   │     │
│ │ 5. [criterion]          │ 4      │ 🟣 Viability     │     │
│ └─────────────────────────┴────────┴──────────────────┘     │
│ Coverage: Desirability ✅ Feasibility ✅ Viability ✅        │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Accept/Adjust] because [reason]      │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Accept criteria  [ ] Adjust weights  [ ] Add/Remove     │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-4-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-4-card.md`

---

### Format 2: Markdown Table

Save to: `outputs/4-design-goals-criterias.md`

```markdown
# Design Goals Criteria: [Feature Name]

| Criterion | Type | Weight | Why Essential | How to Measure |
|-----------|------|--------|---------------|----------------|
| [criterion 1] | [badge] | [1-5] | [context] | [target] |
| [criterion 2] | [badge] | [1-5] | [context] | [target] |
| [criterion 3] | [badge] | [1-5] | [context] | [target] |
| [criterion 4] | [badge] | [1-5] | [context] | [target] |
| [criterion 5] | [badge] | [1-5] | [context] | [target] |

**Summary:** Prioritize [top 3] constrained by [feasibility + viability].

## Scoring Template (for Step 7)

| Criterion | Weight | Solution A | Solution B | Solution C | Solution D |
|-----------|--------|------------|------------|------------|------------|
| [criterion 1] | 5 | | | | |
| [criterion 2] | 5 | | | | |
| [criterion 3] | 4 | | | | |
| [criterion 4] | 4 | | | | |
| [criterion 5] | 4 | | | | |
| **Total** | **22** | | | | |
```

**Type badges:**
- 🔴 Must-have (Desirability)
- 🟡 Should-have (Desirability)
- 🟢 Could-have (Desirability)
- 🔵 Feasibility
- 🟣 Viability

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 5.**

After AI generates output:
1. **Review** the evaluation criteria and weights
2. **Decide** to accept, adjust weights, or add/remove criteria
3. **Confirm** by telling AI: `"Step 4 decision: [your choice]"`

**Example confirmations:**
- "Step 4 decision: Accept criteria as-is"
- "Step 4 decision: Increase Speed weight to 5, reduce Clarity to 3"
- "Step 4 decision: Add Accessibility criterion"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 5
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 5

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

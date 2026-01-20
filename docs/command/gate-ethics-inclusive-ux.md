---
description: Review cognitive load, dark patterns, inclusion, and wellbeing trade-offs
---

## Input

**Required:** UX flows, wireframes, or feature concept from Step 9
**Optional:** Visual mockups, interaction specs, copy

📎 Attach UX flow files OR reference CR folder

---

## Command

Act as a senior product & design reviewer with strong expertise in ethics, human-centered design, and wellbeing-focused systems.

Evaluate the provided UX using the Ethics & Wellbeing Design Gate below.

**Be direct, concrete, and critical. Avoid vague moral language — focus on real design risks and decisions.**

### 1. Cognitive & Emotional Load

- Can a first-time user understand the core value within 10 seconds? Why / why not?
- Where does the design create information, decision, or emotional overload?
- Is progressive disclosure used effectively, or is everything exposed too early?
- Are defaults set to "good enough" for wellbeing, or do they push users toward maximum usage?

👉 **Call out specific screens, moments, or interactions.**

### 2. Manipulation & Dark Patterns

- Is opt-out as visible and easy as opt-in?
- Does any copy, visual emphasis, or interaction rely on fear, guilt, urgency, or FOMO?
- Are there hidden options, misleading affordances, or "soft penalties" for not complying?

👉 **Explicitly label any dark pattern or borderline manipulation you detect.**

### 3. Inclusion & Fairness

- Which user groups might be excluded or disadvantaged (low energy, stress, low digital literacy, accessibility needs)?
- Can a tired or overwhelmed user complete the core task without feeling stupid, slow, or wrong?
- What assumptions does this design make about attention, memory, or motivation?

👉 **Identify at least one "forgotten user".**

### 4. Intentional Trade-offs

- What did the team intentionally choose NOT to build to protect user wellbeing?
- Where does this product sacrifice wellbeing for engagement, growth, or metrics?
- If users overuse or misuse this product, is that treated as a bug or a feature?

👉 **Surface hidden trade-offs and long-term risks.**

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
│ CR-ID: ________            Gate: 4b-Ethics & Inclusive UX   │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Ethics review for: [CR title]                               │
├─────────────────────────────────────────────────────────────┤
│ 🧠 ETHICS & INCLUSION AUDIT                                 │
│ ┌─────────────────────────────────┬────────┬────────┐       │
│ │ Category                        │ Score  │ Notes  │       │
│ ├─────────────────────────────────┼────────┼────────┤       │
│ │ Cognitive load                  │ 🟢/🟡/🔴│        │       │
│ │ Dark pattern check              │ 🟢/🟡/🔴│        │       │
│ │ Accessibility (a11y)            │ 🟢/🟡/🔴│        │       │
│ │ Inclusion (language, culture)   │ 🟢/🟡/🔴│        │       │
│ │ Data privacy                    │ 🟢/🟡/🔴│        │       │
│ │ User wellbeing                  │ 🟢/🟡/🔴│        │       │
│ └─────────────────────────────────┴────────┴────────┘       │
│                                                             │
│ 🚨 FLAGS: [None / List concerns]                            │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [PASS/CAUTION/FAIL] because [reason]  │
├─────────────────────────────────────────────────────────────┤
│ ✅ GATE DECISION                                            │
│ [ ] PASS - no ethical concerns                              │
│ [ ] PASS WITH NOTES - minor concerns documented             │
│ [ ] FAIL - requires design changes                          │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/gate-4b-full.md            │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/gate-4b-card.md`

---

### Format 2: Ethics & Inclusive UX Decision Board

Create a concise Ethics & Inclusive UX Decision Board in markdown format.

Requirements:
- Group findings into 3 sections:
  1. **Top Risks** (list 3–5 with title, screen/flow, issue, impact)
  2. **What Works Well** (list 2–3 positives with evidence)
  3. **Concrete Changes** (prioritized actions with rationale)

- For each risk:
  - Give a short, plain‑language title
  - Identify the exact screen/flow
  - Describe the issue concretely (avoid vague moral language)
  - Explain who is affected and how

- For each change:
  - Use priority levels (P1, P2, P3)
  - State the action clearly
  - Explain why it reduces harm or improves inclusion

- End with:
  - **One Hard Question** the team must answer before shipping
  - **Gate Result** (PASS ✅, CAUTION 🟡, FAIL ❌) with conditions for pass

Format:
- Use markdown headings and bullet points
- Keep each risk/change card compact (4–6 lines)
- Use emojis for clarity (⚠️ risk, ✅ positive, 🔄 change)

---

## Pass/Fail Criteria

**PASS ✅** - No critical ethics issues. Minor concerns documented.
- Core task completable by stressed/tired users
- No dark patterns detected
- Defaults favor user wellbeing
- Inclusion considered for key user groups

**CAUTION 🟡** - Issues found but addressable. Proceed with fixes.
- 1-2 moderate concerns identified
- Clear path to resolution
- No intentional manipulation

**FAIL ❌** - Critical issues block shipping.
- Dark patterns detected (guilt, FOMO, hidden opt-out)
- Core user groups excluded
- Wellbeing sacrificed for engagement metrics
- Deceptive or manipulative copy/design

---

## When to Use

**Use when:**
- User-facing features with UX flows
- Features affecting user behavior or habits
- Features with potential for overuse or misuse
- Wellbeing-sensitive domains (health, finance, social)

**Skip when:**
- Backend-only changes
- Technical infrastructure work
- No user-facing impact

---

## Checklist for Reviewer

Before marking PASS:

- [ ] Reviewed all screens in the flow
- [ ] Considered low-energy / stressed user
- [ ] Checked opt-in vs opt-out visibility
- [ ] Looked for FOMO / guilt / urgency language
- [ ] Identified at least one "forgotten user"
- [ ] Surfaced intentional trade-offs
- [ ] Listed concrete, actionable changes

---

## ⛔ DECISION GATE (Required)

**This gate requires human approval before proceeding.**

After AI generates output:
1. **Review** the ethics audit and inclusion findings
2. **Decide** PASS, PASS WITH NOTES, or FAIL
3. **Confirm** by telling AI: `"Gate 4b decision: [your choice]"`

**Example confirmations:**
- "Gate 4b decision: PASS"
- "Gate 4b decision: PASS WITH NOTES on cognitive load"
- "Gate 4b decision: FAIL, requires design changes"

**AI behavior:**
- ⛔ DO NOT auto-proceed past this gate
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` gate status
- ✅ Then proceed to next step

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

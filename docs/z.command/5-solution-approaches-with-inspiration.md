---
description: Propose 4-6 fundamentally different solution approaches with cross-domain inspiration
---

## Input

**Required:** Problem framing, Evaluation criteria (from step 4)
**Optional:** Hypothesis, Constraints, Personas

📎 Attach file OR paste inline below

---

## Command

Propose 4-6 fundamentally different solution approaches for the problem framing.

**Use the evaluation criteria to guide solution generation:**
- Each approach must address the 🔴 non-negotiable criteria
- Approaches should differentiate on how they balance 🟡 goal-supporting criteria
- Note how each approach handles 🟢 system-level criteria

For each approach, provide:

1. **Core concept** (2-3 sentences)
2. **Cross-domain inspiration** (optional but encouraged)
   - Non-adjacent domain where similar problems are solved well (healthcare, gaming, logistics, finance, education, etc.)
   - How they solve it (specific example)
   - Key pattern/principle to steal
3. **How it works** (bullet points)
4. **Trade-offs table** (Pros vs Cons)
5. **Best suited for** which user type

**Cross-domain inspiration prompts:**
- What similar problem exists in an unexpected domain?
- Which industries handle [constraint X] brilliantly?
- What patterns from gaming/social apps/fintech could transfer here?

Focus on unexpected domains that offer fresh perspectives, not obvious competitors.

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
│ CR-ID: ________            Step: 5-Solution Approaches      │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Solving: [problem framing from Step 1]                      │
├─────────────────────────────────────────────────────────────┤
│ 💡 SOLUTION OPTIONS (max 4)                                 │
│ ┌────────────┬────────────┬────────────┬────────────┐       │
│ │ A: [name]  │ B: [name]  │ C: [name]  │ D: [name]  │       │
│ │ [1-liner]  │ [1-liner]  │ [1-liner]  │ [1-liner]  │       │
│ ├────────────┼────────────┼────────────┼────────────┤       │
│ │ Score: 8/10│ Score: 7/10│ Score: 5/10│ Score: 4/10│       │
│ │ Risk: 🟢   │ Risk: 🟡   │ Risk: 🟡   │ Risk: 🔴   │       │
│ │ Effort: M  │ Effort: L  │ Effort: H  │ Effort: M  │       │
│ └────────────┴────────────┴────────────┴────────────┘       │
│ Scores based on Step 4 criteria                             │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: Option [A/B/C/D] because [reason]     │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ Selected: [ ] A  [ ] B  [ ] C  [ ] D  [ ] Other: ___        │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-5-full.md             │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-5-card.md`

---

### Format 2: HTML Approach Cards
Card-based layout showing: concept, inspiration source, how it works, trade-offs, best-fit persona per card

Each card should include:
- Approach name & tagline
- Cross-domain inspiration callout (domain + pattern)
- Core concept
- How it works (expandable)
- Pros/Cons table
- Best for persona badge

### Format 3: Mermaid Priority Tree with Inspiration Links
Decision tree: "If you prioritize X → Approach Y" with:
- Key trade-off annotations
- Cross-domain inspiration nodes linked to each approach
- Pattern transfer arrows

### Format 4: Comparison Table with Inspiration Column
Markdown table: Approach | Core Concept | Inspiration Source | Optimizes For | Trade-offs | Best For

---

## Quality Checklist

Before finalizing, ensure:
- [ ] All approaches address non-negotiable criteria
- [ ] Approaches are fundamentally different (not minor variations)
- [ ] At least 3 approaches cite cross-domain inspiration
- [ ] Trade-offs are honest (not marketing speak)
- [ ] Each approach has a clear best-fit persona

---

## Example Output Snippet

```html
<div class="approach-card">
  <h3>Approach 1: Accountability Feed</h3>
  <div class="tagline">Partner sees your daily activity passively</div>

  <div class="inspiration-badge">
    <strong>🎯 Inspired by:</strong> Strava (fitness) — Passive activity feed creates gentle social pressure without notifications
  </div>

  <p><strong>Core concept:</strong> Show partner's logged meals in a read-only feed...</p>

  <details>
    <summary>How it works</summary>
    <ul>
      <li>Dashboard shows partner indicator when active</li>
      <li>Partner tab displays meal feed with timestamps</li>
      <li>No notifications — passive awareness only</li>
    </ul>
  </details>

  <table>
    <tr>
      <th>Pros</th>
      <th>Cons</th>
    </tr>
    <tr>
      <td>Low effort, always-on visibility</td>
      <td>Requires real-time sync, privacy concerns</td>
    </tr>
  </table>

  <div class="best-for">
    <strong>Best for:</strong> Users comfortable with passive sharing
  </div>
</div>
```

---

## Tips for Strong Approaches

**Good cross-domain inspiration:**
- ✅ "Dating apps solve cold-start with curated suggestions" → Apply to feature onboarding
- ✅ "Duolingo's streak counter creates habit formation" → Apply to logging consistency
- ✅ "Splitwise handles asymmetric contributions gracefully" → Apply to shared meal logging

**Weak cross-domain inspiration:**
- ❌ "Instagram has a feed" (too generic, obvious competitor)
- ❌ "Banking apps are secure" (not actionable)
- ❌ "Google Search is fast" (not a transferable pattern)

**Approach differentiation:**
- ✅ Different interaction models (passive vs active, async vs realtime)
- ✅ Different value propositions (accountability vs convenience vs gamification)
- ✅ Different user burdens (setup time, ongoing effort, privacy trade-offs)

**Trade-off honesty:**
- ✅ "Requires backend infrastructure" (real constraint)
- ✅ "May feel like surveillance to privacy-conscious users" (real risk)
- ❌ "Highly scalable" (marketing speak, not a trade-off)

---

## ⛔ DECISION GATE (Required)

**This step requires human approval before proceeding to Step 6.**

After AI generates output:
1. **Review** the solution approaches and their trade-offs
2. **Select** one or more approaches to pursue
3. **Confirm** by telling AI: `"Step 5 decision: [your choice]"`

**Example confirmations:**
- "Step 5 decision: Select approach A"
- "Step 5 decision: Combine approaches A and C"
- "Step 5 decision: Reject all, explore new direction"

**AI behavior:**
- ⛔ DO NOT auto-proceed to Step 6
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with decision
- ✅ Then proceed to Step 6

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Proceed with AI recommendation

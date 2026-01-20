---
description: Generate complete design handoff with decision rationale, implementation guidance, and technical specifications
---

## Input

**Required:**
- Problem framing (Step 1)
- Key assumptions (Step 2)
- Hypothesis (Step 3)
- Solution approaches (Step 5)
- Trade-off analysis (Step 6)
- Scope and success metrics (Step 8)
- UX interaction flows (Step 9)
- Implementation spec (Step 10)

**Optional:**
- Design Goals criteria (Step 4)
- All workflow outputs (Steps 1-10)
- Figma links, prototype URLs
- Known constraints or blockers

📎 Attach file OR paste inline below

---

## Command

Generate a comprehensive design handoff document that serves as the complete engineering handoff with decision context, implementation guidance, and technical specifications.

**Structure:** Three-part document with progressive disclosure:
1. **Executive Summary** (5-min read) - For engineers and stakeholders
2. **Design Decision Details** (full context) - For those needing depth
3. **Technical Implementation Details** (complete specs) - For developers building the feature

Use direct language. No jargon. Be specific with numbers and consequences.

---

## Part 1: Executive Summary (Handoff Brief)

### 1. Problem We're Solving
In 2-3 sentences:
- What's the user pain point?
- Who experiences it?
- Why are we building this now?

### 2. What We're Building
In 3-5 bullet points:
- Core functionality (what the user can do)
- Key user flows (how they do it)
- Success criteria (how we know it works)

### 3. Intentional Decisions
List 3-5 design choices that might seem odd but are deliberate:

Format:
- **[Decision]**: [Why we made it] - [Evidence or rationale]

Example:
- **No undo button**: Users can delete manually if needed. Testing showed <5% regret rate, keeps UI simple.
- **5-second delay**: Prevents accidental shares. User feedback from 8 interviews showed preference for confirmation.

### 4. NOT Included
Be explicit about what we're NOT building:

Format:
- **[Deferred feature]**: [Why deferred] - [When we'll reconsider]

Example:
- **Bulk sharing**: Validate single-share works first. Add if adoption >30% in first month.
- **Edit shared meal**: Adds complexity, low user demand. Revisit if >10 feedback mentions.

### 5. UX Principles to Preserve
List 3-5 non-negotiable UX requirements:

Format:
- **[Principle]**: [Why it matters] - [Specific target]

Example:
- **Action completes <50ms**: Users abandon if perceived as slow. localStorage write is instant.
- **Always show feedback**: Every tap must have visible response. No silent actions.
- **Mobile-first**: 80% of usage is mobile. Desktop is secondary.

### 6. Open Questions & Risks

**Questions:**
- [Question] - *Resolve with:* [Who/How/By when]

**Risks:**
- **[Risk]** - Likelihood: [Low/Med/High] - Impact: [Low/Med/High]
  - Mitigation: [Specific plan]
  - Fallback: [If mitigation fails]

---

## Part 2: Design Decision Details (Full Context)

### 7. Key Assumptions
Extract from Step 2:

Format:
- **[Assumption]** - Risk: [High/Med/Low] - Status: [Validated/Unvalidated]
  - If wrong: [Consequence]
  - Validation plan: [How we'll test]

### 8. Hypothesis
From Step 3:

**IF** [action]
**THEN** [outcome]
**FOR** [persona]
**BECAUSE** [reason]

**Success looks like:** [Specific metric/observation]
**Failure looks like:** [Specific metric/observation]

### 9. Options Explored
From Step 5:

List 3-6 solution approaches considered:

Format:
- **[Option name]**: [1-2 sentence description]
  - Pros: [Key benefits]
  - Cons: [Key drawbacks]
  - Score: [X/100 on design goals criteria if available]

### 10. Chosen Direction & Rationale
From Step 6:

**We're pursuing:** [Option name]

**Reasons:**
1. [Key reason with evidence]
2. [Key reason with evidence]
3. [Key reason with evidence]

**What makes it better than alternatives:**
- vs [Option A]: [Specific advantage]
- vs [Option B]: [Specific advantage]

### 11. Trade-offs
From Step 6:

**What we gain:**
- [Benefit 1] - [Quantified if possible]
- [Benefit 2] - [Quantified if possible]

**What we compromise:**
- [Trade-off 1] - [Why acceptable]
- [Trade-off 2] - [Why acceptable]

**What remains uncertain:**
- [Uncertainty 1] - [How we'll handle]
- [Uncertainty 2] - [How we'll handle]

### 12. Success Metrics
From Step 8:

**Primary metric:** [Main metric we're optimizing for]
**Target:** [Specific number/threshold]

**Leading indicators:**
- [Early signal 1] - [Target]
- [Early signal 2] - [Target]

**Guardrails:**
- [Metric that must not regress] - [Minimum acceptable]
- [Metric that must not regress] - [Minimum acceptable]

**Measurement plan:**
- When: [How often we'll measure]
- How: [Tool/method]
- Decision point: [When we'll evaluate success/failure]

### 13. Scope Boundaries
From Step 8:

**In scope - Phase 1:**
- [Feature 1] - [Why essential]
- [Feature 2] - [Why essential]

**Out of scope - Deferred:**
- [Feature A] → Phase 2 - [Why deferred]
- [Feature B] → Never - [Why excluded]

**Scope rationale:** [Why this boundary makes sense strategically]

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
│ CR-ID: ________            Step: 11-Design Handoff          │
│ Status: 🟡 PENDING         Date: ____________               │
├─────────────────────────────────────────────────────────────┤
│ 📋 SUMMARY                                                  │
│ Handoff for: [CR title]                                     │
├─────────────────────────────────────────────────────────────┤
│ 📦 HANDOFF PACKAGE                                          │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Artifact                       │ Status             │     │
│ ├────────────────────────────────┼────────────────────┤     │
│ │ Problem statement              │ ✅ Complete        │     │
│ │ Decision rationale             │ ✅ Complete        │     │
│ │ Implementation spec            │ ✅ Complete        │     │
│ │ User flows                     │ ✅ Complete        │     │
│ │ Success metrics                │ ✅ Complete        │     │
│ │ Edge cases                     │ ⚠️ Partial         │     │
│ │ Test scenarios                 │ ⚠️ Partial         │     │
│ └────────────────────────────────┴────────────────────┘     │
│                                                             │
│ 📎 Full package: /artifacts/[CR]/handoff/                   │
├─────────────────────────────────────────────────────────────┤
│ 👉 AI RECOMMENDATION: [Ready/Missing items] because [why]   │
├─────────────────────────────────────────────────────────────┤
│ ✅ DECISION                                                 │
│ [ ] Approve handoff  [ ] Complete missing  [ ] Defer        │
│ Notes: _______________________________________________      │
│ Decided by: ________________  Date: ______________          │
├─────────────────────────────────────────────────────────────┤
│ 🔗 Full details: /artifacts/[CR]/step-11-full.md            │
└─────────────────────────────────────────────────────────────┘
```

**Output file:** `artifacts/[CR]/step-11-card.md`

---

### Format 2: Markdown Handoff Document

Complete markdown document saved to:
```
outputs/10b-design-handoff.md
```

**Frontmatter:**
```yaml
---
workflow: [TASK_TYPE]
date: [ISO_DATE]
status: Ready for Handoff
cr_id: [CR_ID if applicable]
feature: [FEATURE_NAME]
step: 10b-design-handoff
---
```

**Structure:**
```markdown
# Design Handoff: [FEATURE_NAME]

## Executive Summary

### Problem We're Solving
[2-3 sentences]

### What We're Building
- [Bullet 1]
- [Bullet 2]
- [Bullet 3]

### Intentional Decisions
- **[Decision]**: [Why]
- **[Decision]**: [Why]

### NOT Included
- **[Deferred]**: [Reason]
- **[Deferred]**: [Reason]

### UX Principles to Preserve
- **[Principle]**: [Why]
- **[Principle]**: [Why]

### Open Questions & Risks

#### Questions
- [Q1] - *Resolve with:* [Who/How]

#### Risks
- **[Risk]** - L: [X] - I: [Y]
  - Mitigation: [Plan]

---

## Design Decision Details

<details>
<summary>Click to expand full context and rationale</summary>

### Key Assumptions
[Full list with validation plans]

### Hypothesis
[Complete hypothesis statement]

### Options Explored
[All approaches with pros/cons]

### Chosen Direction & Rationale
[Why we chose this option]

### Trade-offs
[What we gain, compromise, uncertainty]

### Success Metrics
[Detailed metrics and measurement plan]

### Scope Boundaries
[Complete scope with rationale]

</details>
```

### Format 3: HTML Design Handoff

Styled document with expandable sections:
```
outputs/10b-design-handoff.html
```

Features:
- Executive summary above the fold (no scroll)
- Click to expand detailed sections
- Color-coded: green (building), red (not included), yellow (risks)
- Print-friendly styles
- Shareable link

---

## Writing Guidelines

### ✅ Do:
- **Be specific:** "5-second timeout" not "short timeout"
- **Quantify:** "Reduces from 5 to 2 taps" not "fewer taps"
- **State consequences:** "If X, then Y will happen"
- **Own uncertainty:** "We don't know if users will..."
- **Use active voice:** "We're building X" not "X will be built"
- **Show evidence:** "Testing with 8 users showed..." not "Users prefer..."

### ❌ Don't:
- **Buzzwords:** "synergy", "leverage", "paradigm shift", "revolutionary"
- **Vague language:** "improve experience", "optimize engagement", "better UX"
- **Hide trade-offs:** "This solution has no downsides"
- **Passive voice:** "It was decided that..." (who decided?)
- **Assume knowledge:** Define terms the first time
- **Marketing speak:** "game-changing", "best-in-class", "seamless"

---

## Example Output

```markdown
# Design Handoff: Shared Meal Logging

## Executive Summary

### Problem We're Solving
Couples eating together log the same meal twice. This takes 60 seconds and causes drop-off. 40% of couple accounts stop logging within 2 weeks due to this friction. We're building this now because retention data shows couples are our highest-value segment (3x lifetime value vs solo users).

### What We're Building
- Share button on meal detail view (appears immediately after logging)
- Partner selector modal (shows household members with avatars)
- One-tap meal duplication to partner's log with attribution tag
- Success: 30% of couple accounts use share feature weekly within 2 weeks

### Intentional Decisions
- **Manual share, no auto-share**: Preserves individual control, prevents accidental sharing. User testing with 8 couples showed 70% strongly prefer explicit control over convenience.
- **No undo after 5 seconds**: Keeps implementation simple (no sync conflicts). Testing showed <5% regret rate. Users who regret can delete manually.
- **Duplicate full meal, no portion adjustment**: Validates core behavior first. Portion splitting adds complexity. Will add if >10 user feedback mentions in first month.
- **Share from today's log only**: Prevents bulk historical sharing which could corrupt data. Intentional limitation to validate single-meal flow.

### NOT Included
- **Bulk sharing (multiple meals)**: Need to validate single-share works first. Add in v2 if adoption >30%.
- **Shared meal history view**: Low value for MVP. Users care about today's log. Revisit if >15 user requests.
- **Edit shared meal from one log**: Both users must edit independently. Prevents sync conflicts, keeps data model simple.
- **Meal templates**: Different feature scope. Deferred to separate CR (would add 2-3 weeks to timeline).
- **Portion size adjustment**: Assumes identical portions for MVP. Add if >10 feedback mentions.

### UX Principles to Preserve
- **Share completes <50ms**: localStorage write is instant. Any perceived delay feels broken. Trang persona (busy intern) abandons if >30s.
- **Mobile-first (320px min width)**: 80% of usage is mobile based on analytics. Desktop is secondary.
- **Every action shows feedback**: Share button → Loading state → Toast → Modal close. No silent actions. Testing showed users click 3x if no feedback.
- **Touch targets ≥44x44px**: iOS accessibility requirement. Share button must be tappable with thumb on mobile.
- **Never block solo logging**: Partner features are additive. User without partner has identical experience as before. No empty states or prompts.

### Open Questions & Risks

#### Questions
- **Should shared meal count toward both users' daily goals?** - *Resolve with:* Product team by end of week (blocks implementation)
- **What if partner deletes the shared meal?** - *Resolve with:* Engineering decision (no sync for v1, document in tech spec)
- **How to handle if partner hasn't logged in 7+ days?** - *Resolve with:* Design team (show warning in selector or allow anyway?)

#### Risks
- **Users forget to share** - Likelihood: Medium - Impact: High
  - Mitigation: A/B test reminder toast 5s after logging ("Want to share with Mai?") with 50% of users
  - Fallback: If adoption <15% after 2 weeks, add persistent share button to meal cards

- **Partner selector slow to load** - Likelihood: Low - Impact: Medium
  - Mitigation: Pre-cache household list on app load. Tested <10ms render time with 5 partners.
  - Fallback: Show skeleton loader if >100ms (shouldn't happen with localStorage)

- **Users expect portions to differ** - Likelihood: Medium - Impact: Low
  - Mitigation: Monitor feedback channels. Track mentions of "portion" or "serving size"
  - Fallback: If >10 mentions in first month, prioritize portion adjustment in v2

---

## Design Decision Details

<details>
<summary>Click to expand full context and rationale</summary>

### Key Assumptions

1. **Couples eat together frequently (≥3x/week)** - Risk: High - Status: Unvalidated
   - If wrong: Feature has narrow TAM, low adoption
   - Validation plan: Survey 100 couple accounts, track shared meal frequency in first 2 weeks

2. **Both partners track calories consistently** - Risk: Medium - Status: Unvalidated
   - If wrong: One-sided usage creates guilt/pressure
   - Validation plan: Track paired vs solo logging ratio, qualitative interviews after 2 weeks

3. **Meal portions are identical for both people** - Risk: Low - Status: Partially validated
   - If wrong: Users request portion adjustment immediately
   - Validation plan: Testing with 8 couples showed 75% eat identical portions. Monitor feedback.

4. **Users trust partner to see their food log** - Risk: Medium - Status: Validated
   - If wrong: Privacy concerns kill adoption
   - Validation plan: User testing showed 85% comfortable with partner visibility (couples only)

5. **Household Mode (same device/network) is acceptable for MVP** - Risk: High - Status: Unvalidated
   - If wrong: Narrow market, remote couples can't use feature
   - Validation plan: Ship MVP, validate demand before building WebRTC remote sync

### Hypothesis

**IF** we let users share a logged meal with one tap
**THEN** couples will log 40% more meals together
**FOR** busy couples like Trang (intern persona)
**BECAUSE** the friction drops from 60 seconds (double logging) to 5 seconds (tap share)

**Success looks like:**
- 30% of couple accounts use share feature weekly within 2 weeks
- Average time-to-log for shared meals <10s (down from 60s)
- Paired user retention +15% vs solo users at 30 days

**Failure looks like:**
- <10% of couple accounts use share feature after 4 weeks
- Feature adds complexity but doesn't improve retention
- Users report confusion or accidental sharing

### Options Explored

1. **Copy-to-partner** (CHOSEN)
   - Description: Tap button to duplicate meal to partner's log with attribution
   - Pros: Simple implementation (1 week), preserves individual control, works with existing QuickAdd flow
   - Cons: Manual action required every time, doesn't help with bulk historical data
   - Score: 87/100 on criteria (highest on simplicity + speed)

2. **Shared log view**
   - Description: Both users see combined log, can mark meals as "shared"
   - Pros: More social, shows household nutrition together
   - Cons: Complex data model (2-3 weeks), requires new UI paradigm, unclear ownership
   - Score: 72/100 (high on social but low on implementation complexity)

3. **Auto-share toggle**
   - Description: Enable "always share meals" mode in settings
   - Pros: Zero friction after initial setup
   - Cons: Loses explicit control, risk of accidental sharing, privacy concerns
   - Score: 68/100 (testing showed users distrust auto-share)

4. **Meal templates**
   - Description: Save commonly-shared meals as templates
   - Pros: Faster than searching each time
   - Cons: Different problem (not about sharing), adds UI complexity
   - Score: 54/100 (solves adjacent but different problem)

5. **Household meal tagging**
   - Description: Tag meals as "household" vs "personal" at log time
   - Pros: Explicit intent declaration
   - Cons: Extra step at log time (defeats speed goal), unclear what "household" means
   - Score: 61/100 (adds friction to solve frictionless problem)

### Chosen Direction & Rationale

**We're pursuing: Copy-to-partner**

**Reasons:**
1. **Fastest implementation** (1 week vs 3-4 weeks for shared log). Gets to market 3x faster, validates hypothesis with minimal investment.
2. **Preserves individual control**. Testing with 8 couples showed 70% strongly prefer explicit share action over auto-share. Reduces privacy anxiety.
3. **Works with existing data model**. No breaking changes to logs, no new sync complexity, reuses localStorage architecture.

**What makes it better than alternatives:**
- vs **Shared log view**: Simpler by 3x (no new data model, no UI overhaul). Gets us 80% of value with 20% of work.
- vs **Auto-share toggle**: Testing showed trust issue. Users worry about forgetting toggle is on and accidentally sharing private meals.
- vs **Meal templates**: Solves different problem. Templates help with repeated meals, not shared meals.

### Trade-offs

**What we gain:**
- Fast time-to-market: 1 week implementation vs 3-4 weeks for alternatives
- No breaking changes: Existing users unaffected, no migration needed
- Clear user intent: Every share is explicit, reduces privacy concerns by 40% (testing data)
- Validates core hypothesis: Is sharing valuable? Don't over-invest before validation.

**What we compromise:**
- Manual action required: Users must remember to share each time (risk: forget 50% of the time)
- No bulk historical sharing: Can't retroactively share yesterday's meals (low value, users care about today)
- No shared meal history view: Partner can see meal in their log but no "shared meals" filter
- No portion adjustment: Assumes identical portions (risk: users want different sizes)

**What remains uncertain:**
- Will users remember to share? (Mitigation: A/B test reminder toast)
- What if only one person uses it? (Mitigation: Monitor one-sided usage, qualitative research)
- Do users want to edit shared meals? (Monitor feedback, add edit if >15 mentions)

### Success Metrics

**Primary metric:** 30% of couple accounts use share feature weekly
**Target:** 30% adoption rate within 2 weeks of launch

**Leading indicators:**
- Share button taps: Target 50+ taps per day (100 active couple users × 50% share rate)
- Shared meal count: Target 3 shared meals per week per active couple
- Time-to-share: Target <5s from log completion to share action

**Guardrails:**
- Overall meal logging frequency: Must stay ≥95% of pre-launch baseline
- Solo user logging: Must not decrease (feature is additive, shouldn't affect solo users)
- App performance: Share action must complete <50ms (localStorage constraint)

**Measurement plan:**
- **When:** Track daily for first 2 weeks, then weekly
- **How:** Analytics events (share_button_tap, share_success, share_cancel) + localStorage queries
- **Decision point:** 2 weeks post-launch
  - Success (≥30% adoption): Proceed to v2 features (portion adjust, bulk share)
  - Partial (15-29% adoption): Iterate with A/B tests (reminder toasts, button placement)
  - Failure (<15% adoption): Pause v2, conduct user research to understand why

### Scope Boundaries

**In scope - Phase 1:**
- Share button on meal detail view - Essential for core flow
- Partner selector modal (single-select) - Essential for multi-household
- Duplicate meal to partner's log - Core functionality
- Attribution tag ("From Mai") - Clarifies meal source
- Success toast notification - User feedback requirement
- Household Mode pairing (QR/link) - Required for partner setup

**Out of scope - Deferred to Phase 2:**
- Bulk sharing (select multiple meals) → Add if adoption >30%
- Portion size adjustment → Add if >10 feedback mentions
- Shared meal calendar/history view → Add if users request explicitly
- Edit shared meal across both logs → Complex sync, defer until validated
- Meal splitting (different items per person) → Different feature, separate CR
- Remote partner sync (WebRTC) → Validate local-only first, add if demand proven

**Out of scope - Never:**
- Automatic sharing without user action → Privacy violation based on testing
- Shared nutrition goals (household calorie target) → Different feature, separate CR
- Social features (comments, reactions) → Not in product vision for nutrition tracking

**Scope rationale:**
We're validating the core hypothesis ("does sharing reduce friction?") with minimal complexity. If <10% adoption after 4 weeks, we won't build additional features. If adoption is strong, we have clear v2 roadmap prioritized by user feedback.

</details>

---

## Part 3: Technical Implementation Details

### 14. Design Reference
- **Figma:** [link to design file]
- **Prototype:** [link to interactive prototype]
- **Wireframes:** [attached or linked]
- **Moodboard:** [link if applicable]

### 15. Complete User Flow (Detailed)

Step-by-step implementation guide:

**Action → Response format:**
1. [User action] → [System response] → [Visual feedback] → [Next state]
2. [User action] → [System response] → [Visual feedback] → [Next state]
3. [End state or loop back]

Include timing, animations, and state transitions.

### 16. Information Architecture

```
[Screen/Page Name]
├── [Section]: [Purpose and behavior]
│   ├── [Component/Element]: [Props and states]
│   ├── [Component/Element]: [Props and states]
│   └── [Component/Element]: [Props and states]
├── [Section]: [Purpose and behavior]
│   ├── [Component/Element]: [Props and states]
│   └── [Component/Element]: [Props and states]
└── [Section]: [Purpose and behavior]
```

### 17. Component Inventory

List all components needed for this feature:

| Component | Props | States | Variants | Implementation Notes |
|-----------|-------|--------|----------|---------------------|
| [ComponentName] | [prop list] | default, hover, active, disabled | primary, secondary | [specific notes] |

### 18. Interaction Specifications

| Element | Trigger | Behavior | Timing | Feedback |
|---------|---------|----------|--------|----------|
| [Button/Link] | click/tap | [What happens] | [Duration] | [Visual/haptic] |
| [Input] | focus/blur/change | [What happens] | [Duration] | [Visual/haptic] |
| [Gesture] | swipe/drag/pinch | [What happens] | [Duration] | [Visual/haptic] |

### 19. Validation Rules

| Field | Rule | Error Message | When to Show |
|-------|------|---------------|--------------|
| [Input name] | required | [Message] | On blur/submit |
| [Input name] | format (regex) | [Message] | On blur/submit |
| [Input name] | min/max | [Message] | Real-time |

### 20. State Management & Edge Cases

**Complete edge case matrix:**

| Scenario | Trigger | Expected Behavior | Priority | Error Recovery |
|----------|---------|-------------------|----------|----------------|
| Happy path | [normal flow] | [success state] | P0 | N/A |
| Empty state | [no data] | [empty UI with CTA] | P1 | [how to recover] |
| Error state | [API fail/timeout] | [error UI + retry] | P1 | [retry logic] |
| Loading state | [async operation] | [skeleton/spinner] | P1 | [timeout handling] |
| Boundary | [max items/length] | [pagination/truncate] | P2 | [how to handle] |
| Offline | [no network] | [offline indicator] | P1/P2 | [queue/cache] |

### 21. Out of Scope (Detailed)

Explicit exclusions with reasoning:

| Feature | Why NOT Included | Reconsider When |
|---------|------------------|-----------------|
| [Deferred feature] | [Technical/timeline reason] | [Condition or metric] |
| [Deferred feature] | [User need unclear] | [After X user requests] |
| [Deferred feature] | [Dependency missing] | [When Y is built] |

### 22. Similar Patterns & References

Help engineers understand by referencing existing patterns:

**Similar to existing features:**
- Like [Feature X] but with [difference]
- Uses same [pattern/component] as [Feature Y]

**External references:**
- Strava: [specific pattern to reference]
- Duolingo: [specific behavior to emulate]
- Mobile OS patterns: [iOS/Android convention]

---

## Output Format

### Format 1: Markdown Handoff Document ⭐ Recommended

Complete markdown document saved to:
```
calo-tracker/docs/change-requests/{cr_id}/design-handoff.md
```

</details>
```

---

## Related Steps

| Step | Relationship |
|------|--------------|
| Step 1: Reframe Problem | Provides problem statement |
| Step 2: List Assumptions | Provides key assumptions for validation |
| Step 3: Form Hypothesis | Provides testable hypothesis |
| Step 4: Design Goals Criteria | Provides evaluation criteria for solutions |
| Step 5: Solution Approaches with Inspiration | Provides all options explored |
| Step 6: Solution Tradeoffs | Provides chosen direction and trade-offs |
| Step 7: User Flows | Provides UX principles and flows |
| Step 8: Scope and Metrics | Provides success metrics and scope boundaries |
| Step 9: UX Interactions | Provides interaction patterns and edge cases |
| **Step 10: Implementation Spec** | **Synthesizes all above into technical blueprint** |
| **Step 11: Design Handoff** | **Complete handoff: decisions + context + technical specs + components** |

---

## How to Run

Invoke after all design work is complete (recommended after Step 9 or 11):

```
/10-design-handoff
```

Or ask Claude:

```
"Generate the complete design handoff document"
```

---

## When to Use This Step

**Use when:**
- Handing off to engineering team for implementation
- Presenting to stakeholders for approval
- Need complete decision record for future reference
- Design phase is complete and ready for build

**Skip when:**
- Design is still exploratory (no final decisions yet)
- Building quick prototype (no formal handoff needed)
- Internal experiment (team already has full context)

---

## Benefits

**For engineers:**
- Quick context with executive summary (5 min read)
- Full decision rationale available when needed (expandable)
- Clear on what NOT to build (prevents scope creep)
- UX principles guide trade-off decisions during implementation

**For stakeholders:**
- Understand decisions without reading full docs
- See all options considered (not just final choice)
- Clear view of risks and open questions
- Approve/reject with full context

**For designers:**
- Single source of truth for decisions
- Forces clarity on rationale and trade-offs
- Easy to update as answers emerge
- Serves as "north star" during implementation

**For future team members:**
- Complete decision history in one place
- Understand why choices were made
- See what was intentionally excluded
- Context for iterating or pivoting

---

## ⛔ DECISION GATE (Required)

**This is the final step. Human approval completes the design workflow.**

After AI generates output:
1. **Review** the complete handoff package
2. **Decide** to approve handoff, complete missing items, or defer
3. **Confirm** by telling AI: `"Step 11 decision: [your choice]"`

**Example confirmations:**
- "Step 11 decision: Approve handoff"
- "Step 11 decision: Complete missing edge cases"
- "Step 11 decision: Defer, need more stakeholder input"

**AI behavior:**
- ⛔ DO NOT mark workflow complete without approval
- ⛔ DO NOT assume approval
- ✅ Wait for explicit human decision
- ✅ Update `workflow-session.json` with final decision
- ✅ Mark workflow status as "completed" when approved

**If human says "skip" or "auto-approve":**
- Record as `"decidedBy": "Auto-approved"` in session
- Mark workflow as completed

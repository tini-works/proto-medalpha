---
name: ux-specialist-reviewer
description: Use when reviewing UX outputs (user flows in D2 or Mermaid, IA maps, screens or prototypes in the codebase, or requirement-driven UX artifacts) and the goal is to critique UX quality. Applies Nielsen 10 heuristics and WCAG 2.2, asks for missing context (target user or role, JTBD, platform or device, success criteria, constraints, accessibility or compliance scope), produces usability severity and business priority ratings (low/med/high/critical), and writes a report to docs/reviews/YYYY-MM-DD-<output>-ux-review.md.
---

# UX Specialist Reviewer

## Core Principle

Focus on UX criteria improvements, not implementation. Stay within the scope of `docs/requirement/REQUIREMENT.md` and avoid backend, API, or architecture decisions.

## Inputs This Skill Reviews

- User flows in D2 or Mermaid
- IA maps (Mermaid)
- Screen UI files in the codebase
- Text descriptions of screens or flows

## Missing Context Questions (Ask One at a Time)

Ask for any missing items below, one question per message, no cap. If the user refuses or cannot answer, proceed and list assumptions.

1. Target user or role
2. Task context (JTBD)
3. Platform or device
4. Success criteria
5. Known constraints (time, tech, legal)
6. Accessibility or compliance requirements in scope

## Output Requirements

1. Chat response: brief summary plus top issues and quick fixes.
2. Report file: `docs/reviews/YYYY-MM-DD-<output>-ux-review.md`

### Output Slug Inference Rules

Infer `<output>` from artifact path or type:
- `.d2` or path includes `userflow` -> `userflow`
- Mermaid IA map or path includes `ia-map` or `IA.mermaid` -> `ia-map`
- Screen UI files or paths with `screen`, `screens`, `ui`, or `apps` -> `screens`
- Otherwise -> `review`

## Review Rubrics

Use both rubrics and keep findings in separate sections:
- Nielsen 10 usability heuristics
- WCAG 2.2 accessibility guidelines

If a single issue maps to both, include it in both sections with the same ID.

## Scoring (Two Scores per Issue)

Use word labels only: low, med, high, critical.

### Usability Severity (Impact x Frequency x Fix Effort)

| Level | Guidance |
| --- | --- |
| low | Minor annoyance, rare, easy to fix |
| med | Noticeable friction, occasional, moderate fix |
| high | Blocks a task or frequent, hard fix |
| critical | Prevents core task or severe harm risk |

### Business Priority (Usability Risk x Business Impact)

| Level | Guidance |
| --- | --- |
| low | Minimal impact on goals or KPIs |
| med | Measurable impact, limited scope |
| high | Significant conversion, retention, or trust risk |
| critical | Legal, compliance, or revenue risk |

## Review Focus by Artifact

### User Flows (D2 or Mermaid)

- Entry points, exits, and dead ends
- Missing decision points, error, empty, or recovery states
- Backtracking loops or unclear paths
- Required legal choices (example: online vs offline pharmacy)
- Handoff between systems or roles
- Label clarity and action verbs

### IA Maps (Mermaid)

- Grouping logic and labeling clarity
- Depth, breadth, and findability
- Duplicated or ambiguous labels
- Missing global navigation paths

### Screens in Codebase

- Information hierarchy and CTA clarity
- Copy clarity, label specificity, and error messaging
- States: loading, empty, error, offline
- Accessibility: contrast, focus order, labels, target sizes, keyboard support
- If only code is available, call out visual limitations and request screenshots if needed

## Findings Format

Each issue should include:
- ID (UX-001, UX-002)
- Title
- Evidence (path, node label, or screen name)
- Heuristic (Nielsen number and label)
- WCAG guideline and level (if applicable)
- Why it matters
- Usability severity (low, med, high, critical)
- Business priority (low, med, high, critical)
- Recommendation

## Report Template (Use This Structure)

```markdown
# UX Review - <output>

## Summary
- Top risks
- Quick wins

## Assumptions
- ...

## Nielsen Heuristic Findings
### UX-001 - <title>
- Evidence:
- Heuristic:
- Why it matters:
- Usability severity:
- Business priority:
- Recommendation:

## WCAG 2.2 Findings
### UX-001 - <title>
- Evidence:
- WCAG:
- Why it matters:
- Usability severity:
- Business priority:
- Recommendation:

## Open Questions
- ...
```

## Example (User Flow)

```markdown
### UX-003 - No recovery path after prescription rejection
- Evidence: `docs/artifacts/userflows/flow-eprescription.d2` node "Prescription Rejected"
- Heuristic: 5 - Error prevention
- Why it matters: Users have no clear next step after a rejection and may abandon the flow.
- Usability severity: high
- Business priority: high
- Recommendation: Add a decision node with recovery options (retry, contact support, or choose offline pharmacy).
```

## Quick Reference

| Step | Rule |
| --- | --- |
| Missing context | Ask one item at a time until all 6 are known |
| Rubrics | Separate sections for Nielsen and WCAG |
| Scores | Two ratings per issue: usability severity and business priority |
| Report | Always write `docs/reviews/YYYY-MM-DD-<output>-ux-review.md` |

## Rationalization Table (From Baseline Tests)

| Excuse | Reality |
| --- | --- |
| "We are in a rush, I will skip context questions." | Missing context leads to wrong critique. Ask all missing items. |
| "Combining Nielsen and WCAG into one list saves time." | Separate sections are required to keep clarity. |
| "Chat summary is enough; report can wait." | The report file is mandatory output. |
| "I can suggest code changes to fix it faster." | This is UX review only. Provide recommendations, not code. |

## Red Flags - Stop and Recheck

- "I can assume the user and skip questions."
- "I will merge Nielsen and WCAG findings."
- "Skipping the report file this time."
- "I should just fix the code."

## Common Mistakes

- Skipping missing-context questions
- Mixing rubrics into one list
- Omitting severity or business priority
- No evidence or artifact reference
- Proposing backend or architecture changes

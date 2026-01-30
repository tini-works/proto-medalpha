---
description: Auto-document key outputs from workflow steps 1-11
---

# Real-Time Design Progress

## Purpose

Automatically generate a comprehensive summary document that captures all key outputs, decisions, and insights from steps 1-11 of the design workflow.

---

## Dashboard Template

**IMPORTANT:** Always use the standardized template when creating or updating the dashboard.

**Template location:** `.claude/templates/realtime-design-progress.html`

### Setup Instructions

1. Copy template to outputs (if not exists):
   ```bash
   cp .claude/templates/realtime-design-progress.html outputs/realtime-design-progress.html
   ```

2. Update the `<script id="workflow-state">` JSON with current workflow state

3. The template includes:
   - Left sidebar: Progress bar, SUMMARY menu, Steps with inline Gates
   - Right content: Summary section, Decision Log, Outputs gallery
   - Mermaid.js for diagram rendering
   - Ghost button refresh icon

---

## Command

When invoked, this step will:

1. **Copy dashboard template** from `.claude/templates/` to `outputs/` (if not exists)
2. **Read all output files** from `outputs/` directory
3. **Extract key decisions** from each step
4. **Generate ASCII flow summary** → This becomes the SUMMARY section content (right side)
5. **Update dashboard JSON state** with completedSteps, decisions, outputs, and summary

---

## What Gets Documented

### From Step 1: Problem Reframing
- Selected problem framings
- Root causes identified
- AI roles defined

### From Step 2: Assumptions
- Critical assumptions (HIGH risk)
- Validation methods recommended
- Risk matrix summary

### From Step 3: Hypotheses
- Testable hypotheses (H1-H4)
- Success/failure criteria
- Validation sequence

### From Step 4: Benchmarking Criteria
- 7 evaluation criteria with weights
- Non-negotiable vs goal-supporting vs system-level
- Priority statement

### From Step 5: Solution Approaches with Inspiration
- 4-6 approaches with scores
- Cross-domain inspiration patterns
- Best-fit personas

### From Step 6: Solution Tradeoffs
- Benefits, costs, risks per approach
- Risk mitigation strategies
- Final approach selection rationale

### From Step 7: OOUX & User Flows
- Object inventory (OOUX dot map)
- User flow diagrams (D2/Mermaid)
- Screen list with object mapping

### From Step 8: Scope and Metrics
- In-scope vs out-of-scope boundaries
- Success metrics with targets
- OKR alignment

### From Step 9: UX Interactions
- Interaction patterns and sequences
- Component behavior specs
- Edge case handling

### From Step 10: Implementation Spec
- Component breakdown
- Data model requirements
- API contracts

### From Step 11: Design Handoff
- Final design package
- Developer notes
- QA checklist

---

## Output Formats

### 1. ASCII Flow Summary
Terminal-friendly visual flow of all steps and decisions.

### 2. Markdown Documentation
`outputs/WORKFLOW-SUMMARY.md` - Full documentation with all details.

### 3. Dashboard Update
Updates `realtime-design-progress.html` with latest state.

---

## Auto-Generated Summary Structure

```
╔══════════════════════════════════════════════════════════════════╗
║                    WORKFLOW SUMMARY                               ║
╠══════════════════════════════════════════════════════════════════╣
║ Project: [Project Name]                                          ║
║ Date: [Auto-generated timestamp]                                 ║
║ Steps Completed: [X/11]                                          ║
╚══════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│ PROBLEM FRAMING                                                 │
├─────────────────────────────────────────────────────────────────┤
│ Selected: [Framing names]                                       │
│ AI Roles: [Roles defined]                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ CRITICAL ASSUMPTIONS                                            │
├─────────────────────────────────────────────────────────────────┤
│ [Top 5 assumptions with risk levels]                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ HYPOTHESES                                                      │
├─────────────────────────────────────────────────────────────────┤
│ [H1-H4 with success criteria]                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ SOLUTION APPROACHES                                             │
├─────────────────────────────────────────────────────────────────┤
│ [Top approaches with scores]                                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ KEY INSIGHTS                                                    │
├─────────────────────────────────────────────────────────────────┤
│ [Patterns to steal from competitive landscape]                  │
│ [Transferable insights]                                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ NEXT STEPS                                                      │
├─────────────────────────────────────────────────────────────────┤
│ [Remaining workflow steps]                                      │
│ [Validation priorities]                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## How to Run

Simply invoke:
```
/realtime-design-progress
```

Or ask Claude:
```
"Generate a summary of all workflow outputs so far"
```

---

## Dashboard Integration

This step also updates the real-time dashboard:

1. **Summary Section** - ASCII flow visible at top of dashboard
2. **Decision Log** - All decisions timestamped and linked
3. **Progress Bar** - Shows completion status
4. **Output Gallery** - All visual outputs embedded

### Viewing the Dashboard

```bash
open outputs/realtime-design-progress.html
```

---

## Benefits

### For Designers
- No manual documentation needed
- Always-current project state
- Easy to share with stakeholders

### For Teams
- Single source of truth
- Clear audit trail
- Decisions linked to outputs

### For Handoff
- Comprehensive summary ready
- All artifacts in one place
- Rationale documented

---

## Related Files

| File | Purpose |
|------|---------|
| `change-requests/<CR-ID>/1-reframe-problem.md` | Step 1 output |
| `change-requests/<CR-ID>/2-list-assumptions.md` | Step 2 output |
| `change-requests/<CR-ID>/3-form-hypothesis.md` | Step 3 output |
| `change-requests/<CR-ID>/4-benchmarking-criteria.md` | Step 4 output |
| `change-requests/<CR-ID>/5-solution-approaches.md` | Step 5 output |
| `change-requests/<CR-ID>/6-solution-tradeoffs.md` | Step 6 output |
| `change-requests/<CR-ID>/7-ooux-user-flows.md` | Step 7 output |
| `change-requests/<CR-ID>/8-scope-and-metrics.md` | Step 8 output |
| `change-requests/<CR-ID>/9-ux-interactions.md` | Step 9 output |
| `change-requests/<CR-ID>/realtime-design-progress.html` | Real-time dashboard |

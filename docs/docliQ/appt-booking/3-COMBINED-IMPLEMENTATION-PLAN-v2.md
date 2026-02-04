# Combined Implementation Plan v2: A2+B+B2+E+E2 with Full UX Coverage

---
name: combined-implementation-plan-v2
source_iteration_1: docs/doclibQ/appointment-mgt/3-ideations.md
source_iteration_2: docs/doclibQ/appointment-mgt/3-ideations-iteration-2.md
final_decision: A2+B+B2+E+E2 Combined
rationale: Maintains the hybrid decision while adding the missing UX stories (favorites, appointment type, export, status, modify/cancel) per `scope-for-exoloration (N)`
timeline: 6.5 weeks (3 phases + wrap-up)
team_size: 3-4 developers
status: Ready for implementation
created: 2026-01-30
---

# Combined Implementation Plan v2: Full UX Coverage

> **Merged Decision**: Converse-first hybrid (A2 + B + B2 + E + E2)  
> **Objective**: Extend the original plan to cover every appointment UX story from `scope-for-exoloration (N)` while keeping the family-first chat + automation identity intact.

---

## What We're Building

```
┌─────────────────────────────────────────────────────────────────┐
│ 📱 FAMILY-FIRST CONVERSATIONAL APP w/ FULL UX COVERAGE         │
├─────────────────────────────────────────────────────────────────┤
│ • Home/Chat surfaces favorites, appointment type chips, and     │
│   quick questions for Acute/Prevention/Follow-Up flows.        │
│ • Appointment detail and reminders page show status chips,      │
│   timestamps, calendar export CTA, and modify/cancel actions    │
│   guarded by 24h rules.                                         │
│ • Automation defaults + push reminders include favorites, chat │
│   state, and platform shortcuts (widgets, App Clips, Siri).     │
└─────────────────────────────────────────────────────────────────┘
```

## Components Breakdown (v2 additions)

| Component | Source | Role | New Value |
|-----------|--------|------|-----------|
| **A2 Chat Engine** | Iteration 2 | Core conversational booking | Adds appointment-type branching + modify/cancel prompts |
| **B Progressive UX** | Iteration 1 | Progressive disclosure | Ensures favorites + dependent flows stay contextual |
| **B2 Micro Interactions** | Iteration 2 | Interaction polish | Heart/haptic around favorites + reminder toggles |
| **E Family Layer** | Iteration 1 | Shared favorites/reminders | Drives family selector + consolidated pushes |
| **E2 Platform Layer** | Iteration 2 | Widgets/App Clips/Voice | Displays status + favorites, supports exports |
| **New Export + Status UI** | v2 | Requirement fill | Adds ICS export button, status chips, timestamps |
| **Modify/Cancel Flow** | v2 | Requirement fill | Chat + detail actions with 24h guardrails, fallback prompts |

## 6.5-Week Implementation Plan

| Phase | Focus | Duration | Deliverables |
|-------|-------|----------|--------------|
| **Phase 1** | Conversational core + favorites | Weeks 1-2 | Chat state machine with appointment type + favorites tray, family selector synchronization, widget deep links |
| **Phase 2** | Status + reminders + export | Week 3-4 | Status chips + timestamps, reminder/automation toggles, calendar export sheet, push notifications with status copy |
| **Phase 3** | Modify/Cancel + automation polish | Week 5-6 | Modify/cancel controls within chat + detail, automation defaults, GDPR notice on favorites, App Clips/voice updates |
| **Wrap-up** | Deferred Approach A gating | Week 6.5 | Gate FILTER review, tablet/web plan for deferred dashboard |

## Added UX Coverage (Requirement-by-requirement)

- **US 1.2.2 Favorites**: Persistent favorites tray + “My Doctors” screen + automation auto-add rules highlighted in chat/reminder flows.  
- **US 1.2.3 Appointment Type**: Quick replies for Acute/Prevention/Follow-Up with the required symptom/selection inputs and chat state context stored for confirmation/export.  
- **US 1.2.5 Status + Time**: Chips on appointment list/detail, push content for status change, and backend timestamp displayed per acceptance criteria.  
- **US 1.2.6 Calendar Export**: Export CTA on confirmed appointment/notification sheet with ICS + deep link options; metadata includes doctor, type, reminders.  
- **US 1.2.9 Modify + 1.2.10 Cancel**: Inline action buttons, disabled <24h with tooltip, chat fallback offering alternatives, statuses move through Modified/Cancelled.  

## Implementation Notes

- Extend chat state machine to branch on `appointmentType` and to resume flows when users trigger modify/cancel events.  
- Appointment detail screen now includes status chips, export button, favorite info, and action buttons grouped with reminders.  
- Widgets/App Clips surface status + favorite doctor context; notifications include quick actions tied to favorites/export.  
- Automation defaults (D) now consider favorites and reminder captures, push recap emphasizes family status, and golden tests (epics 1.2/1.3/1.5/1.8) verify coverage.

## Golden Test Alignment

Refer to `docs/doclibQ/GOLDEN-TESTS-PROPOSAL.md` — Vitest config (maxConcurrency=2, retry=2, bail=1, 10s timeout) ensures the suites for epics 1.2, 1.3, 1.5, 1.8 validate the new UX flows (favorites, appointment type, statuses, modify/cancel).

## Next Steps

1. ✅ Spec the new favorites tray, appointment type chips, export sheet, and modify/cancel modals.  
2. ⬜ Update chat state machine to align with v2 flows.  
3. ⬜ Wire appointment list/detail + widgets to status + export metadata.  
4. ⬜ Run golden suite (epics 1.2/1.3/1.5/1.8) to certify UX coverage.  
5. ⬜ Gate FILTER review and plan Approach A deferral.

---

*Document Version: 2.0 (100% UX coverage) | Status: Ready for implementation | Timeline: 6.5 weeks | Team: 3-4 developers | Decision: Combined hybrid approach with full scope coverage.*

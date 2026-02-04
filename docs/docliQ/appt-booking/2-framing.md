---
name: design-lite:framing-ngan
feature: MEDA-BOOK-NGAN (Appointment Booking Enhancements)
source_requirement: 'docs/doclibQ/appointment-mgt/scope-for-exoloration (N).md'
created: 2026-01-30
status: accepted
---

# DESIGN-LITE: FRAMING (NGAN SCOPE)

```
┌─────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: FRAMING (NGAN)       Status: ✅ ACCEPTED              │
├─────────────────────────────────────────────────────────────────┤
│ 📋 ORIGINAL REQUEST                                             │
│ Enhance appointment booking and management to cover critical    │
│ user stories (US) with low/zero coverage: favorite doctors (0%),│
│ appointment reminders (0%), automatic feedback (0%), specialty │
│ search (48%), appointment type selection (25%), calendar export │
│ (50%), appointment list (50%), cancellation (50%), practice   │
│ changes (50%), and granular data consent (25%). Focus on        │
│ user engagement, operational reliability, and regulatory        │
│ compliance for DocliQ N3 app.                                  │
├─────────────────────────────────────────────────────────────────┤
│ 🔄 PROBLEM FRAMINGS (3)                                         │
│                                                                 │
│ A: Increase User Engagement & Retention                         │
│    Problem: Users don't return to the app between appointments │
│    because missing favorite doctors, reminders, and feedback    │
│    create a transactional rather than relationship-based        │
│    experience.                                                   │
│    Root cause: No persistence of user preferences (favorites),  │
│    no proactive communication (reminders), no post-visit        │
│    engagement (feedback).                                       │
│    Direction: Implement favorites storage, push notification     │
│    reminders (24h/72h), post-appointment feedback collection    │
│    → create habit loops and return visits.                      │
│                                                                 │
│ B: Improve Operational Reliability & Trust                      │
│    Problem: Users lose trust when practice changes,             │
│    cancellations, and appointment status updates are slow,     │
│    incomplete, or unclear, causing no-shows and missed         │
│    opportunities.                                               │
│    Root cause: Weak real-time sync for practice changes,        │
│    incomplete cancellation flows, insufficient status          │
│    visibility and error handling.                               │
│    Direction: Strengthen practice-initiated change handling    │
│    (webhooks + 60s SLA), robust cancellation with 24h windows, │
│    enhanced appointment list with status filtering and         │
│    detailed history → users trust the system and show up.      │
│                                                                 │
│ C: Reduce Booking Friction & Improve Coverage                  │
│    Problem: Users can't find or book efficiently because        │
│    specialty search is incomplete, appointment types are        │
│    missing, and calendar export is partial → abandonment.       │
│    Root cause: Incomplete specialty API integration, no         │
│    appointment type selection (acute/prevention/follow-up),     │
│    calendar export only works for confirmed status.             │
│    Direction: Complete specialty search with error handling,   │
│    add appointment type selector with symptom/intent capture,  │
│    expand calendar export to include pending/in-progress →      │
│    faster, more complete booking funnel.                        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ KEY ASSUMPTIONS (top 3-5)                                    │
│                                                                 │
│ │ # │ Assumption                                           │ Risk │ Val? │
│ ├───┼──────────────────────────────────────────────────────┼──────┼──────┤
│ │ 1 │ Push notifications reliably delivered (24h/72h)       │ 🔴High│ ✅Yes │
│ │ 2 │ Users want to save/reuse favorite doctors            │ 🟡Med │ ✅Yes │
│ │ 3 │ Practice changes arrive via Curaay within 60s        │ 🔴High│ ✅Yes │
│ │ 4 │ Calendar export for pending appointments is useful   │ 🟢Low │ ❌No  │
│ │ 5 │ Feedback collection doesn't annoy users              │ 🟡Med │ ✅Yes │
│                                                                 │
│ Risk = likelihood wrong × impact if wrong                       │
├─────────────────────────────────────────────────────────────────┤
│ 🧪 HYPOTHESIS (for selected framing)                            │
│                                                                 │
│ Selected framing: A                                             │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ IF we implement user engagement features (favorites storage │ │
│ │ with last 5 doctors, push notification reminders at 24h/72h│ │
│ │ before appointments, and automatic post-appointment       │ │
│ │ feedback request 1h after visit),                           │ │
│ │ THEN user retention rate will increase and repeat bookings │ │
│ │ will increase,                                              │ │
│ │ FOR primary users (Sarah, Marc, families),                │ │
│ │ BECAUSE the app becomes a persistent relationship tool     │ │
│ │ rather than a one-time transaction, creating habit loops  │ │
│ │ and reducing the friction of re-booking.                   │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Key assumptions this depends on:                                │
│ • Assumption #1 (push notification reliability)                 │
│ • Assumption #2 (users actually want to save favorites)       │
│ • Assumption #5 (feedback doesn't annoy)                        │
│                                                                 │
│ Success metric:                                                 │
│ - User retention (7-day DAU/MAU) → Pass: >25% / Fail: <15%    │
│ - Repeat booking rate (30 days) → Pass: >15% / Fail: <8%       │
│ Secondary:                                                     │
│ - Favorite doctors adoption → Pass: >40% of users save ≥1      │
│ - Feedback completion rate → Pass: >20% / Fail: <10%           │
├─────────────────────────────────────────────────────────────────┤
│ 👉 AI: Recommend framing A because it addresses the fundamental │
│ engagement gap—DocliQ N3 has solid booking flows but users     │
│ have no reason to return between appointments. B (reliability)│
│ is already partially implemented (50% for practice changes)  │
│ and C (booking friction) is incremental improvements. A        │
│ unlocks the highest long-term value: repeat bookings and       │
│ retention, which drives lifetime value. B and C can follow    │
│ once the engagement foundation is solid.                        │
├─────────────────────────────────────────────────────────────────┤
│ ✅ DECISION:                                                    │
│ [x] Accept framing A + hypothesis                               │
│ [ ] Modify hypothesis                                           │
│ [ ] Try different framing (B or C)                              │
│ Notes: Accepted by user on 2026-01-30                            │
└─────────────────────────────────────────────────────────────────┘
```

## Coverage Gap Analysis

### Zero Coverage (0%) - Highest Priority
| US | Feature | Blocker | Effort |
|----|---------|---------|--------|
| 1.2.2 | Save Favorite Doctors | Need persistent storage | Medium |
| 1.2.7 | Appointment Reminders | Need push notification service | High |
| 1.3.1 | Automatic Feedback | Need push + feedback UI | Medium |

### Low Coverage (25%) - Medium Priority
| US | Feature | Gap | Effort |
|----|---------|-----|--------|
| 1.2.3 | Select Appointment Type | Missing type selector + validation | Medium |
| 1.8.3 | Granular Data Consent | Missing consent UI + API | Low |

### Partial Coverage (50%) - Lower Priority
| US | Feature | Gap | Effort |
|----|---------|-----|--------|
| 1.2.6 | Export to Calendar | Only works for confirmed | Low |
| 1.2.8 | Appointment List | Missing filters, status | Low |
| 1.2.10 | Cancel Appointment | Partial implementation | Low |
| 1.5.1 | Practice Changes | Weak real-time sync | Medium |

### High Coverage (75%) - Maintenance
| US | Feature | Status |
|----|---------|--------|
| 1.2.4 | Book for Dependents | Mostly complete |
| 1.2.5 | Real-time Status | Mostly complete |
| 1.2.9 | Modify Appointment | Mostly complete |

## Implementation Dependencies

```
Favorites (1.2.2)
  └─> API: GET/POST user favorites
  └─> Storage: Persist to localStorage/DB
  └─> UI: "My Doctors" section in booking

Reminders (1.2.7)
  └─> Push service: Scheduling & delivery
  └─> API: Appointment time + user tokens
  └─> UI: Quick actions (Confirm/Cancel)

Feedback (1.3.1)
  └─> Push service: 1h post-appointment trigger
  └─> API: Ratings storage (GDPR anonymized)
  └─> UI: Rating form (stars + text)
```

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Push delivery failures | Fallback to email; show "reminders enabled" in settings |
| Favorites unused | A/B test placement; show "recent doctors" to surface |
| Feedback annoys users | Make optional; show "Skip" button; limit to 1 request/visit |
| Practice sync delays | Add retry logic; show "Last updated" timestamp |

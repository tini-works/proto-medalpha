---
artifact: ooux-user-journeys
app: appointment-booking-n3
title: User Journeys - Appointment Booking N3
summary: Goal-based journeys that drive IA and the screen list for N3 booking.
created: 2026-01-27
updated: 2026-01-27
last_updated_by: codex
sources:
  - "[[0-APPOINTMENT-BOOKING-SCOPE]]"
  - "[[USER-FLOWS-v2]]"
  - "[[INFO-MAP-v2]]"
guidelines:
  - "[[visual-artifacts-rules]]"
outputs:
  - "[[IA]]"
---

# User Journeys - Appointment Booking N3

**Related spec:** [[0-APPOINTMENT-BOOKING-SCOPE]]
**Related artifacts:** [[1-dot-map]] · [[IA]] · [[SCREENS]]

This document follows `docs/z.guidelines/visual-artifacts-rules.md` and its linked constraints.

---

## 1) User Goals (Behavior First)

| Goal ID | Goal statement | Things involved | Key actions |
|--------|-----------------|----------------|------------|
| G1 | When I install the app, I want to create an account and verify it, so that I can access booking features. | User, User Profile | register, verify, sign in |
| G2 | When I want to book care, I want to complete my profile (insurance, address, consent), so that eligibility and reminders work. | User Profile, Consent, Insurance | complete profile, consent |
| G3 | When I need an appointment, I want to find a suitable doctor and time slot, so that I can book quickly. | Doctor, Search Filters, Time Slot, Appointment | search, filter, select, confirm |
| G4 | When I have an upcoming appointment, I want to view details and take actions, so that I stay in control (cancel/reschedule). | Appointment | view, cancel, reschedule |
| G5 | When I had a past visit, I want to book again using the prior context, so that I save time. | Appointment, Doctor, Location, Insurance | book again, select slot |
| G6 | When I book for my child or dependent, I want to manage family members, so that the booking uses the right patient details. | Family Member, User Profile | add/edit/remove, select patient |
| G7 | When I change preferences, I want to update language and notification settings, so that the app fits my needs. | Notification Preferences | configure |

---

## 2) Goal Map (How Goals Connect)

```mermaid
graph TD
  A[Entry Open app] --> B{Authenticated?}
  B -->|No| C[G1 Account and verify]
  B -->|Yes| D{Profile complete?}
  C --> D
  D -->|No| E[G2 Complete profile]
  D -->|Yes| F[Main app hub]
  E --> F

  F --> G[G3 Book appointment]
  F --> H[G4 Manage appointment]
  F --> I[G5 Book again]
  F --> J[G6 Family members]
  F --> K[G7 Preferences]
```

---

## 3) Journey Diagrams (Per Goal)

### G1 — Account + Verify

```mermaid
graph TD
  A[Start first open] --> B[Welcome]
  B --> C{Register or sign in?}
  C -->|Register| D[Register]
  C -->|Sign in| E[Sign in]

  D --> F[Submit registration]
  F --> G[Verify code]
  G --> H{Code valid?}
  H -->|No| I[Retry or resend]
  I --> G
  H -->|Yes| J[Signed in verified]

  E --> K{Credentials valid?}
  K -->|No| L[Show error]
  L --> E
  K -->|Yes| J

  J --> M[Done]
```

### G2 — Profile Completion Gate

```mermaid
graph TD
  A[Start auth complete] --> B{Profile complete?}
  B -->|Yes| C[Done can book]
  B -->|No| D[Complete profile]
  D --> E[Select insurance]
  E --> F[Enter eGK number]
  F --> G[Enter address]
  G --> H{Consent given?}
  H -->|No| I[Block progress]
  I --> H
  H -->|Yes| J[Save profile]
  J --> C
```

### G3 — Book Appointment (Core Booking)

```mermaid
graph TD
  A[Start book entry] --> B[Search specialty]
  B --> C[Location]
  C --> D[Insurance filter]
  D --> E[Results list]
  E --> F{View doctor profile?}
  F -->|Yes| G[Doctor profile]
  F -->|No| H[Slot selection]
  G --> H
  H --> I{Slot available?}
  I -->|No| E
  I -->|Yes| J[Confirm]
  J --> K[Book appointment]
  K --> L[Success]
  L --> M[Done]
```

### G4 — Manage Upcoming Appointment (View / Cancel / Reschedule)

```mermaid
graph TD
  A[Start open upcoming] --> B[History upcoming]
  B --> C[Appointment details]
  C --> D{Action?}
  D -->|Cancel| E[Cancel confirm]
  D -->|Reschedule| F[Reschedule]
  D -->|None| G[Done]

  E --> H[Cancelled]
  H --> G

  F --> I[Suggested slots]
  I --> J[Reason optional]
  J --> K[Confirm reschedule]
  K --> L[Reschedule success]
  L --> G
```

### G5 — Book Again (From Past Appointment)

```mermaid
graph TD
  A[Start open past] --> B[History past]
  B --> C[Past appointment details]
  C --> D[Book again]
  D --> E[Context]
  E --> F{Need alternatives?}
  F -->|Yes| G[Alternatives]
  F -->|No| H[Slot selection]
  G --> H
  H --> I[Confirm]
  I --> J[Success]
  J --> K[Done]
```

### G6 — Family Members (Manage + Select Patient)

```mermaid
graph TD
  A[Start open family] --> B[Family members list]
  B --> C{Action?}
  C -->|Add| D[Add family member]
  C -->|Edit| E[Family member detail]
  C -->|Remove| F[Remove confirm]
  C -->|Select patient| G[Select patient]

  D --> H[Saved]
  E --> H
  F --> H
  H --> I[Done]
  G --> I
```

### G7 — Preferences (Language + Notifications)

```mermaid
graph TD
  A[Start open settings] --> B[Settings]
  B --> C{Preference?}
  C -->|Language| D[Language]
  C -->|Notifications| E[Notifications]
  D --> F[Saved]
  E --> F
  F --> G[Done]
```

---

## 4) Paths and Decision Points (Summary)

| Goal | Key decision(s) | Primary alternate path(s) |
|------|------------------|---------------------------|
| G1 | Register vs sign in; code valid? | Retry/resend; credential error |
| G2 | Profile complete? consent given? | Block until consent |
| G3 | View profile vs quick slot; slot available? | Back to results |
| G4 | Cancel vs reschedule | No action |
| G5 | Alternatives needed? | Direct slot selection |
| G6 | Add/edit/remove vs select patient | Confirm remove |
| G7 | Language vs notifications | - |

---
artifact: ia-map
product: appointment-booking
app: appointment-booking-n3
title: IA Map (Canonical) - Appointment Booking N3
summary: Where things live (navigation + screens) for N3 booking, derived from journeys and implemented routes.
created: 2026-01-27
updated: 2026-01-27
last_updated_by: codex
sources:
  - "[[0-APPOINTMENT-BOOKING-SCOPE]]"
  - "[[2-user-journeys]]"
guidelines:
  - "[[visual-artifacts-rules]]"
---

# IA Map (Canonical) - Appointment Booking N3

**Related spec:** [[0-APPOINTMENT-BOOKING-SCOPE]]
**Related artifacts:** [[1-dot-map]] · [[2-user-journeys]] · [[SCREENS]]

This is the canonical IA map entry point referenced by `docs/z.guidelines/visual-artifacts-rules.md`.

---

## Navigation Model (N3)

- **Auth:** Welcome → Register/Sign In → Verify (email) → (optional) Verify Identity
- **Main:** Bottom navigation conceptually exposes **Home**, **Book**, **History**, **Settings**
  - Booking screens are under `/booking/*` routes.
  - History screens are under `/history/*` routes.
  - Settings screens are under `/settings/*` routes.
- **Gating:** Booking + History require **Auth + Profile complete**; Home requires **Auth**.

---

## IA Diagram — Auth & Gate (≤ 20 nodes)

```mermaid
graph TD
  A[Start] --> B[SCR-001 Welcome]
  B --> C{Register or sign in?}
  C -->|Register| D[SCR-002 Register]
  C -->|Sign in| E[SCR-003 Sign In]
  D --> F[SCR-004 Verify]
  E --> G{Profile complete?}
  F --> G
  G -->|No| H[SCR-010 Profile Completion]
  G -->|Yes| I[Main app]
  H --> I
  I --> J[SCR-020 Home]
```

---

## IA Diagram — Main Areas (≤ 20 nodes)

```mermaid
graph TD
  A[Main app] --> B[SCR-020 Home]
  A --> C[SCR-030 Booking Search]
  A --> D[SCR-040 History]
  A --> E[SCR-080 Settings]
  D --> F[SCR-041 History Detail]
  F --> G[SCR-042 Appointment Detail]
  E --> H[SCR-011 Family Members]
  H --> I[SCR-012 Family Member Detail]
  E --> J[SCR-013 Edit Profile]
```

---

## IA Diagram — Booking (Detail) (≤ 20 nodes)

```mermaid
graph TD
  A[Entry Book] --> B[SCR-030 Search]
  B --> C[SCR-031 Location]
  C --> D[SCR-032 Insurance]
  D --> E[SCR-033 Results]
  E --> F[SCR-034 Doctor Profile]
  F --> G[SCR-035 Reviews]
  G --> F
  F --> H[SCR-036 Slot Selection]
  H --> I[SCR-037 Confirm]
  I --> J[SCR-038 Success]
  J --> K[Done]
```

---

## IA Diagram — Appointment Actions (≤ 20 nodes)

```mermaid
graph TD
  A[SCR-040 History] --> B[SCR-041 History Detail]
  B --> C[SCR-050 Reschedule Suggested Slots]
  C --> D[SCR-051 Reschedule Reason]
  D --> E[SCR-052 Reschedule Confirm]
  E --> F[SCR-053 Reschedule Success]
  B --> G[SCR-060 Book Again Context]
  G --> H[SCR-061 Book Again Alternatives]
  H --> I[SCR-036 Slot Selection]
```

---

## Screen IDs

The full canonical list lives in: [[SCREENS]]

---
app: MedAlpha - Booking N3
feature: "MEDA-BOOK — Guided Wizard (v2)"
created: 2026-01-22
updated: 2026-01-22
status: draft
inputs:
  current_state_sources:
    - apps/appointment-booking-N3/src/App.tsx
    - apps/appointment-booking-N3/src/routes/paths.ts
    - apps/appointment-booking-N3/src/components/layout/TabBar.tsx
  proposed_feature_sources:
    - docs/appointment-booking/design-Guided-wizard-v2.md
---

# IA Map - MedAlpha Booking N3 with Guided Wizard (v2)

This is a **feature impact analysis** for adding **Guided Wizard (v2)** booking to the current Booking N3 app. Changes are relative to the current routing + navigation defined in the sources above.

Legend:
- `NEW` = new surface/route/object
- `MODIFIED` = existing surface/route/object changed

## Updated Information Architecture (Future State)

```mermaid
flowchart TB
  classDef NEW fill:#E8F5E9,stroke:#2E7D32,color:#102A32
  classDef MODIFIED fill:#FFF8E1,stroke:#EF6C00,color:#102A32
  classDef UNCHANGED fill:#FFFFFF,stroke:#9E9E9E,color:#102A32

  subgraph APP["MedAlpha - Booking N3 (Future State)"]
    direction TB

    subgraph NAV["Bottom Navigation"]
      direction LR
      HOME["Home (UNCHANGED)"]:::UNCHANGED
      BOOK_TAB["Termine (MODIFIED)"]:::MODIFIED
      HISTORY_TAB["Verlauf (MODIFIED)"]:::MODIFIED
      SETTINGS_TAB["Einstellungen (MODIFIED)"]:::MODIFIED
    end

    subgraph AUTH["Authentication (UNCHANGED)"]
      WELCOME["Welcome"]:::UNCHANGED
      REGISTER["Register"]:::UNCHANGED
      SIGNIN["Sign In"]:::UNCHANGED
      VERIFY["Verify"]:::UNCHANGED
    end

    subgraph PROFILE["Profile (UNCHANGED)"]
      PROFILE_COMPLETE["Profile Completion"]:::UNCHANGED
      PROFILE_FAMILY["Family Members"]:::UNCHANGED
      PROFILE_EDIT["Edit Profile"]:::UNCHANGED
    end

    subgraph BOOKING["Booking (Guided Wizard v2)"]
      WZ1["Wizard: Schritt 1 Spezialität (NEW)"]:::NEW
      WZ2["Wizard: Schritt 2 Ort (NEW)"]:::NEW
      WZ3["Wizard: Schritt 3 Versicherung (NEW)"]:::NEW
      WZ4["Wizard: Schritt 4 Zusammenfassung (NEW)"]:::NEW
      RESULTS["Results List (MODIFIED)"]:::MODIFIED
      FILTER_SHEET["Filter Sheet (NEW)"]:::NEW
      SORT_SHEET["Sort Sheet (NEW)"]:::NEW
      DOCTOR["Doctor Profile (MODIFIED)"]:::MODIFIED
      SLOTS["Slot Selection (MODIFIED)"]:::MODIFIED
      CONFIRM["Confirm (MODIFIED)"]:::MODIFIED
      SUCCESS["Success (MODIFIED)"]:::MODIFIED
    end

    subgraph APPTS["Appointments (NEW)"]
      APPT_LIST["Meine Termine (NEW)"]:::NEW
      APPT_DETAIL["Termin-Details (NEW)"]:::NEW
      APPT_CANCEL["Termin stornieren (NEW)"]:::NEW
      APPT_RESCHED["Termin umbuchen (NEW)"]:::NEW
    end

    subgraph HISTORY["History (MODIFIED)"]
      HISTORY_LIST["History List (MODIFIED)"]:::MODIFIED
      HISTORY_DETAIL["History Detail (NEW)"]:::NEW
    end

    subgraph SETTINGS["Settings (MODIFIED)"]
      SETTINGS_HOME["Settings (MODIFIED)"]:::MODIFIED
      SETTINGS_NOTIF["Notifications (MODIFIED)"]:::MODIFIED
      SETTINGS_REMINDERS["Reminder Preferences (NEW)"]:::NEW
    end
  end

  %% Primary navigation
  HOME --> BOOK_TAB
  HOME --> HISTORY_TAB
  HOME --> SETTINGS_TAB

  BOOK_TAB --> WZ1 --> WZ2 --> WZ3 --> WZ4 --> RESULTS
  RESULTS -.-> FILTER_SHEET
  RESULTS -.-> SORT_SHEET
  RESULTS --> DOCTOR --> SLOTS --> CONFIRM --> SUCCESS

  %% Post-booking management
  SUCCESS -.->|"View appointment"| APPT_DETAIL
  HOME -.->|"Upcoming tap"| APPT_LIST
  HISTORY_TAB --> HISTORY_LIST
  HISTORY_LIST --> HISTORY_DETAIL

  %% Appointment actions
  APPT_LIST --> APPT_DETAIL
  APPT_DETAIL --> APPT_CANCEL
  APPT_DETAIL --> APPT_RESCHED --> WZ1
  APPT_DETAIL -.->|"Reminders"| SETTINGS_REMINDERS
  SETTINGS_TAB --> SETTINGS_HOME --> SETTINGS_NOTIF
```

---

## Summary of Changes

### NEW Elements

| Component | Location | Purpose |
|-----------|----------|---------|
| Booking wizard step screens | `/booking/wizard/*` | Step-by-step narrowing (Specialty → Location → Insurance → Summary) |
| Filter sheet + sort sheet | Results UI | Make refinement explicit, persistent, and reversible |
| Appointments list + detail | `/appointments/*` | Post-booking management (cancel, reschedule, reminders) |
| Reminder preferences | Settings | Centralize reminder policy and user control |
| History detail screen | `/history/:id` | Detail view + reuse for appointments/purchases/redemptions |

### MODIFIED Elements

| Component | Change | Impact |
|-----------|--------|--------|
| `/booking/search` | Becomes wizard entry (or redirects to Step 1) | Tab entry now starts the guided funnel |
| Results list | Adds chips/summary, filter count, deterministic empty states | Changes layout + persistence expectations |
| Confirm | Adds explicit “review” requirements + slot availability handling | More validation states, clearer outcomes |
| Success | Adds clear next actions (Meine Termine, reminders, calendar, route) | Drives post-booking completion |
| History | Splits list vs detail; aligns terminology to appointments | Enables richer management + deep links |
| Settings | Adds reminder settings surface | Introduces notification policy controls |

### Navigation Changes

| Navigation | Current | After Feature |
|------------|---------|---------------|
| Start booking | Home → `/booking/search` | Home → `/booking/wizard/specialty` (via Book tab) |
| Refine results | Back to search | Results → Filter/Sort (sheet) → Results |
| Post-booking | Success → History | Success → Termin-Details / Meine Termine |
| Reschedule | Not supported | Termin-Details → Umbuchen → Wizard Step 1 |

### Data Model Additions

```
BookingWizardState (NEW)
  - step: 1..4
  - specialtyQuery + selectedSpecialty
  - location: { city, postalCode, radiusKm, source }
  - insuranceType: GKV | PKV | Selbstzahler
  - summary: derived “Your choices”
  - persistKey + lastUpdatedAt

ResultRefinements (NEW)
  - filters: { distanceKm, ratingMin, languages[], videoOnly }
  - sort: soonest | distance | rating

AppointmentActions (NEW)
  - cancelReason (optional)
  - rescheduleFromAppointmentId
  - reminderPrefs: { pushEnabled, timings[] }
```

---

## Route Structure Updates

| Route | Screen Name | Protection | Change | Purpose |
|-------|-------------|------------|--------|---------|
| `/auth/welcome` | Welcome | Public | Unchanged | Entry |
| `/auth/register` | Register | Public | Unchanged | Create account |
| `/auth/sign-in` | Sign In | Public | Unchanged | Authenticate |
| `/auth/verify` | Verify | Public | Unchanged | Verification |
| `/profile/complete` | Profile Completion | Auth | Unchanged | Required setup |
| `/profile/family` | Family Members | Auth | Unchanged | Patient management |
| `/profile/edit` | Edit Profile | Auth | Unchanged | Profile edits |
| `/home` | Home | Auth + Profile complete | Unchanged | Dashboard + entry points |
| `/booking/search` | Booking Entry | Auth + Profile complete | MODIFIED | Redirect/start wizard |
| `/booking/wizard/specialty` | Wizard Step 1 | Auth + Profile complete | NEW | Specialty selection |
| `/booking/wizard/location` | Wizard Step 2 | Auth + Profile complete | NEW | Location + radius |
| `/booking/wizard/insurance` | Wizard Step 3 | Auth + Profile complete | NEW | Insurance selection |
| `/booking/wizard/review` | Wizard Step 4 | Auth + Profile complete | NEW | Summary + edit/back |
| `/booking/results` | Results List | Auth + Profile complete | MODIFIED | Shows list + filter/sort sheets |
| `/booking/doctor/:id` | Doctor Profile | Auth + Profile complete | MODIFIED | Shows suitability + slot entry |
| `/booking/doctor/:id/slots` | Slot Selection | Auth + Profile complete | MODIFIED | Slot picking rules |
| `/booking/confirm` | Confirm | Auth + Profile complete | MODIFIED | Final review + availability checks |
| `/booking/success` | Success | Auth + Profile complete | MODIFIED | Confirmation + next actions |
| `/appointments` | Meine Termine | Auth + Profile complete | NEW | Upcoming + past appointments |
| `/appointments/:id` | Termin-Details | Auth + Profile complete | NEW | Manage (cancel/reschedule/reminders) |
| `/appointments/:id/cancel` | Termin stornieren | Auth + Profile complete | NEW | Cancellation flow |
| `/appointments/:id/reschedule` | Termin umbuchen | Auth + Profile complete | NEW | Rebook with context |
| `/history` | History List | Auth + Profile complete | MODIFIED | Cross-domain history list |
| `/history/:id` | History Detail | Auth + Profile complete | NEW | Detail view (type-specific) |
| `/settings` | Settings | Auth | MODIFIED | Adds reminders entry |
| `/settings/notifications` | Notifications | Auth | MODIFIED | Notification channel control |
| `/settings/reminders` | Reminder Preferences | Auth | NEW | Reminder timing policies |

---

## Object Location Mapping Updates

| Object | Primary Location | Secondary Location(s) | Change | Access From |
|--------|------------------|----------------------|--------|-------------|
| Doctor | Results List | Doctor Profile | MODIFIED | Wizard → Results |
| Time Slot | Slot Selection | Doctor Profile | MODIFIED | Doctor → Slots |
| Booking Wizard State | Wizard steps | Results | NEW | Book tab entry |
| Result Filters | Filter sheet | Results header | NEW | Results |
| Result Sort | Sort sheet | Results header | NEW | Results |
| Appointment | Meine Termine | History, Success | MODIFIED | Success, Home, History |
| Appointment Cancellation | Termin stornieren | Termin-Details | NEW | Termin-Details |
| Reminder Preferences | Settings → Reminders | Termin-Details | NEW | Settings, Termin-Details |

---

## Screen Sections Updates (key surfaces)

### Wizard Step Screen (NEW)

```
┌─────────────────────────────┐
│ Termine                      │
│ Schritt 1 von 4              │
├─────────────────────────────┤
│ [ Eingabe / Auswahl ]        │
│                              │
│ [ Weiter ]                   │
└─────────────────────────────┘
```

### Results List (MODIFIED)

```
┌─────────────────────────────┐
│ Ergebnisse                   │
│ Spezialität · Ort · Kasse    │
├─────────────────────────────┤
│ [ Filter (2) ] [ Sortieren ] │
├─────────────────────────────┤
│ [ Arztkarte + Slots ]        │
│ [ Arztkarte + Slots ]        │
└─────────────────────────────┘
```

### Termin-Details (NEW)

```
┌─────────────────────────────┐
│ Termin-Details               │
├─────────────────────────────┤
│ Arzt · Ort                   │
│ Datum · Uhrzeit              │
├─────────────────────────────┤
│ [ Umbuchen ] [ Stornieren ]  │
│ [ Erinnerung ]               │
└─────────────────────────────┘
```

---

## Key Features Delivered

1. Guided booking funnel with explicit progress (Schritt 1–4)
2. Persistent, reversible refinements (filters/sort) on results
3. Deterministic handling for “no results” and “slot taken”
4. Post-booking appointment management (cancel/reschedule/reminders)

---

## MEDA-BOOK Guided Wizard (v2) Implementation Notes

- **Routing:** Keep `/booking/search` for backwards compatibility, but redirect to `/booking/wizard/specialty`.
- **Persistence:** Store `BookingWizardState` + `ResultRefinements` locally (e.g., localStorage) and restore on app restart until user resets.
- **i18n:** Default German (“Sie”), EU date formatting, and 30–40% text expansion resilience for all new/modified screens.
- **Availability:** Confirm step must re-check slot availability immediately before creating appointment; present non-alarming, actionable fallback when taken.
- **Appointments:** Create a dedicated appointments surface (`/appointments/*`) to avoid overloading History and to match user mental model (“Meine Termine”).


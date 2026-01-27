---
name: ia-map:booking-n3:current-vs-target-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
created: 2026-01-26
updated: 2026-01-26
status: draft
scope: Booking N3 (high-level IA)
related:
  - docs/artifacts/ia-map/IA.md
sources:
  - apps/appointment-booking-N3/src/App.tsx
  - apps/appointment-booking-N3/src/routes/paths.ts
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md
  - docs/appointment-booking/2-design-plan-Reschedule-flow-v2.md
  - docs/appointment-booking/2-design-plan-Book-again-flow-v2.md
guidelines:
  - docs/z.guidelines/visual-artifacts-rules.md
  - docs/z.guidelines/visual-guidelines-abstract.md
  - docs/z.guidelines/visual-guideline.md
notes:
  - "Comparison doc for planning. Canonical IA map remains docs/artifacts/ia-map/IA.md."
last_updated_by: nganpham
---

# IA Map — Current vs Target v2 (Booking N3)

This file compares the **current** Booking N3 IA (as implemented in routes) with the **target** IA from the v2 design-lite plans. It intentionally stays **high-level** (≤ 20 nodes/diagram).

## Screen ID mapping (reference only)

| Ref (SCR) | Current route/screen | Target design-lite screen |
|---|---|---|
| SCR-120 | Home (`/home`) | S01 Entry (“Book an appointment”) |
| SCR-201 | Choose specialty (`/booking/search`) | S02 Step 1: Specialty |
| SCR-202 | Choose location & radius (`/booking/location`) | S03 Step 2: Location & radius |
| SCR-210 | (no route today) | S04 Step 3: Insurance (**NEW**) |
| SCR-203 | Find doctors (`/booking/results`) | S05 Results list (**MODIFIED**) |
| SCR-204 | View doctor profile (`/booking/doctor/:id`) | S06 Doctor profile (**MODIFIED**) |
| SCR-209 | (no route today) | S07 Reviews list (**NEW**) |
| SCR-205 | Choose an appointment time (`/booking/doctor/:id/slots`) | S08 Slot picker (**MODIFIED**) |
| SCR-206 | Confirm appointment (`/booking/confirm`) | S09 Confirm sheet (**MODIFIED** shape: modal vs route TBD) |
| SCR-207 | Booking confirmed (`/booking/success`) | S10 Success (**MODIFIED**) |
| SCR-301 | My appointments (`/history`) | S11 My appointments (**MODIFIED**) |
| SCR-302 | Appointment details (`/history/:id`) | S12 Appointment details (**MODIFIED**) |
| SCR-208 | (no route today) | S13 Cancel confirmation (**NEW**) |
| SCR-401 | Reschedule appointment (`/reschedule/:id`) | R01 Suggested slots (**MODIFIED**) |
| SCR-402 | Confirm reschedule (`/reschedule/:id/confirm`) | R02 Reschedule confirm (**MODIFIED**) |
| SCR-403 | Rescheduled (`/reschedule/:id/success`) | R03 Reschedule success (**MODIFIED**) |
| SCR-501 | Book again (`/book-again/:id`) | B01 Pre-filled context (**MODIFIED**) |

## Current IA Map (as implemented today)

```mermaid
flowchart TD
  %% Booking N3 current IA (routes)
  subgraph Auth["Auth (required)"]
    SCR101["SCR-101 Sign in & registration<br/>/auth/*"]
  end

  subgraph Profile["Profile (required)"]
    SCR110["SCR-110 Complete profile<br/>/profile/complete"]
  end

  SCR120["SCR-120 Home<br/>/home"]

  subgraph Booking["Booking"]
    SCR201["SCR-201 Choose specialty<br/>/booking/search"]
    SCR202["SCR-202 Choose location & radius<br/>/booking/location"]
    SCR203["SCR-203 Find doctors (results)<br/>/booking/results"]
    SCR204["SCR-204 View doctor profile<br/>/booking/doctor/:id"]
    SCR205["SCR-205 Choose an appointment time<br/>/booking/doctor/:id/slots"]
    SCR206["SCR-206 Confirm appointment<br/>/booking/confirm"]
    SCR207["SCR-207 Booking confirmed<br/>/booking/success"]
  end

  subgraph Appointments["Appointments"]
    SCR301["SCR-301 My appointments<br/>/history"]
    SCR302["SCR-302 Appointment details<br/>/history/:id"]
    SCR401["SCR-401 Reschedule appointment<br/>/reschedule/:id"]
    SCR402["SCR-402 Confirm reschedule<br/>/reschedule/:id/confirm"]
    SCR403["SCR-403 Rescheduled<br/>/reschedule/:id/success"]
    SCR501["SCR-501 Book again<br/>/book-again/:id"]
  end

  subgraph Settings["Settings"]
    SCR601["SCR-601 Settings<br/>/settings"]
    SCR602["SCR-602 Notifications<br/>/settings/notifications"]
  end

  SCR101 --> SCR110 --> SCR120
  SCR120 --> SCR201 --> SCR202 --> SCR203 --> SCR204 --> SCR205 --> SCR206 --> SCR207
  SCR120 --> SCR301
  SCR207 --> SCR301
  SCR301 --> SCR302
  SCR302 --> SCR401 --> SCR402 --> SCR403 --> SCR302
  SCR301 --> SCR501
  SCR120 --> SCR601 --> SCR602
```

## Target IA Map (design-lite v2)

Legend:
- **NEW** = not present as a dedicated screen/modal today
- **MODIFIED** = present today but behavior/content/position changes

```mermaid
flowchart TD
  %% Booking N3 target IA (design-lite v2)
  classDef NEW fill:#E8F6F8,stroke:#13A3B5,color:#0B6F7C,stroke-width:2px;
  classDef MOD fill:#EEF1F3,stroke:#5E7A86,color:#1C2A30,stroke-width:2px;

  subgraph Legend["Legend"]
    LNEW["NEW"]:::NEW
    LMOD["MODIFIED"]:::MOD
  end

  SCR120["SCR-120 (S01) Book an appointment (entry)<br/>/home"]:::MOD

  subgraph Wizard["Wizard (Step 1–4)"]
    SCR201["SCR-201 (S02) Step 1: Choose specialty"]:::MOD
    SCR202["SCR-202 (S03) Step 2: Choose location & radius"]:::MOD
    SCR210["SCR-210 (S04) Step 3: Choose insurance"]:::NEW
    SCR203["SCR-203 (S05) Find doctors (filters/sort)"]:::MOD
  end

  SCR204["SCR-204 (S06) View doctor profile"]:::MOD
  SCR209["SCR-209 (S07) Read reviews"]:::NEW
  SCR205["SCR-205 (S08) Choose an appointment time (calendar)"]:::MOD
  SCR206["SCR-206 (S09) Confirm appointment (sheet)"]:::MOD
  SCR207["SCR-207 (S10) Booking confirmed"]:::MOD

  SCR301["SCR-301 (S11) My appointments (overview)"]:::MOD
  SCR302["SCR-302 (S12) Appointment details (manage)"]:::MOD
  SCR208["SCR-208 (S13) Cancel appointment (confirmation)"]:::NEW

  SCR401["SCR-401 (R01) Reschedule (suggested slots)"]:::MOD
  SCR402["SCR-402 (R02) Confirm reschedule"]:::MOD
  SCR403["SCR-403 (R03) Rescheduled"]:::MOD

  SCR501["SCR-501 (B01) Book again (review context)"]:::MOD

  SCR120 --> SCR201 --> SCR202 --> SCR210 --> SCR203
  SCR203 --> SCR204 --> SCR205 --> SCR206 --> SCR207 --> SCR301 --> SCR302

  %% Key “choose” affordances (high-level)
  SCR203 --> SCR205
  SCR203 --> SCR206
  SCR204 --> SCR209

  %% Manage flows
  SCR302 --> SCR208 --> SCR301
  SCR302 --> SCR401 --> SCR402 --> SCR403 --> SCR302
  SCR401 --> SCR205 --> SCR402
  SCR301 --> SCR501 --> SCR205
```

## Summary of differences (IA-level)

| Type | What changes |
|---|---|
| NEW | S04 Insurance step (`SCR-210`), S07 Reviews list (`SCR-209`), S13 Cancel confirmation (`SCR-208`) |
| MODIFIED | Wizard order (S02→S03→S04→S05), results behavior (filters/sort/cards), confirm as sheet (S09), appointments management (S11/S12), reschedule flow (R01–R03), book again context review (B01) |
| Unchanged (not shown) | Auth, profile, settings (structure remains; styling/copy may still change) |

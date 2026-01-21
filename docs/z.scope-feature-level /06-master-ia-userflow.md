# MedAlpha Connect - Master IA & User Flow

**Version:** 1.0
**Last Updated:** 2026-01-20
**Total Screens:** 49 | **Primary Flows:** 4 | **Cross-Flow Connections:** 8

---

## Table of Contents

1. [Master Information Architecture](#1-master-information-architecture)
2. [Navigation System](#2-navigation-system)
3. [Master User Flow](#3-master-user-flow)
4. [Flow Integration Map](#4-flow-integration-map)
5. [Screen Inventory](#5-screen-inventory)

---

# 1. Master Information Architecture

## 1.1 High-Level Structure

```
MedAlpha Connect
│
├── 🔐 Authentication Layer
│   ├── Welcome
│   ├── Sign In
│   ├── Create Account
│   └── Forgot Password
│
├── 📱 Main Application
│   │
│   ├── 🏠 HOME (Dashboard)
│   │   ├── Upcoming Appointments
│   │   ├── Active Prescriptions
│   │   ├── Quick Actions
│   │   └── Recent Activity
│   │
│   ├── 📅 TERMINE (Appointments)
│   │   ├── Search Doctors
│   │   ├── Doctor Results
│   │   ├── Doctor Profile
│   │   │   ├── About
│   │   │   ├── Services
│   │   │   ├── Reviews
│   │   │   └── Calendar
│   │   ├── Booking Confirmation
│   │   ├── Booking Success
│   │   ├── My Appointments
│   │   └── Appointment Details
│   │
│   ├── 📹 TELEMEDIZIN (Telemedicine)
│   │   ├── Mode Selection
│   │   ├── Select Specialty
│   │   ├── Symptom Check
│   │   │   ├── Symptom Chips
│   │   │   ├── Free Text
│   │   │   └── Photo Upload
│   │   ├── Insurance Confirmation
│   │   ├── [Scheduled] Select Time Slot
│   │   ├── [Now] Waiting Room
│   │   ├── Video Call
│   │   ├── Consultation Summary
│   │   └── My Consultations
│   │
│   ├── 💊 E-REZEPT (E-Prescription)
│   │   ├── Retrieval Options
│   │   ├── [NFC] Card Scan
│   │   ├── [NFC] PIN Entry
│   │   ├── [QR] QR Scanner
│   │   ├── Prescription Details
│   │   ├── Redemption Choice
│   │   ├── [Online] Checkout
│   │   │   ├── Address
│   │   │   ├── Payment
│   │   │   └── Summary
│   │   ├── [Online] Order Confirmation
│   │   ├── [Online] Delivery Tracking
│   │   ├── [Local] Pharmacy Search
│   │   ├── [Local] Pharmacy Reservation
│   │   ├── My Prescriptions
│   │   └── My Orders
│   │
│   ├── 🏪 APOTHEKEN (Pharmacies)
│   │   ├── Map View
│   │   ├── List View
│   │   ├── Filters
│   │   ├── Pharmacy Details
│   │   └── Emergency Pharmacies
│   │
│   └── 👤 PROFILE (Account)
│       ├── Profile Overview
│       ├── Personal Information
│       ├── Insurance Details
│       ├── My Addresses
│       ├── Payment Methods
│       ├── Family Members
│       ├── Activity History
│       ├── Favorite Pharmacies
│       ├── Settings
│       │   ├── Language
│       │   ├── Notifications
│       │   ├── Privacy
│       │   └── Accessibility
│       └── Help & Support
│
└── 🔔 System Overlays
    ├── Push Notifications
    ├── Bottom Sheets
    ├── Error Dialogs
    └── Success Toasts
```

## 1.2 Master IA Diagram

```mermaid
flowchart TB
    subgraph APP["📱 MedAlpha Connect"]
        direction TB

        subgraph AUTH["🔐 Authentication"]
            WELCOME["Welcome"]
            LOGIN["Sign In"]
            REGISTER["Create Account"]
            FORGOT["Forgot Password"]
        end

        subgraph MAIN["Main Application"]
            direction TB

            subgraph NAV["⬇️ Bottom Navigation Bar"]
                direction LR
                TAB1["🏠"]
                TAB2["📅"]
                TAB3["📹"]
                TAB4["💊"]
                TAB5["🏪"]
            end

            subgraph HOME["🏠 HOME"]
                H1["Dashboard"]
                H2["Upcoming"]
                H3["Active Rx"]
                H4["Quick Actions"]
            end

            subgraph APPT["📅 TERMINE"]
                A1["Search"]
                A2["Results"]
                A3["Profile"]
                A4["Calendar"]
                A5["Confirm"]
                A6["Success"]
                A7["My Appts"]
                A8["Details"]
            end

            subgraph TELE["📹 TELEMEDIZIN"]
                T1["Entry"]
                T2["Specialty"]
                T3["Symptoms"]
                T4["Insurance"]
                T5["Slot Select"]
                T6["Waiting"]
                T7["Video Call"]
                T8["Summary"]
                T9["My Consults"]
            end

            subgraph ERX["💊 E-REZEPT"]
                E1["Entry"]
                E2["NFC Scan"]
                E3["PIN"]
                E4["QR Scan"]
                E5["Details"]
                E6["Choice"]
                E7["Checkout"]
                E8["Order OK"]
                E9["Tracking"]
                E10["Pharm Search"]
                E11["Reserve"]
                E12["My Rx"]
                E13["My Orders"]
            end

            subgraph PHARM["🏪 APOTHEKEN"]
                P1["Map"]
                P2["List"]
                P3["Filters"]
                P4["Details"]
                P5["Emergency"]
            end

            subgraph PROFILE["👤 PROFILE"]
                PR1["Overview"]
                PR2["Personal"]
                PR3["Insurance"]
                PR4["Addresses"]
                PR5["Payment"]
                PR6["Family"]
                PR7["History"]
                PR8["Favorites"]
                PR9["Settings"]
                PR10["Help"]
            end
        end
    end

    %% Auth Flow
    WELCOME --> LOGIN
    WELCOME --> REGISTER
    LOGIN --> H1
    REGISTER --> H1

    %% Tab Navigation
    TAB1 --> H1
    TAB2 --> A1
    TAB3 --> T1
    TAB4 --> E1
    TAB5 --> P1

    %% Profile Access
    H1 -.-> PR1

    %% Appointment Flow
    A1 --> A2 --> A3 --> A4 --> A5 --> A6
    A3 --> A5
    A7 --> A8

    %% Telemedicine Flow
    T1 --> T2 --> T3 --> T4
    T4 --> T5 --> T6
    T4 --> T6
    T6 --> T7 --> T8

    %% E-Rezept Flow
    E1 --> E2 --> E3 --> E5
    E1 --> E4 --> E5
    E5 --> E6
    E6 --> E7 --> E8 --> E9
    E6 --> E10 --> E11

    %% Pharmacy Flow
    P1 <--> P2
    P1 --> P3
    P1 --> P4
    P2 --> P4

    %% Cross-Flow Connections
    T8 -.->|"Rx issued"| E5
    E10 -.->|"Same data"| P1
    H2 -.-> A8
    H3 -.-> E5

    style APP fill:#fafafa
    style AUTH fill:#ffebee,stroke:#c62828
    style HOME fill:#e8f5e9,stroke:#2e7d32
    style APPT fill:#fff3e0,stroke:#ef6c00
    style TELE fill:#fce4ec,stroke:#c2185b
    style ERX fill:#f3e5f5,stroke:#7b1fa2
    style PHARM fill:#e0f7fa,stroke:#00838f
    style PROFILE fill:#fff8e1,stroke:#f9a825
    style NAV fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
```

---

# 2. Navigation System

## 2.1 Primary Navigation (Bottom Tab Bar)

| Tab | Icon | Label | Default Screen | Badge |
|-----|------|-------|----------------|-------|
| 1 | 🏠 | Home | Dashboard | - |
| 2 | 📅 | Termine | Search Doctors | Upcoming count |
| 3 | 📹 | Telemedizin | Mode Selection | - |
| 4 | 💊 | E-Rezept | Retrieval Options | Active Rx count |
| 5 | 🏪 | Apotheken | Map View | - |

## 2.2 Secondary Navigation

| Location | Type | Trigger |
|----------|------|---------|
| Profile | Header icon | Tap avatar/icon in header |
| Back | Header left | Tap back arrow |
| Search | In-screen | Search bar in relevant screens |
| Filters | Bottom sheet | Tap filter button |
| Actions | Context menu | Long press or overflow menu |

## 2.3 Navigation Patterns

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NAVIGATION PATTERNS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LINEAR FLOW (Booking, Telemedicine, E-Rezept)                             │
│  ┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐                               │
│  │ S1 │ → │ S2 │ → │ S3 │ → │ S4 │ → │ S5 │                               │
│  └────┘   └────┘   └────┘   └────┘   └────┘                               │
│     ←        ←        ←        ←                                           │
│  (Back navigation available at each step)                                  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  BRANCHING FLOW (E-Rezept redemption)                                      │
│                    ┌────┐                                                   │
│                 ┌─→│ S3A│ → [Online Path]                                  │
│  ┌────┐   ┌────┐│  └────┘                                                   │
│  │ S1 │ → │ S2 │┤                                                           │
│  └────┘   └────┘│  ┌────┐                                                   │
│                 └─→│ S3B│ → [Local Path]                                   │
│                    └────┘                                                   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  HUB & SPOKE (Pharmacy, Profile)                                           │
│           ┌────┐                                                            │
│        ┌─→│ S2 │                                                            │
│        │  └────┘                                                            │
│  ┌────┐│  ┌────┐                                                            │
│  │ HUB│┼─→│ S3 │                                                            │
│  └────┘│  └────┘                                                            │
│        │  ┌────┐                                                            │
│        └─→│ S4 │                                                            │
│           └────┘                                                            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  CROSS-FLOW JUMP (Telemedicine → E-Rezept)                                 │
│                                                                             │
│  [Flow A]                    [Flow B]                                       │
│  ┌────┐   ┌────┐            ┌────┐   ┌────┐                                │
│  │ A1 │ → │ A2 │ ·········→ │ B3 │ → │ B4 │                                │
│  └────┘   └────┘   (deep    └────┘   └────┘                                │
│                    link)                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 3. Master User Flow

## 3.1 Complete User Journey Map

```mermaid
flowchart TB
    subgraph ENTRY["🚀 Entry Points"]
        APP_LAUNCH["App Launch"]
        PUSH_NOTIF["Push Notification"]
        DEEP_LINK["Deep Link"]
    end

    subgraph AUTH["🔐 Authentication"]
        WELCOME["Welcome Screen"]
        LOGIN["Sign In"]
        REGISTER["Create Account"]
    end

    subgraph HOME_HUB["🏠 Home Hub"]
        DASHBOARD["Dashboard"]
        UPCOMING["Upcoming Items"]
        QUICK_ACTIONS["Quick Actions"]
    end

    subgraph FLOW_BOOKING["📅 FLOW: Book Appointment"]
        direction TB
        B1["Search Doctors"]
        B2["View Results"]
        B3["Doctor Profile"]
        B4["Select Time"]
        B5["Confirm Booking"]
        B6["✅ Booking Success"]

        B1 --> B2
        B2 --> B3
        B3 --> B4
        B4 --> B5
        B5 --> B6
    end

    subgraph FLOW_TELE["📹 FLOW: Telemedicine"]
        direction TB
        T1["Select Mode"]
        T2["Choose Specialty"]
        T3["Describe Symptoms"]
        T4["Confirm Insurance"]

        subgraph T_BRANCH["Mode Branch"]
            T5A["Wait in Queue"]
            T5B["Select Slot"]
        end

        T6["Video Call"]
        T7["✅ Summary"]

        T1 --> T2 --> T3 --> T4
        T4 -->|"Now"| T5A
        T4 -->|"Scheduled"| T5B
        T5A --> T6
        T5B -.->|"At time"| T6
        T6 --> T7
    end

    subgraph FLOW_ERX["💊 FLOW: E-Prescription"]
        direction TB
        E1["Choose Method"]

        subgraph E_RETRIEVE["Retrieval"]
            E2A["NFC Scan"]
            E2B["Enter PIN"]
            E2C["QR Scan"]
        end

        E3["View Details"]
        E4["Choose Path"]

        subgraph E_ONLINE["Online Path"]
            E5A["Checkout"]
            E5B["✅ Order Confirmed"]
            E5C["Track Delivery"]
        end

        subgraph E_LOCAL["Local Path"]
            E6A["Find Pharmacy"]
            E6B["✅ Reservation"]
        end

        E1 -->|"NFC"| E2A --> E2B --> E3
        E1 -->|"QR"| E2C --> E3
        E1 -->|"In-App"| E3
        E3 --> E4
        E4 -->|"Online"| E5A --> E5B --> E5C
        E4 -->|"Local"| E6A --> E6B
    end

    subgraph FLOW_PHARM["🏪 FLOW: Find Pharmacy"]
        direction TB
        P1["Map View"]
        P2["Apply Filters"]
        P3["Select Pharmacy"]
        P4["View Details"]
        P5["✅ Get Directions"]

        P1 --> P2 --> P3 --> P4 --> P5
    end

    subgraph OUTCOMES["🎯 Outcomes"]
        OUT1["📅 Appointment Booked"]
        OUT2["💬 Consultation Complete"]
        OUT3["📦 Medication Ordered"]
        OUT4["🏪 Medication Reserved"]
        OUT5["🗺️ Navigate to Pharmacy"]
    end

    %% Entry connections
    APP_LAUNCH --> WELCOME
    PUSH_NOTIF --> DASHBOARD
    DEEP_LINK --> DASHBOARD

    WELCOME --> LOGIN
    WELCOME --> REGISTER
    LOGIN --> DASHBOARD
    REGISTER --> DASHBOARD

    %% Hub connections
    DASHBOARD --> QUICK_ACTIONS
    QUICK_ACTIONS -->|"Book"| B1
    QUICK_ACTIONS -->|"Consult"| T1
    QUICK_ACTIONS -->|"E-Rezept"| E1
    QUICK_ACTIONS -->|"Pharmacy"| P1

    UPCOMING -->|"Tap Appt"| B3
    UPCOMING -->|"Tap Rx"| E3

    %% Flow outcomes
    B6 --> OUT1
    T7 --> OUT2
    E5B --> OUT3
    E6B --> OUT4
    P5 --> OUT5

    %% Cross-flow connections
    T7 -.->|"If Rx issued"| E3
    E6A -.->|"Uses"| P1
    OUT2 -.->|"Follow-up"| B1

    style ENTRY fill:#e3f2fd
    style AUTH fill:#ffebee
    style HOME_HUB fill:#e8f5e9
    style FLOW_BOOKING fill:#fff3e0
    style FLOW_TELE fill:#fce4ec
    style FLOW_ERX fill:#f3e5f5
    style FLOW_PHARM fill:#e0f7fa
    style OUTCOMES fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

## 3.2 Flow Summary Table

| Flow | Entry Points | Steps | Branches | Outcomes | Avg. Screens |
|------|--------------|-------|----------|----------|--------------|
| **Book Appointment** | Tab, Home, Deep Link | 6 | 2 (Quick/Profile) | Appointment confirmed | 4-6 |
| **Telemedicine** | Tab, Home, Deep Link | 7 | 2 (Now/Scheduled) | Consultation complete, Rx | 5-7 |
| **E-Prescription** | Tab, Home, Tele Summary | 6-8 | 3 (NFC/QR/In-app) + 2 (Online/Local) | Order placed, Reserved | 5-8 |
| **Find Pharmacy** | Tab, E-Rezept, Deep Link | 5 | 2 (Map/List) | Directions, Reservation | 3-5 |

---

# 4. Flow Integration Map

## 4.1 Cross-Flow Connections

```mermaid
flowchart LR
    subgraph BOOKING["📅 Booking"]
        B_SUCCESS["Booking Success"]
        B_DETAIL["Appointment Detail"]
    end

    subgraph TELE["📹 Telemedicine"]
        T_SUMMARY["Consultation Summary"]
        T_FOLLOWUP["Follow-up CTA"]
    end

    subgraph ERX["💊 E-Prescription"]
        E_ENTRY["E-Rezept Entry"]
        E_DETAILS["Prescription Details"]
        E_LOCAL["Local Pharmacy Path"]
    end

    subgraph PHARM["🏪 Pharmacy"]
        P_MAP["Pharmacy Map"]
        P_DETAIL["Pharmacy Details"]
    end

    subgraph HOME["🏠 Home"]
        H_UPCOMING["Upcoming Appts"]
        H_ACTIVE_RX["Active Prescriptions"]
    end

    %% Cross-flow connections
    T_SUMMARY -->|"1. Rx issued"| E_DETAILS
    T_FOLLOWUP -->|"2. Book follow-up"| B_DETAIL
    E_LOCAL -->|"3. Find pharmacy"| P_MAP
    P_DETAIL -->|"4. Reserve here"| E_DETAILS

    H_UPCOMING -->|"5. View"| B_DETAIL
    H_ACTIVE_RX -->|"6. Redeem"| E_DETAILS

    B_SUCCESS -->|"7. Add to calendar"| CALENDAR["📆 Device Calendar"]
    B_SUCCESS -->|"8. Get directions"| MAPS["🗺️ Maps App"]
    P_DETAIL -->|"9. Get directions"| MAPS

    style BOOKING fill:#fff3e0
    style TELE fill:#fce4ec
    style ERX fill:#f3e5f5
    style PHARM fill:#e0f7fa
    style HOME fill:#e8f5e9
```

## 4.2 Integration Points Detail

| # | From | To | Trigger | Data Passed | User Action |
|---|------|-----|---------|-------------|-------------|
| 1 | Telemedicine Summary | E-Rezept Details | Prescription issued | Prescription ID | Tap "E-Rezept öffnen" |
| 2 | Telemedicine Summary | Booking | Doctor recommends | Specialty, Doctor ID | Tap "Folgetermin buchen" |
| 3 | E-Rezept (Local) | Pharmacy Map | User chooses local | Prescription data | Tap "Apotheke wählen" |
| 4 | Pharmacy Details | E-Rezept Reserve | In E-Rezept context | Pharmacy ID | Tap "E-Rezept einlösen" |
| 5 | Home Upcoming | Appointment Details | User views upcoming | Appointment ID | Tap appointment card |
| 6 | Home Active Rx | E-Rezept Details | User views active | Prescription ID | Tap prescription card |
| 7 | Booking Success | Device Calendar | User wants reminder | Event data | Tap "Zum Kalender" |
| 8 | Booking Success | Maps App | User needs directions | Address | Tap "Route öffnen" |
| 9 | Pharmacy Details | Maps App | User needs directions | Address | Tap "Route" |

## 4.3 Deep Link Scheme

| Deep Link | Destination | Parameters |
|-----------|-------------|------------|
| `medalpha://home` | Dashboard | - |
| `medalpha://appointments` | Search Doctors | `specialty`, `location` |
| `medalpha://appointments/:id` | Appointment Details | `id` |
| `medalpha://telemedicine` | Mode Selection | `mode` (now/scheduled) |
| `medalpha://telemedicine/call/:id` | Join Video Call | `consultationId` |
| `medalpha://e-rezept` | Retrieval Options | - |
| `medalpha://e-rezept/:id` | Prescription Details | `prescriptionId` |
| `medalpha://pharmacies` | Pharmacy Map | `lat`, `lng`, `filter` |
| `medalpha://pharmacies/:id` | Pharmacy Details | `pharmacyId` |
| `medalpha://profile` | Profile Overview | - |

---

# 5. Screen Inventory

## 5.1 Complete Screen List by Section

### 🔐 Authentication (4 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| AUTH-01 | Welcome | First launch, value prop | App launch (first time) |
| AUTH-02 | Sign In | Login with credentials | Welcome, Sign out |
| AUTH-03 | Create Account | New user registration | Welcome |
| AUTH-04 | Forgot Password | Password recovery | Sign In |

### 🏠 Home (1 screen, 4 sections)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| HOME-01 | Dashboard | Central hub with overview | Tab, Login |

### 📅 Appointments (8 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| APPT-01 | Search Doctors | Specialty + location input | Tab, Home |
| APPT-02 | Doctor Results | List of matching doctors | Search |
| APPT-03 | Doctor Profile | Doctor info, reviews | Results |
| APPT-04 | Doctor Calendar | Full week time slots | Profile |
| APPT-05 | Booking Confirmation | Confirm details (bottom sheet) | Slot tap |
| APPT-06 | Booking Success | Confirmation + next actions | Confirm |
| APPT-07 | My Appointments | List of booked appointments | Tab overflow |
| APPT-08 | Appointment Details | Single appointment view | List tap |

### 📹 Telemedicine (9 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| TELE-01 | Mode Selection | Now vs. Scheduled choice | Tab, Home |
| TELE-02 | Select Specialty | Medical specialty picker | Mode |
| TELE-03 | Symptom Check | Describe symptoms | Specialty |
| TELE-04 | Insurance Confirmation | Verify insurance | Symptoms |
| TELE-05 | Select Time Slot | Pick scheduled time | Insurance (scheduled) |
| TELE-06 | Waiting Room | Queue position + tips | Insurance (now), Slot |
| TELE-07 | Video Call | Live consultation | Ready notification |
| TELE-08 | Consultation Summary | Diagnosis + next steps | Call end |
| TELE-09 | My Consultations | Past consultations list | Tab overflow |

### 💊 E-Prescription (13 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| ERX-01 | Retrieval Options | NFC/QR/In-app choice | Tab, Home, Tele |
| ERX-02 | NFC Scan | Card scan instructions | Entry (NFC) |
| ERX-03 | PIN Entry | 6-digit PIN input | NFC success |
| ERX-04 | QR Scan | Camera QR scanner | Entry (QR) |
| ERX-05 | Prescription Details | Medications + costs | PIN/QR/In-app |
| ERX-06 | Redemption Choice | Online vs. Local | Details |
| ERX-07 | Online Checkout | Address + payment | Choice (online) |
| ERX-08 | Order Confirmation | Success + order number | Checkout |
| ERX-09 | Delivery Tracking | Timeline status | Confirmation |
| ERX-10 | Pharmacy Search | Map for local pickup | Choice (local) |
| ERX-11 | Pharmacy Reservation | Reserve confirmation | Pharmacy select |
| ERX-12 | My Prescriptions | All prescriptions list | Tab overflow |
| ERX-13 | My Orders | Order history | Profile |

### 🏪 Pharmacies (5 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| PHARM-01 | Map View | Map with pharmacy pins | Tab |
| PHARM-02 | List View | Pharmacy cards list | Map toggle |
| PHARM-03 | Filters | Filter options (bottom sheet) | Map/List |
| PHARM-04 | Pharmacy Details | Full pharmacy info | Pin/Card tap |
| PHARM-05 | Emergency Pharmacies | Notdienst list | Filter |

### 👤 Profile (10 screens)

| ID | Screen | Purpose | Entry |
|----|--------|---------|-------|
| PROF-01 | Profile Overview | Account summary | Header icon |
| PROF-02 | Personal Information | Name, email, phone | Overview |
| PROF-03 | Insurance Details | GKV/PKV info | Overview |
| PROF-04 | My Addresses | Saved addresses | Overview |
| PROF-05 | Payment Methods | Cards, PayPal | Overview |
| PROF-06 | Family Members | Dependent profiles | Overview |
| PROF-07 | Activity History | Past appointments, orders | Overview |
| PROF-08 | Favorite Pharmacies | Saved pharmacies | Overview |
| PROF-09 | Settings | App preferences | Overview |
| PROF-10 | Help & Support | FAQ, contact | Overview |

## 5.2 Screen Count Summary

| Section | Screens | Percentage |
|---------|---------|------------|
| Authentication | 4 | 8% |
| Home | 1 | 2% |
| Appointments | 8 | 16% |
| Telemedicine | 9 | 18% |
| E-Prescription | 13 | 27% |
| Pharmacies | 5 | 10% |
| Profile | 10 | 20% |
| **Total** | **50** | **100%** |

## 5.3 Screen Complexity Matrix

| Screen | Objects | Actions | Complexity |
|--------|---------|---------|------------|
| Dashboard (HOME-01) | 4 | 6 | High |
| Doctor Results (APPT-02) | 3 | 5 | High |
| Symptom Check (TELE-03) | 2 | 4 | Medium |
| Video Call (TELE-07) | 2 | 5 | High |
| Prescription Details (ERX-05) | 3 | 4 | Medium |
| Online Checkout (ERX-07) | 3 | 3 | Medium |
| Pharmacy Map (PHARM-01) | 2 | 5 | High |
| Profile Overview (PROF-01) | 1 | 8 | Medium |

---

## Appendix: Quick Reference

### Flow Entry Points

| Flow | Primary Entry | Secondary Entries |
|------|---------------|-------------------|
| Booking | Tab "Termine" | Home quick action, Deep link |
| Telemedicine | Tab "Telemedizin" | Home quick action, Deep link |
| E-Prescription | Tab "E-Rezept" | Home active Rx, Tele summary, Deep link |
| Pharmacy | Tab "Apotheken" | E-Rezept local path, Deep link |

### Flow Exit Points

| Flow | Success Exit | Alternative Exits |
|------|--------------|-------------------|
| Booking | Calendar/Maps integration | Back to home |
| Telemedicine | E-Rezept / Follow-up booking | Back to home |
| E-Prescription | Tracking / Pharmacy directions | Back to home |
| Pharmacy | Maps directions / E-Rezept reserve | Back to home |

### Key Metrics per Flow

| Flow | Primary KPI | Target |
|------|-------------|--------|
| Booking | Completion rate | >60% |
| Telemedicine | Consultation completion | >80% |
| E-Prescription | Redemption rate | >70% |
| Pharmacy | Route action rate | >50% |

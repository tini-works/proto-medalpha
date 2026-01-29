# Info Map

Notes: This document is derived from SCOPE-FOR-EXPLORATION.md. Items listed under Assumptions are inferred and not explicitly stated in the source.

## High-Level Structure

```
MedAlpha Connect (dm)
│
├── Authentication
│   ├── Welcome
│   ├── Sign In
│   ├── Create Account
│   ├── Verify (Email/SMS)
│   └── Forgot Password
│
├── Main Application
│   │
│   ├── HOME (Dashboard)
│   │   ├── Personalized Content (CMS)
│   │   ├── dm Deals & Payback
│   │   ├── Health Tips
│   │   ├── Upcoming Appointments
│   │   ├── Active Prescriptions
│   │   └── Quick Actions
│   │
│   ├── TERMINE (Booking)
│   │   ├── Search
│   │   │   ├── Doctor Search
│   │   │   ├── Health Check Search
│   │   │   └── Beauty Service Search
│   │   ├── Results List
│   │   ├── Provider/Service Details (pre-booking)
│   │   ├── Review & Confirm (patient selection)
│   │   ├── Payment (beauty only; optional)
│   │   ├── Booking Success
│   │   └── My Appointments
│   │       ├── Appointment Details
│   │       ├── Cancel / Reschedule
│   │       ├── Add to Calendar
│   │       └── Reminders
│   │
│   ├── TELEMEDIZIN
│   │   ├── Entry (Specialty Select)
│   │   ├── Patient Selection
│   │   ├── Symptom Input
│   │   ├── Teleclinic WebView
│   │   ├── Consultation Summary
│   │   └── My Consultations
│   │
│   ├── E-REZEPT
│   │   ├── Entry (Online/Offline Choice)
│   │   ├── NFC Scan
│   │   ├── Prescription Details
│   │   ├── Fulfillment Choice
│   │   │   ├── Delivery Checkout
│   │   │   └── Click & Collect (Store Select)
│   │   ├── Order Confirmation
│   │   ├── Order Tracking
│   │   └── My Prescriptions
│   │
│   ├── STORES (dm + Pharmacies)
│   │   ├── Map View
│   │   ├── List View
│   │   ├── Filters
│   │   ├── Store Details
│   │   └── Directions
│   │
│   ├── VERLAUF (History)
│   │   ├── All History
│   │   ├── Filters
│   │   ├── Item Details
│   │   └── Export
│   │
│   └── PROFILE
│       ├── Overview
│       ├── Personal Info
│       ├── Insurance
│       ├── Addresses
│       ├── Family Members
│       ├── Payback
│       ├── dm Account Link
│       ├── Notifications Settings
│       └── Help & Support
│
└── System Layer
    ├── Push Notifications
    ├── Deep Links
    ├── Bottom Sheets
    └── Modals
```

### Assumptions

- Bottom navigation exists with tabs: Home, Termine, Tele, E-Rezept, Stores, Verlauf.
- Dedicated Stores section exists separate from the E-Rezept flow.
- Dedicated Profile section includes Payback, dm Account Link, Notification Settings, Help & Support.
- Forgot Password screen exists in Authentication.
- System Layer grouping (Push Notifications, Deep Links, Bottom Sheets, Modals) exists.

## Master IA Diagram

```mermaid
flowchart TB
    subgraph APP["MedAlpha Connect (dm)"]
        direction TB

        subgraph AUTH["Authentication"]
            A1[Welcome]
            A2[Sign In]
            A3[Create Account]
            A4[Verify]
            A5[Forgot Password]
        end

        subgraph MAIN["Main App"]
            direction TB

            subgraph NAV["Bottom Navigation"]
                direction LR
                N1["Home"]
                N2["Termine"]
                N3["Tele"]
                N4["E-Rezept"]
                N5["Stores"]
                N6["Verlauf"]
            end

            subgraph HOME["HOME"]
                H1[Dashboard]
                H2[Deals/Payback]
                H3[Health Tips]
                H4[Upcoming]
                H5[Quick Actions]
            end

            subgraph BOOKING["TERMINE"]
                B1[Search]
                B2[Results]
                B3["Details (Pre-book)"]
                B4["Review & Confirm"]
                B5[Success]
                B6[My Appts]
            end

            subgraph TELE["TELEMEDIZIN"]
                T1[Entry]
                T2[Patient]
                T3[Symptoms]
                T4[WebView]
                T5[Summary]
                T6[My Consults]
            end

            subgraph ERX["E-REZEPT"]
                E1[Entry]
                E2[NFC Scan]
                E3[Details]
                E4[Fulfillment]
                E5[Checkout]
                E6[Tracking]
                E7[My Rx]
            end

            subgraph STORES["STORES"]
                S1[Map]
                S2[List]
                S3[Filters]
                S4[Details]
            end

            subgraph HISTORY["VERLAUF"]
                HI1[All History]
                HI2[Filters]
                HI3[Details]
                HI4[Export]
            end

            subgraph PROFILE["PROFILE"]
                P1[Overview]
                P2[Personal]
                P3[Insurance]
                P4[Addresses]
                P5[Family]
                P6[Payback]
                P7[Settings]
            end
        end
    end

    %% Auth Flow
    A1 --> A2
    A1 --> A3
    A3 --> A4
    A2 --> H1
    A4 --> H1

    %% Tab Navigation
    N1 --> H1
    N2 --> B1
    N3 --> T1
    N4 --> E1
    N5 --> S1
    N6 --> HI1

    %% Profile access
    H1 -.-> P1

    %% Booking flow
    B1 --> B2 --> B3 --> B4 --> B5
    B5 -.->|View appointments| B6

    %% Telemedicine flow
    T1 --> T2 --> T3 --> T4 --> T5

    %% E-Rezept flow
    E1 --> E2 --> E3 --> E4 --> E5 --> E6

    %% Store flow
    S1 <--> S2
    S1 --> S3
    S1 --> S4

    %% History flow
    HI1 --> HI2
    HI1 --> HI3
    HI3 --> HI4

    %% Cross-flow
    T5 -.->|Rx issued| E3
    E4 -.->|Click &amp; Collect| S1
    H4 -.->|Upcoming tap| B6
    H5 -.-> B1
    H5 -.-> T1
    H5 -.-> E1

    style APP fill:#ffffff,stroke:#9e9e9e,stroke-width:2px
    style AUTH fill:#e8f5e9,stroke:#2e7d32
    style NAV fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    style HOME fill:#e8f5e9,stroke:#2e7d32
    style BOOKING fill:#e8f5e9,stroke:#2e7d32
    style TELE fill:#e8f5e9,stroke:#2e7d32
    style ERX fill:#e8f5e9,stroke:#2e7d32
    style STORES fill:#e8f5e9,stroke:#2e7d32
    style HISTORY fill:#e8f5e9,stroke:#2e7d32
    style PROFILE fill:#e8f5e9,stroke:#2e7d32
```

Note: The diagram reflects the assumptions listed above.

## Navigation Paths

| Flow | Primary Path | Optimized For | Alternative |
|------|--------------|---------------|-------------|
| Registration | Welcome → Create → Verify → Profile | New users | SSO via dm account |
| Booking | Tab → Search → Results → Book → My Appts | Discovery | Home → Quick Action |
| Telemedicine | Tab → Specialty → Symptoms → Video | Speed | Post-appointment prompt |
| Online Rx | Tab → NFC → Details → Checkout | Convenience | Telemedicine → Rx CTA |
| Offline Rx | Tab → Map → Select → Directions | Local pickup | Click & Collect from E-Rezept |
| History | Tab → Filter → Details → Export | Records | Home → Upcoming tap |
| Home | App Open → Dashboard | Engagement | Notification deep link |


### Key dm Integration Points

- **SSO** - Link existing dm account at registration
- **Click & Collect** - Pickup at dm stores for E-Rezept
- **In-Store Services** - Health checks and beauty bookings
- **Payback** - Loyalty points on orders
- **Deals** - dm promotions on home screen via CMS
- **Store Finder** - dm + pharmacy locations unified

## Screen Inventory

| Screen ID | Section | Screen Name | Description |
|-----------|---------|-------------|-------------|
| AUTH-001 | Authentication | Welcome | App entry point with sign in/create account options |
| AUTH-002 | Authentication | Sign In | Email/password login form |
| AUTH-003 | Authentication | Create Account | Registration form for new users |
| AUTH-004 | Authentication | Verify | Email/SMS verification code entry |
| AUTH-005 | Authentication | Forgot Password | Password reset request flow |
| HOME-001 | Home | Dashboard | Main landing screen with personalized content |
| HOME-002 | Home | Deals & Payback | dm promotions and loyalty offers |
| HOME-003 | Home | Health Tips | CMS-driven health content |
| BOOK-001 | Termine | Search | Doctor/service search with filters |
| BOOK-002 | Termine | Results List | Search results with provider cards |
| BOOK-003 | Termine | Provider Details | Provider info, availability, reviews |
| BOOK-004 | Termine | Review & Confirm | Patient selection and booking summary |
| BOOK-005 | Termine | Payment | Beauty service payment (optional) |
| BOOK-006 | Termine | Booking Success | Confirmation with calendar add option |
| BOOK-007 | Termine | My Appointments | List of upcoming/past appointments |
| BOOK-008 | Termine | Appointment Details | Single appointment view with actions |
| BOOK-009 | Termine | Cancel/Reschedule | Appointment modification flow |
| TELE-001 | Telemedizin | Entry | Specialty selection screen |
| TELE-002 | Telemedizin | Patient Selection | Choose patient for consultation |
| TELE-003 | Telemedizin | Symptom Input | Symptom questionnaire |
| TELE-004 | Telemedizin | Teleclinic WebView | Video consultation (embedded) |
| TELE-005 | Telemedizin | Consultation Summary | Post-consultation notes and actions |
| TELE-006 | Telemedizin | My Consultations | Consultation history list |
| ERX-001 | E-Rezept | Entry | Online/Offline prescription choice |
| ERX-002 | E-Rezept | NFC Scan | eGK card scanning screen |
| ERX-003 | E-Rezept | Prescription Details | Medication info and options |
| ERX-004 | E-Rezept | Fulfillment Choice | Delivery vs Click & Collect selection |
| ERX-005 | E-Rezept | Delivery Checkout | Shipping and payment for delivery |
| ERX-006 | E-Rezept | Store Select | Click & Collect pharmacy selection |
| ERX-007 | E-Rezept | Order Confirmation | Order placed confirmation |
| ERX-008 | E-Rezept | Order Tracking | Delivery/pickup status tracking |
| ERX-009 | E-Rezept | My Prescriptions | Prescription history list |
| STORE-001 | Stores | Map View | dm + pharmacy locations on map |
| STORE-002 | Stores | List View | Store results in list format |
| STORE-003 | Stores | Filters | Store type/service filters |
| STORE-004 | Stores | Store Details | Individual store info and services |
| STORE-005 | Stores | Directions | Navigation to selected store |
| HIST-001 | Verlauf | All History | Unified activity timeline |
| HIST-002 | Verlauf | Filters | Filter by type, date, status |
| HIST-003 | Verlauf | Item Details | Single history item view |
| HIST-004 | Verlauf | Export | Export records (PDF/email) |
| PROF-001 | Profile | Overview | Profile summary and quick links |
| PROF-002 | Profile | Personal Info | Name, DOB, contact details |
| PROF-003 | Profile | Insurance | Insurance card and info |
| PROF-004 | Profile | Addresses | Delivery addresses management |
| PROF-005 | Profile | Family Members | Dependent profiles management |
| PROF-006 | Profile | Payback | Payback account linking |
| PROF-007 | Profile | dm Account Link | dm account connection |
| PROF-008 | Profile | Notifications | Push notification preferences |
| PROF-009 | Profile | Help & Support | FAQ, contact, legal info |
| SYS-001 | System | Bottom Sheet | Reusable modal sheet component |
| SYS-002 | System | Modal Dialog | Alert/confirmation dialogs |
| SYS-003 | System | Push Notification | Notification display handler |

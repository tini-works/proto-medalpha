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
│   │   ├── Provider/Service Details
│   │   ├── Booking Confirmation
│   │   ├── Booking Success
│   │   └── My Appointments
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
                B3[Details]
                B4[Confirm]
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
    T5 -.->|"Rx issued"| E3
    E4 -.->|"Click & Collect"| S1
    H4 -.-> B3
    H5 -.-> B1
    H5 -.-> T1
    H5 -.-> E1

    style APP fill:#fafafa
    style AUTH fill:#ffebee
    style NAV fill:#e3f2fd,stroke:#1565c0,stroke-width:3px
    style HOME fill:#e8f5e9
    style BOOKING fill:#fff3e0
    style TELE fill:#fce4ec
    style ERX fill:#f3e5f5
    style STORES fill:#fff8e1
    style HISTORY fill:#e0f7fa
    style PROFILE fill:#f5f5f5
```

Note: The diagram reflects the assumptions listed above.

## Navigation Paths

| Flow | Primary Path | Optimized For | Alternative |
|------|--------------|---------------|-------------|
| Registration | Welcome → Create → Verify → Profile | New users | SSO via dm account |
| Booking | Tab → Search → Results → Book | Discovery | Home → Quick Action |
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

# IA Map - MedAlpha Connect v1 (Curaay Appointments)

**Generated From:** N3 App Implementation + SCOPE-FOR-EXPLORATION.md
**Date:** 2026-01-23
**Purpose:** Document v1 Information Architecture showing future state with NEW/MODIFIED indicators relative to full vision

---

## Summary of Changes

### Scope Comparison

| Full Vision | v1 Scope |
|-------------|----------|
| 6 Bottom Tabs | 4 Bottom Tabs |
| Telemedicine | OUT |
| E-Rezept (Prescriptions) | OUT |
| Stores Section | OUT |
| Health Checks / Beauty Booking | OUT |
| SSO / dm Account Link | OUT |
| Payback Integration | OUT |

### NEW Elements (v1 Implementation)

| Element | Type | Description |
|---------|------|-------------|
| Profile Completion Gate | Flow | Mandatory profile completion before accessing core features |
| Location Step | Screen | Dedicated location/radius selection in booking flow |
| Slot Selection | Screen | Dedicated time slot picker with date carousel |
| Booking Confirmation Modal | Component | Bottom sheet confirmation with patient selector |
| Tab Toggle (Upcoming/Past) | Component | History filtering via toggle instead of filters |
| Quick Actions | Component | Home screen shortcuts to Book and Family |
| For You (CMS) | Section | Insurance-specific health content on home |

### MODIFIED Elements (Reduced from Full Vision)

| Element | Full Vision | v1 Scope | Change |
|---------|-------------|----------|--------|
| Bottom Navigation | 6 tabs (Home, Termine, Tele, E-Rezept, Stores, Verlauf) | 4 tabs (Home, Book, History, Settings) | Simplified |
| Booking Types | Doctor + Health Check + Beauty | Doctor only (Curaay) | Reduced |
| History | All types (appointments, orders, purchases) with export | Appointments only (upcoming/past) | Reduced |
| Profile Section | Dedicated section with Payback, dm Link, Help | Settings screen with family & notifications | Simplified |
| Home Content | Deals, Payback, Health Tips, Active Rx, Quick Actions | Quick Actions, Upcoming, For You (CMS) | Reduced |
| Verification | Email + SMS options | Email only | Simplified |

### Navigation Changes

| Navigation | Full Vision | v1 (N3) |
|------------|-------------|---------|
| Primary Nav | 6 tabs | 4 tabs |
| Profile Access | Dedicated tab or section | Via Settings screen |
| Booking Entry | Termine tab → Type selection | Book tab → Specialty search |
| History Entry | Verlauf tab with filters | History tab with toggle |

### Data Model (v1)

```
User
├── id, fullName, email, phone
├── insuranceType (GKV | PKV)
├── egkNumber
├── address { street, postalCode, city }
├── familyMembers[]
│   ├── id, name, dateOfBirth
│   ├── relationship (child | spouse | parent | other)
│   └── insuranceType, egkNumber (optional)
├── gdprConsent { dataProcessing, marketing, consentDate }
└── preferences { fontScale, notifications }

Appointment
├── id, doctorId, doctorName, specialty
├── dateISO, time
├── forUserId, forUserName (patient)
├── status (confirmed | completed | cancelled)
└── reminderSet, calendarSynced

Doctor (from Curaay API)
├── id, name, specialty, city, address
├── rating, reviewCount
├── accepts[] (GKV, PKV)
├── nextAvailableISO
└── imageUrl, about, languages

SearchFilters
├── specialty, city
├── insuranceType
└── radius
```

---

## High-Level Structure (v1)

```
MedAlpha Connect v1
│
├── Authentication
│   ├── Welcome
│   ├── Sign In
│   ├── Register                         [NEW - simplified from Create Account]
│   └── Verify (Email only)              [MODIFIED - no SMS option]
│
├── Profile Completion                   [NEW - mandatory gate]
│   └── Complete Profile Form
│
├── Main Application
│   │
│   ├── HOME                             [MODIFIED - simplified content]
│   │   ├── User Greeting
│   │   ├── Quick Actions (Book, Family)
│   │   ├── Upcoming Appointments
│   │   └── For You (CMS Content)
│   │
│   ├── BOOK (Appointments)              [MODIFIED - Curaay only]
│   │   ├── Search (Specialty)           [MODIFIED - no type selection]
│   │   ├── Location Selection           [NEW - dedicated step]
│   │   ├── Results List
│   │   ├── Doctor Details
│   │   ├── Slot Selection               [NEW - dedicated screen]
│   │   ├── Confirm (Modal)              [NEW - bottom sheet]
│   │   └── Success
│   │
│   ├── HISTORY                          [MODIFIED - appointments only]
│   │   ├── Upcoming Tab
│   │   ├── Past Tab
│   │   └── Appointment Actions (Reschedule, Cancel, Book Again)
│   │
│   └── SETTINGS                         [MODIFIED - replaces Profile section]
│       ├── Profile Card
│       ├── Family Members
│       ├── Notifications
│       └── Account Actions (Sign Out, Reset)
│
├── Family Management                    [NEW - accessible from Settings & Home]
│   ├── Family Members List
│   └── Add/Edit Family Member
│
└── NOT IN v1 (Full Vision Only)
    ├── TELEMEDIZIN (entire section)
    ├── E-REZEPT (entire section)
    ├── STORES (entire section)
    ├── Health Checks booking
    ├── Beauty Services booking
    ├── Payback integration
    ├── dm Account Link / SSO
    ├── History export
    └── Forgot Password
```

---

## Master IA Diagram (v1 Future State)

```mermaid
flowchart TB
    subgraph APP["MedAlpha Connect v1"]
        direction TB

        subgraph AUTH["Authentication"]
            A1[Welcome]
            A2[Sign In]
            A3["Register 🟢NEW"]
            A4["Verify - Email 🟡MOD"]
        end

        subgraph PROFILE_GATE["Profile Completion 🟢NEW"]
            PG1["Complete Profile Form 🟢"]
        end

        subgraph MAIN["Main App"]
            direction TB

            subgraph NAV["Bottom Navigation 🟡MOD"]
                direction LR
                N1["Home"]
                N2["Book 🟡"]
                N3["History 🟡"]
                N4["Settings 🟡"]
            end

            subgraph HOME["HOME 🟡MOD"]
                H1[Dashboard]
                H2["Quick Actions 🟢"]
                H3[Upcoming Appointments]
                H4["For You CMS 🟢"]
            end

            subgraph BOOKING["BOOK 🟡MOD"]
                B1["Search Specialty 🟡"]
                B2["Location Selection 🟢"]
                B3[Results List]
                B4[Doctor Details]
                B5["Slot Selection 🟢"]
                B6["Confirm Modal 🟢"]
                B7[Success]
            end

            subgraph HISTORY["HISTORY 🟡MOD"]
                HI1["Upcoming Tab 🟡"]
                HI2["Past Tab 🟡"]
                HI3[Appointment Actions]
            end

            subgraph SETTINGS["SETTINGS 🟡MOD"]
                S1["Profile Card 🟢"]
                S2[Family Members]
                S3[Notifications]
                S4["Account Actions 🟢"]
            end

            subgraph FAMILY["Family Management 🟢NEW"]
                F1["Family List 🟢"]
                F2["Add/Edit Member 🟢"]
            end
        end
    end

    A1 --> A2
    A1 --> A3
    A3 --> A4
    A2 --> CHECK{Profile Complete?}
    A4 --> CHECK
    CHECK -->|No| PG1
    CHECK -->|Yes| H1
    PG1 --> H1

    N1 --> H1
    N2 --> B1
    N3 --> HI1
    N4 --> S1

    H2 -->|Book| B1
    H2 -->|Family| F1
    H3 --> HI1

    B1 --> B2 --> B3 --> B4 --> B5 --> B6 --> B7
    B3 -->|Quick slot| B6

    HI1 --> HI3
    HI2 --> HI3
    HI3 -->|Reschedule| B1
    HI3 -->|Book Again| B1

    S2 --> F1

    style APP fill:#ffffff,stroke:#9e9e9e,stroke-width:2px
    style AUTH fill:#e8f5e9,stroke:#2e7d32
    style PROFILE_GATE fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
    style MAIN fill:#fafafa,stroke:#9e9e9e
    style NAV fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style HOME fill:#fff9c4,stroke:#f9a825
    style BOOKING fill:#fff9c4,stroke:#f9a825
    style HISTORY fill:#fff9c4,stroke:#f9a825
    style SETTINGS fill:#fff9c4,stroke:#f9a825
    style FAMILY fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

**Legend:**
- 🟢 / Green background = NEW in v1
- 🟡 / Yellow background = MODIFIED from full vision

---

## Route Structure (v1)

| Route | Screen | Change | Notes |
|-------|--------|--------|-------|
| `/auth/welcome` | Welcome | - | Entry point |
| `/auth/sign-in` | Sign In | - | Email/password |
| `/auth/register` | Register | NEW | Simplified registration |
| `/auth/verify` | Verify | MODIFIED | Email only (no SMS) |
| `/profile/complete` | Profile Completion | NEW | Mandatory gate |
| `/profile/edit` | Edit Profile | - | Update profile |
| `/profile/family` | Family Members | - | Manage family |
| `/home` | Home | MODIFIED | Simplified content |
| `/booking/search` | Specialty Search | MODIFIED | No type selection |
| `/booking/location` | Location Selection | NEW | Dedicated step |
| `/booking/results` | Results List | - | Doctor cards |
| `/booking/doctor/:id` | Doctor Details | - | Profile view |
| `/booking/doctor/:id/slots` | Slot Selection | NEW | Time picker |
| `/booking/confirm` | Confirm Modal | NEW | Bottom sheet |
| `/booking/success` | Success | - | Confirmation |
| `/history` | History | MODIFIED | Appointments only, tab toggle |
| `/settings` | Settings | MODIFIED | Replaces Profile section |
| `/settings/notifications` | Notifications | - | Toggle preferences |

### Routes NOT in v1

| Full Vision Route | Reason |
|-------------------|--------|
| `/auth/forgot-password` | Deferred |
| `/telemedicine/*` | Feature OUT |
| `/e-rezept/*` | Feature OUT |
| `/stores/*` | Feature OUT |
| `/history/export` | Feature reduced |

---

## Screen Inventory (v1)

| Screen ID | Section | Screen Name | Change | Description |
|-----------|---------|-------------|--------|-------------|
| AUTH-001 | Auth | Welcome | - | Entry with Sign In / Register |
| AUTH-002 | Auth | Sign In | - | Email/password login |
| AUTH-003 | Auth | Register | NEW | New user registration |
| AUTH-004 | Auth | Verify | MODIFIED | Email verification only |
| PROF-001 | Profile | Complete Profile | NEW | Mandatory completion gate |
| PROF-002 | Profile | Edit Profile | - | Update personal info |
| PROF-003 | Profile | Family Members | - | List and manage family |
| PROF-004 | Profile | Add/Edit Member | - | Family member form |
| HOME-001 | Home | Dashboard | MODIFIED | Greeting, Quick Actions, Upcoming, CMS |
| BOOK-001 | Book | Specialty Search | MODIFIED | Search without type selection |
| BOOK-002 | Book | Location Selection | NEW | City and radius picker |
| BOOK-003 | Book | Results List | - | Doctor cards with quick slots |
| BOOK-004 | Book | Doctor Details | - | Full doctor profile |
| BOOK-005 | Book | Slot Selection | NEW | Date carousel + time grid |
| BOOK-006 | Book | Confirm Modal | NEW | Bottom sheet with patient selector |
| BOOK-007 | Book | Success | - | Booking confirmation |
| HIST-001 | History | History | MODIFIED | Upcoming/Past toggle |
| HIST-002 | History | Appointment Detail | - | Single appointment view |
| SETT-001 | Settings | Settings | MODIFIED | Profile card + menu items |
| SETT-002 | Settings | Notifications | - | Notification toggles |

### Screens NOT in v1

| Full Vision Screen | Reason |
|--------------------|--------|
| AUTH-005 Forgot Password | Deferred |
| HOME-002 Deals & Payback | Feature OUT |
| BOOK-005 Payment | Beauty services OUT |
| TELE-* (all) | Feature OUT |
| ERX-* (all) | Feature OUT |
| STORE-* (all) | Feature OUT |
| HIST-004 Export | Feature reduced |
| PROF-006 Payback | Feature OUT |
| PROF-007 dm Account Link | Feature OUT |

---

## Key Features Delivered (v1)

1. **User Authentication** - Email-based sign in/register with verification
2. **Profile Management** - Insurance, address, GDPR consent with mandatory completion gate
3. **Family Members** - Add and manage dependents for family appointments
4. **Appointment Booking** - 4-step flow: Specialty → Location → Results → Confirm
5. **Doctor Discovery** - Search, filter, sort with quick slot selection
6. **Appointment History** - View upcoming and past appointments with actions
7. **Patient Selection** - Book for self or family members
8. **Basic CMS** - Insurance-specific health content on home screen
9. **Notification Preferences** - Toggle appointment reminders, updates, deals

---

## Implementation Notes

### Integration Points (v1)

| Integration | Status | Notes |
|-------------|--------|-------|
| Curaay API | Required | Doctor search, availability, booking |
| CMS Backend | Required | Home screen content |
| FCM/APNs | Optional | Push notifications |
| Calendar | Optional | Add to device calendar |

### Technical Considerations

1. **Profile Gate** - RequireProfileComplete guard on all main routes
2. **Booking State** - Context-based state for multi-step flow
3. **Mock Data** - N3 uses mock APIs; production needs real Curaay integration
4. **Local Storage** - Auth state, preferences, recent searches persisted
5. **Responsive** - Mobile-first design with safe areas

### Post-v1 Roadmap

| Feature | Priority | Dependency |
|---------|----------|------------|
| Telemedicine | P1 | Teleclinic integration |
| E-Rezept | P1 | CardLink + Apo Group |
| Stores | P2 | dm Store API |
| Payback | P2 | Payback integration |
| SSO | P2 | dm OAuth |
| Health Checks | P3 | dm Services API |

# User Journeys: Appointment Booking N3

> **What do users want to accomplish?**
> This document defines user goals and how they achieve them BEFORE determining structure.

---

## 1. User Goals

| Goal ID | Goal Statement | Things Involved | Key Actions |
|---------|----------------|-----------------|-------------|
| G1 | When I'm new to the app, I want to create an account and complete my profile, so that I can start booking appointments | User, Insurance | register, verify, complete profile |
| G2 | When I open the app, I want to see my upcoming appointments and relevant content, so that I stay informed | User, Appointment, CMS Content | view |
| G3 | When I need to see a doctor, I want to find one that matches my needs, so that I get appropriate care | Doctor, Specialty, Location, Insurance | search, filter, browse |
| G4 | When I find a suitable doctor, I want to book an appointment at a convenient time, so that I secure my visit | Appointment, Doctor, Time Slot, Family Member | select, book, confirm |
| G5 | When my plans change, I want to reschedule my appointment, so that I don't miss my visit | Appointment, Suggested Slots | view, compare, reschedule |
| G6 | When I had a good experience, I want to book again with the same doctor, so that I save time | Appointment, Doctor, Time Slot | view history, book again |
| G7 | When I need to book for family, I want to manage family members and book on their behalf, so that I can care for dependents | Family Member, Appointment | add, select, book |
| G8 | When I need to review my medical visits, I want to see my appointment history, so that I track my healthcare | History Item, Appointment | view, filter |
| G9 | When I want to customize my experience, I want to update my settings and profile, so that the app works for me | User, Notification | edit, toggle |

---

## 2. Individual Journey Diagrams

### G1: Onboarding Journey
**Goal:** Create account and complete profile

```mermaid
flowchart TB
    A[/"Start: Open app (new user)"/]
    B["See Welcome screen"]
    C{"Have account?"}
    D["Tap Create Account"]
    E["Enter email & password"]
    F["Verify email"]
    G["Complete profile form"]
    H["Enter name, insurance, address"]
    I["Accept GDPR consent"]
    J[/"Done: Ready to book"/]
    K["Tap Sign In"]
    L["Enter credentials"]

    A --> B --> C
    C -->|No| D --> E --> F --> G --> H --> I --> J
    C -->|Yes| K --> L --> J

    style G fill:#e8f5e9,stroke:#4CAF50
    style I fill:#fff3e0,stroke:#FF9800
```

**Steps:** 6-9 | **Decisions:** 1

---

### G2: View Home Dashboard
**Goal:** See upcoming appointments and relevant content

```mermaid
flowchart TB
    A[/"Start: Open app"/]
    B["See Home screen"]
    C["View welcome & today's date"]
    D["See upcoming appointments widget"]
    E{"Have appointments?"}
    F["View appointment cards"]
    G["See empty state"]
    H["Browse CMS content cards"]
    I["View deals, tips, payback offers"]
    J[/"Done: Informed about status"/]

    A --> B --> C --> D --> E
    E -->|Yes| F --> H
    E -->|No| G --> H
    H --> I --> J

    style D fill:#e8f5e9,stroke:#4CAF50
    style H fill:#e3f2fd,stroke:#2196F3
```

**Steps:** 5-6 | **Decisions:** 1

---

### G3: Find a Doctor
**Goal:** Search and find a suitable doctor

```mermaid
flowchart TB
    A[/"Start: Need to see a doctor"/]
    B["Tap Book Appointment"]
    C["Select specialty"]
    D{"Know specialty?"}
    E["Search by name"]
    F["Browse specialty chips"]
    G["Select from recent searches"]
    H["See search results"]
    I{"Results found?"}
    J["Browse doctor cards"]
    K["See empty state"]
    L["Use sort options"]
    M["View ratings, distance, availability"]
    N["See inline time slots"]
    O[/"Done: Found potential doctors"/]

    A --> B --> C --> D
    D -->|Yes| E --> H
    D -->|Browse| F --> H
    D -->|Recent| G --> H
    H --> I
    I -->|Yes| J --> L --> M --> N --> O
    I -->|No| K --> C

    style J fill:#e8f5e9,stroke:#4CAF50
    style N fill:#fff3e0,stroke:#FF9800
```

**Steps:** 5-8 | **Decisions:** 2

---

### G4: Book an Appointment
**Goal:** Select time and confirm booking

```mermaid
flowchart TB
    A[/"Start: Found a doctor"/]
    B["Tap doctor card or View Profile"]
    C["See doctor profile details"]
    D["Tap Select Appointment Time"]
    E["See available dates"]
    F["Select a date"]
    G["See time slots for date"]
    H["Select a time slot"]
    I{"Booking for family?"}
    J["Select family member"]
    K["Continue with self"]
    L["See confirmation screen"]
    M["Review all details"]
    N["Tap Confirm Booking"]
    O["See success screen"]
    P["Get confirmation number"]
    Q[/"Done: Appointment booked"/]

    A --> B --> C --> D --> E --> F --> G --> H --> I
    I -->|Yes| J --> L
    I -->|No| K --> L
    L --> M --> N --> O --> P --> Q

    style L fill:#fff3e0,stroke:#FF9800
    style O fill:#e8f5e9,stroke:#4CAF50
```

**Steps:** 10-11 | **Decisions:** 1

---

### G5: Reschedule Appointment
**Goal:** Change appointment to a different time

```mermaid
flowchart TB
    A[/"Start: Need to reschedule"/]
    B["Go to History"]
    C["See upcoming appointments"]
    D["Find appointment to change"]
    E["Tap Reschedule"]
    F["See current appointment summary"]
    G["View suggested slots"]
    H["See priority labels"]
    I{"Like a suggestion?"}
    J["Select suggested slot"]
    K["Tap View All Times"]
    L["Browse all available slots"]
    M["Select a slot"]
    N["See comparison screen"]
    O["Review old vs new times"]
    P["Tap Confirm"]
    Q["See success screen"]
    R[/"Done: Appointment rescheduled"/]

    A --> B --> C --> D --> E --> F --> G --> H --> I
    I -->|Yes| J --> N
    I -->|No| K --> L --> M --> N
    N --> O --> P --> Q --> R

    style G fill:#e8f5e9,stroke:#4CAF50
    style N fill:#fff3e0,stroke:#FF9800
```

**Steps:** 10-12 | **Decisions:** 1

---

### G6: Book Again
**Goal:** Quickly rebook with a previous doctor

```mermaid
flowchart TB
    A[/"Start: Want to see same doctor"/]
    B["Go to History"]
    C["Switch to Past tab"]
    D["Find previous appointment"]
    E["Tap Book Again"]
    F["See pre-filled booking context"]
    G["Review doctor, location, insurance"]
    H["Tap View Available Times"]
    I["See available time slots"]
    J["Select a slot"]
    K["See confirmation screen"]
    L["Tap Confirm"]
    M["See success screen"]
    N[/"Done: Rebooking complete"/]

    A --> B --> C --> D --> E --> F --> G --> H --> I --> J --> K --> L --> M --> N

    style F fill:#e8f5e9,stroke:#4CAF50
    style G fill:#e3f2fd,stroke:#2196F3
```

**Steps:** 12 | **Decisions:** 0

---

### G7: Book for Family Member
**Goal:** Add family and book on their behalf

```mermaid
flowchart TB
    A[/"Start: Need to book for family"/]
    B{"Family member exists?"}
    C["Go to Profile > Family"]
    D["Tap Add Family Member"]
    E["Enter name, DOB, relationship"]
    F["Save family member"]
    G["Start booking flow"]
    H["Search for doctor"]
    I["Select date and time"]
    J["See patient selection"]
    K["Select family member"]
    L["Complete booking"]
    M[/"Done: Booked for family"/]

    A --> B
    B -->|No| C --> D --> E --> F --> G
    B -->|Yes| G
    G --> H --> I --> J --> K --> L --> M

    style J fill:#e8f5e9,stroke:#4CAF50
    style K fill:#fff3e0,stroke:#FF9800
```

**Steps:** 6-10 | **Decisions:** 1

---

### G8: View Appointment History
**Goal:** Review past and upcoming appointments

```mermaid
flowchart TB
    A[/"Start: Want to see history"/]
    B["Tap History tab"]
    C["See Upcoming tab (default)"]
    D["View confirmed appointments"]
    E{"Want to see past?"}
    F["Tap Past tab"]
    G["View completed/cancelled appointments"]
    H["See appointment details"]
    I{"Take action?"}
    J["Reschedule or Cancel"]
    K["Book Again"]
    L[/"Done: History reviewed"/]

    A --> B --> C --> D --> E
    E -->|Yes| F --> G --> H
    E -->|No| D --> H
    H --> I
    I -->|Upcoming| J --> L
    I -->|Past| K --> L
    I -->|No| L

    style C fill:#e8f5e9,stroke:#4CAF50
    style F fill:#e3f2fd,stroke:#2196F3
```

**Steps:** 4-6 | **Decisions:** 2

---

### G9: Manage Settings
**Goal:** Update profile and preferences

```mermaid
flowchart TB
    A[/"Start: Want to change settings"/]
    B["Tap Settings tab"]
    C["See settings options"]
    D{"What to change?"}
    E["Edit Profile"]
    F["Update name, address, insurance"]
    G["Manage Notifications"]
    H["Toggle reminder preferences"]
    I["Adjust Font Size"]
    J["Select font scale"]
    K["Save changes"]
    L[/"Done: Settings updated"/]

    A --> B --> C --> D
    D -->|Profile| E --> F --> K
    D -->|Notifications| G --> H --> K
    D -->|Font| I --> J --> K
    K --> L

    style C fill:#e8f5e9,stroke:#4CAF50
```

**Steps:** 4-5 | **Decisions:** 1

---

## 3. Complete Journey Map

```mermaid
flowchart TB
    subgraph ENTRY["Entry Points"]
        E1[/"Open app"/]
        E2[/"Notification"/]
        E3[/"Deep link"/]
    end

    subgraph G1["G1: Onboarding"]
        G1A["Welcome"]
        G1B["Register/Sign In"]
        G1C["Complete Profile"]
    end

    subgraph G2["G2: Home Dashboard"]
        G2A["View appointments"]
        G2B["Browse content"]
    end

    subgraph G3["G3: Find Doctor"]
        G3A["Select specialty"]
        G3B["Browse results"]
        G3C["Filter & sort"]
    end

    subgraph G4["G4: Book Appointment"]
        G4A["View doctor profile"]
        G4B["Select date/time"]
        G4C["Confirm booking"]
    end

    subgraph G5["G5: Reschedule"]
        G5A["View suggestions"]
        G5B["Compare times"]
        G5C["Confirm change"]
    end

    subgraph G6["G6: Book Again"]
        G6A["Select past appointment"]
        G6B["Review pre-filled"]
        G6C["Select new time"]
    end

    subgraph G7["G7: Family Booking"]
        G7A["Add family member"]
        G7B["Select patient"]
    end

    subgraph G8["G8: View History"]
        G8A["Upcoming tab"]
        G8B["Past tab"]
    end

    subgraph G9["G9: Settings"]
        G9A["Edit profile"]
        G9B["Notifications"]
    end

    %% Entry flows
    E1 --> G1
    E1 --> G2
    E2 --> G8
    E3 --> G4

    %% Journey connections
    G1 --> G2
    G2 --> G3
    G3 --> G4
    G4 --> G2
    G2 --> G8
    G8 --> G5
    G8 --> G6
    G5 --> G8
    G6 --> G4
    G7 --> G4
    G2 --> G9
    G9 --> G2

    %% Styling for primary flows
    style G3 fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    style G4 fill:#e8f5e9,stroke:#4CAF50,stroke-width:2px
    style G5 fill:#fff3e0,stroke:#FF9800,stroke-width:2px
    style G6 fill:#e3f2fd,stroke:#2196F3,stroke-width:2px
```

---

## 4. Journey Summary

| Goal | Steps | Decisions | Start Point | End Point | Frequency |
|------|-------|-----------|-------------|-----------|-----------|
| G1: Onboarding | 6-9 | 1 | App launch | Home | Once |
| G2: Home Dashboard | 5-6 | 1 | App launch | Home | Every session |
| G3: Find Doctor | 5-8 | 2 | Home | Results | High |
| G4: Book Appointment | 10-11 | 1 | Results | Success | High |
| G5: Reschedule | 10-12 | 1 | History | Success | Medium |
| G6: Book Again | 12 | 0 | History | Success | Medium |
| G7: Family Booking | 6-10 | 1 | Profile/Booking | Success | Low |
| G8: View History | 4-6 | 2 | Tab bar | History | Medium |
| G9: Settings | 4-5 | 1 | Tab bar | Settings | Low |

---

## 5. Primary User Paths

### Happy Path: First-time Booking
```
Open App → Onboard → Home → Search Specialty → Browse Results → View Doctor → Select Time → Confirm → Success
```

### Repeat User: Quick Booking
```
Open App → Home → Quick Action → Search → Select Doctor → Select Time → Confirm → Success
```

### Reschedule Path
```
Open App → History → Find Appointment → Reschedule → View Suggestions → Select New Time → Confirm → Success
```

### Book Again Path
```
Open App → History → Past Tab → Find Previous → Book Again → Pre-filled Context → Select Time → Confirm → Success
```

---

## 6. Journey Touchpoints

| Journey | Entry Touchpoints | Exit Touchpoints |
|---------|-------------------|------------------|
| G1 Onboarding | App icon, Marketing | Home screen |
| G2 Home | App icon, Tab bar | Any other screen |
| G3 Find Doctor | Home CTA, Tab bar | Results, Doctor profile |
| G4 Book | Doctor card, Profile | Success, Home |
| G5 Reschedule | History card action | Success, History |
| G6 Book Again | History card action | Success, History |
| G7 Family | Profile, Booking flow | Profile, Success |
| G8 History | Tab bar, Notification | Detail, Reschedule, Book Again |
| G9 Settings | Tab bar | Previous screen |

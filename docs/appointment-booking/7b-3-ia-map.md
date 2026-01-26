# IA Map: Appointment Booking N3

> **Where should things live to support user journeys?**
> This document shows how structure emerges from behavior - organizing the app to serve user goals.

---

## 1. Journey-to-Structure Analysis

| Journey | Areas Needed | Why |
|---------|--------------|-----|
| G1: Onboarding | Auth, Profile | Separate pre-login flow, mandatory profile setup |
| G2: Home Dashboard | Home | Central hub, first screen after login |
| G3: Find Doctor | Booking > Search, Booking > Results | Multi-step search needs dedicated screens |
| G4: Book Appointment | Booking > Doctor, Booking > Slots, Booking > Confirm | Progressive disclosure of booking steps |
| G5: Reschedule | Reschedule flow | Context-aware with original appointment |
| G6: Book Again | Book Again flow | Pre-filled from past appointment |
| G7: Family Booking | Profile > Family, Booking | Family management + patient selection |
| G8: View History | History | Dual-tab for upcoming/past |
| G9: Settings | Settings, Profile | Preferences and account management |

---

## 2. Group Related Actions by Area

| Area | Journeys Supported | Things Shown | Primary Actions |
|------|-------------------|--------------|-----------------|
| **Auth** | G1 | User | sign in, register, verify |
| **Home** | G2, G3, G4 | User, Appointment, CMS Content | view dashboard, start booking |
| **Booking - Search** | G3 | Specialty, Location | search, select specialty |
| **Booking - Results** | G3 | Doctor, Search Results | browse, filter, sort |
| **Booking - Doctor** | G3, G4 | Doctor, Time Slot | view profile, see availability |
| **Booking - Slots** | G4, G6 | Time Slot, Family Member | select date/time, choose patient |
| **Booking - Confirm** | G4 | Appointment | review, confirm |
| **History** | G5, G6, G8 | History Item, Appointment | view, reschedule, book again |
| **Reschedule** | G5 | Appointment, Suggested Slots | compare, select, confirm |
| **Book Again** | G6 | Appointment, Doctor | review pre-filled, proceed |
| **Profile** | G1, G7, G9 | User, Insurance, Family Member | edit, add family |
| **Settings** | G9 | User, Notification | toggle preferences |

---

## 3. Thing Locations Table

| Thing | Primary Location | Secondary Location(s) | Access From |
|-------|------------------|----------------------|-------------|
| User | Profile | Home (header), Settings | Tab bar, Avatar |
| Appointment | History | Home (widget) | Tab bar, Home widget |
| Doctor | Results, Doctor Profile | Booking confirm, Reschedule | Search results tap |
| Time Slot | Slot Selection | Results (preview), Reschedule | Doctor profile CTA |
| Family Member | Profile > Family | Slot Selection (selector) | Profile, Booking |
| Insurance | Profile | Results (filter badge) | Profile edit |
| Location | Profile | Search (selector) | Profile, Booking |
| Specialty | Search | Results (badge), Home (recent) | Search screen |
| CMS Content | Home | - | Home scroll |
| Notification | Settings > Notifications | - | Settings |
| History Item | History | - | Tab bar |
| Search Results | Results | - | Search completion |
| Suggested Slots | Reschedule | - | Reschedule action |

---

## 4. Current IA Structure

```mermaid
flowchart TB
    subgraph ROOT["App"]
        direction TB

        subgraph AUTH["Auth (Logged Out)"]
            A1["Welcome"]
            A2["Register"]
            A3["Sign In"]
            A4["Verify Email"]
        end

        subgraph MAIN["Main (Logged In)"]
            direction TB

            subgraph PROFILE_SETUP["Profile Setup"]
                PS1["Complete Profile"]
            end

            subgraph TABS["Tab Navigation"]
                T1["Home"]
                T2["History"]
                T3["Settings"]
            end

            subgraph HOME["Home Area"]
                H1["Dashboard"]
                H2["Upcoming Widget"]
                H3["CMS Content"]
            end

            subgraph BOOKING["Booking Area"]
                B1["Search"]
                B2["Results"]
                B3["Doctor Profile"]
                B4["Slot Selection"]
                B5["Confirm"]
                B6["Success"]
            end

            subgraph HISTORY["History Area"]
                HI1["Upcoming Tab"]
                HI2["Past Tab"]
                HI3["Appointment Detail"]
            end

            subgraph RESCHEDULE["Reschedule Area"]
                R1["Suggested Slots"]
                R2["Confirm Change"]
                R3["Success"]
            end

            subgraph BOOK_AGAIN["Book Again Area"]
                BA1["Pre-filled Context"]
            end

            subgraph PROFILE["Profile Area"]
                P1["Edit Profile"]
                P2["Family Members"]
            end

            subgraph SETTINGS["Settings Area"]
                S1["Preferences"]
                S2["Notifications"]
            end
        end
    end

    %% Auth flow
    A1 --> A2
    A1 --> A3
    A2 --> A4
    A4 --> PS1
    A3 --> T1

    %% Main navigation
    PS1 --> T1
    T1 <--> T2
    T2 <--> T3
    T3 <--> T1

    %% Tab to area
    T1 --> HOME
    T2 --> HISTORY
    T3 --> SETTINGS

    %% Booking flow
    HOME --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> B6
    B6 --> HOME

    %% History actions
    HISTORY --> HI3
    HI1 --> R1
    HI2 --> BA1

    %% Reschedule flow
    R1 --> B4
    R1 --> R2
    R2 --> R3
    R3 --> HISTORY

    %% Book Again flow
    BA1 --> B4

    %% Profile/Settings
    SETTINGS --> P1
    SETTINGS --> P2
    SETTINGS --> S2
```

---

## 5. IA by Feature Area

### 5.1 Auth Area
```mermaid
flowchart LR
    subgraph AUTH["Auth"]
        W["Welcome"] --> R["Register"]
        W --> S["Sign In"]
        R --> V["Verify Email"]
        V --> PC["Complete Profile"]
        S --> H["Home"]
        PC --> H
    end

    style W fill:#fff3e0
    style PC fill:#e8f5e9
```

### 5.2 Home Area
```mermaid
flowchart TB
    subgraph HOME["Home"]
        H1["Header (Welcome, User)"]
        H2["Quick Actions"]
        H3["Upcoming Appointments Widget"]
        H4["CMS Content Cards"]
    end

    H2 -->|"Book Appointment"| SEARCH["Booking Search"]
    H2 -->|"Family"| FAM["Family Members"]
    H3 -->|"View All"| HIST["History"]
    H3 -->|"Tap card"| DETAIL["Appointment Detail"]

    style H2 fill:#e8f5e9
    style H3 fill:#fff3e0
```

### 5.3 Booking Area
```mermaid
flowchart TB
    subgraph BOOKING["Booking Flow"]
        B1["1. Search"]
        B2["2. Results"]
        B3["3. Doctor Profile"]
        B4["4. Slot Selection"]
        B5["5. Confirm"]
        B6["6. Success"]
    end

    B1 -->|"Select specialty"| B2
    B2 -->|"Tap doctor"| B3
    B3 -->|"Select time CTA"| B4
    B2 -->|"Quick select slot"| B4
    B4 -->|"Continue"| B5
    B5 -->|"Confirm"| B6
    B6 -->|"Done"| HOME["Home"]

    style B1 fill:#e8f5e9
    style B5 fill:#fff3e0
    style B6 fill:#c8e6c9
```

### 5.4 History Area
```mermaid
flowchart TB
    subgraph HISTORY["History"]
        HT["Tab Toggle"]
        HU["Upcoming Tab"]
        HP["Past Tab"]
        HD["Appointment Detail"]
    end

    HT --> HU
    HT --> HP
    HU -->|"Tap card"| HD
    HP -->|"Tap card"| HD

    HU -->|"Reschedule"| RS["Reschedule Flow"]
    HU -->|"Cancel"| CANCEL["Cancel Confirmation"]
    HP -->|"Book Again"| BA["Book Again Flow"]

    style HU fill:#e8f5e9
    style HP fill:#e3f2fd
```

### 5.5 Reschedule Area
```mermaid
flowchart TB
    subgraph RESCHEDULE["Reschedule"]
        R1["Suggested Slots"]
        R2["All Available (optional)"]
        R3["Confirm Change"]
        R4["Success"]
    end

    ENTRY["History Card"] --> R1
    R1 -->|"Select suggestion"| R3
    R1 -->|"View all times"| R2
    R2 -->|"Select slot"| R3
    R3 -->|"Confirm"| R4
    R4 --> HIST["History"]

    style R1 fill:#e8f5e9
    style R3 fill:#fff3e0
```

### 5.6 Book Again Area
```mermaid
flowchart TB
    subgraph BOOK_AGAIN["Book Again"]
        BA1["Pre-filled Context"]
    end

    ENTRY["Past Appointment"] --> BA1
    BA1 -->|"View times"| SLOTS["Slot Selection"]
    SLOTS --> CONFIRM["Confirm"]
    CONFIRM --> SUCCESS["Success"]

    style BA1 fill:#e3f2fd
```

---

## 6. IA Decision Table

| Location | Status | Rationale | Journeys Supported |
|----------|--------|-----------|-------------------|
| Auth screens | EXISTING | Required for account security | G1 |
| Home | EXISTING | Central dashboard for all users | G2, G3 |
| Booking Search | EXISTING | Entry point for finding doctors | G3 |
| Booking Results | EXISTING | Browse and compare doctors | G3 |
| Doctor Profile | EXISTING | Detailed doctor info for decision | G3, G4 |
| Slot Selection | EXISTING | Choose appointment time | G4, G5, G6, G7 |
| Booking Confirm | EXISTING | Final review before booking | G4 |
| Booking Success | EXISTING | Confirmation and next steps | G4 |
| History | EXISTING | View all appointments | G5, G6, G8 |
| Appointment Detail | EXISTING | Full appointment info | G8 |
| Reschedule Suggested | EXISTING | Smart slot recommendations | G5 |
| Reschedule Confirm | EXISTING | Compare old vs new | G5 |
| Book Again Context | EXISTING | Pre-filled rebooking | G6 |
| Profile Edit | EXISTING | Update personal info | G1, G9 |
| Family Members | EXISTING | Manage dependents | G7 |
| Settings | EXISTING | App preferences | G9 |
| Notifications | EXISTING | Alert preferences | G9 |

---

## 7. Navigation Paths

### 7.1 Primary Navigation (Tab Bar)

| Tab | Icon | Destination | Default View |
|-----|------|-------------|--------------|
| Home | Home | /home | Dashboard |
| History | Calendar | /history | Upcoming tab |
| Settings | Gear | /settings | Preferences |

### 7.2 Navigation Paths by Thing

| Thing | Primary Path | Alternative Path(s) |
|-------|--------------|---------------------|
| User Profile | Settings → Edit Profile | Home → Avatar |
| Appointment (upcoming) | History → Upcoming tab | Home → Widget |
| Appointment (past) | History → Past tab | - |
| Doctor | Home → Book → Search → Results | History → Detail |
| Time Slot | Booking → Doctor → Select Time | Reschedule → Suggestions |
| Family Member | Settings → Family Members | Booking → Patient selector |
| Suggested Slots | History → Reschedule | - |
| CMS Content | Home → Scroll | - |
| Notifications | Settings → Notifications | - |

### 7.3 Deep Links

| Deep Link | Destination | Use Case |
|-----------|-------------|----------|
| /home | Home screen | Default entry |
| /booking/doctor/:id | Doctor profile | Marketing link |
| /history/:id | Appointment detail | Push notification |
| /reschedule/:id | Reschedule flow | Reminder notification |

---

## 8. Navigation Flow Diagram

```mermaid
flowchart TB
    subgraph GLOBAL["Global Navigation"]
        direction LR
        TAB1["Home"]
        TAB2["History"]
        TAB3["Settings"]
        TAB1 <--> TAB2 <--> TAB3
    end

    subgraph FLOWS["User Flows"]
        direction TB

        F1["Search Flow"]
        F2["Booking Flow"]
        F3["Reschedule Flow"]
        F4["Book Again Flow"]
        F5["Profile Flow"]
    end

    TAB1 -->|"Book CTA"| F1
    F1 --> F2
    TAB2 -->|"Reschedule"| F3
    TAB2 -->|"Book Again"| F4
    TAB3 --> F5
    F4 --> F2
    F3 -->|"View All"| F2

    %% Return paths
    F2 -->|"Success"| TAB1
    F3 -->|"Success"| TAB2
    F5 -->|"Save"| TAB3

    style GLOBAL fill:#f5f5f5
    style F2 fill:#e8f5e9
```

---

## 9. Screen Depth Analysis

| Depth | Screens | Access Pattern |
|-------|---------|----------------|
| 0 | Home, History, Settings | Tab bar (always accessible) |
| 1 | Search, Appointment Detail, Edit Profile, Family, Notifications | One tap from tab |
| 2 | Results, Reschedule Suggested, Book Again | Two taps |
| 3 | Doctor Profile, Reschedule Confirm | Three taps |
| 4 | Slot Selection | Four taps |
| 5 | Confirm | Five taps |
| 6 | Success | Six taps |

**Note:** The booking flow is intentionally deep (6 levels) to ensure users make informed decisions with proper confirmation steps.

---

## 10. Summary

### Areas by Journey Priority

| Priority | Area | Journeys | Frequency |
|----------|------|----------|-----------|
| 1 | Booking (Search → Success) | G3, G4 | High |
| 2 | Home | G2 | Every session |
| 3 | History | G5, G6, G8 | Medium |
| 4 | Reschedule | G5 | Medium |
| 5 | Book Again | G6 | Medium |
| 6 | Profile/Settings | G7, G9 | Low |
| 7 | Auth/Onboarding | G1 | Once |

### Key IA Principles

1. **Tab bar for primary areas** - Home, History, Settings always accessible
2. **Progressive disclosure** - Booking flow reveals information step by step
3. **Context preservation** - Reschedule and Book Again maintain appointment context
4. **Shallow depth for frequent tasks** - Upcoming appointments visible from Home
5. **Deep confirmation for important actions** - Booking requires explicit confirmation

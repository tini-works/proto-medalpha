# User Flows - MedAlpha Connect v1 (Curaay Appointments)

**Generated From:** N3 App Implementation + SCOPE-FOR-EXPLORATION.md
**Date:** 2026-01-27
**Purpose:** Document v1 User Flows showing future state with NEW/MODIFIED indicators relative to full vision

---

## Summary of Changes

### Flows Comparison

| Flow | Full Vision | v1 Scope | Status |
|------|-------------|----------|--------|
| J1 - Registration | Email/SMS + SSO | Email only | MODIFIED |
| J2 - Profile | Optional family | Mandatory gate + family | MODIFIED |
| J3 - Booking | Doctor + Health + Beauty | Doctor only (Curaay) | MODIFIED |
| J3a - My Appointments | Full actions | Upcoming/Past with reschedule/book-again flows | MODIFIED |
| J4 - Telemedicine | Full flow | - | OUT |
| J5 - Online Rx | Full flow | - | OUT |
| J6 - Offline Rx | Full flow | - | OUT |
| J7 - History | All types + export | Appointments only | MODIFIED |
| J8 - Home | Full CMS + Payback | Quick Actions + Upcoming + Newsfeed + Notifications Center | MODIFIED |
| J9 - Notifications | All types | Notifications Center + reminders (where supported) | MODIFIED |

### NEW Flow Elements (v1)

| Element | Flow | Description |
|---------|------|-------------|
| Profile Completion Gate | J2 | Mandatory step blocking home access until complete |
| Location Step | J3 | Dedicated screen for city + radius selection (now includes visit type + urgency preferences) |
| Insurance Step | J3 | Dedicated insurance selection screen (GKV/PKV/Self-pay) with “only public doctors” toggle |
| Results Filters | J3 | Filter sheet + sort selector in results (radius, min rating, languages, only public) |
| Doctor Reviews Screen | J3 | Separate reviews screen from doctor profile |
| Slot Selection Screen | J3 | Dedicated date picker + time slot grid |
| Confirmation Modal | J3 | Bottom sheet with patient selector and reason |
| Quick Slot Booking | J3 | Book directly from results without viewing profile |
| Tab Toggle | J7 | Upcoming/Past toggle instead of filter panel |
| Notifications Center | J8 | Notifications + Newsfeed tabs, with Article Detail screen |
| Reschedule Flow Screens | J3a | Guided reschedule: reason → suggested slots → confirm → success |
| Book Again Flow Screens | J3a | Guided re-book: context → alternatives → slot selection → confirm → success |
| Assistant Flows | J3 | Optional assistant booking routes (recommendations, doctor detail, confirm) |
| Settings Subpages | J7 | Language, privacy, FAQ, contact support, help centre screens added |

### MODIFIED Flow Elements (Reduced from Full Vision)

| Element | Full Vision | v1 Scope |
|---------|-------------|----------|
| Registration verification | Email or SMS | Email only |
| dm SSO | Link dm account | Not available |
| Booking type selection | Doctor / Health Check / Beauty | Doctor only |
| Payment step | Required for beauty | Not needed |
| History scope | Appointments + Orders + Purchases | Appointments only |
| History export | PDF export available | Not available |
| Home content | Deals, Payback, Health Tips, Active Rx | Quick Actions, Upcoming, Newsfeed, Notifications |

---

## Jobs-to-be-Done Summary (v1)

| Job ID | Feature | Job Statement | v1 Status |
|--------|---------|---------------|-----------|
| J1 | Registration | When I download the app, I want to register quickly so that I can access healthcare features | MODIFIED |
| J2 | Profile | When I need to use core features, I want to complete my profile so that insurance/family are set up | MODIFIED |
| J3 | Booking | When I need care, I want to book doctor appointments so that I get confirmed slots | MODIFIED |
| J3a | My Appointments | When I have appointments, I want to view and manage them | MODIFIED |
| J4 | Telemedicine | ~~When I have a health concern, I want video consultation~~ | OUT |
| J5 | Online Rx | ~~When I have a prescription, I want to redeem online~~ | OUT |
| J6 | Offline Rx | ~~When I prefer pickup, I want to find pharmacies~~ | OUT |
| J7 | History | When I need records, I want to view appointment history | MODIFIED |
| J8 | Home | When I open the app, I want to see relevant actions and content | MODIFIED |
| J9 | Notifications | When something needs attention, I want alerts | MODIFIED |

---

## Flow: User Registration (J1) - MODIFIED

### Changes from Full Vision
- Email verification only (no SMS option)
- No dm SSO handoff
- Simplified to essential fields only
- NOTE (implemented in N3): `/auth/verify-identity` exists but is not currently part of the default registration path

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Open app (first time) | Show welcome screen | - | - |
| 2 | Tap "Register" | Show registration form | - | - |
| 3 | Enter name, email, password | Validate inputs | - | MODIFIED |
| 4 | Tap "Register" | Send email verification code | User: created (pending) | - |
| 5 | Enter verification code | Verify code | User: verified | MODIFIED |
| 6 | Navigate to profile completion | Show profile form | - | NEW |

### Decision Points

| Branch Point | Full Vision | v1 Scope |
|--------------|-------------|----------|
| Verification method | Email or Phone | Email only |
| dm account link | SSO handoff available | Not available |

### Flow Diagram

```mermaid
graph TD
  A[App download] --> B[Welcome]
  B --> C{Register or sign in?}
  C -->|Register| D[Register]
  C -->|Sign in| E[Sign in]
  D --> F[Verify email]
  E --> F
  F --> G{Registration?}
  G -->|Yes| H[Profile completion gate (NEW)]
  G -->|No| I[Home]
  H --> I
```

---

## Flow: Profile Completion (J2) - MODIFIED

### Changes from Full Vision
- NEW: Mandatory gate before accessing home
- Insurance and address required before core features
- Family members optional but accessible

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Redirected after auth | Show profile completion form | - | NEW |
| 2 | Select insurance type (GKV/PKV) | Update form | - | - |
| 3 | Enter eGK number | Validate format | - | - |
| 4 | Enter address (street, postal, city) | Validate address | - | - |
| 5 | Accept GDPR consent | Enable submit | - | - |
| 6 | Tap "Complete Profile" | Save profile, unlock features | User: profileComplete | NEW |
| 7 | Navigate to Home | Show home screen | - | - |

### Flow Diagram

```mermaid
graph TD
  A[Auth complete] --> B{Profile complete?}
  B -->|Yes| C[Home]
  B -->|No| D[Profile completion gate (NEW)]
  D --> E[Select insurance type]
  E --> F[Enter eGK number]
  F --> G[Enter address]
  G --> H{GDPR consent?}
  H -->|No| I[Block until consent]
  I --> H
  H -->|Yes| J[Save profile]
  J --> C
```

---

## Flow: Appointment Booking (J3) - MODIFIED

### Changes from Full Vision
- Doctor appointments only (no Health Checks, no Beauty)
- NEW: Dedicated location + preferences step (city, radius, visit type, urgency)
- NEW: Dedicated insurance step (GKV/PKV/Self-pay) before results (skippable if in profile)
- NEW: Results filters (languages, rating, only public) + sort selector
- NEW: Doctor reviews screen
- NEW: Dedicated slot selection screen
- NEW: Confirmation screen (presented as bottom sheet) with patient selector and reason
- NEW: Quick slot booking from results
- No payment step (beauty services OUT)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Tap "Book" tab or Quick Action | Show specialty search | - | MODIFIED |
| 2 | Search/select specialty | Save selection | SearchFilters: specialty | - |
| 3 | Continue | Show location & preferences | - | NEW |
| 4 | Select city, radius, visit type, urgency | Save location & preferences | SearchFilters: city, radius, visitType, urgency | NEW |
| 5 | Continue | Show insurance screen (if not set in profile) | - | NEW |
| 6 | Select insurance (GKV/PKV/Self-pay) + “only public doctors” | Save insurance filters | SearchFilters: insuranceType, onlyPublic | NEW |
| 7 | View results | Show doctor cards with quick slots + sort/filters | - | NEW |
| 8a | Tap quick slot on card | Go to confirmation | Booking: doctor, slot | MODIFIED |
| 8b | Tap doctor card | Show doctor profile | Booking: doctor | - |
| 9 | (Optional) View reviews | Show reviews screen | - | NEW |
| 10 | Select time (from profile or “more appointments”) | Show slot selection | - | - |
| 11 | Select date and time slot | Save selection | Booking: slot | - |
| 12 | Confirm | Select patient (self/family), optional reason | Booking: patient, reason | MODIFIED |
| 13 | Submit booking | Process via Curaay | Appointment: created | - |
| 14 | View success screen | Show confirmation | - | - |

### Decision Points

| Branch Point | Full Vision | v1 Scope |
|--------------|-------------|----------|
| Booking type | Doctor / Health Check / Beauty | Doctor only |
| Insurance screen | Always dedicated step | Skipped if insurance present in profile |
| Quick slot | Available | Available (NEW) |
| Payment | Required for beauty | Not needed |

### Flow Diagram

```mermaid
graph TD
  A[Entry: Book] --> B[Specialty search]
  B --> C[Location & preferences (NEW)]
  C --> D{Insurance in profile?}
  D -->|Yes| E[Results]
  D -->|No| F[Insurance step (NEW)]
  F --> E

  B -.->|If location+insurance already set| E
  C -.->|If insurance already set| E

  E --> G{Quick slot?}
  G -->|Yes| H[Confirm]
  G -->|No| I[Doctor profile]
  I --> J[Reviews (NEW)]
  J --> I
  I --> K[Slot selection]
  K --> H

  E --> L[Adjust filters/sort (NEW)]
  L --> E

  H --> M[Book]
  M --> N[Success]
```

---

## Flow: My Appointments (J3a) - MODIFIED

### Changes from Full Vision
- Simplified to Upcoming/Past tabs
- Basic actions: Reschedule, Cancel, Book Again (now have dedicated flows/screens)
- No calendar sync from list (available at booking)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Tap "History" tab | Show appointments list | - | MODIFIED |
| 2 | View Upcoming/Past tabs | Show filtered list | - | NEW |
| 3 | Toggle between tabs | Filter appointments | - | NEW |
| 4 | Tap appointment card | Open appointment detail | - | MODIFIED |
| 5a | (Upcoming) Tap Reschedule | Start reschedule flow | - | NEW |
| 5b | (Upcoming) Tap Cancel | Start cancel confirmation | Appointment: cancelled | MODIFIED |
| 5c | (Past) Tap Book Again | Start book-again flow | - | NEW |
| 6 | Tap “+” floating action button | Start new booking | - | NEW |

### Flow Diagram

```mermaid
graph TD
  A[History tab] --> B[Upcoming / Past toggle (NEW)]
  B --> C[Upcoming list]
  B --> D[Past list]

  C --> E[Appointment detail]
  D --> E

  C --> F[+ Book new appointment (NEW)]
  F --> G[Booking flow]

  E --> H{Action?}
  H -->|Cancel| I[Cancel confirmation]
  H -->|Reschedule| J[Reschedule: reason (NEW)]
  H -->|Book again| K[Book again: context (NEW)]

  J --> L[Reschedule: suggested slots]
  L --> M[Reschedule: confirm]
  M --> N[Reschedule: success]
  N --> A

  K --> O[Book again: alternatives]
  O --> P[Slot selection]
  P --> Q[Confirm]
  Q --> R[Success]
  R --> A
```

---

## Flow: Home Screen (J8) - MODIFIED

### Changes from Full Vision
- No Deals & Payback section
- No Active Prescriptions section
- Simplified to: Quick Actions, Upcoming, Newsfeed, Notifications

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Open app (authenticated) | Check profile completion | - | NEW |
| 2 | (If incomplete) Redirect | Show profile completion | - | NEW |
| 3 | Load home screen | Load upcoming + newsfeed preview | - | MODIFIED |
| 4 | View greeting | Show personalized greeting | - | - |
| 5 | View Quick Actions | Show Book + Family shortcuts | - | NEW |
| 6 | View Today's Focus | Spotlight next appointment (only if verified) | - | NEW |
| 7 | View Upcoming | Show next appointments preview | - | MODIFIED |
| 8 | View Latest Health News | Show curated newsfeed cards | Newsfeed: loaded | NEW |
| 9 | Tap bell icon | Open Notifications Center | - | NEW |
| 10 | Tap news card | Open Article Detail | - | NEW |
| 11 | Tap Quick Action | Navigate to feature | - | NEW |
| 12 | Tap Upcoming appointment | Navigate to History | - | - |

### Flow Diagram

```mermaid
graph TD
  A[Open app] --> B{Authenticated?}
  B -->|No| C[Welcome]
  B -->|Yes| D{Profile complete?}
  D -->|No| E[Profile completion gate (NEW)]
  D -->|Yes| F[Home]
  E --> F

  F --> G[Quick actions (Book, Family)]
  F --> H[Today's focus (NEW)]
  F --> I[Upcoming appointments]
  F --> J[Latest health news (NEW)]
  F --> K[Notifications bell (NEW)]

  G --> L[Booking flow]
  G --> M[Family members]
  I --> N[History]
  K --> O[Notifications center]
  J --> P[Article detail]
```

---

## Flow: Settings & Profile (NEW for v1)

### Description
Settings replaces the dedicated Profile section from full vision. Provides access to profile management, family members, and notification preferences.

### Flow Steps

| Step | User Action | System Response | Objects Modified | Change |
|------|-------------|-----------------|------------------|--------|
| 1 | Tap "Settings" tab | Show settings screen | - | NEW |
| 2 | View profile card | Show name, email, insurance | - | NEW |
| 3 | Tap "Family Members" | Navigate to family list | - | - |
| 4 | Tap "Notifications" | Navigate to notification preferences | Preferences: updated | MODIFIED |
| 5 | Tap other menu items | Open language/privacy/FAQ/support/help | Preferences: updated | NEW |
| 6 | Tap "Sign Out" | Sign out user | Auth: cleared | - |
| 7 | Tap "Reset All Data" | Clear local data | All: cleared | NEW |

### Flow Diagram

```mermaid
graph TD
  A[Settings tab] --> B[Settings]
  B --> C[Profile card]
  B --> D[Family members]
  B --> E[Notification preferences]
  B --> F[Language (NEW)]
  B --> G[Privacy (NEW)]
  B --> H[FAQ (NEW)]
  B --> I[Contact support (NEW)]
  B --> J[Help centre (NEW)]
  B --> K[Sign out]
  B --> L[Reset all data]
```

---

## Flows NOT in v1

### J4 - Telemedicine (OUT)
Full video consultation flow via Teleclinic is not included in v1.

### J5 - Online Prescription Redemption (OUT)
E-Rezept with NFC scan and CardLink integration is not included in v1.

### J6 - Offline Prescription Redemption (OUT)
Store finder and pharmacy pickup is not included in v1.

---

## Flow Metrics (v1)

| Flow | Primary Metric | Target | Notes |
|------|----------------|--------|-------|
| Registration | Completion rate | >90% | Email verification only |
| Profile | Completion rate | >95% | Mandatory gate |
| Booking | Completion rate | >60% | 4-step flow (location/insurance can be prefilled and skipped) |
| History | View rate | >40% | Per session |
| Home | Quick action tap rate | >30% | Book or Family |
| Settings | Family add rate | >20% | Of users with dependents |

---

## Data Model Impacts (v1)

### New Objects
- `BookingState` - Multi-step booking flow state
- `SearchFilters` - Expanded filters: specialty, city, radius, visitType, urgency, onlyPublic, minRating, languages, sortBy (UPDATED)
- `Newsfeed` / `Article` - Content cards and article detail (NEW)

### Modified Objects
| Object | Full Vision | v1 Scope |
|--------|-------------|----------|
| `User` | Includes Payback, dmAccountId | No Payback, no dm link |
| `Appointment` | Includes type (doctor/health/beauty) | Doctor type only |
| `History` | All types (appt, order, purchase) | Appointments only |

### Integration Points
| Integration | v1 Status |
|-------------|-----------|
| Curaay API | Required (mock in N3) |
| Newsfeed/CMS Content | Required (mock in N3) |
| Teleclinic | Not integrated |
| CardLink | Not integrated |
| dm Store API | Not integrated |
| Payback | Not integrated |

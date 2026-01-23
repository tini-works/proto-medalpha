# Scope for Exploration: Appointment Booking (Terminbuchung)

**Feature ID:** MEDA-BOOK
**Version:** 1.0
**Last Updated:** 2026-01-20
**Status:** Draft

---

## 1. Overview

### Main Job to Be Done (JTBD)

> **When I need to see a doctor, help me find an available appointment near me and book it quickly, so I can get care without phone calls or waiting on hold.**

### Purpose

Enable MedAlpha users to search for, compare, and book in-person doctor appointments through a unified interface. The feature eliminates the friction of phone-based booking, provides transparency into availability, and integrates seamlessly with calendar and navigation tools.

### Strategic Context

- **Competitive Gap:** Doctolib dominates booking but has no prescription/pharmacy integration. Jameda has dated UI. Neither offers white-label B2B2C.
- **User Pain Point:** 30% of Germans rate specialist wait times as "too long"; 50% want online booking (up from 31% in 2022).
- **Partner:** Curaay provides the booking API and doctor network.

---

## 2. Personas & Priority

| Persona | Priority | Key Need |
|---------|----------|----------|
| Sarah (34) | Primary | Book for self and children quickly during lunch break; <2 min completion |
| Marc (42) | Primary | Find preventive check-ups; efficiency; no wasted time |
| Helga (68) | Secondary | Simple flow; clear confirmations; easy to understand |
| Thomas (51) | Secondary | Transparent pricing; clear what's covered by insurance |
| Elena (23) | Tertiary | Modern UX; dermatology appointments; discreet |

---

## 3. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        APPOINTMENT BOOKING USER FLOW                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Entry   │───►│  Search  │───►│  Results │───►│  Doctor  │───►│  Time    │
│  Point   │    │  Screen  │    │  List    │    │  Profile │    │  Select  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │               │
     │               │               │               │               ▼
     │               │               │               │         ┌──────────┐
     │               │               │               │         │  Confirm │
     │               │               │               │         │  Sheet   │
     │               │               │               │         └──────────┘
     │               │               │               │               │
     │               │               │               │               ▼
     │               │               │               │         ┌──────────┐
     │               │               │               │         │ Success  │
     │               │               │               │         │ Screen   │
     │               │               │               │         └──────────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Entry Point → Search (Specialty + Location) → Results List → Doctor Profile →   │
│ Time Selection → Confirmation → Success → Calendar Sync / Navigation            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Detailed Flow:**
```
Entry Point
    │
    ├──► [Home Tab] Tap "Termin buchen"
    │
    └──► [Deep Link] From telemedicine summary ("Book follow-up")
            │
            ▼
      ┌─────────────┐
      │   SEARCH    │
      │─────────────│
      │ • Specialty │ ◄─── Autocomplete + Recent searches
      │ • Location  │ ◄─── GPS / Manual entry / Saved locations
      │ • Date pref │ ◄─── Optional: "This week" / "Next available"
      │ • Insurance │ ◄─── Pre-filled from profile (GKV/PKV)
      └─────────────┘
            │
            ▼
      ┌─────────────┐
      │  RESULTS    │
      │─────────────│
      │ • Filters   │ ◄─── Distance, Rating, Video available, Language
      │ • Sort      │ ◄─── Nearest, Soonest, Best rated
      │ • Doctor    │ ◄─── Card: Name, Specialty, Distance, 3 slots, Tags
      │   Cards     │
      └─────────────┘
            │
            ├──► [Quick Book] Tap time slot on card → Confirm Sheet
            │
            └──► [View Profile] Tap doctor card
                    │
                    ▼
              ┌─────────────┐
              │  PROFILE    │
              │─────────────│
              │ • Photo     │
              │ • Bio       │
              │ • Services  │
              │ • Reviews   │
              │ • Calendar  │ ◄─── Full week view
              │ • Location  │ ◄─── Map preview
              └─────────────┘
                    │
                    ▼
              ┌─────────────┐
              │ TIME SELECT │
              │─────────────│
              │ • Week view │
              │ • Time grid │
              │ • Duration  │
              └─────────────┘
                    │
                    ▼
              ┌─────────────┐
              │  CONFIRM    │ ◄─── Bottom sheet
              │─────────────│
              │ • Summary   │ ◄─── Doctor, Date, Time, Address
              │ • Reason    │ ◄─── Optional text field
              │ • Cost info │ ◄─── "Covered by [Insurance]" or price
              │ • [Confirm] │
              │ • [Cancel]  │
              └─────────────┘
                    │
                    ▼
              ┌─────────────┐
              │  SUCCESS    │
              │─────────────│
              │ • Checkmark │
              │ • Details   │
              │ • [Calendar]│ ◄─── Add to device calendar
              │ • [Route]   │ ◄─── Open Maps
              │ • [Done]    │
              │ • Partner   │ ◄─── "Powered by Curaay"
              └─────────────┘
```

---

## 4. User Stories & Acceptance Criteria

### Epic: Search & Discovery

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-001 | As a user, I want to search for doctors by specialty so that I can find the right type of care. | 1. Specialty field shows autocomplete suggestions after 2 characters<br>2. Recent searches (max 5) displayed below field<br>3. Common specialties shown as quick-select chips<br>4. German medical terms supported (e.g., "HNO" = "Hals-Nasen-Ohren")<br>5. Search works in German and English |
| BOOK-002 | As a user, I want to search by location so that I can find doctors near me or a specific area. | 1. "Use current location" button with GPS permission request<br>2. Manual entry with autocomplete (cities, postal codes)<br>3. Saved locations from profile pre-populated<br>4. Location displayed as "[City], [Distance] km" in results<br>5. Default radius: 10km; adjustable via filter |
| BOOK-003 | As a user, I want to filter results by my insurance type so that I only see doctors who accept my coverage. | 1. Insurance type (GKV/PKV) pre-filled from user profile<br>2. Filter toggle: "Nur Kassenärzte" (GKV only)<br>3. Results clearly tagged: "Kasse" / "Privat" / "Beides"<br>4. No private-only doctors shown to GKV users unless filter disabled<br>5. Warning if no results match insurance filter |
| BOOK-004 | As a user, I want to filter by additional criteria so that I can find the best match for my needs. | 1. Filter options: Distance, Rating, Video available, Languages spoken<br>2. Filters persist during session<br>3. Active filter count shown on filter button<br>4. "Clear all" resets to defaults<br>5. Results update immediately on filter change |
| BOOK-005 | As a user, I want to sort search results so that I can prioritize what matters most to me. | 1. Sort options: "Nächster Termin" (soonest), "Entfernung" (distance), "Bewertung" (rating)<br>2. Default sort: Soonest available<br>3. Current sort displayed in header<br>4. Sort persists during session |

### Epic: Doctor Information

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-006 | As a user, I want to see doctor cards in search results so that I can quickly compare options. | 1. Card shows: Name, Specialty, Distance, Rating (stars + count), 3 next available slots<br>2. Tags displayed: Insurance type, "Video möglich", Languages<br>3. "Mehr Termine" link if >3 slots available<br>4. Grayed-out state if no slots today with "Keine Termine heute"<br>5. Tap slot → Confirm sheet; Tap card → Profile |
| BOOK-007 | As a user, I want to view a doctor's full profile so that I can make an informed decision. | 1. Profile includes: Photo, Name, Specialty, Address, About text<br>2. Services listed with descriptions<br>3. Reviews section: Average rating, total count, 3 most recent<br>4. Map preview with address<br>5. "Termin buchen" CTA always visible |
| BOOK-008 | As a user, I want to see a doctor's full calendar so that I can choose a time that works for me. | 1. Week view with swipe navigation<br>2. Available slots highlighted; unavailable grayed<br>3. Slot duration shown (e.g., "30 min")<br>4. Time slots in 15/30 min increments<br>5. "Heute" button to return to current date |
| BOOK-009 | As a user, I want to read reviews from other patients so that I can assess doctor quality. | 1. Overall rating: Star average + total review count<br>2. Review shows: Rating, Date, Text (truncated), "Mehr lesen"<br>3. Reviews sorted by recency<br>4. "Alle Bewertungen" links to full list<br>5. No personally identifiable patient information shown |

### Epic: Booking Flow

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-010 | As a user, I want to select a time slot so that I can book my preferred appointment. | 1. Tap slot highlights it with visual feedback<br>2. Selected slot persists if navigating back/forward<br>3. Slot shows: Time, Duration, Appointment type<br>4. Real-time availability check before confirm<br>5. Error message if slot taken: "Termin nicht mehr verfügbar" |
| BOOK-011 | As a user, I want to confirm my booking details so that I know exactly what I'm agreeing to. | 1. Confirmation sheet shows: Doctor name, Address, Date, Time, Duration<br>2. "Grund des Besuchs" optional text field (max 200 chars)<br>3. Cost information: "Kassenleistung" or specific price<br>4. "Termin bestätigen" primary CTA<br>5. "Abbrechen" secondary action |
| BOOK-012 | As a user, I want to receive confirmation of my booking so that I have proof and can plan accordingly. | 1. Success screen with checkmark animation<br>2. Booking details displayed: Doctor, Date, Time, Address<br>3. Confirmation number shown<br>4. "Zum Kalender hinzufügen" button<br>5. "Route öffnen" button<br>6. Email/push confirmation sent |
| BOOK-013 | As a user, I want to add the appointment to my calendar so that I don't forget. | 1. "Zum Kalender hinzufügen" opens native calendar picker<br>2. Event pre-filled: Title, Date/Time, Location, Notes<br>3. Works with iOS Calendar, Google Calendar<br>4. Reminder set: 1 day before, 1 hour before (default)<br>5. Success toast: "Termin hinzugefügt" |
| BOOK-014 | As a user, I want to get directions to the doctor's office so that I can arrive on time. | 1. "Route öffnen" launches Maps app (Apple/Google)<br>2. Destination pre-filled with doctor address<br>3. Works from success screen and appointment details<br>4. Fallback: Copy address to clipboard if no maps app |

### Epic: Booking Management

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-015 | As a user, I want to view my upcoming appointments so that I can manage my schedule. | 1. "Meine Termine" section on home/profile<br>2. List shows: Doctor, Specialty, Date, Time, Address<br>3. Sorted by date (soonest first)<br>4. Tap appointment → Details screen<br>5. Empty state: "Keine anstehenden Termine" |
| BOOK-016 | As a user, I want to cancel an appointment so that I can free up the slot if I can't attend. | 1. "Termin absagen" button in appointment details<br>2. Confirmation dialog: "Möchten Sie diesen Termin wirklich absagen?"<br>3. Cancellation policy displayed (e.g., "Kostenlose Stornierung bis 24h vorher")<br>4. Success message: "Termin wurde abgesagt"<br>5. Appointment removed from list; moved to history |
| BOOK-017 | As a user, I want to reschedule an appointment so that I can change to a better time without rebooking. | 1. "Termin verschieben" button in appointment details<br>2. Opens calendar view for same doctor<br>3. Original slot released after new selection confirmed<br>4. Confirmation: "Termin verschoben auf [new date/time]"<br>5. Updated confirmation sent via email/push |
| BOOK-018 | As a user, I want to see my appointment history so that I can reference past visits. | 1. "Vergangene Termine" section accessible from profile<br>2. List shows: Doctor, Specialty, Date, Status (completed/cancelled)<br>3. Tap → Details with option to "Erneut buchen"<br>4. History retained for 12 months minimum<br>5. Sorted by date (most recent first) |

### Epic: Accessibility & Edge Cases

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| BOOK-019 | As Helga (68), I want large text and clear buttons so that I can use the app comfortably. | 1. Body text minimum 16pt; headings 20pt+<br>2. Touch targets minimum 48x48dp<br>3. High contrast mode supported<br>4. No time-limited interactions (except real-time availability)<br>5. Step indicator shows progress: "Schritt 2 von 4" |
| BOOK-020 | As a user with slow internet, I want the app to handle poor connectivity gracefully. | 1. Search results cached for 5 minutes<br>2. Offline indicator shown when disconnected<br>3. Retry button on failed requests<br>4. Booking confirmation queued if offline, sent when reconnected<br>5. Skeleton loading states (not spinners) |
| BOOK-021 | As Sarah (34), I want to book appointments for my children so that I can manage family health. | 1. "Für wen ist der Termin?" selector in confirm sheet<br>2. Options: "Für mich", "Für [Child name]" (from family profiles)<br>3. Child's insurance info used for eligibility<br>4. Appointment tagged with patient name<br>5. Future: Dedicated family account management |
| BOOK-022 | As a user, I want to receive appointment reminders so that I don't miss my booking. | 1. Push notification 24 hours before<br>2. Push notification 1 hour before<br>3. Reminder includes: Doctor, Time, Address, "Route öffnen" action<br>4. Reminder preferences configurable in settings<br>5. Email reminder 24 hours before (if email verified) |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Search results load in <2 seconds on 3G |
| Performance | Booking confirmation completes in <3 seconds |
| Availability | 99.5% uptime for booking API |
| Accessibility | WCAG 2.1 AA compliance |
| Localization | German (primary), English (launch), 14 languages (roadmap) |
| Security | Booking data encrypted at rest and in transit |
| Analytics | Track: Search→Result→Profile→Book conversion funnel |

---

## 6. Out of Scope (V1)

- Booking for non-registered users (guest checkout)
- Multi-appointment booking (e.g., series of physio sessions)
- Waitlist functionality ("Notify me if earlier slot opens")
- Video visit booking (separate Telemedicine feature)
- Payment processing for private appointments
- Integration with employer/HR systems

---

## 7. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Curaay Booking API | Partner | In progress |
| User Profile (insurance info) | MedAlpha | Required |
| Push Notification Service | MedAlpha | Required |
| Calendar Integration SDK | Platform | Available |
| Maps Deep Linking | Platform | Available |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Booking completion rate | >60% | (Bookings / Search sessions) |
| Time to book | <2 minutes | From search to confirmation |
| Booking show-up rate | >85% | (Attended / Booked) |
| User satisfaction | >4.2/5 | Post-booking survey |
| Repeat booking rate | >40% | Users who book again within 90 days |

---

## 9. Open Questions

1. Should we show estimated wait times in the office (if available from Curaay)?
2. What is the cancellation policy we should display (partner-dependent)?
3. Should we allow booking without an account (guest mode) in V2?
4. How do we handle doctors who require referrals?
5. Should we integrate with TK/Barmer appointment services (116117)?

---

## 10. References

- [Product Context](../z.product-context-personas/product-context.md)
- [Personas](../z.product-context-personas/personas-details.json)
- [Social Listening Synthesis](./z.research/social-listening-synthesis.md)
- [Competitive Landscape](./z.research/competitive-landscape-research.md)

# Appointment Booking Screen Inventory + Interaction Spec

**Source:** 01-appointment-booking-scope.md  
**Last Updated:** 2026-01-21  
**Status:** Draft  

---

## Screen Inventory

| ID | Screen | Purpose | Primary Stories | Key Interactions | Core States |
|----|--------|---------|-----------------|------------------|-------------|
| AB-01 | Home Entry (Termin buchen) | Entry point to booking | BOOK-015 | Tap "Termin buchen", open My Appointments | Default |
| AB-02 | Search | Capture specialty, location, insurance | BOOK-001, BOOK-002, BOOK-003 | Autocomplete, GPS, quick chips, search CTA | Default, validation errors, offline |
| AB-03 | Filters | Refine results | BOOK-004 | Toggle filters, clear all | Default |
| AB-04 | Sort | Order results | BOOK-005 | Select sort option | Default |
| AB-05 | Results List | Compare doctors and slots | BOOK-006 | Tap card, tap slot, open filters/sort | Default, loading (skeleton), no results |
| AB-06 | Doctor Profile | Full doctor info | BOOK-007 | View services, map preview, CTA | Default |
| AB-07 | Reviews List | Full reviews list | BOOK-009 | Expand review, open full list | Default |
| AB-08 | Doctor Calendar / Time Select | Choose a slot | BOOK-008, BOOK-010 | Swipe week, select slot, "Heute" | Default, slot taken |
| AB-09 | Confirm Sheet | Confirm details, patient, cost | BOOK-011, BOOK-021 | Confirm, cancel, reason input, patient selector | Default, validation |
| AB-10 | Slot Unavailable | Error state before confirm | BOOK-010 | Retry, pick new slot | Error |
| AB-11 | Success | Booking confirmation | BOOK-012 | Add to calendar, open route, done | Default |
| AB-12 | Add to Calendar (handoff) | Calendar integration | BOOK-013 | Open native picker | System handoff |
| AB-13 | Open Route (handoff) | Maps integration | BOOK-014 | Open maps with address | System handoff |
| AB-14 | My Appointments (Upcoming) | Manage upcoming bookings | BOOK-015 | Tap appointment | Default, empty |
| AB-15 | Appointment Details | View, cancel, reschedule | BOOK-016, BOOK-017, BOOK-014 | Cancel, reschedule, open route | Default |
| AB-16 | Cancel Confirmation | Confirm cancel | BOOK-016 | Confirm or dismiss | Default |
| AB-17 | Reschedule | Rebook same doctor | BOOK-017 | Select new slot, confirm | Default |
| AB-18 | Past Appointments | Appointment history | BOOK-018 | Tap appointment, rebook | Default, empty |
| AB-19 | Reminder Preferences | Reminder settings | BOOK-022 | Toggle push/email, save | Default |
| AB-20 | Offline / Retry (global) | Connectivity handling | BOOK-020 | Retry request | Offline |

---

## Interaction Spec (by screen)

### AB-01 Home Entry (Termin buchen)
- Tap "Termin buchen" -> AB-02 Search.
- Tap "Meine Termine" -> AB-14 My Appointments.

### AB-02 Search
- Specialty input: autocomplete after 2 chars; quick chips; show recent searches (max 5). (BOOK-001)
- Location: GPS permission button; manual autocomplete; saved locations from profile. (BOOK-002)
- Insurance: prefilled from profile; toggle "Nur Kassenaerzte". (BOOK-003)
- CTA "Suchen" -> AB-05 Results.
- Offline banner + retry if no connectivity. (BOOK-020)

### AB-03 Filters
- Toggle: distance, rating, video available, languages. (BOOK-004)
- Show active filter count on results.
- "Clear all" resets.

### AB-04 Sort
- Options: soonest, distance, rating; default soonest. (BOOK-005)
- Persist selection for session.

### AB-05 Results List
- Doctor cards show name, specialty, distance, rating, 3 slots, tags. (BOOK-006)
- Tap slot -> AB-09 Confirm Sheet (Quick Book).
- Tap card -> AB-06 Doctor Profile.
- "Mehr Termine" -> AB-06 Doctor Profile.
- No results -> AB-05 No Results state with insurance warning if applicable. (BOOK-003)
- Skeleton loading state (not spinner). (BOOK-020)

### AB-06 Doctor Profile
- Always-visible CTA "Termin buchen" -> AB-08 Calendar. (BOOK-007)
- Map preview -> opens AB-13 Open Route (handoff).
- Link to reviews -> AB-07 Reviews List.

### AB-07 Reviews List
- Show rating + total count, reviews sorted by recency. (BOOK-009)
- "Mehr lesen" expands review text.

### AB-08 Doctor Calendar / Time Select
- Week view swipe; "Heute" button; 15/30 min increments. (BOOK-008)
- Tap slot highlights; selection persists on back. (BOOK-010)
- If slot taken on confirm attempt -> AB-10 Slot Unavailable. (BOOK-010)

### AB-09 Confirm Sheet
- Show summary: doctor, date, time, duration, address. (BOOK-011)
- Optional reason field (max 200 chars). (BOOK-011)
- Patient selector: "Fuer mich" or child from family profiles. (BOOK-021)
- Cost info: "Kassenleistung" or price. (BOOK-011)
- CTA "Termin bestaetigen" -> AB-11 Success.
- "Abbrechen" closes sheet.

### AB-10 Slot Unavailable
- Error message: "Termin nicht mehr verfuegbar". (BOOK-010)
- CTA to pick new slot -> AB-08 Calendar.

### AB-11 Success
- Checkmark animation, confirmation number, booking details. (BOOK-012)
- "Zum Kalender hinzufuegen" -> AB-12 Add to Calendar. (BOOK-013)
- "Route oeffnen" -> AB-13 Open Route. (BOOK-014)
- Confirmation message indicates email/push sent. (BOOK-012)

### AB-12 Add to Calendar (handoff)
- Opens native calendar with prefilled event (title, date/time, location, notes). (BOOK-013)
- Default reminders: 1 day + 1 hour. (BOOK-013)
- Success toast: "Termin hinzugefuegt". (BOOK-013)

### AB-13 Open Route (handoff)
- Opens maps app with doctor address. (BOOK-014)
- Fallback: copy address to clipboard. (BOOK-014)

### AB-14 My Appointments (Upcoming)
- List shows doctor, specialty, date, time, address; sorted soonest. (BOOK-015)
- Tap appointment -> AB-15 Details.
- Empty state: "Keine anstehenden Termine". (BOOK-015)

### AB-15 Appointment Details
- Show details + actions (reschedule, cancel). (BOOK-016, BOOK-017)
- "Termin absagen" -> AB-16 Cancel Confirmation.
- "Termin verschieben" -> AB-17 Reschedule.
- "Route oeffnen" -> AB-13 Open Route.

### AB-16 Cancel Confirmation
- Confirmation dialog + cancellation policy text. (BOOK-016)
- Success message: "Termin wurde abgesagt".
- Appointment moves to history (AB-18).

### AB-17 Reschedule
- Open same doctor calendar; select new slot -> AB-09 Confirm -> AB-11 Success. (BOOK-017)
- Old slot released only after confirm.

### AB-18 Past Appointments
- List includes status (completed/cancelled); sorted most recent. (BOOK-018)
- Tap -> details with "Erneut buchen".

### AB-19 Reminder Preferences
- Toggle push reminders (24h, 1h) and email reminder (24h). (BOOK-022)
- Save updates.

### AB-20 Offline / Retry (global)
- Offline indicator and retry on failed requests. (BOOK-020)
- Cache results for 5 minutes.
- Queue confirm if offline, send when reconnected.

---

## Cross-Cutting Requirements (applied to all screens)

- Accessibility: 16pt+ body text, 20pt+ headings, 48x48dp targets, high contrast. (BOOK-019)
- Step indicator: "Schritt X von Y" where applicable. (BOOK-019)
- Performance: search results <2s on 3G; booking confirm <3s. (NFR)

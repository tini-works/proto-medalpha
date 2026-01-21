# Appointment Booking Requirements Matrix

**Source:** 01-appointment-booking-scope.md  
**Last Updated:** 2026-01-21  
**Status:** Draft  

---

## Overview

This matrix maps each user story and acceptance criteria to the screens/flows required for the appointment booking feature. It is intended to guide a comprehensive prototype that covers all stories and ACs.

---

## Epic: Search & Discovery

| ID | User Story | Acceptance Criteria (abridged) | Screens/Flows | Prototype Coverage |
|----|------------|--------------------------------|---------------|--------------------|
| BOOK-001 | Search by specialty | Autocomplete after 2 chars; recent searches (max 5); quick chips; German terms (e.g., HNO); DE/EN search | Search screen | Required |
| BOOK-002 | Search by location | GPS button; manual autocomplete; saved locations; results show city + distance; default radius 10km + adjustable | Search screen, Filters | Required |
| BOOK-003 | Filter by insurance | Pre-filled GKV/PKV; GKV-only toggle; tags Kasse/Privat/Beides; hide private-only when GKV filter on; no-results warning | Search screen, Results, Filters | Required |
| BOOK-004 | Filter by criteria | Filters: distance, rating, video, language; persist in session; active filter count; clear all; instant update | Filters, Results | Required |
| BOOK-005 | Sort results | Sort: soonest, distance, rating; default soonest; shown in header; persists | Results, Sort control | Required |

---

## Epic: Doctor Information

| ID | User Story | Acceptance Criteria (abridged) | Screens/Flows | Prototype Coverage |
|----|------------|--------------------------------|---------------|--------------------|
| BOOK-006 | Doctor cards | Card shows name/specialty/distance/rating + 3 slots; tags; “Mehr Termine”; grayed if no slots; slot tap → confirm, card tap → profile | Results, Confirm sheet | Required |
| BOOK-007 | Doctor profile | Photo/name/specialty/address/about; services list; reviews (avg/count/3 recent); map preview; “Termin buchen” CTA | Doctor profile | Required |
| BOOK-008 | Full calendar | Week view swipe; available vs unavailable; duration shown; 15/30 min increments; “Heute” button | Time select/calendar | Required |
| BOOK-009 | Reviews | Rating + count; review snippet + “Mehr lesen”; sorted by recency; “Alle Bewertungen”; no PII | Doctor profile, Reviews list | Required |

---

## Epic: Booking Flow

| ID | User Story | Acceptance Criteria (abridged) | Screens/Flows | Prototype Coverage |
|----|------------|--------------------------------|---------------|--------------------|
| BOOK-010 | Select time slot | Tap highlight; persists on back/forward; shows time/duration/type; real-time check before confirm; error if taken | Time select, Confirm sheet | Required |
| BOOK-011 | Confirm booking | Summary (doctor/date/time/address/duration); optional reason (200 chars); cost info; confirm CTA; cancel | Confirm sheet | Required |
| BOOK-012 | Booking success | Checkmark animation; details; confirmation number; add to calendar; open route; email/push sent | Success screen | Required |
| BOOK-013 | Add to calendar | Opens native picker; pre-filled event; iOS + Google; default reminders 1 day/1 hour; success toast | Success screen → Calendar | Required |
| BOOK-014 | Directions | Open Maps with address; available from success and details; fallback copy address | Success screen, Appointment details | Required |

---

## Epic: Booking Management

| ID | User Story | Acceptance Criteria (abridged) | Screens/Flows | Prototype Coverage |
|----|------------|--------------------------------|---------------|--------------------|
| BOOK-015 | Upcoming appointments | “Meine Termine” section; list shows doctor/specialty/date/time/address; sorted soonest; tap → details; empty state | Home/Profile, Appointment list, Details | Required |
| BOOK-016 | Cancel appointment | “Termin absagen” button; confirm dialog; cancellation policy; success message; removed from list → history | Appointment details, Cancel dialog | Required |
| BOOK-017 | Reschedule | “Termin verschieben” button; calendar for same doctor; release original after confirm; success confirmation; updated email/push | Appointment details, Calendar, Confirm | Required |
| BOOK-018 | Appointment history | “Vergangene Termine”; list with status; tap → details + “Erneut buchen”; retain 12 months; sorted recent | History list, Details | Required |

---

## Epic: Accessibility & Edge Cases

| ID | User Story | Acceptance Criteria (abridged) | Screens/Flows | Prototype Coverage |
|----|------------|--------------------------------|---------------|--------------------|
| BOOK-019 | Accessibility (Helga) | 16pt+ body, 20pt+ headings; 48x48dp targets; high contrast; no time limits; step indicator | All screens | Required |
| BOOK-020 | Poor connectivity | Cache results 5 min; offline indicator; retry button; queued confirmation; skeleton loading | Search, Results, Confirm, Success | Required |
| BOOK-021 | Book for children | “Für wen ist der Termin?” selector; options for self/child; child insurance used; tagged with patient; future family mgmt | Confirm sheet | Required |
| BOOK-022 | Appointment reminders | Push 24h + 1h; reminder content includes doctor/time/address/route; preferences in settings; email reminder | Notifications, Settings | Required |

---

## Prototype Coverage Notes

- **Required** indicates the interactive prototype must include the screen or state to validate the acceptance criteria.
- Where system integrations are required (calendar/maps/notifications), prototype should simulate the handoff with a clear transition or modal.

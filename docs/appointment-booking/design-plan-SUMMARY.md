# Design Plan: Appointment Booking N3 Implementation

**Feature ID:** MEDA-BOOK
**Status:** Implemented
**App:** `apps/appointment-booking-N3`
**Port:** 5190

---

## 1. Overview

This document describes the implemented design for the Appointment Booking system in the N3 prototype, covering:
- **Booking Management** (Upcoming/Past appointments)
- **Reschedule Flow** (AI-assisted slot suggestions)
- **Book Again Flow** (Pre-filled context from history)

### Main Job to Be Done

> When I need to manage my appointments, help me reschedule or book again quickly without re-entering information I've already provided.

---

## 2. Screen Inventory

### 2.1 Booking Management

| ID | Screen | File | Purpose |
|----|--------|------|---------|
| S11 | My Appointments | `screens/history/HistoryScreen.tsx` | Tabs: Upcoming / Past |
| S12 | Appointment Details | `screens/history/AppointmentDetailScreen.tsx` | View + actions |
| S13 | Cancel Dialog | (inline in S12) | Confirm cancellation |

### 2.2 Reschedule Flow

| ID | Screen | File | Purpose |
|----|--------|------|---------|
| R01 | Suggested Slots | `screens/reschedule/SuggestedSlotsScreen.tsx` | 3-5 AI alternatives |
| R02 | Reschedule Confirm | `screens/reschedule/RescheduleConfirmScreen.tsx` | Before/after comparison |
| R03 | Reschedule Success | `screens/reschedule/RescheduleSuccessScreen.tsx` | Confirmation + actions |

### 2.3 Book Again Flow

| ID | Screen | File | Purpose |
|----|--------|------|---------|
| B01 | Pre-filled Context | `screens/book-again/BookAgainContextScreen.tsx` | Confirm/edit before calendar |

---

## 3. User Flows

### 3.1 Reschedule Flow

```
[S11] My Appointments (Upcoming tab)
   │
   │ Tap appointment card
   ▼
[S12] Appointment Details
   │
   │ Tap "Reschedule Appointment"
   ▼
[R01] Suggested Slots
   │
   ├──► Select suggestion ──► [R02] Confirm ──► [R03] Success
   │
   └──► "View All Available Times" ──► [S08] Calendar ──► [R02] ──► [R03]
```

### 3.2 Book Again Flow

```
[S11] My Appointments (Past tab)
   │
   │ Tap "Book Again"
   ▼
[B01] Pre-filled Context
   │
   │ "View Available Times"
   ▼
[S08] Calendar ──► [S09] Confirm ──► [S10] Success
```

### 3.3 Cancel Flow

```
[S12] Appointment Details
   │
   │ Tap "Cancel Appointment"
   ▼
[S13] Cancel Dialog (inline modal)
   │
   │ Confirm
   ▼
[S11] My Appointments (appointment removed)
```

---

## 4. Screen Specifications

### S11 — My Appointments

**Header:**
- Title: "My Appointments"
- Add appointment button (calendar icon)

**Tabs:**
- "Upcoming" — Confirmed appointments with future dates
- "Past" — Completed or cancelled appointments

**Upcoming Tab Content:**
- AppointmentCard for each appointment
- Actions: "Reschedule", "Cancel"
- Empty state: "No upcoming appointments"

**Past Tab Content:**
- HistoryCard for each past appointment
- Shows status pill: "Completed" or "Cancelled"
- Action: "Book Again" button
- Empty state: "No past appointments"

**Bottom CTA:**
- "Book Appointment" button (fixed)

---

### S12 — Appointment Details

**Header:**
- Back button
- Title: "Appointment Details"

**Content:**
- Status badge (Confirmed/Completed/Cancelled)
- Doctor card (avatar, name, specialty)
- Details section:
  - Date & time (with calendar icon)
  - Location (with map icon + "Open Route" link)
  - Patient name (if specified)

**Actions (Upcoming):**
- Primary: "Reschedule Appointment"
- Destructive: "Cancel Appointment"
- Secondary: "Get Directions"

**Actions (Past, not cancelled):**
- Primary: "Book Again"
- Secondary: "Get Directions"

**Cancel Dialog (S13):**
- Title: "Cancel Appointment?"
- Confirmation message with date
- Cancellation policy note
- Buttons: "Keep" / "Cancel Appointment"

---

### R01 — Suggested Slots

**Header:**
- Back button
- Title: "Reschedule Appointment"

**Current Appointment Summary:**
- Date, time, doctor name, specialty
- Background: neutral-50

**Available Alternatives:**
- 3-5 slot cards, each showing:
  - Date and time (formatted)
  - Duration: "30 min"
  - Reason label (e.g., "Same time", "Similar time")
  - "Select" button

**AI Suggestion Priority:**
1. Same time, nearest day → "Same time"
2. Within ±2 hours → "Similar time"
3. Soonest available → "Soonest available"
4. Same day of week → "Same weekday"

**Fallback:**
- Divider line
- "View All Available Times" button (full-width, secondary style)

**Empty State:**
- "No slots available" message
- "View All Available Times" button

---

### R02 — Reschedule Confirm

**Header:**
- Back button
- Title: "Confirm Reschedule"

**Comparison View:**
- Old appointment card (red background, X icon)
  - "Previous Appointment"
  - Date/time
  - "Will be cancelled"
- Arrow indicator (down)
- New appointment card (teal background, checkmark icon)
  - "New Appointment"
  - Date/time
  - "Will be booked"

**Details Section:**
- Doctor name and specialty
- Location
- Patient (if specified)

**Safety Note:**
- Info box (blue background)
- "Your previous appointment will only be cancelled after the new appointment is confirmed."

**Actions:**
- Primary: "Reschedule Appointment"
- Secondary: "Cancel" (text link)

**Error Handling:**
- Slot-taken error message in red box
- Returns user to R01 to select another slot

---

### R03 — Reschedule Success

**Success Header:**
- Animated checkmark (teal circle)
- Title: "Appointment Rescheduled"
- Subtitle: "Your appointment has been successfully rescheduled."

**Appointment Card:**
- Doctor avatar (initials)
- Doctor name and specialty
- Date and time
- Location
- Confirmation number

**Notification Message:**
- "An updated confirmation has been sent via email and push notification."

**Actions:**
- "Update Calendar" — Downloads ICS file
- "Open Route" — Opens Google Maps
- "Done" — Returns to My Appointments

---

### B01 — Pre-filled Context

**Header:**
- Back button
- Title: "Book Again"

**Reference:**
- "Based on your appointment from [date]"
- Background: neutral-50

**Pre-filled Fields:**
Each field shows label, value, and checkmark icon.

| Field | Source | Editable |
|-------|--------|----------|
| Doctor | History appointment | No |
| Specialty | From doctor | No |
| Location | User profile | Future |
| Insurance | User profile | Future |
| Patient | User profile | Future |

**Doctor Card:**
- Avatar, name, specialty
- Current rating and city

**Primary CTA:**
- "View Available Times" → Navigates to S08 (Calendar)

**Error State (Doctor Unavailable):**
- Warning icon
- "This doctor is no longer available"
- "Search for Doctors" button

---

## 5. Routes

| Path | Screen | Description |
|------|--------|-------------|
| `/history` | S11 | My Appointments |
| `/history/:id` | S12 | Appointment Details |
| `/reschedule/:id` | R01 | Suggested Slots |
| `/reschedule/:id/confirm` | R02 | Reschedule Confirm |
| `/reschedule/:id/success` | R03 | Reschedule Success |
| `/book-again/:id` | B01 | Pre-filled Context |

---

## 6. State Management

### Types

```typescript
interface RescheduleContext {
  originalAppointment: Appointment
  suggestedSlots: SuggestedSlot[]
  selectedNewSlot: TimeSlot | null
}

interface SuggestedSlot extends TimeSlot {
  reason: 'same_time' | 'similar_time' | 'soonest' | 'same_weekday'
  reasonLabel: string
}

interface BookAgainContext {
  sourceAppointmentId: string
  sourceDate: string
  doctor: Doctor
  location: { city: string; postalCode: string }
  insurance: { type: 'GKV' | 'PKV' | 'Selbstzahler' | '' }
  patient: { id: string; name: string; relationship: 'self' | 'child' }
}
```

### Hooks

| Hook | Purpose |
|------|---------|
| `useReschedule()` | Reschedule context, slot selection |
| `useBookAgain()` | Book again context |
| `useBooking()` | Appointments, cancel/update actions |
| `useHistory()` | History items, update actions |

---

## 7. API Functions

| Function | Purpose |
|----------|---------|
| `apiGetSuggestedSlots(doctorId, appointment)` | Get 3-5 AI-suggested slots |
| `apiRescheduleAppointment(oldId, newSlot)` | Book new, cancel old |
| `apiCancelAppointment(appointmentId)` | Cancel appointment |

---

## 8. Design Constraints

| Constraint | Value |
|------------|-------|
| Language | English (i18n ready) |
| Touch targets | ≥44px height |
| Primary color | Teal (#0D9488) |
| Destructive color | Red (#DC2626) |
| Card radius | rounded-xl (12px) |
| Button height | h-12 (48px) |

---

## 9. Edge Cases Handled

| Scenario | Response |
|----------|----------|
| No suggested slots | Empty state + "View All" button |
| Slot taken at confirm | Error message, return to R01 |
| Doctor unavailable (Book Again) | Error state + search redirect |
| Appointment not found | Error message + back link |
| Cancel while offline | Block action (no queuing) |

---

## 10. Future Enhancements (Not Implemented)

| Feature | Description |
|---------|-------------|
| Insurance mismatch warning | Show warning if doctor no longer accepts user's insurance |
| Calendar conflict check | Check user's calendar before suggesting slots |
| Editable fields in B01 | Allow editing location, insurance, patient |
| AI suggestions for Book Again | Add slot suggestions like reschedule flow |
| Reschedule history | Track how many times appointments are rescheduled |

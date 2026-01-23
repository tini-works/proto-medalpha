---
name: design-lite:book-again-flow-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "V1 Hybrid — Pre-fill Context + Full Calendar"
created: 2026-01-23
updated: 2026-01-23
status: draft
version: 2.0
supersedes:
  - docs/appointment-booking/2-design-plan-Book-again-flow.md
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-018)
decision_doc:
  - docs/appointment-booking/2-analysis-AI-assisted-vs-standard.md
sources:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
---

# DESIGN-LITE: Book Again Flow v2 (V1 Hybrid)

This document details the **V1 Hybrid** Book Again flow — a streamlined approach that pre-fills context from appointment history but uses the standard full calendar for slot selection. Designed for simplicity while still providing convenience.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: BOOK AGAIN FLOW v2       Status: 🟡 DRAFT                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                               │
│ Selected approach: V1 Hybrid — Pre-fill Context + Full Calendar          │
│                                                                          │
│ V1 Simplifications (vs full AI-assisted):                                │
│ ✓ Pre-fill doctor, insurance, patient from history                       │
│ ✓ Use standard full calendar (no slot suggestions)                       │
│ ✓ No timing hints ("6 months since last visit")                          │
│ ✓ No similar doctor suggestions (dead end if unavailable)                │
│                                                                          │
│ Hypothesis: IF we pre-fill booking context from history and go directly  │
│ to the doctor's calendar, THEN book-again time will be <90 seconds with  │
│ >70% completion, FOR returning patients, BECAUSE familiar context        │
│ reduces data entry while the calendar provides full control.             │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOW (Simplified)                                                │
│                                                                          │
│ Flow diagram:                                                            │
│ ┌──────────────────┐   ┌───────────────────┐   ┌───────────────────┐    │
│ │ Appointment      │→→ │ Pre-filled        │→→ │ Full Calendar     │    │
│ │ History (S11)    │   │ Context (B01)     │   │ (S08)             │    │
│ └──────────────────┘   └───────────────────┘   └─────────┬─────────┘    │
│                                                          │              │
│                                                    (select slot)        │
│                                                          │              │
│                                                          v              │
│                                                ┌───────────────────┐    │
│                                                │ Confirm Sheet     │    │
│                                                │ (S09)             │    │
│                                                └─────────┬─────────┘    │
│                                                          │              │
│                                                          v              │
│                                                ┌───────────────────┐    │
│                                                │ Success           │    │
│                                                │ (S10)             │    │
│                                                └───────────────────┘    │
├──────────────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                                      │
│                                                                          │
│ ✅ V1 IN SCOPE:                                                          │
│ • "Erneut buchen" action from appointment history                        │
│ • Pre-filled booking context (doctor, specialty, insurance, patient)     │
│ • Editable context before proceeding                                     │
│ • Full calendar for slot selection (reuse S08)                           │
│ • Standard confirm sheet (reuse S09)                                     │
│ • Standard success screen (reuse S10)                                    │
│                                                                          │
│ ⏳ DEFERRED TO V1.1:                                                     │
│ • AI-suggested slots (like Reschedule flow)                              │
│ • Follow-up timing hints                                                 │
│ • Similar doctor suggestions if unavailable                              │
│ • User booking pattern detection                                         │
│                                                                          │
│ ❌ OUT OF SCOPE:                                                         │
│ • Proactive "time to rebook" notifications                               │
│ • Series/recurring appointment booking                                   │
│ • Doctor comparison view                                                 │
│                                                                          │
│ 📏 SUCCESS METRICS:                                                      │
│ • Primary: Book-again completion rate → Target: >70%                     │
│ • Leading: Time-to-book-again → Target: <90 seconds                      │
│ • Leading: Same-doctor rebooking rate → Track (no target)                │
│ • Guardrail: Drop-off at context screen → <10%                           │
├──────────────────────────────────────────────────────────────────────────┤
│ 🧩 SCREENS (V1 Simplified)                                               │
│                                                                          │
│ │ ID  │ Screen                             │ Purpose                    ││
│ ├─────┼────────────────────────────────────┼────────────────────────────┤│
│ │ B01 │ Pre-filled Context                 │ Confirm/edit before booking││
│ │ S08 │ Full Calendar (reuse)              │ Slot selection             ││
│ │ S09 │ Confirm Sheet (reuse)              │ Final commit               ││
│ │ S10 │ Success (reuse)                    │ Confirmation               ││
│                                                                          │
│ Screen flow:                                                             │
│ [S11]→[B01]→[S08]→[S09]→[S10]                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## Global UX Constraints

Inherits all constraints from Guided Wizard v2:
- **Language**: German default, formal "Sie"
- **Date/time**: Germany formatting (`Do., 23.01.2026`, `14:30`), Europe/Berlin
- **Accessibility**: 16px min body, 44px tap targets, WCAG AA contrast
- **DocliQ Brand**: DM Sans font, Teal primary (#13A3B5), Charcoal text (#1C2A30)

---

## Screen Specifications

### S11 Enhancement — History Row with "Erneut buchen"

**Enhancement to existing history screen (per BOOK-018)**:

Each history row gains an `Erneut buchen` action.

```
┌─────────────────────────────────────────┐
│ ← Vergangene Termine                    │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Anna Müller                     │ │
│ │ Allgemeinmedizin                    │ │
│ │ Mi., 15.01.2026 · 10:00             │ │
│ │                                     │ │
│ │ ✓ Erledigt                          │ │
│ │                                     │ │
│ │              [Erneut buchen]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Klaus Weber                     │ │
│ │ Kardiologie                         │ │
│ │ Mo., 02.12.2025 · 14:30             │ │
│ │                                     │ │
│ │ ✓ Erledigt                          │ │
│ │                                     │ │
│ │              [Erneut buchen]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Maria Schmidt                   │ │
│ │ Dermatologie                        │ │
│ │ Fr., 15.11.2025 · 09:00             │ │
│ │                                     │ │
│ │ ✕ Abgesagt                          │ │
│ │                                     │ │
│ │              [Erneut buchen]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**V1 Notes**:
- No timing hints in V1 (deferred to V1.1)
- Both completed and cancelled appointments show "Erneut buchen"
- Tapping "Erneut buchen" → B01 with pre-filled context

**Acceptance Criteria**:
- [ ] Each history row shows "Erneut buchen" button
- [ ] Button meets 44px touch target requirement
- [ ] Works for both "Erledigt" and "Abgesagt" appointments
- [ ] Tapping navigates to B01 with context

---

### B01 — Pre-filled Context

**Purpose**: Show pre-filled booking context and allow edits before proceeding to calendar.

**Header**:
- Back arrow (returns to history)
- Title: `Erneut buchen`

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Erneut buchen                         │
├─────────────────────────────────────────┤
│                                         │
│ Basierend auf Ihrem Termin vom          │
│ 15.01.2026                              │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Arzt/Ärztin                             │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Dr. Anna Müller                  │ │
│ │    Allgemeinmedizin                 │ │
│ │    ★ 4,8 (234) · 2,3 km             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Fachgebiet                              │
│ ┌─────────────────────────────────────┐ │
│ │ Allgemeinmedizin               [✓]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Standort                                │
│ ┌─────────────────────────────────────┐ │
│ │ Berlin-Mitte (10178)           [✓]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Versicherung                            │
│ ┌─────────────────────────────────────┐ │
│ │ Gesetzlich (GKV)               [✓]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Patient/in                              │
│ ┌─────────────────────────────────────┐ │
│ │ Max Mustermann                 [✓]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Termine anzeigen]                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Pre-fill Logic**:

| Field | Pre-fill Source | Editable | Edit Action |
|-------|-----------------|----------|-------------|
| Doctor | History appointment | No (V1) | — |
| Specialty | From doctor | No | — |
| Location | User's current OR history | Yes | Tap row → location picker |
| Insurance | User profile (current) | Yes | Tap row → insurance selector |
| Patient | History appointment | Yes | Tap row → patient selector |

**V1 Constraints**:
- Doctor is NOT editable in V1 (no "Similar doctors" feature)
- If doctor is no longer available, show error state (see Edge Cases)
- Insurance is pulled from current profile (may differ from history)

**Behavior**:
- All fields pre-filled from history + current profile
- Doctor card shows CURRENT rating/distance (may differ from visit time)
- Checkmarks indicate confirmed values
- Tappable fields allow editing (location, insurance, patient)
- Primary CTA: `Termine anzeigen` → S08 (full calendar)

**Acceptance Criteria**:
- [ ] Doctor, specialty pre-filled from history
- [ ] Location, insurance, patient pre-filled and editable
- [ ] Doctor card shows current (not historical) rating
- [ ] Reference date shown ("Basierend auf Ihrem Termin vom...")
- [ ] "Termine anzeigen" proceeds to full calendar
- [ ] Editable fields respond to tap with appropriate picker

---

### S08 — Full Calendar (Reuse)

Standard slot picker from Guided Wizard v2. No modifications needed for Book Again flow.

**Context passed from B01**:
- Doctor ID
- Patient (for confirm sheet)
- Insurance type (for eligibility check)

**Behavior**:
- Week view with swipe navigation
- Available slots highlighted
- Selecting slot → S09 (Confirm sheet)
- "Heute" button to return to current date

---

### S09 — Confirm Sheet (Reuse)

Standard confirm sheet from Guided Wizard v2. Pre-filled with context from B01.

**Pre-filled fields**:
- Doctor (from B01)
- Selected slot (from S08)
- Patient (from B01)
- Insurance display (from B01)

**Behavior**:
- Standard confirmation flow
- "Termin bestätigen" creates booking
- "Abbrechen" returns to calendar

---

### S10 — Success (Reuse)

Standard success screen from Guided Wizard v2. No modifications needed.

---

## Edge Cases

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| Doctor retired/inactive | Tap "Erneut buchen" | Error: `Diese Praxis ist nicht mehr verfügbar. Bitte suchen Sie einen anderen Arzt.` + CTA to search |
| Doctor no longer accepts insurance | Proceed to calendar | Warning before calendar: `Diese Praxis akzeptiert Ihre Versicherung möglicherweise nicht mehr. Bitte bestätigen Sie beim Besuch.` |
| No available slots | View calendar | Standard empty state: `Derzeit keine Termine verfügbar.` |
| Insurance changed since visit | Load B01 | Pre-fill with CURRENT insurance, not historical |
| Patient no longer in family | Select patient | Show only current family members |
| Very old appointment (>12 mo) | Tap "Erneut buchen" | Normal flow (history still valid per BOOK-018) |
| Cancelled appointment | Tap "Erneut buchen" | Normal flow (treat as fresh booking attempt) |

---

## V1.1 Roadmap (Deferred Features)

| Feature | Description | Benefit |
|---------|-------------|---------|
| Slot suggestions | 3-5 AI-suggested slots (like Reschedule) | Faster booking |
| Timing hints | "6 months since last visit" | Prompts routine care |
| Similar doctors | Alternatives if unavailable | No dead ends |
| Pattern detection | "You usually book Tuesdays" | Better suggestions |

---

## Data Flow

### Pre-fill Data Model

```typescript
interface BookAgainContext {
  // From history appointment
  sourceAppointmentId: string
  sourceDate: string // For display "Basierend auf..."

  // Pre-filled (not editable in V1)
  doctor: {
    id: string
    name: string
    specialty: string
    currentRating: number // Fetched fresh
    currentDistance: number // Calculated fresh
  }

  // Pre-filled (editable)
  location: {
    city: string
    postalCode: string
    source: 'history' | 'current_location' | 'manual'
  }

  insurance: {
    type: 'GKV' | 'PKV' | 'Selbstzahler'
    source: 'profile' // Always from current profile
  }

  patient: {
    id: string
    name: string
    relationship: 'self' | 'child'
  }
}
```

### Screen Transition Data

```
[S11: History]
    │
    │ appointmentId
    ▼
[B01: Context]
    │
    │ BookAgainContext
    ▼
[S08: Calendar]
    │
    │ selectedSlot + BookAgainContext
    ▼
[S09: Confirm]
    │
    │ bookingRequest
    ▼
[S10: Success]
```

---

## Comparison: V1 vs Full AI-Assisted

| Aspect | V1 Hybrid | Full AI-Assisted |
|--------|-----------|------------------|
| Screens | 4 (B01→S08→S09→S10) | 5+ (B01→B02→S09→S10 + B03) |
| Slot selection | Full calendar | 3-5 suggestions + fallback |
| If doctor unavailable | Error + search CTA | Similar doctor suggestions |
| Timing hints | None | "6 months since visit" |
| Implementation effort | Low | High |
| User control | Maximum | High (with fallback) |
| Speed (estimated) | ~90 seconds | ~45 seconds |

---

## Implementation Notes

### Pre-fill Validation

```typescript
async function validateBookAgainContext(historyAppointment) {
  const doctor = await fetchDoctor(historyAppointment.doctorId)

  if (!doctor.isActive) {
    return {
      valid: false,
      error: 'DOCTOR_INACTIVE',
      message: 'Diese Praxis ist nicht mehr verfügbar.'
    }
  }

  const currentInsurance = await getUserInsurance()
  const insuranceMatch = doctor.acceptedInsurance.includes(currentInsurance)

  return {
    valid: true,
    context: {
      doctor,
      insurance: currentInsurance,
      insuranceWarning: !insuranceMatch,
      patient: historyAppointment.patient,
      location: historyAppointment.location
    }
  }
}
```

### Analytics Events

```typescript
// Track Book Again funnel
analytics.track('book_again_initiated', {
  source_appointment_id: string,
  days_since_visit: number,
  appointment_status: 'completed' | 'cancelled'
})

analytics.track('book_again_context_confirmed', {
  fields_edited: string[], // e.g., ['insurance', 'patient']
  doctor_changed: boolean // Always false in V1
})

analytics.track('book_again_completed', {
  time_to_complete_seconds: number,
  slot_selection_method: 'calendar' // Always 'calendar' in V1
})
```

---
name: design-lite:book-again-flow-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "V1 Hybrid — Pre-fill Context + Full Calendar"
created: 2026-01-23
updated: 2026-01-26
status: draft
version: 2.0
supersedes:
  - docs/appointment-booking/z.details/2-design-plan-Book-again-flow.md
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-018)
decision_doc:
  - docs/appointment-booking/z.details/analysis-AI-assisted-vs-standard.md
sources:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
---

# DESIGN-LITE: Book Again Flow v2 (V1 Hybrid) — Acceptance-Complete

This document details the **V1 Hybrid** Book Again flow — a streamlined approach that pre-fills context from appointment history but uses the standard full calendar for slot selection. Designed for simplicity while still providing convenience. Written to be implementable as acceptance criteria, using German-first + i18n-first + mobile-first constraints.

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
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                          │
│                                                                          │
│ │ Job │ Statement                                     │ Key Actions     ││
│ ├─────┼───────────────────────────────────────────────┼─────────────────┤│
│ │ J1  │ When I had a good experience with a doctor,   │ find past visit,││
│ │     │ I want to quickly book again without          │ review context, ││
│ │     │ re-entering all my information.               │ select slot     ││
│ │ J2  │ When I see my pre-filled context, I want to   │ review fields,  ││
│ │     │ verify it's still correct (insurance, patient)│ edit if needed, ││
│ │     │ before proceeding.                            │ proceed         ││
│ │ J3  │ When I need routine care with a familiar      │ browse history, ││
│ │     │ doctor, I want to minimize effort while       │ tap "book again"││
│ │     │ maintaining control over the appointment.     │ confirm booking ││
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
│ ✅ IN SCOPE (V1):                                                        │
│ • "Erneut buchen" action from appointment history (AGAIN-001)            │
│ • Pre-filled booking context screen (AGAIN-002)                          │
│ • Editable fields (location, insurance, patient) (AGAIN-003)             │
│ • Full calendar for slot selection (reuse S08)                           │
│ • Standard confirm sheet (reuse S09)                                     │
│ • Standard success screen (reuse S10)                                    │
│                                                                          │
│ ⏳ DEFERRED TO V1.1:                                                     │
│ • AI-suggested slots (like Reschedule flow)                              │
│ • Follow-up timing hints ("6 months since visit")                        │
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
│ 🧩 DERIVED SCREENS                                                       │
│                                                                          │
│ │ ID  │ Screen / Modal                     │ Covers       │ Purpose     ││
│ ├─────┼────────────────────────────────────┼──────────────┼─────────────┤│
│ │ B01 │ Pre-filled Context                 │ AGAIN-002/003│ Review+edit ││
│ │ S08 │ Full Calendar (reuse)              │ BOOK-008     │ Slot select ││
│ │ S09 │ Confirm Sheet (reuse)              │ BOOK-010/011 │ Commit      ││
│ │ S10 │ Success (reuse)                    │ BOOK-012     │ Confirmation││
│                                                                          │
│ Screen flow:                                                             │
│ [S11]→[B01]→[S08]→[S09]→[S10]                                           │
├──────────────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                            │
│                                                                          │
│ │ Scenario                 │ User Action           │ System Response    ││
│ ├──────────────────────────┼───────────────────────┼────────────────────┤│
│ │ Doctor retired/inactive  │ Tap "Erneut buchen"   │ Error + search CTA ││
│ │ Insurance no longer      │ Proceed to calendar   │ Warning before     ││
│ │ accepted                 │                       │ calendar           ││
│ │ No available slots       │ View calendar         │ Standard empty     ││
│ │ Insurance changed        │ Load B01              │ Pre-fill CURRENT   ││
│ │ Patient no longer valid  │ Select patient        │ Show current only  ││
│ │ Old appointment (>12 mo) │ Tap "Erneut buchen"   │ Normal flow        ││
│ │ Cancelled appointment    │ Tap "Erneut buchen"   │ Normal flow        ││
├──────────────────────────────────────────────────────────────────────────┤
│ 👉 AI: v2 is acceptance-complete; remaining decisions are policy-        │
│ and data-source choices (doctor availability API, insurance matching).   │
└──────────────────────────────────────────────────────────────────────────┘
```

## Global UX + i18n + Germany constraints (applies to all screens)

Inherits all constraints from Guided Wizard v2:

- **Language**: German default; English available at launch; assume 30–40% text expansion in layouts.
- **Tone**: formal "Sie", factual, no urgency framing, no exclamation marks.
- **Date/time**: Germany formatting (e.g., `Do., 23.01.2026`, `14:30`), time zone Europe/Berlin.
- **Accessibility baseline**:
  - Body text ≥ 16 px; headings ≥ 20 px.
  - Tap targets ≥ 48×48 dp (≥ 44 px).
  - High-contrast tokens; color never sole indicator.
  - No time limits/timers in booking flow.
- **DocliQ Brand**: DM Sans font, Teal primary (#13A3B5), Charcoal text (#1C2A30).
- **Persistence**: context selections persist across back navigation until user confirms or cancels.

## Requirement-by-requirement acceptance criteria

### AGAIN-001 — Book Again Entry Point (from history)

**Enhancement to existing history screen (S11, per BOOK-018)**:

Content structure:
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

Acceptance criteria:
- [ ] Each history row shows `Erneut buchen` button
- [ ] Button meets 44px touch target requirement
- [ ] Works for both `Erledigt` and `Abgesagt` appointments
- [ ] Tapping navigates to B01 with pre-filled context
- [ ] Loading state shown while fetching doctor availability

### AGAIN-002 — Pre-filled Context Screen (review before booking)

**Screen: B01 — Pre-filled Context**

Header:
- Back arrow (returns to history)
- Title: `Erneut buchen`

Content structure:
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

Pre-fill logic:

| Field | Pre-fill Source | Editable | Edit Action |
|-------|-----------------|----------|-------------|
| Doctor | History appointment | No (V1) | — |
| Specialty | From doctor | No | — |
| Location | User's current OR history | Yes | Tap row → location picker |
| Insurance | User profile (current) | Yes | Tap row → insurance selector |
| Patient | History appointment | Yes | Tap row → patient selector |

Acceptance criteria:
- [ ] Reference date shown: `Basierend auf Ihrem Termin vom {date}`
- [ ] Doctor card shows CURRENT rating/distance (not historical)
- [ ] Doctor and specialty are NOT editable (V1 constraint)
- [ ] Location, insurance, patient fields are editable (tap to change)
- [ ] Checkmarks indicate confirmed values
- [ ] Primary CTA: `Termine anzeigen` (Teal button)
- [ ] Tapping `Termine anzeigen` proceeds to full calendar (S08)
- [ ] If doctor inactive: show error `Diese Praxis ist nicht mehr verfügbar. Bitte suchen Sie einen anderen Arzt.` + CTA `Arzt suchen`

### AGAIN-003 — Editable Context Fields

**Location field**:
- Pre-filled from user's current location or history appointment
- Tap opens location picker (reuse BOOK-002 component)
- Updates display on selection

**Insurance field**:
- Pre-filled from current user profile (NOT historical)
- Tap opens insurance selector (GKV / PKV / Selbstzahler)
- If doctor doesn't accept new insurance: show warning `Diese Praxis akzeptiert Ihre Versicherung möglicherweise nicht mehr. Bitte bestätigen Sie beim Besuch.`

**Patient field**:
- Pre-filled from history appointment patient
- Tap opens patient selector (self + current family members)
- Historical patient not in current family: show only current members

Acceptance criteria:
- [ ] Location field responds to tap with location picker
- [ ] Insurance field responds to tap with insurance selector
- [ ] Patient field responds to tap with patient selector
- [ ] Insurance warning shown if doctor may not accept current insurance
- [ ] Patient selector shows only current family members

### AGAIN-004 — Calendar Integration (reuses S08)

Standard slot picker from Guided Wizard v2 (BOOK-008). No modifications needed.

Context passed from B01:
- Doctor ID
- Patient (for confirm sheet)
- Insurance type (for eligibility check)

Acceptance criteria:
- [ ] Calendar shows doctor's available slots
- [ ] Week view with swipe navigation
- [ ] "Heute" button to return to current date
- [ ] Selecting slot → S09 (Confirm sheet)
- [ ] Back navigation returns to B01

### AGAIN-005 — Confirm and Success (reuses S09, S10)

Standard confirm sheet and success screen from Guided Wizard v2. Pre-filled with context from B01.

Pre-filled in S09:
- Doctor (from B01)
- Selected slot (from S08)
- Patient (from B01)
- Insurance display (from B01)

Acceptance criteria:
- [ ] Confirm sheet shows all booking details
- [ ] Patient name displayed (if family booking)
- [ ] `Termin bestätigen` creates booking
- [ ] `Abbrechen` returns to calendar
- [ ] Success screen shows confirmation number
- [ ] Calendar and route actions available

## User Journey Details

### Persona Paths

**Path A: Routine Care User (Regular Appointments)**
```
History → Tap "Erneut buchen" → Quick review → View calendar → Select slot → Confirm → Done
Steps: 5 | Time: ~60 seconds
```
- Familiar with doctor
- Trusts pre-filled context
- Quick slot selection

**Path B: Careful Reviewer (Verify Everything)**
```
History → Tap "Erneut buchen" → Review all fields → Edit insurance → View calendar → Browse dates → Select → Confirm → Done
Steps: 7 | Time: ~90 seconds
```
- Wants to verify context
- May edit insurance or patient
- Takes time browsing calendar

**Path C: Family Booker (Different Patient)**
```
History → Tap "Erneut buchen" → Change patient → View calendar → Select slot → Confirm → Done
Steps: 6 | Time: ~75 seconds
```
- Booking for family member
- Changes patient field
- Otherwise quick flow

### Emotional Journey

```
     🤔 Recalling       😊 Recognized      ✅ Confident
     (good experience   (context pre-      (booking
      with doctor)       filled for me)     confirmed)
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────┐       ┌───────────┐     ┌───────────┐
    │ S11:    │ ──▶   │ B01: See  │ ──▶ │ S10:      │
    │ History │       │ pre-filled│     │ Success   │
    └─────────┘       └───────────┘     └───────────┘
```

### Journey Steps Detail

| Step | Screen | User Action | System Response | Time Target |
|------|--------|-------------|-----------------|-------------|
| 1 | S11 (History) | Tap "Erneut buchen" | Fetch doctor, load context | <1s |
| 2 | B01 | Review pre-filled context | Display all fields | - |
| 3 | B01 (optional) | Edit fields if needed | Update display | - |
| 4 | B01 | Tap "Termine anzeigen" | Load calendar | <2s |
| 5 | S08 | Browse and select slot | Highlight selection | - |
| 6 | S09 | Review and confirm | Create booking | <3s |
| 7 | S10 | View success | Show confirmation | - |
| **Total** | | | | **<90s** |

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

### Validation on Entry

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

## V1.1 Roadmap (Deferred Features)

| Feature | Description | Benefit |
|---------|-------------|---------|
| Slot suggestions | 3-5 AI-suggested slots (like Reschedule) | Faster booking |
| Timing hints | "6 months since last visit" | Prompts routine care |
| Similar doctors | Alternatives if unavailable | No dead ends |
| Pattern detection | "You usually book Tuesdays" | Better suggestions |
| Proactive reminders | "Time to see your dentist" | Preventive care |

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

## Open Decisions / Need Your Input

1. **Doctor availability API**: How do we detect if a doctor is retired/inactive? Real-time check or cached status?
2. **Insurance matching logic**: Should we hard-block if insurance doesn't match, or just show warning?
3. **Historical patient handling**: If patient from history no longer exists, show error or silently default to self?
4. **Rating freshness**: How often should doctor rating/distance be refreshed on B01?
5. **Analytics depth**: What additional events should we track for Book Again funnel analysis?

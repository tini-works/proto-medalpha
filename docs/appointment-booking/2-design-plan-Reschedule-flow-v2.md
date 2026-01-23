---
name: design-lite:reschedule-flow-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "V1 Hybrid — Simplified AI-Assisted Reschedule"
created: 2026-01-23
updated: 2026-01-23
status: draft
version: 2.0
supersedes:
  - docs/appointment-booking/2-design-plan-Reschedule-flow.md
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-017)
decision_doc:
  - docs/appointment-booking/2-analysis-AI-assisted-vs-standard.md
sources:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
---

# DESIGN-LITE: Reschedule Flow v2 (V1 Hybrid)

This document details the **V1 Hybrid** Reschedule flow — a simplified AI-assisted approach that provides slot suggestions without the optional reason capture step. Designed for speed while maintaining Helga-friendly fallbacks.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: RESCHEDULE FLOW v2       Status: 🟡 DRAFT                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                               │
│ Selected approach: V1 Hybrid — Simplified AI-Assisted                    │
│                                                                          │
│ V1 Simplifications (vs full AI-assisted):                                │
│ ✓ Skip optional reason capture step                                      │
│ ✓ Use default ranking (similar time → soonest)                           │
│ ✓ "Warum" collapsed by default (expandable)                              │
│ ✓ Full calendar always prominent                                         │
│                                                                          │
│ Hypothesis: IF we provide 3-5 smart slot suggestions with a prominent    │
│ calendar fallback, THEN reschedule time will be <60 seconds with >75%    │
│ completion, FOR all personas including Helga, BECAUSE the flow is fast   │
│ for power users but simple enough for those who prefer browsing.         │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOW (Simplified)                                                │
│                                                                          │
│ Flow diagram:                                                            │
│ ┌──────────────────┐   ┌───────────────────┐   ┌───────────────────┐    │
│ │ Appointment      │→→ │ Suggested Slots   │→→ │ Confirm Sheet     │    │
│ │ Details (S12)    │   │ (R01)             │   │ (R02)             │    │
│ └──────────────────┘   └─────────┬─────────┘   └─────────┬─────────┘    │
│                                  │                       │              │
│                            [Alle Termine]                │              │
│                                  │                       │              │
│                                  v                       v              │
│                        ┌───────────────────┐   ┌───────────────────┐    │
│                        │ Full Calendar     │   │ Success           │    │
│                        │ (S08)             │   │ (R03)             │    │
│                        └─────────┬─────────┘   └───────────────────┘    │
│                                  │                                      │
│                                  └──────────→ [R02] → [R03]             │
├──────────────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                                      │
│                                                                          │
│ ✅ V1 IN SCOPE:                                                          │
│ • "Termin verschieben" action from appointment details                   │
│ • 3-5 AI-suggested alternative slots (default ranking)                   │
│ • Comparison view (original vs new) in confirm sheet                     │
│ • Full calendar browse as prominent fallback                             │
│ • Same-doctor constraint (per BOOK-017)                                  │
│ • Release-after-confirm timing (per BOOK-017)                            │
│ • Updated confirmation (email + push)                                    │
│                                                                          │
│ ⏳ DEFERRED TO V1.1:                                                     │
│ • Optional reason capture for better suggestions                         │
│ • Calendar integration to avoid conflicts                                │
│ • Reschedule history tracking                                            │
│                                                                          │
│ ❌ OUT OF SCOPE:                                                         │
│ • Different doctor selection during reschedule                           │
│ • Reschedule to different location                                       │
│ • Proactive reschedule suggestions                                       │
│                                                                          │
│ 📏 SUCCESS METRICS:                                                      │
│ • Primary: Reschedule completion rate → Target: >75%                     │
│ • Leading: Time-to-reschedule → Target: <60 seconds                      │
│ • Leading: Suggestion acceptance rate → Track (no target for V1)         │
│ • Guardrail: "Slot taken" errors → Target: <2%                           │
├──────────────────────────────────────────────────────────────────────────┤
│ 🧩 SCREENS (V1 Simplified)                                               │
│                                                                          │
│ │ ID  │ Screen                             │ Purpose                    ││
│ ├─────┼────────────────────────────────────┼────────────────────────────┤│
│ │ R01 │ Suggested Slots                    │ Quick alternatives         ││
│ │ R02 │ Reschedule Confirm Sheet           │ Comparison + commit        ││
│ │ R03 │ Reschedule Success                 │ Updated confirmation       ││
│ │ S08 │ Full Calendar (reuse)              │ Manual browse fallback     ││
│                                                                          │
│ Screen flow:                                                             │
│ [S12]→[R01]→[R02]→[R03]                                                 │
│         └→[S08]→[R02]                                                    │
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

### R01 — Suggested Slots (V1 Simplified)

**Purpose**: Present 3-5 alternative slots with prominent calendar fallback.

**Header**:
- Back arrow (returns to appointment details)
- Title: `Termin verschieben`

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Termin verschieben                    │
├─────────────────────────────────────────┤
│                                         │
│ Aktueller Termin                        │
│ Do., 30.01.2026 · 14:30                 │
│ Dr. Anna Müller · Allgemeinmedizin      │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Verfügbare Alternativen                 │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Fr., 31.01.2026 · 10:00 · 15 min    │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Mo., 03.02.2026 · 14:30 · 15 min    │ │
│ │ Gleiche Uhrzeit              ▾      │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Di., 04.02.2026 · 09:00 · 15 min    │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Mi., 05.02.2026 · 11:30 · 15 min    │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ═══════════════════════════════════════ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Alle Termine anzeigen]         📅  │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**V1 Simplifications**:
- No "Warum" reasons shown by default (reduces visual complexity)
- Optional: Chevron `▾` to expand reason (e.g., "Gleiche Uhrzeit")
- "Alle Termine anzeigen" is a full-width secondary button (not just a link)

**AI Suggestion Logic** (V1 — Simple Rules):

| Priority | Logic | Label (if expanded) |
|----------|-------|---------------------|
| 1 | Same time, different day (nearest) | `Gleiche Uhrzeit` |
| 2 | Within ±2 hours of original | `Ähnliche Uhrzeit` |
| 3 | Soonest available | `Nächster Termin` |
| 4 | Same day of week | `Gleicher Wochentag` |

**Behavior**:
- Show 3-5 suggestions (sorted by priority)
- Each card shows: Date + time + duration
- Tapping `Auswählen` → R02 (confirm sheet)
- Tapping `Alle Termine anzeigen` → S08 (full calendar)
- Chevron expands/collapses reason (optional interaction)

**Acceptance Criteria**:
- [ ] Current appointment summary shown at top
- [ ] 3-5 slot suggestions displayed
- [ ] Each suggestion has "Auswählen" button (44px min height)
- [ ] "Alle Termine anzeigen" is prominent secondary button
- [ ] Empty state if no slots: `Derzeit keine Termine verfügbar. Bitte später erneut versuchen.`
- [ ] Tapping suggestion opens confirm sheet

---

### R02 — Reschedule Confirm Sheet (Modal)

**Purpose**: Show comparison and commit to reschedule.

**Content**:

```
┌─────────────────────────────────────────┐
│                 ─────                   │
│         Termin verschieben              │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Bisheriger Termin                   │ │
│ │ Do., 30.01.2026 · 14:30             │ │
│ │ ✕ Wird storniert                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│           ↓                             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Neuer Termin                        │ │
│ │ Fr., 31.01.2026 · 10:00 · 15 min    │ │
│ │ ✓ Wird gebucht                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Dr. Anna Müller                         │
│ Allgemeinmedizin                        │
│                                         │
│ Praxis am Markt                         │
│ Marktplatz 5, 10178 Berlin              │
│                                         │
│ Patient: Max Mustermann                 │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ⓘ Der bisherige Termin wird erst nach  │
│   Bestätigung des neuen Termins         │
│   storniert.                            │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Termin verschieben]                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│            Abbrechen                    │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Clear before/after comparison with visual indicators
- Safety note about release timing
- Primary CTA: `Termin verschieben` (Teal button)
- Secondary: `Abbrechen` (text link, closes sheet)
- On confirm:
  1. System creates new booking
  2. Only after success: cancels original slot
  3. Navigates to R03

**Acceptance Criteria**:
- [ ] Old appointment marked with ✕ "Wird storniert"
- [ ] New appointment marked with ✓ "Wird gebucht"
- [ ] Doctor, location, patient details shown
- [ ] Safety note displayed
- [ ] "Termin verschieben" triggers reschedule
- [ ] "Abbrechen" closes without changes
- [ ] Slot-taken error: `Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen.`

---

### R03 — Reschedule Success

**Purpose**: Confirm reschedule and provide next actions.

**Content**:

```
┌─────────────────────────────────────────┐
│                                         │
│              ✓                          │
│                                         │
│    Termin verschoben                    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Anna Müller                     │ │
│ │ Allgemeinmedizin                    │ │
│ │                                     │ │
│ │ Fr., 31.01.2026 · 10:00             │ │
│ │ Praxis am Markt, Berlin             │ │
│ │                                     │ │
│ │ Bestätigungsnr.: ABC-12346          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Eine aktualisierte Bestätigung wurde    │
│ per E-Mail und Push gesendet.           │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [In Kalender aktualisieren]             │
│                                         │
│ [Route öffnen]                          │
│                                         │
│ [Fertig]                                │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Checkmark animation (300ms fade per brand guide)
- New confirmation number (different from original)
- Actions:
  - `In Kalender aktualisieren` → Updates existing calendar entry
  - `Route öffnen` → Opens maps
  - `Fertig` → Returns to appointment list

**Acceptance Criteria**:
- [ ] Success animation shown
- [ ] New appointment details displayed
- [ ] New confirmation number shown
- [ ] Calendar action available
- [ ] Route action available
- [ ] "Fertig" returns to appointments list

---

## Edge Cases

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| No alternative slots | Open reschedule | Show empty state + "Alle Termine" button |
| Slot taken at confirm | Tap "Termin verschieben" | Error message, return to R01, refresh |
| Offline | Tap "Termin verschieben" | Block + `Bitte Internetverbindung prüfen.` |
| Same slot selected | Somehow select current | Prevent, show `Dies ist Ihr aktueller Termin.` |
| Calendar permission denied | Tap "In Kalender" | Offer ICS download fallback |

---

## V1.1 Roadmap (Deferred Features)

| Feature | Description | Benefit |
|---------|-------------|---------|
| Reason capture | Optional "Warum verschieben?" step | Better suggestions |
| Calendar integration | Check user calendar for conflicts | Avoid double-booking |
| Expanded "Warum" | Show reasons by default | More transparency |
| Reschedule history | Track how often appointments move | Analytics |

---

## Implementation Notes

### Suggestion Algorithm (V1)

```
function getSuggestedSlots(originalSlot, doctorAvailability) {
  const suggestions = []

  // Priority 1: Same time, nearest day
  suggestions.push(
    ...findSlotsAtTime(originalSlot.time, doctorAvailability)
      .sort(byNearestDate)
      .slice(0, 2)
  )

  // Priority 2: Similar time (±2 hours)
  suggestions.push(
    ...findSlotsNearTime(originalSlot.time, 2, doctorAvailability)
      .sort(byNearestDate)
      .slice(0, 2)
  )

  // Priority 3: Soonest available
  suggestions.push(
    ...findSoonestSlots(doctorAvailability)
      .slice(0, 2)
  )

  // Dedupe and limit to 5
  return unique(suggestions).slice(0, 5)
}
```

### Release Timing (BOOK-017 Compliance)

```
async function rescheduleAppointment(oldSlot, newSlot) {
  // 1. Book new slot first
  const newBooking = await createBooking(newSlot)

  // 2. Only cancel old after success
  if (newBooking.success) {
    await cancelBooking(oldSlot)
    return { success: true, booking: newBooking }
  }

  // 3. If new booking fails, old slot untouched
  return { success: false, error: newBooking.error }
}
```

---
name: design-lite:reschedule-flow-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "V1 Hybrid — Simplified AI-Assisted Reschedule"
created: 2026-01-23
updated: 2026-01-26
status: draft
version: 2.0
supersedes:
  - docs/appointment-booking/z.details/2-design-plan-Reschedule-flow.md
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-017)
decision_doc:
  - docs/appointment-booking/z.details/analysis-AI-assisted-vs-standard.md
sources:
  - docs/appointment-booking/0-APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
---

# DESIGN-LITE: Reschedule Flow v2 (V1 Hybrid) — Acceptance-Complete

This document details the **V1 Hybrid** Reschedule flow — a simplified AI-assisted approach that provides slot suggestions without the optional reason capture step. Designed for speed while maintaining Helga-friendly fallbacks. Written to be implementable as acceptance criteria, using German-first + i18n-first + mobile-first constraints.

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
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                          │
│                                                                          │
│ │ Job │ Statement                                     │ Key Actions     ││
│ ├─────┼───────────────────────────────────────────────┼─────────────────┤│
│ │ J1  │ When my schedule changes unexpectedly, I want │ view current,   ││
│ │     │ to quickly find a new time with the same      │ browse options, ││
│ │     │ doctor without losing my appointment.         │ select, confirm ││
│ │ J2  │ When I see suggested alternatives, I want to  │ compare times,  ││
│ │     │ understand why each is recommended so I can   │ expand reasons, ││
│ │     │ make an informed choice.                      │ select best fit ││
│ │ J3  │ When no suggestion fits my needs, I want to   │ browse calendar,││
│ │     │ browse all available times myself without     │ select manually,││
│ │     │ starting over.                                │ confirm         ││
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
│ ✅ IN SCOPE (V1):                                                        │
│ • "Termin verschieben" action from appointment details (RESCH-001)       │
│ • 3-5 AI-suggested alternative slots with default ranking (RESCH-002)    │
│ • Comparison view (original vs new) in confirm sheet (RESCH-003)         │
│ • Full calendar browse as prominent fallback (RESCH-004)                 │
│ • Same-doctor constraint (per BOOK-017)                                  │
│ • Release-after-confirm timing (RESCH-005)                               │
│ • Updated confirmation (email + push) (RESCH-006)                        │
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
│ 🧩 DERIVED SCREENS                                                       │
│                                                                          │
│ │ ID  │ Screen / Modal                     │ Covers       │ Purpose     ││
│ ├─────┼────────────────────────────────────┼──────────────┼─────────────┤│
│ │ R01 │ Suggested Slots                    │ RESCH-001/002│ Quick alts  ││
│ │ R02 │ Reschedule Confirm Sheet           │ RESCH-003/005│ Compare+commit│
│ │ R03 │ Reschedule Success                 │ RESCH-006    │ Confirmation││
│ │ S08 │ Full Calendar (reuse)              │ RESCH-004    │ Manual browse│
│                                                                          │
│ Screen flow:                                                             │
│ [S12]→[R01]→[R02]→[R03]                                                 │
│         └→[S08]→[R02]                                                    │
├──────────────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                            │
│                                                                          │
│ │ Scenario                 │ User Action           │ System Response    ││
│ ├──────────────────────────┼───────────────────────┼────────────────────┤│
│ │ No alternative slots     │ Open reschedule       │ Show empty state + ││
│ │                          │                       │ "Alle Termine" btn ││
│ │ Slot taken at confirm    │ Tap "verschieben"     │ Error msg, return  ││
│ │                          │                       │ to R01, refresh    ││
│ │ Offline                  │ Tap "verschieben"     │ Block + connection ││
│ │                          │                       │ error message      ││
│ │ Same slot selected       │ Select current slot   │ Prevent + explain  ││
│ │ Calendar denied          │ Tap "In Kalender"     │ Offer ICS download ││
├──────────────────────────────────────────────────────────────────────────┤
│ 👉 AI: v2 is acceptance-complete; remaining decisions are policy-        │
│ and data-source choices (suggestion algorithm tuning, release timing).   │
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
  - No time limits/timers in reschedule flow.
- **DocliQ Brand**: DM Sans font, Teal primary (#13A3B5), Charcoal text (#1C2A30).
- **Persistence**: selected slot persists across back navigation until user confirms or cancels.

## Requirement-by-requirement acceptance criteria

### RESCH-001 — Reschedule Entry Point (from appointment details)

- Appointment details screen (S12) shows action: `Termin verschieben`.
- Action placement: primary or secondary button (design discretion).
- Tapping action navigates to Suggested Slots screen (R01).
- Entry point shows loading state while fetching suggestions.

### RESCH-002 — Suggested Slots (3-5 alternatives, ranking, labels, expand/collapse)

**Screen: R01 — Suggested Slots**

Header:
- Back arrow (returns to appointment details)
- Title: `Termin verschieben`

Content structure:
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
│ ═══════════════════════════════════════ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Alle Termine anzeigen]         📅  │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

Suggestion algorithm (V1 — Simple Rules):

| Priority | Logic | Label (German) |
|----------|-------|----------------|
| 1 | Same time, different day (nearest) | `Gleiche Uhrzeit` |
| 2 | Within ±2 hours of original | `Ähnliche Uhrzeit` |
| 3 | Soonest available | `Nächster Termin` |
| 4 | Same day of week | `Gleicher Wochentag` |

Acceptance criteria:
- [ ] Current appointment summary shown at top (date, time, doctor, specialty)
- [ ] Show **3-5** slot suggestions (sorted by priority)
- [ ] Each suggestion displays: Date + time + duration
- [ ] Reason label shown inline or expandable via chevron `▾`
- [ ] Each suggestion has `Auswählen` button (44px min height)
- [ ] `Alle Termine anzeigen` is prominent secondary button (full-width)
- [ ] Tapping suggestion opens confirm sheet (R02)
- [ ] Tapping `Alle Termine anzeigen` opens full calendar (S08)
- [ ] Empty state if no slots: `Derzeit keine Termine verfügbar. Bitte später erneut versuchen.`

### RESCH-003 — Reschedule Confirm Sheet (comparison view, safety note)

**Screen: R02 — Reschedule Confirm Sheet (Modal)**

Content structure:
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

Acceptance criteria:
- [ ] Old appointment shown with `✕` icon and label `Wird storniert`
- [ ] New appointment shown with `✓` icon and label `Wird gebucht`
- [ ] Visual arrow `↓` connecting old to new
- [ ] Doctor name, specialty, address displayed
- [ ] Patient name displayed (if family booking)
- [ ] Safety note displayed (exact copy above)
- [ ] Primary CTA: `Termin verschieben` (Teal button)
- [ ] Secondary CTA: `Abbrechen` (text link, closes sheet)
- [ ] On confirm: system books new slot first, then cancels original
- [ ] Slot-taken error copy (exact): `Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen.`

### RESCH-004 — Full Calendar Fallback (reuses S08)

- `Alle Termine anzeigen` navigates to full calendar (S08) for same doctor.
- Calendar shows all available slots (not just suggestions).
- Selected slot from calendar opens confirm sheet (R02).
- Back navigation returns to R01 (suggestions screen).
- Calendar inherits all BOOK-008 acceptance criteria.

### RESCH-005 — Release Timing (book new before canceling old)

Release sequence (must be atomic):
1. System books new slot first.
2. Only after new booking succeeds: system cancels original slot.
3. If new booking fails: original slot remains untouched.

Error handling:
- If new slot taken: show error, return to R01, refresh suggestions.
- Original appointment remains valid until successful reschedule.

Implementation pattern:
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

### RESCH-006 — Reschedule Success (confirmation, new number, comms)

**Screen: R03 — Reschedule Success**

Content structure:
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

Acceptance criteria:
- [ ] Checkmark animation shown (300ms fade per brand guide)
- [ ] Title: `Termin verschoben`
- [ ] New appointment details displayed (doctor, specialty, date, time, location)
- [ ] New confirmation number shown (different from original)
- [ ] Confirmation message: `Eine aktualisierte Bestätigung wurde per E-Mail und Push gesendet.`
- [ ] Action: `In Kalender aktualisieren` → updates existing calendar entry
- [ ] Action: `Route öffnen` → opens maps with address
- [ ] Action: `Fertig` → returns to appointments list (S11)
- [ ] If calendar permission denied: offer ICS download fallback

## User Journey Details

### Persona Paths

**Path A: Confident User (Tech-Savvy Sven)**
```
Trigger → View suggestions → Quick select → Confirm → Done
Steps: 4 | Time: ~30 seconds
```
- Uses first available suggestion
- Trusts AI recommendations
- No browsing needed

**Path B: Deliberate User (Helga)**
```
Trigger → View suggestions → Browse all → Compare options → Select → Confirm → Done
Steps: 6 | Time: ~60 seconds
```
- Wants to see all options
- Uses "Alle Termine anzeigen" fallback
- Prefers to choose manually

**Path C: Time-Specific User**
```
Trigger → View suggestions → Look for same time → Select "Gleiche Uhrzeit" → Confirm → Done
Steps: 4 | Time: ~40 seconds
```
- Has specific time constraints
- Looks for "Gleiche Uhrzeit" label
- Values consistency

### Emotional Journey

```
     😟 Stressed      😌 Relieved       ✅ Confident
     (need to         (options          (rescheduled
      reschedule)      available)        successfully)
         │                │                  │
         ▼                ▼                  ▼
    ┌─────────┐     ┌───────────┐     ┌───────────┐
    │ Trigger │ ──▶ │ R01: See  │ ──▶ │ R03:      │
    │         │     │ options   │     │ Success   │
    └─────────┘     └───────────┘     └───────────┘
```

## V1.1 Roadmap (Deferred Features)

| Feature | Description | Benefit |
|---------|-------------|---------|
| Reason capture | Optional "Warum verschieben?" step | Better suggestions |
| Calendar integration | Check user calendar for conflicts | Avoid double-booking |
| Expanded "Warum" | Show reasons by default | More transparency |
| Reschedule history | Track how often appointments move | Analytics |

## Open Decisions / Need Your Input

1. **Suggestion algorithm tuning**: Should "same time" always be priority 1, or should "soonest" be prioritized for urgent care specialties?
2. **Reason expansion default**: Should reason labels be expanded by default (more transparent) or collapsed (cleaner UI)?
3. **Calendar update behavior**: Should "In Kalender aktualisieren" delete old entry and create new, or modify existing entry?
4. **Offline handling policy**: Hard-block reschedule when offline, or queue with explicit warning (per BOOK-020 pattern)?

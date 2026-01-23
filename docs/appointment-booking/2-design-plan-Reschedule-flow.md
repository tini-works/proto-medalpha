---
name: design-lite:reschedule-flow
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "AI-Assisted Reschedule"
created: 2026-01-23
updated: 2026-01-23
status: draft
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-017)
  - docs/appointment-booking/2-design-plan-Assisted-discovery.md
sources:
  - docs/appointment-booking/APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
  - docs/z.guidelines/docliq-tokens.json
---

# DESIGN-LITE: Reschedule Flow (AI-Assisted)

This document details the AI-Assisted Reschedule flow, extending BOOK-017 from the Guided Wizard v2 with intelligent slot suggestions and contextual awareness.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: RESCHEDULE FLOW          Status: 🟡 DRAFT                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                               │
│ Selected approach: AI-Assisted Reschedule                                │
│ Hypothesis: IF we provide intelligent slot suggestions based on user's   │
│ calendar patterns, previous booking times, and urgency context, with     │
│ transparent "why this slot" explanations, THEN reschedule completion     │
│ rate will increase and time-to-reschedule will decrease, FOR users       │
│ needing to change their appointment, BECAUSE they can quickly find a     │
│ suitable alternative without manual calendar comparison.                 │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                         │
│                                                                          │
│ │ Job │ Statement                                     │ Key Actions     ││
│ ├─────┼───────────────────────────────────────────────┼─────────────────┤│
│ │ R1  │ When I need to change my appointment, I want  │ initiate,       ││
│ │     │ to quickly see alternatives that fit my       │ view suggestions││
│ │     │ schedule without starting over.               │                 ││
│ │ R2  │ When viewing alternative slots, I want to     │ compare, select ││
│ │     │ understand why they're suggested and compare  │ filter, browse  ││
│ │     │ to my original time.                          │                 ││
│ │ R3  │ When I confirm a new slot, I want assurance   │ confirm, verify ││
│ │     │ the old one is released and I get updated     │                 ││
│ │     │ confirmation.                                 │                 ││
│                                                                          │
│ Flow diagram:                                                            │
│ ┌──────────────────┐   ┌──────────────────┐   ┌───────────────────┐     │
│ │ Appointment      │→→ │ Reschedule       │→→ │ AI-Suggested      │     │
│ │ Details (S12)    │   │ Reason (R01)     │   │ Slots (R02)       │     │
│ └──────────────────┘   └────────┬─────────┘   └─────────┬─────────┘     │
│                                 │                       │               │
│                           (optional)              (select or browse)    │
│                                 │                       │               │
│                                 v                       v               │
│                        ┌──────────────────┐     ┌───────────────────┐   │
│                        │ Skip reason      │     │ Full Calendar     │   │
│                        └──────────────────┘     │ (S08)             │   │
│                                                 └─────────┬─────────┘   │
│                                                           │             │
│                                                     (confirm)           │
│                                                           │             │
│                                                           v             │
│                                                 ┌───────────────────┐   │
│                                                 │ Reschedule        │   │
│                                                 │ Confirm (R03)     │   │
│                                                 └─────────┬─────────┘   │
│                                                           │             │
│                                                           v             │
│                                                 ┌───────────────────┐   │
│                                                 │ Success (R04)     │   │
│                                                 └───────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                                      │
│                                                                          │
│ ✅ IN SCOPE:                                                             │
│ • Reschedule initiation from appointment details                         │
│ • Optional reason capture (improves AI suggestions)                      │
│ • AI-suggested alternative slots (3–5 options)                           │
│ • "Warum?" transparency for each suggestion                              │
│ • Comparison view (original vs new)                                      │
│ • Full calendar browse fallback                                          │
│ • Same-doctor constraint (per BOOK-017)                                  │
│ • Release-after-confirm timing (per BOOK-017)                            │
│ • Updated confirmation (email + push)                                    │
│ • Reschedule history tracking                                            │
│                                                                          │
│ ❌ OUT OF SCOPE (V1 deferred):                                           │
│ • Different doctor selection during reschedule                           │
│ • Reschedule to different location (same practice only)                  │
│ • Automated reschedule suggestions (proactive push)                      │
│ • Reschedule fee handling                                                │
│                                                                          │
│ 📏 SUCCESS METRICS:                                                      │
│ • Primary: Reschedule completion rate → Target: >80%                     │
│ • Leading: Time-to-reschedule → Target: <90 seconds                      │
│ • Leading: AI-suggestion acceptance rate → Target: >50%                  │
│ • Guardrail: "Slot taken" errors → Target: <2%                           │
├──────────────────────────────────────────────────────────────────────────┤
│ 🧩 DERIVED SCREENS                                                       │
│                                                                          │
│ │ ID  │ Screen / Modal                     │ Purpose                    ││
│ ├─────┼────────────────────────────────────┼────────────────────────────┤│
│ │ R01 │ Reschedule Reason (optional)       │ Context for AI suggestions ││
│ │ R02 │ AI-Suggested Slots                 │ Quick alternatives         ││
│ │ R03 │ Reschedule Confirm Sheet           │ Comparison + commit        ││
│ │ R04 │ Reschedule Success                 │ Updated confirmation       ││
│ │ S08 │ Full Calendar (reuse)              │ Manual browse fallback     ││
│                                                                          │
│ Screen flow:                                                             │
│ [S12]→[R01]→[R02]→[R03]→[R04]                                           │
│         └→ skip →[R02]                                                   │
│              └→[S08]→[R03]                                               │
└──────────────────────────────────────────────────────────────────────────┘
```

## Global UX + i18n + Germany constraints

Inherits all constraints from Guided Wizard v2:
- **Language**: German default, formal "Sie"
- **Date/time**: Germany formatting (`Do., 23.01.2026`, `14:30`), Europe/Berlin
- **Accessibility**: 16px min body, 44px tap targets, WCAG AA contrast
- **DocliQ Brand**: DM Sans font, Teal primary (#13A3B5), Charcoal text (#1C2A30)

---

## Screen Specifications

### R01 — Reschedule Reason (Optional Context)

**Purpose**: Capture context to improve AI slot suggestions (optional step).

**Header**:
- Back arrow (returns to appointment details)
- Title: `Termin verschieben`
- Progress: Not shown (short flow)

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Termin verschieben                    │
├─────────────────────────────────────────┤
│                                         │
│ Aktueller Termin                        │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Anna Müller                     │ │
│ │ Allgemeinmedizin                    │ │
│ │ Do., 30.01.2026 · 14:30             │ │
│ │ Praxis am Markt, Berlin             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Warum möchten Sie verschieben?          │
│ (optional – hilft bei der Suche)        │
│                                         │
│ ○ Zeitlicher Konflikt                   │
│ ○ Früher verfügbar sein                 │
│ ○ Später passt besser                   │
│ ○ Anderer Grund                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Weiter]                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│         Überspringen                    │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Reason selection is optional; user can skip
- Selected reason influences AI suggestions:
  - `Zeitlicher Konflikt` → Suggest different times on same day or adjacent days
  - `Früher verfügbar sein` → Prioritize earlier available slots
  - `Später passt besser` → Suggest slots 1+ weeks out
  - `Anderer Grund` → Use default ranking (soonest + similar time)
- `Überspringen` proceeds to R02 with default suggestions

**Acceptance Criteria**:
- [ ] Current appointment summary is displayed
- [ ] Four reason options are selectable (single-select radio)
- [ ] "Weiter" proceeds to R02 with context
- [ ] "Überspringen" proceeds to R02 without context
- [ ] Reason is NOT stored permanently (session only)

---

### R02 — AI-Suggested Slots

**Purpose**: Present 3–5 intelligent slot alternatives with transparent reasoning.

**Header**:
- Back arrow (returns to R01 or S12)
- Title: `Alternative Termine`

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Alternative Termine                   │
├─────────────────────────────────────────┤
│                                         │
│ Basierend auf Ihren Angaben             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏆 Empfohlen                        │ │
│ │ Fr., 31.01.2026 · 10:00 · 15 min    │ │
│ │ Warum: Ähnliche Uhrzeit, 1 Tag früher│ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Mo., 03.02.2026 · 14:30 · 15 min    │ │
│ │ Warum: Gleiche Uhrzeit              │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Di., 04.02.2026 · 09:00 · 15 min    │ │
│ │ Warum: Nächster freier Termin       │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [Alle Termine anzeigen]                 │
│                                         │
└─────────────────────────────────────────┘
```

**AI Suggestion Logic** (transparent, rules-based):

| Priority | Reason Label (German) | Logic |
|----------|----------------------|-------|
| 1 | `Ähnliche Uhrzeit` | Within ±2 hours of original time |
| 2 | `Gleiche Uhrzeit` | Exact same time, different day |
| 3 | `Nächster freier Termin` | Soonest available slot |
| 4 | `Passt zu Ihrem Kalender` | If calendar access granted, avoids conflicts |
| 5 | `Früher als ursprünglich` | Before original date (if reason = "Früher") |

**Behavior**:
- Show 3–5 suggestions maximum
- Top suggestion marked with `🏆 Empfohlen` badge
- Each card shows:
  - Date + time + duration
  - `Warum:` reason (required, never hidden)
  - `Auswählen` button
- `Alle Termine anzeigen` opens full calendar (S08)
- Tapping `Auswählen` opens R03 (confirm sheet)

**Acceptance Criteria**:
- [ ] 3–5 suggestions displayed (or fewer if limited availability)
- [ ] Each suggestion shows transparent "Warum" reason
- [ ] Top suggestion has "Empfohlen" badge
- [ ] "Alle Termine anzeigen" navigates to full calendar
- [ ] Selecting a suggestion opens confirm sheet
- [ ] Empty state if no slots: `Leider keine alternativen Termine verfügbar. Bitte später erneut versuchen.`

---

### R03 — Reschedule Confirm Sheet (Modal)

**Purpose**: Show comparison and commit to reschedule.

**Content**:

```
┌─────────────────────────────────────────┐
│                 ─────                   │
│         Termin verschieben              │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Bisheriger Termin          ✕ wird  │ │
│ │                            storniert│ │
│ │ Do., 30.01.2026 · 14:30             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│           ↓                             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Neuer Termin               ✓ neu   │ │
│ │ Fr., 31.01.2026 · 10:00             │ │
│ │ 15 min · Vor Ort                    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Arzt/Ärztin                             │
│ Dr. Anna Müller · Allgemeinmedizin      │
│                                         │
│ Adresse                                 │
│ Praxis am Markt                         │
│ Marktplatz 5, 10178 Berlin              │
│                                         │
│ Patient/in                              │
│ Max Mustermann                          │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ ⓘ Der bisherige Termin wird erst nach  │
│   erfolgreicher Bestätigung storniert.  │
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
- Shows clear before/after comparison
- Includes safety note about release timing
- Primary CTA: `Termin verschieben`
- Secondary: `Abbrechen` (closes sheet, no changes)
- On confirm:
  1. System creates new booking
  2. Only after success: cancels original slot
  3. Navigates to R04

**Acceptance Criteria**:
- [ ] Old and new appointment clearly compared
- [ ] Doctor/location/patient details shown
- [ ] Safety note about release timing displayed
- [ ] "Termin verschieben" triggers reschedule
- [ ] "Abbrechen" closes without changes
- [ ] Slot-taken error shows: `Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen Termin.`

---

### R04 — Reschedule Success

**Purpose**: Confirm reschedule and provide next actions.

**Content**:

```
┌─────────────────────────────────────────┐
│                                         │
│              ✓                          │
│                                         │
│    Termin erfolgreich verschoben        │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ Neuer Termin                            │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Anna Müller                     │ │
│ │ Allgemeinmedizin                    │ │
│ │                                     │ │
│ │ 📅 Fr., 31.01.2026 · 10:00          │ │
│ │ 📍 Praxis am Markt, Berlin          │ │
│ │ 👤 Max Mustermann                   │ │
│ │                                     │ │
│ │ Bestätigungsnr.: ABC-12345          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Sie erhalten eine aktualisierte         │
│ Bestätigung per E-Mail und Push.        │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [In Kalender aktualisieren]             │
│                                         │
│ [Route öffnen]                          │
│                                         │
│ [Termin verwalten]                      │
│                                         │
└─────────────────────────────────────────┘
```

**Behavior**:
- Checkmark animation (subtle, 300ms per brand guide)
- New confirmation number generated
- Actions:
  - `In Kalender aktualisieren` → Updates calendar entry (deletes old, adds new)
  - `Route öffnen` → Opens maps
  - `Termin verwalten` → Goes to appointment details
- Email + push confirmation sent automatically

**Acceptance Criteria**:
- [ ] Success animation shown
- [ ] New appointment details displayed
- [ ] New confirmation number shown
- [ ] Calendar action updates (not duplicates) entry
- [ ] Route action opens maps
- [ ] "Termin verwalten" navigates to updated details

---

## Edge Cases

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| No alternative slots | Complete R01 | Show empty state + suggest contacting practice |
| Slot taken at confirm | Tap "Termin verschieben" | Show error, return to R02, refresh suggestions |
| Offline | Tap "Termin verschieben" | Block action + `Bitte stellen Sie eine Internetverbindung her.` |
| Calendar permission denied | Tap "In Kalender aktualisieren" | Show ICS download fallback |
| Same slot selected | Select current time | Prevent selection, show `Dies ist Ihr aktueller Termin.` |
| Reschedule limit reached | Initiate reschedule | Show policy: `Dieser Termin kann nicht erneut verschoben werden.` |

---

## AI Transparency Requirements

Per DocliQ brand values (Trust, Clarity):

1. **Always show "Warum"**: Every AI suggestion must display its reasoning
2. **No hidden ranking**: Sort order is explicit and user-controllable
3. **Easy escape**: "Alle Termine anzeigen" always available
4. **No urgency framing**: Never use "only X left" or countdown timers
5. **Do not store reasons**: User's reschedule reason is session-only, not persisted

---

## Open Decisions / Need Your Input

1. **Reschedule limit policy**: How many times can a user reschedule the same appointment?
2. **Calendar sync method**: Native calendar API vs ICS file download for "update" action?
3. **AI suggestion count**: Is 3–5 the right number, or should we show more?
4. **Calendar integration**: Should we request calendar access to avoid conflicts in suggestions?

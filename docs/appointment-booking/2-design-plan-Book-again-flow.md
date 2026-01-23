---
name: design-lite:book-again-flow
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "AI-Assisted Book Again"
created: 2026-01-23
updated: 2026-01-23
status: draft
extends:
  - docs/appointment-booking/2-design-plan-Guided-wizard-v2.md (BOOK-018)
  - docs/appointment-booking/2-design-plan-Assisted-discovery.md
sources:
  - docs/appointment-booking/APPOINTMENT-BOOKING-SCOPE.md
  - docs/z.guidelines/Docliq Brand Guide 2025.pdf
  - docs/z.guidelines/docliq-tokens.json
---

# DESIGN-LITE: Book Again Flow (AI-Assisted)

This document details the AI-Assisted "Book Again" (Erneut buchen) flow, extending BOOK-018 from the Guided Wizard v2 with intelligent rebooking suggestions based on appointment history and patterns.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: BOOK AGAIN FLOW          Status: 🟡 DRAFT                   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                               │
│ Selected approach: AI-Assisted Book Again                                │
│ Hypothesis: IF we provide a streamlined rebooking flow with pre-filled   │
│ context from past appointments, intelligent timing suggestions based on  │
│ typical follow-up intervals, and the option to book similar appointments │
│ with alternative doctors, THEN rebooking completion rate will exceed     │
│ new booking rate, FOR returning patients, BECAUSE familiar context       │
│ reduces cognitive load and builds on established trust.                  │
├──────────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                         │
│                                                                          │
│ │ Job │ Statement                                     │ Key Actions     ││
│ ├─────┼───────────────────────────────────────────────┼─────────────────┤│
│ │ B1  │ When I need a follow-up or repeat visit, I    │ initiate from   ││
│ │     │ want to quickly book with the same doctor     │ history, confirm││
│ │     │ without re-entering information.              │                 ││
│ │ B2  │ When my usual doctor isn't available, I want  │ view alts,      ││
│ │     │ to see similar alternatives with context on   │ compare, decide ││
│ │     │ why they're suggested.                        │                 ││
│ │ B3  │ When booking a routine visit (e.g., annual    │ review timing,  ││
│ │     │ checkup), I want the app to suggest           │ accept/adjust   ││
│ │     │ appropriate timing based on my history.       │                 ││
│                                                                          │
│ Flow diagram:                                                            │
│ ┌──────────────────┐   ┌──────────────────┐   ┌───────────────────┐     │
│ │ Appointment      │→→ │ Book Again       │→→ │ AI-Suggested      │     │
│ │ History (S11)    │   │ Context (B01)    │   │ Slots (B02)       │     │
│ └──────────────────┘   └────────┬─────────┘   └─────────┬─────────┘     │
│                                 │                       │               │
│                           (same doctor)           (select or change)    │
│                                 │                       │               │
│                                 v                       v               │
│                        ┌──────────────────┐     ┌───────────────────┐   │
│                        │ [Default path]   │     │ Similar Doctors   │   │
│                        └──────────────────┘     │ (B03)             │   │
│                                                 └─────────┬─────────┘   │
│                                                           │             │
│                                                     (confirm)           │
│                                                           │             │
│                                                           v             │
│                                                 ┌───────────────────┐   │
│                                                 │ Confirm Sheet     │   │
│                                                 │ (S09)             │   │
│                                                 └─────────┬─────────┘   │
│                                                           │             │
│                                                           v             │
│                                                 ┌───────────────────┐   │
│                                                 │ Success (S10)     │   │
│                                                 └───────────────────┘   │
├──────────────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                                      │
│                                                                          │
│ ✅ IN SCOPE:                                                             │
│ • "Erneut buchen" action from appointment history                        │
│ • Pre-filled booking context (doctor, specialty, insurance, patient)     │
│ • AI-suggested slots based on:                                           │
│   - Doctor availability                                                  │
│   - User's typical booking patterns (time of day, day of week)           │
│   - Follow-up interval suggestions (e.g., "6 months since last visit")   │
│ • "Warum?" transparency for each suggestion                              │
│ • Alternative doctor suggestions if primary unavailable                  │
│ • "Similar doctors" with match reasons                                   │
│ • Full calendar browse fallback                                          │
│ • Family member rebooking (same patient as original)                     │
│                                                                          │
│ ❌ OUT OF SCOPE (V1 deferred):                                           │
│ • Proactive "time to rebook" push notifications                          │
│ • Series/recurring appointment booking                                   │
│ • Insurance change detection and re-verification                         │
│ • Doctor rating changes since last visit                                 │
│ • Price comparison across doctors                                        │
│                                                                          │
│ 📏 SUCCESS METRICS:                                                      │
│ • Primary: Book-again completion rate → Target: >75% (vs 60% new)        │
│ • Leading: Time-to-book-again → Target: <60 seconds                      │
│ • Leading: Same-doctor rebooking rate → Target: >70%                     │
│ • Guardrail: Alternative doctor acceptance → Tracked (no target)         │
├──────────────────────────────────────────────────────────────────────────┤
│ 🧩 DERIVED SCREENS                                                       │
│                                                                          │
│ │ ID  │ Screen / Modal                     │ Purpose                    ││
│ ├─────┼────────────────────────────────────┼────────────────────────────┤│
│ │ B01 │ Book Again Context                 │ Confirm/adjust pre-fill    ││
│ │ B02 │ AI-Suggested Slots                 │ Quick slot selection       ││
│ │ B03 │ Similar Doctors                    │ Alternatives if unavailable││
│ │ S08 │ Full Calendar (reuse)              │ Manual browse fallback     ││
│ │ S09 │ Confirm Sheet (reuse)              │ Final commit               ││
│ │ S10 │ Success (reuse)                    │ Proof + next actions       ││
│                                                                          │
│ Screen flow (same doctor available):                                     │
│ [S11]→[B01]→[B02]→[S09]→[S10]                                           │
│                                                                          │
│ Screen flow (doctor unavailable):                                        │
│ [S11]→[B01]→[B02:unavailable]→[B03]→[S08]→[S09]→[S10]                   │
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

### History Row Enhancement (S11 — Appointment History)

**Enhancement to existing history screen**:

Each history row gains an `Erneut buchen` action button.

```
┌─────────────────────────────────────────┐
│ Vergangene Termine                      │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Anna Müller                     │ │
│ │ Allgemeinmedizin                    │ │
│ │ Mi., 15.01.2026 · 10:00             │ │
│ │ ✓ Erledigt                          │ │
│ │                                     │ │
│ │ 💡 6 Monate seit letztem Besuch     │ │
│ │                                     │ │
│ │              [Erneut buchen]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Klaus Weber                     │ │
│ │ Kardiologie                         │ │
│ │ Mo., 02.12.2025 · 14:30             │ │
│ │ ✓ Erledigt                          │ │
│ │                                     │ │
│ │              [Erneut buchen]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**AI Enhancement**:
- Show contextual timing hints when relevant:
  - `💡 6 Monate seit letztem Besuch` (for routine checkups)
  - `💡 Jährliche Kontrolle fällig` (for annual visits)
- These hints are based on specialty-typical follow-up intervals (not stored medical data)

**Acceptance Criteria**:
- [ ] Each history row shows "Erneut buchen" button
- [ ] Timing hints shown for visits older than typical follow-up interval
- [ ] Cancelled appointments also show "Erneut buchen" (treated as incomplete)
- [ ] Tapping "Erneut buchen" navigates to B01

---

### B01 — Book Again Context

**Purpose**: Show pre-filled context and allow user to adjust before proceeding.

**Header**:
- Back arrow (returns to history)
- Title: `Erneut buchen`

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Erneut buchen                         │
├─────────────────────────────────────────┤
│                                         │
│ Basierend auf Ihrem letzten Termin      │
│                                         │
│ Arzt/Ärztin                             │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Dr. Anna Müller                  │ │
│ │    Allgemeinmedizin                 │ │
│ │    ★ 4,8 (234 Bewertungen)          │ │
│ │    📍 2,3 km entfernt               │ │
│ │                        [Ändern] ▸   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Fachgebiet                              │
│ Allgemeinmedizin                 [✓]    │
│                                         │
│ Standort                                │
│ Berlin-Mitte (10178)             [✓]    │
│                                         │
│ Versicherung                            │
│ Gesetzlich (GKV)                 [✓]    │
│                                         │
│ Patient/in                              │
│ Max Mustermann                   [✓]    │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ 💡 Ihr letzter Besuch war vor           │
│    6 Monaten. Routinekontrollen werden  │
│    oft halbjährlich empfohlen.          │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [Verfügbare Termine anzeigen]       │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Pre-fill Logic**:

| Field | Pre-fill Source | Editable |
|-------|-----------------|----------|
| Doctor | From history appointment | Yes (→ B03) |
| Specialty | From history appointment | No (implicit) |
| Location | User's current location OR history location | Yes |
| Insurance | User profile (may have changed) | Yes |
| Patient | From history appointment | Yes |

**Behavior**:
- All fields pre-filled from history appointment
- Doctor card shows current rating/distance (may differ from original visit)
- `Ändern` on doctor → navigates to B03 (Similar Doctors)
- Checkmarks indicate confirmed/unchanged values
- Follow-up timing hint shown when relevant
- Primary CTA: `Verfügbare Termine anzeigen`

**Acceptance Criteria**:
- [ ] All fields pre-filled from history appointment
- [ ] Doctor card shows current (not historical) rating and distance
- [ ] "Ändern" allows switching to alternative doctors
- [ ] Follow-up timing hint displayed when >3 months since visit
- [ ] Primary CTA proceeds to B02
- [ ] Insurance verification happens in background (non-blocking)

---

### B02 — AI-Suggested Slots

**Purpose**: Present intelligent slot suggestions for the selected doctor.

**Header**:
- Back arrow (returns to B01)
- Title: `Termine bei Dr. {Name}`

**Content (Doctor Available)**:

```
┌─────────────────────────────────────────┐
│ ← Termine bei Dr. Müller                │
├─────────────────────────────────────────┤
│                                         │
│ Vorschläge für Sie                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏆 Empfohlen                        │ │
│ │ Mo., 27.01.2026 · 10:00 · 15 min    │ │
│ │ Warum: Ähnliche Uhrzeit wie Ihr     │ │
│ │        letzter Termin               │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Di., 28.01.2026 · 14:30 · 15 min    │ │
│ │ Warum: Nächster freier Termin       │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Fr., 31.01.2026 · 09:00 · 15 min    │ │
│ │ Warum: Freitag Vormittag beliebt    │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ [Alle Termine anzeigen]                 │
│                                         │
└─────────────────────────────────────────┘
```

**Content (Doctor Unavailable)**:

```
┌─────────────────────────────────────────┐
│ ← Termine bei Dr. Müller                │
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ⚠️ Dr. Müller hat derzeit keine     │ │
│ │    freien Termine.                  │ │
│ │                                     │ │
│ │    Nächste Verfügbarkeit:           │ │
│ │    voraussichtlich März 2026        │ │
│ │                                     │ │
│ │    [Auf Warteliste setzen]          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│                                         │
│ Ähnliche Ärztinnen/Ärzte                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Klaus Weber                     │ │
│ │ Allgemeinmedizin · ★ 4,7 · 1,8 km   │ │
│ │ Warum: Gleiche Fachrichtung,        │ │
│ │        gute Bewertungen             │ │
│ │ Nächster Termin: Mo., 27.01.        │ │
│ │                          [Auswählen]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Alle ähnlichen Ärzte anzeigen]         │
│                                         │
└─────────────────────────────────────────┘
```

**AI Suggestion Logic** (Book Again specific):

| Priority | Reason Label (German) | Logic |
|----------|----------------------|-------|
| 1 | `Ähnliche Uhrzeit wie Ihr letzter Termin` | Within ±2 hours of historical time |
| 2 | `Gleicher Wochentag` | Same day of week as previous visit |
| 3 | `Nächster freier Termin` | Soonest available |
| 4 | `{Wochentag} {Tageszeit} beliebt` | Common booking pattern for this user |
| 5 | `Passt zu Ihrem Kalender` | If calendar access, avoids conflicts |

**Behavior**:
- Show 3–5 suggestions (same doctor)
- If doctor unavailable:
  - Show unavailability notice with estimated next availability
  - Show `Auf Warteliste setzen` (deferred feature, can be placeholder)
  - Show 2–3 similar doctor suggestions inline
  - `Alle ähnlichen Ärzte anzeigen` → B03
- Tapping `Auswählen` → S09 (Confirm Sheet)

**Acceptance Criteria**:
- [ ] 3–5 suggestions shown when doctor available
- [ ] Each suggestion has transparent "Warum" reason
- [ ] Unavailable state shows estimated availability
- [ ] Similar doctors shown inline when primary unavailable
- [ ] "Alle Termine anzeigen" opens full calendar
- [ ] "Alle ähnlichen Ärzte anzeigen" navigates to B03

---

### B03 — Similar Doctors

**Purpose**: Show alternative doctors with transparent matching reasons.

**Header**:
- Back arrow (returns to B01 or B02)
- Title: `Ähnliche Ärztinnen/Ärzte`

**Content**:

```
┌─────────────────────────────────────────┐
│ ← Ähnliche Ärztinnen/Ärzte              │
├─────────────────────────────────────────┤
│                                         │
│ Basierend auf Ihrem letzten Besuch bei  │
│ Dr. Anna Müller (Allgemeinmedizin)      │
│                                         │
│ Sortieren: [Empfohlen ▾]                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🏆 Beste Übereinstimmung            │ │
│ │                                     │ │
│ │ Dr. Klaus Weber                     │ │
│ │ Allgemeinmedizin                    │ │
│ │ ★ 4,7 (189) · 1,8 km                │ │
│ │ Kasse · Deutsch, Englisch           │ │
│ │                                     │ │
│ │ Warum ähnlich:                      │ │
│ │ ✓ Gleiche Fachrichtung              │ │
│ │ ✓ Akzeptiert Ihre Versicherung      │ │
│ │ ✓ Näher als ursprüngliche Praxis    │ │
│ │                                     │ │
│ │ Nächster Termin: Mo., 27.01. 10:00  │ │
│ │                                     │ │
│ │              [Termine anzeigen]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Dr. Maria Schmidt                   │ │
│ │ Allgemeinmedizin                    │ │
│ │ ★ 4,9 (312) · 3,2 km                │ │
│ │ Kasse · Deutsch                     │ │
│ │                                     │ │
│ │ Warum ähnlich:                      │ │
│ │ ✓ Gleiche Fachrichtung              │ │
│ │ ✓ Akzeptiert Ihre Versicherung      │ │
│ │ ✓ Höhere Bewertung                  │ │
│ │                                     │ │
│ │ Nächster Termin: Di., 28.01. 09:00  │ │
│ │                                     │ │
│ │              [Termine anzeigen]     │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Similarity Matching Logic**:

| Match Factor | Label (German) | Weight |
|--------------|----------------|--------|
| Same specialty | `Gleiche Fachrichtung` | Required |
| Insurance match | `Akzeptiert Ihre Versicherung` | Required |
| Distance | `Näher` / `Ähnliche Entfernung` | High |
| Rating | `Höhere Bewertung` / `Gute Bewertungen` | Medium |
| Languages | `Spricht {Sprache}` | Medium |
| Availability | `Früher verfügbar` | Medium |

**Sort Options**:
- `Empfohlen` (default) — AI-ranked by match score
- `Entfernung` — Nearest first
- `Bewertung` — Highest rated first
- `Verfügbarkeit` — Soonest slot first

**Behavior**:
- Show 5–10 similar doctors
- Each card shows:
  - Doctor info (name, specialty, rating, distance, insurance, languages)
  - "Warum ähnlich" section with match reasons
  - Next available slot preview
  - `Termine anzeigen` → Doctor's slot picker (S08)
- Top result marked with `🏆 Beste Übereinstimmung`

**Acceptance Criteria**:
- [ ] Only doctors with same specialty and matching insurance shown
- [ ] Each card shows transparent "Warum ähnlich" reasons
- [ ] Sort dropdown with 4 options
- [ ] "Termine anzeigen" navigates to doctor's calendar
- [ ] Top result has "Beste Übereinstimmung" badge
- [ ] Empty state: `Keine ähnlichen Ärzte in Ihrer Nähe gefunden.`

---

## Follow-Up Interval Intelligence

**Specialty-Based Timing Suggestions** (rules-based, not ML):

| Specialty | Typical Follow-up | Hint Trigger |
|-----------|------------------|--------------|
| Allgemeinmedizin | 6–12 months | >6 months since visit |
| Zahnarzt | 6 months | >6 months since visit |
| Augenarzt | 12 months | >12 months since visit |
| Gynäkologie | 12 months | >12 months since visit |
| Kardiologie | 6–12 months | >6 months since visit |
| Dermatologie | 12 months | >12 months since visit |
| HNO | As needed | No automatic hint |

**Hint Display Rules**:
- Show hint only if visit is older than threshold
- Never show for cancelled appointments
- Never show medical advice — only timing convenience
- Hint text pattern: `💡 {X} Monate seit letztem Besuch`

---

## Edge Cases

| Scenario | User Action | System Response |
|----------|-------------|-----------------|
| Doctor retired/moved | Tap "Erneut buchen" | Show notice + redirect to similar doctors |
| Insurance changed | Proceed with old insurance | Warning if mismatch, allow override |
| Child now adult | Rebook family appointment | Re-verify eligibility, update if needed |
| Very old history (>12 mo) | Tap "Erneut buchen" | Confirm details still accurate |
| Doctor no longer accepts insurance | Select doctor | Block + explain: `Diese Praxis akzeptiert Ihre Versicherung nicht mehr.` |
| Multiple past visits same doctor | View history | Show most recent, others accessible |
| Cancelled appointment | Tap "Erneut buchen" | Treat as fresh booking (no "again" context) |

---

## AI Transparency Requirements

Per DocliQ brand values (Trust, Clarity):

1. **Always show "Warum"**: Every suggestion (slot or doctor) must display reasoning
2. **No hidden ranking factors**: Sort is explicit and user-controllable
3. **Easy escape**: Full calendar/doctor list always available
4. **No urgency framing**: Timing hints are helpful, not pressuring
5. **Pre-fill is editable**: User can change any pre-filled value
6. **Pattern detection is transparent**: "Based on your last visit" language used

---

## Data Privacy Considerations

1. **No medical data storage**: We don't store reasons for visits, diagnoses, or treatments
2. **Timing hints are specialty-based**: Not derived from health conditions
3. **Pattern detection is local**: Booking time preferences derived from appointment history only
4. **No cross-user patterns**: Suggestions not based on "users like you"
5. **History retention**: 12 months per BOOK-018, user can request deletion

---

## Open Decisions / Need Your Input

1. **Waitlist feature**: Should "Auf Warteliste setzen" be functional in MVP or placeholder?
2. **Calendar integration**: Should we request calendar access to improve time suggestions?
3. **Similar doctor threshold**: How many km radius for "similar" doctors (5km? 10km?)?
4. **History depth**: Should we show timing hints for visits older than 12 months (the history limit)?
5. **Doctor comparison**: Should we show how the alternative compares to original doctor (e.g., "same rating" / "closer")?

---
name: design-lite:4-design-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "C — Guided Wizard (step-by-step narrowing)"
created: 2026-01-22
updated: 2026-01-22
status: draft
supersedes:
  - docs/appointment-booking/design-Guided-wizard.md
sources:
  - docs/appointment-booking/APPOINTMENT-BOOKING-SCOPE.md
  - docs/appointment-booking/SUMMARY-coverage-and-gates.md
  - docs/z.guidelines/visual-artifacts-rules.md
  - docs/z.guidelines/visual-guidelines-abstract.md
  - docs/z.guidelines/visual-guideline.md
---

# DESIGN-LITE: DESIGN (Approach C — Guided Wizard) — v2 (Acceptance-Complete)

This document closes the Guided Wizard gaps listed in `docs/appointment-booking/SUMMARY-coverage-and-gates.md` → **“Why” Notes** (Guided Wizard — why P/M). It is written to be implementable as acceptance criteria, using German-first + i18n-first + mobile-first constraints.

```
┌──────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: DESIGN (v2)               Status: 🟡 DRAFT               │
├──────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                           │
│ Selected approach: C — Guided Wizard (step-by-step narrowing)         │
│ Hypothesis: IF we implement a 4-step booking funnel (Specialty →      │
│ Location → Insurance → Results) and then guide Doctor → Slot →        │
│ Confirm with explicit progress, clear microcopy, and deterministic    │
│ availability handling, THEN booking completion rate will increase     │
│ and time-to-book will decrease, FOR users booking in Germany,         │
│ BECAUSE they can commit with lower uncertainty and fewer dead ends.   │
├──────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                      │
│                                                                      │
│ │ Job │ Statement                                     │ Key Actions ││
│ ├─────┼───────────────────────────────────────────────┼─────────────┤│
│ │ J1  │ When I need a doctor appointment, I want to   │ search,      ││
│ │     │ answer a few questions so results fit my      │ refine,      ││
│ │     │ needs (specialty/location/insurance).         │ edit/back    ││
│ │ J2  │ When I pick a doctor and time, I want to      │ pick slot,   ││
│ │     │ confirm clearly (who/when/where/cost) before  │ confirm,     ││
│ │     │ booking is created.                           │ cancel       ││
│ │ J3  │ After booking, I want to manage appointments  │ add calendar,││
│ │     │ (route, reschedule, cancel, history).         │ route, manage││
│                                                                      │
│ Flow diagram (simplified):                                           │
│ ┌─────────────┐   ┌──────────────────┐   ┌──────────────┐           │
│ │ Entry point │→→ │ Wizard (Step 1-4) │→→ │ Results list  │           │
│ └─────────────┘   └─────────┬────────┘   └───────┬──────┘           │
│                              │                    │                  │
│                         (edit/back)          (choose doctor)         │
│                              │                    │                  │
│                              v                    v                  │
│                        ┌──────────┐        ┌──────────────┐          │
│                        │ Wizard    │        │ Doctor        │          │
│                        │ summary   │        │ profile       │          │
│                        └──────────┘        └──────┬───────┘          │
│                                                    │                 │
│                                              (choose slot)           │
│                                                    │                 │
│                                                    v                 │
│                                          ┌──────────────┐            │
│                                          │ Slot picker   │            │
│                                          └──────┬───────┘            │
│                                                 │                    │
│                                           (confirm sheet)            │
│                                                 │                    │
│                                                 v                    │
│                                          ┌──────────────┐            │
│                                          │ Success       │            │
│                                          └──────┬───────┘            │
│                                                 │                    │
│                                      (manage: upcoming/history)       │
│                                                 │                    │
│                                                 v                    │
│                                          ┌──────────────┐            │
│                                          │ My Appointments│           │
│                                          └──────────────┘            │
├──────────────────────────────────────────────────────────────────────┤
│ 📦 SCOPE BOUNDARIES                                                  │
│                                                                      │
│ ✅ IN SCOPE (MVP):                                                   │
│ • Specialty search w/ autocomplete + recents + chips (BOOK-001)      │
│ • Location search w/ GPS CTA + autocomplete + saved (BOOK-002)       │
│ • Insurance filter + tagging + hide rules + warning (BOOK-003)       │
│ • Filters + sort + persistence (BOOK-004/005)                        │
│ • Doctor cards + profile + reviews + calendar (BOOK-006..009)        │
│ • Slot selection + confirm + success (BOOK-010..012)                 │
│ • Calendar + maps details (BOOK-013/014)                             │
│ • Manage: upcoming + details + cancel + reschedule + history (015-018)│
│ • A11y baseline + poor connectivity handling (BOOK-019/020)          │
│ • Family booking + reminders spec (BOOK-021/022)                     │
│                                                                      │
│ ❌ OUT OF SCOPE (V1 deferred):                                        │
│ • Guest checkout (no account)                                        │
│ • Multi-appointment booking (series)                                 │
│ • Waitlist (“früherer Termin”)                                       │
│ • Separate Telemedizin booking flow (outside this feature)           │
│                                                                      │
│ 📏 SUCCESS METRICS:                                                  │
│ • Primary: Search → Confirmed booking conversion (Target: +10%)      │
│ • Leading: Time-to-book (Target: -20%)                               │
│ • Guardrail: “slot taken” errors / 100 bookings (Target: <3)         │
│ • Guardrail: Cancel rate within 1h (Must not increase)               │
├──────────────────────────────────────────────────────────────────────┤
│ 🧩 DERIVED SCREENS                                                   │
│                                                                      │
│ │ ID  │ Screen / Modal                     │ Covers      │ Purpose  ││
│ ├─────┼────────────────────────────────────┼─────────────┼──────────┤│
│ │ S01 │ Entry (“Termin buchen”)            │ -           │ Start    ││
│ │ S02 │ Wizard 1: Fachgebiet (Search)      │ BOOK-001    │ Narrow   ││
│ │ S03 │ Wizard 2: Ort & Umkreis            │ BOOK-002    │ Narrow   ││
│ │ S04 │ Wizard 3: Versicherung             │ BOOK-003    │ Clarify  ││
│ │ S05 │ Results list (filters + sort)      │ 004/005/006 │ Choose   ││
│ │ S06 │ Doctor profile                     │ BOOK-007/009│ Decide   ││
│ │ S07 │ Reviews (list)                     │ BOOK-009    │ Trust    ││
│ │ S08 │ Slot picker (calendar)             │ BOOK-008/010│ Select   ││
│ │ S09 │ Confirm sheet (modal)              │ 010/011/021 │ Commit   ││
│ │ S10 │ Success                            │ 012-014/022 │ Next     ││
│ │ S11 │ My appointments (Upcoming/History) │ 015/018     │ Manage   ││
│ │ S12 │ Appointment details                │ 014/016/017 │ Actions  ││
│ │ S13 │ Cancel confirm dialog              │ BOOK-016    │ Confirm  ││
│ │ S14 │ Reschedule flow (same doctor)      │ BOOK-017    │ Change   ││
│                                                                      │
│ Screen flow:                                                        │
│ [S01]→[S02]→[S03]→[S04]→[S05]→[S06]→[S08]→[S09]→[S10]               │
│ Post: [S10]→[S11]→[S12]→([S13] or [S14])                             │
├──────────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                        │
│                                                                      │
│ │ Scenario                 │ User Action         │ System Response  ││
│ ├──────────────────────────┼─────────────────────┼─────────────────┤│
│ │ No results               │ Finish wizard       │ Show empty state ││
│ │ Slot taken pre-confirm   │ Tap “Bestätigen”    │ Block + explain  ││
│ │ Offline at confirm       │ Tap “Bestätigen”    │ Queue request +  ││
│ │                          │                     │ “nicht bestätigt”││
│ │ Permissions denied (GPS) │ Tap GPS CTA         │ Explain + allow  ││
│ │                          │                     │ manual entry     ││
│ │ Child not eligible       │ Choose child        │ Clear reason +   ││
│ │                          │                     │ suggest options  ││
├──────────────────────────────────────────────────────────────────────┤
│ 👉 AI: v2 is acceptance-complete; remaining decisions are policy-     │
│ and data-source choices (offline queue policy, cost truth source).    │
└──────────────────────────────────────────────────────────────────────┘
```

## Global UX + i18n + Germany constraints (applies to all screens)

- **Language**: German default; English available at launch; assume 30–40% text expansion in layouts.
- **Tone**: formal “Sie”, factual, no urgency framing, no exclamation marks.
- **Date/time**: Germany formatting (e.g., `Do., 22.01.2026`, `14:30`), time zone Europe/Berlin.
- **Accessibility baseline (BOOK-019)**:
  - Body text ≥ 16 px; headings ≥ 20 px.
  - Tap targets ≥ 48×48 dp (≥ 44 px).
  - High-contrast tokens; color never sole indicator.
  - No time limits/timers in booking flow.
  - Step indicator string shown consistently: `Schritt X von 4`.
- **Persistence**: wizard answers, filters, sort, selected doctor, selected slot persist across back/edit and across app restarts until the user clears or resets.

## Requirement-by-requirement acceptance criteria (closes all Guided Wizard P/M)

### BOOK-001 — Specialty search (autocomplete, recents, chips, HNO, DE/EN)

- Autocomplete shows suggestions **after 2+ characters** typed.
- Recent searches list:
  - Max **5** items.
  - Supports clear action: `Verlauf löschen`.
- Chips:
  - Selected specialty shown as removable chip on Results list header.
  - “Not sure” option: `Ich bin nicht sicher` → shows top 6 common specialties + search field.
- German terms:
  - Must support `HNO` as first-class suggestion and in synonyms list.
- DE/EN behavior:
  - English terms (e.g., “ENT”) map to German specialty label and show as `HNO (ENT)` in suggestion row.

### BOOK-002 — Location (GPS CTA, autocomplete, saved, display format, 10 km default)

- Location step includes primary CTA: `Aktuellen Standort verwenden`.
  - If permission not granted: explain and provide action `In Einstellungen öffnen`.
  - If denied: user can proceed with manual entry; no dead ends.
- Manual location:
  - Address/city autocomplete.
  - Display format in UI: `Ort (PLZ), Straße Hausnr.` when available; otherwise `Ort (PLZ)`.
- Saved locations:
  - Show section `Gespeichert` (max 3) with entries like `Zuhause`, `Arbeit`.
  - Add location to saved list via `Als gespeichert markieren` on selection (local-only is acceptable for MVP).
- Radius:
  - Default **10 km**.
  - Editable via slider/stepper with visible label (e.g., `Umkreis: 10 km`).

### BOOK-003 — Insurance filter (prefill, “Nur Kassenärzte”, tags, hide private-only, warning)

- Wizard insurance step pre-fills based on profile if available:
  - `Gesetzlich (GKV)` / `Privat (PKV)` / `Selbstzahler`.
- Results list includes toggle:
  - Label: `Nur Kassenärzte`.
  - When enabled: hide private-only doctors from list.
- Doctor card tags:
  - Must show one of: `Kasse`, `Privat`, `Beides`.
- Warning (no-match):
  - If toggle filters all results: show inline warning `Keine passenden Ärztinnen/Ärzte für Ihre Auswahl. Bitte Filter anpassen.` with action `Filter öffnen`.

### BOOK-004 — Filters (distance/rating/video/languages, persist, count, clear all, live update)

- Filters sheet includes exactly:
  - Distance (radius) (mirrors BOOK-002 setting).
  - Rating (min threshold).
  - Languages (multi-select).
  - Video (appointment type): `Videosprechstunde` (filters to bookable video consultation appointments).
- Filter button shows **active count** badge (e.g., `Filter (2)`).
- `Alle löschen` clears all non-default filters.
- Changes apply immediately on close (no extra “apply” step) and persist for session.

### BOOK-005 — Sort (soonest/distance/rating, default soonest, header display, persist)

- Sort control is visible above results.
- Options:
  - `Frühester Termin` (default)
  - `Entfernung`
  - `Bewertung`
- Header shows current sort: `Sortiert nach: Frühester Termin`.
- Sort persists for session (until user resets).

### BOOK-006 — Doctor cards (rating+count, 3 slots, tags, “Mehr Termine”, empty states, tap behaviors)

Each card shows (top-to-bottom):
- Name + specialty (German label), distance in km, next available date if not today.
- Rating + count, format: `4,6 (128)`.
- Insurance tag: `Kasse` / `Privat` / `Beides`.
- Capability tags (optional): languages; `Video` if the doctor offers video consultation appointments.
- **Three** next available slots as tappable pills:
  - Show time + duration (e.g., `14:30 · 15 min`).
  - Always show appointment type label: `Vor Ort` or `Video` (e.g., `14:30 · 15 min · Video`).
  - Disabled style for unavailable.
- Link/button: `Mehr Termine`.
- Empty state on card:
  - If no slots today: show label `Keine Termine heute` and still allow `Mehr Termine`.

Tap behaviors:
- Tap slot pill → opens Confirm sheet (S09) with that slot preselected.
- Tap `Mehr Termine` → opens Slot picker (S08) for same doctor.
- Tap elsewhere on card → opens Doctor profile (S06).

### BOOK-007 — Doctor profile (content sections + persistent CTA)

Profile includes sections:
- Header: photo/avatar, name, specialty, rating+count.
- Address with map preview + `Route öffnen`.
- “Leistungen” (services list).
- “Über die Praxis” (about).
- “Bewertungen” snippet: average + count + 3 recent excerpts with `Mehr lesen`.
- Sticky primary CTA: `Termin auswählen` (always visible).

### BOOK-008 — Full calendar (week swipe, increments, “Heute”, durations)

- Week view supports swipe left/right.
- Controls: `Heute`, previous/next week buttons.
- Slot increments: 15 min or 30 min (as available); display duration per slot.
- Availability styling must not rely on color alone (use text/icon + disabled states).

### BOOK-009 — Reviews (PII-safe, truncation, “Mehr lesen”, “Alle Bewertungen”, sort)

- Reviews surface(s):
  - Snippet on profile; full list on dedicated Reviews screen (S07).
- Truncation:
  - Snippet truncates to ~2–3 lines with action `Mehr lesen`.
- Full list:
  - `Alle Bewertungen` shows list sorted by **recency** by default.
  - Sort options: `Neueste zuerst` / `Bestbewertet`.
- PII safety:
  - Do not show patient full names, addresses, phone numbers, or other identifiers.

### BOOK-010 — Slot selection (highlight, persist, show time+duration+type, real-time check, exact error copy)

- Selected slot highlights and **persists** when navigating:
  - From slot picker → confirm sheet → back to picker → selection remains.
- Slot displays:
  - Time, duration, and appointment type label (e.g., `Vor Ort` or `Video`).
- Real-time check:
  - When user taps `Termin bestätigen`, system rechecks availability.
- Error copy (exact):
  - `Dieser Termin ist leider nicht mehr verfügbar. Bitte wählen Sie einen anderen Termin.`

### BOOK-011 — Confirm sheet (details + “Grund” 200 chars + cost/price + CTAs incl abbrechen)

Confirm sheet includes:
- Who: `Für wen ist der Termin?` selector (see BOOK-021).
- Summary rows: doctor, date, time, duration, type, address.
  - If type is `Video`: replace address row with `Online` + short note `Link wird nach Bestätigung bereitgestellt.` (no video-link delivery mechanism required for MVP beyond placeholder).
- Cost/coverage row:
  - Show one of:
    - `Kassenleistung` (GKV)
    - `Privatleistung` (PKV)
    - `Selbstzahler` (if applicable)
  - If cost estimate not available: show neutral note `Kosten können je nach Versicherung variieren.`
- Free-text reason:
  - Label: `Grund des Besuchs (optional)`
  - Max 200 characters; counter (e.g., `0/200`).
- CTAs:
  - Primary: `Termin bestätigen`
  - Secondary: `Abbrechen` (closes without booking)

### BOOK-012 — Success (checkmark animation, details, confirmation no, calendar/route, email+push)

- Shows checkmark animation (subtle).
- Shows:
  - Confirmation number
  - Appointment details
- Actions:
  - `In Kalender speichern`
  - `Route öffnen`
  - `Termin verwalten`
- Explicit statement:
  - `Sie erhalten eine Bestätigung per E‑Mail und Push‑Benachrichtigung (falls aktiviert).`

### BOOK-013 — Calendar integration details (prefill fields, reminders defaults, toast copy)

- Supports add-to-calendar for iOS and Google Calendar (via native picker or ICS).
- Prefill fields:
  - Title: `Arzttermin: Dr. {Name} ({Fachgebiet})`
  - Location: full address
  - Notes: confirmation number + booking reference
- Default reminders: **24 h** and **1 h** before.
- Toast copy on success (exact): `Termin hinzugefügt`.

### BOOK-014 — Maps integration details (works from success + details, fallback copy)

- `Route öffnen` available on:
  - Success screen (S10)
  - Appointment details (S12)
- If maps app cannot open:
  - Show address in a copyable block + action `Adresse kopieren`.
  - Confirmation toast: `Adresse kopiert`.

### BOOK-015 — Upcoming appointments (location, fields, sort, details, empty state copy)

- IA: bottom tab `Termine` → default `Kommende Termine`.
- List fields per row:
  - Date + time
  - Doctor name + specialty
  - Address (short)
  - Patient name (if family booking)
- Sorting: soonest first.
- Empty state copy (exact): `Sie haben keine kommenden Termine.`
  - CTA: `Termin buchen`.

### BOOK-016 — Cancel (labels/copy/policy display + move to history)

- Appointment details shows secondary action: `Termin absagen`.
- Cancel confirm dialog includes:
  - Title: `Termin absagen?`
  - Policy text (placeholder allowed but must exist): `Stornierungsbedingungen: …`
  - CTAs: `Absagen` (destructive), `Behalten` (cancel)
- On success:
  - Toast: `Termin abgesagt`.
  - Appointment is removed from upcoming and appears in history with status `Abgesagt`.

### BOOK-017 — Reschedule (same-doctor calendar, release old slot after new confirm, comms)

- Appointment details shows primary/secondary action: `Termin verschieben`.
- Reschedule flow:
  - Must keep same doctor.
  - User selects a new slot in the same slot picker (S08).
  - Only after new booking is confirmed does the system cancel the original (release timing).
- Confirmation messaging:
  - After success, show that updated confirmation is sent (email/push).

### BOOK-018 — Appointment history (12 months, “Erneut buchen”, sort)

- `Termine` tab has second segment: `Vergangene Termine`.
- History scope: last **12 months**.
- Sorted: most recent first.
- Each row shows status (e.g., `Erledigt`, `Abgesagt`).
- Row action: `Erneut buchen` → opens same doctor’s slot picker (S08).

### BOOK-019 — Accessibility baseline (16pt/48dp/high-contrast/no timers/step indicator string)

- Typography:
  - Body text ≥ 16 px; headings ≥ 20 px.
  - Supports user font scaling (e.g., 1,0× / 1,15× / 1,3×) without truncation.
- Touch:
  - Tap targets ≥ 48×48 dp (≥ 44 px).
  - No hidden gestures required to complete booking.
- Contrast and meaning:
  - WCAG AA contrast minimum.
  - Status/availability never conveyed by color alone (paired with text/icon).
- Time:
  - No timers or time-limited confirmations in the booking flow.
- Progress clarity:
  - Step indicator is visible in wizard header and announced for screen readers:
    - `Schritt X von 4`.

### BOOK-020 — Poor connectivity (cache 5 min, offline indicator, retry, queue confirm offline, skeletons)

- Cache:
  - Search results and slot availability cached for **5 minutes**.
- Offline indicator:
  - Show banner `Offline. Einige Daten sind möglicherweise nicht aktuell.`
- Retry:
  - Any failed fetch shows CTA `Erneut versuchen`.
- Skeletons:
  - Loading states for results list and slot picker use skeleton rows.
- Queue confirm offline (policy-safe):
  - If user confirms while offline, allow queuing only with explicit message:
    - `Ihre Anfrage wird gesendet, sobald Sie wieder online sind. Der Termin ist noch nicht bestätigt.`
  - Booking is not shown as “confirmed” until server confirmation arrives.
  - If server rejects due to slot taken: surface the BOOK-010 error copy and route user to re-pick.

### BOOK-021 — Book for children (selector in confirm sheet, eligibility, tag patient name)

- Confirm sheet includes selector:
  - Label: `Für wen ist der Termin?`
  - Options: `Für mich` + `Für {Kindname}` (from family profiles).
- Eligibility check:
  - If selected child is not eligible for chosen insurance option, block confirm and show:
    - `Für dieses Kind ist diese Versicherungsart nicht verfügbar. Bitte Auswahl ändern.`
- Appointment is tagged everywhere (upcoming, details, success) with patient name.

### BOOK-022 — Reminders (24h + 1h + payload, prefs, email rule)

- Default reminders:
  - Push 24 hours before
  - Push 1 hour before
- Reminder payload must include:
  - Doctor name, specialty
  - Date/time
  - Address
  - Action: `Route öffnen`
- Preferences surface:
  - Settings → `Benachrichtigungen` → toggles for `Push` and `E‑Mail` reminders and timing.
- Email rule:
  - Send email reminder 24h before **only if** email is verified.

## Open Decisions / Need Your Input

1. **Offline queuing policy** (BOOK-020): is “queue when offline” allowed for MVP, or should we hard-block? If hard-block, we should update scope/requirement wording.
2. **Cost/coverage truth source** (BOOK-011): do we have authoritative pricing/coverage data, or only labels (Kassenleistung/Privatleistung)?
3. **Saved locations source** (BOOK-002): account-backed (server) vs local-only for MVP.
4. **Video appointment details** (BOOK-004/011): where is the video-visit link surfaced (success screen vs appointment details), and do we require pre-visit instructions in MVP?

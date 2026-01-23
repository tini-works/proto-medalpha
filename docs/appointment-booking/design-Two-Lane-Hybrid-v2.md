---
name: design-lite:4-design-v2
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
selected_approach: "E — Two-Lane Hybrid (QuickBook + 'Nächster Termin' CTA)"
created: 2026-01-21
updated: 2026-01-23
status: draft
supersedes:
  - docs/appointment-booking/design-Two-Lane Hybrid with "Nächster Termin" CTA.md
sources:
  - docs/appointment-booking/APPOINTMENT-BOOKING-SCOPE.md
  - docs/appointment-booking/SUMMARY-coverage-and-gates.md
  - docs/z.guidelines/visual-artifacts-rules.md
  - docs/z.guidelines/visual-guidelines-abstract.md
  - docs/z.guidelines/visual-guideline.md
---

# DESIGN-LITE: DESIGN (Approach E — Two-Lane Hybrid) — v2 (Acceptance-Complete)

This document closes all gaps for Two-Lane Hybrid listed in `docs/appointment-booking/SUMMARY-coverage-and-gates.md`. It is written to be implementable as acceptance criteria, using German-first + i18n-first + mobile-first constraints.

```
┌──────────────────────────────────────────────────────────────────────┐
│ DESIGN-LITE: DESIGN (v2)               Status: 🟡 DRAFT               │
├──────────────────────────────────────────────────────────────────────┤
│ 📋 CONTEXT                                                           │
│ Selected approach: E — Two-Lane Hybrid (QuickBook list +              │
│ "Nächster Termin" CTA for earliest options)                           │
│ Hypothesis: IF we implement a two-lane booking system (Lane 1:        │
│ standard Search → Results → Doctor → Slot → Confirm; Lane 2:          │
│ "Nächster Termin" → constraints → top 3 → confirm) with explicit      │
│ progress, clear microcopy, and deterministic availability handling,   │
│ THEN booking completion rate will increase and time-to-book will      │
│ decrease, FOR users booking in Germany, BECAUSE they can either       │
│ browse carefully (J1) or book the earliest slot quickly (J2) with     │
│ minimal uncertainty and fewer dead ends.                              │
├──────────────────────────────────────────────────────────────────────┤
│ 🔄 USER FLOWS (Jobs-to-be-Done)                                      │
│                                                                      │
│ │ Job │ Statement                                     │ Key Actions ││
│ ├─────┼───────────────────────────────────────────────┼─────────────┤│
│ │ J1  │ When I need a doctor, I want to search and    │ search,      ││
│ │     │ browse options so I can pick the right doctor │ filter,      ││
│ │     │ and time (standard flow).                     │ compare      ││
│ │ J2  │ When I just want the earliest slot, I want    │ choose       ││
│ │     │ the app to suggest next available options so  │ constraints, ││
│ │     │ I can book fast ("Nächster Termin" lane).     │ select       ││
│ │ J3  │ When I'm ready, I want to confirm my booking  │ review,      ││
│ │     │ so I know exactly what I booked (who/where/   │ confirm      ││
│ │     │ when/cost).                                   │              ││
│ │ J4  │ After booking, I want to manage appointments  │ view,        ││
│ │     │ (add to calendar, route, reschedule, cancel,  │ cancel,      ││
│ │     │ history) so I stay on track.                  │ reschedule   ││
│                                                                      │
│ Flow diagram (Two-Lane):                                             │
│                                                                      │
│ ┌─────────────┐                                                      │
│ │ Entry point │                                                      │
│ └──────┬──────┘                                                      │
│        │                                                             │
│   ┌────┴────┐                                                        │
│   │         │                                                        │
│   ▼         ▼                                                        │
│ LANE 1     LANE 2                                                    │
│ (Browse)   ("Nächster Termin")                                       │
│   │         │                                                        │
│   ▼         ▼                                                        │
│ ┌───────┐ ┌─────────────────┐                                        │
│ │Search │ │Mini-step:       │                                        │
│ │Screen │ │radius+time+ins  │                                        │
│ └───┬───┘ └────────┬────────┘                                        │
│     ▼              ▼                                                 │
│ ┌───────┐ ┌─────────────────┐                                        │
│ │Results│ │Top 3 options    │                                        │
│ │ List  │ │(with "why")     │                                        │
│ └───┬───┘ └────────┬────────┘                                        │
│     │              │                                                 │
│     ▼              │ Link: "Alle Ergebnisse" ────────────────┐       │
│ ┌───────┐          │                                         │       │
│ │Doctor │          │                                         │       │
│ │Profile│          │                                         │       │
│ └───┬───┘          │                                         │       │
│     ▼              │                                         │       │
│ ┌───────┐          │                                         │       │
│ │Slot   │◄─────────┼─────────────────────────────────────────┘       │
│ │Picker │          │                                                 │
│ └───┬───┘          │                                                 │
│     │              │                                                 │
│     └──────┬───────┘                                                 │
│            ▼                                                         │
│      ┌───────────┐                                                   │
│      │ Confirm   │                                                   │
│      │ Sheet     │                                                   │
│      └─────┬─────┘                                                   │
│            ▼                                                         │
│      ┌───────────┐                                                   │
│      │ Success   │                                                   │
│      └─────┬─────┘                                                   │
│            ▼                                                         │
│      ┌───────────────┐                                               │
│      │My Appointments│                                               │
│      │(upcoming/hist)│                                               │
│      └───────────────┘                                               │
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
│ • "Nächster Termin" quick-book lane (Lane 2 unique to this approach) │
│                                                                      │
│ ❌ OUT OF SCOPE (V1 deferred):                                        │
│ • Guest checkout (no account)                                        │
│ • Multi-appointment booking (series)                                 │
│ • Waitlist ("früherer Termin")                                       │
│ • Separate Telemedizin booking flow (outside this feature)           │
│ • Payment processing for private appointments                        │
│                                                                      │
│ 📏 SUCCESS METRICS:                                                  │
│ • Primary: Search → Confirmed booking conversion (Target: +10%)      │
│ • Primary: Time-to-book (Target: -20% vs baseline)                   │
│ • Leading: "Nächster Termin" lane usage → Target: >25% of bookings   │
│ • Guardrail: "slot taken" errors / 100 bookings (Target: <3)         │
│ • Guardrail: Cancel rate within 1h (Must not increase)               │
├──────────────────────────────────────────────────────────────────────┤
│ 🧩 DERIVED SCREENS                                                   │
│                                                                      │
│ │ ID  │ Screen / Modal                     │ Covers      │ Purpose  ││
│ ├─────┼────────────────────────────────────┼─────────────┼──────────┤│
│ │ S01 │ Entry ("Termin buchen")            │ -           │ Start    ││
│ │ S02 │ Search (Specialty + Location)      │ BOOK-001/002│ Input    ││
│ │ S03 │ Results list (filters + sort)      │ 003-006     │ Browse   ││
│ │ S04 │ Doctor profile                     │ BOOK-007/009│ Decide   ││
│ │ S05 │ Reviews (list)                     │ BOOK-009    │ Trust    ││
│ │ S06 │ Slot picker (calendar)             │ BOOK-008/010│ Select   ││
│ │ S07 │ Confirm sheet (modal)              │ 010/011/021 │ Commit   ││
│ │ S08 │ Success                            │ 012-014/022 │ Next     ││
│ │ S09 │ "Nächster Termin" mini-step        │ BOOK-001-003│ Quick    ││
│ │ S10 │ Top 3 options list                 │ BOOK-006    │ Fast pick││
│ │ S11 │ My appointments (Upcoming/History) │ 015/018     │ Manage   ││
│ │ S12 │ Appointment details                │ 014/016/017 │ Actions  ││
│ │ S13 │ Cancel confirm dialog              │ BOOK-016    │ Confirm  ││
│ │ S14 │ Reschedule flow (same doctor)      │ BOOK-017    │ Change   ││
│                                                                      │
│ Screen flow (Lane 1 — Browse):                                       │
│ [S01]→[S02]→[S03]→[S04]→[S06]→[S07]→[S08]                            │
│                                                                      │
│ Screen flow (Lane 2 — "Nächster Termin"):                            │
│ [S01]→[S09]→[S10]→[S07]→[S08]                                        │
│           └→ "Alle Ergebnisse" →[S03]→ ... (Lane 1 continues)        │
│                                                                      │
│ Post-booking: [S08]→[S11]→[S12]→([S13] or [S14])                     │
├──────────────────────────────────────────────────────────────────────┤
│ ⚠️ EDGE CASES                                                        │
│                                                                      │
│ │ Scenario                 │ User Action         │ System Response  ││
│ ├──────────────────────────┼─────────────────────┼─────────────────┤│
│ │ No results               │ Finish search       │ Show empty state ││
│ │ Slot taken pre-confirm   │ Tap "Bestätigen"    │ Block + explain  ││
│ │ Offline at confirm       │ Tap "Bestätigen"    │ Queue request +  ││
│ │                          │                     │ "nicht bestätigt"││
│ │ Permissions denied (GPS) │ Tap GPS CTA         │ Explain + allow  ││
│ │                          │                     │ manual entry     ││
│ │ Child not eligible       │ Choose child        │ Clear reason +   ││
│ │                          │                     │ suggest options  ││
│ │ "Nächster Termin" no     │ Complete constraints│ Show message +   ││
│ │ options in time window   │                     │ "Alle Ergebnisse"││
│ │ All Top 3 slots taken    │ User returns        │ Refresh + update ││
│ │                          │                     │ list             ││
├──────────────────────────────────────────────────────────────────────┤
│ 👉 AI: v2 is acceptance-complete; remaining decisions are policy-     │
│ and data-source choices (offline queue policy, cost truth source).    │
└──────────────────────────────────────────────────────────────────────┘
```

## Global UX + i18n + Germany constraints (applies to all screens)

- **Language**: German default; English available at launch; assume 30–40% text expansion in layouts.
- **Tone**: formal "Sie", factual, no urgency framing, no exclamation marks.
- **Date/time**: Germany formatting (e.g., `Do., 22.01.2026`, `14:30`), time zone Europe/Berlin.
- **Accessibility baseline (BOOK-019)**:
  - Body text ≥ 16 px; headings ≥ 20 px.
  - Tap targets ≥ 48×48 dp (≥ 44 px).
  - High-contrast tokens; color never sole indicator.
  - No time limits/timers in booking flow.
  - Step indicator string shown consistently: `Schritt X von 4`.
- **Persistence**: search criteria, filters, sort, selected doctor, selected slot persist across back/edit and across app restarts until the user clears or resets.

---

## Requirement-by-requirement acceptance criteria (closes all Two-Lane Hybrid P/M)

### BOOK-001 — Specialty search (autocomplete, recents, chips, HNO, DE/EN)

- Autocomplete shows suggestions **after 2+ characters** typed.
- Recent searches list:
  - Max **5** items.
  - Supports clear action: `Verlauf löschen`.
- Chips:
  - Selected specialty shown as removable chip on Results list header.
  - "Not sure" option: `Ich bin nicht sicher` → shows top 6 common specialties + search field.
- German terms:
  - Must support `HNO` as first-class suggestion and in synonyms list.
- DE/EN behavior:
  - English terms (e.g., "ENT") map to German specialty label and show as `HNO (ENT)` in suggestion row.

### BOOK-002 — Location (GPS CTA, autocomplete, saved, display format, 10 km default)

- Location input includes primary CTA: `Aktuellen Standort verwenden`.
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

### BOOK-003 — Insurance filter (prefill, "Nur Kassenärzte", tags, hide private-only, warning)

- Insurance input pre-fills based on profile if available:
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
- Changes apply immediately on close (no extra "apply" step) and persist for session.

### BOOK-005 — Sort (soonest/distance/rating, default soonest, header display, persist)

- Sort control is visible above results.
- Options:
  - `Frühester Termin` (default)
  - `Entfernung`
  - `Bewertung`
- Header shows current sort: `Sortiert nach: Frühester Termin`.
- Sort persists for session (until user resets).

### BOOK-006 — Doctor cards (rating+count, 3 slots, tags, "Mehr Termine", empty states, tap behaviors)

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
- Tap slot pill → opens Confirm sheet (S07) with that slot preselected.
- Tap `Mehr Termine` → opens Slot picker (S06) for same doctor.
- Tap elsewhere on card → opens Doctor profile (S04).

### BOOK-007 — Doctor profile (content sections + persistent CTA)

Profile includes sections:
- Header: photo/avatar, name, specialty, rating+count.
- Address with map preview + `Route öffnen`.
- "Leistungen" (services list).
- "Über die Praxis" (about).
- "Bewertungen" snippet: average + count + 3 recent excerpts with `Mehr lesen`.
- Sticky primary CTA: `Termin auswählen` (always visible).

### BOOK-008 — Full calendar (week swipe, increments, "Heute", durations)

- Week view supports swipe left/right.
- Controls: `Heute`, previous/next week buttons.
- Slot increments: 15 min or 30 min (as available); display duration per slot.
- Availability styling must not rely on color alone (use text/icon + disabled states).

### BOOK-009 — Reviews (PII-safe, truncation, "Mehr lesen", "Alle Bewertungen", sort)

- Reviews surface(s):
  - Snippet on profile; full list on dedicated Reviews screen (S05).
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

### BOOK-011 — Confirm sheet (details + "Grund" 200 chars + cost/price + CTAs incl abbrechen)

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
  - Success screen (S08)
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
  - User selects a new slot in the same slot picker (S06).
  - Only after new booking is confirmed does the system cancel the original (release timing).
- Confirmation messaging:
  - After success, show that updated confirmation is sent (email/push).

### BOOK-018 — Appointment history (12 months, "Erneut buchen", sort)

- `Termine` tab has second segment: `Vergangene Termine`.
- History scope: last **12 months**.
- Sorted: most recent first.
- Each row shows status (e.g., `Erledigt`, `Abgesagt`).
- Row action: `Erneut buchen` → opens same doctor's slot picker (S06).

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
  - Booking is not shown as "confirmed" until server confirmation arrives.
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

---

## "Nächster Termin" Lane-Specific Behaviors (S09 + S10)

The Two-Lane Hybrid's unique "quick book" lane provides an optimized path for users who prioritize speed over choice.

### S09 — "Nächster Termin" mini-step

**Entry point:**
- Tap `Nächster Termin` CTA on home/entry screen (S01).

**UI elements:**
- Header: `Nächster verfügbarer Termin`.
- Specialty field:
  - Same autocomplete behavior as BOOK-001.
  - Pre-fills if user has a recent search.
- Constraint selectors:
  - **Radius**: default 10 km (same as BOOK-002).
    - Adjustable via slider: 5 km / 10 km / 25 km / 50 km.
    - GPS permission request same as standard flow.
  - **Time window**: segmented control with options:
    - `Heute` (today)
    - `Diese Woche` (this week) — **default**
    - `Nächste Woche` (next week)
    - `Egal` (any time)
  - **Insurance filter**: pre-filled from profile (same as BOOK-003).
    - Toggle: `Nur Kassenärzte`.
- Primary CTA: `Optionen anzeigen`.
- Secondary link: `Zur normalen Suche` → navigates to Search (S02).

**Validation:**
- Specialty is required; show inline error if missing: `Bitte Fachgebiet auswählen.`

### S10 — Top 3 options list

**Header:**
- Title: `Nächste verfügbare Termine`.
- Subtitle: `{Fachgebiet} · {Umkreis} km · {Zeitraum}`.

**Card format (each of 3 cards):**
- Doctor name + specialty.
- Distance + time label: `{X,X} km · {Tag}, {Datum} um {Uhrzeit}` (e.g., `2,3 km · Fr., 24.01. um 14:30`).
- Rating + count: `4,6 (128)`.
- Duration + type: `30 min · Vor Ort` or `15 min · Video`.
- Insurance tag: `Kasse` / `Privat` / `Beides`.
- "Why" label (contextual, one of):
  - `Frühester Termin in Ihrer Nähe` (soonest + close).
  - `Nächstgelegener Arzt` (closest).
  - `Bestbewertet in Ihrem Umkreis` (highest rated).

**Tap behaviors:**
- Tap card → opens Confirm sheet (S07) with that slot preselected.
- No "Mehr Termine" on individual cards (user must use "Alle Ergebnisse" to browse).

**Footer link:**
- `Alle Ergebnisse anzeigen ({N} Ärzte)` → opens full Results list (S03) with same filters applied.

**Empty state:**
- If no options match constraints:
  - Message: `Keine Termine in diesem Zeitraum gefunden.`
  - CTA: `Zeitraum erweitern` (returns to S09 with time window expanded).
  - Secondary CTA: `Alle Ergebnisse` (navigates to S03 with broader search).

**Loading state:**
- Skeleton cards (3) while fetching.

**Refresh behavior:**
- Pull-to-refresh updates results.
- If any of the 3 slots become unavailable between load and tap, show BOOK-010 error and auto-refresh list.

---

## UX Interactions — Key Moments by Job

### J1 — Search/Browse (Lane 1)

| User Action | System Response |
|-------------|-----------------|
| Tap "Termin buchen" | Opens Search with last-used specialty/location (if exists) |
| Enter specialty + location + tap "Suchen" | Validates input; shows inline loading + results <2s target |
| Adjust filters | Updates results; keeps scroll position |
| Tap a doctor card | Opens doctor profile (S04) |
| Tap a time slot pill on card | Opens confirm sheet (S07) with that slot |
| Tap "Mehr Termine" | Opens slot picker (S06) for same doctor |

### J2 — "Nächster Termin" Quick Book (Lane 2)

| User Action | System Response |
|-------------|-----------------|
| Tap "Nächster Termin" CTA | Opens mini-step (S09): specialty + constraints |
| Select specialty + constraints + tap "Optionen anzeigen" | Returns top 3 options (S10) with "why" labels |
| Tap one of the top 3 options | Opens confirm sheet (S07) with same detail set as standard flow |
| Tap "Alle Ergebnisse" | Navigates to Results list (S03) with applied filters |

### J3 — Confirm (Clarity gate)

| User Action | System Response |
|-------------|-----------------|
| Review details | Shows: Doctor, specialty, date/time, address, "Für wen", and "Kosten & Versicherung" block |
| Change "Für wen" | Updates patient context; shows eligibility warning if needed |
| Tap "Termin bestätigen" | Real-time availability check → creates booking; shows progress + handles slot-taken fallback |

### J4 — Post-booking management

| User Action | System Response |
|-------------|-----------------|
| Tap "In Kalender speichern" | Opens native calendar picker; pre-fills event + reminders |
| Tap "Route öffnen" | Opens Maps deep link; fallback copy address |
| View "Meine Termine" | Lists upcoming (soonest first); empty state if none |
| Tap "Termin absagen" | Shows policy + confirm dialog; updates status + notifications |
| Tap "Termin verschieben" | Opens same-doctor slots; confirm new time then release old |
| View "Vergangene Termine" | Lists history (12 months, most recent first) with "Erneut buchen" |

---

## Open Decisions / Need Your Input

1. **Offline queuing policy** (BOOK-020): is "queue when offline" allowed for MVP, or should we hard-block? If hard-block, we should update scope/requirement wording.
2. **"Nächster Termin" defaults**: Is `10 km` radius and `Diese Woche` time window acceptable as defaults?
3. **Referrals**: Should we block booking if referral required, or allow booking but show "bring referral" reminder?
4. **Cost/coverage truth source** (BOOK-011): Do we have authoritative pricing/coverage data, or only labels (Kassenleistung/Privatleistung)?
5. **Saved locations source** (BOOK-002): Account-backed (server) vs local-only for MVP?

---

## Verification Checklist

After implementation, verify:

| Requirement | Status |
|-------------|--------|
| BOOK-001 — Specialty search | ☐ |
| BOOK-002 — Location search | ☐ |
| BOOK-003 — Insurance filter | ☐ |
| BOOK-004 — Filters | ☐ |
| BOOK-005 — Sort | ☐ |
| BOOK-006 — Doctor cards | ☐ |
| BOOK-007 — Doctor profile | ☐ |
| BOOK-008 — Full calendar | ☐ |
| BOOK-009 — Reviews | ☐ |
| BOOK-010 — Slot selection | ☐ |
| BOOK-011 — Confirm sheet | ☐ |
| BOOK-012 — Success | ☐ |
| BOOK-013 — Calendar integration | ☐ |
| BOOK-014 — Maps integration | ☐ |
| BOOK-015 — Upcoming appointments | ☐ |
| BOOK-016 — Cancel | ☐ |
| BOOK-017 — Reschedule | ☐ |
| BOOK-018 — Appointment history | ☐ |
| BOOK-019 — Accessibility | ☐ |
| BOOK-020 — Poor connectivity | ☐ |
| BOOK-021 — Book for children | ☐ |
| BOOK-022 — Reminders | ☐ |

Target: All 22 requirements **Covered (C)** with explicit acceptance criteria.

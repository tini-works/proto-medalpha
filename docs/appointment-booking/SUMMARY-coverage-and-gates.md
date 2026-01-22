---
name: summary:appointment-booking-coverage-and-gates
created: 2026-01-22
sources:
  - docs/appointment-booking/requirement-coverage-assisted-vs-wizard.md
  - docs/appointment-booking/GATE-design-goals.md
  - docs/appointment-booking/GATE-UX-checklist-SUMMARY.md
  - docs/appointment-booking/APPOINTMENT-BOOKING-SCOPE.md
---

# Summary — Appointment Booking Coverage & Gates

This file summarizes three documents:
- `docs/appointment-booking/requirement-coverage-assisted-vs-wizard.md`
- `docs/appointment-booking/GATE-design-goals.md`
- `docs/appointment-booking/GATE-UX-checklist-SUMMARY.md`

## Executive takeaways

- The coverage scoring is intentionally strict: designs are mostly **Partial** because they describe macro flow but don’t commit to micro acceptance-criteria details (copy, persistence, exact filter sets, edge cases).
- Under that strict rubric, Assisted Discovery and Guided Wizard both land at **0% strict** and ~**41% weighted**; the Two-Lane Hybrid is slightly higher at ~**43% weighted** because it hints at a few more acceptance details without fully specifying them.
- Gate 4 “FILTER” recommends **building C (Guided Wizard)** first to validate the clarity/confirmation hypothesis with high signal and lower prototype effort than the other options.
- Ethics/Inclusive UX gate results: **C** is the best candidate (pass with notes), **A** is caution (needs transparency + privacy safeguards). For **Two-Lane Hybrid**, the Gate 4b result is **CAUTION 🟡** due to clarity/consent risks around “Nächster Termin” and the need to lock offline booking policy + family/minor guardrails.

## Scope context (APPOINTMENT-BOOKING-SCOPE)

### Entry points (expected)

- Home tab CTA: “Termin buchen”
- Deep link: from Telemedicine summary (e.g., “Book follow-up”)

### Non-functional requirements (V1)

- Performance: search results <2s on 3G; booking confirmation <3s
- Availability: 99.5% uptime for booking API
- Accessibility: WCAG 2.1 AA
- Localization: German primary; English at launch; 14-language roadmap
- Security: booking data encrypted at rest and in transit
- Analytics: track Search → Result → Profile → Book conversion funnel

### Out of scope (V1)

- Guest checkout (non-registered users)
- Multi-appointment booking (series)
- Waitlist (“notify me earlier”)
- Video visit booking (separate Telemedicine feature)

## Requirements coverage — what’s missing (pattern)

Common reasons requirements are not “Covered”:
- Search UX: explicit autocomplete trigger, recents limit, chips, term handling, DE/EN behavior.
- Location UX: GPS CTA + permission handling, saved locations, display format, default radius.
- Filters/sort: exact set, persistence, active count, clear-all, default sort + header display.
- Cards/profile/calendar/reviews: required fields + exact interaction behaviors (especially BOOK-006/008/009).
- Confirm/success: required microcopy, required fields, reminders defaults, toasts, maps fallback copy.
- History: dedicated appointment history flow is missing in multiple designs.

## Matrix sections (kept)

### Requirement Coverage — Summary (BOOK-001 … BOOK-022)

| Approach | Covered (C) | Partial (P) | Missing (M) | Strict coverage | Weighted coverage |
|---|---:|---:|---:|---:|---:|
| Assisted Discovery | 0 | 18 | 4 | 0.0% | 40.9% |
| Guided Wizard | 0 | 18 | 4 | 0.0% | 40.9% |
| Two-Lane Hybrid (“Nächster Termin” CTA) | 0 | 19 | 3 | 0.0% | 43.2% |

### Coverage Matrix (per requirement)

Legend: **C** = Covered, **P** = Partial, **M** = Missing

| ID | Requirement (short) | Assisted Discovery | Guided Wizard | Two-Lane Hybrid (“Nächster Termin” CTA) |
|---|---|---:|---:|---:|
| BOOK-001 | Specialty search (autocomplete, recents, chips, HNO, DE/EN) | P | P | P |
| BOOK-002 | Location search (GPS CTA, autocomplete, saved, 10km default) | P | P | P |
| BOOK-003 | Insurance filter (prefill, “Nur Kassenärzte”, tags, hide private-only, warning) | P | P | P |
| BOOK-004 | Filters (distance/rating/video/languages, persist, count, clear all, live update) | P | P | P |
| BOOK-005 | Sort (soonest/distance/rating, default soonest, header display, persist) | P | M | P |
| BOOK-006 | Doctor cards (rating+count, 3 slots, tags, “Mehr Termine”, empty states, tap behaviors) | M | M | M |
| BOOK-007 | Doctor profile (content sections + persistent CTA) | P | P | P |
| BOOK-008 | Full calendar (week swipe, increments, “Heute”, durations) | P | P | P |
| BOOK-009 | Reviews (PII-safe, truncation, “Mehr lesen”, “Alle Bewertungen”, sort) | M | M | M |
| BOOK-010 | Slot selection (highlight, persist, show time+duration+type, real-time check, exact error copy) | P | P | P |
| BOOK-011 | Confirm sheet (details + “Grund” 200 chars + cost/price + CTAs incl abbrechen) | P | P | P |
| BOOK-012 | Success (checkmark animation, details, confirmation no, calendar/route, email+push) | P | P | P |
| BOOK-013 | Calendar integration details (prefill fields, reminders defaults, toast copy) | P | P | P |
| BOOK-014 | Maps integration details (works from success + details, fallback copy) | P | P | P |
| BOOK-015 | Upcoming appointments (location, fields, sort, details, empty state copy) | P | P | P |
| BOOK-016 | Cancel (labels/copy/policy display + move to history) | P | P | P |
| BOOK-017 | Reschedule (same-doctor calendar, release old slot after new confirm, comms) | P | P | P |
| BOOK-018 | Appointment history (12 months, “Erneut buchen”, sort) | M | M | M |
| BOOK-019 | Accessibility baseline (16pt/48dp/high-contrast/no timers/step indicator string) | M | P | P |
| BOOK-020 | Poor connectivity (cache 5 min, offline indicator, retry, queue confirm offline, skeletons) | P | P | P |
| BOOK-021 | Book for children (selector in confirm sheet, eligibility, tag patient name) | P | P | P |
| BOOK-022 | Reminders (24h + 1h + payload, prefs, email rule) | P | P | P |

### Priority Matrix (Who Benefits Most)

Personas priority (from MEDA-BOOK scope): **Primary** = Sarah, Marc; **Secondary** = Helga, Thomas; **Tertiary** = Elena.

Legend: `⬤` = strong fit for that priority tier; `○` = not a focus.

| Approach | Primary (Sarah+Marc) | Secondary (Helga+Thomas) | Tertiary (Elena) |
|---|---|---|---|
| A Assisted Discovery (AI recommendations) | ⬤ | ⬤ | ○ |
| C Guided Wizard (step-by-step narrowing) | ⬤ | ⬤ | ○ |
| Two-Lane Hybrid (“Nächster Termin” CTA) | ⬤ | ⬤* | ○ |

### Audit Matrix

| Category | A Assisted Discovery | C Guided Wizard | Two-Lane Hybrid (“Nächster Termin” CTA) |
|---|---|---|---|
| Cognitive load | 🟡 | 🟢 | 🟡 |
| Dark pattern check | 🟡 | 🟢 | 🟢 |
| Accessibility (a11y) | 🟡 | 🟢 | 🟡 |
| Inclusion (language, culture) | 🟡 | 🟡 | 🟡 |
| Data privacy | 🔴 | 🟡 | 🟡 |
| User wellbeing | 🟡 | 🟢 | 🟡 |

## “Why” Notes

Short rationale for why each requirement is **Partial** or **Missing** in each design doc.

| ID | Assisted Discovery — why P/M | Guided Wizard — why P/M | Two-Lane Hybrid — why P/M |
|---|---|---|---|
| BOOK-001 | **P:** mentions need/specialty input, but missing explicit 2-char autocomplete trigger, recents max=5, chips, HNO handling, and DE/EN search behavior. | **P:** specialty step exists, but same missing acceptance details (autocomplete, recents, chips, HNO, DE/EN). | **P:** has search concept, but missing explicit 2-char autocomplete trigger, recents max=5, chips, HNO handling, and DE/EN behavior. |
| BOOK-002 | **P:** mentions location/radius and manual entry, but missing explicit “Use current location” CTA+permission, saved locations, display format, default radius 10km. | **P:** location step exists, but same missing details (GPS CTA, saved locations, display format, 10km default). | **P:** implies location/radius constraints, but missing explicit GPS CTA+permission, saved locations, display format, and default 10km. |
| BOOK-003 | **P:** mentions coverage messaging; does not specify the insurance filter toggle label, tags (Kasse/Privat/Beides), hide rules, or no-match warning. | **P:** coverage step exists; missing the required filter/tags/hide/warning behaviors in discovery/results. | **P:** references coverage in confirm, but missing insurance filter toggle label, tags (Kasse/Privat/Beides), hide rules, no-match warning. |
| BOOK-004 | **P:** says “refine/filters” but doesn’t enumerate the exact filter set + persistence + active count + clear-all behavior. | **P:** filtered list implied but filter UI/behavior not specified to acceptance criteria. | **P:** mentions “filter” but doesn’t define required filter set + persistence + active count + clear-all + immediate updates. |
| BOOK-005 | **P:** has “change sort (Soonest/Nearest)” but missing rating sort, default=soonest, header display, session persistence. | **M:** no sorting UX specified. | **P:** implies “Nächster Termin” sorting, but doesn’t enumerate full sort set (soonest/distance/rating), default sort, header display, persistence. |
| BOOK-006 | **M:** doctor card micro-content (rating/count, 3 slots, tags, “Mehr Termine”, “Keine Termine heute”, tap behaviors) not specified. | **M:** same—no doctor card spec matching acceptance criteria. | **M:** results-card requirements (rating+count, 3 slots, tags, “Mehr Termine”, “Keine Termine heute”, tap slot vs tap card) not specified. |
| BOOK-007 | **P:** doctor profile exists but missing required sections (services, reviews snippet, map preview) and “Termin buchen” CTA always visible. | **P:** profile exists but missing required content sections + always-visible CTA. | **P:** doctor profile exists, but missing required content sections + always-visible “Termin buchen” CTA detail. |
| BOOK-008 | **P:** slot picker exists but missing week swipe calendar, increments, “Heute” button, durations, availability styling. | **P:** same missing calendar interaction requirements. | **P:** time selection exists, but missing week swipe, increments, “Heute”, duration display, and availability styling. |
| BOOK-009 | **M:** reviews flow not specified (rating/count, truncation, “Mehr lesen”, “Alle Bewertungen”, no PII). | **M:** same—reviews not specified. | **M:** reviews flow not specified (truncation, “Mehr lesen”, “Alle Bewertungen”, PII guard). |
| BOOK-010 | **P:** mentions slot-taken fallback, but missing “selected slot persists”, slot shows duration/type, exact error copy, and explicit pre-confirm availability check step. | **P:** same—mentions slot-taken but lacks persistence, slot fields, exact error copy and explicit real-time check step. | **P:** includes slot-taken concept, but missing selection persistence, slot field details (time/duration/type), exact error copy, explicit real-time check before confirm. |
| BOOK-011 | **P:** confirm sheet exists but missing required “Grund des Besuchs” (200 chars), explicit “Abbrechen”, and explicit price-or-kassenleistung wording. | **P:** same confirm-sheet missing “Grund” 200 chars, “Abbrechen”, and explicit cost/price requirement. | **P:** confirm sheet exists but missing “Grund des Besuchs” (200 chars), explicit “Abbrechen”, and explicit “Kassenleistung or specific price” behavior. |
| BOOK-012 | **P:** success exists but missing checkmark animation requirement and explicit email+push confirmation statement. | **P:** success exists but missing checkmark animation and explicit email+push confirmation statement. | **P:** success exists but missing checkmark animation requirement and explicit email+push confirmation statement. |
| BOOK-013 | **P:** calendar add exists but missing exact prefill fields, default reminder settings (1 day + 1 hour), explicit iOS/Google Calendar support, and toast copy “Termin hinzugefügt”. | **P:** same missing calendar integration acceptance details (incl. iOS/Google Calendar support). | **P:** calendar add exists but missing required prefill fields, default reminders, explicit iOS/Google Calendar support, and toast copy. |
| BOOK-014 | **P:** maps open exists but doesn’t explicitly say it works from both success and appointment details, with fallback copy address and clipboard-copy behavior. | **P:** same—maps behavior not fully specified to acceptance criteria (incl. clipboard fallback). | **P:** route open exists but doesn’t explicitly commit to “works from success and appointment details” + fallback copy address + clipboard-copy behavior. |
| BOOK-015 | **P:** upcoming list exists but missing explicit IA location, required list fields, sort rule, and exact empty state copy. | **P:** same missing list-field/sort/empty-state details. | **P:** upcoming list exists but missing exact list fields, sort rule, IA placement, and empty state copy. |
| BOOK-016 | **P:** cancel exists but missing exact labels/copy, explicit policy display, success message, and “moved to history” behavior. | **P:** same missing cancel microcopy + move-to-history behavior. | **P:** cancel exists but missing exact label/copy, policy display specifics, success message, and move-to-history behavior. |
| BOOK-017 | **P:** reschedule exists but missing same-doctor calendar requirement, “release old slot after new confirmed”, and updated email/push confirmation. | **P:** same missing reschedule acceptance specifics. | **P:** reschedule exists but missing same-doctor calendar requirement, release timing, and updated email/push. |
| BOOK-018 | **M:** history view not included (needs “Vergangene Termine”, 12 months retention, “Erneut buchen”). | **M:** same—history not included. | **M:** appointment history flow not included. |
| BOOK-019 | **M:** accessibility is referenced generally but doesn’t commit to 16pt/48dp/high-contrast/no timers/step-indicator string. | **P:** mentions step indicator and baseline a11y, but does not explicitly commit to all 16pt/48dp/high-contrast/no timers requirements. | **P:** mentions step indicator and baseline a11y, but doesn’t explicitly commit to all 16pt/48dp/high contrast/no timers requirements. |
| BOOK-020 | **P:** has skeleton/retry, but missing cache 5 minutes, offline indicator, and queue-confirm-offline semantics. | **P:** mentions skeleton/retry and explicitly blocks offline confirm (contradicts queue requirement); missing cache/offline indicator/queue semantics. | **P:** includes skeleton + retry, but explicitly blocks offline booking (contradicts “queue confirm offline”) and misses cache 5 min + offline indicator. |
| BOOK-021 | **P:** mentions “Für wen” selector and guardrail, but doesn’t specify child insurance eligibility check + tagging appointment with patient name, nor the explicit options (“Für mich” / “Für [Child]” from family profiles). | **P:** mentions “Für wen” context, but needs explicit confirm-sheet placement + eligibility check + tagging + explicit options (“Für mich” / “Für [Child]” from family profiles). | **P:** family booking mentioned, but missing child eligibility check + tagging appointment with patient name details + explicit “Für mich”/“Für [Child]” options. |
| BOOK-022 | **P:** reminders mentioned, but missing push payload contents (incl. “Route öffnen” action), preference configuration surface, and “email 24h if verified” rule. | **P:** reminders mentioned, but same missing payload (incl. “Route öffnen” action) + prefs + email rule details. | **P:** reminders mentioned, but missing payload content requirements (incl. “Route öffnen” action), prefs surface, and email rule. |

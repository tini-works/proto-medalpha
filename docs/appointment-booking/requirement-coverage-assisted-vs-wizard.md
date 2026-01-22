---
name: coverage-check
feature: MEDA-BOOK (Appointment Booking / Terminbuchung)
source_of_truth: docs/appointment-booking/appointment-booking-scope.md
designs:
  assisted_discovery: docs/appointment-booking/design-lite-4-design-assisted-discovery.md
  guided_wizard: docs/appointment-booking/design-lite-4-design-guided-wizard.md
created: 2026-01-22
scoring:
  rubric:
    C: "Covered: explicitly specified to meet acceptance criteria"
    P: "Partial: mentioned/implicit but missing required acceptance details"
    M: "Missing: not specified or contradicts the requirement"
  percent:
    strict: "Covered / 22"
    weighted: "(Covered + 0.5*Partial) / 22"
---

# Requirement Coverage — Assisted Discovery vs Guided Wizard

## Summary (BOOK-001 … BOOK-022)

| Approach | Covered (C) | Partial (P) | Missing (M) | Strict coverage | Weighted coverage |
|---|---:|---:|---:|---:|---:|
| Assisted Discovery | 0 | 18 | 4 | 0.0% | 40.9% |
| Guided Wizard | 0 | 18 | 4 | 0.0% | 40.9% |

Notes:
- This scoring is conservative: requirements are marked **Covered** only if the design doc explicitly commits to the acceptance criteria details.
- Both designs currently describe the **macro flow**, but do not encode most **micro-level acceptance criteria** from the scope.

## Coverage Matrix (per requirement)

Legend: **C** = Covered, **P** = Partial, **M** = Missing

| ID | Requirement (short) | Assisted Discovery | Guided Wizard |
|---|---|---:|---:|
| BOOK-001 | Specialty search (autocomplete, recents, chips, HNO, DE/EN) | P | P |
| BOOK-002 | Location search (GPS CTA, autocomplete, saved, 10km default) | P | P |
| BOOK-003 | Insurance filter (prefill, “Nur Kassenärzte”, tags, hide private-only, warning) | P | P |
| BOOK-004 | Filters (distance/rating/video/languages, persist, count, clear all, live update) | P | P |
| BOOK-005 | Sort (soonest/distance/rating, default soonest, header display, persist) | P | M |
| BOOK-006 | Doctor cards (rating+count, 3 slots, tags, “Mehr Termine”, empty states, tap behaviors) | M | M |
| BOOK-007 | Doctor profile (content sections + persistent CTA) | P | P |
| BOOK-008 | Full calendar (week swipe, increments, “Heute”, durations) | P | P |
| BOOK-009 | Reviews (PII-safe, truncation, “Mehr lesen”, “Alle Bewertungen”, sort) | M | M |
| BOOK-010 | Slot selection (highlight, persist, show time+duration+type, real-time check, exact error copy) | P | P |
| BOOK-011 | Confirm sheet (details + “Grund” 200 chars + cost/price + CTAs incl abbrechen) | P | P |
| BOOK-012 | Success (checkmark animation, details, confirmation no, calendar/route, email+push) | P | P |
| BOOK-013 | Calendar integration details (prefill fields, reminders defaults, toast copy) | P | P |
| BOOK-014 | Maps integration details (works from success + details, fallback copy) | P | P |
| BOOK-015 | Upcoming appointments (location, fields, sort, details, empty state copy) | P | P |
| BOOK-016 | Cancel (labels/copy/policy display + move to history) | P | P |
| BOOK-017 | Reschedule (same-doctor calendar, release old slot after new confirm, comms) | P | P |
| BOOK-018 | Appointment history (12 months, “Erneut buchen”, sort) | M | M |
| BOOK-019 | Accessibility baseline (16pt/48dp/high-contrast/no timers/step indicator string) | M | P |
| BOOK-020 | Poor connectivity (cache 5 min, offline indicator, retry, queue confirm offline, skeletons) | P | P |
| BOOK-021 | Book for children (selector in confirm sheet, eligibility, tag patient name) | P | P |
| BOOK-022 | Reminders (24h + 1h + payload, prefs, email rule) | P | P |

## “Why” Notes (for P/M items)

Short rationale for why each requirement is **Partial** or **Missing** in each design doc.

| ID | Assisted Discovery — why P/M | Guided Wizard — why P/M |
|---|---|---|
| BOOK-001 | **P:** mentions need/specialty input, but missing explicit 2-char autocomplete trigger, recents max=5, chips, HNO handling, and DE/EN search behavior. | **P:** specialty step exists, but same missing acceptance details (autocomplete, recents, chips, HNO, DE/EN). |
| BOOK-002 | **P:** mentions location/radius and manual entry, but missing explicit “Use current location” CTA+permission, saved locations, display format, default radius 10km. | **P:** location step exists, but same missing details (GPS CTA, saved locations, display format, 10km default). |
| BOOK-003 | **P:** mentions coverage messaging; does not specify the insurance filter toggle label, tags (Kasse/Privat/Beides), hide rules, or no-match warning. | **P:** coverage step exists; missing the required filter/tags/hide/warning behaviors in discovery/results. |
| BOOK-004 | **P:** says “refine/filters” but doesn’t enumerate the exact filter set + persistence + active count + clear-all behavior. | **P:** filtered list implied but filter UI/behavior not specified to acceptance criteria. |
| BOOK-005 | **P:** has “change sort (Soonest/Nearest)” but missing rating sort, default=soonest, header display, session persistence. | **M:** no sorting UX specified. |
| BOOK-006 | **M:** doctor card micro-content (rating/count, 3 slots, tags, “Mehr Termine”, “Keine Termine heute”, tap behaviors) not specified. | **M:** same—no doctor card spec matching acceptance criteria. |
| BOOK-007 | **P:** doctor profile exists but missing required sections (services, reviews snippet, map preview) and “Termin buchen” CTA always visible. | **P:** profile exists but missing required content sections + always-visible CTA. |
| BOOK-008 | **P:** slot picker exists but missing week swipe calendar, increments, “Heute” button, durations, availability styling. | **P:** same missing calendar interaction requirements. |
| BOOK-009 | **M:** reviews flow not specified (rating/count, truncation, “Mehr lesen”, “Alle Bewertungen”, no PII). | **M:** same—reviews not specified. |
| BOOK-010 | **P:** mentions slot-taken fallback, but missing “selected slot persists”, slot shows duration/type, exact error copy, and explicit pre-confirm availability check step. | **P:** same—mentions slot-taken but lacks persistence, slot fields, exact error copy and explicit real-time check step. |
| BOOK-011 | **P:** confirm sheet exists but missing required “Grund des Besuchs” (200 chars), explicit “Abbrechen”, and explicit price-or-kassenleistung wording. | **P:** same confirm-sheet missing “Grund” 200 chars, “Abbrechen”, and explicit cost/price requirement. |
| BOOK-012 | **P:** success exists but missing checkmark animation requirement and explicit email+push confirmation statement. | **P:** success exists but missing checkmark animation and explicit email+push confirmation statement. |
| BOOK-013 | **P:** calendar add exists but missing exact prefill fields, default reminder settings (1 day + 1 hour), and toast copy “Termin hinzugefügt”. | **P:** same missing calendar integration acceptance details. |
| BOOK-014 | **P:** maps open exists but doesn’t explicitly say it works from both success and appointment details, with fallback copy address. | **P:** same—maps behavior not fully specified to acceptance criteria. |
| BOOK-015 | **P:** upcoming list exists but missing explicit IA location, required list fields, sort rule, and exact empty state copy. | **P:** same missing list-field/sort/empty-state details. |
| BOOK-016 | **P:** cancel exists but missing exact labels/copy, explicit policy display, success message, and “moved to history” behavior. | **P:** same missing cancel microcopy + move-to-history behavior. |
| BOOK-017 | **P:** reschedule exists but missing same-doctor calendar requirement, “release old slot after new confirmed”, and updated email/push confirmation. | **P:** same missing reschedule acceptance specifics. |
| BOOK-018 | **M:** history view not included (needs “Vergangene Termine”, 12 months retention, “Erneut buchen”). | **M:** same—history not included. |
| BOOK-019 | **M:** accessibility is referenced generally but doesn’t commit to 16pt/48dp/high-contrast/no timers/step-indicator string. | **P:** mentions step indicator and baseline a11y, but does not explicitly commit to all 16pt/48dp/high-contrast/no timers requirements. |
| BOOK-020 | **P:** has skeleton/retry, but missing cache 5 minutes, offline indicator, and queue-confirm-offline semantics. | **P:** mentions skeleton/retry and explicitly blocks offline confirm (contradicts queue requirement); missing cache/offline indicator/queue semantics. |
| BOOK-021 | **P:** mentions “Für wen” selector and guardrail, but doesn’t specify child insurance eligibility check + tagging appointment with patient name. | **P:** mentions “Für wen” context, but needs explicit confirm-sheet placement + eligibility check + tagging. |
| BOOK-022 | **P:** reminders mentioned, but missing push payload contents, preference configuration surface, and “email 24h if verified” rule. | **P:** reminders mentioned, but same missing payload + prefs + email rule details. |

## Missing details (what to add to designs to reach “Covered”)

This section lists the most common missing acceptance details that prevent “Covered” status:

- Search UX specifics: recents limit, chips, HNO term support, DE/EN behavior.
- Location UX: explicit GPS CTA + permission flow, saved locations, display format, default 10km radius.
- Insurance filtering: toggle label, tagging scheme, hide/show rules, no-result warning.
- Filters/sort: exact set, persistence, active count, clear-all, default sort + header.
- Doctor cards/profile/calendar/reviews: required fields and behaviors (especially BOOK-006/008/009).
- Confirm sheet: “Grund des Besuchs” (200 chars), cost info including “Kassenleistung or specific price”, explicit “Abbrechen”.
- Success/calendar/maps: required micro-copies and behaviors (toast, reminder defaults, fallback).
- History: dedicated “Vergangene Termine” flow (BOOK-018) is missing entirely in both designs.

# Impact Report — codex-implementation-plan.md

Date: 2026-02-02
Scope: docs/doclibQ/appointment-mgt/codex-implementation-plan.md

## Scope check
- Plan targets UI/UX layering on existing booking + appointment surfaces in apps/docliQ-mobile.
- No backend integration implied; appointment data and statuses appear to be local/demo state in apps/docliQ-mobile/src/state/AppContext.tsx.

## Primary impact areas (likely touchpoints)
- Booking flow (Phase 1): Routes + screens for progressive disclosure in apps/docliQ-mobile/src/routes/paths.ts, apps/docliQ-mobile/src/screens/booking/*, plus booking state in apps/docliQ-mobile/src/state/AppContext.tsx.
- Appointment surfaces (Phase 2): List + detail screens in apps/docliQ-mobile/src/screens/history/HistoryScreen.tsx, apps/docliQ-mobile/src/screens/history/HistoryArchiveScreen.tsx, and canonical detail in apps/docliQ-mobile/src/screens/appointments/AppointmentDetailScreen.tsx.
- Appointment card system (Phase 0): Card components in apps/docliQ-mobile/src/components/cards/AppointmentCard.tsx, apps/docliQ-mobile/src/components/cards/AppointmentListCard.tsx, apps/docliQ-mobile/src/components/cards/AppointmentSummaryCard.tsx, and apps/docliQ-mobile/src/components/cards/SwipeableAppointmentStack.tsx.
- Status/timestamp language: Likely centralize via appointment types + i18n keys in apps/docliQ-mobile/src/types, apps/docliQ-mobile/src/locales/en/*.json, apps/docliQ-mobile/src/locales/de/*.json.
- Feedback entry points (Phase 3): Past appointment views in apps/docliQ-mobile/src/screens/history/HistoryScreen.tsx and apps/docliQ-mobile/src/screens/appointments/AppointmentDetailScreen.tsx, plus settings toggle in apps/docliQ-mobile/src/screens/settings/*.
- Practice change timeline/diff (Phase 4): Appointment detail section in apps/docliQ-mobile/src/screens/appointments/AppointmentDetailScreen.tsx plus new component(s) under apps/docliQ-mobile/src/components/appointments/* or apps/docliQ-mobile/src/components/display/*.
- Offline view-only (Phase 5): Booking CTAs and appointment list/detail behavior in apps/docliQ-mobile/src/screens/home/HomeScreen.tsx, apps/docliQ-mobile/src/screens/booking/*, apps/docliQ-mobile/src/screens/history/HistoryScreen.tsx, and network state logic in apps/docliQ-mobile/src/state/AppContext.tsx (already used in booking confirm).

## Secondary impact areas
- Navigation/header behavior: apps/docliQ-mobile/src/components/layout/Header.tsx for new routes/step flow.
- Toast/sheet patterns: apps/docliQ-mobile/src/components/sheets/* and notifications components for feedback nudges and change banners.
- Tests: Booking + cards tests in apps/docliQ-mobile/src/screens/booking/__tests__/* and apps/docliQ-mobile/src/components/cards/__tests__/AppointmentCard.test.tsx.

## Expected change types
- New/updated appointment status taxonomy and display rules.
- Additional appointment metadata (e.g., change history, lastUpdated/sourceOfTruth flags, feedback state) added to types and demo data.
- New shared components for status display, timestamp microcopy, timeline/diff view, offline banner.

## Risk & regression hotspots
- Status logic: Cards and detail views rely on Appointment["status"] logic in multiple components; changing status values or labels risks inconsistent UI without central mapping.
- Booking flow routing: Progressive disclosure may conflict with existing “doctor-first” or “fast lane” flows if routing/state resets aren’t aligned.
- History vs. appointments: There are two appointment surfaces (history and appointments); canonical detail is in apps/docliQ-mobile/src/screens/appointments/AppointmentDetailScreen.tsx, while history re-exports. Ensure consistency.
- Offline behavior: Disabling CTAs without blocking navigation requires careful gating to avoid broken steps.

## Test impact (recommended)
- Update/add unit tests for appointment card status variants and timestamps: apps/docliQ-mobile/src/components/cards/__tests__/AppointmentCard.test.tsx.
- Booking flow tests for progressive disclosure + validation: apps/docliQ-mobile/src/screens/booking/__tests__/*.
- Golden tests for appointment list/detail interactions if used elsewhere (confirm location before running).

## Open questions / assumptions
- Are status tokens (“Modified by Practice”, “Rejected”, etc.) already represented in Appointment["status"]? If not, requires a controlled mapping layer to avoid breaking existing statuses.
- Should change history be stored on appointment objects or derived from a separate history log?
- Is feedback persistence intended in local state only (demo), or should it integrate with existing data services?

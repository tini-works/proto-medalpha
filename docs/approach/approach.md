# MedAlpha Connect - Prototype Approach (v0.2)

## Goal
Create a mobile app prototype for MedAlpha Connect that visualizes the MVP experience in the requirements doc. The prototype focuses on UI and UX only, with a clear, design-led presentation of the end-to-end happy path.

## Scope (Expanded)
- End-to-end happy path across all required features, including CMS/Admin Web.
- Bilingual UI (DE/EN) with a simple language toggle and clear default.
- Push notification entry points (promos + post-appointment follow-up).
- Warm minimal wellness visual direction inspired by the moodboard.

## Non-Goals
- No production code, backend decisions, or implementation details.
- No deep exploration of external partner UI (Teleclinic, Curaay). Use placeholders where needed.
- No full admin workflows beyond CMS content management essentials.

## Primary User Flows (Happy Path)
1) Splash → onboarding (language) → notification permission.
2) Auth: register/login (email + social) + SSO placeholder.
3) Profile completion gate + profile edit.
4) Home overview with key actions, CMS cards, and content detail.
5) Appointment booking (Curaay) with confirmation + history.
6) Telemedicine entry → Teleclinic session → eRx issued → prescriptions hub.
7) Prescription redemption with explicit legal choice (online vs offline).
8) Online redemption (NFC scan + order status) and offline pharmacy search.
9) Push notifications: promos and post-appointment follow-up (satisfaction + redeem prompt).
10) History details (appointments, prescriptions, telemedicine).
11) Settings: language, notifications, static pages (FAQ, Support, Privacy, Legal).
12) Admin CMS: login + manage Home, FAQ, Support content.

## Key Screens (Expanded)
- Splash / brand intro (white-label ready)
- Language selection or toggle + notification permission
- Login / sign up / SSO placeholder
- Profile completion + profile edit
- Home + content detail (CMS)
- Appointments hub + Curaay booking + confirmation
- Telemedicine entry + Teleclinic WebView
- Prescriptions hub + choose mode (legal requirement)
- Online redemption (NFC scan + order status placeholder)
- Offline pharmacy search + pharmacy detail
- Post-appointment follow-up (push entry)
- History + detail views (appointments, prescriptions, telemedicine)
- Settings: language, notifications
- Static pages: FAQ, Support, Privacy, Legal
- Admin Web: login, dashboard, manage Home/FAQ/Support content

## Visual Direction (Draft)
Warm minimal wellness
- Layout: airy, card-forward surfaces, large rounded rectangles, generous padding.
- Color: warm off-white base, muted orange primary accent, sage/teal secondary accent,
  charcoal text, black primary CTA.
- Typography: friendly geometric sans with strong hierarchy and high legibility.
- Components: pill chips, oversized hero tiles, compact info cards, rounded bottom nav.
- Imagery: clean product shots or soft illustrations, subtle gradients behind cards.
- Motion: gentle page-load fade/slide and staggered card reveals.

## Information Architecture Notes
- Home highlights the two primary features with clear entry points.
- Profile completion gate appears as a blocking step before booking or redemption.
- History aggregates appointments, prescriptions, and telemedicine consultations.
- Push notification flows deep-link into follow-up or promo content.
- Admin Web is a minimal CMS surface aligned to Home/FAQ/Support.

## Localization
- Default UI shown in both DE and EN via a simple toggle.
- Copy will be short and functional. Placeholder text will be used where needed.

## White-Label Considerations
- Design tokens for color, typography, and corner radius to support branded variants.
- Minimal brand assets to keep theme swaps simple.

## Prototype Deliverables
- Figma-style screen set (visual, not implemented code) mapped to the happy path.
- Lightweight interaction map showing how primary screens connect.
- One or two alternate states for key screens (loading, empty, success).
- D2 user flow inventory aligned to sitemap + requirements.

## User Flow Inventory (D2)
- `artifacts/userflow-inventory/first-time-setup.d2`
- `artifacts/userflow-inventory/returning-login-sso.d2`
- `artifacts/userflow-inventory/profile-edit.d2`
- `artifacts/userflow-inventory/appointment-booking.d2`
- `artifacts/userflow-inventory/telemedicine-consult.d2`
- `artifacts/userflow-inventory/rx-online-redemption.d2`
- `artifacts/userflow-inventory/rx-offline-search.d2`
- `artifacts/userflow-inventory/push-notifications.d2`
- `artifacts/userflow-inventory/history-detail.d2`
- `artifacts/userflow-inventory/settings-preferences.d2`
- `artifacts/userflow-inventory/static-pages-access.d2`
- `artifacts/userflow-inventory/admin-cms-content.d2`

## Assumptions
- Teleclinic is a WebView and will be represented by a placeholder screen.
- Curaay booking UI is represented by a placeholder flow with confirmation states.
- Cardlink NFC flow is represented by a simple stepper and confirmation state.
- Admin Web is limited to CMS content management for Home, FAQ, and Support.

## Open Questions (for later)
- Confirm copy tone and final brand direction.
- Confirm specific bilingual content requirements and fallback rules.
- Confirm whether to visualize multi-brand theme switching in the prototype.

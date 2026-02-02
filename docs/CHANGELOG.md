# Changelog

Notable changes, high level.

## 2026-02-02

- **OTP verification (onboarding)**: OTPInput + ResendTimer in @meda/ui; 6-digit input with auto-focus, countdown timer, resend; VerifyScreen wired; auth locales (verify.resend, resendIn, sending) en/de.
- **@meda/ui**: OTPInput (useOTPInput), ResendTimer (useCountdown) exported.
- **SMS phone verification (US 1.1.4)**: VerifyPhoneScreen, phoneVerification mock service; EditProfile phone field + verify button, status badge; profile.phoneVerified/phoneVerifiedAt; paths, AppContext markPhoneVerified; profile locales en/de; US-1.1.4 spec.
- **Docs**: doclibQ → docliQ rename; component-refactor/ (Sheet, OTP plans); US-1.1.4 implementation plan.

## 2026-01-30

- **Sheet component**: Unified `<Sheet>` consolidating 6 bottom sheet implementations; variants (bottom/center/fullscreen), sizes (auto/sm/md/lg/xl); focus trap, escape key, body scroll lock, exit animations; compound components (Sheet.Header/Body/Footer).
- **Sheets migrated**: ConfirmModal, DoctorDetailSheet, EditFamilyMemberSheet, CookieConsentBanner use Sheet internally; FiltersSheet + CancelAppointmentSheet extracted from inline code.
- **Root README**: N1/N2/N3/appointment-v1 → docliQ; Quick Start + Structure + table; single `pnpm dev:docliQ`.
- **docliQ-mobile README**: Features (lines 18–95) condensed to high-level bullets; Component System, Auth, Booking, i18n, Other.
- **OAuth onboarding (mock)**: OAuthConsentScreen (Google/Apple consent + mock user), OAuthErrorScreen, InsuranceRequestScreen (GKV/PKV/Selbstzahler); paths `oauth-consent`, `oauth-error`, `insurance-request`; App routes + WelcomeScreen entry; auth locales (de/en); user types.
- **WelcomeScreen OAuth buttons**: Apple — black pill, white text/icon, no border (Apple HIG); Google — white pill, official colored G icon; both pill-shaped; Tabler IconBrandApple (brand-apple) with stroke.
- **GoogleGIcon**: New UI component — multi-color Google G SVG (brand colors) for sign-in button; exported from `components/ui`.
- **Legal footer**: Privacy/Legal/Terms contrast increased (text-neutral-600, hover charcoal-500).
- **Password management UX**: PasswordField (show/hide toggle), PasswordStrengthIndicator (strength bar + requirements checklist), validatePassword (OWASP); Register/SignIn/ResetPassword wired; auth locales (de/en); US-1.1.3-PASSWORD-MANAGEMENT-UX-SPEC.md.
- **Password components**: PasswordField — native input + label/id (a11y), eye button vertical center; PasswordStrengthIndicator — 4-segment bar, score colors (coral/amber/teal/green), CircleCheck/Circle icons.
- **Docs**: US-1.1.2 OAuth registration spec; US-1.1.3 password management spec (OWASP, GDPR notes).

## 2026-01-29

- **Changelog**: Condensed format (one section per day, fragment bullets).
- **v3 docs**: INFO-MAP-v3 (52 screens, IA diagram, routes, status lifecycle), USER-FLOWS-v3 (J1–J8, 13 flows), scope-index-v3, scope-for-exploration-v3.mdx; originals/v2 → `z.archive/`.
- **DoctorCard**: "Show detail" link center-aligned.
- **Matching**: Configurable mock duration (`config/matching.ts`); all paths → matching appointment → Request Sent → toast on status change; toast queue, Toast inside Router, history dedup by id.
- **Booking**: Shared `useBookingSubmission`; offline banner from i18n; background match cancel on unmount; detail/history i18n namespaces.
- **Matched Doctors**: 44×44px radio tap target.
- **Flows**: Specialty 2-step (no intermediate doctor list); doctor-first 4-step + SymptomsScreen; ResultsScreen unified; symptom state + i18n; plan in `unify-doctor-results-screen.md`.
- **CTAs**: One arrow on Continue (Button rightIcon); Today's Focus "View details" from i18n.
- **Welcome**: Tabler v3 icons (was v1).
- **No-match**: Sets flow before nav (by_specialty / by_doctor). Vite `host: true` for LAN.
- **Cards & sign-out**: Appointment status/chips i18n; ConfirmModal for sign-out (no window.confirm).
- **Vitest**: RTL + JSDOM, test/run/coverage scripts; first tests for cards, header, confirmation, sign-out; tuned config, deterministic order.
- **Formatting**: Locale-aware date/time/number/distance/relative in `utils/format`; sign-in email/password hints (en/de).
- **Docs**: Golden tests proposal (38 stories), GDPR gap analysis (legal pages, cookie banner, P0/P1).

## 2026-01-28

- **i18n**: Auth, profile, home, notifications, settings, booking, news—full en/de; `auth`/`profile`/`home`/`notifications`/`booking` namespaces; localized dates, relationship labels, mock news.
- **Booking**: Type selector (Fast Lane / specialty / doctor), DoctorSearchScreen, Fast Lane + symptom→specialty data; history Upcoming/Others + status chips, archive; booking i18n fix (namespace registered); matching cards redesign + formatDateRelative; confirmation CTAs; Matched Doctors radio left/visible Circle/CircleCheck.
- **Auth**: Forgot password flow (screens, VerifyScreen reuse, routes, i18n), sign-in link, auto Home after reset.
- **UI**: Merge conflicts resolved (6 files); Tabler icons migration (54 files); shared Button (8 variants) replacing ~50 instances; archive icon, mock order.

## 2026-01-27

- **News Feed**: Short Guides, Featured Story, Latest Health News; article detail (hero, markdown, share/save); 6 mock articles; nav preserves tab.
- **Notifications**: Bell + unread dot → Updates (TODAY/YESTERDAY, type cards); appointment notifs → History.
- **Layout**: Avatar left, bell right; Family back respects history; language options disabled (en only); Save Changes position fix.

## 2026-01-26

- **Settings**: Grouped sections, teal icons, iOS toggles; Language (25), Privacy, FAQ, Contact, Help Centre.
- **N3**: Identity step, family detail (Edit/Remove), appointment detail, Today's Focus; route/history fix.

## 2026-01-23

- **Docs**: INFO-MAP Mermaid fix; 60+ screen inventory table.

## 2026-01-21

- **appointment-v1**: 4-step doctor search + insurance filter.
- **@meda/ui**: Primary CTA brand-blue. Mobile: Open Sans bump.

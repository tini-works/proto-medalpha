# Changelog

High-level, business-focused summary of notable changes.

## 2026-01-28 (Continued - Part 6)

### Appointment confirmation CTAs
- Clarified appointment confirmation CTAs so users can easily view all appointments from the confirmation screen with a softer secondary button, keeping “Add to Calendar” as the primary next step.

## 2026-01-28 (Continued - Part 5)

### Booking flow translation rendering fix
- **Root cause**: The `booking` i18n namespace was never registered in the i18n config; only `settings`, `home`, `notifications`, and `appointments` were loaded.
- **Fix**: Added `en/booking.json` and `de/booking.json` to i18n resources and `booking` to the `ns` array so all booking flow screens receive translated strings. i18n config also includes `auth` and `profile` namespaces for full coverage.
- **Impact**: Care Request (Fast Lane), Search, Results, Doctor Profile, Slot Selection, Confirm, Success, and related booking screens now display localized text (e.g. “What do you need?”, “Find an Appointment”, symptom/specialty labels) instead of raw translation keys.

### Matching Appointment Card Redesign
- **Matching status card**: Redesigned appointment cards for "Matching" status to show relevant info when no doctor is assigned yet—displays requested specialty as the title, location preference, and submission timestamp instead of placeholder doctor info.
- **i18n translations for matching cards**: Added English and German translations for matching card labels (Requested Specialty, Submitted, Location).
- **Relative date formatting**: Added `formatDateRelative()` utility for human-friendly date display (Today, Yesterday, X days ago).

### UI Improvements
- **Archive icon**: Changed the history icon on the Appointments screen header to an archive icon for better semantic meaning.
- **Mock data ordering**: Adjusted seed appointment data so the Matching appointment appears as the most recently updated in the Pending section.

## 2026-01-28 (Continued - Part 4)

### Fast-lane booking entry & smarter history
- **Booking type selection screen**: Added new entry screen where users choose how they want to book (Fast Lane, by specialty, by doctor), with clear icons, descriptions, and “coming soon” state for not-yet-available paths.
- **Fast Lane routing**: Wired the new booking type selector into the existing Fast Lane flow (care request, matching status, success/no match screens) so users can jump straight into a guided “describe symptoms, we match a doctor” journey.
- **Symptom-to-specialty matching**: Introduced structured `symptoms` and `specialties` datasets to map common complaints (e.g. headache, skin issue, chest pain) to appropriate specialties, ready to power guided triage and search shortcuts.
- **History screen upgrade**: Redesigned appointment history into “Upcoming” and “Others” sections with status chips (matching, await confirm, cancelled), date grouping, and a floating “Book new appointment” action button that always routes back into booking.
- **Archive view & detail card**: Added `AppointmentListCard` and a richer archive screen so users see a consistent, status-aware view of past appointments derived from both booking state and history items.
- **Product & design docs**: Captured the new booking flow in `(new)design-booking-flow.html` and a product strategy note (`product-strategy-N.md`) to keep UX and roadmap aligned with the implementation.

## 2026-01-28 (Continued - Part 3)

### Forgot Password Flow Implementation
- **Forgot Password screen**: New ForgotPasswordScreen component where users enter their email to initiate password reset via verification code.
- **Email verification for reset**: Reused existing VerifyScreen with new `passwordReset` flow type to maintain consistency with registration verification.
- **Reset password screen**: New ResetPasswordScreen for users to set new password with confirmation, featuring same validation rules as registration (min 8 characters, password match).
- **Sign In integration**: Added "Forgot password?" link below password field on SignInScreen with easy navigation to forgot password flow.
- **i18n support**: Complete English and German translations for all forgot password screens and verification labels, supporting email interpolation in verification messaging.
- **Auth routes**: Added AUTH_FORGOT_PASSWORD and AUTH_RESET_PASSWORD routes with RedirectIfAuthenticated guard to prevent authenticated users from accessing.
- **Flow completion**: Auto sign-in and navigation to Home after successful password reset, maintaining user session after verification.

## 2026-01-28 (Continued - Part 2)

### Merge Conflict Resolution
- **Branch synchronization**: Resolved merge conflicts between local changes and remote branch updates across 6 files in the N3 appointment booking app.
- **Files resolved**: SwipeableAppointmentStack, i18n configuration, AppointmentDetailScreen (appointments and history), HistoryScreen, and NotificationsScreen.
- **Build verification**: Confirmed TypeScript compilation and production build pass after conflict resolution.

### Tabler Icons Library Migration (Phase 2: Complete)
- **Icon migration**: Replaced 130+ inline SVG icons across 54 files with Tabler Icons from `@tabler/icons-react` package, standardizing icon usage across all components and screens.
- **Layout components**: Migrated TabBar (navigation icons), Header (back chevron), and Page (offline indicator) to use Tabler icons.
- **Display components**: Updated EmptyState, Rating, SavedLocations, SpecialtyChips, RecentSearches, and InsuranceBanner with Tabler icons.
- **Card components**: Migrated 8 card types (DoctorCard, AppointmentCard, HistoryCard, etc.) with heart, star, location, and action icons.
- **Screen migration**: Completed icon replacement across all 54+ screens (auth, booking, settings, history, reschedule, assistant, notifications, newsfeed).
- **Quality assurance**: TypeScript compilation passes with zero errors; production build successful (535 KB minified, 145.24 KB gzipped).
- **Icon instances**: 60+ unique Tabler icons implemented across navigation, actions, status indicators, and user interface elements.

### Button Component System & Tabler Icons Integration (Phase 1)
- **Shared Button component**: Created unified `Button` component in N3 with 8 variants (primary, secondary, tertiary, accent, destructive, destructive-filled, icon, link) to replace 50+ hard-coded button implementations across the app.
- **Button component features**: Built-in support for sizes (sm, md, lg), full-width layout, loading state with animated spinner, and left/right icon slots.
- **Button migration**: Replaced ~50 button instances across 40+ files including auth, booking, reschedule, history, profile, and assistant screens with new reusable Button component.
- **Build success**: N3 app compiles cleanly with all type safety checks passing; bundle size 545 KB (minified), 146.8 KB (gzipped).

## 2026-01-28

- **Auth flow German translations**: Complete i18n coverage for all 5 authentication screens (Welcome, Sign In, Register, Verify Email, Verify Identity) with 50+ English/German translation keys including form labels, validation messages, and feature descriptions.
- **Profile section German translations**: Full i18n support for all 4 profile screens (Profile Completion, Family Members, Family Member Detail, Edit Profile) with 80+ translation keys covering form fields, validation, relationships, insurance types, and GDPR consent text.
- **Extended i18n namespace registration**: Updated i18n configuration to include new `auth` and `profile` namespaces alongside existing (settings, home, notifications, booking) for modular, incremental translation support.
- **Dynamic relationship labels**: Implemented context-aware translation for relationship types (child, spouse, parent, other) in FamilyMemberDetailScreen that automatically translate when language preference changes.
- **i18n infrastructure for Home & Notifications**: Extended react-i18next setup to support German translations for HomeScreen and NotificationsScreen via new namespaced translation files (`home.json` and `notifications.json`) in both English and German.
- **HomeScreen German translations**: All UI strings now support German—welcome message, pending appointments section, quick actions (Book Appointment, Family), and Latest Health News section.
- **Notifications screen German translations**: Full translation coverage for Updates screen including tab labels (Notifications / News Feed), date group headers (TODAY / YESTERDAY), Short Guides, Featured Story, and action buttons.
- **News feed component translations**: Updated LatestNewsSection, ShortGuidesSection, FeaturedStoryCard, and TodaysFocusCard to use i18n for all visible text.
- **Localized date formatting**: Enhanced `formatNotificationDate()` utility to support i18n-driven date translations and locale-aware formatting for German (de-DE) and English (en-US).
- **German mock content for News Feed**: Replaced all mock article content with German translations—6 full articles covering AI Symptom Checker, Hypertension, Superfoods, Mindfulness, Walking Benefits, and Annual Checkups, plus Short Guides and Featured Story.
- **Settings screens German translations**: Complete i18n coverage for all 7 Settings sub-screens (Settings, Language, Notifications, Privacy & Data, FAQ, Contact Support, Help Centre) with 82 English/German translation keys covering UI labels, form fields, FAQ items (6 questions/answers), help topics (6 categories), support channel information, and GDPR compliance text. All dynamic content (FAQ accordion items, Help Centre topic grid) now loads from i18n resources.

## 2026-01-27

- **News Feed implementation**: Built complete News Feed tab in Updates screen with Short Guides carousel (horizontal scrolling video cards), Featured Story card with "NEW" badge, and Latest Health News section displaying curated health articles with category badges and read time estimates.
- **Article detail screen**: Created full article reading experience with hero images, author information, rich text content with proper markdown formatting (headings, lists, paragraphs), key takeaway callout boxes, related topics tags, and bottom action bar with Share and Save buttons (visual placeholders).
- **News Feed navigation**: Implemented seamless navigation flow where clicking articles from News Feed opens detail screen, and back button returns to News Feed tab (not Notifications tab), preserving user context with location state management.
- **Mock CMS content**: Added 6 full health articles covering AI Symptom Checker (featured), Hypertension Management, Immunity Superfoods, Mindfulness Practice, Walking Benefits, and Annual Checkups—all with complete content, author profiles, and medical accuracy.
- **UI refinements**: Positioned play icons in top-right of guide cards, added "Load more" button for article pagination, removed unnecessary "View All" links and profile avatar from header, and fixed all image URLs to use working Unsplash healthcare photography.
- **Notifications center**: Added bell icon button to home screen header with unread indicator dot that navigates to a new Updates screen showing grouped notifications (TODAY, YESTERDAY) with type-specific cards for booking updates, cancellations, reminders, security alerts, and family profile changes.
- **Notification actions**: All appointment-related notifications link to Booking History screen for unified appointment management, while non-appointment notifications route to their respective screens (settings, family management).
- **Home screen header layout**: Moved user avatar to left side next to welcome message for improved visual hierarchy and consistency with notification bell icon on the right.
- **Family Members back navigation fix**: Fixed back button in Family Members screen to respect browser history, allowing users to return to their actual previous screen (Home or Settings) instead of always going to Home.
- **Language settings simplification**: Temporarily disabled all language options except English in Language Settings screen, with message indicating more languages coming soon.
- **Language settings layout fix**: Fixed "Save Changes" button positioning by moving flex container inside Page wrapper to properly work with max-width constraint, ensuring button sticks to viewport bottom.

## 2026-01-23

- **Documentation fix**: Fixed Mermaid diagram parse errors in INFO-MAP.md by properly quoting node labels containing special characters (parentheses, ampersands) and correcting edge label syntax.
- **Screen inventory**: Added comprehensive screen inventory table to INFO-MAP.md documenting all 60+ screens across Authentication, Home, Booking, Telemedicine, E-Rezept, Stores, History, Profile, and System sections with standardized IDs and descriptions.

## 2026-01-26

- **Settings screen redesign**: Rebuilt Settings and Notifications screens with grouped menu sections (Profile, Preferences, Privacy, Support), teal-colored icons with circular backgrounds, iOS-style toggle switches for notifications, and restructured Log Out button placement.
- **Language & Privacy modules**: Added Language selection screen with 25 European languages, Privacy & Data screen with encryption status and GDPR compliance info, FAQs, Contact Support, and Help Centre screens—all routed and integrated into settings navigation.
- **Notification preferences refinement**: Updated Notifications screen to show only Appointments and Marketing & News toggles with custom iOS-style switches (overlapping pill-shaped track with circular knob), security banner, and TabBar.
- **N3 identity + profile support**: Added verification identity step, family member detail handling, and related state/types to expand onboarding coverage.
- **Appointments + settings expansion**: Introduced appointment detail views, help/support settings screens, and a Today's Focus card to broaden the N3 surface area.
- **N3 navigation fix**: Aligned route constants and history detail wiring to restore appointment detail navigation and build stability.
- **Family Members detail screen**: Added clickable family member cards that navigate to a dedicated detail screen showing verification status, extended info (emergency contact, medical notes), with Edit (bottom sheet) and Remove actions.

## 2026-01-21

- **Appointment booking v1 prototype**: Added a focused web app (`apps/appointment-v1`) that lets Sarah quickly search for doctors, filter by insurance, and step through a 4-step booking flow.
- **Primary CTA visibility fix**: Updated shared `@meda/ui` buttons so primary actions use the MedAlpha brand-blue color tokens, ensuring bottom CTAs like “Search appointments” and “Confirm booking” stay clearly visible on light card backgrounds.
- **Mobile typography polish**: Bumped the Open Sans font package for the Expo app and aligned related dependencies so the mobile experience uses the intended brand type across iOS, Android, and web.


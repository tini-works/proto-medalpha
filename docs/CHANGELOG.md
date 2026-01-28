# Changelog

High-level, business-focused summary of notable changes.

## 2026-01-28 (Continued)

### Button Component System & Tabler Icons Integration
- **Shared Button component**: Created unified `Button` component in N3 with 8 variants (primary, secondary, tertiary, accent, destructive, destructive-filled, icon, link) to replace 50+ hard-coded button implementations across the app.
- **Button component features**: Built-in support for sizes (sm, md, lg), full-width layout, loading state with animated spinner, and left/right icon slots.
- **Button migration**: Replaced ~50 button instances across 40+ files including auth, booking, reschedule, history, profile, and assistant screens with new reusable Button component.
- **Tabler icons library**: Installed `tabler-icons-react` package for modern, consistent iconography throughout the app (131 SVG icons queued for migration).
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


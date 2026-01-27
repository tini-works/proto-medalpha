# Changelog

High-level, business-focused summary of notable changes.

## 2026-01-27

- **Notifications center**: Added bell icon button to home screen header with unread indicator dot that navigates to a new Updates screen showing grouped notifications (TODAY, YESTERDAY) with type-specific cards for booking updates, cancellations, reminders, security alerts, and family profile changes.
- **Notification actions**: All appointment-related notifications link to Booking History screen for unified appointment management, while non-appointment notifications route to their respective screens (settings, family management).
- **Home screen header layout**: Moved user avatar to left side next to welcome message for improved visual hierarchy and consistency with notification bell icon on the right.

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


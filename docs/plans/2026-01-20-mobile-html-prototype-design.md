# Mobile HTML Prototype Design

## Goal
Render the existing Expo mobile app as separate HTML screens while preserving the current visual system, structure, and UX behaviors for design review.

## Scope
- Full app coverage of all screens under `app/`.
- One HTML file per screen, plus a single index navigator.
- Static content with light interactions only (no backend or real data).

## Visual Direction
- Match current warm wellness theme.
- Use the existing token palette (brand clementine, warm neutrals, sage/sky accents).
- Typography: Manrope with the same size hierarchy.
- Soft cards, rounded corners, diffused shadows.
- Subtle atmospheric background on the index and device frame.

## Information Architecture
- Auth: splash, onboarding, login/register, forgot password, profile completion.
- Tabs: home, appointments, prescriptions, history.
- Settings: menu, profile, edit profile, settings, language, notifications, change password, FAQ, support, privacy, legal.

## Interaction Model (Lightweight)
- Segmented controls for login/register and history filters.
- Accordions for FAQ items.
- Toggle switches for notification preferences.
- Selectable chips/pills for booking steps.
- Static tab bar links for navigation between key screens.

## Components Mapped
- Cards, list rows, badges, chips, inputs, buttons, notices.
- Status bar and tab bar per screen.
- Headers with action buttons when relevant.

## Deliverables
- HTML screens and shared CSS/JS in `previews/mobile-html/`.
- `index.html` acting as the navigator.
- Consistent tokenized styling in `styles.css`.

## Notes
- Content is representative, not live.
- ASCII-only text where possible; real data can be substituted later.

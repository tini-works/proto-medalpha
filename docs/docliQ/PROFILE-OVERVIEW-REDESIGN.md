# Plan: Redesign Settings → Profile Overview Screen

**Status:** Implemented
**Date:** 2026-02-02

## Summary

Redesigned SettingsScreen to match the new "Profile Overview" mockup with improved information architecture, incorporating Critical + Major UX audit fixes (excluding Contact Support and Help Centre button fixes).

---

## Updated Wireframe

```
┌─────────────────────────────────────┐
│  ←        Profile Overview          │
├─────────────────────────────────────┤
│                                     │
│            ┌─────────┐              │
│            │  ┌───┐  │              │
│            │  │ 📷 │  │  ← Edit     │
│            │  └───┘  │    overlay   │
│            └─────────┘              │
│                                     │
│          Max Mustermann             │
│        max@example.com              │
│                                     │
│       ┌──────────────────┐          │
│       │  PUBLIC INSURANCE │ teal    │
│       └──────────────────┘          │
│              OR                     │
│       ┌──────────────────┐          │
│       │ PRIVATE INSURANCE │ coral   │
│       └──────────────────┘          │
│                                     │
├─────────────────────────────────────┤
│  PROFILE INFORMATION                │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 👤  Personal Information      › │ │
│ │     Update your basic details   │ │
│ ├─────────────────────────────────┤ │
│ │ 📍  Address                   › │ │
│ │     Primary residential address │ │
│ ├─────────────────────────────────┤ │
│ │ ✓   Insurance                 › │ │
│ │     Policy details & provider   │ │
│ ├─────────────────────────────────┤ │
│ │ 👥  Family Members            › │ │
│ │     Linked accounts & dependents│ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  SECURITY SETTINGS                  │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔐  Change Password           › │ │
│ │     Last updated 3 months ago   │ │
│ ├─────────────────────────────────┤ │
│ │ 🔷  Biometrics          OFF › │ │  ← Shows ON/OFF + chevron
│ │     FaceID / Fingerprint access │ │
│ ├─────────────────────────────────┤ │
│ │ 🔒  Privacy & Data            › │ │
│ │     Manage data sharing & exports│
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  APP SETTINGS                       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔔  Notifications             › │ │
│ │     Alerts, emails, and SMS     │ │
│ ├─────────────────────────────────┤ │
│ │ 🌐  Language           English› │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│  SUPPORT                            │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ❓  FAQs                      › │ │  ← No description
│ ├─────────────────────────────────┤ │
│ │ 💬  Contact Support           › │ │  ← No description
│ ├─────────────────────────────────┤ │
│ │ 📖  Help Center               › │ │  ← No description
│ └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Log Out               │    │  ← Primary button style
│  └─────────────────────────────┘    │
│                                     │
│        Version 2.4.1                │
│                                     │
├─────────────────────────────────────┤
│  🏠        📅        ⚙️             │
│ Home   Appointments  Settings       │  ← Keep current 3 tabs
└─────────────────────────────────────┘
```

---

## Key Changes Summary

| Item | Change |
|------|--------|
| Log Out button | Primary button style (teal filled) |
| Biometrics | Chevron + "ON/OFF" text (opens placeholder screen) |
| Insurance badge | GKV = teal-500, PKV = coral-500 |
| Support items | Title only, no description text |
| Address edit | New dedicated screen `/settings/address` |
| Insurance edit | New dedicated screen `/settings/insurance` |
| Contact Support | Keep as-is (no `mailto:`/`tel:` fix) |
| Help Centre | Keep as-is (no disabled state fix) |

---

## Files Modified

### Primary
- `src/screens/settings/SettingsScreen.tsx` - Complete restructure
- `src/components/display/Avatar.tsx` - Added edit overlay support (`showEditOverlay`, `onEdit` props)
- `src/locales/en/settings.json` - New section labels + strings
- `src/locales/de/settings.json` - German translations
- `src/routes/paths.ts` - Added new paths

### Secondary (UX fixes)
- `src/screens/settings/PrivacyDataScreen.tsx` - Replace `window.confirm` with ConfirmModal
- `src/screens/settings/LanguageScreen.tsx` - Added success toast
- `src/screens/settings/NotificationsScreen.tsx` - Added save feedback toast

### New Files Created
- `src/screens/settings/ChangePasswordScreen.tsx` - Placeholder screen
- `src/screens/settings/BiometricsScreen.tsx` - Placeholder screen
- `src/screens/settings/AddressEditScreen.tsx` - Address form
- `src/screens/settings/InsuranceEditScreen.tsx` - Insurance form

### State Changes
- `src/types/index.ts` - Added `biometricsEnabled` to preferences
- `src/state/AppContext.tsx` - Added `setBiometricsEnabled` function and updated `usePreferences` hook

---

## New Routes

```ts
SETTINGS_PASSWORD: '/settings/password',
SETTINGS_BIOMETRICS: '/settings/biometrics',
SETTINGS_ADDRESS: '/settings/address',
SETTINGS_INSURANCE: '/settings/insurance',
```

---

## Verification Checklist

1. ✅ **Visual match**: Compare redesigned screen against mockup
2. ✅ **Navigation flows**:
   - Personal Information → EditProfileScreen
   - Address → AddressEditScreen (new)
   - Insurance → InsuranceEditScreen (new)
   - Change Password → ChangePasswordScreen (placeholder)
   - Biometrics → BiometricsScreen (shows ON/OFF)
3. ✅ **Insurance badge**: GKV shows teal, PKV shows coral
4. ✅ **Log Out**: Uses primary button style
5. ✅ **Support section**: No description text on items
6. ✅ **Toasts**: Language change + notification toggle show feedback
7. ✅ **Delete account**: Shows proper ConfirmModal (not browser confirm)
8. ✅ **i18n**: Switch to German, verify all new strings translate
9. ✅ **Accessibility**:
   - Tab through all interactive elements in logical order
   - Verify visible focus rings on all buttons/links
   - Screen reader announces: section headers, item titles, badge text
   - Avatar edit overlay has `aria-label="Edit profile photo"`
   - Biometrics status (ON/OFF) announced by screen reader
   - Delete account button has `aria-describedby` linking to warning text
   - Touch targets minimum 44px
   - Color contrast meets WCAG AA (4.5:1 for text)

---

## Out of Scope (Deferred)

- TabBar changes (keeping 3 tabs)
- Contact Support `mailto:`/`tel:` links
- Help Centre disabled state
- Full password change implementation
- Profile photo upload functionality
- Minor/cosmetic UX audit items

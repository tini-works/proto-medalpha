# SMS Phone Number Verification Implementation Plan

> **User Story:** US 1.1.4
> **Status:** Implemented
> **Date:** 2026-02-02

## Overview

Implement SMS phone verification for docliQ mobile app. Users add phone in profile settings, then verify using 6-digit SMS code. **Mock UI only** - no actual SMS sending.

## Requirements Summary

From [scope-for-exploration-v3 (design).md](../scope-for-exploration-v3%20(design).md):
- 6-digit code, valid 10 minutes
- Resend enabled after 3 minutes wait
- Rate limit: max 3 SMS per number per hour
- International support (+43, +41, +49, etc.)

GDPR considerations from [GDPR-COMPLIANCE-GAP-ANALYSIS.md](./GDPR-COMPLIANCE-GAP-ANALYSIS.md):
- Phone number is personal data - requires consent
- Must be deletable on account deletion
- No plain-text phone in logs

---

## Screen Flow

```
EditProfileScreen
    │
    ├── Phone field (with PhoneInput component)
    │   └── Shows verification status badge
    │
    └── [Verify] button (if phone exists & unverified)
            │
            v
    VerifyPhoneScreen
        ├── "We sent a code to +49 xxx"
        ├── 6-digit OTP input
        ├── Countdown timer (code expires)
        ├── [Resend] button (disabled for 3 min)
        └── Success → back to EditProfileScreen
```

---

## Files Modified

| File | Changes |
|------|---------|
| `apps/docliQ-mobile/src/types/user.ts` | Added `phoneVerified`, `phoneVerifiedAt` fields |
| `apps/docliQ-mobile/src/state/AppContext.tsx` | Added `markPhoneVerified` action |
| `apps/docliQ-mobile/src/routes/paths.ts` | Added `PROFILE_VERIFY_PHONE` path |
| `apps/docliQ-mobile/src/App.tsx` | Added route for VerifyPhoneScreen |
| `apps/docliQ-mobile/src/screens/profile/EditProfileScreen.tsx` | Added PhoneInput, verify button, status badge |
| `apps/docliQ-mobile/src/locales/en/profile.json` | Added verification strings |
| `apps/docliQ-mobile/src/locales/de/profile.json` | Added German translations |

## Files Created

| File | Purpose |
|------|---------|
| `apps/docliQ-mobile/src/services/phoneVerification.ts` | Mock SMS service with rate limiting |
| `apps/docliQ-mobile/src/screens/profile/VerifyPhoneScreen.tsx` | OTP entry screen |

---

## Key Implementation Details

### Mock Phone Verification Service

Located at `apps/docliQ-mobile/src/services/phoneVerification.ts`

Functions:
- `sendVerificationCode(phone, countryCode)` - generates 6-digit code, logs to console
- `verifyCode(phone, code)` - accepts any 6-digit code (demo mode)
- `getResendCooldownMs(phone)` - returns remaining cooldown (3 min)
- `getCodeExpiryMs(phone)` - returns remaining validity (10 min)
- `isValidPhoneNumber(phone)` - validates 6-15 digit format

Rate limiting: In-memory tracking, max 3/hour per number (resets on refresh for demo)

### VerifyPhoneScreen

Uses shared `@meda/ui` components:
- `OTPInput` - 6-digit code input with auto-submit, paste support, accessibility
- `ResendTimer` - 180s countdown with resend callback

### EditProfileScreen Changes

- Replaced simple phone `Field` with `PhoneInput` component (country code selector)
- Added verification status badge (green checkmark when verified)
- Added "Verify" button when phone exists but unverified
- Resets `phoneVerified` to false when phone number changes

---

## Components Reused

| Component | Location | Usage |
|-----------|----------|-------|
| `OTPInput` | `@meda/ui` | 6-digit code input with auto-submit |
| `ResendTimer` | `@meda/ui` | Resend button with countdown |
| `PhoneInput` | `apps/docliQ-mobile/src/components/forms/PhoneInput.tsx` | Country code + phone input |
| `Page`, `Header` | Layout components | Screen structure |
| `Button` | UI component | Actions |

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| Rate limit (3/hour) | Show error, show retry time |
| Resend cooldown (3 min) | Disable button, show countdown |
| Code expired (10 min) | Show error, prompt to resend |
| Invalid code format | Show "Enter complete 6-digit code" |
| Phone changed | Reset phoneVerified to false |
| No phone in nav state | Show error, back button |

---

## Accessibility Features

**Via `OTPInput` component:**
- Auto-focus first digit on mount
- Arrow/Tab navigation between digits
- Paste support (distributes across inputs)
- Backspace navigation
- `role="group"` with `aria-labelledby`
- `aria-label="Digit X of 6"` per input
- `role="alert"` for error messages

**Via `ResendTimer` component:**
- `aria-live="polite"` for countdown updates
- `aria-disabled` state management

---

## Verification Steps

1. Start dev server: `pnpm dev:docliQ`
2. Log in, navigate to Profile → Edit Profile
3. Enter phone number with country code
4. Tap "Verify" → navigates to verification screen
5. Check console for mock SMS code
6. Enter any 6-digit code → verification succeeds
7. Return to Edit Profile → shows verified badge
8. Change phone number → badge disappears, "Verify" button returns
9. Test resend button disabled for 3 minutes
10. Test rate limit after 3 attempts

---

## Design Decisions

1. **Onboarding:** Profile edit only - keep onboarding simple, verify later in settings
2. **Rate limits:** In-memory only - resets on refresh for easier demo/testing
3. **Phone validation:** Basic validation - check 6-15 digits, strip spaces/dashes before verification

---

## Future Enhancements (for production)

1. Integrate with actual SMS gateway (Twilio)
2. Persist rate limits in backend
3. Add expiry countdown timer UI
4. Server-side code validation (not client demo mode)
5. Phone number verification during onboarding (optional)

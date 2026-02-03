# Delete Account Enhancement - Implementation Plan

## Overview

Enhance the Delete Account button on `PrivacyDataScreen` with:
- Warning dialog showing healthcare-specific consequences
- Email confirmation step (mocked)
- 72-hour deletion countdown with persistent banner
- Cancel deletion capability

## User Flow

```
Delete button → Warning dialog → Email confirmation screen →
72h countdown (banner on all screens) → Account deleted
```

User can cancel at any point during the 72h window.

---

## Tasks

### Task 1: Add `pendingDeletion` state to AppContext ✅

**File:** `apps/docliQ-mobile/src/state/AppContext.tsx`

Add to state interface:
```typescript
pendingDeletion: {
  requestedAt: string    // ISO timestamp
  expiresAt: string      // ISO timestamp (requestedAt + 72h)
  email: string          // masked email for display
} | null
```

Add actions:
- `startDeletion(email: string)` - sets pendingDeletion with timestamps
- `cancelDeletion()` - clears pendingDeletion
- `completeDeletion()` - calls resetAll() if expired

Add to `useAppState()` return value.

---

### Task 2: Create `DeleteWarningModal` component ✅

**File:** `apps/docliQ-mobile/src/components/account/DeleteWarningModal.tsx`

Props:
```typescript
interface DeleteWarningModalProps {
  open: boolean
  onCancel: () => void
  onContinue: () => void
}
```

Content:
- Title: "Delete Your Account?"
- Consequences list with ❌ icons:
  - All upcoming appointments will be cancelled
  - Your health records will be permanently deleted
  - Connections with your doctors will be severed
  - This action cannot be undone
- Buttons: "Cancel" (tertiary) / "I Understand, Continue" (destructive)

Use existing `Sheet` component with `variant="center"`.

---

### Task 3: Create `DeleteEmailConfirmScreen` ✅

**File:** `apps/docliQ-mobile/src/screens/settings/DeleteEmailConfirmScreen.tsx`

**Route:** Add to navigation config as `PATHS.SETTINGS_DELETE_EMAIL_CONFIRM`

States:
1. **Initial:** Show email preview + "Send Confirmation Email" button
2. **Sent:** Show "Check your inbox" + mock confirm button

Content:
- Email icon
- Title: "Confirm via Email"
- Masked email display: `j***n@example.com`
- Explanation text about 72h countdown

Mock button: `[DEV: Simulate Email Confirmed]` styled as debug button.

On mock confirm: call `startDeletion()` and navigate back to PrivacyDataScreen.

---

### Task 4: Create `PendingDeletionBanner` component ✅

**File:** `apps/docliQ-mobile/src/components/account/PendingDeletionBanner.tsx`

Props:
```typescript
interface PendingDeletionBannerProps {
  expiresAt: string
  onCancel: () => void
}
```

Design:
- Sticky position below header
- Amber/warning colors (`bg-amber-50 border-amber-200`)
- Warning icon + "Account deletion scheduled"
- Live countdown: "Your account will be deleted in XXh XXm"
- "Cancel Deletion" text button
- Mock skip button: `[DEV: Skip to deletion]`

Use `useEffect` with interval to update countdown.

---

### Task 5: Integrate banner into main layout screens ✅

**Files modified:**
- `apps/docliQ-mobile/src/screens/home/HomeScreen.tsx`
- `apps/docliQ-mobile/src/screens/history/HistoryScreen.tsx`
- `apps/docliQ-mobile/src/screens/settings/SettingsScreen.tsx`

Add at top of each screen (below header):
```tsx
const { pendingDeletion, cancelDeletion } = useAppState()

{pendingDeletion && (
  <PendingDeletionBanner
    expiresAt={pendingDeletion.expiresAt}
    onCancel={() => /* show cancel confirmation */}
  />
)}
```

---

### Task 6: Update `PrivacyDataScreen` to use new flow ✅

**File:** `apps/docliQ-mobile/src/screens/settings/PrivacyDataScreen.tsx`

Changes:
1. Replace `ConfirmModal` with `DeleteWarningModal`
2. On warning continue: navigate to `DeleteEmailConfirmScreen`
3. Show different UI if `pendingDeletion` is active (show status instead of delete button)

---

### Task 7: Add deletion expiry check on app startup ✅

**File:** `apps/docliQ-mobile/src/hooks/useDeletionExpiryCheck.ts`

On mount:
```typescript
useEffect(() => {
  if (pendingDeletion && new Date(pendingDeletion.expiresAt) < new Date()) {
    completeDeletion()
    showToast('Your account has been deleted')
    navigate(PATHS.AUTH_WELCOME)
  }
}, [])
```

---

### Task 8: Add localization strings ✅

**Files:**
- `apps/docliQ-mobile/src/locales/en/legal.json`
- `apps/docliQ-mobile/src/locales/de/legal.json`

New keys:
```json
{
  "deleteWarning": {
    "title": "Delete Your Account?",
    "consequence1": "All upcoming appointments will be cancelled",
    "consequence2": "Your health records will be permanently deleted",
    "consequence3": "Connections with your doctors will be severed",
    "consequence4": "This action cannot be undone",
    "cancel": "Cancel",
    "continue": "I Understand, Continue"
  },
  "deleteEmail": {
    "title": "Confirm via Email",
    "description": "For your security, we'll send a confirmation link to:",
    "explanation": "Click the link in the email to start the 72-hour deletion countdown.",
    "sendButton": "Send Confirmation Email",
    "checkInbox": "Check your inbox",
    "resend": "Resend",
    "mockConfirm": "DEV: Simulate Email Confirmed"
  },
  "deletePending": {
    "title": "Account deletion scheduled",
    "countdown": "Your account will be deleted in {{time}}",
    "cancelButton": "Cancel Deletion",
    "mockSkip": "DEV: Skip to deletion"
  },
  "deleteCancel": {
    "title": "Keep Your Account?",
    "message": "Your account will not be deleted and all your data will remain intact.",
    "keepButton": "Keep My Account",
    "continueButton": "Continue Deletion"
  }
}
```

---

## Files Summary

**New files:**
- `components/account/DeleteWarningModal.tsx`
- `components/account/PendingDeletionBanner.tsx`
- `components/account/index.ts`
- `screens/settings/DeleteEmailConfirmScreen.tsx`
- `hooks/useDeletionExpiryCheck.ts`
- `components/account/__tests__/DeleteWarningModal.test.tsx`
- `components/account/__tests__/PendingDeletionBanner.test.tsx`
- `screens/settings/__tests__/DeleteEmailConfirmScreen.test.tsx`
- `screens/settings/__tests__/PrivacyDataScreen.test.tsx`

**Modified files:**
- `state/AppContext.tsx` - add pendingDeletion state + actions
- `state/storage.ts` - add pendingDeletion persistence
- `screens/settings/PrivacyDataScreen.tsx` - integrate new flow
- `screens/home/HomeScreen.tsx` - add banner
- `screens/history/HistoryScreen.tsx` - add banner
- `screens/settings/SettingsScreen.tsx` - add banner
- `screens/settings/index.ts` - export new screen
- `routes/paths.ts` - add DeleteEmailConfirmScreen route
- `App.tsx` - add route + deletion expiry checker
- `locales/en/legal.json` - new strings
- `locales/de/legal.json` - new strings

---

## Task 9: Write unit tests ✅

**Test framework:** Vitest + @testing-library/react + userEvent (existing pattern)

### Test file: `components/account/__tests__/DeleteWarningModal.test.tsx`
- ✅ Renders with all consequence items visible
- ✅ Calls onCancel when Cancel button clicked
- ✅ Calls onContinue when "I Understand, Continue" clicked
- ✅ Closes on Escape key
- ✅ Closes on backdrop click
- ✅ Has destructive styling on continue button
- ✅ Has proper accessibility attributes
- ✅ Does not render when open is false

### Test file: `components/account/__tests__/PendingDeletionBanner.test.tsx`
- ✅ Renders countdown text with formatted time
- ✅ Calls onCancel when Cancel Deletion clicked
- ✅ DEV skip button visible when onSkipToDeletion provided
- ✅ DEV skip button hidden when not provided
- ✅ Calls onSkipToDeletion when clicked
- ✅ Has alert role for accessibility
- ✅ Formats countdown correctly for less than 1 hour
- ✅ Renders Cancel Deletion button
- ✅ Has correct test id

### Test file: `screens/settings/__tests__/DeleteEmailConfirmScreen.test.tsx`
- ✅ Renders email confirmation UI with masked email
- ✅ Shows "Send Confirmation Email" button initially
- ✅ After clicking Send: shows "Check inbox" + mock confirm button
- ✅ Mock confirm button calls startDeletion and navigates
- ✅ Shows resend button after email is sent

### Test file: `screens/settings/__tests__/PrivacyDataScreen.test.tsx`
- ✅ Delete button opens DeleteWarningModal
- ✅ Shows pending status UI when pendingDeletion is active
- ✅ No delete button shown during pending state
- ✅ Shows PendingDeletionBanner when pendingDeletion is active
- ✅ Cancel deletion button shown in danger zone during pending
- ✅ Navigates to email confirm screen on warning continue

---

## Verification

**Automated tests:**
```bash
pnpm --filter docliQ-mobile test
```

**Manual verification:**

1. **Delete flow test:**
   - Click Delete Account → see warning with consequences
   - Click Continue → navigate to email screen
   - Click Send → see mock confirm button
   - Click mock confirm → return to Privacy screen, see banner

2. **Banner test:**
   - Navigate to Home, History, Settings → banner visible on all
   - Countdown updates (or refreshes on navigation)

3. **Cancel test:**
   - Click Cancel Deletion on banner → see confirmation modal
   - Confirm cancel → banner disappears, back to normal state

4. **Completion test:**
   - Use DEV skip button → state resets, redirects to Welcome
   - Toast shows "Your account has been deleted"

5. **Localization test:**
   - Switch to German → all new strings display correctly

---

## Implementation Status

All tasks completed ✅

- Task 1: Add pendingDeletion state to AppContext ✅
- Task 2: Create DeleteWarningModal component ✅
- Task 3: Create DeleteEmailConfirmScreen ✅
- Task 4: Create PendingDeletionBanner component ✅
- Task 5: Integrate banner into main screens ✅
- Task 6: Update PrivacyDataScreen for new flow ✅
- Task 7: Add deletion expiry check on startup ✅
- Task 8: Add localization strings ✅
- Task 9: Write unit tests ✅

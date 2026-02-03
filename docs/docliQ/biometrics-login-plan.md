# Biometrics Login - Implementation Plan

## Overview

Implement simulated biometric login for Android in the docliQ-mobile web app. Since this is a web app (not native), we mock the Android BiometricPrompt experience with DEV buttons for testing.

## User Flow

```
SETUP (BiometricsScreen):
Toggle ON → biometricsEnabled = true → Success toast

SIGN-IN (SignInScreen):
[If biometricsEnabled] → Show fingerprint button →
Tap → Android-style bottom sheet →
  [DEV: Success] → Sign in → Navigate to Home
  [DEV: Failure] → Shake + error → "Try again" / "Use password"

DISABLE (BiometricsScreen):
Toggle OFF → Confirm modal → biometricsEnabled = false
```

---

## Finite State Machine

```
═══════════════════════════════════════════════════════════════════════
                         SETUP FSM (BiometricsScreen)
═══════════════════════════════════════════════════════════════════════

    ┌──────────────┐
    │   DISABLED   │ ◄─────────────────────────┐
    │  toggle=OFF  │                           │
    └──────┬───────┘                           │
           │ [Toggle ON]                       │
           ▼                                   │
    ┌──────────────┐                           │
    │   ENABLED    │                           │
    │  toggle=ON   │                           │
    │  toast shown │                           │
    └──────┬───────┘                           │
           │ [Toggle OFF]                      │
           ▼                                   │
    ┌──────────────────┐                       │
    │ CONFIRM_DISABLE  │                       │
    │  confirm modal   │                       │
    └──────┬───────────┘                       │
           ├─── [Cancel] ──► ENABLED           │
           └─── [Confirm] ─────────────────────┘


═══════════════════════════════════════════════════════════════════════
                      AUTH FSM (SignInScreen)
═══════════════════════════════════════════════════════════════════════

    ┌───────────────────┐
    │    SIGN_IN_IDLE   │
    │  [Fingerprint btn]│ ◄── visible if biometricsEnabled
    └────────┬──────────┘
             │ [Tap Fingerprint]
             ▼
    ┌───────────────────┐
    │  BIOMETRIC_PROMPT │
    │  bottom sheet     │
    │  DEV: Success/Fail│
    └────────┬──────────┘
             │
             ├─── [Cancel] ──────────────► SIGN_IN_IDLE
             │
             ├─── [DEV: Success] ──► signIn() → Navigate Home
             │
             └─── [DEV: Failure]
                       │
                       ▼
              ┌────────────────┐
              │ BIOMETRIC_ERROR│
              │  shake + error │
              └───────┬────────┘
                      │
                      ├─── [Try again] ──► BIOMETRIC_PROMPT
                      └─── [Use password] ──► SIGN_IN_IDLE (focus input)
```

---

## Implementation Status

**All tasks completed ✅**

**Test Coverage Summary:**
- UI Component Tests: 36 tests
- State Management Tests: 41 tests ⭐ NEW
- **Grand Total: 77 tests**

### Task 1: Create `BiometricPromptSheet` component ✅

**File:** `src/components/biometrics/BiometricPromptSheet.tsx`

```typescript
interface BiometricPromptSheetProps {
  open: boolean
  onCancel: () => void
  onSuccess: () => void
  onFailure: () => void
  error?: string | null
  onRetry?: () => void
  onUsePassword?: () => void
}
```

**Design (Android BiometricPrompt style):**
- Use `Sheet` with `variant="bottom"`
- Header: Fingerprint icon (IconFingerprint from Tabler) with pulse animation
- Title: "Verify your identity"
- Subtitle: "Touch the fingerprint sensor"
- Cancel button (tertiary)
- DEV section: "Simulate Success" (primary) / "Simulate Failure" (destructive)

**Error state (within same sheet):**
- Shake animation on icon (CSS keyframes)
- Red error text: "Fingerprint not recognized"
- "Try again" button
- "Use password instead" link

---

### Task 2: Update `SignInScreen` with biometric option ✅

**File:** `src/screens/auth/SignInScreen.tsx`

**Changes:**
1. Import `usePreferences` to check `biometricsEnabled`
2. Add fingerprint button below password field (only if enabled)
3. Add state for biometric prompt: `showBiometricPrompt`, `biometricError`
4. Handle success: call `signIn()` with stored user email, navigate to Home
5. Handle failure: show error state, offer retry or password fallback

**Fingerprint button design:**
- Icon button with `IconFingerprint`
- Positioned below "Forgot password?" link
- Label: "Sign in with fingerprint"
- Teal accent color

---

### Task 3: Update `BiometricsScreen` for functional toggle ✅

**File:** `src/screens/settings/BiometricsScreen.tsx`

**Changes:**
1. Remove "Coming soon" toast
2. On toggle ON: immediately call `setBiometricsEnabled(true)`, show success toast
3. On toggle OFF: show confirmation modal first
4. Add `ConfirmModal` for disable confirmation

**Confirmation modal content:**
- Title: "Disable Biometrics?"
- Message: "You'll need to use your password to sign in."
- Buttons: "Cancel" / "Disable"

---

### Task 4: Add biometrics state for "remembered" user ✅

**Files:**
- `src/state/AppContext.tsx`
- `src/state/storage.ts`

For biometric sign-in to work, we need to "remember" who enabled it:

```typescript
// Add to ExtendedState
biometricUserId: string | null  // email of user who enabled biometrics
```

**Actions:**
- `enableBiometrics()`: sets `biometricsEnabled=true`, stores current user email
- `disableBiometrics()`: sets `biometricsEnabled=false`, clears `biometricUserId`

**Storage:** Persist `biometricUserId` alongside preferences.

---

### Task 5: Add index export for biometrics components ✅

**File:** `src/components/biometrics/index.ts`

```typescript
export { BiometricPromptSheet } from './BiometricPromptSheet'
export type { BiometricPromptSheetProps } from './BiometricPromptSheet'
```

---

### Task 6: Add localization strings ✅

**Files:**
- `src/locales/en/settings.json`
- `src/locales/de/settings.json`

**New keys:**
```json
{
  "biometricPrompt": {
    "title": "Verify your identity",
    "subtitle": "Touch the fingerprint sensor",
    "cancel": "Cancel",
    "mockSuccess": "DEV: Simulate Success",
    "mockFailure": "DEV: Simulate Failure",
    "errorNotRecognized": "Fingerprint not recognized",
    "tryAgain": "Try again",
    "usePassword": "Use password instead"
  },
  "biometricSetup": {
    "enabledToast": "Biometrics enabled",
    "disabledToast": "Biometrics disabled",
    "disableTitle": "Disable Biometrics?",
    "disableMessage": "You'll need to use your password to sign in.",
    "disableConfirm": "Disable"
  },
  "signInWithFingerprint": "Sign in with fingerprint"
}
```

---

### Task 7: Write unit tests ✅

**Test files:**
- `src/components/biometrics/__tests__/BiometricPromptSheet.test.tsx` (15 tests)
- `src/screens/auth/__tests__/SignInScreen.biometrics.test.tsx` (11 tests)
- `src/screens/settings/__tests__/BiometricsScreen.test.tsx` (10 tests)

**BiometricPromptSheet tests:**
- ✅ Renders with fingerprint icon and title
- ✅ Calls onCancel when Cancel clicked
- ✅ Calls onSuccess when DEV Success clicked
- ✅ Shows error state with shake animation when error prop set
- ✅ Calls onRetry when Try again clicked
- ✅ Calls onUsePassword when Use password clicked
- ✅ Has correct accessibility attributes (role="dialog", aria-label)
- ✅ Does not render when open is false

**SignInScreen biometrics tests:**
- ✅ Fingerprint button hidden when biometricsEnabled=false
- ✅ Fingerprint button visible when biometricsEnabled=true
- ✅ Opens BiometricPromptSheet on fingerprint tap
- ✅ Signs in on DEV Success and navigates to Home
- ✅ Shows error state on DEV Failure
- ✅ Focuses password field on "Use password"
- ✅ Fingerprint button has accessible label

**BiometricsScreen tests:**
- ✅ Toggle enables biometrics immediately
- ✅ Shows success toast when enabled
- ✅ Toggle OFF shows confirmation modal
- ✅ Confirm disables biometrics and shows toast
- ✅ Cancel keeps biometrics enabled
- ✅ Status badge reflects current state

---

### Task 8: State Management Tests ✅

**Test files:**
- `src/state/__tests__/storage.test.ts` (25 tests) ⭐ NEW
- `src/state/__tests__/AppContext.biometrics.test.tsx` (16 tests) ⭐ NEW

**storage.test.ts:**
- ✅ Returns userId when present in localStorage
- ✅ Returns null when no userId in localStorage
- ✅ Returns null when localStorage throws
- ✅ Returns null in Safari private browsing mode
- ✅ Saves userId to localStorage when provided
- ✅ Removes key from localStorage when userId is null
- ✅ Silently handles localStorage quota exceeded error
- ✅ Silently handles localStorage private mode error
- ✅ Handles empty string userId by saving it
- ✅ Handles special characters in email
- ✅ Handles very long email addresses
- ✅ Integration: save and load cycle
- ✅ Integration: cleared userId returns null when loaded
- ✅ Integration: overwrites previous userId with new one

**AppContext.biometrics.test.tsx:**
- ✅ Sets biometricsEnabled to true in preferences
- ✅ Saves current user email to storage
- ✅ Sets biometricUserId in extended state
- ✅ Syncs state and storage atomically
- ✅ Uses current profile email when user is authenticated
- ✅ Sets biometricsEnabled to false in preferences (disable)
- ✅ Clears biometricUserId from storage (disable)
- ✅ Clears biometricUserId from extended state (disable)
- ✅ Handles disable when already disabled gracefully
- ✅ Complete enable then disable cycle
- ✅ Handles rapid enable/disable toggling
- ✅ setBiometricsEnabled direct setter updates preference without touching storage
- ✅ Loads biometricUserId from storage on mount
- ✅ Handles storage save failure silently
- ✅ Handles storage clear failure silently
- ✅ Uses empty string if email somehow missing

---

## Files Summary

**New files:**
- `src/components/biometrics/BiometricPromptSheet.tsx`
- `src/components/biometrics/index.ts`
- `src/components/biometrics/__tests__/BiometricPromptSheet.test.tsx` (15 tests)
- `src/screens/auth/__tests__/SignInScreen.biometrics.test.tsx` (11 tests)
- `src/screens/settings/__tests__/BiometricsScreen.test.tsx` (10 tests)
- `src/state/__tests__/storage.test.ts` (25 tests) ⭐ NEW
- `src/state/__tests__/AppContext.biometrics.test.tsx` (16 tests) ⭐ NEW
- `src/hooks/useOnlineStatus.ts`

**Modified files:**
- `src/screens/auth/SignInScreen.tsx` - add fingerprint button + prompt
- `src/screens/settings/BiometricsScreen.tsx` - make functional
- `src/state/AppContext.tsx` - add biometricUserId + actions
- `src/state/storage.ts` - persist biometricUserId
- `src/test/setup.ts` - add window.scrollTo mock ⭐ NEW
- `src/locales/en/settings.json` - new strings
- `src/locales/de/settings.json` - new strings
- `src/components/forms/PasswordField.tsx` - add forwardRef support
- `src/components/ui/Button.tsx` - add testId prop
- `tailwind.config.ts` - add pulse-gentle and shake animations

---

## Verification

### Automated Tests

**Run all tests:**
```bash
pnpm --filter docliQ-mobile test
```

**Run all biometrics tests:**
```bash
pnpm exec vitest run --reporter=verbose \
  src/components/biometrics \
  src/screens/settings/__tests__/BiometricsScreen.test.tsx \
  src/screens/auth/__tests__/SignInScreen.biometrics.test.tsx \
  src/state/__tests__/storage.test.ts \
  src/state/__tests__/AppContext.biometrics.test.tsx
```

**Test counts:**
- BiometricPromptSheet: 15 tests
- SignInScreen biometrics: 11 tests
- BiometricsScreen: 10 tests
- storage.ts: 25 tests ⭐ NEW
- AppContext biometrics: 16 tests ⭐ NEW
- **Total: 77 biometrics tests** (was 36)

### Manual Verification Checklist

**1. Enable biometrics:**
- [ ] Go to Settings → Security → Biometrics
- [ ] Toggle ON → toast "Biometrics enabled"
- [ ] Status shows "ON"
- [ ] Refresh page → Status still shows "ON" (persistence)

**2. Sign in with biometrics:**
- [ ] Sign out → Go to Sign In screen
- [ ] See fingerprint button below password field
- [ ] Tap → Android-style bottom sheet slides up from bottom
- [ ] Sheet shows fingerprint icon with pulse animation
- [ ] Sheet shows "Verify your identity" title
- [ ] Click "DEV: Simulate Success" → Signs in, navigates to Home

**3. Biometric failure:**
- [ ] Sign out → Tap fingerprint button
- [ ] Click "DEV: Simulate Failure" → Icon shakes with animation
- [ ] Error message "Fingerprint not recognized" appears
- [ ] Click "Try again" → Error clears, back to prompt state
- [ ] Click "DEV: Simulate Failure" again
- [ ] Click "Use password instead" → Sheet closes
- [ ] Password field is focused
- [ ] Can sign in with email/password

**4. Disable biometrics:**
- [ ] Settings → Biometrics → Toggle OFF
- [ ] Confirmation modal "Disable Biometrics?" appears
- [ ] Click "Cancel" → Modal closes, still enabled
- [ ] Toggle OFF again → Click "Disable"
- [ ] Toast "Biometrics disabled" appears
- [ ] Status shows "OFF"
- [ ] Sign out → No fingerprint button on sign-in

**5. Edge cases:**
- [ ] Cancel button on biometric prompt closes sheet
- [ ] Biometric preference survives page reload
- [ ] Biometric state cleared properly on explicit disable

**6. Localization:**
- [ ] Switch to German in Settings
- [ ] All biometric strings show German translations
- [ ] Prompt title: "Identität bestätigen"
- [ ] Error message in German

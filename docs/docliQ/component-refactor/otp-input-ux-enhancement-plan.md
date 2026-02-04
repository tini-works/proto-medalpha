# OTPInput UX Enhancement Implementation Plan

## Summary

Addresses all UX audit findings from the OTP input implementation. Issues prioritized by severity; implementation order considers dependencies.

**Current implementation:** Components work correctly but lack visual feedback during auto-submit, have unused submit button, and hardcoded English a11y labels.

---

## Priority 1: Critical UX Fixes (Severity 3)

### 1.1 Add "Verifying..." Visual State During Auto-Submit Delay
**Impact: HIGH | Effort: LOW | ~15 min**

**Problem:** No visual feedback during 300ms auto-submit delay leaves users uncertain.

**Files:**
- `packages/ui/src/OTPInput/useOTPInput.ts`
- `packages/ui/src/OTPInput/OTPInput.tsx`

**Changes to useOTPInput.ts:**
```ts
// Add state
const [isVerifying, setIsVerifying] = useState(false)

// In setDigit/handlePaste, when scheduling auto-submit:
if (autoSubmitDelay > 0) {
  setIsVerifying(true)
  submitTimerRef.current = setTimeout(() => {
    setIsVerifying(false)
    if (!disabled) onComplete?.(code)
  }, autoSubmitDelay)
}

// Return: { ...existing, isVerifying }
```

**Changes to OTPInput.tsx:**
```tsx
// Add verifying indicator after inputs
{isVerifying && (
  <div className="flex justify-center items-center gap-2 mt-2" aria-live="polite">
    <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-sm text-neutral-500">{verifyingLabel ?? 'Verifying...'}</span>
  </div>
)}
```

**Breaking changes:** None - new optional state

---

### 1.2 Remove Submit Button in VerifyScreen
**Impact: HIGH | Effort: LOW | ~5 min**

**Problem:** Submit button does nothing with auto-submit, confuses users.

**File:** `apps/docliQ-mobile/src/screens/auth/VerifyScreen.tsx`

**Change:** Delete lines 99-101 (Button component)
```diff
-        <Button variant="primary" fullWidth type="submit" loading={isSubmitting}>
-          {t('verify.submit')}
-        </Button>
```

**Rationale:** Auto-submit handles submission. Button adds cognitive load without function.

---

### 1.3 Stronger Visual Differentiation for Filled Inputs
**Impact: MEDIUM | Effort: LOW | ~5 min**

**Problem:** Filled (border-neutral-400) and empty (border-neutral-300) inputs nearly identical.

**File:** `packages/ui/src/OTPInput/OTPInput.tsx`

**Change line 141-142:**
```diff
  if (digit) {
-   return 'border-neutral-400 bg-neutral-50 focus:ring-primary-500 focus:border-primary-500'
+   return 'border-primary-500 bg-primary-50 focus:ring-primary-500 focus:border-primary-500'
  }
```

**Result:** Filled = blue border/bg, Empty = gray border - clear visual progress.

---

## Priority 2: Accessibility Fixes (Severity 2-3)

### 2.1 Internationalize Accessibility Labels
**Impact: MEDIUM | Effort: MEDIUM | ~20 min**

**Problem:** Hard-coded English: "Verification code input", "Digit X of Y"

**Files:**
- `packages/ui/src/OTPInput/OTPInput.tsx`
- `apps/docliQ-mobile/src/locales/en/auth.json`
- `apps/docliQ-mobile/src/locales/de/auth.json`

**Add props to OTPInputProps:**
```ts
/** Screen reader label for input group */
groupLabel?: string
/** Pattern for digit labels - use {{index}} and {{total}} */
digitLabel?: string
/** Label for verifying state */
verifyingLabel?: string
```

**Update OTPInput.tsx:**
```tsx
<span id={groupId} className="sr-only">
  {groupLabel ?? 'Verification code input'}
</span>

// For each input:
aria-label={
  digitLabel
    ?.replace('{{index}}', String(index + 1))
    .replace('{{total}}', String(length))
  ?? `Digit ${index + 1} of ${length}`
}
```

**Add to en/auth.json:**
```json
"verify": {
  "a11y": {
    "groupLabel": "Verification code input",
    "digitLabel": "Digit {{index}} of {{total}}",
    "verifyingLabel": "Verifying code..."
  }
}
```

**Add to de/auth.json:**
```json
"verify": {
  "a11y": {
    "groupLabel": "Eingabe des Bestätigungscodes",
    "digitLabel": "Ziffer {{index}} von {{total}}",
    "verifyingLabel": "Code wird überprüft..."
  }
}
```

---

### 2.2 Add Completion Announcement for Screen Readers
**Impact: MEDIUM | Effort: LOW | ~10 min**

**File:** `packages/ui/src/OTPInput/OTPInput.tsx`

**Add aria-live region:**
```tsx
<div aria-live="assertive" className="sr-only">
  {isVerifying && (verifyingLabel ?? 'Verifying...')}
</div>
```

**Dependency:** Task 1.1 (isVerifying state)

---

## Priority 3: UX Improvements (Severity 2)

### 3.1 ResendTimer: Allow Immediate First Resend
**Impact: MEDIUM | Effort: LOW | ~10 min**

**Problem:** 60s countdown starts immediately - user must wait even on first attempt.

**Files:**
- `packages/ui/src/ResendTimer/useCountdown.ts`
- `packages/ui/src/ResendTimer/ResendTimer.tsx`

**Add to useCountdown.ts:**
```ts
interface UseCountdownOptions {
  initialSeconds: number
  startComplete?: boolean  // NEW
}

export function useCountdown({ initialSeconds, startComplete = false }) {
  const [secondsLeft, setSecondsLeft] = useState(startComplete ? 0 : initialSeconds)
  // ...rest unchanged
}
```

**Add to ResendTimerProps:**
```ts
/** Start with timer at 0 (first resend available immediately) */
startEnabled?: boolean
```

**Consumer usage:**
```tsx
<ResendTimer startEnabled={true} initialSeconds={60} ... />
```

---

### 3.2 Increase Touch Target Size
**Impact: LOW | Effort: LOW | ~5 min**

**Problem:** 48px × 56px meets minimum but larger improves mobile UX.

**File:** `packages/ui/src/OTPInput/OTPInput.tsx`

**Change line 131-132:**
```diff
  const inputBaseStyles = `
-   w-12 h-14 text-center text-xl font-semibold rounded-lg border
+   w-14 h-16 text-center text-xl font-semibold rounded-lg border
```

**Result:** 56px × 64px - more comfortable touch targets.

**Risk:** May affect layout on very small screens - test required.

---

### 3.3 Add Progress Indicator (Screen Reader Only)
**Impact: LOW | Effort: LOW | ~10 min**

**File:** `packages/ui/src/OTPInput/OTPInput.tsx`

**Add live region for progress:**
```tsx
const filledCount = digits.filter(d => d !== '').length

<div aria-live="polite" className="sr-only">
  {filledCount > 0 && filledCount < length &&
    `${filledCount} of ${length} digits entered`
  }
</div>
```

**Rationale:** Screen reader feedback without visual clutter.

---

## Priority 4: Polish (Severity 1)

### 4.1 Add Visual Completion Animation
**Impact: LOW | Effort: MEDIUM | ~15 min**

**Problem:** No celebratory feedback when all digits entered.

**Files:**
- `packages/ui/src/OTPInput/useOTPInput.ts`
- `packages/ui/src/OTPInput/OTPInput.tsx`

**Add to useOTPInput.ts:**
```ts
const [showComplete, setShowComplete] = useState(false)

// When complete, before auto-submit timer:
setShowComplete(true)
if (autoSubmitDelay > 0) {
  submitTimerRef.current = setTimeout(() => {
    setShowComplete(false)
    setIsVerifying(true)
    // ... rest of auto-submit
  }, 200) // Brief pause for animation
}
```

**Add to OTPInput.tsx styling:**
```tsx
const getInputStyles = (digit: string) => {
  if (showComplete) {
    return 'border-success-500 bg-success-50 focus:ring-success-500'
  }
  // ... rest unchanged
}
```

**Timing:** 200ms green pulse → 300ms verifying spinner → submit

---

## Implementation Order

| # | Task | Files | Time | Dependency |
|---|------|-------|------|------------|
| 1 | Verifying state | useOTPInput.ts, OTPInput.tsx | 15m | — |
| 2 | Remove submit button | VerifyScreen.tsx | 5m | — |
| 3 | Filled input styling | OTPInput.tsx | 5m | — |
| 4 | i18n a11y labels | OTPInput.tsx, en/de.json | 20m | — |
| 5 | Completion announcement | OTPInput.tsx | 10m | Task 1 |
| 6 | ResendTimer startEnabled | useCountdown.ts, ResendTimer.tsx | 10m | — |
| 7 | Touch target size | OTPInput.tsx | 5m | — |
| 8 | Progress indicator | OTPInput.tsx | 10m | — |
| 9 | Completion animation | OTPInput.tsx | 15m | Task 1 |

**Total:** ~1.5 hours

---

## Files to Modify

| File | Changes |
|------|---------|
| `packages/ui/src/OTPInput/useOTPInput.ts` | Add `isVerifying` state |
| `packages/ui/src/OTPInput/OTPInput.tsx` | Verifying UI, styling, a11y props, touch size |
| `packages/ui/src/ResendTimer/useCountdown.ts` | Add `startComplete` option |
| `packages/ui/src/ResendTimer/ResendTimer.tsx` | Add `startEnabled` prop |
| `apps/docliQ-mobile/src/screens/auth/VerifyScreen.tsx` | Remove button, add a11y props |
| `apps/docliQ-mobile/src/locales/en/auth.json` | Add a11y keys |
| `apps/docliQ-mobile/src/locales/de/auth.json` | Add a11y keys |

---

## Verification Plan

1. **Build:** `pnpm build:packages`
2. **Start:** `pnpm dev:docliQ`
3. **Test verifying state:**
   - Type 6 digits → spinner appears → navigates after 300ms
4. **Test visual feedback:**
   - Filled inputs: blue border + light blue bg
   - Empty inputs: gray border
5. **Test screen reader (VoiceOver/NVDA):**
   - Reads localized group label
   - Announces digit position on focus
   - Announces "Verifying..." on completion
6. **Test ResendTimer:**
   - `startEnabled={true}` → button enabled immediately
   - After click → countdown starts
7. **Test mobile:**
   - Touch targets feel responsive
   - No layout issues on iPhone SE width (320px)

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Submit button | **Remove entirely** - auto-submit is sufficient |
| Touch target size | **Increase to 56px** - better mobile UX |
| Completion animation | **Yes** - add green pulse before verifying state |

---

## Final Task List

All 9 tasks will be implemented:
1. Verifying state (Priority 1)
2. Remove submit button (Priority 1)
3. Filled input styling (Priority 1)
4. i18n a11y labels (Priority 2)
5. Completion announcement (Priority 2)
6. ResendTimer startEnabled (Priority 3)
7. Touch target size → 56px (Priority 3)
8. Progress indicator (Priority 3)
9. Completion animation (Priority 4)

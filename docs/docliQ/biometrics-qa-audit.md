# QA Audit: Biometrics Settings Flow

**Date:** 2026-02-03
**Scope:** Biometrics login feature in docliQ-mobile
**Test Files Reviewed:**
- `src/components/biometrics/__tests__/BiometricPromptSheet.test.tsx`
- `src/screens/settings/__tests__/BiometricsScreen.test.tsx`
- `src/screens/auth/__tests__/SignInScreen.biometrics.test.tsx`

---

## Health Score: 7/10

---

## Strengths

1. **Good test coverage for UI components** (36 tests total)
   - BiometricPromptSheet: 15 tests covering rendering, interactions, error states
   - BiometricsScreen: 10 tests covering toggle, confirmation modal, toasts
   - SignInScreen biometrics: 11 tests covering visibility, prompt flow, fallback

2. **Clear test naming** - Tests describe behavior well
   - `'shows confirmation modal when toggle turned OFF'`
   - `'signs in and navigates to Home on DEV Success'`
   - `'clears error and retries on Try again'`

3. **Proper test isolation** - Each test file:
   - Uses `beforeEach` to reset mocks
   - Uses `afterEach` to clean up DOM state (scroll lock styles)
   - Mocks dependencies appropriately

4. **Accessibility tested** - Tests verify:
   - `role="switch"` for toggle (`BiometricsScreen.test.tsx:95`)
   - `aria-label` for fingerprint button (`SignInScreen.biometrics.test.tsx:136`)
   - `role="dialog"` for prompt sheet (`BiometricPromptSheet.test.tsx:73`)

5. **Fast execution** - 36 tests run in ~7 seconds

---

## Critical Issues

None - core functionality is well tested.

---

## High Priority (Fix Soon)

### 1. No storage/persistence tests

- **Files:** `src/state/storage.ts` (lines 67-93) untested
- **Impact:** `loadBiometricUserId`, `saveBiometricUserId`, `clearBiometricUserId` have no unit tests
- **Risk:** Storage bugs (quota exceeded, private browsing) could silently fail
- **Fix:** Add unit tests for storage functions with mocked localStorage

### 2. No AppContext integration tests for biometrics

- **File:** `src/state/AppContext.tsx` (lines 611-621)
- **Impact:** `enableBiometrics()` and `disableBiometrics()` actions not tested for:
  - Syncing state to localStorage
  - Updating both `biometricUserId` and `biometricsEnabled` atomically
- **Fix:** Add integration tests verifying state + storage sync

### 3. Console warning: act() wrapping missing

- **Location:** Test output shows React `act()` warnings
- **Impact:** Tests may have race conditions with state updates
- **Fix:** Wrap async state updates in `act()` or use `waitFor` more consistently

---

## Medium Priority (Improve Over Time)

### 1. Missing edge case tests

- biometricUserId null after enabling (corrupted state)
- localStorage quota exceeded scenario
- Concurrent enable/disable rapid toggling
- Multiple tabs with different biometric state

### 2. No E2E/integration tests for full flow

- Setup flow: Settings → Enable → Sign out → Sign in with fingerprint
- Disable flow: Settings → Disable → Confirm → Sign out → No fingerprint button
- State persistence across page reloads

### 3. jsdom warnings polluting output

- `Error: Not implemented: window.scrollTo`
- **Fix:** Mock `window.scrollTo` in test setup file

---

## Coverage Gaps

| Area | Tested | Missing | Priority |
|------|--------|---------|----------|
| BiometricPromptSheet UI | ✅ | - | Done |
| BiometricsScreen toggle | ✅ | - | Done |
| SignInScreen fingerprint | ✅ | - | Done |
| storage.ts functions | ❌ | All 3 functions | High |
| AppContext biometric actions | ❌ | enableBiometrics, disableBiometrics | High |
| State persistence | ❌ | Reload scenarios | Medium |
| Error handling | Partial | localStorage failure | Medium |

---

## Recommendations

### 1. Add storage unit tests

Create `src/state/__tests__/storage.test.ts`:

```typescript
describe('biometric storage', () => {
  it('saves and loads biometricUserId')
  it('clears biometricUserId')
  it('returns null when localStorage throws')
  it('handles null userId by removing key')
})
```

### 2. Add AppContext integration test

Test that `enableBiometrics()`:
- Sets `biometricsEnabled: true` in state
- Calls `saveBiometricUserId(email)`
- Both happen together

### 3. Add test setup for window mocks

In `vitest.setup.ts`:

```typescript
window.scrollTo = vi.fn()
```

### 4. Consider adding one E2E test

For the critical path:
- Enable biometrics → Sign out → Sign in via fingerprint

---

## Quick Wins

- [ ] Mock `window.scrollTo` in setup (eliminates warning noise)
- [ ] Add `storage.test.ts` with basic load/save tests (~15 min)
- [ ] Add one AppContext test for `enableBiometrics` action (~20 min)

---

## Test Pyramid Assessment

```
Current:
        /\
       /  \     E2E: 0 ❌
      /----\
     /      \   Integration: 0 ❌
    /--------\
   /  Unit    \ Unit: 36 ✅
  /------------\
```

**Verdict:** Heavy on unit tests (good), but missing integration layer for state management and no E2E for critical user flows.

---

## Test Inventory

| Test File | Test Count | Execution Time |
|-----------|------------|----------------|
| BiometricPromptSheet.test.tsx | 15 | ~0.4s |
| BiometricsScreen.test.tsx | 10 | ~0.7s |
| SignInScreen.biometrics.test.tsx | 11 | ~1.3s |
| **Total** | **36** | **~7s** |

---

## Conclusion

The biometrics feature has solid UI test coverage with well-structured, readable tests. The main gaps are in the state management layer (storage functions and AppContext actions) which should be addressed before the feature is considered production-ready. No critical bugs or flaky tests were identified.

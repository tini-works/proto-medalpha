# Golden Tests Proposal for User Stories (Jan 27, 2026)

> **Source**: User Stories from Philipp (January 27, 2026) - Issue #18
> **App**: appointment-booking-N3
> **Total Tests**: 38 (compacted from 52)

## Scope

- **Type**: Unit tests with mocked state/API
- **Skip**: Epic 1.6 (CMS), Epic 1.7 (Admin), performance timing tests, existing tests
- **Compaction**: Applied `prototype-golden-tests-compact.md` criteria
- **Config**: Max 2 concurrent, retry 2x then skip, bail on first failure

---

## Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,

    // Resource optimization
    maxConcurrency: 2,        // Max 2 tests running at once
    maxWorkers: 1,            // Single worker thread
    minWorkers: 1,            // Don't spawn extra workers

    // Retry failed tests max 2 times, then skip
    retry: 2,

    // Stop early once verified
    bail: 1,                  // Stop on first failure (after retries)
    passWithNoTests: false,   // Fail if no tests found

    // Timeouts
    testTimeout: 10000,       // 10s per test max
    hookTimeout: 10000,       // 10s for setup/teardown
  },
})
```

**Key settings:**
- `maxConcurrency: 2` — Only 2 tests run simultaneously
- `maxWorkers: 1` — Single worker process (minimal memory)
- `retry: 2` — Retry failing tests up to 2 times, then skip
- `bail: 1` — Stop entire suite on first failure (after retries exhausted)
- `testTimeout: 10000` — Prevents hung tests

---

## Test File Structure (Compacted)

```
src/test/golden/
├── test-utils.tsx                     # Shared mocks, factories, helpers
├── epic-1.1-onboarding.test.tsx       # 5 tests (was 10)
├── epic-1.2-booking.test.tsx          # 20 tests (was 22)
├── epic-1.3-feedback.test.tsx         # 3 tests
├── epic-1.4-account.test.tsx          # 1 test (was 5)
├── epic-1.5-practice-changes.test.tsx # 3 tests
└── epic-1.8-additional.test.tsx       # 6 tests (was 12)
```

## Omitted Tests (per prototype-golden-tests-compact.md)

Tests omitted because they add no UX insight in a mock prototype:

**Security/Infrastructure:**
- Password OWASP validation
- Password strength indicator
- SMS code format/rate limiting
- Phone international format
- Biometric fallback logic
- Password change validation
- Delete confirmation flow

**Partner/Timing:**
- API retry backoff logic (503, 429)
- Auth re-login prompts (401)
- Online sync timing
- Client-side rate limiting

---

## Epic 1.1: Onboarding (10 tests)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.1.1-a | `home-screen-book-button-visible` | "Book Appointment" button prominent on home |
| 1.1.1-b | `legal-links-in-menu` | Imprint, Privacy, ToS accessible via menu |
| 1.1.2-a | `oauth-buttons-present` | Google/Apple sign-in buttons displayed |
| 1.1.2-b | `oauth-imports-profile-data` | After OAuth, name/email auto-populated |
| 1.1.2-c | `oauth-prompts-missing-insurance` | Missing insurance field requested after OAuth |
| 1.1.3-a | `password-owasp-validation` | Rejects weak passwords, accepts OWASP-compliant |
| 1.1.3-b | `password-strength-indicator-updates` | Strength indicator changes as user types |
| 1.1.4-a | `sms-code-6-digits` | SMS input accepts exactly 6 digits |
| 1.1.4-b | `phone-accepts-international` | Accepts +43, +41, +49 formats |
| 1.1.5-a | `biometric-toggle-in-settings` | Biometric option toggleable in settings |

---

## Epic 1.2: Appointment Booking (22 tests)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.2.1-a | `specialty-list-renders` | Specialties list displays (GP, Cardio, etc.) |
| 1.2.1-b | `api-error-shows-retry` | On API error, shows "Retry" button |
| 1.2.2-a | `favorite-doctors-shown-in-booking` | "My Doctors" section in booking form |
| 1.2.2-b | `add-remove-favorite-doctor` | Add/remove from favorites works |
| 1.2.2-c | `favorites-sorted-by-last-booking` | Most recent booking first |
| 1.2.2-d | `favorites-max-5-stored` | Only stores last 5 doctors |
| 1.2.3-a | `three-appointment-types` | Acute, Prevention, Follow-Up selectable |
| 1.2.3-b | `acute-requires-symptom-10-chars` | Acute validates min 10 char symptom |
| 1.2.3-c | `prevention-shows-dropdown` | Prevention has reason dropdown |
| 1.2.3-d | `followup-optional-reference` | Follow-Up has optional prev appointment ref |
| 1.2.4-a | `add-up-to-5-dependents` | Can add max 5 family members |
| 1.2.4-b | `dependent-fields-stored` | Name, DOB, insurance saved per dependent |
| 1.2.4-c | `booking-who-for-dropdown` | "Who is this for?" dropdown present |
| 1.2.5-a | `status-in-progress-confirmed-rejected` | Three statuses displayed correctly |
| 1.2.5-b | `status-shows-timestamp` | Last update timestamp visible |
| 1.2.5-c | `rejected-shows-reason` | Rejection reason displayed |
| 1.2.6-a | `export-only-when-confirmed` | Export button hidden unless confirmed |
| 1.2.8-a | `appointment-tabs-upcoming-past` | Two tabs in appointment list |
| 1.2.8-b | `upcoming-sorted-ascending` | Upcoming sorted by date ASC |
| 1.2.8-c | `past-sorted-descending` | Past sorted by date DESC |
| 1.2.9-a | `modify-disabled-under-24h` | Modify blocked <24h before |
| 1.2.10-a | `cancel-disabled-under-24h` | Cancel blocked <24h before |

---

## Epic 1.3: Post-Appointment Feedback (2 tests)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.3.1-a | `feedback-star-rating-1-5` | Star rating 1-5 available |
| 1.3.1-b | `feedback-text-optional` | Can submit without free-text |

---

## Epic 1.4: Account Management (5 tests)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.4.1-a | `delete-shows-warning` | Warning about consequences shown |
| 1.4.1-b | `delete-requires-confirmation` | Double opt-out required |
| 1.4.2-a | `password-change-requires-old` | Must enter current password |
| 1.4.2-b | `new-password-owasp-validated` | New password meets OWASP |
| 1.4.2-c | `password-change-rate-limited` | Max 5 changes per day enforced |

---

## Epic 1.5: Practice-Initiated Changes (1 test)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.5.1-a | `practice-change-shows-modified-status` | Status shows "Modified by Practice" |

---

## Epic 1.8: Additional Features (12 tests)

| ID | Test | Acceptance Criteria |
|----|------|---------------------|
| 1.8.1-a | `api-503-triggers-retry` | Auto-retry logic for 503 |
| 1.8.1-b | `api-429-respects-retry-after` | Waits for Retry-After header |
| 1.8.1-c | `api-401-prompts-reauth` | Redirects to login on 401/403 |
| 1.8.1-d | `network-timeout-shows-try-again` | "Try again" button on timeout |
| 1.8.2-a | `offline-appointments-visible` | Cached appointments shown offline |
| 1.8.2-b | `offline-notice-displayed` | "Offline" banner shown |
| 1.8.2-c | `offline-booking-disabled` | Booking button disabled offline |
| 1.8.2-d | `online-triggers-sync` | Sync initiated when back online |
| 1.8.3-a | `consent-three-checkboxes` | Necessary, Analytics, Marketing separate |
| 1.8.3-b | `consent-editable-in-settings` | Can change consents in settings |
| 1.8.4-a | `rate-limit-queues-requests` | Excess requests queued, not errored |
| 1.8.4-b | `rate-limit-shows-loading` | Loading shown during queue |

---

## Test Utilities (`test-utils.tsx`)

```typescript
// Key exports:
- renderWithProviders()           // Wraps with Router + i18n
- mockOnlineStatus(bool)          // Toggle navigator.onLine
- mockLocalStorage()              // In-memory localStorage
- formValidation.isValidPassword() // OWASP checker
- formValidation.isValidPhone()   // International phone
- createMockDoctor()              // Factory
- createMockAppointment()         // Factory with status
- createMockUser()                // Factory with familyMembers
- createMockFamilyMember()        // Factory
- createApiMock()                 // Track API calls for rate limiting
```

---

## Summary

| Item | Value |
|------|-------|
| Total tests | 38 |
| Original count | 52 |
| Reduction | 27% |
| Max concurrent | 2 |
| Retry attempts | 2 |
| Bail on failure | Yes |
| Workers | 1 |
| Test timeout | 10s |

---

## Traceability

Each test ID maps directly to the user story acceptance criteria:
- `1.1.1-a` → US 1.1.1, first acceptance criterion
- `1.2.3-b` → US 1.2.3, second acceptance criterion

This enables quick verification of which requirements are covered and which tests to run for specific user stories.

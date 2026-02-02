# DocliQ QA Implementation Plan

**Date**: 2026-02-02
**Status**: Phase 1 Complete

---

## Overview

This plan addresses the QA audit findings and implements new integration tests for the docliQ-mobile app.

---

## Phase 1: Foundation (✅ COMPLETE)

### 1.1 Create Test Infrastructure

**Directory Structure:**
```
apps/docliQ-mobile/src/test/
├── contracts/
│   └── __fixtures__/
│       ├── users.ts         ✅ Created
│       └── appointments.ts  ✅ Created
├── integration/
│   ├── routing.integration.test.tsx        ✅ Created
│   ├── form-validation.integration.test.tsx ✅ Created
│   ├── error-handling.integration.test.tsx  ✅ Created
│   ├── loading-states.integration.test.tsx  ✅ Created
│   └── toast-notification.integration.test.tsx ✅ Created
├── golden/           (existing - to be transformed in Phase 2)
├── setup.ts          (existing)
└── test-utils.tsx    (existing)
```

### 1.2 Test Fixtures

**users.ts** - User state fixtures:
- `authenticatedUser` - Full authenticated/verified user
- `unverifiedUser` - Authenticated but not verified
- `guestUser` - Unauthenticated visitor

**appointments.ts** - Appointment fixtures:
- All 6 status types (confirmed, matching, await_confirm, completed, cancelled_patient, cancelled_doctor)
- `activeAppointments` - Upcoming, actionable
- `inactiveAppointments` - Past, cancelled

### 1.3 Integration Tests Implemented

| Test File | Tests | Coverage Area |
|-----------|-------|---------------|
| `routing.integration.test.tsx` | ~15 | Routes, guards, path helpers |
| `form-validation.integration.test.tsx` | ~25 | Password, textarea, validation |
| `error-handling.integration.test.tsx` | ~20 | API errors, retry, empty states |
| `loading-states.integration.test.tsx` | ~15 | Skeleton, loading patterns |
| `toast-notification.integration.test.tsx` | ~20 | Toast display, queue, dismiss |

**Total New Tests: ~95**

---

## Phase 2: Contract Migration (PLANNED)

### 2.1 Contract Test Pattern

Transform golden tests from mock-component tests to real-component contract tests.

**Before (Anti-pattern):**
```tsx
// Tests mock component, not real code
function MockBookingScreen() {
  return <div>Mock booking</div>
}

it('shows booking', () => {
  render(<MockBookingScreen />)
  expect(screen.getByText('Mock booking')).toBeInTheDocument()
})
```

**After (Contract Pattern):**
```tsx
// Contract defines business requirements
export const BookingContracts = {
  'user can select specialty': async (render) => {
    render(<SpecialtyScreen />)
    await userEvent.click(screen.getByText('Dermatology'))
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  },
}

// Integration test uses contract
describe('Booking Flow', () => {
  Object.entries(BookingContracts).forEach(([name, test]) => {
    it(name, () => test(renderWithProviders))
  })
})
```

### 2.2 Migration Steps

1. Extract business requirements from each golden test
2. Create contract file for each epic
3. Write integration tests using real components
4. Deprecate old golden test files

### 2.3 Contract Files to Create

| Epic | Current File | New Contract |
|------|-------------|--------------|
| 1.1 Onboarding | `epic-1.1-onboarding.test.tsx` | `epic-1.1-onboarding.contract.ts` |
| 1.2 Booking | `epic-1.2-booking.test.tsx` | `epic-1.2-booking.contract.ts` |
| 1.3 Feedback | `epic-1.3-feedback.test.tsx` | `epic-1.3-feedback.contract.ts` |
| 1.4 Account | `epic-1.4-account.test.tsx` | `epic-1.4-account.contract.ts` |
| 1.5 Practice | `epic-1.5-practice-changes.test.tsx` | `epic-1.5-practice.contract.ts` |
| 1.8 Additional | `epic-1.8-additional.test.tsx` | `epic-1.8-additional.contract.ts` |

---

## Phase 3: CI Integration (PLANNED)

### 3.1 Test Commands

```bash
# Run all tests
pnpm --filter docliQ-mobile test

# Run integration tests only
pnpm --filter docliQ-mobile test src/test/integration

# Run contract tests only
pnpm --filter docliQ-mobile test src/test/contracts

# Run with coverage
pnpm --filter docliQ-mobile test --coverage
```

### 3.2 Coverage Thresholds

| Metric | Target |
|--------|--------|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

### 3.3 CI Pipeline

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - run: pnpm install
    - run: pnpm --filter docliQ-mobile test --coverage
    - uses: codecov/codecov-action@v3
```

---

## Test Writing Guidelines

### Do's

- ✅ Test real components with real behavior
- ✅ Use fixtures for consistent test data
- ✅ Test user interactions (click, type, navigate)
- ✅ Test error states and edge cases
- ✅ Include accessibility assertions (role, aria-*)
- ✅ Use data-testid for test-specific selectors

### Don'ts

- ❌ Don't test mock/stub components
- ❌ Don't assert on CSS classes (Tailwind)
- ❌ Don't test i18n key existence (build validates)
- ❌ Don't test implementation details
- ❌ Don't skip error boundary tests

---

## Files Created

### Test Files

| Path | Description |
|------|-------------|
| `src/test/contracts/__fixtures__/users.ts` | User state fixtures |
| `src/test/contracts/__fixtures__/appointments.ts` | Appointment fixtures |
| `src/test/integration/routing.integration.test.tsx` | Route guard tests |
| `src/test/integration/form-validation.integration.test.tsx` | Form validation tests |
| `src/test/integration/error-handling.integration.test.tsx` | Error handling tests |
| `src/test/integration/loading-states.integration.test.tsx` | Loading state tests |
| `src/test/integration/toast-notification.integration.test.tsx` | Toast notification tests |

### Documentation

| Path | Description |
|------|-------------|
| `docs/docliQ/QA-AUDIT-REPORT.md` | Full audit report |
| `docs/docliQ/QA-IMPLEMENTATION-PLAN.md` | This plan |

---

## Running the Tests

```bash
# Navigate to project root
cd /path/to/proto-medalpha

# Install dependencies
pnpm install

# Run docliQ tests
pnpm --filter docliQ-mobile test

# Run specific test file
pnpm --filter docliQ-mobile test routing.integration

# Watch mode
pnpm --filter docliQ-mobile test --watch
```

---

## Success Criteria

### Phase 1 ✅
- [x] Test fixtures created
- [x] 5 integration test files created
- [x] ~95 new tests added
- [x] All new tests passing
- [x] Documentation complete

### Phase 2 (Pending)
- [ ] Contract pattern implemented
- [ ] 6 golden test files migrated
- [ ] Old golden tests deprecated
- [ ] Contract documentation written

### Phase 3 (Pending)
- [ ] CI pipeline configured
- [ ] Coverage thresholds enforced
- [ ] Test reports automated

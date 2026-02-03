# Change Password Flow - Design Document

> **Date:** 2026-02-03
> **User Story:** US 1.4.2 - Change Password
> **Status:** Ready for implementation

---

## Overview

Implement a fully functional Change Password screen with OWASP-compliant password validation, leveraging existing `PasswordField` and `PasswordStrengthIndicator` components. This is a mock-only implementation (no backend integration).

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend approach | Mock only | Prototype demo, not production |
| Scope | Core UX only | OWASP validation + strength indicator + success flow |
| Security notice | Not included | Keep simple per user preference |
| Forgot password link | Included | Important UX escape hatch |
| Tests | Included | Verify implementation works |

---

## Acceptance Criteria (US 1.4.2)

| # | Criterion | Implementation |
|---|-----------|----------------|
| 1 | Old password required | Field validation (non-empty) |
| 2 | OWASP standards | `validatePassword()` score = 4 |
| 3 | Confirmation email | **Deferred** (backend) |
| 4 | Forgot password link | Link to existing `ForgotPasswordScreen` |
| 5 | Rate limiting | **Deferred** (backend) |

---

## GDPR Compliance

| Requirement | How Addressed |
|-------------|---------------|
| Password never logged | No console.log of password values |
| No password in errors | Generic messages ("Password too weak") |
| Strength indicator safe | Shows requirements met, not password content |
| Art. 32 (Security) | OWASP standards ensure strong passwords |

**Note:** Audit logging, rate limiting, and confirmation emails are backend concerns not addressed in this mock.

---

## Screen Design

```
┌─────────────────────────────────────┐
│ ← Change Password                   │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔒 For your security, enter     │ │
│ │ your current password to make   │ │
│ │ changes.                        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Current Password                    │
│ ┌─────────────────────────────┬───┐ │
│ │ ••••••••                    │ 👁│ │
│ └─────────────────────────────┴───┘ │
│ Forgot your password?               │
│                                     │
│ New Password                        │
│ ┌─────────────────────────────┬───┐ │
│ │ ••••••••                    │ 👁│ │
│ └─────────────────────────────┴───┘ │
│ ████████░░░░░░░░ Good              │
│ ✓ At least 8 characters            │
│ ✓ One uppercase letter (A-Z)       │
│ ✓ One lowercase letter (a-z)       │
│ ✗ One number (0-9)                 │
│ ✗ One special character            │
│                                     │
│ Confirm New Password                │
│ ┌─────────────────────────────┬───┐ │
│ │ ••••••••                    │ 👁│ │
│ └─────────────────────────────┴───┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │       Update Password           │ │ ← Disabled until valid
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Current Password | Non-empty | (required field) |
| New Password | OWASP score = 4 | "Password is too weak" |
| Confirm Password | Matches new | "Passwords don't match" |
| New vs Current | Different | "New password must be different from current" |

**Submit enabled when:** All 4 conditions pass

---

## Component Reuse

| Component | Source | Usage |
|-----------|--------|-------|
| `PasswordField` | `components/forms/PasswordField.tsx` | All 3 password fields |
| `PasswordStrengthIndicator` | `components/forms/PasswordStrengthIndicator.tsx` | New password field |
| `validatePassword()` | `utils/passwordValidation.ts` | OWASP validation |
| `Page`, `Header` | `components/layout/` | Screen layout |
| `Button` | `components/ui/` | Submit button |

**No new components required.**

---

## User Flow

```
Settings
    └── Security
            └── Change Password
                    │
                    ├── [Forgot?] → ForgotPasswordScreen → VerifyScreen → ResetPasswordScreen
                    │
                    └── [Submit valid] → Success Toast → Navigate back (1.5s delay)
```

---

## Files Modified

| File | Changes |
|------|---------|
| `screens/settings/ChangePasswordScreen.tsx` | Full implementation |
| `locales/en/settings.json` | Add 3 translations |
| `locales/de/settings.json` | Add 3 German translations |

## Files Created

| File | Purpose |
|------|---------|
| `screens/settings/__tests__/ChangePasswordScreen.test.tsx` | Unit tests |

---

## Test Cases

1. Renders all 3 password fields with labels
2. Renders "Forgot your password?" link
3. Link navigates to correct route
4. Submit disabled: empty fields
5. Submit disabled: weak password
6. Submit disabled: password mismatch
7. Submit disabled: same as current
8. Submit enabled: all valid
9. Success toast on submit
10. Auto-navigate back after success

---

## References

- [US 1.4.2 User Story](/docs/scope-for-exploration-v3%20(design).md#us-142-change-password)
- [GDPR Compliance Gap Analysis](/docs/docliQ/GDPR-COMPLIANCE-GAP-ANALYSIS.md)
- [Password Management UX Spec](/docs/docliQ/US-1.1.3-PASSWORD-MANAGEMENT-UX-SPEC.md)

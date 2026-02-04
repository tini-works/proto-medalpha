# US 1.1.3: Password Management UX - Implementation Spec

> **Epic**: 1.1 Onboarding
> **Status**: Implemented
> **Priority**: High
> **Scope**: UX/UI + Validation Logic (frontend, CAPTCHA/email delivery are backend annotations)

---

## User Story

> **As a new patient without Google/Apple account**, I want to register with email and secure password, to use the app.

## Acceptance Criteria

| # | Criterion | Implementation |
|---|-----------|----------------|
| 1 | Password OWASP Compliance | Min 8 chars, uppercase, lowercase, number, special char |
| 2 | Real-time Password Validation | Visual strength indicator updates as user types |
| 3 | Show/Hide Password Toggle | Eye icon button on all password fields |
| 4 | Email Verification | Existing VerifyScreen (24-hour token validity = backend) |
| 5 | CAPTCHA Protection | **Backend annotation** - not in UI mock |

## GDPR Compliance

- Password data never logged or displayed in error messages
- Strength indicator shows requirements without exposing password content
- Privacy Policy link accessible from registration screen

---

## Component Reuse Summary

| Need | Existing Component | File Path | Reuse Strategy |
|------|-------------------|-----------|----------------|
| Text input base | `Field` | `components/forms/Field.tsx` | Wrap in PasswordField |
| Submit button | `Button` | `components/ui/Button.tsx` | Direct use |
| Screen layout | `Page` | `components/layout/Page.tsx` | Direct use |
| Navigation header | `Header` | `components/layout/Header.tsx` | Direct use |
| Icons | `@tabler/icons-react` | — | `IconEye`, `IconEyeOff`, `IconCheck`, `IconX` |
| i18n | `useTranslation` | — | `auth` namespace |

**New Components Created:**

| Component | Purpose | File |
|-----------|---------|------|
| `PasswordField` | Field wrapper with show/hide toggle | `components/forms/PasswordField.tsx` |
| `PasswordStrengthIndicator` | Visual strength bar + requirements checklist | `components/forms/PasswordStrengthIndicator.tsx` |
| `validatePassword()` | OWASP validation utility | `utils/passwordValidation.ts` |

---

## Implementation Details

### Password Validation Utility

**File**: `apps/docliQ-mobile/src/utils/passwordValidation.ts`

```typescript
export interface PasswordRequirements {
  minLength: boolean      // >= 8 chars
  hasUppercase: boolean   // [A-Z]
  hasLowercase: boolean   // [a-z]
  hasNumber: boolean      // [0-9]
  hasSpecial: boolean     // special characters
}

export interface PasswordValidationResult {
  isValid: boolean
  score: 0 | 1 | 2 | 3 | 4
  strength: 'none' | 'weak' | 'fair' | 'good' | 'strong'
  requirements: PasswordRequirements
}

export function validatePassword(password: string): PasswordValidationResult
export function getStrengthColor(score: number): string
```

**Score Calculation:**
- 0: Empty or < 8 chars
- 1: Length only (weak)
- 2: Length + 2 character types (fair)
- 3: Length + 3 character types (good)
- 4: Length + all 4 character types (strong)

**isValid**: Requires score = 4 (all 4 character types for OWASP compliance)

---

### PasswordStrengthIndicator Component

**File**: `apps/docliQ-mobile/src/components/forms/PasswordStrengthIndicator.tsx`

**Features:**
- Progress bar with color coding (red → orange → light teal → dark teal)
- Strength label (Weak/Fair/Good/Strong)
- Requirements checklist with checkmarks/X marks

---

### PasswordField Component

**File**: `apps/docliQ-mobile/src/components/forms/PasswordField.tsx`

**Props:**
- `showStrengthIndicator?: boolean` - Enable strength indicator
- `showRequirements?: boolean` - Show requirements checklist
- Inherits all standard input props

**Features:**
- Show/hide toggle (eye icon)
- Optional strength indicator
- Wraps existing Field component

---

### Screen Updates

| Screen | Changes |
|--------|---------|
| `RegisterScreen.tsx` | PasswordField with strength indicator + OWASP validation |
| `ResetPasswordScreen.tsx` | PasswordField with strength indicator + OWASP validation |
| `SignInScreen.tsx` | PasswordField with toggle only (no strength indicator) |

---

### Translations Added

**English** (`locales/en/auth.json`):
```json
{
  "password": {
    "show": "Show password",
    "hide": "Hide password",
    "strength": {
      "weak": "Weak",
      "fair": "Fair",
      "good": "Good",
      "strong": "Strong"
    },
    "requirements": {
      "minLength": "At least 8 characters",
      "hasUppercase": "One uppercase letter (A-Z)",
      "hasLowercase": "One lowercase letter (a-z)",
      "hasNumber": "One number (0-9)",
      "hasSpecial": "One special character (!@#$%...)"
    }
  },
  "validation": {
    "passwordWeak": "Password is too weak"
  }
}
```

**German** (`locales/de/auth.json`): Full translations included.

---

## Files Summary

### Created (3 files)

| File | Purpose |
|------|---------|
| `src/utils/passwordValidation.ts` | OWASP validation utility |
| `src/components/forms/PasswordField.tsx` | Field wrapper with toggle |
| `src/components/forms/PasswordStrengthIndicator.tsx` | Visual strength feedback |

### Modified (6 files)

| File | Changes |
|------|---------|
| `src/utils/index.ts` | Export password validation |
| `src/components/forms/index.ts` | Export PasswordField, PasswordStrengthIndicator |
| `src/screens/auth/RegisterScreen.tsx` | Use PasswordField + OWASP validation |
| `src/screens/auth/ResetPasswordScreen.tsx` | Use PasswordField + OWASP validation |
| `src/screens/auth/SignInScreen.tsx` | Use PasswordField (toggle only) |
| `src/locales/en/auth.json` | Add password strength translations |
| `src/locales/de/auth.json` | Add German translations |

---

## Backend Annotations

These items are backend responsibility (not in UI mock):

| Item | Note |
|------|------|
| CAPTCHA protection | Add `// TODO: Backend - CAPTCHA on /register` |
| Email verification 24h validity | Backend token management |
| Confirmation email delivery | Backend email service |
| Rate limiting | Backend API gateway |

---

## Verification Checklist

### Manual Testing

- [x] **RegisterScreen**: Type password → strength bar updates in real-time
- [x] **RegisterScreen**: Requirements checklist shows checkmarks as met
- [x] **RegisterScreen**: Eye icon toggles password visibility
- [x] **RegisterScreen**: Submit blocked unless all 4 requirements met (score = 4)
- [x] **RegisterScreen**: Submit succeeds with strong password
- [x] **ResetPasswordScreen**: Same strength indicator behavior
- [x] **SignInScreen**: Eye toggle works (no strength indicator)
- [x] **German**: Switch language → all password strings translated
- [x] **Accessibility**: Screen reader announces toggle button purpose

### Automated Tests (Suggested)

```bash
# Run password validation tests
pnpm --filter docliQ-mobile test src/utils/__tests__/passwordValidation

# Run PasswordField component tests
pnpm --filter docliQ-mobile test src/components/forms/__tests__/PasswordField

# TypeScript check
npx tsc --noEmit
```

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Strength threshold | **Score = 4 (Strong)** | All 4 character types required for strict OWASP compliance |
| Confirm field indicator | No | Only show strength indicator on new password field |
| Hint when indicator shown | Remove | Strength indicator replaces static hint text |
| US 1.4.2 ChangePasswordScreen | **Separate spec** | Keep this focused on registration/reset; Change Password is account management |

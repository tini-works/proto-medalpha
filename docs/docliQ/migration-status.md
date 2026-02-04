# Input Migration Status

Last updated: 2026-02-04

## Component Availability in @meda/ui

| Component | @meda/ui Ready | Tests |
|-----------|----------------|-------|
| Field | ✅ | 15 |
| PasswordField | ✅ | 16 |
| Select | ✅ | 18 |
| DateInput | ✅ | 17 |
| TextareaField | ✅ | 19 |
| SearchInput | ✅ | 9 |
| RadioGroup | ✅ | 9 |
| PhoneInput | ✅ | 23 |

**Total: 126 tests for composed components**

## Screen Migration Progress

### Auth Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ForgotPasswordScreen | Field | ✅ | Complete |
| SignInScreen | Field, PasswordField | ✅ | Complete |
| ResetPasswordScreen | PasswordField | ✅ | Complete |
| RegisterScreen | Field, PasswordField | ✅ | Complete |
| WelcomeScreen | - | N/A | No form inputs |
| VerifyScreen | - | N/A | Uses OTPInput (already in @meda/ui) |
| VerifyIdentityScreen | - | N/A | No form inputs (info screen only) |

### Settings Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ChangePasswordScreen | PasswordField | ✅ | Complete |
| DeleteEmailConfirmScreen | - | N/A | No form inputs |
| EditProfileScreen | Field, PhoneInput | ✅ | Complete |
| AddressEditScreen | Field | ✅ | Complete |
| InsuranceEditScreen | Field, RadioGroup | ✅ | Complete |

### Profile Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ProfileCompletionScreen | Field, RadioGroup | ✅ | Complete |
| EditProfileScreen | Field, PhoneInput | ✅ | Complete |
| AddFamilyMemberScreen | - | N/A | Uses AddFamilyMemberSheet |
| FamilyMemberDetailScreen | - | N/A | Uses EditFamilyMemberSheet |
| VerifyPhoneScreen | - | N/A | Uses OTPInput (already in @meda/ui) |

### Onboarding Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ProfileSetupScreen | PhoneInput, DateInput | ✅ | Complete |
| InsuranceSetupScreen | - | N/A | Uses InsuranceCard (custom UI) |

### Form Component Sheets

| Component | Components Used | Migrated | Status |
|-----------|-----------------|----------|--------|
| AddFamilyMemberSheet | Field | ✅ | Complete |
| EditFamilyMemberSheet | Field, Select, TextareaField | ✅ | Complete |

### Booking Screens (Out of Scope)

> **Note:** Booking screens are explicitly excluded from this migration phase per project decision. Will be addressed in a future iteration.

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| SearchScreen | SearchInput | ❌ | Out of scope |
| DoctorSearchScreen | SearchInput | ❌ | Out of scope |
| ConstraintsScreen | Select, DateInput | ❌ | Out of scope |
| CareRequestScreen | TextareaField | ❌ | Out of scope |

### Onboarding Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ProfileSetupScreen | Field, DateInput, Select | ⏳ | Pending |
| InsuranceSetupScreen | Field, Select | ⏳ | Pending |

## Deprecation Warnings

Added to old components in `docliQ-mobile/src/components/forms/`:
- ✅ Field.tsx
- ✅ PasswordField.tsx

## Summary

- **Migrated screens:** 12+
- **Migrated form sheets:** 2
- **Components with deprecation warnings:** 2
- **Booking screens:** Explicitly out of scope

## Next Steps

1. Add deprecation warnings to remaining form components (Select, DateInput, PhoneInput, RadioGroup)
2. Once all screens migrated, remove old components
3. When booking screens are back in scope, complete their migration

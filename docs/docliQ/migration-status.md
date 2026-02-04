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
| VerifyIdentityScreen | - | ⏳ | Pending |

### Settings Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ChangePasswordScreen | PasswordField | ✅ | Complete |
| DeleteEmailConfirmScreen | - | N/A | No form inputs |
| EditProfileScreen | Multiple | ⏳ | Pending |
| AddressEditScreen | Field | ⏳ | Pending |
| InsuranceEditScreen | Field, Select | ⏳ | Pending |

### Profile Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| ProfileCompletionScreen | Multiple | ⏳ | Pending |
| EditProfileScreen | Multiple | ⏳ | Pending |
| AddFamilyMemberScreen | Multiple | ⏳ | Pending |
| FamilyMemberDetailScreen | Multiple | ⏳ | Pending |
| VerifyPhoneScreen | PhoneInput | ⏳ | Pending |

### Booking Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| SearchScreen | SearchInput | ⏳ | Pending |
| DoctorSearchScreen | SearchInput | ⏳ | Pending |
| ConstraintsScreen | Select, DateInput | ⏳ | Pending |
| CareRequestScreen | TextareaField | ⏳ | Pending |

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

- **Migrated screens:** 5
- **Pending screens:** ~15+
- **Components with deprecation warnings:** 2

## Next Steps

1. Continue migrating remaining screens in complexity order
2. Add deprecation warnings to remaining form components (Select, DateInput, etc.)
3. Once all screens migrated, remove old components

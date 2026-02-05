# Input Migration Status

Last updated: 2026-02-05

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

### Booking Screens

| Screen | Components Used | Migrated | Status |
|--------|-----------------|----------|--------|
| SearchScreen | SearchInput | ✅ | Complete |
| DoctorSearchScreen | - | N/A | Uses vanilla HTML (no form components) |
| ConstraintsScreen | - | N/A | Uses LocationSelector (custom composite) |
| CareRequestScreen | SearchInput, TextareaField | ✅ | Complete |

## Deprecation Warnings

Added to old components in `docliQ-mobile/src/components/forms/`:
- ✅ Field.tsx
- ✅ PasswordField.tsx
- ✅ Select.tsx
- ✅ DateInput.tsx
- ✅ PhoneInput.tsx
- ✅ RadioGroup.tsx
- ✅ SpecialtySearchInput.tsx
- ✅ ReasonTextarea.tsx

## Summary

- **Migrated screens:** 14+
- **Migrated form sheets:** 2
- **Components with deprecation warnings:** 8
- **Booking screens:** Now in scope and migrated

## Custom Components (Not Migrating)

These components are application-specific composites, not generic form inputs:
- `LocationSelector` - Complex location picker with GPS, address search, saved locations
- `GenderSelect` - Visual grid selector with icons (not a standard dropdown)

## Next Steps

1. ~~Add deprecation warnings to remaining form components~~ ✅ Done
2. Once all consumers are migrated, remove deprecated components
3. Consider creating `LocationSelector` as a @meda/ui component if needed across apps

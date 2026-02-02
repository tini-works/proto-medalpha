
# Identity Verification Flow Revamp

## Summary

Replace the current non-functional identity verification with a new 3-step onboarding flow:

1. **Profile Setup** - DOB, Gender, Phone
2. **Insurance Setup** - GKV/PKV card selection
3. **Verify Medical Identity** - eGK photo capture mock

Applies to both OAuth and email registration. Mock-only implementation (no real NFC/camera).

---

## Decisions Made

|Question|Decision|
|---|---|
|Existing users|No migration - new flow for new registrations only|
|NFC behavior|Photo capture mock (camera UI → extract mock data)|
|Flow scope|Both OAuth and email paths use same 3-step flow|
|Family members|Skip for this iteration|

---

## UI Note: Segment-Style Progress Indicator

Per design mockup, use **segment bar style** (not dots):

```sh
┌────────────────────────────────────────┐
│ ████████████  ────────────  ────────── │  Step 1 (33%)
│ ████████████  ████████████  ────────── │  Step 2 (66%)
│ ████████████  ████████████  ██████████ │  Step 3 (100%)
└────────────────────────────────────────┘
```

### Update `ProgressIndicator.tsx`

Add new `variant: 'segments'` option:

- 3 horizontal bars with gap
- Filled segments use `bg-teal-500`
- Empty segments use `bg-cream-300`
- Show "STEP X OF 3" label left, "XX% Complete" right (teal color)

```typescript
// New variant in ProgressIndicator
variant?: 'bar' | 'dots' | 'segments'

// Segments render
{variant === 'segments' && (
  <div className="flex gap-2">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`flex-1 h-1 rounded-full ${
          i < currentStep ? 'bg-teal-500' : 'bg-cream-300'
        }`}
      />
    ))}
  </div>
)}
```

---

## Phase 1: Types & State

### 1.1 Update `types/user.ts`

```typescript
// Add gender type
export type Gender = 'male' | 'female' | 'diverse' | 'prefer_not_to_say'

// Add to UserProfile interface
export interface UserProfile {
  // … existing …
  dateOfBirth?: string           // ISO YYYY-MM-DD
  gender?: Gender
  phoneCountryCode?: string      // e.g., '+49'
  identityVerified: boolean      // NEW
  identityVerifiedAt?: string    // ISO timestamp
}
```

### 1.2 Update `state/AppContext.tsx`

- Add `markIdentityVerified()` method
- Add `isIdentityVerified` computed property
- Update initial profile state

---

## Phase 2: Routes

### 2.1 New routes in `routes/paths.ts`

```typescript
ONBOARDING_PROFILE: '/onboarding/profile',    // Step 1
ONBOARDING_INSURANCE: '/onboarding/insurance', // Step 2
ONBOARDING_VERIFY: '/onboarding/verify',       // Step 3 intro
ONBOARDING_SCAN: '/onboarding/scan',           // Photo capture
ONBOARDING_SUCCESS: '/onboarding/success',     // Done
```

### 2.2 Update `routes/guards.tsx`

Add onboarding paths to `allowedUnverifiedPaths`

---

## Phase 3: New Components

### Form Components (`components/forms/`)

|Component|Purpose|
|---|---|
|`PhoneInput.tsx`|Country code dropdown + number field|
|`DateInput.tsx`|Native date input wrapper (DD/MM/YYYY format)|
|`GenderSelect.tsx`|Card-style gender options|

### Cards (`components/cards/`)

|Component|Purpose|
|---|---|
|`InsuranceCard.tsx`|Large selectable card with icon for GKV/PKV|

### Verification (`components/verification/`)

|Component|Purpose|
|---|---|
|`CardScanner.tsx`|Mock camera viewfinder with scan animation|
|`ExtractedDataCard.tsx`|Shows extracted eGK data for confirmation|

---

## Phase 4: Screens

Create `screens/onboarding/` directory:

### ProfileSetupScreen.tsx (Step 1)

- Header: "Profile Setup" / "STEP 1 OF 3 • 33% Complete"
- Fields: Date of Birth, Gender, Phone Number
- CTA: "Continue →"
- Links: Privacy Policy footer

### InsuranceSetupScreen.tsx (Step 2)

- Header: "Insurance Setup" / "Step 2 of 3 • 66% Complete"
- Heading: "How are you insured?"
- Card options: Public (GKV), Private (PKV)
- Info note: "Don't worry, you can change…"
- GDPR checkbox (required)
- CTA: "Next Step" / "Skip for now"

### VerifyIntroScreen.tsx (Step 3)

- Header: "Step 3 of 3"
- Heading: "Verify Medical Identity"
- Description: eGK requirement explanation
- Image: Phone with eGK card illustration
- Info cards: "NFC Technology", "Positioning"
- Security note: "Secure & Encrypted"
- CTA: "Scan My Card" / "I don't have my card right now"

### CardScanScreen.tsx

- Mock camera viewfinder UI
- "Position your eGK card" instruction
- Scan animation (2-3s)
- Show extracted mock data
- CTA: "Confirm" / "Scan Again"

### VerificationSuccessScreen.tsx

- Success checkmark animation
- "Identity Verified" message
- CTA: "Go to Home"

---

## Phase 5: Navigation Wiring

### Email Registration Path

```sh
Register → VerifyEmail → ONBOARDING_PROFILE → ONBOARDING_INSURANCE → ONBOARDING_VERIFY → Home
```

### OAuth Path

```sh
OAuthConsent → ONBOARDING_PROFILE → ONBOARDING_INSURANCE → ONBOARDING_VERIFY → Home
```

### Changes Required

|File|Change|
|---|---|
|`VerifyScreen.tsx`|Navigate to `ONBOARDING_PROFILE` instead of `PROFILE_COMPLETE`|
|`OAuthConsentScreen.tsx`|Navigate to `ONBOARDING_PROFILE` instead of `InsuranceRequestScreen`|
|`App.tsx`|Add new route definitions|

### Skip Behavior

- "Skip for now" on Step 2/3 → Navigate to Home
- User **cannot book appointments** without identity verification
- Show alert banner in Settings prompting completion

---

## Phase 6: Mock Photo Capture

### CardScanScreen Flow

1. **Initial**: Show camera viewfinder (styled div with guide corners)
2. **Tap "Start Scan"**: Begin animation
3. **Scanning (2-3s)**: Green scan line animation + "Scanning…"
4. **Success**: Checkmark overlay + "Card detected!"
5. **Show Data**: Display extracted info (editable)
6. **Confirm**: Save to profile, navigate to success

### Mock Data Generation

```typescript
const generateMockEgkData = (profileName: string, insuranceType: string) => ({
  holderName: profileName,
  egkNumber: `A${Math.random().toString().slice(2, 11)}`,
  insurerName: insuranceType === 'GKV' ? 'AOK Bayern' : 'Allianz Private',
  validUntil: '12/2027',
})
```

---

## Phase 7: Localization

### Add to `locales/en/auth.json` and `locales/de/auth.json`

```json
{
  "onboarding": {
    "profile": {
      "title": "Profile Setup",
      "step": "STEP 1 OF 3",
      "heading": "Basic Information",
      "description": "Please provide your details to ensure accurate healthcare records.",
      "dobLabel": "Date of Birth",
      "genderLabel": "Gender",
      "phoneLabel": "Phone Number",
      "continue": "Continue"
    },
    "insurance": {
      "title": "Insurance Setup",
      "step": "Step 2 of 3",
      "almostThere": "Almost there! Just a few more details.",
      "heading": "How are you insured?",
      "description": "We need this information to show you the right doctors…",
      "gkvTitle": "Public (Statutory)",
      "gkvDescription": "e.g., TK, AOK, Barmer, DAK",
      "pkvTitle": "Private",
      "pkvDescription": "Full private coverage or self-payer",
      "changeNote": "Don't worry, you can change your insurance provider later…",
      "nextStep": "Next Step",
      "skip": "Skip for now"
    },
    "verify": {
      "title": "Step 3 of 3",
      "heading": "Verify Medical Identity",
      "description": "To access your medical records and book appointments…",
      "nfcTitle": "NFC Technology",
      "nfcDescription": "Ensure NFC is enabled in your device settings.",
      "positionTitle": "Positioning",
      "positionDescription": "Hold your card against the top-back of your phone.",
      "secure": "Secure & Encrypted Encryption",
      "scan": "Scan My Card",
      "skip": "I don't have my card right now"
    },
    "scan": { /* … */ },
    "success": { /* … */ }
  }
}
```

---

## Files to Create

|Path|Description|
|---|---|
|`screens/onboarding/index.ts`|Exports|
|`screens/onboarding/ProfileSetupScreen.tsx`|Step 1|
|`screens/onboarding/InsuranceSetupScreen.tsx`|Step 2|
|`screens/onboarding/VerifyIntroScreen.tsx`|Step 3 intro|
|`screens/onboarding/CardScanScreen.tsx`|Photo capture|
|`screens/onboarding/VerificationSuccessScreen.tsx`|Success|
|`components/forms/PhoneInput.tsx`|Phone with country code|
|`components/forms/DateInput.tsx`|Date picker wrapper|
|`components/forms/GenderSelect.tsx`|Gender cards|
|`components/cards/InsuranceCard.tsx`|Insurance selection card|
|`components/verification/CardScanner.tsx`|Camera mock|
|`components/verification/ExtractedDataCard.tsx`|Data display|
|`components/verification/index.ts`|Exports|

## Files to Modify

|Path|Changes|
|---|---|
|`types/user.ts`|Add Gender, dateOfBirth, identityVerified|
|`state/AppContext.tsx`|Add markIdentityVerified|
|`routes/paths.ts`|Add onboarding routes|
|`routes/guards.tsx`|Allow onboarding paths|
|`App.tsx`|Add route definitions|
|`screens/auth/VerifyScreen.tsx`|Redirect to onboarding|
|`screens/auth/OAuthConsentScreen.tsx`|Redirect to onboarding|
|`components/forms/index.ts`|Export new components|
|`locales/en/auth.json`|Add onboarding translations|
|`locales/de/auth.json`|Add German translations|

## Files to Deprecate

|Path|Action|
|---|---|
|`screens/profile/ProfileCompletionScreen.tsx`|Add redirect to onboarding|
|`screens/auth/VerifyIdentityScreen.tsx`|Replace with VerifyIntroScreen|
|`screens/auth/InsuranceRequestScreen.tsx`|Remove (merged into onboarding)|

---

## Verification

### Manual Testing

1. **Email Registration Flow**
    
    - Register with email → Verify code → See Step 1
    - Complete all 3 steps → Arrive at Home
    - Verify profile state has DOB, gender, phone, identityVerified=true
2. **OAuth Flow**
    
    - Sign in with Google/Apple → See Step 1 (not old InsuranceRequest)
    - Complete flow → Arrive at Home
3. **Skip Behavior**
    
    - Skip at Step 2 or 3 → Should arrive at Home
    - identityVerified should be false
4. **Photo Capture Mock**
    
    - Tap "Scan My Card" → See camera UI
    - Wait for animation → See extracted data
    - Confirm → identityVerified=true
5. **Existing Users**
    
    - Sign in as existing user → Should go directly to Home (no onboarding)

### State Verification

```typescript
// After completing flow
console.log(state.profile.dateOfBirth)      // Set
console.log(state.profile.gender)           // Set
console.log(state.profile.phone)            // Set
console.log(state.profile.insuranceType)    // Set
console.log(state.profile.identityVerified) // true
console.log(state.profile.egkNumber)        // Mock number
```

---

## Edge Cases & Error Handling

### 1. Scan Failure Mock

**Scenario:** Simulated scan failure (random 10% chance or user-triggered)

**UI Flow:**

```sh
Scanning… → "Unable to read card" → [Try Again] / [Enter Manually]
```

**Implementation:**

- `CardScanScreen` has `simulateFailure` state
- Show error message with retry option
- Fallback: Manual eGK number entry field

```typescript
const handleScanComplete = () => {
  // 10% mock failure rate
  if (Math.random() < 0.1) {
    setScanState('error')
    return
  }
  setScanState('success')
}
```

### 2. Manual Entry Fallback

**When:** Scan fails OR user taps "I don't have my card"

**UI:**

- Text field for eGK number (format: `A123456789`)
- Validation: 10 chars, starts with letter
- Skip identity verification flag remains `false` but profile can proceed

### 3. Verification Status UI Feedback

#### Toast Notifications (use existing Toast component)

|Event|Toast Type|Message|
|---|---|---|
|Scan success|`success`|"Identity verified successfully"|
|Scan failure|`warning`|"Unable to read card. Please try again."|
|Manual entry saved|`info`|"eGK number saved. Verify later for full access."|
|Skip verification|`info`|"You can verify your identity later in Settings."|

#### Badge/Status Indicators

**Home Screen / Profile:**

```typescript
// Show verification badge
{!profile.identityVerified && (
  <div className="flex items-center gap-1 text-amber-600 text-xs">
    <IconAlertCircle size={14} />
    <span>Identity not verified</span>
  </div>
)}

{profile.identityVerified && (
  <div className="flex items-center gap-1 text-teal-600 text-xs">
    <IconCircleCheck size={14} />
    <span>Verified</span>
  </div>
)}
```

**Settings Screen:**

- Add "Identity Verification" row
- Show status: ✓ Verified / ⚠ Not verified
- Tap to re-verify or verify for first time

### 4. Network/Timeout Mock

**Scenario:** Simulated network delay or timeout

**UI Flow:**

```sh
Scanning… (>5s) → "Taking longer than expected…" → [Cancel] / [Keep Waiting]
```

### 5. Back Navigation

|From Screen|Back Behavior|
|---|---|
|Step 1 (Profile)|Return to previous auth screen (Verify Email / OAuth Consent)|
|Step 2 (Insurance)|Return to Step 1, preserve data|
|Step 3 (Verify)|Return to Step 2, preserve data|
|Scan Screen|Return to Step 3 intro|
|Success|No back (replace navigation)|

### 6. App Backgrounding During Scan

- Cancel scan animation
- Show "Scan interrupted" on return
- Offer [Try Again]

---

## Test Cases

### Happy Path Tests

|#|Test Case|Steps|Expected Result|
|---|---|---|---|
|T1|Email registration complete flow|Register → Verify email → Complete 3 steps → Scan card|Home screen, `identityVerified=true`|
|T2|OAuth complete flow|Google sign-in → Complete 3 steps → Scan card|Home screen, `identityVerified=true`|
|T3|Skip at Step 3|Complete Steps 1-2 → Skip verification|Home screen, `identityVerified=false`|
|T4|Skip at Step 2|Complete Step 1 → Skip|Home screen, no insurance type set|

### Form Validation Tests

|#|Test Case|Input|Expected Result|
|---|---|---|---|
|T5|DOB required|Leave empty, tap Continue|Error: "Date of birth is required"|
|T6|DOB too young|Enter date <18 years ago|Error: "You must be at least 18"|
|T7|Phone required|Leave empty|Error: "Phone number is required"|
|T8|Phone format|Enter invalid format|Error: "Please enter a valid phone number"|
|T9|Insurance required|Tap Next without selection|Error or disabled button|
|T10|GDPR consent required|Uncheck consent, tap Next|Button disabled|

### Scan Flow Tests

|#|Test Case|Scenario|Expected Result|
|---|---|---|---|
|T11|Successful scan|Complete scan animation|Show extracted data, confirm button|
|T12|Scan failure|Trigger mock failure|Error message, [Try Again] / [Manual Entry]|
|T13|Manual entry|Enter eGK manually|Save number, `identityVerified=false`|
|T14|Scan again|Tap "Scan Again" after success|Restart scan animation|
|T15|Edit extracted data|Modify name/number after scan|Edited values saved to profile|

### Navigation Tests

|#|Test Case|Action|Expected Result|
|---|---|---|---|
|T16|Back from Step 2|Tap back|Return to Step 1 with data preserved|
|T17|Back from Step 3|Tap back|Return to Step 2 with data preserved|
|T18|Deep link to onboarding|Navigate to `/onboarding/profile` when logged in|Show Step 1|
|T19|Refresh during flow|Refresh browser at Step 2|Redirect to Step 1 (or preserve via state)|

### Edge Case Tests

|#|Test Case|Scenario|Expected Result|
|---|---|---|---|
|T20|Existing user login|Sign in as user who completed old flow|Go to Home, no onboarding|
|T21|Partial completion|Complete Step 1, close app, reopen|Resume at Step 1 (or restart)|
|T22|Invalid eGK format|Manual entry: "INVALID"|Validation error|
|T23|Network timeout mock|Wait >5s during scan|"Taking longer…" message|
|T24|Double-tap scan button|Tap "Scan My Card" twice quickly|Only one scan initiated|

### UI Feedback Tests

|#|Test Case|Trigger|Expected Result|
|---|---|---|---|
|T25|Success toast|Complete scan successfully|Green toast: "Identity verified"|
|T26|Warning toast|Scan failure|Amber toast: "Unable to read card"|
|T27|Verification badge|Check Home/Profile unverified|Amber "Not verified" badge visible|
|T28|Verified badge|Check Home/Profile after verify|Teal "Verified" badge visible|
|T29|Settings entry point|Tap "Identity Verification" in Settings|Navigate to verify flow|

### Accessibility Tests

|#|Test Case|Check|Expected Result|
|---|---|---|---|
|T30|Screen reader|Navigate with VoiceOver/TalkBack|All elements announced correctly|
|T31|Focus management|Tab through Step 1 form|Logical focus order|
|T32|Error announcements|Trigger validation error|Error announced to screen reader|
|T33|Progress indicator|Check segment bar|Announces "Step X of 3, XX% complete"|

---

## Settings Integration

### Alert Banner for Incomplete Verification

**When:** User skipped identity verification (`identityVerified === false`)

**Location:** Top of Settings screen (before menu items)

**UI:**

```typescript
// AlertBanner component in Settings
{!profile.identityVerified && (
  <div className="mx-4 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex items-start gap-3">
      <IconAlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-amber-800">
          {t('settings.verificationRequired.title')}
        </h3>
        <p className="text-xs text-amber-700 mt-1">
          {t('settings.verificationRequired.description')}
        </p>
        <button
          onClick={() => navigate(PATHS.ONBOARDING_VERIFY)}
          className="mt-2 text-sm font-medium text-amber-800 underline"
        >
          {t('settings.verificationRequired.action')}
        </button>
      </div>
    </div>
  </div>
)}
```

**Translations:**

```json
{
  "settings": {
    "verificationRequired": {
      "title": "Complete Identity Verification",
      "description": "You must verify your identity to book appointments. This only takes 2 minutes.",
      "action": "Verify Now →"
    }
  }
}
```

### Booking Flow Gate

**When:** User tries to book without verification

**Location:** BookingTypeScreen or start of any booking flow

**UI:**

```typescript
// In BookingTypeScreen or booking entry point
const handleBookAppointment = () => {
  if (!profile.identityVerified) {
    // Show blocking modal
    setShowVerificationModal(true)
    return
  }
  navigate(PATHS.BOOKING_SPECIALTY)
}

// Modal content
<ConfirmModal
  open={showVerificationModal}
  title={t('booking.verificationRequired.title')}
  message={t('booking.verificationRequired.message')}
  confirmLabel={t('booking.verificationRequired.verify')}
  cancelLabel={t('booking.verificationRequired.cancel')}
  onConfirm={() => navigate(PATHS.ONBOARDING_VERIFY)}
  onCancel={() => setShowVerificationModal(false)}
/>
```

**Translations:**

```json
{
  "booking": {
    "verificationRequired": {
      "title": "Verification Required",
      "message": "To book appointments, you must first verify your identity using your eGK card. This ensures secure access to healthcare services.",
      "verify": "Verify Identity",
      "cancel": "Not Now"
    }
  }
}
```

### Add to SettingsScreen

```typescript
// New row in Settings
{
  icon: IconShieldCheck,
  label: t('settings.identityVerification'),
  description: profile.identityVerified
    ? t('settings.verified')
    : t('settings.notVerified'),
  path: PATHS.ONBOARDING_VERIFY,
  badge: !profile.identityVerified ? 'warning' : 'success',
}
```

### Files to Update

- `screens/settings/SettingsScreen.tsx` - Add alert banner + verification row
- `screens/booking/BookingTypeScreen.tsx` - Add verification gate
- `locales/en/settings.json` - Add translations
- `locales/de/settings.json` - Add German translations
- `locales/en/booking.json` - Add verification required translations
- `locales/de/booking.json` - Add German translations

User approved the plan

---

## Implementation Status

**Status:** ✅ Complete (2026-01-30)

### Phase Completion

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Types & State | ✅ Complete |
| Phase 2 | Routes | ✅ Complete |
| Phase 3 | New Components | ✅ Complete |
| Phase 4 | Screens | ✅ Complete |
| Phase 5 | Navigation Wiring | ✅ Complete |
| Phase 6 | Settings/Booking Integration | ✅ Complete |
| Phase 7 | Localization (EN + DE) | ✅ Complete |

### Files Created

| Path | Status |
|------|--------|
| `screens/onboarding/index.ts` | ✅ Created |
| `screens/onboarding/ProfileSetupScreen.tsx` | ✅ Created |
| `screens/onboarding/InsuranceSetupScreen.tsx` | ✅ Created |
| `screens/onboarding/VerifyIntroScreen.tsx` | ✅ Created |
| `screens/onboarding/CardScanScreen.tsx` | ✅ Created |
| `screens/onboarding/VerificationSuccessScreen.tsx` | ✅ Created |
| `components/forms/PhoneInput.tsx` | ✅ Created |
| `components/forms/DateInput.tsx` | ✅ Created |
| `components/forms/GenderSelect.tsx` | ✅ Created |
| `components/cards/InsuranceCard.tsx` | ✅ Created |

### Files Modified

| Path | Status |
|------|--------|
| `types/user.ts` | ✅ Updated |
| `types/index.ts` | ✅ Updated |
| `state/AppContext.tsx` | ✅ Updated |
| `routes/paths.ts` | ✅ Updated |
| `routes/guards.tsx` | ✅ Updated |
| `App.tsx` | ✅ Updated |
| `screens/auth/VerifyScreen.tsx` | ✅ Updated |
| `screens/auth/OAuthConsentScreen.tsx` | ✅ Updated |
| `screens/settings/SettingsScreen.tsx` | ✅ Updated |
| `screens/booking/BookingTypeScreen.tsx` | ✅ Updated |
| `components/forms/index.ts` | ✅ Updated |
| `components/cards/index.ts` | ✅ Updated |
| `components/display/ProgressIndicator.tsx` | ✅ Updated |
| `locales/en/auth.json` | ✅ Updated |
| `locales/de/auth.json` | ✅ Updated |
| `locales/en/settings.json` | ✅ Updated |
| `locales/de/settings.json` | ✅ Updated |
| `locales/en/booking.json` | ✅ Updated |
| `locales/de/booking.json` | ✅ Updated |

### UI Refinements Applied

Post-implementation refinements based on design review:

1. **ProgressIndicator** - Percentage hidden by default for `segments` variant
2. **All Steps** - Skip button added to top-right header position
3. **DateInput** - Removed duplicate calendar icon (uses native browser picker)
4. **GenderSelect** - Changed to 2x2 grid layout for better space utilization
5. **Step 2 (InsuranceSetupScreen)**:
   - Removed bottom "Skip for now" button (only header skip)
   - Updated info note to be more concise
6. **Step 3 (VerifyIntroScreen)**:
   - GDPR consent checkbox moved here from Step 2
   - Uses Tabler filled icon (`IconSquareCheckFilled`) for checked state
   - Header title changed to "Insurance Verify"
   - Bottom button text changed to "Do it later"
   - Removed skip button from header (only bottom "Do it later")
7. **Success Screen** - Removed "Access e-prescriptions" benefit (only 2 benefits shown)

### Not Implemented (Deferred)

| Item | Reason |
|------|--------|
| `components/verification/CardScanner.tsx` | Inline in CardScanScreen |
| `components/verification/ExtractedDataCard.tsx` | Inline in CardScanScreen |
| Family member verification | Out of scope for this iteration |

### Verification Checklist

- [x] Dev server runs without errors (HTTP 200 on port 5190)
- [x] No TypeScript errors in onboarding-related files
- [x] Email registration flow navigates to onboarding
- [x] OAuth flow navigates to onboarding
- [x] Skip behavior navigates to Home
- [x] Mock card scan works with extracted data
- [x] Settings shows verification alert banner when unverified
- [x] Booking flow shows verification gate modal when unverified
- [x] All translations present in EN and DE

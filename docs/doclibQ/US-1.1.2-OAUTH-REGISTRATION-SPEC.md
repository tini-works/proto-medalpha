# US 1.1.2: OAuth Registration (Google/Apple) - Implementation Spec

> **Epic**: 1.1 Onboarding
> **Status**: Not Implemented (0%)
> **Priority**: High (per user prioritization)
> **Scope**: UX/UI Mock (frontend only, no real OAuth integration)
> **Created**: 2026-01-30

---

## Component Reuse Summary

| Need | Existing Component | File Path |
|------|-------------------|-----------|
| OAuth buttons | `Button` (variant='secondary', leftIcon) | `components/ui/Button.tsx` |
| Insurance selection | `RadioGroup` | `components/forms/RadioGroup.tsx` |
| Screen layout | `Page` | `components/layout/Page.tsx` |
| Navigation header | `Header` (showBack) | `components/layout/Header.tsx` |
| Profile photo | `Avatar` (imageUrl, name) | `components/display/Avatar.tsx` |
| Loading states | `Button` (loading prop) | `components/ui/Button.tsx` |
| Error display | `EmptyState` | `components/display/EmptyState.tsx` |
| Progress steps | `ProgressIndicator` | `components/display/ProgressIndicator.tsx` |
| GDPR consent | **NEW**: Checkbox (simple HTML) | — |

**New Component Needed**: Simple `Checkbox` wrapper for consent (can be inline, ~20 lines)

---

## User Story

> **As a new patient**, I want to register with my Google or Apple account, to save time and avoid managing additional passwords.

## Acceptance Criteria

| # | Criterion | Mock Approach |
|---|-----------|---------------|
| 1 | OAuth 2.0 integration for Google and Apple Sign-In | **Mock**: Buttons trigger simulated flow |
| 2 | API processes OAuth tokens within 2 seconds | **Backend annotation** |
| 3 | Auto-import name, email, profile photo on success | **Mock**: Use hardcoded demo data |
| 4 | Request missing mandatory fields (insurance) after OAuth | **Mock**: Navigate to insurance request screen |
| 5 | Clear error message with manual registration fallback | **Mock**: Show error state UI |

---

## GDPR Compliance Requirements

From [GDPR-COMPLIANCE-GAP-ANALYSIS.md](GDPR-COMPLIANCE-GAP-ANALYSIS.md):

- OAuth consent must be explicit (GDPR Art. 6/7)
- Profile data imported requires disclosure of what's collected
- Marketing consent must be **separate** from registration consent
- Link to Privacy Policy required before OAuth buttons

---

## Screen Flow

```
WelcomeScreen                OAuthConsentScreen           InsuranceRequestScreen
┌─────────────┐              ┌─────────────┐              ┌─────────────┐
│ [Apple]     │──tap──>      │  DocliQ     │──Continue──> │  Welcome!   │
│ [Google]    │              │  ┌───────┐  │              │             │
│             │              │  │Name   │  │              │  Insurance: │
│ ──── OR ────│              │  │Email  │  │              │  ○ GKV      │
│             │              │  └───────┘  │              │  ○ PKV      │
│ [Email]     │              │ [Continue]  │              │  ○ Self-pay │
│             │              │  Cancel     │              │             │
│ Don't have? │              │             │              │  ☐ Consent  │
│ Create acct │              │ Terms...    │              │  [Continue] │
│             │              └─────────────┘              └─────────────┘
│ PRIVACY     │                    │                            │
│ LEGAL TERMS │                    │ Cancel                     │
└─────────────┘                    v                            v
                           WelcomeScreen                    HomeScreen
```

---

## Implementation Phases

### Phase 1: Update WelcomeScreen

**File**: `apps/docliQ-mobile/src/screens/auth/WelcomeScreen.tsx`

**UI Layout** (per design reference):
```
┌─────────────────────────────────┐
│         [DocliQ Logo]           │
│           DocliQ                │
│    Your platform for...         │
│                                 │
│  [Continue with Apple]   ← BLACK│
│  [Continue with Google]  ← WHITE│
│                                 │
│  ──────── OR ────────           │
│                                 │
│  [Sign in with Email]    ← TEAL │
│                                 │
│  Don't have an account?         │
│  Create account          ← link │
│                                 │
│  PRIVACY  LEGAL  TERMS   ← foot │
└─────────────────────────────────┘
```

**Key Changes**:
- Apple button FIRST (black bg)
- Google button SECOND (white bg, border)
- Single "Sign in with Email" button (teal)
- Add footer with legal links

---

### Phase 2: Create OAuthConsentScreen

**File**: `apps/docliQ-mobile/src/screens/auth/OAuthConsentScreen.tsx` (NEW)

**Purpose**: Show OAuth profile preview in modal-style card

**UI Layout**:
```
┌─────────────────────────────────┐
│    ┌───────────────────────┐    │
│    │   [DocliQ Logo]       │    │
│    │      DocliQ           │    │
│    │                       │    │
│    │ DocliQ would like to  │    │
│    │ access your account   │    │
│    │ information to        │    │
│    │ complete your profile │    │
│    │                       │    │
│    │ ┌─────────────────┐   │    │
│    │ │ 👤 FULL NAME    │   │    │
│    │ │ Max Mustermann  │   │    │
│    │ └─────────────────┘   │    │
│    │                       │    │
│    │ ┌─────────────────┐   │    │
│    │ │ ✉️ E-MAIL       │   │    │
│    │ │ max@gmail.com   │   │    │
│    │ └─────────────────┘   │    │
│    │                       │    │
│    │ ✓ Your data is safe   │    │
│    │   and encrypted       │    │
│    │                       │    │
│    │ [    Continue    ]    │    │
│    │      Cancel           │    │
│    │                       │    │
│    │ By continuing, you    │    │
│    │ accept the Privacy    │    │
│    │ Policy and Terms      │    │
│    └───────────────────────┘    │
└─────────────────────────────────┘
```

---

### Phase 3: Create InsuranceRequestScreen

**File**: `apps/docliQ-mobile/src/screens/auth/InsuranceRequestScreen.tsx` (NEW)

**Purpose**: Collect mandatory insurance info after OAuth

**UI Layout**:
```
┌─────────────────────────────────┐
│  ← Back                         │
│                                 │
│  [Profile Photo]  ← from OAuth  │
│  Welcome, Maria!  ← from OAuth  │
│  maria@gmail.com  ← from OAuth  │
│                                 │
│  Insurance Type *               │
│  ┌─────────────────────────┐    │
│  │ ○ Public Insurance (GKV)│    │
│  │ ○ Private Insurance (PKV│    │
│  │ ○ Self-pay              │    │
│  └─────────────────────────┘    │
│                                 │
│  ☐ I agree to data processing   │
│    Read Privacy Policy          │
│                                 │
│  [Continue]                     │
│                                 │
└─────────────────────────────────┘
```

---

### Phase 4: Create OAuthErrorScreen

**File**: `apps/docliQ-mobile/src/screens/auth/OAuthErrorScreen.tsx` (NEW)

**Purpose**: Error state with fallback options

---

### Phase 5: Update Routes

**File**: `apps/docliQ-mobile/src/routes/paths.ts`

```typescript
// OAuth flow
AUTH_OAUTH_CONSENT: '/auth/oauth-consent',
AUTH_OAUTH_ERROR: '/auth/oauth-error',
AUTH_INSURANCE_REQUEST: '/auth/insurance-request',

// Legal pages
LEGAL_PRIVACY: '/legal/privacy',
LEGAL_TERMS: '/legal/terms',
LEGAL_IMPRESSUM: '/legal/impressum',
```

---

### Phase 6: Update Types

**File**: `apps/docliQ-mobile/src/types/user.ts`

```typescript
export interface UserProfile {
  // ... existing fields
  photoUrl?: string
  authProvider?: 'email' | 'google' | 'apple'
}
```

---

### Phase 7: Add Translations

**Files**: `locales/en/auth.json`, `locales/de/auth.json`

```json
{
  "oauth": {
    "continueWithGoogle": "Continue with Google",
    "continueWithApple": "Continue with Apple",
    "signInWithEmail": "Sign in with Email",
    "or": "or",
    "privacyLink": "Privacy Policy",
    "termsLink": "Terms of Use",
    "and": "and"
  },
  "oauthConsent": {
    "description": "DocliQ would like to access your account information to complete your profile.",
    "securityMessage": "Your data is safe and encrypted with us.",
    "continue": "Continue",
    "cancel": "Cancel",
    "termsNotice": "By continuing, you accept the",
    "fromDocliQ": "from DocliQ."
  },
  "insuranceRequest": {
    "title": "Complete Your Profile",
    "welcome": "Welcome, {{name}}!",
    "insuranceLabel": "Insurance Type",
    "optionGKV": "Public Insurance (GKV)",
    "optionPKV": "Private Insurance (PKV)",
    "optionSelf": "Self-pay",
    "consent": "I agree to the processing of my data",
    "continue": "Continue"
  },
  "oauthError": {
    "title": "Unable to Sign In",
    "message": "We couldn't connect to {{provider}}. Please try again or use email instead.",
    "tryAgain": "Try Again",
    "useEmail": "Sign in with Email"
  }
}
```

---

## Mock Data

```typescript
const MOCK_GOOGLE_USER = {
  provider: 'google',
  name: 'Max Mustermann',
  email: 'max.mustermann@gmail.com',
  photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
}

const MOCK_APPLE_USER = {
  provider: 'apple',
  name: 'Anna Schmidt',
  email: 'anna.schmidt@icloud.com',
  photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna'
}
```

---

## Backend Annotations

The following items are **backend-only** and not part of this UI mock:

| Item | Note |
|------|------|
| OAuth 2.0 token exchange | Requires Google/Apple developer accounts |
| Token validation within 2s | Backend SLA requirement |
| Profile photo download/storage | CDN integration |
| CAPTCHA on OAuth endpoint | Bot protection |
| Rate limiting | Backend API gateway |

---

## Files Summary

### Create (6 files)
| File | Purpose |
|------|---------|
| `screens/auth/OAuthConsentScreen.tsx` | Profile preview modal |
| `screens/auth/InsuranceRequestScreen.tsx` | Post-OAuth insurance + consent |
| `screens/auth/OAuthErrorScreen.tsx` | Error state with fallback |
| `screens/auth/__tests__/OAuthConsentScreen.test.tsx` | Tests |
| `screens/auth/__tests__/InsuranceRequestScreen.test.tsx` | Tests |
| `screens/auth/__tests__/OAuthErrorScreen.test.tsx` | Tests |

### Modify (8 files)
| File | Changes |
|------|---------|
| `screens/auth/WelcomeScreen.tsx` | Add OAuth buttons, divider, footer |
| `routes/paths.ts` | Add 6 new routes |
| `routes/index.tsx` | Register new screens |
| `state/AppContext.tsx` | Add OAuth state + methods |
| `types/user.ts` | Add photoUrl, authProvider |
| `locales/en/auth.json` | Add OAuth translations |
| `locales/de/auth.json` | Add German translations |
| `test/golden/epic-1.1-onboarding.test.tsx` | Update to test real components |

---

## Verification Checklist

### Manual Testing
- [ ] Welcome Screen: Apple (black) + Google (white) buttons, OR divider, Email (teal)
- [ ] Google flow: Tap → Consent Screen → Continue → Insurance Request
- [ ] Apple flow: Tap → Consent Screen → Continue → Insurance Request
- [ ] Consent Screen: Shows name/email in styled cards, security message
- [ ] Insurance selection: GKV/PKV/Self-pay radio buttons work
- [ ] Consent required: Cannot continue without checkbox
- [ ] Navigation: All back buttons work correctly
- [ ] German translations: Switch language, verify all strings

### Automated Tests
- [ ] `epic-1.1-onboarding.test.tsx` passes
- [ ] `OAuthConsentScreen.test.tsx` passes
- [ ] `InsuranceRequestScreen.test.tsx` passes
- [ ] `OAuthErrorScreen.test.tsx` passes
- [ ] No TypeScript errors: `pnpm --filter docliQ-mobile typecheck`
- [ ] Lint passes: `pnpm --filter docliQ-mobile lint`

---

## Estimated Effort

| Task | Effort |
|------|--------|
| WelcomeScreen redesign | Medium |
| OAuthConsentScreen + tests | Low |
| InsuranceRequestScreen + tests | Medium |
| OAuthErrorScreen + tests | Low |
| Routes + State updates | Low |
| Translations (EN + DE) | Low |
| **Total** | **~4-5 hours** |

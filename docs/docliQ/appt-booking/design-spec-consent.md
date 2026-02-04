# Design Specification: Granular Data Usage Consent (US 1.8.3)

> **User Story**: As a patient, I want to granularly control for what purposes my data is used, to exercise my privacy rights.
> 
> **Current Coverage**: 25% (single checkbox) | **Target**: Full granular GDPR compliance

---

## Overview

Replace single GDPR checkbox with granular consent management featuring:
- **Three separate consents**: Necessary, Analytics, Marketing
- **Timestamps**: Stored with each consent change
- **Easy revocation**: As easy to revoke as to grant (GDPR Art. 7)
- **Settings integration**: Accessible from Privacy & Data screen

---

## Acceptance Criteria Mapping

| AC | Requirement | Design Solution | Priority |
|----|-------------|-----------------|----------|
| 1 | Separate opt-in checkboxes | 3-toggle interface | Critical |
| 2 | Editable anytime in settings | Privacy & Data screen section | Critical |
| 3 | API stores with timestamp | State structure with consentDate | Critical |
| 4 | Analytics withdrawal → anonymize | Post-revoke action | High |
| 5 | GDPR Art. 7: revoke = grant ease | Toggle switches, not modals | Critical |

---

## GDPR Compliance Notes

### Legal Requirements
- **Art. 7**: Consent must be freely given, specific, informed, unambiguous
- **Art. 7(3)**: As easy to withdraw as to give consent
- **Proof**: Must record when and what user consented to
- **Granularity**: Different purposes require separate consents

### UX Requirements
- No pre-ticked boxes (except strictly necessary)
- Clear language explaining each purpose
- Immediate effect when toggled (no "Save" barriers for revocation)
- Visual confirmation of current state

---

## Design Tokens

| Token | Usage | Value |
|-------|-------|-------|
| `$text-primary` | Headers, labels | `#1C2A30` |
| `$text-secondary` | Descriptions | `#5E7A86` |
| `$text-tertiary` | Timestamps | `#9CA3AF` |
| `$accent-primary` | Enabled toggles | `#13A3B5` |
| `$bg-surface` | Card background | `#FFFFFF` |
| `$bg-muted` | Locked/necessary | `#F3F4F6` |
| `$border-subtle` | Dividers | `#E5E7EB` |
| `$status-positive` | Enabled check | `#10B981` |
| `$status-warning` | Changed state | `#F59E0B` |

---

## Component Specifications

### 1. GranularConsentForm

**File**: `src/components/forms/GranularConsentForm.tsx`

**Use In**:
- ProfileCompletionScreen (during onboarding)
- PrivacyDataScreen (in settings)

**Props Interface**:
```typescript
interface ConsentState {
  necessary: boolean  // Always true, disabled
  analytics: boolean
  marketing: boolean
  timestamps: {
    necessary: string | null
    analytics: string | null
    marketing: string | null
  }
}

interface GranularConsentFormProps {
  consents: ConsentState
  onChange: (consents: ConsentState) => void
  variant: 'onboarding' | 'settings'  // Affects button placement
  showTimestamps?: boolean  // Show in settings only
}
```

**Visual Design**:

#### A. Onboarding Variant (ProfileCompletionScreen)

```
┌─────────────────────────────────────────┐
│ Complete Your Profile              3/4  │
├─────────────────────────────────────────┤
│                                         │
│ 📋 Data Usage Consent                   │
│                                         │
│ Control how your data is used. You can  │
│ change these anytime in Settings.       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☑️ Necessary              [locked]  │ │ ← Always on
│ │                                     │ │
│ │ Required for app functionality.     │ │
│ │ Includes: appointment booking,      │ │
│ │ doctor matching, account management │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☐ Analytics               [toggle]  │ │ ← Optional
│ │                                     │ │
│ │ Help us improve with usage data.    │ │
│ │ Anonymous analytics only.           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☐ Marketing Emails        [toggle]  │ │ ← Optional
│ │                                     │ │
│ │ Receive health tips, new features,  │ │
│ │ and partner offers.                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 💡 By continuing, you agree to our      │
│    Terms of Service and Privacy Policy  │
│                                         │
│           [Continue →]                  │
│                                         │
└─────────────────────────────────────────┘
```

**Specs - Onboarding**:
- **Card style**: Full-width, 16px padding, 12px radius
- **Header**: 18px, font-weight 600
- **Toggle**: iOS style, 52×32px
- **Description**: 13px, color `#5E7A86`, max 2 lines
- **Continue button**: Full-width, disabled until Necessary acknowledged

#### B. Settings Variant (PrivacyDataScreen)

```
┌─────────────────────────────────────────┐
│ Privacy & Data                          │
├─────────────────────────────────────────┤
│ [Encryption banner]                     │
├─────────────────────────────────────────┤
│ Your Information                        │
│ ├─ Download Health Data         →       │
│ ├─ Manage App Permissions       →       │
│ └─ Data Sharing                 →       │
├─────────────────────────────────────────┤
│ Consent Management                      │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☑️ Necessary              [locked]  │ │
│ │ ✓ Enabled (required)                │ │
│ │ Last updated: Jan 30, 2026, 2:30 PM │ │ ← Timestamp
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☑️ Analytics              [toggle]  │ │
│ │ ✓ Enabled                           │ │
│ │ Last updated: Jan 30, 2026, 2:30 PM │ │
│ │                                     │ │
│ │ [?] Help us improve with usage      │ │
│ │     data. Anonymous analytics only. │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ☐ Marketing Emails        [toggle]  │ │
│ │ ✗ Disabled                          │ │
│ │ Last updated: —                     │ │
│ │                                     │ │
│ │ [?] Receive health tips, new        │ │
│ │     features, and partner offers.   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 💡 GDPR Article 7: You can change       │
│    these settings at any time.          │
│                                         │
├─────────────────────────────────────────┤
│ [Reset All Data]                        │
└─────────────────────────────────────────┘
```

**Specs - Settings**:
- **Timestamp format**: Locale-aware (e.g., "Jan 30, 2026, 2:30 PM" or "30.01.2026, 14:30")
- **Status indicator**: Checkmark (✓) for enabled, cross (✗) for disabled
- **Toggle behavior**: Immediate save (no "Save" button)
- **Help icon**: [?] Tooltip with detailed explanation

---

### 2. ConsentToggle Component

**File**: `src/components/forms/ConsentToggle.tsx`

**Props**:
```typescript
interface ConsentToggleProps {
  id: string
  title: string
  description: string
  checked: boolean
  disabled?: boolean
  required?: boolean
  timestamp?: string | null
  onChange: (checked: boolean) => void
  variant?: 'default' | 'locked'
}
```

**States**:

| State | Visual | Interaction |
|-------|--------|-------------|
| Enabled | Toggle ON (teal), ✓ status | Can toggle OFF |
| Disabled | Toggle OFF (gray), ✗ status | Can toggle ON |
| Locked | Toggle ON (slate), 🔒 icon, gray bg | Cannot toggle |
| Changed | Orange dot indicator, "Save" appears | Save to persist |

**Accessibility**:
```typescript
role="switch"
aria-checked={checked}
aria-disabled={disabled}
aria-describedby={`${id}-description`}
```

---

### 3. ConsentConfirmationToast

**File**: `src/components/notifications/ConsentToast.tsx`

**Purpose**: Confirm consent changes without blocking UI

**Visual**:
```
┌─────────────────────────────────────────────┐
│ ✅ Analytics enabled                  [Undo]│
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⚠️ Marketing disabled                       │
│    You won't receive health tips            │
└─────────────────────────────────────────────┘
```

**Specs**:
- Position: Bottom-center, 16px from bottom
- Duration: 3 seconds
- Actions: "Undo" available for 5 seconds
- Color: Green for enable, Orange for disable

---

### 4. TimestampDisplay Component

**File**: `src/components/display/ConsentTimestamp.tsx`

**Logic**:
```typescript
const formatConsentDate = (date: string | null, locale: string): string => {
  if (!date) return '—'
  
  const d = new Date(date)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// German: "30. Jan. 2026, 14:30"
// English: "Jan 30, 2026, 2:30 PM"
```

---

## State Management

### A. Types Update

**File**: `src/types/user.ts`

```typescript
export interface ConsentRecord {
  enabled: boolean
  timestamp: string | null  // ISO date when last changed
}

export interface GdprConsent {
  // OLD - deprecate after migration
  dataProcessing: boolean
  marketingEmails?: boolean
  consentDate: string | null
  
  // NEW - granular consents
  granular: {
    necessary: ConsentRecord    // Always true
    analytics: ConsentRecord
    marketing: ConsentRecord
  }
}

export interface Profile {
  // ... existing fields
  gdprConsent: GdprConsent
}
```

### B. Migration Logic

**File**: `src/state/migrations/consentMigration.ts`

```typescript
export const migrateToGranularConsent = (old: GdprConsent): GdprConsent => {
  // Already migrated
  if (old.granular) return old
  
  const now = new Date().toISOString()
  
  return {
    ...old,
    granular: {
      necessary: {
        enabled: true,
        timestamp: old.consentDate || now
      },
      analytics: {
        enabled: old.dataProcessing || false,
        timestamp: old.dataProcessing ? old.consentDate : null
      },
      marketing: {
        enabled: old.marketingEmails || false,
        timestamp: old.marketingEmails ? old.consentDate : null
      }
    }
  }
}
```

### C. Context Actions

**File**: `src/state/AppContext.tsx`

```typescript
interface AppActions {
  // ... existing actions
  updateConsent: (type: 'analytics' | 'marketing', enabled: boolean) => void
  getConsentReport: () => ConsentReport  // For GDPR data export
}

// Implementation
const updateConsent = (type: 'analytics' | 'marketing', enabled: boolean) => {
  setState((s) => {
    const timestamp = new Date().toISOString()
    
    // Post-revoke actions
    if (!enabled && type === 'analytics') {
      // Trigger analytics anonymization
      anonymizeAnalyticsData(s.profile.id)
    }
    
    return {
      ...s,
      profile: {
        ...s.profile,
        gdprConsent: {
          ...s.profile.gdprConsent,
          granular: {
            ...s.profile.gdprConsent.granular,
            [type]: { enabled, timestamp }
          }
        }
      }
    }
  })
}
```

---

## Screen Integration

### A. ProfileCompletionScreen Update

**Replace existing single checkbox with full form**:

```typescript
// BEFORE
<div className="flex items-start gap-2">
  <input type="checkbox" ... />
  <label>{t('gdpr.consent')}...</label>
</div>

// AFTER
<GranularConsentForm
  consents={formState.consents}
  onChange={(consents) => setFormState(s => ({ ...s, consents }))}
  variant="onboarding"
/>

// Validation
const isValid = consents.granular.necessary.enabled  // Always true
```

### B. PrivacyDataScreen Update

**Add Consent Management section**:

```typescript
// In PrivacyDataScreen render
<div className="mt-6">
  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
    {t('consentManagement')}
  </h4>
  <GranularConsentForm
    consents={profile.gdprConsent.granular}
    onChange={handleConsentChange}
    variant="settings"
    showTimestamps
  />
</div>
```

---

## i18n Keys Required

**File**: `src/locales/en/profile.json`

```json
{
  "consent": {
    "title": "Data Usage Consent",
    "subtitle": "Control how your data is used. You can change these anytime in Settings.",
    "necessary": {
      "title": "Necessary",
      "description": "Required for app functionality. Includes: appointment booking, doctor matching, account management",
      "required": "Required"
    },
    "analytics": {
      "title": "Analytics",
      "description": "Help us improve with usage data. Anonymous analytics only.",
      "enabled": "Enabled",
      "disabled": "Disabled"
    },
    "marketing": {
      "title": "Marketing Emails",
      "description": "Receive health tips, new features, and partner offers.",
      "enabled": "Subscribed",
      "disabled": "Unsubscribed"
    },
    "lastUpdated": "Last updated: {{date}}",
    "notSet": "—",
    "gdprArticle7": "GDPR Article 7: You can change these settings at any time.",
    "continue": "Continue",
    "termsAgreement": "By continuing, you agree to our Terms of Service and Privacy Policy"
  }
}
```

**File**: `src/locales/en/settings.json`

```json
{
  "consentManagement": "Consent Management",
  "consentUpdated": "Consent preferences updated",
  "consentUndo": "Undo",
  "privacySettings": "Privacy Settings",
  "dataUsage": "Data Usage"
}
```

---

## GDPR Data Export

**For "Download Health Data" feature**:

```typescript
interface ConsentReport {
  generatedAt: string
  userId: string
  consents: {
    necessary: {
      status: 'enabled'
      purpose: 'App functionality'
      legalBasis: 'Contract performance (Art. 6(1)(b))'
      timestamp: string
    }
    analytics: {
      status: 'enabled' | 'disabled'
      purpose: 'Service improvement'
      legalBasis: 'Consent (Art. 6(1)(a))'
      timestamp: string | null
      history: Array<{action: 'granted' | 'revoked', timestamp: string}>
    }
    marketing: {
      status: 'enabled' | 'disabled'
      purpose: 'Marketing communications'
      legalBasis: 'Consent (Art. 6(1)(a))'
      timestamp: string | null
      history: Array<{action: 'subscribed' | 'unsubscribed', timestamp: string}>
    }
  }
}
```

---

## Testing Checklist

- [ ] 3 separate toggles visible
- [ ] Necessary toggle locked ON
- [ ] Timestamp appears after toggle
- [ ] Settings shows timestamps
- [ ] Analytics revoke triggers anonymization
- [ ] GDPR Art. 7 compliance (toggle = grant ease)
- [ ] Migration from old consent works
- [ ] i18n EN/DE complete
- [ ] Accessibility labels
- [ ] Consent included in data export

---

## Golden Tests (from epic-1.8-additional.test.tsx)

```typescript
it('1.8.3-a: consent-three-checkboxes - Necessary, Analytics, Marketing separate', () => {
  render(<GranularConsentForm ... />)
  expect(screen.getByTestId('consent-necessary')).toBeChecked()
  expect(screen.getByTestId('consent-necessary')).toBeDisabled()
  expect(screen.getByTestId('consent-analytics')).toBeInTheDocument()
  expect(screen.getByTestId('consent-marketing')).toBeInTheDocument()
})

it('1.8.3-b: consent-editable-in-settings - Can change consents in settings', async () => {
  // Start with analytics enabled
  render(<GranularConsentForm variant="settings" consents={{...}} />)
  
  // Toggle off
  await user.click(screen.getByTestId('consent-analytics'))
  expect(screen.getByTestId('consent-analytics')).not.toBeChecked()
  
  // Verify timestamp updated
  expect(screen.getByText(/Last updated:/)).toBeInTheDocument()
})

it('1.8.3-c: consent-timestamp-stored - Timestamp recorded on change', () => {
  const before = Date.now()
  act(() => updateConsent('marketing', true))
  const after = Date.now()
  
  const timestamp = store.getState().profile.gdprConsent.granular.marketing.timestamp
  expect(new Date(timestamp).getTime()).toBeGreaterThanOrEqual(before)
  expect(new Date(timestamp).getTime()).toBeLessThanOrEqual(after)
})

it('1.8.3-d: consent-analytics-revoke-anonymize - Revoking analytics triggers anonymization', () => {
  const anonymizeSpy = jest.spyOn(analytics, 'anonymizeUserData')
  
  updateConsent('analytics', false)
  
  expect(anonymizeSpy).toHaveBeenCalledWith(userId)
})

it('1.8.3-e: consent-gdpr-art7-easy-revoke - Toggle is as easy as checkbox', async () => {
  // Grant consent
  await user.click(screen.getByTestId('consent-marketing'))
  expect(screen.getByTestId('consent-marketing')).toBeChecked()
  
  // Revoke consent (same interaction)
  await user.click(screen.getByTestId('consent-marketing'))
  expect(screen.getByTestId('consent-marketing')).not.toBeChecked()
  
  // No modal, no extra steps
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
```

---

## Implementation Files

| File | Action | Lines |
|------|--------|-------|
| `src/types/user.ts` | Update GdprConsent interface | +25 |
| `src/state/migrations/consentMigration.ts` | **NEW** migration | ~30 |
| `src/state/AppContext.tsx` | Add granular consent actions | +40 |
| `src/components/forms/ConsentToggle.tsx` | **NEW** | ~60 |
| `src/components/forms/GranularConsentForm.tsx` | **NEW** | ~120 |
| `src/components/display/ConsentTimestamp.tsx` | **NEW** | ~20 |
| `src/components/notifications/ConsentToast.tsx` | **NEW** | ~40 |
| `src/screens/profile/ProfileCompletionScreen.tsx` | Replace checkbox | +10 |
| `src/screens/settings/PrivacyDataScreen.tsx` | Add section | +15 |
| `src/locales/en/profile.json` | Add keys | +25 |
| `src/locales/de/profile.json` | Add keys | +25 |

**Total New Code**: ~450 lines
**Estimated Time**: 6-8 hours (including GDPR compliance review)

---

## Post-Implementation GDPR Checklist

- [ ] Legal review of consent text
- [ ] Data processing agreement (DPA) with analytics provider
- [ ] Anonymization procedure documented
- [ ] Consent history retention policy (recommend: 7 years)
- [ ] User request procedure for consent export
- [ ] Cookie/tracking disclosure updated

---

*Document Version: 1.0 | Created: 2026-01-30 | Author: UX Design*  
*Related: US 1.8.3, GDPR Art. 6-7, Golden Tests epic-1.8-additional.test.tsx*
# Compliance UI Gap Analysis: DocliQ N3 App

> **Date:** 2026-01-29
> **Scope:** GDPR + Germany-specific legal requirements for digital health apps
> **App:** appointment-booking-N3

---

## Executive Summary

The DocliQ N3 app has a **foundation** for GDPR compliance with basic consent collection and a Privacy & Data settings screen. However, **critical legal pages are missing** (Privacy Policy, Terms of Service, Impressum) and **cookie consent is absent** - both carrying significant legal risk in Germany.

---

## Current Implementation Summary

| Feature | Status | Location |
|---------|--------|----------|
| GDPR Consent (basic) | ✅ Exists | `src/screens/profile/ProfileCompletionScreen.tsx:176-195` |
| Privacy & Data screen | ✅ Exists | `src/screens/settings/PrivacyDataScreen.tsx` |
| Encryption status banner | ✅ Exists | `src/screens/settings/PrivacyDataScreen.tsx:30-39` |
| Data deletion button | ✅ Exists | `src/screens/settings/PrivacyDataScreen.tsx:101-113` |
| GDPR consent data model | ✅ Exists | `src/types/user.ts:36-40` |

---

## 🔴 Critical Gaps (Legal Risk)

| Gap | Compliance Requirement | Current State | Mock Priority |
|-----|----------------------|---------------|---------------|
| **No Privacy Policy page** | GDPR Art. 12-14 | Button exists but links to `#` (line 98, line 187) | **P0** |
| **No Terms of Service page** | Consumer protection | Completely missing | **P0** |
| **No Impressum page** | German TMG §5 (€50k fine) | Completely missing | **P0** |
| **No Cookie Consent banner** | TTDSG §25 (€300k fine) | No cookie management UI anywhere | **P0** |
| **No global legal footer** | Accessibility requirement | Legal pages only via deep Settings navigation | **P1** |

### Legal Penalties Reference

| Violation | Maximum Fine |
|-----------|-------------|
| GDPR breach | €20M or 4% global revenue |
| Missing Impressum | €50,000 |
| Cookie consent violation | €300,000 |

---

## 🟠 Medium Gaps (Incomplete Features)

| Gap | Compliance Requirement | Current State | Mock Priority |
|-----|----------------------|---------------|---------------|
| **Marketing consent not collected** | GDPR Art. 6/7 | Field exists in data model (`marketing: boolean`) but never shown to user | **P1** |
| **Download Health Data - no action** | GDPR Art. 20 (portability) | Button exists but no `onClick` handler (line 46) | **P1** |
| **Manage App Permissions - no action** | GDPR Art. 7 | Button exists but no `onClick` handler (line 60) | **P2** |
| **Data Sharing - no action** | GDPR Art. 13-14 | Button exists but no `onClick` handler (line 74) | **P1** |
| **No third-party processors list** | GDPR Art. 13(1)(e) | No disclosure of who receives data | **P1** |
| **No consent withdrawal UI** | GDPR Art. 7(3) | Can't revoke specific consents; only "Reset All" option | **P2** |

---

## 🟡 Lower Priority Gaps

| Gap | Compliance Requirement | Current State |
|-----|----------------------|---------------|
| **No data rectification request flow** | GDPR Art. 16 | Users can edit profile but no formal request mechanism |
| **No consent version tracking** | GDPR accountability | `consentDate` exists but no version/policy tracking |
| **No activity/audit log** | GDPR Art. 30 | No user-facing history of data access |
| **No data breach notification UI** | GDPR Art. 33-34 | No mechanism to display breach alerts |
| **No right to restriction UI** | GDPR Art. 18 | No "pause processing" option |
| **No device/session management** | Security best practice | No way to view/revoke active sessions |

---

## UI Screens Needed for Mocking

### P0 - Must Have (Legal Risk)

#### 1. Privacy Policy Screen (`/legal/privacy`)
- Full privacy policy text (EN/DE)
- Sections: data collected, purposes, retention, rights, contacts
- Link from: consent checkbox, Privacy & Data screen, footer

#### 2. Terms of Service Screen (`/legal/terms`)
- Service terms, user responsibilities, limitations
- Link from: registration, footer

#### 3. Impressum Screen (`/legal/impressum`)
Required content:
- Company name and legal structure
- Full address (no P.O. boxes)
- Contact details (phone, email)
- Commercial register number
- VAT identification number
- Responsible person for content
- Regulatory authority (if licensed)

Must be accessible from every screen (footer).

#### 4. Cookie Consent Banner (global component)
- Shows on first visit
- Essential/Analytics/Marketing toggles
- Accept All / Reject All / Customize buttons
- Link to Cookie Policy

#### 5. Cookie Policy Screen (`/legal/cookies`)
- List of cookies with purposes & durations
- Third-party cookies disclosure

#### 6. Global Legal Footer (component)
- Links: Privacy Policy | Terms | Impressum | Cookie Settings
- Visible on all screens

### P1 - Should Have

#### 7. Data Export Screen (`/settings/privacy/export`)
- Request data export
- Format selection (JSON/PDF)
- Processing status/download link

#### 8. Data Sharing Management Screen (`/settings/privacy/sharing`)
- List of third parties with access
- Toggle sharing on/off per party
- Last accessed timestamps

#### 9. Marketing Consent Toggle
- Add to Profile Completion screen
- Add to Notifications settings

#### 10. Consent Management Screen (`/settings/privacy/consents`)
- View all given consents
- Withdraw specific consents
- Consent history with dates

### P2 - Nice to Have

#### 11. Data Subject Access Request Form (`/settings/privacy/request`)
- Request type: Access / Rectify / Delete / Restrict
- Status tracking

#### 12. Session Management (`/settings/security/sessions`)
- Active devices list
- Sign out other devices

---

## Data Model Gaps

### Current `gdprConsent` in `src/types/user.ts:36-40`:

```typescript
gdprConsent: {
  dataProcessing: boolean    // ✅ collected
  marketing: boolean         // ⚠️ exists but never collected
  consentDate: string | null // ✅ tracked
}
```

### Suggested additions for mock:

```typescript
gdprConsent: {
  dataProcessing: boolean
  marketing: boolean
  analytics: boolean          // ❌ missing - for cookie consent
  thirdPartySharing: boolean  // ❌ missing - for data sharing
  consentDate: string | null
  policyVersion: string       // ❌ missing - track which policy was agreed
  cookiePreferences: {        // ❌ missing - for TTDSG
    essential: boolean
    analytics: boolean
    marketing: boolean
  }
}
```

---

## Routes Needed

Add to `src/routes/paths.ts`:

```typescript
// Legal
LEGAL_PRIVACY: '/legal/privacy',
LEGAL_TERMS: '/legal/terms',
LEGAL_IMPRESSUM: '/legal/impressum',
LEGAL_COOKIES: '/legal/cookies',

// Extended Privacy
SETTINGS_PRIVACY_EXPORT: '/settings/privacy/export',
SETTINGS_PRIVACY_SHARING: '/settings/privacy/sharing',
SETTINGS_PRIVACY_CONSENTS: '/settings/privacy/consents',
SETTINGS_PRIVACY_REQUEST: '/settings/privacy/request',
```

---

## Implementation Effort Summary

| Screen | Effort | Legal Priority |
|--------|--------|----------------|
| Privacy Policy | Low (static content) | **Required** |
| Terms of Service | Low (static content) | **Required** |
| Impressum | Low (static content) | **Required (Germany)** |
| Cookie Banner + Policy | Medium | **Required (Germany)** |
| Global Footer | Low | High |
| Data Export flow | Medium | High |
| Data Sharing screen | Medium | High |
| Consent Management | Medium | Medium |
| Marketing consent in registration | Low | Medium |

---

## Compliance Requirements Reference

### GDPR User Rights (Art. 12-22)

| Right | What User Can Retrieve/Request |
|-------|-------------------------------|
| **Right of Access** (Art. 15) | Full copy of all personal data in accessible format |
| **Right to Data Portability** (Art. 20) | Data in structured, machine-readable format (JSON, CSV) |
| **Right to Rectification** (Art. 16) | Correction of inaccurate data |
| **Right to Erasure** (Art. 17) | Deletion of data (with healthcare retention exceptions) |
| **Right to Restriction** (Art. 18) | Pause processing while disputes resolved |
| **Right to Object** (Art. 21) | Opt-out of specific processing |
| **Right to Explanation** (Art. 22) | Information about automated decision logic |

### Privacy Policy Required Disclosures (GDPR Art. 13-14)

1. Data controller identity & contact details
2. Data Protection Officer contact (if applicable)
3. Categories of personal data collected
4. Purposes of processing + legal basis
5. Recipients/third parties receiving data
6. International data transfers + safeguards
7. Retention periods
8. User rights
9. Automated decision-making/profiling explanation
10. Right to lodge complaint with supervisory authority

### Germany-Specific: Impressum Requirements (TMG §5)

- Company name and legal structure
- Full address
- Contact details (phone, email)
- Commercial register number
- VAT identification number
- Responsible person for content
- Regulatory authority (if licensed)

### Germany-Specific: Cookie Consent (TTDSG §25)

- Prior consent required before non-essential cookies
- Clear information about purposes and duration
- Equal Accept/Reject options (no dark patterns)
- Easy withdrawal mechanism

---

## Sources

- [ICLG Digital Health Germany 2025-2026](https://iclg.com/practice-areas/digital-health-laws-and-regulations/germany)
- [BfArM DiGA Requirements](https://www.bfarm.de/EN/Medical-devices/Tasks/DiGA-and-DiPA/Digital-Health-Applications/Interesting-facts/_artikel.html)
- [CMS Expert Guide - Digital Health Apps Germany](https://cms.law/en/int/expert-guides/cms-expert-guide-to-digital-health-apps-and-telemedicine/germany)
- [GDPR Privacy Notice Guide](https://gdpr.eu/privacy-notice/)
- [Germany Cookie Consent Requirements](https://www.cookieyes.com/blog/cookie-consent-requirements-germany/)
- [IONOS Impressum Guide](https://www.ionos.com/digitalguide/websites/digital-law/a-case-for-thinking-global-germanys-impressum-laws/)
- [Promon DiGA Security 2025](https://promon.io/security-news/digital-health-applications-diga-germany-data-security-2025)

# Implementation Status Report

> **Generated:** 2026-02-03
> **Compared:** `docs/scope-for-exploration-v3 (design).md` vs `apps/docliQ-mobile/`

## Summary

| Epic | Stories | Implemented | Partial | Not Started |
|------|---------|-------------|---------|-------------|
| 1.1 Onboarding | 5 | 1 | 2 | 2 |
| 1.2 Appointment Booking | 10 | 5 | 3 | 2 |
| 1.3 Post-Appointment | 1 | 0 | 0 | 1 |
| 1.4 Account Management | 2 | 1 | 1 | 0 |
| 1.5 Practice Changes | 1 | 0 | 1 | 0 |
| 1.6 Content Management | 1 | 0 | 0 | 1 |
| 1.7 Administration | 2 | 0 | 0 | 2 |
| 1.8 Additional | 4 | 0 | 1 | 3 |

**Overall Progress:** ~32% complete (aligns with design doc coverage estimate)

### Mock prototype scope

Features marked **\[MOCK SKIP: backend]** or **\[MOCK SKIP: technical]** are out of scope for this mock prototype: no implementation needed. Implement only user-facing flows with mock data.

---

## Implemented (Fully or Mostly)

### US 1.1.1: Prominent Appointment Booking on Home Screen

**Status:** Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| "Book Appointment" visible within 3 seconds | ✅ Prominent on HomeScreen |
| Button takes 20%+ of visible area | ✅ Large CTA button |
| Legal info accessible via menu | ✅ Settings → Legal (Privacy, Terms, Impressum) |
| Home screen loads within 5 seconds on slow connections | ✅ Vite + React SPA, fast loading |

**Implementation:** `HomeScreen.tsx`, `SettingsScreen.tsx`, legal screens

---

### US 1.2.1: Book Appointment by Specialty

**Status:** Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| API returns list of specialties | ✅ `SpecialtySearchInput` with autocomplete |
| Error message with "Retry" on timeout | ✅ Error handling in booking flow |

**Implementation:** Full booking flow via `SearchScreen.tsx` → `AvailabilityScreen.tsx` → `LocationScreen.tsx` → `ResultsScreen.tsx` → `DoctorProfileScreen.tsx` → `SlotSelectionScreen.tsx` → `ConfirmScreen.tsx`

---

### US 1.2.4: Book Appointments for Dependents

**Status:** Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Add up to 5 dependent persons | ✅ `FamilyMembersScreen` |
| Store name, DOB, health insurance | ✅ Full family member data model |
| "Who is the appointment for?" dropdown | ✅ `PatientSelector` component |
| API sends patient data to practice | ✅ Selected patient in booking context |
| GDPR: Dependents deletable separately | ✅ Delete option in `FamilyMemberDetailScreen` |

**Implementation:** `FamilyMembersScreen.tsx`, `FamilyMemberDetailScreen.tsx`, `AddFamilyMemberSheet.tsx`, `PatientSelector.tsx`

---

### US 1.2.5: Real-Time Appointment Status

**Status:** Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Status displayed: In Progress, Confirmed, Rejected | ✅ `matching`, `await_confirm`, `confirmed`, `cancelled_*` |
| Push notification on status change | ⚠️ UI ready, no push **[MOCK SKIP: backend]** |
| API polls every 60s or uses webhooks | ✅ Mock polling in `MatchingStatusScreen` |
| Timestamp of last update displayed | ✅ Timestamp in appointment data |
| Rejection reason displayed | ✅ Cancellation reason stored |

**Implementation:** `MatchingStatusScreen.tsx`, `AppointmentCard.tsx`, status badges

---

### US 1.2.9: Modify Confirmed Appointment

**Status:** Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Modification possible up to 24h before | ⚠️ UI allows, no time restriction enforced |
| Old appointment canceled via API | ✅ Reschedule flow handles this |
| New search parameters entry | ✅ `SuggestedSlotsScreen` offers alternatives |
| Old appointment marked as "Modified" | ✅ Status tracking |
| Confirmation email sent | ❌ No email **[MOCK SKIP: backend]** |

**Implementation:** `SuggestedSlotsScreen.tsx` → `RescheduleReasonScreen.tsx` → `RescheduleConfirmScreen.tsx` → `RescheduleSuccessScreen.tsx`

---

## Partially Implemented

### US 1.1.3: Email/Password Registration

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| OWASP password standards | ⚠️ `PasswordStrengthIndicator` exists, not fully OWASP |
| Real-time password validation | ✅ Visual strength indicator |
| Email verification via token (24h validity) | ❌ Mock only |
| CAPTCHA protection | ❌ Not implemented |
| Confirmation email within 60s | ❌ No email integration |

**Implementation:** `RegisterScreen.tsx`, `PasswordField.tsx`, `PasswordStrengthIndicator.tsx`

**Remaining Work:**
- Implement OWASP-compliant password rules
- Add CAPTCHA (reCAPTCHA or hCaptcha) **[MOCK SKIP: backend]**
- Email verification with actual token system **[MOCK SKIP: backend]**
- Email delivery integration **[MOCK SKIP: backend]**

---

### US 1.2.3: Select Appointment Type

**Status:** 25% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Three types: Acute, Prevention, Follow-Up | ⚠️ Fast-Lane = Acute, others not explicit |
| Acute: Symptom description (min 10 chars) | ❌ Not enforced |
| Prevention: Dropdown for reasons | ❌ Not implemented |
| Follow-Up: Reference to previous appointment | ❌ Not implemented |
| API transmits appointment type | ⚠️ Partial (booking type only) |

**Implementation:** `BookingTypeScreen.tsx`, `CareRequestScreen.tsx`

**Remaining Work:**
- Add explicit Prevention/Follow-Up types
- Enforce symptom description minimum length
- Prevention reason dropdown
- Follow-up appointment reference selector

---

### US 1.2.6: Export Appointment to Calendar

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Export as .ics file | ❌ Not implemented |
| .ics contains date, time, doctor, address, phone | ❌ No .ics generation |
| Export button only for "Confirmed" | ✅ `AddToCalendarSheet` conditional |
| Deep-link for Google/Apple Calendar | ❌ Not implemented |
| Server-side .ics generation | ❌ Not implemented |

**Implementation:** `AddToCalendarSheet.tsx` (UI only)

**Remaining Work:**
- Implement .ics file generation (server-side or client-side)
- Add calendar deep-links **[MOCK SKIP: technical/native integration]**
- Test with Google Calendar, Apple Calendar, Outlook **[MOCK SKIP: technical]**

---

### US 1.2.8: Appointment List Overview

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Two tabs: Upcoming and Past | ⚠️ Has Upcoming/Pending/Cancelled, no "Past" |
| Show date, time, doctor, specialty, status | ✅ All displayed |
| Sorted by date | ✅ Implemented |
| Filter by doctor, specialty, status | ❌ Not implemented |
| Tap opens detail view | ✅ `AppointmentDetailScreen` |

**Implementation:** `HistoryScreen.tsx`, `HistoryCard.tsx`

**Remaining Work:**
- Add "Past/Completed" tab
- Implement filter options (doctor, specialty, status)
- Sort options (ascending/descending)

---

### US 1.2.10: Cancel Appointment

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Cancellation up to 24h before | ❌ No time restriction |
| API called immediately | ✅ Mock API call |
| Confirmation email sent | ❌ No email **[MOCK SKIP: backend]** |
| Canceled appointments marked in history | ✅ `cancelled_patient` status |

**Implementation:** `CancelAppointmentSheet.tsx`

**Remaining Work:**
- Enforce 24h cancellation window
- Email confirmation integration **[MOCK SKIP: backend]**
- API integration for real cancellation **[MOCK SKIP: backend]**

---

### US 1.4.2: Change Password

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Requires old password entry | ⚠️ UI exists, mock validation |
| New password meets OWASP standards | ⚠️ Basic validation only |
| Confirmation email sent | ❌ Not implemented |
| "Forgot password" with token reset | ⚠️ UI exists, no backend |
| Rate limiting: Max 5 changes/day | ❌ Not implemented |

**Implementation:** `ChangePasswordScreen.tsx`, `ForgotPasswordScreen.tsx`, `ResetPasswordScreen.tsx`

**Remaining Work:**
- Backend integration for password change **[MOCK SKIP: backend]**
- Email confirmation **[MOCK SKIP: backend]**
- Implement rate limiting **[MOCK SKIP: backend]**
- Token-based password reset **[MOCK SKIP: backend]**

---

### US 1.5.1: Practice-Initiated Appointment Changes

**Status:** 50% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Practice sends changes to Curaay | ❌ No API integration |
| Changes forwarded within 60 seconds | ❌ No real-time sync |
| Push notification to patient | ❌ No push integration |
| Appointment updated (Modified by Practice) | ✅ Status supported in data model |
| Retry after 5 minutes on error | ❌ Not implemented |

**Implementation:** Appointment status model supports this

**Remaining Work:**
- Practice API integration **[MOCK SKIP: backend]**
- Webhook handling **[MOCK SKIP: backend]**
- Push notification integration **[MOCK SKIP: backend]**
- Retry logic **[MOCK SKIP: technical]**

---

### US 1.8.3: Granular Data Usage Consent

**Status:** 25% Complete

| Acceptance Criteria | Status |
|---------------------|--------|
| Separate opt-in: Necessary, Analytics, Marketing | ✅ `ConsentManagementScreen` |
| Consents changeable in settings | ✅ Implemented |
| API stores consents with timestamp | ❌ No backend storage |
| Analytics withdrawal anonymizes data | ❌ Not implemented |
| GDPR Art. 7: Easy revocation | ✅ Toggle-based UI |

**Implementation:** `ConsentManagementScreen.tsx`, `CookieConsentBanner.tsx`

**Remaining Work:**
- Backend storage with timestamps **[MOCK SKIP: backend]**
- Data anonymization on consent withdrawal **[MOCK SKIP: backend]**
- Audit trail for consent changes **[MOCK SKIP: backend]**

---

## Not Implemented

### US 1.1.2: OAuth Registration (Google/Apple)

**Status:** 0% Complete  
**Mock:** UI shells exist; real OAuth/SDK/token handling is **[MOCK SKIP: backend]**.

| What Exists | What's Missing |
|-------------|----------------|
| `OAuthConsentScreen.tsx` (UI shell) | OAuth 2.0 integration |
| `OAuthErrorScreen.tsx` (UI shell) | Google Sign-In SDK |
| `GoogleGIcon.tsx` component | Apple Sign-In SDK |
| | Token processing (<2s) |
| | Profile data import |
| | Missing field collection |
| | Error handling with fallback |

**Work Required:**
- Integrate Google Sign-In (Expo Google Auth or Firebase)
- Integrate Apple Sign-In (Expo Apple Auth)
- Handle OAuth tokens and profile data
- Build missing field collection flow

---

### US 1.1.4: SMS Phone Number Verification

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: backend]** — SMS gateway, OTP generation, rate limiting are backend/infra; UI can stay as mock.

| What Exists | What's Missing |
|-------------|----------------|
| `VerifyPhoneScreen.tsx` (UI only) | SMS gateway integration (Twilio) |
| Phone input with country code | 6-digit OTP generation |
| | 10-minute validity |
| | Resend after 3 minutes |
| | Rate limiting (3/hour) |
| | International number support |

**Work Required:**
- Integrate SMS provider (Twilio, AWS SNS, etc.)
- OTP generation and validation backend
- Rate limiting implementation
- International phone number support

---

### US 1.1.5: Biometric Authentication

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: technical]** — Native Face-ID/Touch-ID, PIN fallback, secure storage; UI toggle can stay as mock.

| What Exists | What's Missing |
|-------------|----------------|
| `BiometricsScreen.tsx` (toggle only) | Face-ID/Touch-ID integration |
| Preference storage | PIN fallback after 3 failures |
| | 5-minute inactivity timeout |
| | Local-only biometric storage |

**Work Required:**
- Expo LocalAuthentication integration
- PIN/password fallback system
- Session timeout handling
- Secure local storage

---

### US 1.2.2: Save Favorite Doctors

**Status:** 0% Complete

| What Exists | What's Missing |
|-------------|----------------|
| Doctor data model | Favorites list storage |
| `DoctorCard.tsx` | "My Doctors" UI section |
| | Add/remove favorites |
| | Sort by last booking |
| | GDPR deletion handling |

**Work Required:**
- Add favorites array to user profile
- "My Doctors" section in booking flow
- Favorite toggle on doctor cards
- Auto-add after booking

---

### US 1.2.7: Appointment Reminders

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: backend/technical]** — Push/FCM, scheduling, email fallback are backend; reminder preferences UI can stay as mock.

| What Exists | What's Missing |
|-------------|----------------|
| Notification preferences screen | Push notification integration |
| | 72h and 24h reminder scheduling |
| | Quick actions (Confirm/Cancel) |
| | Email reminder parallel |
| | Fallback when push disabled |

**Work Required:**
- Expo Notifications or Firebase Cloud Messaging
- Reminder scheduling system
- Quick action deep-links
- Email integration

---

### US 1.3.1: Automatic Feedback Request

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: backend]** for push/email trigger and storage; implement only feedback form UI + mock submit for prototype.

| What Exists | What's Missing |
|-------------|----------------|
| Nothing | Push notification 1h after appointment |
| | Star rating (1-5) form |
| | Optional free-text comments |
| | Email fallback |
| | GDPR-compliant storage |

**Work Required:**
- Feedback form UI
- Post-appointment trigger system
- Rating storage (anonymous to practice)
- Push/email notification

---

### US 1.4.1: Complete Account Deletion

**Status:** 80% Complete (UI/Flow complete, backend integration is mock)

| Acceptance Criteria | Status |
|---------------------|--------|
| Warning with consequences | ✅ `DeleteWarningModal` with healthcare-specific consequences |
| Double opt-out (email confirmation) | ✅ `DeleteEmailConfirmScreen` with mock confirmation |
| Data deletion within 72h | ✅ 72-hour countdown with `PendingDeletionBanner` |
| Automatic appointment cancellation | ⚠️ Warning shown but backend cleanup is **[MOCK SKIP: backend]** |
| GDPR Art. 17 confirmation email | ❌ **[MOCK SKIP: backend]** |
| Cancel deletion during 72h window | ✅ Cancel flow with confirmation modal |

**Implementation:**
- `DeleteWarningModal.tsx` - Shows healthcare-specific deletion consequences
- `DeleteEmailConfirmScreen.tsx` - Email confirmation flow with mock button
- `PendingDeletionBanner.tsx` - 72-hour countdown banner shown on all main screens
- `PrivacyDataScreen.tsx` - Updated with new deletion flow
- `HomeScreen.tsx`, `HistoryScreen.tsx`, `SettingsScreen.tsx` - Integrated banner
- `useDeletionExpiryCheck.ts` - Checks deletion expiry on app startup
- Full localization (EN/DE)

**Remaining Work (Backend only):**
- Actual email delivery **[MOCK SKIP: backend]**
- Real appointment cancellation on deletion **[MOCK SKIP: backend]**
- Backend data deletion API **[MOCK SKIP: backend]**

---

### US 1.6.1: Edit Home Screen Content (CMS)

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: backend]** — Admin auth, WYSIWYG, versioning are backend/admin; app can keep using mock CMS data.

| What Exists | What's Missing |
|-------------|----------------|
| `apiGetCMSContent()` mock | Admin authentication |
| CMS data display | WYSIWYG editor |
| | Preview function |
| | Content versioning |

**Work Required:**
- Admin panel application
- WYSIWYG editor integration
- Content management backend
- Preview and publish workflow

---

### US 1.7.1: Maintenance Mode

**Status:** 0% Complete  
**Mock:** Admin panel and status check are **[MOCK SKIP: backend]**; implement only in-app maintenance notice + booking block (e.g. feature flag or mock response) for prototype.

| What Exists | What's Missing |
|-------------|----------------|
| Nothing | Admin panel toggle **[MOCK SKIP: backend]** |
| | Customizable notice display |
| | Booking restriction |
| | Existing appointment visibility |
| | Status check on app launch **[MOCK SKIP: backend]** |

**Work Required:**
- Admin panel with maintenance toggle **[MOCK SKIP: backend]**
- App-wide maintenance notice (in scope for mock)
- Booking flow blocking (in scope for mock)
- Status check on app launch **[MOCK SKIP: backend]**

---

### US 1.7.2: Detailed Log Viewing

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: technical]** — Entirely admin/infra (log storage, logrotate, anonymization, export); no patient-facing value for prototype.

| What Exists | What's Missing |
|-------------|----------------|
| Nothing | Log storage system |
| | Anonymized user-ID |
| | 90-day logrotate |
| | Filter options |
| | CSV export |

**Work Required:**
- Logging infrastructure
- Admin log viewer
- GDPR-compliant anonymization
- Export functionality

---

### US 1.8.1: Intelligent API Error Code Processing

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: technical]** — Retry, rate-limit parsing, centralized logging are integration/infra; keep basic in-app error messages for prototype.

---

### US 1.8.2: Offline Appointment Viewing

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: technical]** — Local DB, sync, offline-first architecture; prototype can rely on online + existing offline notice.

| What Exists | What's Missing |
|-------------|----------------|
| `useOnlineStatus()` hook | Local database (SQLite/Realm) |
| `OfflineBookingSheet.tsx` | Appointment caching |
| Online status detection | Offline notice |
| | Auto-sync within 10s |

**Work Required:**
- Local database setup (SQLite or AsyncStorage)
- Appointment sync logic
- Offline-first architecture
- Sync indicator UI

---

### US 1.8.4: Client-Side API Rate Limiting

**Status:** 0% Complete  
**Mock:** **[MOCK SKIP: technical]** — Request counting, queue, abuse detection, admin metrics are infra only; no UX value for prototype.

---

## Out of scope for mock prototype (summary)

| Type | User story / item | Reason |
|------|-------------------|--------|
| **Technical** | US 1.7.2 Detailed Log Viewing | Admin/infra only; no patient UI |
| **Technical** | US 1.8.1 Intelligent API Error Code Processing | Retry, rate-limit, centralized logging |
| **Technical** | US 1.8.2 Offline Appointment Viewing | Local DB, sync, offline-first (use online + notice for mock) |
| **Technical** | US 1.8.4 Client-Side API Rate Limiting | Request counting, queue, admin metrics |
| **Technical** | US 1.1.5 Biometric Authentication | Native Face-ID/Touch-ID, secure storage (UI toggle can stay) |
| **Backend** | US 1.1.2 OAuth (real integration) | Token handling, SDKs; UI shells can stay |
| **Backend** | US 1.1.4 SMS Phone Verification | SMS gateway, OTP, rate limiting; UI can stay |
| **Backend** | US 1.2.7 Appointment Reminders (delivery) | Push/FCM, scheduling, email; preferences UI can stay |
| **Backend** | US 1.3.1 Feedback (trigger/storage) | Push/email trigger, storage; form UI in scope |
| **Backend** | US 1.4.1 Account Deletion (execution) | Double opt-out, 72h deletion, cleanup; deletion UI in scope |
| **Backend** | US 1.6.1 CMS (admin/versioning) | Admin auth, WYSIWYG, versioning; mock CMS data in scope |
| **Backend** | US 1.7.1 (admin toggle, status check) | Admin panel, launch status check; in-app notice in scope |
| **Backend** | Various: email, CAPTCHA, rate limiting, consent storage, practice API, webhooks, token reset | Real services / infra; mock flows only |

---

## Unresolved Questions

1. **OAuth:** Which provider SDK? Firebase Auth? Direct Google/Apple integration?
2. **SMS:** Twilio vs alternatives? Budget allocation?
3. **Biometrics:** Expo LocalAuthentication or native modules?
4. **Push Notifications:** Expo Notifications? Firebase Cloud Messaging?
5. **Offline Storage:** AsyncStorage vs SQLite vs Realm?
6. **Admin Panel:** Separate app or integrated into existing admin?
7. **Backend:** What's the actual API/backend strategy? Currently all mock data.
8. **Email Service:** SendGrid? AWS SES? Postmark?

---

## Recommended Prioritization

### Phase 1: Core Functionality (High Impact)
1. US 1.1.2: OAuth Registration - Reduces friction
2. US 1.2.7: Appointment Reminders - Critical for user retention
3. US 1.8.2: Offline Appointment Viewing - Reliability
4. US 1.2.2: Save Favorite Doctors - User convenience

### Phase 2: Security & Compliance
1. US 1.1.4: SMS Phone Verification - 2FA security
2. US 1.1.5: Biometric Authentication - Security
3. US 1.4.1: Complete Account Deletion - GDPR requirement
4. US 1.8.3: Granular Consent (complete) - GDPR requirement

### Phase 3: Operations
1. US 1.7.1: Maintenance Mode - Operational necessity
2. US 1.8.1: API Error Processing - Reliability
3. US 1.5.1: Practice-Initiated Changes (complete) - Integration

### Phase 4: Enhancement
1. US 1.3.1: Automatic Feedback - Quality improvement
2. US 1.6.1: CMS - Content flexibility
3. US 1.7.2: Log Viewing - Debugging
4. US 1.8.4: Rate Limiting - Infrastructure protection

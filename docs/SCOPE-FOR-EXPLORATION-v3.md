# User Stories from Philipp (January 27, 2026)

> **Source**: Issue #18
> **Status**: Translated from German
> **Related**: [Requirements Document](/requirements)

## 1.1 Epic: Onboarding

### US 1.1.1: Prominent Appointment Booking on Home Screen

**As a new patient**, I want to see the main "Book Appointment" function prominently on the home screen, so I can quickly start booking.

**Acceptance Criteria:**
- The "Book Appointment" button must be visible within 3 seconds after app start
- The button takes up at least 20% of the visible screen area
- Legal mandatory information (Imprint, Privacy Policy, Terms of Service) is accessible via a menu
- The home screen loads within 5 seconds even on slow connections (&lt;3G)

---

### US 1.1.2: OAuth Registration (Google/Apple)

**As a new patient**, I want to register with my Google or Apple account, to save time and avoid managing additional passwords.

**Acceptance Criteria:**
- OAuth 2.0 integration for Google and Apple Sign-In is implemented
- The API processes OAuth tokens within 2 seconds
- Upon successful OAuth login, name, email, and (if available) profile photo are automatically imported
- Missing mandatory fields (e.g., health insurance) are requested after OAuth login
- In case of OAuth error, a clear error message with an alternative (manual registration) is displayed

---

### US 1.1.3: Email/Password Registration

**As a new patient without Google/Apple account**, I want to register with email and secure password, to use the app.

**Acceptance Criteria:**
- Password must comply with current OWASP standards (min. 8 characters, upper/lowercase, number, special character)
- Real-time password validation with visual strength indicator
- Email verification via token link with 24h validity
- API endpoint `/register` must be CAPTCHA-protected (against bots)
- Confirmation email is delivered within 60 seconds

---

### US 1.1.4: SMS Phone Number Verification

**As a new patient**, I want to verify my mobile phone number via SMS, to use secure two-factor authentication.

**Acceptance Criteria:**
- SMS code is 6 digits and valid for 10 minutes
- API integration with SMS gateway (e.g., Twilio) with error handling for undeliverable numbers
- Maximum wait time for SMS delivery: 3 minutes, then "Resend code" option
- Rate limiting: Maximum 3 SMS codes per number per hour (against abuse)
- International phone numbers (e.g., +43, +41) are supported

---

### US 1.1.5: Biometric Authentication

**As a security-conscious user**, I want to enable Face-ID/Touch-ID, to protect my health data from unauthorized access.

**Acceptance Criteria:**
- Biometric authentication is optional and can be enabled/disabled in settings
- When biometric is disabled, PIN/password is required
- Face-ID/Touch-ID is required at every app start and after 5 minutes of inactivity
- Fallback: After 3 failed biometric attempts, PIN/password is required
- GDPR-compliant: Biometric data is stored only locally on the device

---

## 1.2 Epic: Appointment Booking and Management

### US 1.2.1: Book Appointment by Specialty

**As a new patient**, I want to book an appointment based on medical specialty.

**Acceptance Criteria:**
- The API must return a list of specialties (e.g., General Practitioner, Cardiologist, Gastroenterologist)
- In case of API timeout, a clear error message with "Retry" option is displayed

---

### US 1.2.2: Save Favorite Doctors

**As a returning patient**, I want to save my preferred doctors, to save time on the next booking.

**Acceptance Criteria:**
- The API must persistently store a list of the last 5 booked doctors per user
- Saved doctors are displayed as "My Doctors" in the booking form
- The user can manually add/remove doctors to/from favorites
- Favorites list is sorted by last booking (newest first)
- GDPR: Favorites are completely removed upon account deletion

---

### US 1.2.3: Select Appointment Type

**As a patient**, I want to select an appointment type (Acute, Prevention, Follow-Up), to communicate the reason for my visit to the doctor.

**Acceptance Criteria:**
- Three appointment types are selectable: "Acute Appointment", "Prevention", "Follow-Up"
- For "Acute Appointment": Mandatory field for symptom description (min. 10 characters)
- For "Prevention": Dropdown with common prevention reasons (e.g., "Check-Up", "Vaccination")
- For "Follow-Up": Optional reference to previous appointment
- The API transmits the appointment type to the practice interface

---

### US 1.2.4: Book Appointments for Dependents

**As a patient with children**, I want to book appointments on behalf of my children, to organize their healthcare.

**Acceptance Criteria:**
- The user can add up to 5 dependent persons (e.g., children) in their profile
- For each person, name, date of birth, health insurance are stored
- During appointment booking, "Who is the appointment for?" is asked with a dropdown
- The API sends the patient data (not the booker's) to the practice
- GDPR: Dependent persons can be deleted separately

---

### US 1.2.5: Real-Time Appointment Status

**As a patient**, I want to see the status of my appointment request in real-time, to know if the practice has confirmed the appointment.

**Acceptance Criteria:**
- Status is displayed in the appointment overview: "In Progress", "Confirmed", "Rejected"
- A push notification is sent upon status change
- The API polls the practice status every 60 seconds (or uses webhooks, if available)
- Timestamp of last status update is displayed
- For "Rejected": Reason for rejection is displayed (if available)

---

### US 1.2.6: Export Appointment to Calendar

**As a patient**, I want to export a confirmed appointment to my calendar, so I don't forget it.

**Acceptance Criteria:**
- Export as .ics file (compatible with Google Calendar, Apple Calendar, Outlook)
- The .ics file contains: date, time, doctor name, address, phone number
- The export button is only displayed for status "Confirmed"
- Optional: Deep-link for direct addition to Google/Apple Calendar
- The API generates the .ics file server-side (no client generation)

---

### US 1.2.7: Appointment Reminders

**As a patient**, I want to receive a reminder 24 and 72 hours before the appointment, to cancel the appointment in time if needed.

**Acceptance Criteria:**
- Push notification is sent exactly 72 hours before appointment start
- The notification contains quick actions: "Confirm" and "Cancel"
- For "Cancel", the cancellation dialog opens directly
- Email reminder is sent in parallel to the push notification
- If push function is disabled, only email is sent

---

### US 1.2.8: Appointment List Overview

**As a patient**, I want to see all upcoming and past appointments in a clear list, to track my doctor visits.

**Acceptance Criteria:**
- Appointments are divided into two tabs: "Upcoming" and "Past"
- Each appointment shows: date, time, doctor, specialty, status
- The list is sorted by date (upcoming ascending, past descending)
- Filter options: by doctor, specialty, status
- Tapping an appointment opens the detail view

---

### US 1.2.9: Modify Confirmed Appointment

**As a patient**, I want to modify a confirmed appointment, to flexibly respond to schedule changes.

**Acceptance Criteria:**
- Modification is only possible up to 24h before appointment start
- Upon modification, the appointment is automatically canceled via API
- The user can enter new search parameters (as with new booking)
- The old appointment request is marked as "Modified"
- Confirmation email with new appointment details is sent

---

### US 1.2.10: Cancel Appointment

**As a patient**, I want to cancel an appointment, to inform the practice in time and give others the opportunity to get the appointment.

**Acceptance Criteria:**
- Cancellation is possible up to 24 hours before appointment start
- Upon cancellation, the API is called immediately
- The user receives a confirmation email about the cancellation
- Canceled appointments are marked as "Canceled" in the history

---

## 1.3 Epic: Post-Appointment Follow-Up

### US 1.3.1: Automatic Feedback Request

**As a system operator**, I want to automatically collect feedback from the patient 1 hour after appointment end, to monitor service quality.

**Acceptance Criteria:**
- Push notification is automatically sent 1h after appointment end
- The notification contains a link to the rating form
- Rating includes: Star rating (1-5), optional free-text comments
- If push function is disabled, email with rating link is sent
- The API stores ratings in a GDPR-compliant manner (without patient name when released to practice)

---

## 1.4 Epic: Customer Account Management

### US 1.4.1: Complete Account Deletion

**As a privacy-conscious patient**, I want to completely delete my account, to exercise my right to be forgotten.

**Acceptance Criteria:**
- Before deletion, a warning with consequences is displayed (open appointments will be canceled)
- Confirmation of deletion via email link (double opt-out)
- All personal data is deleted from the database within 72h
- Open appointments are automatically canceled via API and the patient is informed
- GDPR Art. 17: Deletion confirmation email is sent within 30 days

---

### US 1.4.2: Change Password

**As a patient**, I want to change my password, to increase my account security.

**Acceptance Criteria:**
- Password change requires entry of the old password
- New password must meet OWASP standards (see registration)
- Upon successful change, confirmation email is sent
- Optional: "Forgot password" function with token reset via email
- Rate limiting: Maximum 5 password changes per day

---

## 1.5 Epic: Appointment Changes by Practice

### US 1.5.1: Practice-Initiated Appointment Changes

**As a practice system**, I want to automatically transmit appointment changes to the app, to inform patients in a timely manner.

**Acceptance Criteria:**
- The practice sends appointment changes to Curaay
- Curaay forwards the change to the system within 60 seconds
- The app immediately sends a push notification to the patient
- The modified appointment is updated in the app (Status: "Modified by Practice")
- Error handling: In case of API error, retry after 5 minutes

---

## 1.6 Epic: Content Management

### US 1.6.1: Edit Home Screen Content Without Technical Knowledge

**As a content creator**, I want to edit home screen content without technical knowledge, to quickly respond to changes.

**Acceptance Criteria:**
- Login via secured admin area (separate authentication)
- WYSIWYG editor for home screen, FAQ, imprint
- The editor supports: text, images, links, lists
- Changes are displayed via "Preview" function before publication

---

## 1.7 Epic: Administration

### US 1.7.1: Maintenance Mode

**As an administrator**, I want to put the app into maintenance mode, to perform updates without user interruption.

**Acceptance Criteria:**
- Maintenance mode can be activated/deactivated via admin panel
- In maintenance mode, all users see a customizable notice
- The notice contains: reason, expected duration, support contact
- Appointment booking is not possible in maintenance mode
- Existing appointments remain visible in the apps

---

### US 1.7.2: Detailed Log Viewing

**As an administrator**, I want to view detailed logs, to quickly diagnose technical problems.

**Acceptance Criteria:**
- Logs contain: timestamp, user-ID (anonymized), action, API response
- Logrotate: Logs are automatically archived after 90 days
- Filter options: by error type, user-ID, time period, API endpoint
- Logs are GDPR-compliant (no clear-text names in logs)
- Export function for logs as .csv

---

## 1.8 Epic: Additional User Stories

### US 1.8.1: Intelligent API Error Code Processing

**As a system**, I want to intelligently process API error codes, to inform the user about technical problems and automatically perform retry attempts.

**Acceptance Criteria:**
- For API error 503 (Service Unavailable): Automatic retry after 5, 10, 30 seconds
- For API error 429 (Rate Limit): Wait until reset time (Header "Retry-After")
- For API error 401/403: User is prompted to log in again
- For network timeout (>10s): User-friendly error message with "Try again" button
- All API errors are stored in logs (for admin monitoring)

---

### US 1.8.2: Offline Appointment Viewing

**As a patient**, I want to see my booked appointments even without internet connection, to always be informed.

**Acceptance Criteria:**
- Booked appointments are stored locally on the device (SQLite or Realm)
- The local database is updated with each successful API sync
- In offline mode, a notice is displayed: "Offline – Data will be updated upon connection"
- Appointment booking is not possible in offline mode (display only)
- When back online: Automatic synchronization within 10 seconds

---

### US 1.8.3: Granular Data Usage Consent

**As a patient**, I want to granularly control for what purposes my data is used, to exercise my privacy rights.

**Acceptance Criteria:**
- Separate opt-in checkboxes for: "Necessary Cookies", "Analytics", "Marketing Emails"
- Consents can be changed at any time in settings
- The API stores consents with timestamp (proof requirement)
- Upon withdrawal of Analytics: All previous tracking data is anonymized
- GDPR Art. 7: Consent must be as easy to revoke as it is to grant

---

### US 1.8.4: Client-Side API Rate Limiting

**As a system**, I want to limit API requests client-side, to protect server infrastructure and reduce costs.

**Acceptance Criteria:**
- Maximum API requests per user: 60/minute (local counting)
- Upon exceeding: Request is placed in a queue
- The user sees a loading animation (no error message during normal use)
- For intentional abuse (>200 requests/minute): Temporary account lock (5 minutes)
- Admin dashboard shows API usage per user (for anomaly detection)

---

## Summary

This document contains **25 user stories** organized into **8 epics**:

| Epic | User Stories | Focus Area |
|------|--------------|------------|
| 1.1 Onboarding | 5 stories | Registration, OAuth, SMS 2FA, Biometric auth |
| 1.2 Appointment Booking | 10 stories | Search, booking, favorites, status, calendar export |
| 1.3 Post-Appointment | 1 story | Feedback collection |
| 1.4 Account Management | 2 stories | Account deletion, password management |
| 1.5 Practice Changes | 1 story | Practice-initiated appointment modifications |
| 1.6 Content Management | 1 story | CMS for dynamic content |
| 1.7 Administration | 2 stories | Maintenance mode, logging |
| 1.8 Additional | 4 stories | Error handling, offline mode, consent, rate limiting |

---

## Next Steps

1. **Gap Analysis**: Review against current C3 architecture (see [Issue #18](https://github.com/tini-works/medalpha-req/issues/18))
2. **Prioritization**: Determine which stories are MVP vs. future phases
3. **Technical Specs**: Create detailed technical specifications for each story
4. **ADR Creation**: Use `/c3-skill:alter` for architectural decisions
5. **Implementation**: Break down into development tasks

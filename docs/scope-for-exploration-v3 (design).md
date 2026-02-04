# User Stories from Philipp (January 27, 2026)

> **Source**: Issue #18
> **Status**: Translated from German
> **Related**: [Requirements Document](/requirements)

> **Coverage Summary (v3 app)**: 🟠 **28%** (avg across 26 US)
> - 🟢 5 · 🟡 6 · 🟠 2 · ❌ 13

## 1.1 Epic: Onboarding

> 🟢 **Coverage (v3 app): 75%**

### US 1.1.1: Prominent Appointment Booking on Home Screen

| Field | Details |
|---|---|
| User Story | **As a new patient**, I want to see the main "Book Appointment" function prominently on the home screen, so I can quickly start booking. |
| Acceptance Criteria | 1. The "Book Appointment" button must be visible within 3 seconds after app start<br/>2. The button takes up at least 20% of the visible screen area<br/>3. Legal mandatory information (Imprint, Privacy Policy, Terms of Service) is accessible via a menu<br/>4. The home screen loads within 5 seconds even on slow connections (&lt;3G) |
| Notes | - **Performance** — Sub-3-second loads. Native feel. No random logouts.<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start"<br/>- "No more phone calls" (Doctolib positive) |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.1.2: OAuth Registration (Google/Apple)

| Field | Details |
|---|---|
| User Story | **As a new patient**, I want to register with my Google or Apple account, to save time and avoid managing additional passwords. |
| Acceptance Criteria | 1. OAuth 2.0 integration for Google and Apple Sign-In is implemented<br/>2. The API processes OAuth tokens within 2 seconds<br/>3. Upon successful OAuth login, name, email, and (if available) profile photo are automatically imported<br/>4. Missing mandatory fields (e.g., health insurance) are requested after OAuth login<br/>5. In case of OAuth error, a clear error message with an alternative (manual registration) is displayed |
| Notes | - **Forced re-login**: "Completely logged out every few days, need to re-enter password"<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start" |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.1.3: Email/Password Registration

| Field | Details |
|---|---|
| User Story | **As a new patient without Google/Apple account**, I want to register with email and secure password, to use the app. |
| Acceptance Criteria | 1. Password must comply with current OWASP standards (min. 8 characters, upper/lowercase, number, special character)<br/>2. Real-time password validation with visual strength indicator<br/>3. Email verification via token link with 24h validity<br/>4. API endpoint `/register` must be CAPTCHA-protected (against bots)<br/>5. Confirmation email is delivered within 60 seconds |
| Notes | - **Forced re-login**: "Completely logged out every few days, need to re-enter password"<br/>- **App bugs**: "Had to attempt to enter my insurance over 5 times before it was finally submitted" |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.1.4: SMS Phone Number Verification

| Field | Details |
|---|---|
| User Story | **As a new patient**, I want to verify my mobile phone number via SMS, to use secure two-factor authentication. |
| Acceptance Criteria | 1. SMS code is 6 digits and valid for 10 minutes<br/>2. API integration with SMS gateway (e.g., Twilio) with error handling for undeliverable numbers<br/>3. Maximum wait time for SMS delivery: 3 minutes, then "Resend code" option<br/>4. Rate limiting: Maximum 3 SMS codes per number per hour (against abuse)<br/>5. International phone numbers (e.g., +43, +41) are supported |
| Notes | - Step-by-step guidance; phone support fallback<br/>- **Fear of errors**: Anxiety about making mistakes contributes to resistance |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.1.5: Biometric Authentication

| Field | Details |
|---|---|
| User Story | **As a security-conscious user**, I want to enable Face-ID/Touch-ID, to protect my health data from unauthorized access. |
| Acceptance Criteria | 1. Biometric authentication is optional and can be enabled/disabled in settings<br/>2. When biometric is disabled, PIN/password is required<br/>3. Face-ID/Touch-ID is required at every app start and after 5 minutes of inactivity<br/>4. Fallback: After 3 failed biometric attempts, PIN/password is required<br/>5. GDPR-compliant: Biometric data is stored only locally on the device |
| Notes | - Privacy concerns: Austrian Chamber of Doctors recommends patients opt out<br/>- Privacy fears about employer access to health data |

---

## 1.2 Epic: Appointment Booking and Management

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.1: Book Appointment by Specialty

| Field | Details |
|---|---|
| User Story | **As a new patient**, I want to book an appointment based on medical specialty. |
| Acceptance Criteria | 1. The API must return a list of specialties (e.g., General Practitioner, Cardiologist, Gastroenterologist)<br/>2. In case of API timeout, a clear error message with "Retry" option is displayed |
| Notes | - Long specialist wait times; Telemedicine as fast alternative for appropriate cases<br/>- 1 in 10 waits more than 3 months |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.2.2: Save Favorite Doctors

| Field | Details |
|---|---|
| User Story | **As a returning patient**, I want to save my preferred doctors, to save time on the next booking. |
| Acceptance Criteria | 1. The API must persistently store a list of the last 5 booked doctors per user<br/>2. Saved doctors are displayed as "My Doctors" in the booking form<br/>3. The user can manually add/remove doctors to/from favorites<br/>4. Favorites list is sorted by last booking (newest first)<br/>5. GDPR: Favorites are completely removed upon account deletion |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- "No more phone calls" (Doctolib positive) |

---

> 🟠 **Coverage (v3 app): 25%**

### US 1.2.3: Select Appointment Type

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to select an appointment type (Acute, Prevention, Follow-Up), to communicate the reason for my visit to the doctor. |
| Acceptance Criteria | 1. Three appointment types are selectable: "Acute Appointment", "Prevention", "Follow-Up"<br/>2. For "Acute Appointment": Mandatory field for symptom description (min. 10 characters)<br/>3. For "Prevention": Dropdown with common prevention reasons (e.g., "Check-Up", "Vaccination")<br/>4. For "Follow-Up": Optional reference to previous appointment<br/>5. The API transmits the appointment type to the practice interface |
| Notes | - **Wait Time Transparency** — Show real-time queue position; give accurate estimates; notify proactively<br/>- **Extended waiting**: "They kept extending my waiting time, waiting for an hour before giving up" |

---

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.4: Book Appointments for Dependents

| Field | Details |
|---|---|
| User Story | **As a patient with children**, I want to book appointments on behalf of my children, to organize their healthcare. |
| Acceptance Criteria | 1. The user can add up to 5 dependent persons (e.g., children) in their profile<br/>2. For each person, name, date of birth, health insurance are stored<br/>3. During appointment booking, "Who is the appointment for?" is asked with a dropdown<br/>4. The API sends the patient data (not the booker's) to the practice<br/>5. GDPR: Dependent persons can be deleted separately |
| Notes | - Cross-appointment booking for family members needed<br/>- 44% of pediatric appointments within 48 hours |

---

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.5: Real-Time Appointment Status

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to see the status of my appointment request in real-time, to know if the practice has confirmed the appointment. |
| Acceptance Criteria | 1. Status is displayed in the appointment overview: "In Progress", "Confirmed", "Rejected"<br/>2. A push notification is sent upon status change<br/>3. The API polls the practice status every 60 seconds (or uses webhooks, if available)<br/>4. Timestamp of last status update is displayed<br/>5. For "Rejected": Reason for rejection is displayed (if available) |
| Notes | - **Wait Time Transparency** — Show real-time queue position; give accurate estimates; notify proactively<br/>- Wait time honesty — TeleClinic "keeps extending" estimates — Accurate queue + proactive updates |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.2.6: Export Appointment to Calendar

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to export a confirmed appointment to my calendar, so I don't forget it. |
| Acceptance Criteria | 1. Export as .ics file (compatible with Google Calendar, Apple Calendar, Outlook)<br/>2. The .ics file contains: date, time, doctor name, address, phone number<br/>3. The export button is only displayed for status "Confirmed"<br/>4. Optional: Deep-link for direct addition to Google/Apple Calendar<br/>5. The API generates the .ics file server-side (no client generation) |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- "No more phone calls" (Doctolib positive) |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.2.7: Appointment Reminders

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to receive a reminder 24 and 72 hours before the appointment, to cancel the appointment in time if needed. |
| Acceptance Criteria | 1. Push notification is sent exactly 72 hours before appointment start<br/>2. The notification contains quick actions: "Confirm" and "Cancel"<br/>3. For "Cancel", the cancellation dialog opens directly<br/>4. Email reminder is sent in parallel to the push notification<br/>5. If push function is disabled, only email is sent |
| Notes | - Appointment reminders appreciated<br/>- **Notification failures**: "App did not notify me of appointment, only emails showed 3 docs scheduled in 5min intervals"<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.2.8: Appointment List Overview

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to see all upcoming and past appointments in a clear list, to track my doctor visits. |
| Acceptance Criteria | 1. Appointments are divided into two tabs: "Upcoming" and "Past"<br/>2. Each appointment shows: date, time, doctor, specialty, status<br/>3. The list is sorted by date (upcoming ascending, past descending)<br/>4. Filter options: by doctor, specialty, status<br/>5. Tapping an appointment opens the detail view |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start" |

---

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.9: Modify Confirmed Appointment

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to modify a confirmed appointment, to flexibly respond to schedule changes. |
| Acceptance Criteria | 1. Modification is only possible up to 24h before appointment start<br/>2. Upon modification, the appointment is automatically canceled via API<br/>3. The user can enter new search parameters (as with new booking)<br/>4. The old appointment request is marked as "Modified"<br/>5. Confirmation email with new appointment details is sent |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.2.10: Cancel Appointment

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to cancel an appointment, to inform the practice in time and give others the opportunity to get the appointment. |
| Acceptance Criteria | 1. Cancellation is possible up to 24 hours before appointment start<br/>2. Upon cancellation, the API is called immediately<br/>3. The user receives a confirmation email about the cancellation<br/>4. Canceled appointments are marked as "Canceled" in the history |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

## 1.3 Epic: Post-Appointment Follow-Up

> ❌ **Coverage (v3 app): 0%**

### US 1.3.1: Automatic Feedback Request

| Field | Details |
|---|---|
| User Story | **As a system operator**, I want to automatically collect feedback from the patient 1 hour after appointment end, to monitor service quality. |
| Acceptance Criteria | 1. Push notification is automatically sent 1h after appointment end<br/>2. The notification contains a link to the rating form<br/>3. Rating includes: Star rating (1-5), optional free-text comments<br/>4. If push function is disabled, email with rating link is sent<br/>5. The API stores ratings in a GDPR-compliant manner (without patient name when released to practice) |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- **Negative feedback**: Elderly users perceive negative feedback as "distracting and frustrating" |

---

## 1.4 Epic: Customer Account Management

> ❌ **Coverage (v3 app): 0%**

### US 1.4.1: Complete Account Deletion

| Field | Details |
|---|---|
| User Story | **As a privacy-conscious patient**, I want to completely delete my account, to exercise my right to be forgotten. |
| Acceptance Criteria | 1. Before deletion, a warning with consequences is displayed (open appointments will be canceled)<br/>2. Confirmation of deletion via email link (double opt-out)<br/>3. All personal data is deleted from the database within 72h<br/>4. Open appointments are automatically canceled via API and the patient is informed<br/>5. GDPR Art. 17: Deletion confirmation email is sent within 30 days |
| Notes | - Privacy concerns: Austrian Chamber of Doctors recommends patients opt out<br/>- Privacy fears about employer access to health data |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.4.2: Change Password

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to change my password, to increase my account security. |
| Acceptance Criteria | 1. Password change requires entry of the old password<br/>2. New password must meet OWASP standards (see registration)<br/>3. Upon successful change, confirmation email is sent<br/>4. Optional: "Forgot password" function with token reset via email<br/>5. Rate limiting: Maximum 5 password changes per day |
| Notes | - **Forced re-login**: "Completely logged out every few days, need to re-enter password"<br/>- Don't require complex setup (NFC + PIN + activation) |

---

## 1.5 Epic: Appointment Changes by Practice

> 🟡 **Coverage (v3 app): 50%**

### US 1.5.1: Practice-Initiated Appointment Changes

| Field | Details |
|---|---|
| User Story | **As a practice system**, I want to automatically transmit appointment changes to the app, to inform patients in a timely manner. |
| Acceptance Criteria | 1. The practice sends appointment changes to Curaay<br/>2. Curaay forwards the change to the system within 60 seconds<br/>3. The app immediately sends a push notification to the patient<br/>4. The modified appointment is updated in the app (Status: "Modified by Practice")<br/>5. Error handling: In case of API error, retry after 5 minutes |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Wait time honesty — TeleClinic "keeps extending" estimates — Accurate queue + proactive updates |

---

## 1.6 Epic: Content Management

> ❌ **Coverage (v3 app): 0%**

### US 1.6.1: Edit Home Screen Content Without Technical Knowledge

| Field | Details |
|---|---|
| User Story | **As a content creator**, I want to edit home screen content without technical knowledge, to quickly respond to changes. |
| Acceptance Criteria | 1. Login via secured admin area (separate authentication)<br/>2. WYSIWYG editor for home screen, FAQ, imprint<br/>3. The editor supports: text, images, links, lists<br/>4. Changes are displayed via "Preview" function before publication |
| Notes | - **Language Support** — English immediately; expand to 14 languages. Never switch languages mid-flow.<br/>- **Language switching**: "App is English until you book, then switches to German/French randomly" |

---

## 1.7 Epic: Administration

> ❌ **Coverage (v3 app): 0%**

### US 1.7.1: Maintenance Mode

| Field | Details |
|---|---|
| User Story | **As an administrator**, I want to put the app into maintenance mode, to perform updates without user interruption. |
| Acceptance Criteria | 1. Maintenance mode can be activated/deactivated via admin panel<br/>2. In maintenance mode, all users see a customizable notice<br/>3. The notice contains: reason, expected duration, support contact<br/>4. Appointment booking is not possible in maintenance mode<br/>5. Existing appointments remain visible in the apps |
| Notes | - **Performance** — Sub-3-second loads. Native feel. No random logouts.<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start" |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.7.2: Detailed Log Viewing

| Field | Details |
|---|---|
| User Story | **As an administrator**, I want to view detailed logs, to quickly diagnose technical problems. |
| Acceptance Criteria | 1. Logs contain: timestamp, user-ID (anonymized), action, API response<br/>2. Logrotate: Logs are automatically archived after 90 days<br/>3. Filter options: by error type, user-ID, time period, API endpoint<br/>4. Logs are GDPR-compliant (no clear-text names in logs)<br/>5. Export function for logs as .csv |
| Notes | - **Performance** — Sub-3-second loads. Native feel. No random logouts.<br/>- **App bugs**: "Had to attempt to enter my insurance over 5 times before it was finally submitted" |

---

## 1.8 Epic: Additional User Stories

> ❌ **Coverage (v3 app): 0%**

### US 1.8.1: Intelligent API Error Code Processing

| Field | Details |
|---|---|
| User Story | **As a system**, I want to intelligently process API error codes, to inform the user about technical problems and automatically perform retry attempts. |
| Acceptance Criteria | 1. For API error 503 (Service Unavailable): Automatic retry after 5, 10, 30 seconds<br/>2. For API error 429 (Rate Limit): Wait until reset time (Header "Retry-After")<br/>3. For API error 401/403: User is prompted to log in again<br/>4. For network timeout (&gt;10s): User-friendly error message with "Try again" button<br/>5. All API errors are stored in logs (for admin monitoring) |
| Notes | - "Most people will give up after second error message"<br/>- **Fear of errors**: Anxiety about making mistakes contributes to resistance<br/>- Positive, encouraging error messages |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.8.2: Offline Appointment Viewing

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to see my booked appointments even without internet connection, to always be informed. |
| Acceptance Criteria | 1. Booked appointments are stored locally on the device (SQLite or Realm)<br/>2. The local database is updated with each successful API sync<br/>3. In offline mode, a notice is displayed: "Offline – Data will be updated upon connection"<br/>4. Appointment booking is not possible in offline mode (display only)<br/>5. When back online: Automatic synchronization within 10 seconds |
| Notes | - **E-Rezept System Outages (Aug 2025):** 5 days of complete outages or significant disruptions in 2 weeks<br/>- "Tens of thousands of patients" affected each time<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

> 🟠 **Coverage (v3 app): 25%**

### US 1.8.3: Granular Data Usage Consent

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to granularly control for what purposes my data is used, to exercise my privacy rights. |
| Acceptance Criteria | 1. Separate opt-in checkboxes for: "Necessary Cookies", "Analytics", "Marketing Emails"<br/>2. Consents can be changed at any time in settings<br/>3. The API stores consents with timestamp (proof requirement)<br/>4. Upon withdrawal of Analytics: All previous tracking data is anonymized<br/>5. GDPR Art. 7: Consent must be as easy to revoke as it is to grant |
| Notes | - Privacy concerns: Austrian Chamber of Doctors recommends patients opt out<br/>- Privacy fears about employer access to health data |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.8.4: Client-Side API Rate Limiting

| Field | Details |
|---|---|
| User Story | **As a system**, I want to limit API requests client-side, to protect server infrastructure and reduce costs. |
| Acceptance Criteria | 1. Maximum API requests per user: 60/minute (local counting)<br/>2. Upon exceeding: Request is placed in a queue<br/>3. The user sees a loading animation (no error message during normal use)<br/>4. For intentional abuse (&gt;200 requests/minute): Temporary account lock (5 minutes)<br/>5. Admin dashboard shows API usage per user (for anomaly detection) |
| Notes | - **Performance** — Sub-3-second loads. Native feel. No random logouts.<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start" |

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

---

## Unmapped Notes (from Social Listening Synthesis)

Notes from `docs/z.research/social-listening-synthesis.md` not currently referenced in any US `Notes` row above:

### Pain Point Matrix (Opportunities)
- E-Rezept NFC confusion — Simplified CardLink flow with step-by-step guidance
- Language barriers — English + 14 language support
- App slowness/crashes — Performance as feature; native-quality UX
- Sick note delays — Clear wait time estimates; priority options
- Prescription not received — End-to-end tracking with confirmation at each step
- Delivery problems — Multiple fulfillment options; pharmacy pickup fallback
- Cost opacity — Transparent pricing before commitment
- Insurance filter failures — Correct insurance filtering; clear GKV/PKV labeling

### Doctolib (Findings)
- **Insurance filter broken**: "Search with statutory insurance shows doctors only serving private"
- **Doctor quality**: "Some practitioners trying to scam new patients (usually immigrants)"
- "App feels dated" is legitimate concern (Doctolib criticism)
- Slow loading times frustrate digital natives
- Language switching breaks modern UX expectations

### TeleClinic (Findings)
- **Language barrier**: "Unless your German is pretty good, it's a nightmare to navigate"
- **Sick note delays**: "Could no longer send sick note due to length of time passing (3 days). Received strike with employers"
- **Missing prescriptions**: "Customer service not responding to ticket about not receiving prescription"
- **Costly for private**: "Not cheap for private patients" while public is free
- "Sick note directly in app" (TeleClinic positive)
- Telemedicine valued for "not having to take time off work"

### DocMorris / Online Pharmacy (Findings)
- **E-Rezept system problems**: Stock lost 20% due to "massive problems with German e-prescription system"
- **Incomplete fulfillment**: "Only part of prescriptions filled, others cancelled without notice"
- **Referral coupon failures**: "€20 coupons for friend referral not working"
- **Communication gaps**: "Unreliable, poor communication" about order status
- **Shipping delays**: Items "in stock" taking 4-6 days
- **Non-delivery**: "Ordered €35 medicine, never arrived after 5 days. Took 3 days for replacement"
- **Refund delays**: "January 12th, still no refund of €311.27 from Christmas order"
- **Customer service language**: "Don't have staff who speak English on calls"
- **Peak period delays**: "During flu season, delivery stretches beyond advertised timeframe"
- "Prescription to pharmacy of your choice" (choice valued)
- "Fast delivery" (when it works, highly praised)

### E-Rezept (gematik) (Findings)
- **NFC card + PIN requirement**: "Far too many individual steps necessary from activating eGK to receiving prescription"
- **Low PIN adoption**: Only 2,000 of 27M AOK-insured obtained PIN for NFC
- **Unclear authorization**: "BARMER app says approved, E-Rezept app says authentication pending"
- **Background NFC issues**: "Phone vibrates and makes sounds every time unlocked, even when app not running"
- E-Rezept timing confusion: "You have to wait until it's released, can't go straight to pharmacy anymore"
- Pharmacy refusals: "Can pharmacies refuse to dispense even with valid prescription?"
- Third-party pickup: "Can someone else pick up my prescription?"

### Accessibility & Elderly UX
- **Cognitive overload**: Complex interfaces and information overload cited as significant obstacles → Progressive disclosure; one task per screen
- **Physical limitations**: Small touchscreens, complex menus, small fonts exacerbate vision/dexterity decline → 16pt+ fonts, large touch targets, high contrast
- **Digital literacy**: 40% of adults over 65 lack mobile access or remain hesitant → Step-by-step guidance; phone support fallback

### News & Industry
- 30% of insured rate specialist wait times as "too long" or "much too long"
- Public insurance waits 2x longer than private (60% wait >2 weeks vs 37% private)
- 50% say online booking is "very important" or "important" (up from 31% in 2022)
- GKV-Spitzenverband calling for mandatory online booking portal for all practices

### Neighboring Markets (Austria & Switzerland)
- ELGA (electronic health record) getting major upgrade 2025-2026
- Mobile app launching 2026
- Decade of "limited functionality and clunky user experience"
- Fax machines still standard communication between providers
- E-prescriptions NOT yet implemented (Germany ahead)
- Only 356 pharmacies accept e-prescriptions
- Healthcare digitization "lagging" and "performing weakly in international comparison"
- Interoperability problems between isolated e-prescription solutions
- No uniform international standard
- 2016 law banned online OTC sales without prescription
- Cross-border prescription: "Can I redeem German prescription in Austria?"

### Persona Validation
- Half of doctors experience weekly technical issues with telemedicine
- Video call quality/reliability concerns valid
- Preference for telephone over video (73% vs 18%) suggests video UX needs work

### Messaging (Resonates / Avoid)
- "Germany finally reaching the 21st century" (telemedicine excitement)
- Don't hide costs or add surprise fees
- Don't break the experience with language switches

### Strategic Recommendations
- **E-Rezept Simplicity** — CardLink with visual step-by-step; card-less option; clear confirmation at each step
- **Accessibility First** — 16pt+ fonts, high contrast, large touch targets, progressive disclosure. Test with 68-year-olds.

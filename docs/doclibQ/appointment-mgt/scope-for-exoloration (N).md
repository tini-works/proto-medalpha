# User Stories - N

> **Source**: Issue #18
> **Status**: Translated from German
> **Related**: [Requirements Document](/requirements)



## 1.2 Epic: Appointment Booking and Management

> 🟡 **Coverage (v3 app, UX scope): 48%** — all 10 US in scope

### US 1.2.1: Book Appointment by Specialty

| Field | Details |
|---|---|
| User Story | **As a new patient**, I want to book an appointment based on medical specialty. |
| Acceptance Criteria | 1. The API must return a list of specialties (e.g., General Practitioner, Cardiologist, Gastroenterologist) *(tech)*<br/>2. In case of API timeout, a clear error message with "Retry" option is displayed |
| Notes | - Long specialist wait times; Telemedicine as fast alternative for appropriate cases<br/>- 1 in 10 waits more than 3 months |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.2.2: Save Favorite Doctors

| Field | Details |
|---|---|
| User Story | **As a returning patient**, I want to save my preferred doctors, to save time on the next booking. |
| Acceptance Criteria | 1. The API must persistently store a list of the last 5 booked doctors per user *(tech)*<br/>2. Saved doctors are displayed as "My Doctors" in the booking form<br/>3. The user can manually add/remove doctors to/from favorites<br/>4. Favorites list is sorted by last booking (newest first)<br/>5. GDPR: Favorites are completely removed upon account deletion *(tech)* |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- "No more phone calls" (Doctolib positive) |

---

> 🟠 **Coverage (v3 app): 25%**

### US 1.2.3: Select Appointment Type

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to select an appointment type (Acute, Prevention, Follow-Up), to communicate the reason for my visit to the doctor. |
| Acceptance Criteria | 1. Three appointment types are selectable: "Acute Appointment", "Prevention", "Follow-Up"<br/>2. For "Acute Appointment": Mandatory field for symptom description (min. 10 characters)<br/>3. For "Prevention": Dropdown with common prevention reasons (e.g., "Check-Up", "Vaccination")<br/>4. For "Follow-Up": Optional reference to previous appointment<br/>5. The API transmits the appointment type to the practice interface *(tech)* |
| Notes | - **Wait Time Transparency** — Show real-time queue position; give accurate estimates; notify proactively<br/>- **Extended waiting**: "They kept extending my waiting time, waiting for an hour before giving up" |

---

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.4: Book Appointments for Dependents

| Field | Details |
|---|---|
| User Story | **As a patient with children**, I want to book appointments on behalf of my children, to organize their healthcare. |
| Acceptance Criteria | 1. The user can add up to 5 dependent persons (e.g., children) in their profile<br/>2. For each person, name, date of birth, health insurance are stored *(tech)*<br/>3. During appointment booking, "Who is the appointment for?" is asked with a dropdown<br/>4. The API sends the patient data (not the booker's) to the practice *(tech)*<br/>5. GDPR: Dependent persons can be deleted separately *(tech)* |
| Notes | - Cross-appointment booking for family members needed<br/>- 44% of pediatric appointments within 48 hours |

---

> 🟢 **Coverage (v3 app): 75%**

### US 1.2.5: Real-Time Appointment Status

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to see the status of my appointment request in real-time, to know if the practice has confirmed the appointment. |
| Acceptance Criteria | 1. Status is displayed in the appointment overview: "In Progress", "Confirmed", "Rejected"<br/>2. A push notification is sent upon status change *(tech — delivery; UX: notification content)*<br/>3. The API polls the practice status every 60 seconds (or uses webhooks, if available) *(tech)*<br/>4. Timestamp of last status update is displayed<br/>5. For "Rejected": Reason for rejection is displayed (if available) |
| Notes | - **Wait Time Transparency** — Show real-time queue position; give accurate estimates; notify proactively<br/>- Wait time honesty — TeleClinic "keeps extending" estimates — Accurate queue + proactive updates |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.2.6: Export Appointment to Calendar

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to export a confirmed appointment to my calendar, so I don't forget it. |
| Acceptance Criteria | 1. Export as .ics file (compatible with Google Calendar, Apple Calendar, Outlook) *(tech)*<br/>2. The .ics file contains: date, time, doctor name, address, phone number *(tech)*<br/>3. The export button is only displayed for status "Confirmed"<br/>4. Optional: Deep-link for direct addition to Google/Apple Calendar<br/>5. The API generates the .ics file server-side (no client generation) *(tech)* |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- "No more phone calls" (Doctolib positive) |

---

> ❌ **Coverage (v3 app): 0%**

### US 1.2.7: Appointment Reminders

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to receive a reminder 24 and 72 hours before the appointment, to cancel the appointment in time if needed. |
| Acceptance Criteria | 1. Push notification is sent exactly 72 hours before appointment start *(tech — scheduling)*<br/>2. The notification contains quick actions: "Confirm" and "Cancel"<br/>3. For "Cancel", the cancellation dialog opens directly<br/>4. Email reminder is sent in parallel to the push notification *(tech)*<br/>5. If push function is disabled, only email is sent *(tech)* |
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
| Acceptance Criteria | 1. Modification is only possible up to 24h before appointment start<br/>2. Upon modification, the appointment is automatically canceled via API *(tech)*<br/>3. The user can enter new search parameters (as with new booking)<br/>4. The old appointment request is marked as "Modified"<br/>5. Confirmation email with new appointment details is sent *(tech)* |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

> 🟡 **Coverage (v3 app): 50%**

### US 1.2.10: Cancel Appointment

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to cancel an appointment, to inform the practice in time and give others the opportunity to get the appointment. |
| Acceptance Criteria | 1. Cancellation is possible up to 24 hours before appointment start<br/>2. Upon cancellation, the API is called immediately *(tech)*<br/>3. The user receives a confirmation email about the cancellation *(tech)*<br/>4. Canceled appointments are marked as "Canceled" in the history |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

## 1.3 Epic: Post-Appointment Follow-Up

> ❌ **Coverage (v3 app): 0%**

### US 1.3.1: Automatic Feedback Request

| Field | Details |
|---|---|
| User Story | **As a system operator**, I want to automatically collect feedback from the patient 1 hour after appointment end, to monitor service quality. |
| Acceptance Criteria | 1. Push notification is automatically sent 1h after appointment end *(tech — scheduling)*<br/>2. The notification contains a link to the rating form<br/>3. Rating includes: Star rating (1-5), optional free-text comments<br/>4. If push function is disabled, email with rating link is sent *(tech)*<br/>5. The API stores ratings in a GDPR-compliant manner (without patient name when released to practice) *(tech)* |
| Notes | - **Unified Experience** — #1 complaint is fragmentation; single app for booking + telemedicine + prescription + pharmacy<br/>- **Negative feedback**: Elderly users perceive negative feedback as "distracting and frustrating" |

---


## 1.5 Epic: Appointment Changes by Practice

> 🟡 **Coverage (v3 app): 50%**

### US 1.5.1: Practice-Initiated Appointment Changes

| Field | Details |
|---|---|
| User Story | **As a practice system**, I want to automatically transmit appointment changes to the app, to inform patients in a timely manner. |
| Acceptance Criteria | 1. The practice sends appointment changes to Curaay *(tech)*<br/>2. Curaay forwards the change to the system within 60 seconds *(tech)*<br/>3. The app immediately sends a push notification to the patient *(tech — delivery; UX: notification content)*<br/>4. The modified appointment is updated in the app (Status: "Modified by Practice")<br/>5. Error handling: In case of API error, retry after 5 minutes *(tech)* |
| Notes | - **Cancelled appointments**: "Appointment cancelled day-of via app, couldn't contact doctor, then blamed for no-show"<br/>- Wait time honesty — TeleClinic "keeps extending" estimates — Accurate queue + proactive updates |

---


## 1.8 Epic: Additional User Stories

> 🟠 **Coverage (v3 app, UX scope): 25%** — 1 of 4 US in scope (1.8.1, 1.8.2, 1.8.4 technical)

### US 1.8.1: Intelligent API Error Code Processing

| Field | Details |
|---|---|
| User Story | **As a system**, I want to intelligently process API error codes, to inform the user about technical problems and automatically perform retry attempts. |
| Acceptance Criteria | 1. For API error 503 (Service Unavailable): Automatic retry after 5, 10, 30 seconds *(tech)*<br/>2. For API error 429 (Rate Limit): Wait until reset time (Header "Retry-After") *(tech)*<br/>3. For API error 401/403: User is prompted to log in again *(tech)*<br/>4. For network timeout (&gt;10s): User-friendly error message with "Try again" button<br/>5. All API errors are stored in logs (for admin monitoring) *(tech)* |
| Notes | - "Most people will give up after second error message"<br/>- **Fear of errors**: Anxiety about making mistakes contributes to resistance<br/>- Positive, encouraging error messages |

---

> ⚙️ **Out of design scope** (technical — local DB, sync)

### US 1.8.2: Offline Appointment Viewing

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to see my booked appointments even without internet connection, to always be informed. |
| Acceptance Criteria | 1. Booked appointments are stored locally on the device (SQLite or Realm) *(tech)*<br/>2. The local database is updated with each successful API sync *(tech)*<br/>3. In offline mode, a notice is displayed: "Offline – Data will be updated upon connection"<br/>4. Appointment booking is not possible in offline mode (display only) *(tech)*<br/>5. When back online: Automatic synchronization within 10 seconds *(tech)* |
| Notes | - **E-Rezept System Outages (Aug 2025):** 5 days of complete outages or significant disruptions in 2 weeks<br/>- "Tens of thousands of patients" affected each time<br/>- Don't promise what you can't deliver (wait times, delivery dates) |

---

> 🟠 **Coverage (v3 app): 25%**

### US 1.8.3: Granular Data Usage Consent

| Field | Details |
|---|---|
| User Story | **As a patient**, I want to granularly control for what purposes my data is used, to exercise my privacy rights. |
| Acceptance Criteria | 1. Separate opt-in checkboxes for: "Necessary Cookies", "Analytics", "Marketing Emails"<br/>2. Consents can be changed at any time in settings<br/>3. The API stores consents with timestamp (proof requirement) *(tech)*<br/>4. Upon withdrawal of Analytics: All previous tracking data is anonymized *(tech)*<br/>5. GDPR Art. 7: Consent must be as easy to revoke as it is to grant |
| Notes | - Privacy concerns: Austrian Chamber of Doctors recommends patients opt out<br/>- Privacy fears about employer access to health data |

---

> ⚙️ **Out of design scope** (technical — infrastructure)

### US 1.8.4: Client-Side API Rate Limiting

| Field | Details |
|---|---|
| User Story | **As a system**, I want to limit API requests client-side, to protect server infrastructure and reduce costs. |
| Acceptance Criteria | 1. Maximum API requests per user: 60/minute (local counting) *(tech)*<br/>2. Upon exceeding: Request is placed in a queue *(tech)*<br/>3. The user sees a loading animation (no error message during normal use)<br/>4. For intentional abuse (&gt;200 requests/minute): Temporary account lock (5 minutes) *(tech)*<br/>5. Admin dashboard shows API usage per user (for anomaly detection) *(tech)* |
| Notes | - **Performance** — Sub-3-second loads. Native feel. No random logouts.<br/>- **Slowness**: "One of the slowest apps I've downloaded in recent years. Sometimes takes 10 min to start" |


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

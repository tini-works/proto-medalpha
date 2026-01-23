# Scope for Exploration 

**Product Owner:** [Your Name]  
**Date:** January 20, 2026  
**Purpose of Document:** Define exploration scope for core features ahead of MVP, now aligned with dm-drogerie markt-style retail partner (drugstore + healthcare). Focus on white-label B2B2C, integrating shopping/loyalty with healthcare services.

**Key Updates Summary** (for dm personas: Sarah, Marc, Helga, Elena, Thomas)  
<!-- NEW -->  
- Added retail integration emphasis: Click & Collect, in-store health checks, loyalty/deals, OTC/supplements/beauty ordering.  
- Enhanced family/chronic/beauty/preventive stories (Sarah/Helga/Elena/Marc).  
- Simplified UX for moderate proficiency (Helga).  
- Kept core integrations (Curaay/Teleclinic/CardLink/Apo) but framed as extendable from dm shopping.  
- Added in-store appointment focus (health checks, beauty services).

## v1 Scope Summary

**Platform**
| Full Vision | v1 Scope (Proposed) |
|-------------|---------------------|
| ✓ Mobile App | ✅ Mobile App |
| ✓ Backend API | ✅ Backend API |
| ✓ Admin Web | ✅ Admin Web |
| ✓ White Label | ❌ OUT |
| ✓ SSO | ❌ OUT |

**Features** (aligned with sections below)
| Full Vision | v1 Scope (Proposed) |
|-------------|---------------------|
| §1 User Registration | ✅ User Registration |
| §2 Appointments (Full) | ✅ Appointments (Curaay only) |
| §3 Telemedicine | ❌ OUT |
| §4-5 Prescriptions | ❌ OUT |
| §6 History Tracking | ❓ UNCLEAR (needs definition) |
| §7 Home Screen (CMS) | ✅❓ IN (needs definition) |
| §8 Push Notifications | ✅❓ IN (depends on Curaay scope) |

## 1. User Registration and Profile Management

**Main JTBD**  
- Functional: Complete profile to access core features.  
- Emotional: Feel secure and in control of personal health data.  
- Aspirational: Seamlessly integrate healthcare into daily life without friction.

**Purpose**  
Gate core features behind a complete profile to ensure compliance (GDPR, insurance verification) and personalization. Addresses fragmentation by creating a single user hub. Targets all personas, especially Sarah (family) and Helga (trust/simplicity).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a new user (e.g., Elena), I want to register quickly via email/phone so that I can access the app without barriers. | - Registration form includes name, email/phone, password<br>- Email/SMS verification required<br>- Error handling for invalid inputs<br>- Process takes <1 minute<br>- Supports SSO handoff from dm retail login |
| As a registered user (e.g., Helga), I want to complete/edit my profile with insurance details so that I can unlock booking and redemption features. | - Profile fields: Insurance type (GKV/PKV), eGK details, address<br>- Mandatory for core features<br>- Large text/high contrast for accessibility <!-- UPDATED --><br>- Privacy policy link visible<br>- Save action shows success message |
| As a family manager (e.g., Sarah), I want to manage multiple family profiles (incl. children) so that I can coordinate healthcare for dependents. | - Add/switch family members (incl. minors)<br>- Link to primary insurance<br>- View/edit per profile<br>- Compliance check for data sharing consent <!-- UPDATED --> |

**User Flow**  
App Open → Registration Prompt → Input Details → Verification (Email/SMS) → Profile Completion (Insurance/Address/Family) → Mandatory Confirmation → Home Screen Access → Edit Profile (Settings)

## 2. Appointment Booking (In-Person via Curaay + In-Store Health Checks)

**Main JTBD**  
- Functional: Search and book doctor/in-store appointments quickly.  
- Emotional: Reduce stress from scheduling friction.  
- Social: Be seen as efficient in managing health.

**Purpose** <!-- UPDATED -->  
Commoditize booking + add in-store dm health checks (blood pressure, vitamin tests, beauty services). Targets Sarah (family), Marc (preventive), Elena (beauty), Thomas (routine).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a busy parent (e.g., Sarah), I want to search for doctors or in-store health checks by specialty/location so that I can find available slots quickly. | - Search filters: Specialty, location, in-store dm services<br>- Results show doctor/in-store details/reviews<br>- Integration with Curaay + dm store API <!-- NEW --><br>- Handles no-results gracefully |
| As a user (e.g., Marc), I want to book preventive in-store checks (e.g., cholesterol) or telemedicine so that I get binding confirmation. | - Select slot → Confirm details<br>- Binding via Curaay/dm<br>- Add to history/calendar<br>- Push reminder<br>- Supports family selection <!-- UPDATED --> |
| As a student (e.g., Elena), I want to book beauty/cosmetic services so that I get priority slots. | - Beauty-specific filters (hair, skincare)<br>- Online payment option<br>- Confirmation email with details <!-- NEW --> |

**User Flow**  
Profile Check → Search (Specialty/Location/In-Store) → Filter Results → Select Doctor/Service/Slot → Book → Confirm Details → Calendar Sync → Push Reminder

## 3. Telemedicine Consultation (via Teleclinic)

**Main JTBD**  
- Functional: Access video consultations for minor/preventive issues.  
- Emotional: Feel empowered to handle health without disruption.  
- Aspirational: Achieve healthier life through convenient care.

**Purpose**  
Leverage Teleclinic for video/chat (incl. dermatology/nutrition/sports). Appeals to Marc (fitness), Elena (skincare), Sarah (minor family), Helga (chronic follow-up).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a fitness user (e.g., Marc), I want to initiate telemedicine for sports/nutrition so that I can consult remotely. | - Enter WebView for Teleclinic<br>- 24/7 availability check<br>- GKV reimbursement info<br>- Seamless handoff post-consult <!-- UPDATED --> |
| As a family manager (e.g., Sarah), I want to select telemedicine for a child so that we avoid in-person visits. | - Family profile switch<br>- Consent for minors<br>- Post-consult prompt for prescription/OTC redemption <!-- UPDATED --> |
| As a retiree (e.g., Helga), I want simple instructions for chronic follow-up video so that I don't get frustrated. | - Accessibility: Large buttons, audio/video test<br>- Fallback to async if needed<br>- Success metric: Session completion rate >90% |

**User Flow**  
Profile Check → Telemedicine Option → Symptom Input → Doctor Match → Video Setup → Consult → End Session → Prescription/OTC Prompt → Follow-Up Notification

## 4. Prescription Redemption – Online (via CardLink and Apo Group)

**Main JTBD**  
- Functional: Redeem e-prescriptions + order OTC digitally.  
- Emotional: Reduce anxiety around medication access.  
- Social: Manage health discreetly and efficiently.

**Purpose** <!-- UPDATED -->  
Offer neutral redemption + OTC/supplements delivery/Click & Collect. Targets Helga (chronic), Sarah (children), Elena (discreet acne/contraception).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a user (e.g., Helga), I want to scan my eGK via NFC so that I can redeem online securely. | - CardLink integration<br>- NFC prompt<br>- Insurance verification<br>- Redirect to Apo Group/dm fulfillment<br>- Incentive applied |
| As a parent (e.g., Sarah), I want home delivery or Click & Collect for children's meds so that I avoid trips. | - Delivery/Click & Collect address from profile<br>- Tracking info<br>- Confirmation push<br>- Handles recurring meds <!-- UPDATED --> |
| As a student (e.g., Elena), I want discreet delivery for sensitive items so that privacy is protected. | - Discreet packaging option<br>- No extra fees for PKV<br>- Add to history with details <!-- NEW --> |

**User Flow**  
Profile Check → Prescription Prompt → Choose Online → NFC Scan (eGK) → Verify Details → Redeem via Apo Group/dm → Delivery/Click & Collect Confirmation → History Update → Notification

## 5. Prescription Redemption – Offline (Pharmacy Search + dm Store Locator)

**Main JTBD**  
- Functional: Find nearby dm/pharmacies for pickup.  
- Emotional: Feel supported with local options.  
- Aspirational: Maintain flexibility in healthcare choices.

**Purpose** <!-- UPDATED -->  
Integrate dm store locator + neutral pharmacies. Useful for Thomas (routine), Sarah (family pickup).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a user (e.g., Thomas), I want to search for nearby dm stores/pharmacies so that I can pick up easily. | - Location-based via Google Maps + dm store finder<br>- Filters: Open hours, distance, in-store stock<br>- Results show addresses/ratings <!-- UPDATED --> |
| As a family manager (e.g., Sarah), I want to select dm for Click & Collect so that it fits our schedule. | - Mandatory choice prompt<br>- Redirect to dm app/store<br>- Add to history |
| As a user (e.g., Marc), I want directions to dm for supplements pickup so that I can navigate quickly. | - Open in Maps app<br>- Real-time updates<br>- Error if no locations found |

**User Flow**  
Profile Check → Prescription Prompt → Choose Offline → Location Permission → Search dm/Pharmacies → Select → Get Directions → Redeem Confirmation → History Update

## 6. History Tracking

**Main JTBD**  
- Functional: View past bookings, redemptions, purchases.  
- Emotional: Feel organized and in control.  
- Social: Share summaries if needed (e.g., family).

**Purpose**  
Unified view incl. dm purchases/loyalty. Supports Sarah (family), Helga (meds).

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a user (e.g., Sarah), I want to view appointment/redemption/purchase history so that I can track everything in one place. | - Chronological list (health + dm shopping)<br>- Filters: Date/type/family member<br>- Export option (PDF)<br>- GDPR-compliant storage <!-- UPDATED --> |
| As a retiree (e.g., Helga), I want reminders from history so that I don't miss refills. | - Auto-flags upcoming refills<br>- Push alerts<br>- Simple UI with large text |

**User Flow**  
Profile Check → History Tab → Filter/Search → View Details → Export/Share → Reminder Setup

## 7. Home Screen (CMS-Driven)

**Main JTBD**  
- Functional: Access dynamic content, deals, quick actions.  
- Emotional: Feel guided and informed.  
- Aspirational: Engage with health + shopping proactively.

**Purpose** <!-- UPDATED -->  
CMS for dm branding, deals, Payback, health tips. Drives engagement across personas.

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a user (e.g., Elena), I want a personalized home screen so that I see relevant deals/health actions. | - CMS pulls content (news, dm deals, Payback, health tips)<br>- Quick links to booking/redemption/shopping<br>- Personalization via profile <!-- UPDATED --> |
| As an admin (dm partner), I want to manage CMS content so that I can brand and promote. | - Backend CMS access<br>- Multi-tenant support<br>- Preview mode |

**User Flow**  
App Open → Profile Check → Load CMS Content (Deals/Health) → Quick Action Select → Navigate to Feature → Refresh for Updates

## 8. Push Notifications and Post-Appointment Follow-Up

**Main JTBD**  
- Functional: Receive alerts for actions, deals, reminders.  
- Emotional: Reduce forgetfulness stress.  
- Aspirational: Stay proactive about health + shopping.

**Purpose**  
Timely nudges incl. dm promotions/refills. Targets all personas.

**User Stories & Acceptance Criteria**

| User Story | Acceptance Criteria |
|------------|---------------------|
| As a user (e.g., Thomas), I want push notifications for reminders/deals so that I don't miss anything. | - Opt-in mechanism<br>- Types: Appointment, prescription ready, dm deals/Payback<br>- FCM/APNs integration <!-- UPDATED --> |
| As a parent (e.g., Sarah), I want post-appointment follow-up so that I can redeem + get family reminders. | - 60-min timer post-booking<br>- Prompt: Feedback + redemption/Click & Collect<br>- Links to flows <!-- UPDATED --> |

**User Flow**  
Event Trigger (e.g., Appointment End) → Notification Send → User Tap → Feedback Form → Redemption/Purchase Prompt → Confirm Action → History Update
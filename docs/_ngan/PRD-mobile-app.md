# Product Requirements Document (PRD)
## MedAlpha Connect Mobile App

**Version:** 1.0  
**Date:** January 16, 2026  
**Authors:** Product Owner & Product Designer  

---

## 1. Overview

MedAlpha Connect is a unified healthcare service aggregator mobile app designed for MedAlpha's retail partner projects. The app provides a single, intuitive interface for booking doctor appointments, accessing telemedicine consultations, and redeeming e-prescriptions, with white-label capabilities for seamless deployment under different brand identities.

**Platform:** iOS and Android  
**Target Launch:** Q2 2026  
**Primary Integrations:** Curaay, Teleclinic, Cardlink, Apo Group, Google Maps  

---

## 2. Why Build It

### Business Case (Product Owner Perspective)

**Market Opportunity:**
- German healthcare digital transformation: E-prescription mandatory since Jan 2024, ePA utilization at 80% target by 2026
- Current fragmentation creates user friction across booking, telemedicine, and prescriptions
- No unified white-label solution exists for retail partners to offer branded healthcare services

**Revenue Model:**
- Partnership commissions from Curaay (appointments), Teleclinic (telemedicine), Apo Group (pharmacy)
- White-label licensing fees for retail partners
- Freemium model with premium features for enhanced user experience

**Strategic Value:**
- Establishes MedAlpha as leading white-label healthcare platform in Germany
- Creates scalable B2B2C distribution model leveraging retail partner ecosystems
- Drives user engagement and transaction volume through complete healthcare journey
- Enables rapid deployment with minimal customization per partner

### User Value Proposition (Product Designer Perspective)

**Solves Real User Problems:**
- Eliminates cognitive load of managing multiple healthcare apps
- Provides trustworthy, accessible healthcare access for all digital skill levels
- Reduces administrative friction between consultation and medication fulfillment
- Offers peace of mind through unified health history and proactive follow-ups

**Design-Driven Differentiation:**
- Prioritizes trust, clarity, efficiency, and accessibility as core UX principles
- Creates emotional connection through reliable, human-centered healthcare experience
- Leverages familiar retail brand trust (dm heritage) for healthcare credibility

---

## 3. Who Are the Users

### Primary User Segments

| Segment | Description | Key Characteristics | Mobile Usage Context |
|---------|-------------|---------------------|---------------------|
| **Core Patients** | German residents (25-55) with public/private insurance | Tech-comfortable, value convenience and unified experiences | Daily health management, urgent care booking |
| **Senior Patients** | Users 65+ with chronic conditions | Moderate digital skills, prefer simple interfaces | Medication management, routine check-ups |
| **Young Professionals** | Users 18-34 seeking modern healthcare | High digital literacy, demand speed and discretion | Quick consultations, preventive care |
| **Family Caregivers** | Parents managing children's health | Multi-user needs, time-constrained | Booking for family members, prescription tracking |

### User Personas (Key Examples)

**Sarah (34) - Busy Working Mother:**
- Goals: Manage family health efficiently without sacrificing time
- Pain Points: Juggling multiple apps, no family booking features
- Success Criteria: Book appointments in <2 minutes, manage multiple family members

**Helga (68) - Senior with Chronic Conditions:**
- Goals: Reliable medication management and reduced travel burden
- Pain Points: Complex e-prescription system, confusing digital interfaces
- Success Criteria: Clear step-by-step guidance, accessible touch targets

**Marc (42) - Health-Conscious Professional:**
- Goals: Proactive health management with maximum convenience
- Pain Points: Waiting rooms waste time, inconsistent telemedicine quality
- Success Criteria: Priority booking, professional video consultation quality

### Secondary Users

| User Type | Access Method | Responsibilities |
|-----------|----------------|------------------|
| **Retail Partner Admins** | Web Admin Portal | Manage white-label branding, content, user analytics |
| **MedAlpha Operations** | Internal Dashboard | Monitor platform performance, partner management |
| **Healthcare Partners** | API Integration | Provide appointment slots, telemedicine services, pharmacy fulfillment |

### User Requirements Summary

- **Accessibility:** WCAG 2.1 AA compliance, works for users with moderate digital skills
- **Trust & Security:** GDPR/DSGVO compliance, transparent data handling
- **Performance:** <2 second response times, offline capability for critical features
- **Multi-language:** German primary, 14+ European languages for dm's footprint

---

## 4. Base/Key Features

### Core Feature Pillars

| Pillar | Base Features | Advanced Features | Why Essential |
|--------|----------------|-------------------|---------------|
| **Appointment Booking** | Direct doctor appointment booking via Curaay, binding confirmations, availability calendar | Priority booking, family member management, recurring appointments | Primary revenue driver, addresses main user JTBD for quick booking |
| **Telemedicine** | Video consultations via Teleclinic, questionnaire intake, summary reports | Specialty consultations, follow-up scheduling, integration with appointment history | Differentiates from booking-only apps, enables remote care |
| **Prescription Redemption** | E-prescription scanning (NFC eGK), online fulfillment via Apo Group, offline pharmacy search | Prescription history, medication reminders, family prescription management | Completes healthcare journey, drives pharmacy revenue |
| **User Management** | Registration, profile creation, settings management | SSO integration, family accounts, biometric authentication | Enables personalized experience, ensures compliance |
| **Content & Support** | CMS-driven home screen, FAQ, support chat, legal pages | Dynamic content personalization, multi-language support, proactive notifications | Builds trust, provides guidance, ensures legal compliance |

### Key Feature Matrix

#### Must-Have (MVP Core)
- ✅ User registration and profile gating
- ✅ Appointment booking (Curaay integration)
- ✅ Telemedicine consultations (Teleclinic WebView)
- ✅ E-prescription redemption (online via Cardlink + Apo Group)
- ✅ Pharmacy search (offline via Google Maps)
- ✅ History tracking (appointments, prescriptions, consultations)
- ✅ Push notifications and post-appointment follow-ups
- ✅ Static content pages (FAQ, Privacy, Legal)

#### Should-Have (Phase 2)
- 🔄 SSO partner handoff integration
- 🔄 Enhanced white-label theming capabilities
- 🔄 Advanced user analytics and reporting
- 🔄 Multi-language content management

#### Nice-to-Have (Future)
- 📱 Family account management
- 📱 Medication reminders
- 📱 Wearable device integration
- 📱 Symptom checker (AI-powered triage)

### Mobile-Specific Considerations

**iOS & Android Optimization:**
- Native performance with React Native
- Platform-specific UI patterns (Material Design vs. Human Interface Guidelines)
- Device-specific features (NFC for eGK scanning, biometric authentication)
- Offline capability for appointment history and pharmacy search

**UX Design Principles:**
- Touch-first interaction design (minimum 44pt touch targets)
- Progressive disclosure to reduce cognitive load
- Contextual help and onboarding for complex flows
- Error prevention and recovery patterns

---

## 5. Feature Details & Functions

### 5.1 Appointment Booking Feature

**Functions:**
- Search doctors by specialty, location, availability
- View detailed doctor profiles and reviews
- Select appointment type (in-person vs. telemedicine)
- Choose date/time with real-time availability
- Enter reason for visit and insurance details
- Receive binding confirmation with calendar integration
- Automated 60-minute follow-up for feedback and prescription prompts

**Why Build:** Primary user JTBD - "Book a doctor appointment quickly"; Drives 40%+ of platform revenue through Curaay commissions.

**User Flow:** Profile Check → Search → Select → Book → Confirm → Calendar Sync → Follow-up

### 5.2 Telemedicine Feature

**Functions:**
- Access Teleclinic video interface for consultations
- Pre-consultation questionnaire completion
- Video quality optimization for mobile networks
- Consultation summary with recommendations
- Integration with prescription redemption flow
- Rating and feedback collection

**Why Build:** Differentiates from competitors; Enables remote care for time-constrained users; High-margin service.

**User Flow:** Profile Check → Enter Teleclinic → Consult → Receive Summary → Optional Prescription Redemption

### 5.3 Prescription Redemption Feature

**Functions:**
- Mandatory online/offline pharmacy choice (legal requirement)
- NFC eGK card scanning for e-prescription retrieval
- Online fulfillment through Apo Group with delivery tracking
- Offline pharmacy search with location-based results
- Prescription history and reorder functionality
- Insurance type detection (GKV vs. PKV)

**Why Build:** Completes healthcare journey; High conversion from consultations; Pharmacy revenue stream.

**User Flow:** Post-Consultation → Choose Pharmacy Type → Online: Scan eGK → Fulfill; Offline: Search Pharmacy → Redeem

### 5.4 User Management Feature

**Functions:**
- Multi-step registration with insurance verification
- Profile completion gating for feature access
- Settings management (notifications, language, privacy)
- Account security (password, biometric options)
- Data export capabilities (GDPR compliance)

**Why Build:** Ensures compliance and personalization; Required for accessing primary features.

### 5.5 Content & Support Feature

**Functions:**
- Dynamic home screen via CMS integration
- Contextual help and tooltips
- Multi-language static pages
- In-app support chat integration
- Proactive notifications for offers and reminders

**Why Build:** Builds trust and reduces support costs; Provides legal compliance pages.

---

## 6. Technical Requirements

**Platform:** React Native for cross-platform mobile development  
**Backend:** Bun-based Node.js API with TypeScript  
**Database:** PostgreSQL with Drizzle ORM  
**Authentication:** Better Auth with SSO capabilities  
**Integrations:** RESTful APIs with healthcare partners  
**Compliance:** GDPR/DSGVO, German healthcare regulations  

---

## 7. Success Metrics

- **User Acquisition:** 50K+ active users within 6 months
- **Engagement:** 2+ feature usage per user monthly
- **Conversion:** 70% consultation-to-prescription redemption rate
- **Retention:** 60% monthly active user retention
- **Satisfaction:** 4.5+ app store rating

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Integration failures with partners | High | Early API documentation review, phased integration testing |
| Regulatory non-compliance | Critical | Legal review at each milestone, mandatory online/offline choice |
| Low user adoption | High | User research validation, iterative UX testing |
| White-label complexity | Medium | Modular architecture, partner-specific theming system |

---

## 9. Next Steps

1. **Week 1-2:** Detailed user story creation and wireframe development
2. **Week 3-4:** Technical architecture design and partner API evaluation
3. **Week 5-6:** MVP scope finalization and development environment setup
4. **Month 2:** Alpha release for internal testing
5. **Month 3-4:** Partner integrations and beta testing
6. **Month 5:** Launch preparation and go-to-market planning
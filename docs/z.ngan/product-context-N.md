# me-Product Context

**Last Updated:** 2026-01-15

---

## Product Vision

A smartphone app for "MedAlpha" utilized within the framework of MedAlpha retail partner projects. Enables users to book doctor appointments and redeem prescriptions through integrated healthcare services.

---

## Summary

- Smartphone app for MedAlpha retail partner projects
- Two main functions: Appointment booking (primary) and Prescription redemption (secondary)
- Integrations: Curaay (appointments), Teleclinic (telemedicine), Apo Group (online pharmacy), Cardlink (e-prescription)
- White-label ready: Built to be released under different names and designs
- SSO support for cooperation partners planned

---

## Problem

- Healthcare services in Germany are fragmented across multiple platforms and providers
- Users currently need separate apps for booking appointments, telemedicine, and prescription services
- E-prescription redemption process is complex and not user-friendly
- No unified solution combining appointment booking with prescription fulfillment
- Retail partners lack a branded healthcare touchpoint for their customers

---

## Solution

Healthcare service aggregator app with:
- Home screen with dynamic content management (CMS)
- User management including registration
- Profile/Settings
- Appointment booking:
  - Direct doctor's appointment booking via Curaay
  - Telemedicine video consultations via Teleclinic
- Prescription redemption:
  - Online: E-prescription redemption at Apo Group via Cardlink (public and private insurance)
  - Offline: Pharmacy search (Google Maps-style, location-based)
- History tracking (past redemptions, bookings, consultations)
- Static pages: FAQ, Support, Privacy Policy, Legal Disclosure
- Push notifications

---

## Competitive Landscape

| Competitor | Appointments | Telemedicine | E-Prescription | Pharmacy Search | White-Label |
|------------|--------------|--------------|----------------|-----------------|-------------|
| Doctolib | ✓ | ✗ | ✗ | ✗ | ✗ |
| Jameda | ✓ | ✗ | ✗ | ✗ | ✗ |
| TeleClinic | ✗ | ✓ | ✗ | ✗ | ✗ |
| Shop Apotheke | ✗ | ✗ | ✓ | ✗ | ✗ |
| **MedAlpha Connect** | ✓ | ✓ | ✓ | ✓ | ✓ |

**Differentiator:** MedAlpha Connect is the only solution offering all four healthcare services in a single white-label app for retail partners.

---

## Target Users

- **Primary:** German residents with public or private health insurance seeking convenient digital healthcare access
- **Secondary:** Customers of MedAlpha retail partners (white-label deployments)
- **Demographics:** Tech-comfortable adults (25-55) who prefer smartphone-based solutions
- **Behaviors:** Users who value convenience, time savings, and unified digital experiences

---

## JTBD Ladder

| Level | Job to Be Done |
|-------|----------------|
| **Functional** | Book a doctor appointment quickly; redeem my prescription without visiting a pharmacy |
| **Emotional** | Feel in control of my healthcare; reduce stress around medical tasks |
| **Social** | Be seen as someone who manages health efficiently and uses modern solutions |
| **Aspirational** | Live a healthier life with easy access to medical care when needed |

---

## Value Proposition

**For users:** One app to manage all healthcare needs—book appointments, consult doctors via video, and redeem prescriptions online or at nearby pharmacies.

**For retail partners:** A fully white-labeled healthcare app that strengthens customer loyalty and creates a branded healthcare touchpoint without development effort.

---

## User Goals

1. Book doctor appointments directly and bindingly
2. Access telemedicine video consultations
3. Redeem e-prescriptions online (public and private insurance)
4. Find nearby offline pharmacies when needed
5. View history of past appointments and prescription redemptions
6. Receive notifications about new offers and appointment follow-ups

---

## Business Goals

1. Establish MedAlpha Connect as the leading white-label healthcare app for retail partners in Germany
2. Drive user engagement and transaction volume through integrated appointment booking and prescription services
3. Generate revenue via partnership commissions (Curaay, Teleclinic, Apo Group, Cardlink)
4. Enable rapid deployment of branded healthcare apps for new retail partners with minimal customization
5. Build a scalable platform supporting multiple white-label instances on a shared release cycle

---

## Constraints and Principles

- **Modern and sleek design** with intuitive user navigation
- **Complete profile required** for accessing the two primary features
- **SSO integration planned** for cooperation partners to hand over customers
- **White-label architecture:** App must be built to release identical functionality under different names and designs (same release cycle)
- **Legal compliance:** Users must choose between online and offline pharmacy before prescription redemption
- **Location-based pharmacy search:** Google Maps integration for offline pharmacy selection
- **Push notifications:** Used to alert users to new offers
- **Post-appointment follow-up:** Notification sent 60 minutes after appointment ends, asking for feedback and offering prescription redemption or pharmacy recommendation

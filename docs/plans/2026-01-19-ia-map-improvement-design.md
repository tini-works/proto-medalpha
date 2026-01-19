# IA Map Improvement Design

**Date**: 2026-01-19
**Status**: Approved
**Based on**: UX Review (`docs/reviews/2026-01-19-ia-map-ux-review.md`)

---

## Overview

This document captures the design decisions for restructuring the MedAlpha Connect Information Architecture (IA) based on the UX review findings. All 16 findings are addressed through a full restructure.

---

## Design Decisions Summary

| Decision | Choice | Section |
|----------|--------|---------|
| Scope | Full restructure (all 16 findings) | — |
| Navigation model | Hybrid: bottom tabs + menu | [Navigation](#navigation-model) |
| Admin IA | Separate diagram | [Admin IA](#admin-ia) |
| History structure | Tabs with "All" as default | [History](#history-structure) |
| Appointments | Merge Curaay + Teleclinic into one hub | [Appointments](#appointments-hub) |
| Rx choice labels | "Home delivery" / "Pick up at pharmacy" | [Prescriptions](#prescription-redemption) |
| NFC consent | Separate screen with trust-building content | [Consent](#nfc-consent-screen) |
| Empty/error states | Separate States Matrix document | [States](#states-matrix) |

---

## Navigation Model

### Decision
Hybrid navigation: bottom tabs for primary features + top-right menu for secondary screens.

### Structure

**Bottom tabs (always visible):**
- Home
- Appointments
- Prescriptions
- History

**Menu (top-right):**
- Profile
- Settings
- FAQ
- Support
- Privacy Policy
- Legal Disclosure
- Logout

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Users need quick access to 4 core features | Appointments and Prescriptions are primary features per requirements |
| Settings and static pages are accessed occasionally | Not needed on every session |
| Mobile-first design with thumb-friendly navigation | Target users include "all ages" per requirements |

### Pros & Cons

| Pros | Cons |
|------|------|
| Core features always one tap away | Menu items require 2 taps |
| Clean, uncluttered tab bar | Users must discover menu exists |
| Familiar mobile pattern | — |

---

## History Structure

### Decision
Four tabs: All (default), Appointments, Prescriptions, Telemedicine. "All" is selected by default showing chronological list.

### User Scenarios

**Scenario A: "When did I see Dr. Muller?"**
User is at a new doctor's office, asked "When was your last cardiology visit?" They open History to find that specific appointment.
- *Behavior*: User taps "Appt" tab to filter, then scans list.
- *Tabs help*: User can go straight to Appointments tab and scan.

**Scenario B: "What happened after my appointment last month?"**
User remembers they had an appointment 3 weeks ago and got a prescription afterward. They want to see both the appointment details AND the prescription that followed.
- *Behavior*: Default "All" tab shows appointment and related prescription near each other chronologically.
- *Unified timeline helps*: Related items appear together without tab switching.

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Users remember recent events chronologically | Most common mental model: "What happened recently?" |
| Doctors/MFAs ask about recent events | Users need quick access to latest history |
| Users occasionally need to find specific type far in past | Category tabs allow filtering when needed |
| Nearest events should be found fastest | "All" default shows everything in time order |

### Pros & Cons

| Pros | Cons |
|------|------|
| Default view shows all activity | Power users must see all content first |
| Related items appear near each other | Longer list when unfiltered |
| Tabs allow focused search when needed | 4 tabs may feel crowded on small screens |
| Matches user mental model (time-based) | — |

---

## Appointments Hub

### Decision
Merge Curaay (in-person) and Teleclinic (telemedicine) into one unified Appointments Hub. Users choose appointment type when booking.

### User Scenarios

**Scenario A: "I need to see a doctor"**
User feels unwell and wants medical advice. They don't yet know if they want in-person or video.
- *Behavior*: Opens Appointments Hub, sees both booking options, chooses based on availability or preference.
- *Merged helps*: User sees all options in one place.

**Scenario B: "I want a video call now"**
User specifically wants telemedicine (late hour, can't travel, quick question).
- *Behavior*: Opens Appointments Hub, taps "Video call" booking option.
- *Note*: Could add shortcut from Home for power users.

**Scenario C: "Where's my upcoming video appointment?"**
User booked a telemedicine session last week and wants to join today.
- *Behavior*: Opens Appointments Hub, sees all upcoming in one list.
- *Merged is clearer*: Both in-person and video appointments in one "Upcoming" list.

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Users think in terms of "seeing a doctor," not the medium | Most users don't distinguish video vs in-person until they see options |
| Users want to compare options before choosing | Availability, wait times may influence choice |
| Users expect all upcoming consultations in one place | Mental model: "my appointments" = everything scheduled |
| Teleclinic and Curaay are interchangeable from user's perspective | Both solve "I need medical advice" |
| Teleclinic WebView handoff is unavoidable | Integration is WebView-based per requirements |

### Pros & Cons

| Pros | Cons |
|------|------|
| Single mental model ("appointments") | Extra tap for telemedicine-only users |
| One place to see all upcoming | Booking flow needs choice UI |
| Easier onboarding - less to learn | — |
| No confusion about where to find appointments | — |

### Technical Note
- **Curaay**: MedAlpha controls the booking UI directly
- **Teleclinic**: Opens WebView - user is handed off to Teleclinic's UI

The hub provides consistency before and after the telemedicine WebView session.

---

## Prescription Redemption

### Decision
Binary choice with user-friendly labels: "Home delivery" and "Pick up at pharmacy" (not "Online" / "Offline").

### User Scenario

**Scenario: "I have a prescription, now what?"**
User just finished a telemedicine session and got an e-prescription. They open Prescriptions Hub and tap "Redeem."
- *Behavior*: Sees two clear options with outcome-focused labels.
- *Clear labels help*: User understands what they get, not how the system works.

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Users think about outcomes, not technical methods | "Online/Offline" is jargon; "Home delivery" is an outcome |
| Delivery time should not overpromise | "Delivered in several days" instead of "1-3 days" |
| Legal requirement for explicit choice is satisfied | Two clear buttons with legal notice |

### Labels

| Technical Term | User-Facing Label |
|----------------|-------------------|
| Online | Home delivery |
| Offline | Pick up at pharmacy |

---

## NFC Consent Screen

### Decision
Separate consent screen (RX-003B) before NFC scan with trust-building content.

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| German law requires informed consent before eGK access | eGK regulations are non-negotiable |
| Users are concerned about health data privacy | Healthcare data is sensitive |
| Showing what we DON'T access builds trust | Reduces fear of hidden data collection |
| "One-time" language reduces surveillance concerns | User knows it's not ongoing |
| Security indicators (lock icons, GDPR) signal compliance | Visual reassurance at decision moment |

### Trust-Building Patterns Used

| Pattern | Implementation |
|---------|----------------|
| Show what you DON'T do | "We don't access: Medical history, other health records, payment info" |
| One-time language | "I agree to this one-time data transfer" |
| Security badges | Encryption, GDPR, "not stored" |
| Lock icon on CTA | "Continue securely" button |
| Empowering title | "Your Data, Your Control" not "Data Access Consent" |

---

## States Matrix

### Decision
Keep IA diagrams clean with happy-path screens only. Document empty, error, and loading states in a separate States Matrix.

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| IA diagrams become unreadable with all state variations | 30+ screens x 4 states = 120+ nodes |
| States are implementation details, not navigation | Same screen handles multiple states |
| Separate matrix ensures coverage | Checklist for design and dev |

---

## Admin IA

### Decision
Create separate IA diagram for Admin Web (c3-3).

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Admin Web is a separate container (c3-3) | Different platform per architecture |
| Admins are different users than patients | Different actor (A2) per requirements |
| Admin navigation follows web patterns (sidebar) | Standard CMS pattern |
| Mixing admin and patient IA creates confusion | Current flat structure suggests they're in same app |

---

## Three-Layer Structure

### Layer 1: Entry & Auth (before login)
Screens seen once or when logged out:
- Splash
- Onboarding (Welcome, Notifications)
- Authentication (Login/Register)
- Profile Completion (if incomplete)

### Layer 2: Main App (bottom tabs)
Core features accessed every session:
- Home
- Appointments
- Prescriptions
- History

### Layer 3: Secondary (menu)
Occasionally accessed:
- Profile
- Settings
- FAQ
- Support
- Static pages (Privacy, Legal)
- Logout

### Assumptions

| Assumption | Rationale |
|------------|-----------|
| Entry screens are one-time or rare | Returning users go straight to main app |
| 4 core features cover 90% of user needs | Appointments and Prescriptions are primary features |
| Settings/help are occasional needs | Not needed every session |

---

## Files to Update

| File | Action |
|------|--------|
| `artifacts/information-architecture/sitemap.mermaid` | Replace with hierarchical patient mobile IA |
| `artifacts/information-architecture/admin-sitemap.mermaid` | Create new Admin Web IA |
| `artifacts/information-architecture/states-matrix.md` | Create new States Matrix document |

---

## Review Findings Addressed

| Finding | Severity | Resolution |
|---------|----------|------------|
| UX-001 Flat IA | Critical | Three-layer hierarchy with navigation model |
| UX-002 Missing navigation model | High | Hybrid: bottom tabs + menu |
| UX-003 Missing NFC consent | High | RX-003B consent screen added |
| UX-004 Appointments vs Teleclinic | Med | Merged into one hub |
| UX-005 Profile Completion redundancy | Med | PRF-001 only shown when incomplete |
| UX-006 History splits by type | High | "All" tab as default |
| UX-007 Binary choice too early | Med | Clear labels, same screen count |
| UX-008 Missing empty/error states | Med | States Matrix document |
| UX-009 No logout/delete account | Med | Added to menu and Settings |
| UX-010 Admin mixed with patient | Med | Separate Admin IA |
| UX-011 Missing exit points | Med | Cancel buttons in flows |
| UX-012 Post-Appointment orphaned | Low | Documented as push-triggered |
| UX-013 Admin keyboard nav | Med | Noted in Admin IA |
| UX-014 Screen reader annotations | Med | Noted for implementation |
| UX-015 Focus order | Low | Noted for implementation |
| UX-016 Language switching | Low | In Settings |

---

**Design Status**: Complete
**Next Step**: Update Mermaid diagrams and States Matrix

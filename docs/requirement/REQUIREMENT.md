# MedAlpha Connect - Requirements Document (MVP V1)

> **Status**: Enriched with architecture decisions
> **Source**: Projekt MedAlpha Connect.docx
> **Architecture**: See `.c3/` for detailed C3 documentation

## Project Overview

A smartphone application for "MedAlpha" to be used within MedAlpha retail partner projects. This app is explicitly **not** for cannabis-related projects.

**Goal**: Enable patients to book medical appointments and redeem prescriptions through a unified mobile experience, while supporting white-label deployment for retail partners.

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile Framework | React Native | Cross-platform iOS + Android |
| Backend Runtime | Bun | Fast, modern Node.js alternative |
| Target Platforms | iOS + Android | Cross-platform from single codebase |
| Admin Panel | Separate React Web App | Separation of concerns |
| CMS | Built-in Admin Panel | No external CMS dependency |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ACTORS                                    │
├─────────────┬─────────────────┬─────────────────────────────────┤
│   Patient   │    CMS Admin    │         SSO Partner             │
│    (A1)     │      (A2)       │            (A3)                 │
└──────┬──────┴────────┬────────┴──────────────┬──────────────────┘
       │               │                       │
       ▼               ▼                       │
┌─────────────┐  ┌─────────────┐               │
│ Mobile App  │  │  Admin Web  │               │
│   (c3-1)    │  │   (c3-3)    │               │
│ React Native│  │    React    │               │
└──────┬──────┘  └──────┬──────┘               │
       │                │                      │
       └───────┬────────┘                      │
               ▼                               ▼
        ┌─────────────┐                 ┌─────────────┐
        │ Backend API │◄────────────────│     SSO     │
        │   (c3-2)    │                 │   (future)  │
        │     Bun     │                 └─────────────┘
        └─────────────┘
```

**Architecture Diagram**: https://diashort.apps.quickable.co/d/eb710b7a

---

## Core Features

### 1. Home Screen
- Display app capabilities and features
- Dynamic content management via built-in CMS
- Managed by CMS Admin via Admin Web (c3-3)

### 2. User Management
- User registration (email/password, social login)
- Profile management with completion validation
- Settings and preferences
- **Future**: SSO handoff from retail partners

### 3. Primary Feature: Appointment Booking

| Sub-feature | Description | Integration | Connection |
|-------------|-------------|-------------|------------|
| Doctor Appointment | Direct, binding appointment booking | **Curaay** | Mobile: Booking UI, Backend: Webhooks/sync |
| Telemedicine | Video consultation with e-prescription capability | **Teleclinic** | Mobile: WebView only |

### 4. Secondary Feature: Prescription Redemption

| Mode | Description | Integration | Connection |
|------|-------------|-------------|------------|
| Online | E-prescription redemption (GKV & PKV) | **Cardlink** → **Apo Group** | Mobile: NFC SDK reads eGK card |
| Offline | Pharmacy search (location-based) | **Google Maps** | Mobile: Maps SDK only |

> **Legal Requirement** (German): User must explicitly choose between "online" and "offline" pharmacy before redeeming a prescription.

### 5. History
- Past prescription redemptions
- Appointment bookings (synced from Curaay)
- Telemedicine consultations
- All persisted via Backend API

### 6. Static Pages
- FAQ (CMS-managed)
- Support (CMS-managed)
- Privacy Policy (Datenschutz)
- Legal Disclosure (Impressum)

### 7. Push Notifications
- New offers/promotions
- Post-appointment follow-up (60 min after scheduled end)
  - Satisfaction check
  - Prescription redemption prompt
  - Pharmacy recommendation offer
- **Flow**: Backend (c3-2) → FCM/APNs → Mobile (c3-1)

---

## External Service Integrations

| ID | Service | Purpose | Mobile (c3-1) | Backend (c3-2) |
|----|---------|---------|---------------|----------------|
| E1 | **Curaay** | AI-driven appointment booking | Direct booking UI | Webhooks, data sync |
| E2 | **Teleclinic** | Telemedicine video consultations | WebView (patient uses their UI) | - |
| E3 | **Apo Group** | Online pharmacy (like DocMorris) | - | Order/delivery status |
| E4 | **Cardlink** | E-prescription via NFC (eGK) | NFC SDK (GEDISA/Akquinet) | - |
| E5 | **Google Maps** | Offline pharmacy search | Maps SDK | - |
| E6 | **FCM/APNs** | Push notifications | Receives | Sends |

### E-Prescription Flow

```
┌───────────┐     issues eRx     ┌───────────┐     sends Rx     ┌───────────┐
│ Teleclinic│ ─────────────────► │ Cardlink  │ ───────────────► │ Apo Group │
│   (E2)    │                    │   (E4)    │                  │   (E3)    │
└───────────┘                    └─────▲─────┘                  └───────────┘
                                       │
                                 NFC read eGK
                                       │
                                ┌──────┴──────┐
                                │ Mobile App  │
                                │   (c3-1)    │
                                └─────────────┘
```

---

## Mobile ↔ Backend Data Flows

| Domain | Direction | Operations |
|--------|-----------|------------|
| **Auth** | c3-1 → c3-2 | Login, registration, social auth, token refresh |
| **Auth (SSO)** | c3-1 → c3-2 | Partner SSO handoff (future) |
| **User/Profile** | c3-1 ↔ c3-2 | CRUD profile, completion validation |
| **CMS** | c3-1 ← c3-2 | Fetch dynamic content, offers, FAQ |
| **Appointments** | c3-1 ↔ c3-2 | Sync/store appointment data from Curaay |
| **Prescriptions** | c3-1 ↔ c3-2 | Track Rx redemption status, order updates |
| **History** | c3-1 ← c3-2 | Retrieve past appointments, prescriptions |
| **Push** | c3-1 ← c3-2 | Receive notifications via FCM/APNs |

---

## Non-Functional Requirements

### UX/Design
- Modern, sleek design
- Intuitive user navigation
- Simple user flow

### Access Control
- Two main features (Appointments, Prescriptions) require **completed profile**
- Admin panel: email/password, secured network access

### White-Label Architecture
- App must support multiple branded deployments from same codebase
- Theme tokens loaded at startup (no hardcoded colors/fonts)
- Identical release cycle for all variants

### SSO-Ready
- Authentication must support future partner SSO integration
- Planned from the beginning in architecture

---

## Actors

| ID | Actor | Access | Description |
|----|-------|--------|-------------|
| A1 | Patient | Mobile App | End user booking appointments and redeeming prescriptions |
| A2 | CMS Admin | Admin Web | Internal staff managing dynamic content |
| A3 | SSO Partner | Backend API | Future retail partners transferring customers via SSO |

---

## Resolved Questions

| Question | Decision |
|----------|----------|
| Target platforms | iOS + Android (cross-platform React Native) |
| Tech stack | React Native + Bun |
| CMS platform | Built-in Admin Panel (no external CMS) |
| Push notification service | FCM (Android) + APNs (iOS) |
| Teleclinic integration | WebView/redirect (patient uses Teleclinic UI) |
| Cardlink integration | Mobile NFC SDK (GEDISA/Akquinet) |
| Google Maps integration | Mobile Maps SDK only |
| Admin panel deployment | Separate web app (React) |

---

## Open Questions (To Be Clarified)

- [ ] SSO protocol/standard (OIDC, SAML?)
- [ ] Curaay API documentation and webhook format
- [ ] Apo Group API for order status tracking
- [ ] User data storage and GDPR compliance details
- [ ] Multi-language support requirements (DE, EN?)
- [ ] Cardlink SDK licensing (GEDISA vs Akquinet)
- [ ] White-label configuration storage (per-deployment or per-tenant?)
- [ ] Offline mode requirements (beyond pharmacy search)

---

## Container Summary

| Container | Tech | Purpose | External Connections |
|-----------|------|---------|---------------------|
| **c3-1** Mobile App | React Native | Patient-facing app | Curaay (UI), Teleclinic (WebView), Cardlink (NFC), Maps |
| **c3-2** Backend API | Bun | Business logic, data | Curaay (sync), Apo Group (status), Push (send) |
| **c3-3** Admin Web | React | CMS management | Backend API only |

---

## Next Steps

1. ~~Clarify technology stack~~ ✅
2. ~~Define architecture containers~~ ✅
3. ~~Map external integration points~~ ✅
4. Obtain API documentation for Curaay, Apo Group
5. Evaluate Cardlink SDK options (GEDISA/Akquinet)
6. Define detailed user stories per feature
7. Design wireframes/mockups
8. Set up development environment

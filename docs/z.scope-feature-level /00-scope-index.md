# Scope Index

**Version:** 1.0
**Last Updated:** 2026-01-20
**Status:** Draft

---

## Overview

This document indexes the Scope for Exploration documents for all core features of the MedAlpha Connect mobile app. Each scope document defines the JTBD, purpose, user stories with acceptance criteria, and user flow diagrams.

---

## Core Features Summary

| # | Feature | ID | JTBD Summary | Primary Personas |
|---|---------|-----|--------------|------------------|
| 1 | [Appointment Booking](./01-appointment-booking-scope.md) | MEDA-BOOK | Find and book doctor appointments without phone calls | Sarah, Marc |
| 2 | [Telemedicine](./02-telemedicine-scope.md) | MEDA-TELE | Consult a doctor via video immediately or scheduled | Marc, Sarah, Helga |
| 3 | [E-Prescription](./03-e-prescription-scope.md) | MEDA-ERX | Redeem e-prescriptions at online or local pharmacy | Helga, Sarah |
| 4 | [Pharmacy Search](./04-pharmacy-search-scope.md) | MEDA-APOT | Find nearby pharmacies with services and hours | Helga, Sarah |

---

## User Flow Summary

### Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     MEDALPHA CONNECT - INTEGRATED USER JOURNEY                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │    USER NEED     │
                         │  "I need care"   │
                         └──────────────────┘
                                  │
               ┌──────────────────┼──────────────────┐
               ▼                  ▼                  ▼
     ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
     │  IN-PERSON      │ │   REMOTE        │ │   MEDICATION    │
     │  APPOINTMENT    │ │   CONSULTATION  │ │   NEEDED        │
     │  NEEDED         │ │   OKAY          │ │                 │
     └─────────────────┘ └─────────────────┘ └─────────────────┘
               │                  │                  │
               ▼                  ▼                  │
     ┌─────────────────┐ ┌─────────────────┐        │
     │  APPOINTMENT    │ │  TELEMEDICINE   │        │
     │  BOOKING        │ │                 │        │
     │  ─────────────  │ │  ─────────────  │        │
     │  Search         │ │  Now/Scheduled  │        │
     │  → Select       │ │  → Symptom      │        │
     │  → Book         │ │  → Wait/Book    │        │
     │  → Confirm      │ │  → Video Call   │        │
     │                 │ │  → Summary      │        │
     └─────────────────┘ └─────────────────┘        │
               │                  │                  │
               │                  │ (If Rx issued)   │
               │                  ▼                  │
               │        ┌─────────────────┐         │
               │        │  E-PRESCRIPTION │◄────────┘
               │        │                 │
               │        │  ─────────────  │
               │        │  NFC Scan       │
               │        │  → Details      │
               │        │  → Choose Path  │
               │        └─────────────────┘
               │                  │
               │      ┌───────────┴───────────┐
               │      ▼                       ▼
               │ ┌─────────────┐      ┌─────────────┐
               │ │   ONLINE    │      │   LOCAL     │
               │ │   DELIVERY  │      │   PICKUP    │
               │ │             │      │             │
               │ │ → Checkout  │      │ → Find      │
               │ │ → Order     │      │ → Reserve   │
               │ │ → Track     │      │ → Navigate  │
               │ └─────────────┘      └─────────────┘
               │                             │
               │                             ▼
               │                    ┌─────────────────┐
               │                    │    PHARMACY     │
               │                    │    SEARCH       │
               │                    │                 │
               │                    │  ─────────────  │
               │                    │  Map/List       │
               │                    │  → Filter       │
               │                    │  → Details      │
               │                    │  → Navigate     │
               │                    └─────────────────┘
               │                             │
               ▼                             ▼
     ┌─────────────────────────────────────────────────┐
     │                 CARE RECEIVED                    │
     │  • Appointment attended                         │
     │  • Consultation completed                       │
     │  • Medication obtained                          │
     └─────────────────────────────────────────────────┘
```

---

## Feature Integration Points

| From | To | Integration |
|------|-----|-------------|
| **Telemedicine** → **E-Prescription** | Prescription issued during call flows to E-Rezept | TELE-021 → ERX-004 |
| **Telemedicine** → **Booking** | Follow-up appointment booking from summary | TELE-023 → BOOK-010 |
| **E-Prescription** → **Pharmacy Search** | "Local Pharmacy" option opens pharmacy finder | ERX-018 → APOT-017 |
| **Pharmacy Search** → **E-Prescription** | "E-Rezept einlösen" returns to reservation flow | APOT-017 → ERX-019 |
| **Booking** → **Telemedicine** | "Video-Sprechstunde" option in booking | BOOK-006 → TELE-001 |

---

## User Story Count by Feature

| Feature | Epics | User Stories | Priority Stories (P1) |
|---------|-------|--------------|----------------------|
| Appointment Booking | 5 | 22 | 14 |
| Telemedicine | 6 | 28 | 18 |
| E-Prescription | 6 | 28 | 20 |
| Pharmacy Search | 5 | 24 | 15 |
| **Total** | **22** | **102** | **67** |

---

## Persona Coverage Matrix

| Feature | Sarah (34) | Marc (42) | Helga (68) | Elena (23) | Thomas (51) |
|---------|:----------:|:---------:|:----------:|:----------:|:-----------:|
| Appointment Booking | ★★★ | ★★★ | ★★ | ★ | ★★ |
| Telemedicine | ★★★ | ★★★ | ★★★ | ★★ | ★ |
| E-Prescription | ★★★ | ★ | ★★★ | ★★ | ★★ |
| Pharmacy Search | ★★★ | ★ | ★★★ | ★ | ★★ |

★★★ = Primary | ★★ = Secondary | ★ = Tertiary

---

## Key Dependencies Summary

| Dependency | Features Affected | Partner | Status |
|------------|-------------------|---------|--------|
| Curaay Booking API | Appointment Booking | Curaay | In progress |
| Teleclinic Video API | Telemedicine | Teleclinic | In progress |
| CardLink NFC SDK | E-Prescription | gematik | Required |
| Apo Group Order API | E-Prescription | Apo Group | In progress |
| Google Maps SDK | Pharmacy Search | Google | Available |
| Pharmacy Database | Pharmacy Search, E-Prescription | DAV/Partner | In progress |

---

## Success Metrics Summary

| Feature | Primary Metric | Target |
|---------|----------------|--------|
| Appointment Booking | Booking completion rate | >60% |
| Telemedicine | Consultation completion rate | >80% |
| E-Prescription | Prescription redemption rate | >70% |
| Pharmacy Search | Route action rate | >50% |

---

## Cross-Cutting Requirements

These requirements apply to all features:

### Accessibility (Helga Persona Test)
- Minimum 16pt body text; 20pt+ headings
- 48x48dp minimum touch targets
- High contrast mode support
- Step indicators for multi-step flows
- Clear confirmation at every critical action

### Localization
- German (primary) at launch
- English at launch
- 14 additional languages on roadmap

### Performance
- Page loads <2 seconds on 3G
- API responses <3 seconds
- Graceful offline handling

### Security
- End-to-end encryption for health data
- GDPR/DSGVO compliant
- No recording without consent

---

## Document Links

1. **[Appointment Booking Scope](./01-appointment-booking-scope.md)** - MEDA-BOOK
2. **[Telemedicine Scope](./02-telemedicine-scope.md)** - MEDA-TELE
3. **[E-Prescription Scope](./03-e-prescription-scope.md)** - MEDA-ERX
4. **[Pharmacy Search Scope](./04-pharmacy-search-scope.md)** - MEDA-APOT

---

## References

- [Product Context](../product-context-G.md)
- [Personas](../personas-details-G.json)
- [Social Listening Synthesis](../z.research/social-listening-synthesis.md)
- [Competitive Landscape](../z.research/competitive-landscape-research.md)
- [Market Opportunity Analysis](../z.research/market-opportunity-analysis.md)

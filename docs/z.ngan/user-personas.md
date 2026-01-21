# User Personas

**Date:** 2026-01-16
**Based on:** Market Research, Product Context

---

## Persona Overview

| Persona | Segment | Insurance | Age | Primary Use Case |
|---------|---------|-----------|-----|------------------|
| **Lena** | Young Professional | GKV | 28 | Quick booking, telemedicine |
| **Thomas** | Family Manager | GKV (Family) | 42 | Multi-member appointments |
| **Ingrid** | Retiree | GKV (KVdR) | 67 | Prescription management |
| **Markus** | High-Earner | PKV | 45 | Premium experience |

---

## Persona 1: Lena — The Busy Professional

### Profile

| Attribute | Details |
|-----------|---------|
| **Age** | 28 |
| **Location** | Berlin |
| **Occupation** | Marketing Manager |
| **Insurance** | GKV (TK) |
| **Income** | €55,000/year |
| **Device** | iPhone 14, always connected |

### Context

Lena works long hours and values efficiency above all. She's comfortable with digital tools and expects apps to "just work." She rarely gets sick but needs occasional specialist appointments and annual checkups. When she does need healthcare, she wants it fast—no phone calls, no waiting rooms.

### Healthcare Behavior

- **Doctor visits:** 3-4x per year (GP + specialists)
- **Prescriptions:** 2-3x per year (acute, not chronic)
- **Current tools:** Doctolib for booking, paper prescriptions
- **Pain point:** Forgetting to pick up prescriptions before pharmacy closes

### Goals

1. Book appointments in under 2 minutes
2. Access telemedicine for minor issues (no time off work)
3. Get prescriptions delivered to avoid pharmacy trips

### Frustrations

- "Why do I need to call to book an appointment in 2025?"
- "I got a prescription but the pharmacy was closed when I got there"
- "I have 3 different apps for healthcare—it's ridiculous"

### Quote

> "I don't have time to manage my healthcare. I just want it handled."

### MedAlpha Opportunity

- **Primary feature:** Telemedicine + instant booking
- **Secondary feature:** Online prescription delivery
- **Trigger:** Feeling unwell, needs quick consultation
- **Channel:** App store search, retail partner promotion

---

## Persona 2: Thomas — The Family Manager

### Profile

| Attribute | Details |
|-----------|---------|
| **Age** | 42 |
| **Location** | Munich suburbs |
| **Occupation** | IT Project Manager |
| **Insurance** | GKV (Barmer) — family plan |
| **Family** | Wife (40), two children (8, 12) |
| **Income** | €72,000/year |
| **Device** | Samsung Galaxy, iPad for family |

### Context

Thomas manages healthcare for his entire family. His kids need pediatrician visits, his wife has a chronic condition requiring regular checkups, and he handles his own annual screenings. He's the "family IT department" and default healthcare coordinator.

### Healthcare Behavior

- **Doctor visits:** 15-20x per year (family total)
- **Prescriptions:** 10-12x per year (mix of acute and chronic)
- **Current tools:** Mix of phone calls, Doctolib, paper calendar
- **Pain point:** Coordinating schedules across 4 family members

### Goals

1. Manage all family appointments in one place
2. Track prescription history for each family member
3. Get reminders before appointments and prescription refills

### Frustrations

- "I can never remember which kid saw which doctor last"
- "My wife's prescription ran out and I didn't realize until Sunday"
- "I spend hours on the phone booking appointments for everyone"

### Quote

> "I need a family health dashboard, not just another booking app."

### MedAlpha Opportunity

- **Primary feature:** Family appointment management
- **Secondary feature:** Prescription tracking and reminders
- **Trigger:** Kid gets sick, needs appointment ASAP
- **Channel:** Retail partner (pharmacy, health store)

---

## Persona 3: Ingrid — The Careful Retiree

### Profile

| Attribute | Details |
|-----------|---------|
| **Age** | 67 |
| **Location** | Hamburg |
| **Occupation** | Retired teacher |
| **Insurance** | GKV (AOK) — pensioner |
| **Income** | €2,400/month pension |
| **Device** | Android phone (basic), prefers larger text |

### Context

Ingrid has high blood pressure and Type 2 diabetes requiring regular monitoring. She visits her GP monthly and specialists quarterly. She's cautious about technology but willing to learn if it makes her life easier. Trust and simplicity are paramount.

### Healthcare Behavior

- **Doctor visits:** 15-18x per year (regular monitoring)
- **Prescriptions:** Monthly refills (3 ongoing medications)
- **Current tools:** Paper calendar, local pharmacy relationship
- **Pain point:** Remembering to refill prescriptions on time

### Goals

1. Never run out of medication
2. Keep track of all her appointments and medical history
3. Feel confident using the app (not confused or frustrated)

### Frustrations

- "I forgot to call for my prescription refill again"
- "The pharmacy app is too complicated—I gave up"
- "I don't trust apps with my health data"

### Quote

> "I just want something simple that helps me stay on top of my medications."

### MedAlpha Opportunity

- **Primary feature:** Prescription reminders and easy refills
- **Secondary feature:** Appointment history and upcoming visits
- **Trigger:** Prescription running low, needs refill
- **Channel:** Pharmacy recommendation, family member referral
- **UX consideration:** Large text, simple navigation, clear confirmations

---

## Persona 4: Markus — The Premium Expecter

### Profile

| Attribute | Details |
|-----------|---------|
| **Age** | 45 |
| **Location** | Frankfurt |
| **Occupation** | Finance Director |
| **Insurance** | PKV (Allianz Private) |
| **Income** | €140,000/year |
| **Device** | iPhone 15 Pro, Apple Watch |

### Context

Markus chose private insurance for faster access and better service. He expects premium experiences in all aspects of life, including healthcare. He values his time highly and is willing to pay for convenience. He's health-conscious and tracks fitness metrics.

### Healthcare Behavior

- **Doctor visits:** 6-8x per year (preventive focus)
- **Prescriptions:** 4-5x per year
- **Current tools:** Direct doctor relationships, private clinic apps
- **Pain point:** Coordinating between multiple private providers

### Goals

1. Same-day or next-day appointments when needed
2. Seamless experience matching his premium insurance
3. Integration with health tracking (Apple Health)

### Frustrations

- "I pay for private insurance but still wait for appointments"
- "Why can't I see all my health data in one place?"
- "The app experience should match the premium I pay"

### Quote

> "I expect the healthcare experience to match the premium I pay."

### MedAlpha Opportunity

- **Primary feature:** Priority booking, premium telemedicine
- **Secondary feature:** Health data integration
- **Trigger:** Needs specialist appointment quickly
- **Channel:** High-end retail partner, wellness brand
- **UX consideration:** Premium aesthetics, fast performance, data privacy emphasis

---

## Persona Comparison Matrix

| Dimension | Lena | Thomas | Ingrid | Markus |
|-----------|------|--------|--------|--------|
| **Tech comfort** | High | High | Low | High |
| **Time sensitivity** | Very high | High | Low | Very high |
| **Price sensitivity** | Medium | Medium | High | Low |
| **Trust requirement** | Medium | Medium | Very high | High |
| **Frequency of use** | Low-medium | High | High | Medium |
| **Primary trigger** | Acute illness | Family need | Prescription refill | Preventive care |
| **Preferred channel** | Online | Online | Offline + Online | Online |

---

## Design Implications

### For Lena (Busy Professional)
- Speed is everything—minimize taps to book
- Prominent telemedicine option
- Push notifications for prescription ready

### For Thomas (Family Manager)
- Family member switching/profiles
- Shared calendar view
- Batch booking capability

### For Ingrid (Retiree)
- Accessibility: large text, high contrast
- Simple, linear flows
- Confirmation at every step
- Trust signals: data privacy, official certifications

### For Markus (Premium Expecter)
- Premium visual design
- Fast performance, no loading states
- PKV-specific features highlighted
- Health data integration

---

## Segment Sizing (Germany)

| Persona Type | Estimated Population | % of Target |
|--------------|---------------------|-------------|
| Young Professionals (GKV, 25-35) | ~10 million | 12% |
| Family Managers (GKV Family) | ~15 million | 18% |
| Retirees (KVdR) | ~17.6 million | 21% |
| PKV Members | ~8.7 million | 10% |
| Other GKV | ~32 million | 39% |

**Priority for MVP:** Lena + Thomas (tech-ready, high engagement potential)
**Growth opportunity:** Ingrid (large segment, underserved by current apps)
**Premium segment:** Markus (high value, brand ambassadors)

---

## Sources

- Market Research: [market-research.md](./research/market-research.md)
- Product Context: [product-context-enriched.md](./product-context-enriched.md)
- German Insurance Statistics: GKV/PKV population data

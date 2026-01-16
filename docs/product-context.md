# Product Context

**Last Updated:** 2026-01-16

**See also:**
- Visual design rationale: `visual-guidelines.md`
- Copy & tone: `copy-guidelines.md`
- Design tokens: `design-tokens.json`
- Implementation patterns: `design-system-rules.md`

---

## Product Vision

A trusted, accessible healthcare companion for dm-drogerie markt customers across Europe. Enables appointment booking, telemedicine consultations, and prescription redemption through a single, intuitive mobile experience that works for everyone, from digital natives to seniors managing chronic conditions.

---

## Summary

- German-first healthcare app with 14+ language support (reflecting dm's European footprint)
- Extends dm brand into healthcare services via partner integrations (Curaay, Teleclinic, Cardlink/Apo Group)
- Primary UX axis: Balance of **Trust + Clarity + Efficiency + Accessibility**
- Co-branded partner experience ("powered by Teleclinic")
- White-label architecture: Built for multi-brand deployment, not yet implemented
- Core features: Appointment booking, telemedicine, e-prescription redemption, pharmacy search

---

## Problem

dm customers need healthcare services but face fragmented experiences:

- **Appointment booking** requires calling clinics, waiting on hold, navigating complex scheduling
- **E-prescription redemption** is confusing, especially for older users unfamiliar with NFC/gematik
- **Telemedicine** exists but is scattered across multiple apps with inconsistent quality
- **Pharmacy search** requires separate apps or browser searches
- **No unified health history** across services

**User pain points by segment:**

| Segment | Primary Pain |
|---------|--------------|
| Seniors (Helga) | E-prescription system is confusing, traveling to pharmacy is burdensome |
| Parents (Sarah) | Juggling multiple apps, no time for in-person visits, managing family health |
| Professionals (Marc) | Waiting rooms waste time, want on-demand professional advice |
| Students (Elena) | High cost of private consultations, need discreet access to sensitive medications |
| Pragmatists (Thomas) | Unclear pricing, inefficient processes, hidden complexity |

---

## Solution

A unified dm healthcare app that:

1. **Consolidates** appointment booking, telemedicine, and prescription services in one place
2. **Leverages dm trust** to enter healthcare with credibility
3. **Prioritizes accessibility** so all ages and digital skill levels can use it
4. **Integrates seamlessly** with existing dm ecosystem (loyalty, stores, Click & Collect)

---

## Competitive Landscape

**Direct competitors (Germany):**

| App | Strengths | Weaknesses | MedAlpha Opportunity |
|-----|-----------|------------|---------------------|
| **Doctolib** | Large doctor network, strong booking UX, established brand | No prescription services, no pharmacy integration, no retail touchpoint | Unified health + retail experience |
| **Jameda** | Doctor reviews, appointment booking | Dated UI, no telemedicine, no prescription | Modern UX, full service integration |
| **TK-App** (Techniker Krankenkasse) | Insurance integration, health records | Only for TK members, complex UI | Open to all, simpler experience |
| **AOK Mein Leben** | Wellness features, insurance integration | Only for AOK members, limited booking | Universal access |
| **Teleclinic** | Strong telemedicine, quick consultations | Telemedicine only, no booking/pharmacy | Full healthcare journey |
| **Shop Apotheke** | Prescription delivery, large inventory | No appointments, no telemedicine | Complete healthcare, not just pharmacy |

**Competitive gaps MedAlpha fills:**

1. **No app combines** booking + telemedicine + prescription + pharmacy in one experience
2. **Insurance apps** are member-only, MedAlpha is universal
3. **Booking apps** (Doctolib, Jameda) stop at appointments
4. **Pharmacy apps** (Shop Apotheke) don't offer consultations
5. **dm brand trust** provides differentiation in crowded market

**Positioning:** "Your complete healthcare companion" not "another doctor booking app"

---

## Target Users

**Primary audience:**
- dm customers across all ages who want convenient, trustworthy healthcare services

**Five key personas:**

### 1. Sarah (34) - The Busy Working Mother
- **Goal:** Manage family health efficiently without sacrificing time
- **Key needs:** Quick booking, prescription refills for children, telemedicine for minor ailments
- **Digital skill:** High
- **Quit triggers:** Too slow, can't book for family members easily

### 2. Marc (42) - The Health-Conscious Professional
- **Goal:** Proactive health management with maximum convenience
- **Key needs:** On-demand consultations, preventive check-ups, time efficiency
- **Digital skill:** Very High
- **Quit triggers:** Wastes his time, poor video quality

### 3. Helga (68) - The Senior with Chronic Conditions
- **Goal:** Reliably manage medications and reduce travel burden
- **Key needs:** Simple prescription flow, accessible UI, step-by-step guidance
- **Digital skill:** Moderate
- **Quit triggers:** Confusing flow, too many steps, unclear what happened

### 4. Elena (23) - The Young Wellness Enthusiast
- **Goal:** Affordable, trendy health and beauty solutions
- **Key needs:** Discreet ordering, dermatology consults, modern experience
- **Digital skill:** Very High
- **Quit triggers:** Feels outdated, not discreet enough

### 5. Thomas (51) - The Value-Driven Pragmatist
- **Goal:** Save money and time on routine health needs
- **Key needs:** Transparent pricing, clear confirmations, no complexity
- **Digital skill:** Moderate
- **Quit triggers:** Hidden costs, unclear confirmations

---

## Primary UX Axis

MedAlpha balances four principles equally:

| Principle | Expression |
|-----------|------------|
| **Trust** | Professional visual language, clear confirmations, dm brand credibility |
| **Clarity** | Unambiguous UI, step indicators, explicit feedback at every stage |
| **Efficiency** | Minimal steps, smart defaults, remembered preferences |
| **Accessibility** | Works for Helga (68) with moderate digital skills and chronic conditions |

**Design test:** If a feature doesn't serve all four principles, redesign it until it does.

---

## JTBD Ladder

### Core Jobs (Functional)

**Appointment Booking:**
> When I need to see a doctor, help me find an available appointment near me and book it quickly, so I can get care without phone calls or waiting.

**Telemedicine:**
> When I have a health concern that doesn't require physical examination, help me consult a doctor via video immediately or at a scheduled time, so I can get professional advice without leaving home.

**Prescription Redemption:**
> When I have an e-prescription, help me redeem it at an online pharmacy or find a local pharmacy, so I can get my medication with minimal effort.

### Supporting Jobs (Functional)

- Help me track my appointments and prescriptions in one place
- Help me manage health for my family members (Sarah)
- Help me understand costs before committing (Thomas)
- Help me access sensitive medications discreetly (Elena)
- Help me complete tasks even with limited digital skills (Helga)

### Emotional Jobs

- Help me feel confident I'm making the right health decisions
- Help me feel in control of my healthcare, not dependent on complex systems
- Help me trust that my data is secure and private
- Help me feel supported, not judged, about my health needs

### Social Context

- Respect German healthcare culture: professionalism, privacy, thoroughness
- Support multi-generational use: parents booking for children, children helping parents
- Maintain dm brand warmth while adding clinical credibility

---

## Value Proposition

**Core promise:** One trusted app for all your healthcare needs.

**Differentiators:**

| Differentiator | Implementation |
|----------------|----------------|
| **dm brand trust** | 12.5M existing app users, 27.5% market share, established retail relationship |
| **Complete healthcare journey** | Booking → Consultation → Prescription → Delivery in one app |
| **Universal accessibility** | Works for Helga (68) and Elena (23) equally well |
| **Co-branded quality** | "Powered by Teleclinic" signals professional healthcare partners |
| **German-first, European-ready** | 14+ language support for dm's Central/Eastern European footprint |
| **Pharmacy integration** | Online (Apo Group) + Offline (pharmacy search) options |

---

## User Goals (Ranked)

1. **Book doctor appointments** quickly without phone calls (in-person or telemedicine)
2. **Redeem e-prescriptions** easily, choosing online delivery or local pharmacy
3. **Access telemedicine** for quick consultations without travel
4. **View health history** (past appointments, prescriptions, consultations)
5. **Manage family health** from one account (future consideration)
6. **Find nearby pharmacies** when immediate medication is needed

---

## Success Metrics

### Feature Success

| Feature | Primary Metric | Secondary Metric |
|---------|----------------|------------------|
| **Appointment Booking** | Completed booking | Showed up to appointment |
| **Prescription (Online)** | Successfully delivered | Delivery time |
| **Prescription (Offline)** | Successfully redeemed at pharmacy | Time to find pharmacy |
| **Telemedicine** | Completed call | User satisfaction rating |

### Business Goals

*To be defined. Focus on product-market fit first.*

Potential metrics to track:
- Active users (weekly, monthly)
- Feature adoption rate (booking vs. prescription vs. telemedicine)
- Retention (7-day, 30-day)
- Task completion rate per feature
- User satisfaction (NPS, app store ratings)
- Cross-feature usage (users who use 2+ features)

### Monetization

*To be defined.*

Potential models:
- Commission per appointment/transaction
- Partner fees from Curaay, Teleclinic, Apo Group
- Premium features (priority booking, family accounts)
- dm ecosystem integration (Payback points, store promotions)

---

## Persona Testing Dimensions

When testing features, evaluate against all five personas:

### Helga (68) - Accessibility Benchmark

| Dimension | Pass | Concern | Fail |
|-----------|------|---------|------|
| **Step clarity** | Each step obvious, numbered | Some ambiguity | Lost, don't know where I am |
| **Text readability** | Can read without squinting | Need to zoom | Can't read comfortably |
| **Touch targets** | Easy to tap accurately | Occasionally miss | Frequently miss buttons |
| **Confirmation** | Know exactly what happened | Think it worked | Not sure if it worked |
| **Recovery** | Can fix mistakes easily | Need help to recover | Stuck, can't proceed |

### Sarah (34) - Efficiency Benchmark

| Dimension | Pass | Concern | Fail |
|-----------|------|---------|------|
| **Speed** | <2 min for booking | 2-5 min | >5 min |
| **Family support** | Can book for children easily | Awkward workaround | Can't book for others |
| **Multitasking** | Can complete while distracted | Need full attention | Too complex for busy moments |
| **Remembered preferences** | Defaults to my choices | Some re-entry | Start from scratch each time |

### Marc (42) - Quality Benchmark

| Dimension | Pass | Concern | Fail |
|-----------|------|---------|------|
| **Time efficiency** | No wasted steps | Minor friction | Feels inefficient |
| **Video quality** | Clear, professional | Occasional issues | Unreliable, frustrating |
| **Information density** | Right amount of detail | Too sparse or dense | Missing critical info |
| **Professional feel** | Polished, trustworthy | Acceptable | Feels amateur |

### Elena (23) - Experience Benchmark

| Dimension | Pass | Concern | Fail |
|-----------|------|---------|------|
| **Modern feel** | Contemporary, polished | Acceptable | Feels dated |
| **Discretion** | Privacy protected, neutral language | Somewhat exposed | Embarrassing to use |
| **Speed** | Fast, smooth animations | Minor lag | Sluggish, unresponsive |
| **Mobile experience** | Native-feeling, intuitive gestures | Web-like | Clunky, frustrating |

### Thomas (51) - Trust Benchmark

| Dimension | Pass | Concern | Fail |
|-----------|------|---------|------|
| **Cost transparency** | All costs visible upfront | Some hidden costs | Surprised by charges |
| **Confirmation clarity** | Know exactly what I agreed to | Mostly clear | Uncertain what I committed to |
| **No marketing pressure** | Functional, no upsells in flows | Minor promotions | Feels salesy |
| **Reliability** | Works consistently | Occasional issues | Unreliable, don't trust it |

---

## Constraints and Principles

### Design Constraints

| Constraint | Rationale |
|------------|-----------|
| **Accessibility is baseline** | If Helga can't use it, redesign it. Enhanced mode available but not required. |
| **German-first** | Primary language, 14+ localizations for European markets |
| **Mobile-first** | Designed for touch, 320px minimum width |
| **Partner co-branding** | "Powered by [Partner]" visible, not hidden |
| **dm brand alignment** | Clinical trust (blue) with dm accents (red, yellow) |
| **White-label ready** | Architecture supports multi-brand, not yet implemented |

### UX Principles

| Principle | Implementation |
|-----------|----------------|
| **Explicit over implicit** | Tell users what will happen before it happens |
| **Progress over perfection** | Step indicators, partial saves, clear progress |
| **Recovery over prevention** | Easy undo, edit, cancel rather than blocking warnings |
| **Confirmation over assumption** | Always confirm critical actions (booking, ordering) |
| **Consistency over novelty** | Use established patterns, surprise is bad in healthcare |

### Content Principles

| Principle | Implementation |
|-----------|----------------|
| **Professional, not clinical** | Warm but credible, dm brand voice with healthcare authority |
| **Clear over clever** | No wordplay, no ambiguity, especially for health information |
| **Formal address (Sie)** | German formality appropriate for healthcare context |
| **Discreet when needed** | Generic terms for sensitive medications in notifications/history |

---

## Partner Integration Model

### Co-Branded Experience

Partners are visible but MedAlpha owns the experience:

```
┌─────────────────────────────────────┐
│  MedAlpha Connect                   │  ← MedAlpha brand
├─────────────────────────────────────┤
│                                     │
│  [Feature Content]                  │  ← Unified experience
│                                     │
│  ───────────────────────────────── │
│  Powered by Teleclinic    [logo]   │  ← Partner attribution
└─────────────────────────────────────┘
```

### Partner Responsibilities

| Partner | Service | Integration |
|---------|---------|-------------|
| **Curaay** | In-person appointment booking | API for availability, booking confirmation |
| **Teleclinic** | Telemedicine video consultations | Embedded video, questionnaire, summary |
| **Cardlink/gematik** | E-prescription retrieval via NFC | NFC scanning, prescription data |
| **Apo Group** | Online pharmacy, prescription delivery | Order placement, delivery tracking |
| **Google Maps** | Pharmacy search, directions | Location services, directions |

---

## Localization Strategy

### Language Priority

| Tier | Languages | Coverage |
|------|-----------|----------|
| **Tier 1 (Launch)** | German, English | Germany + expats |
| **Tier 2 (Near-term)** | Turkish, Polish, Romanian | Large immigrant populations |
| **Tier 3 (Expansion)** | Bulgarian, Croatian, Serbian, Hungarian, Czech, Slovak, Slovenian, Italian, Spanish, Portuguese | dm's European footprint |

### Localization Considerations

- **German is source language** for all translations
- **Date/time formats** vary by locale (16.01.2026 vs 01/16/2026)
- **Medical terminology** must be professionally translated, not machine-translated
- **RTL support** not required for current language set
- **Cultural adaptation** beyond translation (e.g., healthcare expectations vary by country)

---

## Future Considerations (Out of Scope for MVP)

- **Family accounts** (book for dependents)
- **Health records integration** (ePA - elektronische Patientenakte)
- **dm loyalty integration** (Payback points for health services)
- **Wearable integration** (Apple Health, Google Fit)
- **Medication reminders**
- **White-label deployment** for partners
- **Symptom checker** (AI-powered triage)

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-16 | Initial release for MedAlpha Connect MVP V1 |

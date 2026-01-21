
# MedAlpha Connect — MVP Design Plan

## Overview

**Product:** Healthcare companion app for dm-drogerie markt customers (Germany)  
**Platform:** web mobile (primary)  
**Primary Persona:** Sarah (34) — efficiency benchmark  
**Design System:** Blue-dominant (#0C3D91), dm accents (red, yellow), Open Sans

---

## Screens to Build

### 1. Appointment Booking Flow (6 screens)

| Screen | Priority | Key States |
|--------|----------|------------|
| Search Entry | 1st | Default, with recent searches, typing |
| Doctor List | 1st | Loading, populated, empty results, filtered |
| Doctor Profile | 2nd | Full schedule view |
| Confirmation Sheet | 1st | Bottom sheet overlay |
| Booking Success | 1st | With calendar/directions CTAs |

**Key Patterns:**
- Hybrid doctor cards: 3 inline time slots + "Mehr →" link
- Yellow (#FFC603) for bookable time slots
- Bottom sheet for quick confirmations
- "Powered by Curaay" partner attribution

### 2. Telemedicine Flow (5 screens)

| Screen | Priority | Key States |
|--------|----------|------------|
| Telemedicine Entry | 1st | Two-card choice (Jetzt/Termin) |
| Symptom Questionnaire | 1st | Multi-step with progress indicator |
| Waiting Room | 1st | Queue position, estimated time, tips |
| Video Consultation | 1st | Dark UI, controls, self-view |
| Consultation Summary | 1st | Doctor recap, prescription handoff |

**Key Patterns:**
- Entry: Big cards for "Jetzt sprechen" vs "Termin planen"
- Questionnaire: Chip-based symptom selection
- Waiting: Visual queue with preparation tips
- Video: Dark theme, standard video controls
- Summary: Yellow card for prescription → links to E-Prescription flow
- "Powered by Teleclinic" partner attribution

### 3. E-Prescription Flow (5 screens)

| Screen | Priority | Key States |
|--------|----------|------------|
| NFC Scan | 1st | Ready, scanning, PIN entry, success, error |
| Prescription Details | 1st | Single/multiple medications |
| Redemption Choice | 1st | Online vs local pharmacy |
| Online Checkout | 2nd | Address, payment (Zuzahlung), confirmation |
| Order Tracking | 2nd | Progress steps, delivery status |

**Key Patterns:**
- NFC Scan: Step-by-step numbered guidance (critical for Helga)
- Redemption: Clear cards for online (Apo Group) vs local pharmacy
- Checkout: German Zuzahlung (co-pay) pricing model
- Tracking: Vertical progress timeline
- "Powered by Apo Group" for online pharmacy

### 4. Pharmacy Search (2 screens)

| Screen | Priority | Key States |
|--------|----------|------------|
| Map View | 1st | Map with pins, bottom sheet preview |
| Pharmacy Details | 2nd | Hours, services, distance, actions |

**Key Patterns:**
- Map-dominant with list toggle
- Bottom sheet preview for selected pharmacy
- Quick actions: Route (Google Maps), Call
- Services badges (E-Rezept, Impfungen, etc.)

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Doctor list layout | Hybrid (3 slots + "Mehr") | Balances Sarah's efficiency with visual clarity 
| Booking confirmation | Bottom sheet | Keeps user in context, fewer taps |
| Search entry | Search-first | Matches "I know what I need" mindset |
| Telemedicine entry | Two big cards | Clear binary choice, immediate vs scheduled |
| NFC scan UI | Step-by-step numbered | Critical for Helga persona accessibility |
| Prescription redemption | Side-by-side cards | Clear comparison of online vs local |

---

## Execution Decides

The following should be determined during execution:

- Exact component dimensions and spacing
- Hover/pressed states for interactive elements
- Loading skeleton patterns
- Error state messaging and illustrations
- Empty state illustrations
- Animation timing and easing
- Filter chip interaction behavior
- Search autocomplete dropdown design

---

## Visual Guidelines

### Colors (from design system)
- Primary actions: brand-blue-500 (#005F73)
- Primary hover/active: brand-blue-600 (#005666)
- Secondary actions: brand-teal-500 (#0A9396)
- Secondary active: brand-teal-600 (#098487)
- Accent surfaces: brand-mint-100 (#E3F1EE) and brand-mint-400 (#94D2BD)
- App background: neutral-50 (#F7FAFB)
- Card background: white / neutral-0
- Primary text: neutral-800 (#102A32)
- Secondary text: neutral-700 (#3B5A61)
- Muted text: neutral-500 (#6F8A91)
- Positive status only: semantic-green-500 (#9BE65A)
- Do NOT use colour as the sole indicator of meaning

### Typography
- **Font:** Google Sans (400, 600, 700), (fallback Inter, system-ui)
- **H1:** 28px/700 — Page titles
- **H2:** 22px/600 — Section headers
- **Body:** 16px/400, line-height 1.5 — Default text
- **Caption:** 14px/400 — Labels, metadata
- KPIs: large numbers, semibold, tabular numerals
- Support long German compound words; no truncation

### Spacing
- Screen padding: 16-20px
- Card padding: 16-20px
- Section gap: 24px
- Component gap: 12-16px

### Shapes
- Cards: 16px radius
- Buttons: 12px radius
- Chips: 8px radius (or pill for filters)
- Bottom sheets: 20px top radius

---

## Partner Attribution

Each feature shows its integration partner subtly at bottom:

| Feature | Partner | Display |
|---------|---------|---------|
| Appointment Booking | Curaay | "Powered by Curaay" |
| Telemedicine | Teleclinic | "Powered by Teleclinic" |
| Online Pharmacy | Apo Group | "Powered by Apo Group" |
| NFC/E-Rezept | Cardlink/gematik | (Technical, not user-facing) |
| Pharmacy Search | Google Maps | Apple/Google Maps attribution |

---

## Constraints

- **English-first:** All UI text in English, but consider German long texts in the future (Sie form)
- **Accessibility:** 44px minimum touch targets, high contrast
- **Mobile-first:** 320px minimum width
- **Date format:** German (16. Jan 2026)
- **Time format:** 24-hour (14:30 Uhr)

---

## Out of Scope (for MVP)

- Home dashboard / bottom navigation
- Onboarding / authentication
- Profile / settings
- Family accounts
- Health history view
- Notification preferences
- Offline states

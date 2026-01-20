
# MedAlpha Connect — Web App Design Plan

## Overview

**Product:** Healthcare companion web app for dm-drogerie markt customers  
**Platform:** Web (desktop-first, responsive)  
**Primary Persona:** Sarah (34) at work — efficiency benchmark  
**Scope:** Subset of mobile features (no telemedicine)

---

## Web vs Mobile: Key Differences

| Aspect | Mobile | Web |
|--------|--------|-----|
| Navigation | Bottom tabs | Top navigation bar |
| Layout | Single column, stacked | Split view (list + panel) |
| NFC Scan | Yes (gematik) | No — code entry + QR upload |
| Telemedicine | Full video flow | Not included |
| Calendar | Week view in profile | Prominent split-view calendar |

---

## Information Architecture

```
MedAlpha Connect (Web)
├── Termine (Appointments)
│   ├── Calendar view (left)
│   └── Booking panel (right)
│       ├── Search/specialties
│       ├── Doctor results
│       └── Confirmation
├── Rezepte (Prescriptions)
│   ├── Prescription list (left)
│   │   ├── Active
│   │   ├── Redeemed
│   │   └── Expired
│   └── Action panel (right)
│       ├── Code entry / QR upload
│       ├── Redemption choice
│       └── Checkout
└── Apotheken (Pharmacies)
    ├── Pharmacy list (left)
    └── Map + details (right)
```

---

## Screens to Build

### Global Shell
| Component | Description |
|-----------|-------------|
| Top Navigation | Logo, nav tabs (Termine/Rezepte/Apotheken), notifications, profile |
| Responsive breakpoints | Desktop (1200px+), Tablet (768-1199px), Mobile fallback |

### 1. Appointments Section (3 states)

| Screen State | Left Panel | Right Panel |
|--------------|------------|-------------|
| Default | Week calendar with appointments | Search + specialties + recent doctors |
| Searching | Calendar (unchanged) | Doctor search results with inline slots |
| Confirming | Calendar (unchanged) | Booking confirmation form |

**Calendar Features:**
- Week/Month toggle
- Navigation arrows (prev/next)
- Time grid (hourly)
- Appointment blocks (color-coded by type)
- Click appointment → details popover

**Booking Panel States:**
- Default: Search bar, specialty chips, recent doctors
- Results: Doctor cards with hybrid slots (3 + "mehr")
- Confirm: Doctor info, date/time, reason field, CTA

### 2. Prescriptions Section (4 states)

| Screen State | Left Panel | Right Panel |
|--------------|------------|-------------|
| Default | Prescription list (tabbed) | Code entry + QR upload |
| Selected | Prescription list (item highlighted) | Redemption choice |
| Checkout | Prescription list | Order summary + payment |
| Tracking | Prescription list (status updated) | Delivery tracking |

**Prescription List Features:**
- Tabs: Aktiv / Eingelöst / Abgelaufen
- Cards with status indicators
- Left border color by status (blue=active, yellow=ordered, gray=expired)

**Action Panel States:**
- Default: Code entry fields, QR upload dropzone, mobile app prompt
- Redemption: Radio choice (Online/Apotheke)
- Checkout: Items, address, payment, total
- Tracking: Progress steps, delivery estimate

### 3. Pharmacy Section (2 states)

| Screen State | Left Panel | Right Panel |
|--------------|------------|-------------|
| Default | Pharmacy list (sorted by distance) | Map + selected pharmacy details |
| Filtered | Filtered list | Map (zoomed to results) |

**List Features:**
- Search bar
- Filter chips (Alle, Jetzt geöffnet, 24h)
- Cards with name, address, distance, status
- Selected card highlighted (primary color)

**Map + Details:**
- Interactive map with pharmacy pins
- User location marker
- Zoom controls
- Details card: name, address, hours, services, Route/Call CTAs

---

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Navigation | Top nav (not sidebar) | Simpler for 3 features, maximizes content width |
| Layout pattern | Split view throughout | Consistency + efficient use of desktop space |
| Appointment entry | Calendar-first with booking panel | Sarah manages existing + books new simultaneously |
| Prescription entry | Code + QR (no NFC) | Desktop lacks NFC; provide mobile app prompt |
| Pharmacy view | List + map side-by-side | Desktop space allows both views together |

---

## Execution Decides

- Exact split ratios (60/40 vs 50/50)
- Calendar component library/implementation
- Map integration (Google Maps embed vs Mapbox)
- Responsive breakpoint behaviors
- Hover states for all interactive elements
- Empty states for each section
- Loading skeletons
- Error handling UI

---

## Visual Guidelines

### Layout
- Max content width: 1440px (centered)
- Split view gap: 16-24px
- Card padding: 16-24px
- Section padding: 24-32px

### Responsive Behavior
| Breakpoint | Layout |
|------------|--------|
| ≥1200px | Full split view |
| 768-1199px | Collapsible panels, smaller calendar |
| <768px | Stack panels, redirect to mobile app |

### Colors (same as mobile)
- Primary: #0C3D91
- Accent: #FFC603 (time slots, highlights)
- Success: #2E7D32
- Background: #F5F7FA
- Card: #FFFFFF

### Typography
- Same scale as mobile, slightly larger base (16-18px body)
- More whitespace between sections

---

## Data Model Integration

Based on provided entities:

| Entity | Web Usage |
|--------|-----------|
| Doctor | Doctor cards, search results, calendar events |
| Patient | Profile, booking history |
| Working Hours | Available slots calculation |
| Appointment Type | Booking categorization, calendar color coding |
| Appointment | Calendar events, booking confirmation |

---

## Partner Attribution

| Section | Partner | Display |
|---------|---------|---------|
| Appointments | Curaay | Footer of booking panel |
| Prescriptions (online) | Apo Group | Checkout confirmation |
| Pharmacy Map | Google Maps | Map attribution |

---

## Out of Scope (Web MVP)

- Telemedicine (video consultations)
- User registration / authentication flows
- Profile management
- Notification center
- Family member management
- Health history
- Mobile responsive (<768px) — prompt to download app

---

## Screen Count Summary

| Section | States/Screens |
|---------|----------------|
| Global Shell | 1 (navigation) |
| Appointments | 3 (default, searching, confirming) |
| Prescriptions | 4 (default, selected, checkout, tracking) |
| Pharmacy | 2 (default, filtered) |
| **Total** | **10 screen states** |

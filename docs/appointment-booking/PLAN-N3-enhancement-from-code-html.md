# Plan: N3 Appointment Booking Enhancement

**Source**: `/Users/nganpham/Downloads/code.html` - MedBook Prototype
**Target**: `apps/appointment-booking-N3`
**Created**: 2026-01-23

---

## Overview

Enhance the N3 appointment booking app by incorporating design patterns, UI components, and UX flows from the MedBook prototype. The prototype demonstrates a polished 5-screen booking wizard with modern UI patterns.

---

## Screens in Source Prototype

| Screen | Route | Description |
|--------|-------|-------------|
| SpecialtySelection | `/` | Search specialty with autocomplete, recent searches, common chips |
| LocationSelection | `/location` | GPS, address input, radius slider, saved locations |
| SearchResults | `/results` | Doctor cards with slots, filters, sorting |
| ConfirmAppointment | `/confirm` | Patient selector, summary, insurance, reason field |
| ManageAppointments | `/appointments` | Upcoming/History tabs with actions |

---

## Enhancement Tasks

### 1. Design System

**Keep current N3 design system** — no changes to colors, typography, or icons:
- Font: Inter (existing)
- Colors: Neutral palette from `index.css`
- Icons: Continue using existing icon approach

---

### 2. Progress Indicator Component

The prototype shows a step progress bar with:
- Step label: "Step 1 of 4"
- Percentage: "25%"
- Progress bar with smooth animation

**Implementation**:
```tsx
// components/ProgressIndicator.tsx
interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}
```

**Tasks**:
- [ ] Create `ProgressIndicator` component
- [ ] Add to booking flow screens
- [ ] Support both bar style and dot style (LocationSelection uses dots)

---

### 3. Specialty Search Screen Enhancements

**Current N3**: Basic search input
**Prototype Features**:
- Search with placeholder hint: "Try 'Dermatologist' or 'HNO'..."
- Recent searches section with history icons
- "Not sure?" common choices as chips
- Enter key triggers navigation

**Tasks**:
- [ ] Add recent searches storage (localStorage/state)
- [ ] Create RecentSearchItem component with icon
- [ ] Add common specialty chips below search
- [ ] Implement 2-char autocomplete trigger
- [ ] Add search icon in input field

---

### 4. Location Selection Screen Enhancements

**Prototype Features**:
- "Use Current Location" primary CTA with GPS icon
- "Or enter a specific address" divider
- Address/postcode search input
- Map preview with pulsing location dot
- Radius slider (1-50km) with live display
- Saved locations (Home, Work) with icons
- Sticky bottom navigation (Back/Continue)

**Tasks**:
- [ ] Create LocationSelector component
- [ ] Add GPS permission handling
- [ ] Create RadiusSlider component with custom styling
- [ ] Add SavedLocations component
- [ ] Implement map preview placeholder
- [ ] Add sticky footer with navigation buttons

---

### 5. Search Results Screen Enhancements

**Prototype Features**:
- Sticky header with filter button (badge indicator)
- Sort dropdown: "Sorted by: Earliest Appointment"
- Doctor cards with:
  - Photo (rounded-xl)
  - Name, specialty
  - Rating with star icon + count
  - Distance
  - Favorite heart button
  - Insurance/language tags
  - Time slots as buttons (primary for first, light for others)
  - "More appointments" link
- Video consult indicator

**Tasks**:
- [ ] Enhance DoctorCard component with all fields
- [ ] Add FavoriteButton component
- [ ] Create TimeSlotButton component
- [ ] Add filter drawer/modal
- [ ] Add sort selector
- [ ] Implement horizontal scrolling time slots

---

### 6. Confirm Appointment Screen Enhancements

**Prototype Features**:
- Bottom sheet modal style (rounded top corners)
- Drag handle indicator
- Patient selector toggle: "Myself" / "Child"
- Doctor summary card with:
  - Photo
  - Date, Time, Type, Address details
  - Icon badges for each detail
- Insurance coverage banner with checkmark
- "Reason for visit" textarea with character counter (0/200)
- Full-width "Confirm Appointment" CTA

**Tasks**:
- [ ] Convert to bottom sheet modal
- [ ] Create PatientSelector toggle component
- [ ] Create AppointmentSummaryCard component
- [ ] Add InsuranceBanner component
- [ ] Create ReasonTextarea with counter
- [ ] Style confirm button with shadow

---

### 7. Appointments Management Screen Enhancements

**Prototype Features**:
- Sticky header with calendar add button
- Upcoming/History tab toggle
- Appointment cards with:
  - Status badge (Confirmed = green, Pending = orange)
  - Doctor photo with specialty icon overlay
  - Patient name display
  - Reschedule/Cancel action buttons
- History cards with "Book Again" CTA
- Fixed bottom "Book New Appointment" button

**Tasks**:
- [ ] Create TabToggle component (Upcoming/History)
- [ ] Enhance AppointmentCard with status badges
- [ ] Add doctor specialty icon overlay
- [ ] Create action buttons (Reschedule/Cancel)
- [ ] Add HistoryCard with "Book Again" action
- [ ] Add fixed bottom CTA

---

### 8. Animation & Transitions

**Patterns from prototype**:
- `transition-colors duration-200` - smooth color changes
- `active:scale-[0.98]` - button press feedback
- `animate-pulse` - location marker pulse
- Fade/slide animations on tab content switch

**Tasks**:
- [ ] Add button press scale animation (`active:scale-[0.98]`)
- [ ] Add page/tab transition animations
- [ ] Add loading skeleton animations
- [ ] Add pulse animation for location indicator

---

## Implementation Priority

### Phase 1: Core Components
1. ProgressIndicator component
2. PatientSelector component
3. TimeSlotButton component
4. RadiusSlider component

### Phase 2: Screen Enhancements
5. Specialty search with recent/chips
6. Location selection with radius
7. Results with enhanced cards
8. Confirm as bottom sheet

### Phase 3: Polish
9. Appointments management
10. Animations & transitions

---

## Files to Create/Modify

### New Components
```
src/components/
├── ProgressIndicator.tsx
├── PatientSelector.tsx
├── TimeSlotButton.tsx
├── RadiusSlider.tsx
├── SavedLocations.tsx
├── RecentSearches.tsx
├── SpecialtyChips.tsx
├── DoctorCard.tsx (enhance)
├── AppointmentCard.tsx (enhance)
├── InsuranceBanner.tsx
├── ReasonTextarea.tsx
└── TabToggle.tsx
```

### Screen Modifications
```
src/screens/booking/
├── SearchScreen.tsx      # Add recent searches, chips
├── ResultsScreen.tsx     # Enhance doctor cards
├── ConfirmScreen.tsx     # Bottom sheet, patient selector
└── SuccessScreen.tsx     # Match prototype style
```

---

## Decision Points

1. **Radius slider**: Custom styled or native input?
2. **Bottom sheet**: Native CSS or use a library (e.g., react-spring)?
3. **Animations**: CSS transitions or animation library?

---

## Reference Code Snippets

### Radius Slider Styling
```css
input[type=range]::-webkit-slider-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  margin-top: -10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}
```

### Tab Toggle Pattern
```tsx
<div className="flex h-12 w-full items-center justify-center rounded-lg bg-neutral-100 p-1">
  <label className={`... ${active ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'}`}>
    <span>Upcoming</span>
    <input type="radio" className="invisible" />
  </label>
</div>
```

### Time Slot Buttons
```tsx
// Primary slot (first available)
<button className="px-4 py-2 bg-neutral-800 text-white rounded-lg">
  <span className="text-sm font-bold">14:00</span>
  <span className="text-[10px] opacity-90">15 min</span>
</button>

// Secondary slots
<button className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-lg">
  ...
</button>
```

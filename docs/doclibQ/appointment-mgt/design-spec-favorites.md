# Design Specification: Save Favorite Doctors (US 1.2.2)

> **User Story**: As a returning patient, I want to save my preferred doctors, to save time on the next booking.
> 
> **Current Coverage**: 0% | **Target**: Full implementation

---

## Overview

The Favorites feature allows users to save up to 5 doctors for quick access during booking. Favorites persist across sessions and are sorted by last booking date (newest first).

---

## Acceptance Criteria Mapping

| AC | Requirement | Design Solution | Status |
|----|-------------|-----------------|--------|
| 1 | API stores last 5 booked doctors | State structure + localStorage | Backend mock ready |
| 2 | Display as "My Doctors" in booking | New section in SearchScreen | Needs implementation |
| 3 | Manual add/remove | Heart toggle on DoctorCard + management UI | Partial (icon only) |
| 4 | Sort by last booking (newest first) | Sort algorithm in selector | Needs implementation |
| 5 | GDPR: Remove on account deletion | Clear in resetAll() | Already implemented |

---

## Design Tokens

| Token | Usage | Value |
|-------|-------|-------|
| `$text-primary` | Doctor name | `#1C2A30` |
| `$text-secondary` | Specialty, details | `#5E7A86` |
| `$accent-warm` | Favorited heart | `#E88A73` / Coral |
| `$border-subtle` | Card borders | `#E5E7EB` |
| `$bg-surface` | Card background | `#FFFFFF` |
| `$bg-muted` | Section background | `#FAF8F5` |

---

## Component Specifications

### 1. MyDoctorsSection

**File**: `src/components/sections/MyDoctorsSection.tsx`

**Props Interface**:
```typescript
interface MyDoctorsSectionProps {
  doctors: Doctor[]           // Max 5, sorted by lastBooked desc
  onSelectDoctor: (id: string) => void
  onRemoveDoctor: (id: string) => void
  onSearchMore: () => void
  emptyState?: boolean
}
```

**Layout**:
```
┌──────────────────────────────────────────┐
│ My Doctors                        [i]    │ ← Section header
│ Your last 5 booked doctors               │ ← Subtitle
├──────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐  │
│ │ 👤 Dr. Anna Schmidt          ♥️ 🗑️  │  │ ← Doctor card with actions
│ │ General Practitioner                │  │
│ │ ⭐ 4.8 (124) | 📍 1.2km | 🕒 2d ago │  │ ← Metadata row
│ └─────────────────────────────────────┘  │
│                                          │
│ ┌─────────────────────────────────────┐  │
│ │ 👤 Dr. Michael Weber         ♥️ 🗑️  │  │
│ │ Cardiologist                        │  │
│ │ ⭐ 4.9 (89) | 📍 2.4km | 🕒 1w ago  │  │
│ └─────────────────────────────────────┘  │
│                                          │
│ [+ Search for more doctors]              │ ← CTA button
└──────────────────────────────────────────┘
```

**Specs**:
- **Width**: Full container width (px-4)
- **Card gap**: 12px (space-y-3)
- **Card padding**: 16px (p-4)
- **Card border**: 1px solid `#E5E7EB`, border-radius 12px
- **Doctor name**: 16px, font-weight 600, line-clamp 1
- **Specialty**: 14px, color `#13A3B5` (teal)
- **Metadata**: 12px, color `#5E7A86`
- **Time ago**: "2d ago", "1w ago", "3w ago", "1mo ago"

**Interactions**:
| Action | State Change | Animation |
|--------|--------------|-----------|
| Tap doctor card | Navigate to doctor profile | 150ms ease-out |
| Tap ♥️ | Remove from favorites | Heart fades out, 200ms |
| Tap 🗑️ | Confirm then remove | Shake + slide out, 300ms |
| Tap CTA | Navigate to search | Standard push |

**Empty State**:
```
┌──────────────────────────────────────────┐
│ My Doctors                               │
├──────────────────────────────────────────┤
│           ♡                              │
│                                          │
│   No favorite doctors yet                │
│                                          │
│   Book appointments to see your          │
│   most frequent doctors here.            │
│                                          │
│   [Search for Doctors]                   │
└──────────────────────────────────────────┘
```

---

### 2. DoctorCard Enhancement

**File**: `src/components/cards/DoctorCard.tsx` (existing)

**Changes Required**:

**A. Favorite State Persistence** (Current: local useState)
```typescript
// BEFORE (current)
const [isFavorite, setIsFavorite] = useState(false)

// AFTER (needed)
const { favorites, addFavorite, removeFavorite } = useFavorites()
const isFavorite = favorites.includes(doctor.id)

const handleFavoriteClick = (e: React.MouseEvent) => {
  e.stopPropagation()
  if (isFavorite) {
    removeFavorite(doctor.id)
  } else {
    addFavorite(doctor.id)
  }
}
```

**B. Visual States**:

| State | Heart Icon | Color | Animation |
|-------|-----------|-------|-----------|
| Not favorited | Outline heart | `#D1D5DB` | None |
| Favorited | Filled heart | `#E88A73` | Scale 1→1.2→1, 200ms |
| Pressed | Filled heart | `#E88A73` | Scale 0.9 | 

**C. Accessibility**:
```typescript
aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
aria-pressed={isFavorite}
```

---

### 3. FavoriteConfirmationToast

**File**: `src/components/notifications/FavoriteToast.tsx`

**Purpose**: Confirm add/remove actions without blocking UI

**Props**:
```typescript
interface FavoriteToastProps {
  action: 'added' | 'removed'
  doctorName: string
  onUndo?: () => void
  duration?: number  // default 3000ms
}
```

**Visual**:
```
┌─────────────────────────────────────────────┐
│ 👤 Added Dr. Schmidt to favorites    [Undo] │
└─────────────────────────────────────────────┘
```

**Specs**:
- Position: Bottom of screen, 16px from bottom
- Width: Full width minus 32px (centered)
- Background: `#1C2A30` (charcoal)
- Text: White, 14px
- Undo button: Teal text, underlined
- Slide up animation: 300ms ease-out
- Auto-dismiss: 3 seconds

---

## State Management

### A. Types Update

**File**: `src/types/user.ts`

```typescript
export interface FavoriteDoctor {
  doctorId: string
  addedAt: string       // ISO date
  lastBooked: string    // ISO date for sorting
  bookingCount: number  // Number of bookings with this doctor
}

export interface Profile {
  // ... existing fields
  favoriteDoctors: FavoriteDoctor[]  // Max 5 items
}
```

### B. Context Update

**File**: `src/state/AppContext.tsx`

```typescript
// New actions
interface AppActions {
  // ... existing actions
  addFavoriteDoctor: (doctorId: string) => void
  removeFavoriteDoctor: (doctorId: string) => void
  updateLastBooked: (doctorId: string) => void  // Called after booking
}

// Implementation logic
const addFavoriteDoctor = (doctorId: string) => {
  setState((s) => {
    const exists = s.profile.favoriteDoctors.find(fd => fd.doctorId === doctorId)
    if (exists) return s  // Already favorited
    
    const newFavorite: FavoriteDoctor = {
      doctorId,
      addedAt: new Date().toISOString(),
      lastBooked: new Date().toISOString(),
      bookingCount: 1
    }
    
    // Keep only last 5, sorted by lastBooked desc
    const updated = [...s.profile.favoriteDoctors, newFavorite]
      .sort((a, b) => new Date(b.lastBooked).getTime() - new Date(a.lastBooked).getTime())
      .slice(0, 5)
    
    return {
      ...s,
      profile: { ...s.profile, favoriteDoctors: updated }
    }
  })
}
```

### C. Auto-Populate Logic

**Rule**: Last 5 booked doctors are AUTO-ADDED to favorites

**Implementation**:
```typescript
// In booking success handler
const handleBookingSuccess = (doctorId: string) => {
  // Book the appointment
  apiBookAppointment(...)
  
  // Auto-add/update favorite
  updateLastBooked(doctorId)
}
```

---

## Screen Integration

### SearchScreen Update

**File**: `src/screens/booking/SearchScreen.tsx`

**Placement**: My Doctors section ABOVE the search input

**Code Structure**:
```typescript
export default function SearchScreen() {
  const { profile } = useProfile()
  const favoriteDoctors = useMemo(() => {
    // Resolve doctor IDs to full doctor objects
    return profile.favoriteDoctors
      .map(fd => doctors.find(d => d.id === fd.doctorId))
      .filter(Boolean) as Doctor[]
  }, [profile.favoriteDoctors])

  return (
    <Page>
      <Header title={t('findDoctor')} showBack />
      
      {/* My Doctors Section - NEW */}
      {favoriteDoctors.length > 0 && (
        <MyDoctorsSection
          doctors={favoriteDoctors}
          onSelectDoctor={handleSelectDoctor}
          onRemoveDoctor={handleRemoveDoctor}
          onSearchMore={() => navigate(PATHS.BOOKING_SEARCH)}
        />
      )}
      
      {/* Existing Search UI */}
      <SearchInput ... />
      <RecentSearches ... />
      <PopularSpecialties ... />
    </Page>
  )
}
```

---

## i18n Keys Required

**File**: `src/locales/en/booking.json`

```json
{
  "myDoctors": "My Doctors",
  "myDoctorsSubtitle": "Your last 5 booked doctors",
  "noFavoriteDoctors": "No favorite doctors yet",
  "noFavoriteDoctorsDesc": "Book appointments to see your most frequent doctors here.",
  "searchForDoctors": "Search for doctors",
  "addedToFavorites": "Added {{name}} to favorites",
  "removedFromFavorites": "Removed {{name}} from favorites",
  "undo": "Undo",
  "booked": "Booked",
  "lastBooked": "Last booked {{time}}",
  "removeFavorite": "Remove",
  "favoriteAddedAt": "Added {{date}}"
}
```

**File**: `src/locales/de/booking.json`

```json
{
  "myDoctors": "Meine Ärzte",
  "myDoctorsSubtitle": "Ihre letzten 5 gebuchten Ärzte",
  "noFavoriteDoctors": "Noch keine favorisierten Ärzte",
  "noFavoriteDoctorsDesc": "Buchen Sie Termine, um Ihre häufigsten Ärzte hier zu sehen.",
  "searchForDoctors": "Ärzte suchen",
  "addedToFavorites": "{{name}} zu Favoriten hinzugefügt",
  "removedFromFavorites": "{{name}} aus Favoriten entfernt",
  "undo": "Rückgängig",
  "booked": "Gebucht",
  "lastBooked": "Zuletzt gebucht {{time}}",
  "removeFavorite": "Entfernen",
  "favoriteAddedAt": "Hinzugefügt {{date}}"
}
```

---

## Accessibility Requirements

| Element | Requirement | Implementation |
|---------|-------------|----------------|
| Heart button | Touch target | 44×44px minimum |
| Heart button | Screen reader | `aria-label` dynamic |
| Doctor card | Navigation | `tabIndex=0`, Enter key support |
| Remove action | Confirmation | Haptic feedback + toast |
| Empty state | Focus | Auto-focus on CTA button |

---

## Animation Specifications

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Heart fill | 200ms | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | Tap favorite |
| Card remove | 300ms | `ease-out` | Confirm delete |
| Section slide | 400ms | `ease-out` | First favorite added |
| Toast appear | 300ms | `cubic-bezier(0, 0, 0.2, 1)` | Action completed |

---

## Testing Checklist

- [ ] Max 5 doctors enforced
- [ ] Sort by lastBooked desc
- [ ] Auto-add on booking
- [ ] Remove updates state
- [ ] Undo toast works
- [ ] Empty state displays
- [ ] i18n EN/DE complete
- [ ] Accessibility labels
- [ ] GDPR: Clear on account delete
- [ ] Persist to localStorage

---

## Golden Tests (from epic-1.2-booking.test.tsx)

```typescript
it('1.2.2-a: favorite-doctors-shown-in-booking - "My Doctors" section visible', () => {
  // Arrange: User has 3 favorite doctors
  // Act: Navigate to booking search
  // Assert: My Doctors section shows 3 cards
})

it('1.2.2-b: add-remove-favorite-doctor - Add/remove works', async () => {
  // Arrange: Doctor not favorited
  // Act: Tap heart icon
  // Assert: Heart filled, toast shown
  // Act: Tap heart again
  // Assert: Heart empty, removed from list
})

it('1.2.2-c: favorites-max-5-stored - Cannot exceed 5', () => {
  // Arrange: User has 5 favorites
  // Act: Book appointment with 6th doctor
  // Assert: Oldest favorite removed, new one added
})

it('1.2.2-d: favorites-sorted-by-last-booking - Newest first', () => {
  // Arrange: 3 favorites with different lastBooked dates
  // Act: View My Doctors section
  // Assert: Order matches lastBooked desc
})
```

---

## Implementation Files Checklist

| File | Action | Lines |
|------|--------|-------|
| `src/types/user.ts` | Add FavoriteDoctor interface | +8 |
| `src/state/AppContext.tsx` | Add favorite actions | +45 |
| `src/components/cards/DoctorCard.tsx` | Wire to context | +15 |
| `src/components/sections/MyDoctorsSection.tsx` | **NEW** | ~120 |
| `src/components/notifications/FavoriteToast.tsx` | **NEW** | ~60 |
| `src/screens/booking/SearchScreen.tsx` | Add section | +20 |
| `src/locales/en/booking.json` | Add keys | +12 |
| `src/locales/de/booking.json` | Add keys | +12 |

**Total New Code**: ~300 lines
**Estimated Time**: 6-8 hours (including testing)

---

*Document Version: 1.0 | Created: 2026-01-30 | Author: UX Design*  
*Related: US 1.2.2, Golden Tests epic-1.2-booking.test.tsx*
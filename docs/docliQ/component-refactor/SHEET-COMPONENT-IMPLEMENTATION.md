# Sheet Component Implementation Report

**Date:** January 2025
**Status:** Complete
**Component:** `<Sheet>`

---

## Overview

Consolidated 6 fragmented bottom sheet implementations into a unified, accessible `<Sheet>` component. The component provides consistent UX patterns, proper accessibility, and smooth animations across all modal surfaces in the docliQ mobile app.

---

## Component Architecture

### File Structure

```
src/components/ui/Sheet/
├── Sheet.tsx           # Main compound component
├── SheetHeader.tsx     # Optional header sub-component
├── SheetBody.tsx       # Scrollable content sub-component
├── SheetFooter.tsx     # Sticky footer sub-component
├── useSheetA11y.ts     # Focus trap, escape key, restoration
├── useBodyScrollLock.ts# Prevents background scroll
├── types.ts            # TypeScript interfaces
├── Sheet.test.tsx      # Unit tests
└── index.ts            # Exports
```

### Props Interface

```typescript
interface SheetProps {
  open: boolean                           // Controlled open state
  onClose: () => void                     // Close handler
  variant?: 'bottom' | 'center' | 'fullscreen'
  size?: 'auto' | 'sm' | 'md' | 'lg' | 'xl'
  title?: string                          // Enables aria-labelledby
  description?: string                    // Enables aria-describedby
  showDragHandle?: boolean                // Default varies by variant
  showCloseButton?: boolean               // Default: true
  closeOnBackdropClick?: boolean          // Default: true
  closeOnEscape?: boolean                 // Default: true
  preventBodyScroll?: boolean             // Default: true
  initialFocusRef?: RefObject<HTMLElement>
  footer?: ReactNode                      // Sticky footer slot
  children: ReactNode
  testId?: string
  className?: string
}
```

---

## Variants

| Variant | Layout | Corners | Default Drag Handle | Use Case |
|---------|--------|---------|---------------------|----------|
| `bottom` | Anchored to bottom | `rounded-t-2xl` | Yes | Standard bottom sheets |
| `center` | Centered in viewport | `rounded-2xl` | No | Confirmations, dialogs |
| `fullscreen` | Full viewport | None | No | Complex forms |

## Sizes

| Size | Max Height | Use Case |
|------|------------|----------|
| `auto` | 90vh (content-based) | Dialogs, confirmations |
| `sm` | 40vh | Quick actions |
| `md` | 60vh | Medium content |
| `lg` | 85vh | Doctor details |
| `xl` | 90vh | Forms, filters |

---

## Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Focus trap | Tab cycles within sheet via `useSheetA11y` |
| Escape key | Closes sheet (configurable via `closeOnEscape`) |
| Body scroll lock | `useBodyScrollLock` prevents background scroll |
| Focus restoration | Returns focus to trigger element on close |
| ARIA attributes | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Initial focus | First focusable element or custom via `initialFocusRef` |

### Focus Trap Implementation

```typescript
// useSheetA11y.ts - Tab key handling
if (e.key === 'Tab') {
  const focusable = getFocusableElements()
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  // Shift+Tab from first → focus last
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  // Tab from last → focus first
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
```

---

## Animations

### Entry Animations

| Variant | Animation | Duration |
|---------|-----------|----------|
| `bottom` | `slideUp` | 300ms |
| `center` | `scaleIn` | 300ms |
| `fullscreen` | `fadeIn` | 300ms |

### Exit Animations

| Variant | Animation | Duration |
|---------|-----------|----------|
| `bottom` | `slideDown` | 200ms |
| `center` | `scaleOut` | 150ms |
| `fullscreen` | `fadeOut` | 200ms |

### CSS Keyframes (index.css)

```css
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideDown {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(100%); opacity: 0; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.95); opacity: 0; }
}
```

---

## Migrated Components

### 1. ConfirmModal → Sheet (internal refactor)

**Location:** `components/ui/ConfirmModal.tsx`
**Configuration:** `variant="center"` `size="auto"`

```tsx
<Sheet
  open={open}
  onClose={onCancel}
  variant="center"
  size="auto"
  showDragHandle={false}
  testId="confirm-modal"
>
```

**Usage:** Sign out confirmation, destructive actions

---

### 2. DoctorDetailSheet

**Location:** `components/sheets/DoctorDetailSheet.tsx`
**Configuration:** `variant="bottom"` `size="lg"`

```tsx
<Sheet
  open={!!doctor}
  onClose={onClose}
  variant="bottom"
  size="lg"
  title={t('doctorDetails')}
  testId="doctor-detail-sheet"
  footer={<Button onClick={() => onSelect(doctor)} fullWidth>{t('selectDoctor')}</Button>}
>
  <Sheet.Body className="px-4 pb-8">
    {/* Doctor profile content */}
  </Sheet.Body>
</Sheet>
```

**Usage:** Doctor profile in booking flow

---

### 3. EditFamilyMemberSheet

**Location:** `components/forms/EditFamilyMemberSheet.tsx`
**Configuration:** `variant="bottom"` `size="xl"`

```tsx
<Sheet
  open={open}
  onClose={handleClose}
  variant="bottom"
  size="xl"
  title={isEditing ? t('editFamilyMember') : t('addFamilyMember')}
  testId="family-member-sheet"
  footer={/* Save/Cancel buttons */}
>
  <Sheet.Body>
    {/* Form fields */}
  </Sheet.Body>
</Sheet>
```

**Usage:** Add/edit family members

---

### 4. FiltersSheet (extracted from ResultsScreen)

**Location:** `components/sheets/FiltersSheet.tsx`
**Configuration:** `variant="bottom"` `size="xl"`

```tsx
<Sheet
  open={open}
  onClose={onClose}
  variant="bottom"
  size="xl"
  title={t('filters')}
  testId="filters-sheet"
  footer={<Button onClick={handleApply} variant="primary" fullWidth>{t('applyFilters')}</Button>}
>
  <Sheet.Body className="px-4 pb-6 space-y-6">
    {/* Distance, rating, language filters */}
  </Sheet.Body>
</Sheet>
```

**Usage:** Search results filtering

---

### 5. CancelAppointmentSheet (extracted from AppointmentDetailScreen)

**Location:** `components/sheets/CancelAppointmentSheet.tsx`
**Configuration:** `variant="bottom"` `size="auto"`

```tsx
<Sheet
  open={open}
  onClose={onClose}
  variant="bottom"
  size="auto"
  showCloseButton={false}
  testId="cancel-appointment-sheet"
  footer={
    <>
      <Button onClick={handleConfirm} variant="destructive" fullWidth loading={isCancelling}>
        {t('cancelAppointment')}
      </Button>
      <Button onClick={onClose} variant="tertiary" fullWidth>
        {t('keepAppointment')}
      </Button>
    </>
  }
>
```

**Usage:** Appointment cancellation confirmation

---

### 6. CookieConsentBanner

**Location:** `components/legal/CookieConsentBanner.tsx`
**Configuration:** `variant="bottom"` `size="auto"` with GDPR compliance flags

```tsx
<Sheet
  open={isVisible}
  onClose={handleRejectNonEssential}
  variant="bottom"
  size="auto"
  showDragHandle={false}
  showCloseButton={false}
  closeOnBackdropClick={false}  // GDPR: explicit choice required
  closeOnEscape={false}          // GDPR: no escape shortcuts
  testId="cookie-consent-banner"
  footer={/* Accept/Reject/Customize buttons */}
>
```

**Usage:** GDPR cookie consent (TTDSG §25 compliant)

---

## Button Stacking Patterns

### Vertical Stack Order (Top to Bottom)

```
┌─────────────────────────┐
│   Primary Action        │  ← Most important
├─────────────────────────┤
│   Secondary Action      │  ← Alternative
├─────────────────────────┤
│   Tertiary/Cancel       │  ← Escape hatch
└─────────────────────────┘
```

### Button Combinations by Sheet Type

| Sheet Type | Primary | Secondary | Tertiary |
|------------|---------|-----------|----------|
| Selection | `primary` | — | — |
| Confirmation | `primary` | — | `tertiary` |
| Destructive | `destructive` | — | `tertiary` |
| Form | `primary` | `secondary` | — |
| GDPR consent | `primary` | `secondary` | `tertiary` |

---

## Usage Examples

### Basic Bottom Sheet

```tsx
import { Sheet } from '../components/ui'

<Sheet
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Sheet Title"
>
  <p>Content here</p>
</Sheet>
```

### With Sub-components

```tsx
<Sheet open={open} onClose={onClose} variant="bottom" size="lg">
  <Sheet.Body className="px-4">
    <p>Scrollable content</p>
  </Sheet.Body>
  <Sheet.Footer>
    <Button onClick={onConfirm} fullWidth>Confirm</Button>
  </Sheet.Footer>
</Sheet>
```

### Center Modal (Confirmation)

```tsx
<Sheet
  open={showConfirm}
  onClose={onCancel}
  variant="center"
  size="auto"
  showDragHandle={false}
>
  <div className="p-6 text-center">
    <h2>Are you sure?</h2>
    <div className="flex flex-col gap-3 mt-4">
      <Button onClick={onConfirm} variant="destructive" fullWidth>Delete</Button>
      <Button onClick={onCancel} variant="tertiary" fullWidth>Cancel</Button>
    </div>
  </div>
</Sheet>
```

---

## Test Coverage

| Test Case | Status |
|-----------|--------|
| Renders when open=true | ✓ |
| Hidden when open=false | ✓ |
| Displays title | ✓ |
| Renders footer | ✓ |
| Shows drag handle by default | ✓ |
| Close button toggleable | ✓ |
| Bottom variant styling | ✓ |
| Center variant styling | ✓ |
| Drag handle override | ✓ |
| Escape key closes | ✓ |
| Backdrop click closes | ✓ |
| closeOnBackdropClick=false | ✓ |
| closeOnEscape=false | ✓ |
| ARIA role="dialog" | ✓ |
| aria-labelledby with title | ✓ |
| Focus trap (Tab cycling) | ✓ |
| Body scroll lock | ✓ |
| Sub-components render | ✓ |
| initialFocusRef | ✓ |

---

## Files Modified

### Created

- `src/components/ui/Sheet/` (entire folder)
- `src/components/sheets/FiltersSheet.tsx`
- `src/components/sheets/CancelAppointmentSheet.tsx`

### Modified

- `src/index.css` - Added exit animation keyframes
- `src/components/ui/ConfirmModal.tsx` - Uses Sheet internally
- `src/components/sheets/DoctorDetailSheet.tsx` - Uses Sheet
- `src/components/forms/EditFamilyMemberSheet.tsx` - Uses Sheet
- `src/components/legal/CookieConsentBanner.tsx` - Uses Sheet
- `src/screens/booking/ResultsScreen.tsx` - Uses FiltersSheet
- `src/screens/appointments/AppointmentDetailScreen.tsx` - Uses CancelAppointmentSheet
- `src/components/ui/index.ts` - Exports Sheet
- `src/components/sheets/index.ts` - Exports new sheets
- `src/components/index.ts` - Exports new sheets

---

## Breaking Changes

None. All existing component APIs preserved:

- `ConfirmModal` - Same props, uses Sheet internally
- `DoctorDetailSheet` - Same props
- `EditFamilyMemberSheet` - Same props

---

## Future Considerations

1. **Swipe-to-dismiss**: Currently disabled (drag handle is visual only). Could add optional gesture support.
2. **Nested sheets**: Not currently supported. Would need z-index stacking logic.
3. **Height transitions**: Size changes while open could animate smoothly.
4. **Reduced motion**: Currently uses `prefers-reduced-motion` media query via Tailwind.

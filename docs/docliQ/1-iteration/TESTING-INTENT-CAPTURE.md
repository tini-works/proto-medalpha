# Intent Capture Screen - Testing Guide

## Overview
This guide covers testing for the **Approach A: Intent-Based Smart Router** implementation, which replaces the explicit "Choose Booking Type" screen with an intelligent intent-capture interface.

---

## Quick Start

### Navigate to the Intent Capture Screen
1. Open the app and sign in
2. Click "Book an Appointment" from Home screen
3. Or navigate directly to: `/booking` (redirects to `/booking/intent`)

---

## Manual Testing Checklist

### 1. Patient Selection
- [ ] Toggle between **"Myself"** and **"Family Member"** chips
- [ ] Verify "Myself" is selected by default
- [ ] If family members exist:
  - [ ] Verify family member cards appear below
  - [ ] Click a family member to select
  - [ ] Verify visual selection state (border highlight)
- [ ] If no family members:
  - [ ] Verify "No family members yet" message appears
  - [ ] Click "Add Family Member" button
  - [ ] Verify navigation to family member creation

### 2. Intent Capture - Search Functionality

#### Test Case: Doctor Name Recognition
**Steps:**
1. Type "Dr. Anna" or "Wagner" in search box
2. **Expected:** Green hint bar appears: "Looking for a specific doctor"
3. Click "Analyze My Request"
4. **Expected:** Routes to doctor's slot selection screen

#### Test Case: Specialty Recognition
**Steps:**
1. Type "cardiology" or "heart"
2. **Expected:** Hint: "Searching by specialty"
3. Click "Analyze My Request"
4. **Expected:** Routes to specialty flow with pre-filled specialty

#### Test Case: Symptom Recognition
**Steps:**
1. Type "knee pain" or "headache"
2. **Expected:** Hint shows matching specialty
3. **Expected:** Routes to appropriate specialty flow

#### Test Case: Urgency Detection
**Steps:**
1. Type "urgent", "emergency", "severe pain"
2. **Expected:** Hint: "Routing to urgent care"
3. Click "Analyze My Request"
4. **Expected:** Routes to Fast-Lane flow

#### Test Case: Unclear Intent
**Steps:**
1. Type "xyz123" or gibberish
2. Click "Analyze My Request"
3. **Expected:** Manual flow selection screen appears
4. **Expected:** Message: "I'm not sure what you're looking for..."

### 3. Quick Options

#### Test Case: Fast-Lane Quick Access
**Steps:**
1. Click **"Fast-Lane"** option (with clock icon)
2. **Expected:** Routes to FastLaneCareRequestScreen
3. Verify Fast-Lane form loads correctly

#### Test Case: Book by Specialty Quick Access
**Steps:**
1. Click **"Book by Specialty"** option (with shield icon)
2. **Expected:** Routes to specialty search screen
3. Verify specialty chips are displayed

#### Test Case: "See My Doctor Again" (Requires History)
**Prerequisites:** User must have at least one previous booking

**Steps:**
1. Verify "See my doctor again" card appears at top
2. Verify doctor name is displayed (e.g., "Book again with Dr. Anna Wagner")
3. Click the card
4. **Expected:** Routes directly to doctor's slot selection

### 4. Manual Override (Escape Hatch)

**Steps:**
1. Enter vague search query (e.g., "not sure")
2. Click "Analyze My Request"
3. **Expected:** Three manual options appear:
   - Fast-Lane
   - Book by Specialty
   - Book by Doctor
4. Click each option and verify correct routing

### 5. Back Navigation
**Steps:**
1. From any child flow, click browser/device back button
2. **Expected:** Returns to Intent Capture screen
3. **Expected:** Previous selections (patient, search) are preserved

---

## Automated Tests

### Run Test Suite
```bash
cd apps/docliQ-mobile
npm test IntentCaptureScreen
```

### Test File Location
`src/screens/booking/__tests__/IntentCaptureScreen.test.tsx`

### Test Coverage
The test suite includes:

| Test | Description |
|------|-------------|
| `renders patient selection` | Verifies "Myself" and "Family Member" options |
| `renders search input` | Checks placeholder text and input presence |
| `shows quick options` | Verifies Fast-Lane, Specialty, Doctor options |
| `routes to Fast-Lane` | Tests quick option navigation |
| `shows manual options when unclear` | Tests fallback for vague queries |
| `routes to doctor flow` | Tests doctor name recognition |
| `shows "See my doctor again"` | Tests rebooking option UI |

---

## Intent Classification Test Matrix

| User Input | Detected Intent | Route Target | Confidence |
|------------|----------------|--------------|------------|
| "Dr. Anna Wagner" | Doctor | Doctor slots | High (0.9) |
| "Dr. Schmidt" | Doctor | Doctor slots | High (0.9) |
| "cardiology" | Specialty | Specialty flow | High (0.85) |
| "knee pain" | Specialty (Orthopedics) | Specialty flow | Medium (0.7) |
| "urgent care" | Urgent | Fast-Lane | High (0.8) |
| "severe headache" | Specialty (Neurology) | Specialty flow | Medium (0.7) |
| "xyz123" | Unclear | Manual options | Low (0.3) |
| "help" | Unclear | Manual options | Low (0.5) |

---

## Edge Cases & Validation

### Empty States
- [ ] No search query: "Analyze My Request" button disabled
- [ ] No family members: Shows add family CTA
- [ ] No recent doctors: "See my doctor again" hidden

### Data Persistence
- [ ] Patient selection persists across navigation
- [ ] Family member choice maintained on back navigation
- [ ] Search query cleared on successful routing

### Error Handling
- [ ] Invalid doctor ID: Falls back to manual options
- [ ] Network error: Shows error state (if applicable)
- [ ] Missing profile data: Redirects to profile completion

### Accessibility
- [ ] Search input has proper label
- [ ] Chips have aria-pressed state
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Touch targets minimum 44px

---

## Debug Tips

### Browser DevTools
```javascript
// Check current booking flow
console.log(appState.extendedState.bookingFlow)

// Check profile myDoctors
console.log(appState.state.profile.myDoctors)

// Check search filters
console.log(appState.state.booking.currentSearch)
```

### State Inspection
- Open React DevTools > Components
- Find `AppStateProvider`
- Inspect `extendedState.bookingFlow`
- Verify `profile.myDoctors` array

### Route Debugging
- Watch URL changes in browser address bar
- Check console for navigation logs
- Verify route params (e.g., `/booking/doctor/:id`)

---

## i18n Testing

### English (EN)
Navigate to intent screen with English locale:
- [ ] "What brings you in today?"
- [ ] "e.g. 'Dr. Müller', 'cardiology', 'knee pain'..."
- [ ] "Myself" / "Family Member"
- [ ] "Analyze My Request"

### German (DE)
Switch to German locale:
- [ ] "Was führt Sie heute zu uns?"
- [ ] "z.B. 'Dr. Müller', 'Kardiologie', 'Knie-Schmerzen'..."
- [ ] "Ich selbst" / "Familienmitglied"
- [ ] "Anfrage analysieren"

---

## Performance Testing

### Load Time
- [ ] Intent screen loads in < 1 second
- [ ] No visible lag when typing in search
- [ ] Smooth transitions between states

### Memory
- [ ] No memory leaks on repeated navigation
- [ ] State resets properly on booking completion

---

## Sign-off Criteria

**Before deploying, verify:**

- [ ] All manual test cases pass
- [ ] Automated tests pass (`npm test`)
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile viewport (375px)
- [ ] i18n strings load correctly
- [ ] Accessibility audit passes
- [ ] Intent classification accuracy > 80% for common queries

---

## Related Files

| File | Purpose |
|------|---------|
| `IntentCaptureScreen.tsx` | Main screen implementation |
| `AppContext.tsx` | State management for booking flow |
| `paths.ts` | Route definitions |
| `booking.json` (en/de) | i18n strings |
| `IntentCaptureScreen.test.tsx` | Automated tests |

---

## Support

For issues or questions:
1. Check this testing guide
2. Review console logs for errors
3. Verify state in React DevTools
4. Compare with existing `BookingTypeScreen` behavior

---

*Last updated: February 3, 2026*
*Feature: Approach A - Intent-Based Smart Router*

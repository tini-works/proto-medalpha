# Refactor Plan: Unify Doctor Results Screen & Update Booking Flows

## Overview

1. **Simplify Specialty-first flow** - Remove doctor selection step, combine constraints with specialty selection
2. **Enhance Doctor-first flow** - Add symptom description step after doctor selection
3. **Unify doctor listing UI** - Single ResultsScreen for doctor selection (used only in doctor-first flow now)

---

## Revised Booking Flows

### Specialty-First Flow (Simplified - 3 steps)
```
BookingTypeScreen → SpecialtyScreen → AvailabilityScreen → MatchingScreen → Success
     [Entry]        [Select specialty    [Choose time slots]    [Auto-match]
                     + city + insurance]       Step 2 of 2
                         Step 1 of 2
```
- **Removed:** Doctor selection step (system auto-matches)
- **Combined:** Constraints (city, insurance) merged into specialty screen

### Doctor-First Flow (4 steps)
```
BookingTypeScreen → ResultsScreen → SymptomsScreen → AvailabilityScreen → MatchingScreen → Success
     [Entry]        [Search/select    [Describe         [Choose time        [Confirm with
                     doctor]           symptoms]          slots]              doctor]
                    Step 1 of 4       Step 2 of 4       Step 3 of 4
                         ↓
                   [Bottom sheet for doctor details - no progress]
```
- **New:** Symptoms screen with specialty-filtered options + free text
- **Doctor details:** Bottom sheet from results (no progress indicator)

### Fast-Lane Flow (Unchanged)
```
BookingTypeScreen → CareRequestScreen → MatchingScreen → Success
     [Entry]        [Symptoms/specialty]   [Auto-match]
```

---

## Key Design Decisions

| Question | Decision |
|----------|----------|
| Symptoms screen location | After doctor selection, before availability |
| Doctor details view | Bottom sheet from results (tap card), no progress indicator |
| Specialty-first constraints | Combined into specialty selection screen |
| Symptom options | Filtered by doctor's specialty + free text input |
| Symptoms required | At least 1 symptom OR text input required |

---

## Implementation Tasks

### Phase 1: Simplify Specialty-First Flow

#### Task 1.1: Combine constraints into SpecialtyScreen
**File:** `src/screens/booking/SearchScreen.tsx` (SpecialtyScreen)

Add city and insurance selection to the specialty screen:

```tsx
// Add state for city and insurance
const [selectedCity, setSelectedCity] = useState(profile.address?.city || '')
const [selectedInsurance, setSelectedInsurance] = useState(profile.insuranceType || 'GKV')

// Add UI sections after specialty selection:
{/* City Selection */}
<section className="mt-6">
  <h2 className="text-sm font-medium text-charcoal-500 mb-3">{t('selectCity')}</h2>
  <CitySelector value={selectedCity} onChange={setSelectedCity} />
</section>

{/* Insurance Selection */}
<section className="mt-6">
  <h2 className="text-sm font-medium text-charcoal-500 mb-3">{t('insuranceType')}</h2>
  <div className="flex gap-3">
    <InsuranceChip value="GKV" selected={selectedInsurance === 'GKV'} onSelect={() => setSelectedInsurance('GKV')} />
    <InsuranceChip value="PKV" selected={selectedInsurance === 'PKV'} onSelect={() => setSelectedInsurance('PKV')} />
  </div>
</section>

// Update continue handler to save all filters and go to availability
const handleContinue = () => {
  setSearchFilters({
    specialty: selectedSpecialty,
    city: selectedCity,
    insuranceType: selectedInsurance,
  })
  navigate(PATHS.BOOKING_AVAILABILITY)
}
```

#### Task 1.2: Add progress indicator to SpecialtyScreen
**File:** `src/screens/booking/SearchScreen.tsx`

```tsx
{/* Progress indicator - Step 1 of 2 */}
<div className="px-4 py-4 space-y-3">
  <div className="flex items-center justify-between">
    <span className="text-xs font-semibold tracking-wide text-slate-600">
      {t('step1Of2')}
    </span>
    <span className="text-xs text-slate-500">{t('yourRequest')}</span>
  </div>
  <ProgressIndicator currentStep={1} totalSteps={2} variant="bar" showLabel={false} showPercentage={false} />
</div>
```

#### Task 1.3: Update AvailabilityScreen for specialty-first
**File:** `src/screens/booking/AvailabilityScreen.tsx`

Update progress and navigation for simplified flow:

```tsx
// Progress: Step 2 of 2 for specialty-first
<ProgressIndicator
  currentStep={isDoctorFirstFlow ? 3 : 2}
  totalSteps={isDoctorFirstFlow ? 4 : 2}
  variant="bar"
  showLabel={false}
  showPercentage={false}
/>

// Step label
<span className="text-xs font-semibold tracking-wide text-slate-600">
  {isDoctorFirstFlow ? t('step3Of4') : t('step2Of2')}
</span>

// Back navigation
const handleBack = () => {
  if (isDoctorFirstFlow) {
    navigate(PATHS.BOOKING_SYMPTOMS)
  } else {
    navigate(PATHS.BOOKING_SPECIALTY)  // Back to combined specialty screen
  }
}

// Continue handler - specialty-first goes directly to matching
const handleContinue = () => {
  const slots: AvailabilitySlot[] = Array.from(selectedSlots).map(parseSlotKey)
  const prefs = { fullyFlexible, slots }
  setAvailabilityPrefs(prefs)

  if (isDoctorFirstFlow && selectedDoctor) {
    // Doctor-first: go to matching with doctor + symptoms
    setSpecialtyMatchRequest({
      specialty: selectedDoctor.specialty,
      city: selectedDoctor.city,
      insuranceType: (selectedDoctor.accepts.includes('GKV') ? 'GKV' : 'PKV') as 'GKV' | 'PKV',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      availabilityPrefs: prefs,
      patientId: profile.id,
      patientName: profile.fullName,
      symptomInfo: symptomInfo,
    })
    navigate(PATHS.FAST_LANE_MATCHING)
  } else {
    // Specialty-first: go directly to matching (no doctor)
    setSpecialtyMatchRequest({
      specialty: search?.specialty || '',
      city: search?.city || '',
      insuranceType: (search?.insuranceType || 'GKV') as 'GKV' | 'PKV',
      doctorId: '',
      doctorName: '',
      availabilityPrefs: prefs,
      patientId: profile.id,
      patientName: profile.fullName,
    })
    navigate(PATHS.FAST_LANE_MATCHING)
  }
}
```

#### Task 1.4: Remove/deprecate ConstraintsScreen
**Files:**
- Mark `src/screens/booking/ConstraintsScreen.tsx` for removal
- Update `src/screens/booking/index.ts` - remove export
- Update `src/App.tsx` - remove or redirect route

---

### Phase 2: Add Symptoms Screen for Doctor-First Flow

#### Task 2.1: Create symptoms data by specialty
**File:** `src/data/symptoms.ts`

Add specialty-to-symptoms mapping:

```tsx
// Existing symptoms array
export const symptoms = [
  { id: 'headache', labelKey: 'symptom_headache', specialties: ['Neurology', 'General Medicine'] },
  { id: 'skin_rash', labelKey: 'symptom_skinRash', specialties: ['Dermatology'] },
  { id: 'chest_pain', labelKey: 'symptom_chestPain', specialties: ['Cardiology', 'General Medicine'] },
  { id: 'back_pain', labelKey: 'symptom_backPain', specialties: ['Orthopedics', 'General Medicine'] },
  { id: 'fever', labelKey: 'symptom_fever', specialties: ['General Medicine', 'ENT'] },
  { id: 'cough', labelKey: 'symptom_cough', specialties: ['General Medicine', 'ENT', 'Pulmonology'] },
  { id: 'joint_pain', labelKey: 'symptom_jointPain', specialties: ['Orthopedics', 'Rheumatology'] },
  { id: 'fatigue', labelKey: 'symptom_fatigue', specialties: ['General Medicine', 'Endocrinology'] },
  { id: 'anxiety', labelKey: 'symptom_anxiety', specialties: ['Psychiatry', 'General Medicine'] },
  { id: 'eye_pain', labelKey: 'symptom_eyePain', specialties: ['Ophthalmology'] },
  // ... more symptoms
]

// Helper to get symptoms for a specialty
export function getSymptomsForSpecialty(specialty: string): typeof symptoms {
  const matched = symptoms.filter(s =>
    s.specialties.some(sp => sp.toLowerCase() === specialty.toLowerCase())
  )
  // Always include general symptoms if few matches
  if (matched.length < 4) {
    const general = symptoms.filter(s => s.specialties.includes('General Medicine'))
    return [...new Set([...matched, ...general])].slice(0, 8)
  }
  return matched.slice(0, 8)
}
```

#### Task 2.2: Create SymptomsScreen
**File:** `src/screens/booking/SymptomsScreen.tsx` (NEW)

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconArrowRight } from '@tabler/icons-react'
import { Header, Page, ProgressIndicator, ReasonTextarea } from '../../components'
import { Button } from '../../components/ui'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'
import { getSymptomsForSpecialty } from '../../data/symptoms'

export default function SymptomsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { selectedDoctor, setSymptomInfo } = useBooking()

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')

  // Redirect if no doctor selected
  if (!selectedDoctor) {
    navigate(PATHS.BOOKING_RESULTS)
    return null
  }

  // Get symptoms filtered by doctor's specialty
  const relevantSymptoms = getSymptomsForSpecialty(selectedDoctor.specialty)

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const handleBack = () => {
    navigate(PATHS.BOOKING_RESULTS)
  }

  const handleContinue = () => {
    setSymptomInfo({
      symptoms: selectedSymptoms,
      additionalNotes: additionalNotes.trim(),
    })
    navigate(PATHS.BOOKING_AVAILABILITY)
  }

  // At least 1 symptom OR text required
  const canContinue = selectedSymptoms.length > 0 || additionalNotes.trim().length > 0

  return (
    <Page safeBottom={false}>
      <Header title={t('describeSymptoms')} showBack onBack={handleBack} />

      {/* Progress indicator - Step 2 of 4 */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            {t('step2Of4')}
          </span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          variant="bar"
          showLabel={false}
          showPercentage={false}
        />
      </div>

      <div className="px-4 pb-28 space-y-6">
        {/* Doctor info banner */}
        <div className="bg-cream-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            {selectedDoctor.imageUrl ? (
              <img
                src={selectedDoctor.imageUrl}
                alt={selectedDoctor.name}
                className="w-12 h-12 object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-teal-100 flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-lg">
                  {selectedDoctor.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-charcoal-500 truncate">{selectedDoctor.name}</p>
            <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
          </div>
        </div>

        {/* Symptoms selection */}
        <section>
          <h2 className="text-sm font-medium text-charcoal-500 mb-2">
            {t('whatBringsYouIn')}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {t('selectAllThatApply')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {relevantSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 ${
                    isSelected
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-white border border-cream-400 text-charcoal-500 hover:border-teal-400'
                  }`}
                >
                  {isSelected && <IconCheck size={16} stroke={2.5} className="flex-shrink-0" />}
                  <span className="flex-1">{t(symptom.labelKey)}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Additional notes - always visible */}
        <section>
          <ReasonTextarea
            value={additionalNotes}
            onChange={setAdditionalNotes}
            label={t('additionalDetails')}
            placeholder={t('additionalDetailsPlaceholder')}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 mt-2">
            {t('symptomRequirement')}
          </p>
        </section>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            variant="primary"
            fullWidth
            size="lg"
          >
            <span className="flex items-center gap-2">
              {t('continueBtn')}
              <IconArrowRight size={20} stroke={2} />
            </span>
          </Button>
        </div>
      </div>
    </Page>
  )
}
```

#### Task 2.3: Add route for SymptomsScreen
**File:** `src/routes/paths.ts`

```tsx
// Add new path
BOOKING_SYMPTOMS: '/booking/symptoms',
```

#### Task 2.4: Register route in App.tsx
**File:** `src/App.tsx`

```tsx
import { SymptomsScreen as BookingSymptomsScreen } from './screens/booking'

// Add route after BOOKING_AVAILABILITY
<Route
  path={PATHS.BOOKING_SYMPTOMS}
  element={
    <RequireAuth>
      <RequireProfileComplete>
        <BookingSymptomsScreen />
      </RequireProfileComplete>
    </RequireAuth>
  }
/>
```

#### Task 2.5: Export SymptomsScreen
**File:** `src/screens/booking/index.ts`

```tsx
export { default as SymptomsScreen } from './SymptomsScreen'
```

#### Task 2.6: Add symptomInfo to booking state
**File:** `src/state/AppContext.tsx`

```tsx
// In ExtendedState interface, add:
symptomInfo: {
  symptoms: string[]
  additionalNotes: string
} | null

// In initial extendedState:
symptomInfo: null,

// Add setter function in api:
setSymptomInfo: (info) =>
  setExtendedState((s) => ({ ...s, symptomInfo: info })),

// In resetBooking or clearSpecialtyMatchRequest, clear symptomInfo:
symptomInfo: null,

// Export from useBooking hook:
symptomInfo: extendedState.symptomInfo,
setSymptomInfo,
```

---

### Phase 3: Update ResultsScreen for Doctor-First Flow

#### Task 3.1: Add doctor detail bottom sheet
**File:** `src/screens/booking/ResultsScreen.tsx`

The `DoctorDetailSheet` component already exists. Update to use it for doctor-first flow:

```tsx
// State for detail sheet
const [detailSheetDoctor, setDetailSheetDoctor] = useState<Doctor | null>(null)

// Handler to open detail sheet (tap on card)
const handleViewDetails = (doctor: Doctor) => {
  setDetailSheetDoctor(doctor)
}

// Handler to select from sheet
const handleSelectFromSheet = () => {
  if (detailSheetDoctor) {
    setSelectedDoctorId(detailSheetDoctor.id)
    setDetailSheetDoctor(null)
  }
}

// In DoctorCard, make card tappable to open sheet:
<DoctorCard
  key={doctor.id}
  doctor={doctor}
  slots={[]}  // No slots in doctor-first
  showSlots={false}
  selectable={isDoctorFirstFlow}
  selected={selectedDoctorId === doctor.id}
  onSelect={() => handleDoctorRadioSelect(doctor.id)}
  onViewDetails={() => handleViewDetails(doctor)}  // Tap card opens sheet
  onSelectDoctor={() => handleViewDetails(doctor)}  // Also opens sheet
/>

// Render detail sheet
{detailSheetDoctor && (
  <DoctorDetailSheet
    doctor={detailSheetDoctor}
    onClose={() => setDetailSheetDoctor(null)}
    onSelect={handleSelectFromSheet}
  />
)}
```

#### Task 3.2: Add specialty filter chips
**File:** `src/screens/booking/ResultsScreen.tsx`

```tsx
// Add state
const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null)

// Get unique specialties
const availableSpecialties = useMemo(() => {
  const set = new Set<string>()
  for (const doctor of doctors) {
    set.add(doctor.specialty)
  }
  return Array.from(set).sort()
}, [doctors])

// Update filteredDoctors to include specialty filter
const filteredDoctors = useMemo(() => {
  return doctors.filter((doctor) => {
    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const nameMatch = doctor.name.toLowerCase().includes(query)
      const specialtyMatch = doctor.specialty.toLowerCase().includes(query)
      if (!nameMatch && !specialtyMatch) return false
    }
    // Specialty filter
    if (specialtyFilter && doctor.specialty !== specialtyFilter) return false
    // Other existing filters...
    if (onlyPublic && !doctor.accepts.includes('GKV')) return false
    if (minRating > 0 && doctor.rating < minRating) return false
    if (selectedLanguages.length > 0 && !selectedLanguages.some((l) => doctor.languages.includes(l))) return false
    return true
  })
}, [doctors, searchQuery, specialtyFilter, onlyPublic, minRating, selectedLanguages])

// Add specialty filter UI after search bar
{isDoctorFirstFlow && (
  <div className="px-4 py-2 bg-white border-b border-cream-300">
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        onClick={() => setSpecialtyFilter(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          !specialtyFilter
            ? 'bg-teal-500 text-white'
            : 'bg-cream-100 text-slate-600 hover:bg-cream-200'
        }`}
      >
        {t('allSpecialties')}
      </button>
      {availableSpecialties.map((specialty) => (
        <button
          key={specialty}
          onClick={() => setSpecialtyFilter(specialty)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            specialtyFilter === specialty
              ? 'bg-teal-500 text-white'
              : 'bg-cream-100 text-slate-600 hover:bg-cream-200'
          }`}
        >
          {specialty}
        </button>
      ))}
    </div>
  </div>
)}
```

#### Task 3.3: Add progress indicator for doctor-first
**File:** `src/screens/booking/ResultsScreen.tsx`

```tsx
{/* Progress indicator - only for doctor-first flow */}
{isDoctorFirstFlow && (
  <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold tracking-wide text-slate-600">
        {t('step1Of4')}
      </span>
      <span className="text-xs text-slate-500">{t('yourRequest')}</span>
    </div>
    <ProgressIndicator currentStep={1} totalSteps={4} variant="bar" showLabel={false} showPercentage={false} />
  </div>
)}
```

#### Task 3.4: Update Continue handler
**File:** `src/screens/booking/ResultsScreen.tsx`

Navigate to SymptomsScreen instead of DoctorProfileScreen:

```tsx
const handleContinue = () => {
  const doctor = sortedDoctors.find((d) => d.id === selectedDoctorId)
  if (!doctor) return

  selectDoctor(doctor)
  navigate(PATHS.BOOKING_SYMPTOMS)  // Go to symptoms, not profile
}
```

#### Task 3.5: Update header title and back navigation
**File:** `src/screens/booking/ResultsScreen.tsx`

```tsx
// Header title
<h1 className="text-lg font-semibold text-charcoal-500">
  {isDoctorFirstFlow ? t('selectDoctor') : t('searchResults')}
</h1>

// Back navigation
const handleBack = () => {
  if (isDoctorFirstFlow) {
    navigate(PATHS.BOOKING)  // Back to booking type selection
  } else {
    navigate(PATHS.BOOKING_LOCATION)  // Existing behavior
  }
}
```

#### Task 3.6: Remove specialty-first specific code
**File:** `src/screens/booking/ResultsScreen.tsx`

- Remove `isSpecialtyFirstFlow` variable and all related conditionals
- Remove `handleSkip` function
- Remove Skip button from bottom bar
- Remove `MAX_SPECIALTY_RESULTS` limit
- Clean up unused imports and state

---

### Phase 4: Update Routing & Navigation

#### Task 4.1: Update BookingTypeScreen navigation
**File:** `src/screens/booking/BookingTypeScreen.tsx`

```tsx
const bookingTypes: BookingTypeOption[] = [
  {
    id: 'fast_lane',
    icon: <IconBolt className="w-6 h-6" stroke={2} />,
    titleKey: 'fastLane',
    subtitleKey: 'fastLaneDesc',
    badge: 'quickest',
    path: PATHS.FAST_LANE,
  },
  {
    id: 'by_specialty',
    icon: <IconStethoscope className="w-6 h-6" stroke={2} />,
    titleKey: 'bookBySpecialty',
    subtitleKey: 'bookBySpecialtyDesc',
    path: PATHS.BOOKING_SPECIALTY,  // Goes to combined specialty + constraints screen
  },
  {
    id: 'by_doctor',
    icon: <IconUserSearch className="w-6 h-6" stroke={2} />,
    titleKey: 'bookByDoctor',
    subtitleKey: 'bookByDoctorDesc',
    path: PATHS.BOOKING_RESULTS,  // Goes directly to doctor search/results
  },
]
```

#### Task 4.2: Add redirects for deprecated routes
**File:** `src/App.tsx`

```tsx
{/* Redirect deprecated routes */}
<Route
  path={PATHS.BOOKING_DOCTOR_SEARCH}
  element={<Navigate to={PATHS.BOOKING_RESULTS} replace />}
/>
<Route
  path={PATHS.BOOKING_CONSTRAINTS}
  element={<Navigate to={PATHS.BOOKING_SPECIALTY} replace />}
/>
```

---

### Phase 5: Add Translations

#### Task 5.1: Add new i18n keys
**Files:** `src/locales/en/booking.json` and `src/locales/de/booking.json`

English:
```json
{
  "step1Of2": "STEP 1 OF 2",
  "step2Of2": "STEP 2 OF 2",
  "step1Of4": "STEP 1 OF 4",
  "step2Of4": "STEP 2 OF 4",
  "step3Of4": "STEP 3 OF 4",
  "step4Of4": "STEP 4 OF 4",
  "selectDoctor": "Select Doctor",
  "describeSymptoms": "Describe Symptoms",
  "whatBringsYouIn": "What brings you in today?",
  "selectAllThatApply": "Select all that apply",
  "additionalDetails": "Additional Details",
  "additionalDetailsPlaceholder": "Describe any other symptoms or concerns you'd like to discuss...",
  "symptomRequirement": "Please select at least one symptom or describe your concern",
  "allSpecialties": "All",
  "selectCity": "Where would you like to be seen?",
  "symptom_headache": "Headache",
  "symptom_skinRash": "Skin rash",
  "symptom_chestPain": "Chest pain",
  "symptom_backPain": "Back pain",
  "symptom_fever": "Fever",
  "symptom_cough": "Cough",
  "symptom_jointPain": "Joint pain",
  "symptom_fatigue": "Fatigue",
  "symptom_anxiety": "Anxiety",
  "symptom_eyePain": "Eye pain"
}
```

German:
```json
{
  "step1Of2": "SCHRITT 1 VON 2",
  "step2Of2": "SCHRITT 2 VON 2",
  "step1Of4": "SCHRITT 1 VON 4",
  "step2Of4": "SCHRITT 2 VON 4",
  "step3Of4": "SCHRITT 3 VON 4",
  "step4Of4": "SCHRITT 4 VON 4",
  "selectDoctor": "Arzt auswählen",
  "describeSymptoms": "Symptome beschreiben",
  "whatBringsYouIn": "Was führt Sie heute zu uns?",
  "selectAllThatApply": "Wählen Sie alle zutreffenden aus",
  "additionalDetails": "Weitere Details",
  "additionalDetailsPlaceholder": "Beschreiben Sie weitere Symptome oder Anliegen...",
  "symptomRequirement": "Bitte wählen Sie mindestens ein Symptom oder beschreiben Sie Ihr Anliegen",
  "allSpecialties": "Alle",
  "selectCity": "Wo möchten Sie behandelt werden?",
  "symptom_headache": "Kopfschmerzen",
  "symptom_skinRash": "Hautausschlag",
  "symptom_chestPain": "Brustschmerzen",
  "symptom_backPain": "Rückenschmerzen",
  "symptom_fever": "Fieber",
  "symptom_cough": "Husten",
  "symptom_jointPain": "Gelenkschmerzen",
  "symptom_fatigue": "Müdigkeit",
  "symptom_anxiety": "Angst",
  "symptom_eyePain": "Augenschmerzen"
}
```

---

### Phase 6: Cleanup

#### Task 6.1: Remove deprecated files
**Files to delete:**
- `src/screens/booking/DoctorSearchScreen.tsx`
- `src/screens/booking/ConstraintsScreen.tsx` (if fully merged)

#### Task 6.2: Update exports
**File:** `src/screens/booking/index.ts`

```tsx
// Remove
export { default as DoctorSearchScreen } from './DoctorSearchScreen'
export { default as ConstraintsScreen } from './ConstraintsScreen'

// Add
export { default as SymptomsScreen } from './SymptomsScreen'
```

#### Task 6.3: Update App.tsx imports
**File:** `src/App.tsx`

- Remove `BookingDoctorSearchScreen` import
- Remove `BookingConstraintsScreen` import
- Add `BookingSymptomsScreen` import

#### Task 6.4: Clean up ResultsScreen
**File:** `src/screens/booking/ResultsScreen.tsx`

- Remove all `isSpecialtyFirstFlow` code
- Remove `handleSkip` function
- Remove `MAX_SPECIALTY_RESULTS`
- Remove unused imports
- Simplify conditionals

---

## Updated Flow Diagrams

### Specialty-First (2 steps)
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  BookingType    │────▶│   Specialty     │────▶│  Availability   │────▶│    Matching     │
│    Screen       │     │    Screen       │     │    Screen       │     │    Screen       │
│                 │     │  + City         │     │  Step 2 of 2    │     │  (auto-match)   │
│                 │     │  + Insurance    │     │                 │     │                 │
│                 │     │  Step 1 of 2    │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Doctor-First (4 steps)
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  BookingType    │────▶│    Results      │────▶│   Symptoms      │────▶│  Availability   │────▶│    Matching     │
│    Screen       │     │    Screen       │     │    Screen       │     │    Screen       │     │    Screen       │
│                 │     │  Step 1 of 4    │     │  Step 2 of 4    │     │  Step 3 of 4    │     │  (with doctor)  │
│                 │     │       ↓         │     │                 │     │                 │     │                 │
│                 │     │  [Detail Sheet] │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## File Changes Summary

| File | Action |
|------|--------|
| `src/screens/booking/SymptomsScreen.tsx` | **Create** |
| `src/screens/booking/SearchScreen.tsx` | Modify (add city + insurance) |
| `src/screens/booking/ResultsScreen.tsx` | Modify (doctor-first only, add specialty filter) |
| `src/screens/booking/AvailabilityScreen.tsx` | Modify (update progress, navigation) |
| `src/screens/booking/BookingTypeScreen.tsx` | Modify (update paths) |
| `src/screens/booking/DoctorSearchScreen.tsx` | **Delete** |
| `src/screens/booking/ConstraintsScreen.tsx` | **Delete** (or keep as redirect) |
| `src/screens/booking/index.ts` | Modify (update exports) |
| `src/state/AppContext.tsx` | Modify (add symptomInfo) |
| `src/data/symptoms.ts` | Modify (add specialty mapping) |
| `src/routes/paths.ts` | Modify (add BOOKING_SYMPTOMS) |
| `src/App.tsx` | Modify (routes) |
| `src/locales/en/booking.json` | Modify |
| `src/locales/de/booking.json` | Modify |

---

## Testing Checklist

### Specialty-First Flow (2 steps)
- [ ] Select "Book by Specialty" from BookingTypeScreen
- [ ] Verify SpecialtyScreen shows city and insurance selection
- [ ] Verify progress shows "Step 1 of 2"
- [ ] Select specialty, city, insurance → Continue
- [ ] Verify AvailabilityScreen shows "Step 2 of 2"
- [ ] Select time slots → Continue
- [ ] Verify goes directly to MatchingScreen (no doctor selection)
- [ ] Verify matching works without doctor specified
- [ ] Verify back navigation: Availability → Specialty → BookingType

### Doctor-First Flow (4 steps)
- [ ] Select "Book by Doctor" from BookingTypeScreen
- [ ] Verify ResultsScreen shows "Step 1 of 4"
- [ ] Verify specialty filter chips appear and work
- [ ] Verify search by name works
- [ ] Tap doctor card → Bottom sheet opens (no progress indicator)
- [ ] Select doctor via radio or sheet → Continue
- [ ] Verify SymptomsScreen shows "Step 2 of 4"
- [ ] Verify symptoms filtered by doctor's specialty
- [ ] Select multiple symptoms
- [ ] Add additional text
- [ ] Continue → AvailabilityScreen
- [ ] Verify AvailabilityScreen shows "Step 3 of 4"
- [ ] Select time slots → Continue
- [ ] Verify MatchingScreen receives doctor + symptoms
- [ ] Verify back navigation through all steps

### Validation
- [ ] Cannot continue from SymptomsScreen without symptom or text
- [ ] Cannot continue from AvailabilityScreen without slots or "fully flexible"

### Fast-Lane Flow (Regression)
- [ ] Fast-Lane flow unchanged and working

### Edge Cases
- [ ] Direct URL to /booking/symptoms without doctor → redirects
- [ ] Direct URL to /booking/constraints → redirects to /booking/specialty
- [ ] State cleared when starting new booking

---

## Estimated Effort

| Phase | Tasks | Estimate |
|-------|-------|----------|
| Phase 1: Simplify Specialty-First | 4 tasks | 1 hour |
| Phase 2: Add Symptoms Screen | 6 tasks | 1.5 hours |
| Phase 3: Update ResultsScreen | 6 tasks | 1.5 hours |
| Phase 4: Update Routing | 2 tasks | 20 min |
| Phase 5: Translations | 1 task | 20 min |
| Phase 6: Cleanup | 4 tasks | 20 min |
| Testing | Full regression | 1 hour |
| **Total** | | **6 hours** |

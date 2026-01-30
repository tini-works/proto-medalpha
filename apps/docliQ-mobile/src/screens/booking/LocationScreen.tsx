import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Building, Home, Calendar, AlertCircle, Microphone, X } from 'tabler-icons-react'
import { Header, Page, ProgressIndicator } from '../../components'
import { LocationSelector } from '../../components/forms/LocationSelector'
import type { LocationValue } from '../../components/forms/LocationSelector'
import type { SavedLocation } from '../../components/display/SavedLocations'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'

export default function LocationScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { setSearchFilters, search } = useBooking()
  const { profile } = useProfile()

  // Check if user has already set insurance
  const hasInsurance = Boolean(profile.insuranceType)

  const [selectedLocation, setSelectedLocation] = useState<LocationValue | null>(null)
  const [radius, setRadius] = useState<number>(search?.radius ?? 10)
  const [visitType, setVisitType] = useState<'in_clinic' | 'home_visit'>(search?.visitType ?? 'in_clinic')
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>(search?.urgency ?? 'routine')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const hasAutoOpenedPicker = useRef(false)

  // Mock saved locations - in a real app, these would come from user profile/state
  const mockSavedLocations: SavedLocation[] = useMemo(
    () => [
      {
        id: 'home',
        name: t('savedLocationHome'),
        address: 'Musterstrasse 123, 10115 Berlin',
        icon: 'home',
      },
      {
        id: 'work',
        name: t('savedLocationWork'),
        address: 'Alexanderplatz 1, 10178 Berlin',
        icon: 'work',
      },
    ],
    [t]
  )

  useEffect(() => {
    if (search?.city) {
      setSelectedLocation({ type: 'address', value: search.city, radius })
    }
  }, [search?.city, radius])

  useEffect(() => {
    // If there's no prefilled location, prompt the user by opening the picker once.
    // Don't auto-open if city is already set (e.g., navigating back from Insurance)
    if (hasAutoOpenedPicker.current) return
    if (selectedLocation) return
    if (search?.city) return
    hasAutoOpenedPicker.current = true
    setIsLocationPickerOpen(true)
  }, [selectedLocation, search?.city])

  const locationLabel = useMemo(() => {
    if (!selectedLocation?.value) return t('chooseLocation')
    if (selectedLocation.type === 'gps') return t('currentLocation')
    return selectedLocation.value
  }, [selectedLocation, t])

  const handleLocationSelect = (location: LocationValue) => {
    setSelectedLocation(location)
    setRadius(location.radius)
    setIsLocationPickerOpen(false)
  }

  const handleContinue = () => {
    if (selectedLocation) {
      if (!search?.specialty) {
        navigate(PATHS.BOOKING_SEARCH)
        return
      }

      setSearchFilters({
        ...search,
        city: selectedLocation.value,
        radius,
        visitType,
        urgency,
        // Pre-fill insurance from profile if available
        insuranceType: hasInsurance ? profile.insuranceType : search.insuranceType,
      })

      // Skip insurance screen if user already has insurance set
      if (hasInsurance) {
        navigate(PATHS.BOOKING_RESULTS)
      } else {
        navigate(PATHS.BOOKING_INSURANCE)
      }
    }
  }

  const handleBack = () => {
    navigate(PATHS.BOOKING_SEARCH)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('locationPreferences')} showBack onBack={handleBack} />

      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">{t('step2Of4')}</span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator currentStep={2} totalSteps={4} variant="bar" showLabel={false} showPercentage={false} />
      </div>

      <div className="px-4 pb-28 space-y-5">
        {/* Visit type toggle */}
        <div className="bg-white rounded-2xl border border-cream-400 p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVisitType('in_clinic')}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-normal ease-out-brand ${
                visitType === 'in_clinic'
                  ? 'bg-cream-100 text-charcoal-500 ring-1 ring-cream-400'
                  : 'bg-white text-slate-600 hover:bg-cream-50'
              }`}
              aria-pressed={visitType === 'in_clinic'}
            >
              <Building size="20" stroke="2" />
              {t('inClinic')}
            </button>
            <button
              type="button"
              onClick={() => setVisitType('home_visit')}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-normal ease-out-brand ${
                visitType === 'home_visit'
                  ? 'bg-cream-100 text-charcoal-500 ring-1 ring-cream-400'
                  : 'bg-white text-slate-600 hover:bg-cream-50'
              }`}
              aria-pressed={visitType === 'home_visit'}
            >
              <Home size="20" stroke="2" />
              {t('homeVisit')}
            </button>
          </div>
        </div>

        {/* Location + radius card */}
        <div className="bg-white rounded-2xl border border-cream-400 p-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 mb-1">{t('location')}</p>
              <p className="font-medium text-charcoal-500 truncate">{locationLabel}</p>
              {!selectedLocation && (
                <p className="text-xs text-slate-500 mt-1">{t('selectLocationToContinue')}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsLocationPickerOpen(true)}
              className="text-sm font-medium text-teal-700 hover:underline flex-shrink-0"
            >
              {t('change')}
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-500">{t('radius')}</p>
              <span className="px-2 py-0.5 rounded-md bg-cream-100 text-sm font-semibold text-charcoal-500">
                {radius} {t('km')}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-teal-500"
              aria-label="Radius in kilometers"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
              <span>1 {t('km')}</span>
              <span>50 {t('km')}</span>
            </div>
          </div>
        </div>

        {/* Urgency level */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-charcoal-500">{t('urgencyLevel')}</h2>

          <button
            type="button"
            onClick={() => setUrgency('routine')}
            className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-colors duration-normal ease-out-brand ${
              urgency === 'routine' ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
            }`}
            aria-pressed={urgency === 'routine'}
          >
            <div className="w-10 h-10 rounded-xl bg-cream-200 flex items-center justify-center flex-shrink-0">
              <Calendar size="20" stroke="2" className="text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-charcoal-500">{t('routineVisit')}</p>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    urgency === 'routine' ? 'border-teal-600' : 'border-cream-400'
                  }`}
                >
                  {urgency === 'routine' && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{t('routineVisitDesc')}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUrgency('urgent')}
            className={`w-full text-left rounded-2xl border p-4 flex items-start gap-3 transition-colors duration-normal ease-out-brand ${
              urgency === 'urgent' ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
            }`}
            aria-pressed={urgency === 'urgent'}
          >
            <div className="w-10 h-10 rounded-xl bg-coral-50 flex items-center justify-center flex-shrink-0">
              <AlertCircle size="20" stroke="2" className="text-coral-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-charcoal-500">{t('urgentCare')}</p>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    urgency === 'urgent' ? 'border-teal-600' : 'border-cream-400'
                  }`}
                >
                  {urgency === 'urgent' && <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{t('urgentCareDesc')}</p>
            </div>
          </button>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <button
            onClick={handleContinue}
            disabled={!selectedLocation}
            className="btn btn-primary btn-block h-14 py-0 disabled:cursor-not-allowed flex-1"
          >
            {t('continueBtn')}
          </button>
          <button
            type="button"
            onClick={() => navigate(PATHS.ASSISTANT_VOICE)}
            className="h-12 w-12 rounded-full border border-cream-300 bg-white text-teal-700 shadow-sm flex items-center justify-center hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
            aria-label="Voice assistant"
          >
            <Microphone size="20" stroke="2" />
          </button>
        </div>
      </div>

      {/* Location picker (bottom sheet) */}
      {isLocationPickerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
            onClick={() => setIsLocationPickerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-cream-400" />
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="text-lg font-semibold text-charcoal-500">{t('chooseLocation')}</h2>
              <button
                onClick={() => setIsLocationPickerOpen(false)}
                className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors duration-normal ease-out-brand"
                aria-label="Close"
              >
                <X size="20" stroke="2" className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                savedLocations={mockSavedLocations}
                initialRadius={radius}
                showRadius={false}
                showMapPreview={false}
                showSavedLocations={true}
              />
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}

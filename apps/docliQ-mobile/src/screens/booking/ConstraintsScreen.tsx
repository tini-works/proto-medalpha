import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMapPin, IconShieldCheck, IconX } from '@tabler/icons-react'
import { Header, Page, ProgressIndicator } from '../../components'
import { LocationSelector } from '../../components/forms/LocationSelector'
import type { LocationValue } from '../../components/forms/LocationSelector'
import { Button } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

type InsuranceChoice = InsuranceType | ''

export default function ConstraintsScreen() {
  const { t } = useTranslation('booking')
  const navigate = useNavigate()
  const { search, setSearchFilters } = useBooking()
  const { profile } = useProfile()

  // Location state
  const [selectedCity, setSelectedCity] = useState<string>(search?.city || profile.address?.city || '')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const hasAutoOpenedLocationPicker = useRef(false)

  // Insurance state
  const [insurance, setInsurance] = useState<InsuranceChoice>(
    search?.insuranceType || profile.insuranceType || ''
  )

  // Redirect if no specialty selected
  useEffect(() => {
    if (!search?.specialty) {
      navigate(PATHS.BOOKING_SPECIALTY)
    }
  }, [search?.specialty, navigate])

  useEffect(() => {
    // If location is missing, auto-open picker once.
    if (hasAutoOpenedLocationPicker.current) return
    if (selectedCity) return
    hasAutoOpenedLocationPicker.current = true
    setIsLocationPickerOpen(true)
  }, [selectedCity])

  const handleLocationSelect = (location: LocationValue) => {
    setSelectedCity(location.value)
    setIsLocationPickerOpen(false)
  }

  const handleBack = () => {
    navigate(PATHS.BOOKING_SPECIALTY)
  }

  const handleContinue = () => {
    if (!search || !selectedCity || !insurance) return

    setSearchFilters({
      ...search,
      city: selectedCity,
      insuranceType: insurance,
    })

    navigate(PATHS.BOOKING_AVAILABILITY)
  }

  const canContinue = Boolean(selectedCity && insurance)

  return (
    <Page safeBottom={false}>
      <Header title={t('setPreferences')} showBack onBack={handleBack} />

      {/* Progress indicator */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">{t('step2Of4')}</span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator currentStep={2} totalSteps={4} variant="bar" showLabel={false} showPercentage={false} />
      </div>

      <div className="px-4 pb-28 space-y-6">
        {/* Location section */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-charcoal-500">{t('whereAreYouLocated')}</h2>

          <button
            type="button"
            onClick={() => setIsLocationPickerOpen(true)}
            className="w-full bg-white rounded-2xl border border-cream-400 p-4 text-left hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-slate-500">
                <IconMapPin size={20} stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('location')}</p>
                <p className="font-medium text-charcoal-500 truncate">
                  {selectedCity || t('selectCity')}
                </p>
              </div>
              <span className="text-sm font-medium text-teal-700">{t('change')}</span>
            </div>
          </button>
        </section>

        {/* Insurance section */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-charcoal-500">{t('yourInsuranceType')}</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInsurance('GKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                insurance === 'GKV'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={insurance === 'GKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={insurance === 'GKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('publicGkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('statutoryInsurance')}</p>
            </button>

            <button
              type="button"
              onClick={() => setInsurance('PKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                insurance === 'PKV'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={insurance === 'PKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={insurance === 'PKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('privatePkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('privateInsurance')}</p>
            </button>
          </div>
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
            {t('nextBtn')}
          </Button>
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
                <IconX size={20} stroke={2} className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <LocationSelector
                onLocationSelect={handleLocationSelect}
                savedLocations={[]}
                initialRadius={10}
                showRadius={false}
                showMapPreview={false}
                showSavedLocations={false}
              />
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}

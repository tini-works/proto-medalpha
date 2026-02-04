import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMapPin, IconShieldCheck, IconX, IconArrowRight } from '@tabler/icons-react'
import { Header, Page, StickyActionBar } from '../../components'
import { LocationSelector } from '../../components/forms/LocationSelector'
import type { LocationValue } from '../../components/forms/LocationSelector'
import { SpecialtySearchInput } from '../../components/forms/SpecialtySearchInput'
import { Button, Chip } from '../../components/ui'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { specialties } from '../../data/symptoms'
import type { InsuranceType } from '../../types'

type InsuranceChoice = InsuranceType | ''

export default function SearchScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('booking')
  const { setSearchFilters } = useBooking()
  const { profile } = useProfile()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  // City and insurance state (combined from ConstraintsScreen)
  const [selectedCity, setSelectedCity] = useState<string>(profile.address?.city || '')
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceChoice>(profile.insuranceType || '')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)

  const handleSelectSpecialty = (specialtyValue: string) => {
    setSelectedSpecialty(specialtyValue)
  }

  const handleLocationSelect = (location: LocationValue) => {
    setSelectedCity(location.value)
    setIsLocationPickerOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault()
      handleSelectSpecialty(searchQuery.trim())
    }
  }

  // Validation: need specialty, city, and insurance
  const canContinue = Boolean(selectedSpecialty && selectedCity && selectedInsurance)

  const handleContinue = () => {
    if (!canContinue) return

    // Set search filters with all data and navigate to availability
    setSearchFilters({
      specialty: selectedSpecialty!,
      city: selectedCity,
      insuranceType: selectedInsurance,
      includeStores: false,
      radius: 10,
      visitType: 'in_clinic',
      urgency: 'routine',
      onlyPublic: false,
      minRating: 0,
      languages: [],
      sortBy: 'earliest',
    })

    navigate(PATHS.BOOKING_AVAILABILITY, { state: { from: location.pathname, submitMode: 'confirm' } })
  }

  // Filter specialties based on search query
  const filteredSpecialties = searchQuery.trim()
    ? specialties.filter((s) =>
        t(s.labelKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : specialties

  return (
    <Page safeBottom={false}>
      <Header title={t('selectSpecialty')} showBack />

      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Search Input */}
        <section>
          <SpecialtySearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
          />
        </section>

        {/* Specialty Grid */}
        <section>
          <h2 className="text-sm font-medium text-charcoal-500 mb-3">
            {t('specialty')}
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {filteredSpecialties.map((specialty) => (
              <Chip
                key={specialty.id}
                fullWidth
                selected={selectedSpecialty === specialty.value}
                onClick={() => handleSelectSpecialty(specialty.value)}
              >
                {t(specialty.labelKey)}
              </Chip>
            ))}
          </div>

          {filteredSpecialties.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">{t('noResultsHint')}</p>
            </div>
          )}
        </section>

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
              onClick={() => setSelectedInsurance('GKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                selectedInsurance === 'GKV'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={selectedInsurance === 'GKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={selectedInsurance === 'GKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('publicGkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('statutoryInsurance')}</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedInsurance('PKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                selectedInsurance === 'PKV'
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={selectedInsurance === 'PKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={selectedInsurance === 'PKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('privatePkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('privateInsurance')}</p>
            </button>
          </div>
        </section>
      </div>

      {/* Sticky Footer */}
      <StickyActionBar>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant="primary"
          fullWidth
          size="lg"
          rightIcon={<IconArrowRight size={20} stroke={2} />}
        >
          {t('continueBtn')}
        </Button>
      </StickyActionBar>

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

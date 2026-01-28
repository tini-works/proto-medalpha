import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconSearch } from '@tabler/icons-react'
import { Header, Page, ProgressIndicator } from '../../components'
import { useBooking, useProfile } from '../../state'
import { PATHS } from '../../routes'
import { specialties } from '../../data/symptoms'

export default function SearchScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { setSearchFilters } = useBooking()
  const { profile } = useProfile()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)

  // Check if user has already set location and insurance
  const hasLocation = Boolean(profile.address?.city?.trim())
  const hasInsurance = Boolean(profile.insuranceType)

  const handleSelectSpecialty = (specialtyValue: string) => {
    setSelectedSpecialty(specialtyValue)

    // Set search filters with pre-filled data from profile if available
    setSearchFilters({
      specialty: specialtyValue,
      city: hasLocation ? profile.address.city : '',
      insuranceType: hasInsurance ? profile.insuranceType : '',
      includeStores: false,
      radius: 10,
      visitType: 'in_clinic',
      urgency: 'routine',
      onlyPublic: false,
      minRating: 0,
      languages: [],
      sortBy: 'earliest',
    })

    // Navigate to constraints screen (specialty-first flow)
    navigate(PATHS.BOOKING_CONSTRAINTS)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault()
      handleSelectSpecialty(searchQuery.trim())
    }
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

      {/* Progress indicator */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            {t('step1Of4')}
          </span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator
          currentStep={1}
          totalSteps={4}
          variant="bar"
          showLabel={false}
          showPercentage={false}
        />
      </div>

      <div className="px-4 pb-8 space-y-6">
        {/* Search Input */}
        <section>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <IconSearch size={20} stroke={2} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('searchPlaceholder')}
              className="w-full h-14 pl-12 pr-4 rounded-xl bg-white border border-cream-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-all duration-normal ease-out-brand"
            />
          </div>
        </section>

        {/* Specialty Grid */}
        <section>
          <h2 className="text-sm font-medium text-charcoal-500 mb-3">
            {t('specialty')}
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {filteredSpecialties.map((specialty) => (
              <button
                key={specialty.id}
                onClick={() => handleSelectSpecialty(specialty.value)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  selectedSpecialty === specialty.value
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-white border border-cream-400 text-charcoal-500 hover:border-teal-400'
                }`}
              >
                {t(specialty.labelKey)}
              </button>
            ))}
          </div>

          {filteredSpecialties.length === 0 && searchQuery.trim() && (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">{t('noResultsHint')}</p>
            </div>
          )}
        </section>
      </div>
    </Page>
  )
}

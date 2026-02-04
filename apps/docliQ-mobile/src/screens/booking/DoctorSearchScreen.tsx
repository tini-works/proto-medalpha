import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconArrowLeft, IconSearch, IconX, IconChevronDown } from '@tabler/icons-react'
import { Page, DoctorCard } from '../../components'
import { useBooking } from '../../state'
import { apiGetAllDoctors } from '../../data'
import { doctorPath, PATHS } from '../../routes'
import type { Doctor } from '../../types'

type SortOption = 'name' | 'rating' | 'distance'

const sortOptionLabels: Record<SortOption, string> = {
  name: 'nameAZ',
  rating: 'highestRated',
  distance: 'nearest',
}

export default function DoctorSearchScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { selectDoctor } = useBooking()

  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('rating')
  const [showSortMenu, setShowSortMenu] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiGetAllDoctors()
      .then((data) => setDoctors(data))
      .finally(() => setLoading(false))
  }, [])

  // Filter doctors by search query (name or specialty)
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors

    const query = searchQuery.toLowerCase().trim()
    return doctors.filter((doctor) => {
      const nameMatch = doctor.name.toLowerCase().includes(query)
      const specialtyMatch = doctor.specialty.toLowerCase().includes(query)
      return nameMatch || specialtyMatch
    })
  }, [doctors, searchQuery])

  // Sort doctors
  const sortedDoctors = useMemo(() => {
    return [...filteredDoctors].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          // Mock distance based on doctor ID
          const distA = parseFloat(a.id.replace('d', '')) * 0.7 + 0.8
          const distB = parseFloat(b.id.replace('d', '')) * 0.7 + 0.8
          return distA - distB
        default:
          return 0
      }
    })
  }, [filteredDoctors, sortBy])

  const handleBack = () => {
    navigate(PATHS.BOOKING)
  }

  const handleSelectDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorPath(doctor.id))
  }

  const handleSortChange = (option: SortOption) => {
    setSortBy(option)
    setShowSortMenu(false)
  }

  return (
    <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-cream-300">
        <div className="flex h-full items-center justify-between px-4">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
            aria-label={t('back')}
          >
            <IconArrowLeft size={20} stroke={2} className="text-slate-600" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-charcoal-500">{t('searchDoctor')}</h1>

          {/* Spacer */}
          <div className="w-10" />
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-cream-300">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" size={20} stroke={2} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchDoctorByName')}
            className="w-full pl-10 pr-10 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm text-charcoal-500 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600"
              aria-label={t('clearSearch')}
            >
              <IconX size={16} stroke={2} />
            </button>
          )}
        </div>
      </div>

      {/* Sort Selector Row */}
      <div className="sticky top-[57px] z-10 bg-cream-100 border-b border-cream-300">
        <div className="px-4 py-2.5">
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 text-sm text-slate-600"
            >
              <span>{t('sortBy')}:</span>
              <span className="font-medium text-charcoal-500">{t(sortOptionLabels[sortBy])}</span>
              <IconChevronDown size={16} stroke={2} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Sort dropdown */}
            {showSortMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-cream-300 py-1 min-w-[160px] z-20">
                {(['rating', 'name', 'distance'] as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-cream-100 ${
                      sortBy === option ? 'text-teal-600 font-medium' : 'text-slate-600'
                    }`}
                  >
                    {t(sortOptionLabels[option])}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-slate-500 mt-1">
            {loading ? t('searching') : `${sortedDoctors.length} ${sortedDoctors.length !== 1 ? t('doctorsFound') : t('doctorFound')}`}
          </p>
        </div>
      </div>

      {/* Doctor List */}
      <div className="px-4 py-4 pb-24">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-neutral-100"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-cream-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-4 bg-cream-200 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-cream-200 rounded animate-pulse" />
                    <div className="w-20 h-3 bg-cream-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">{t('noDoctorsFound')}</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-sm text-teal-600 hover:underline"
              >
                {t('clearSearch')}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                showSlots={false}
                onSelectDoctor={() => handleSelectDoctor(doctor)}
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}

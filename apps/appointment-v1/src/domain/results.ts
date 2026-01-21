import type { Doctor, InsuranceType, LanguageCode } from './types'
import { specialtyMatches } from './search'

export type SortKey = 'soonest' | 'distance' | 'rating'

export type ResultsFilters = {
  maxDistanceKm: number
  minRating: number
  videoOnly: boolean
  language?: LanguageCode
  /** Business intent: BOOK-003 “Nur Kassenärzte” toggle. */
  gkvOnly: boolean
}

export function getDefaultFilters(): ResultsFilters {
  return {
    maxDistanceKm: 10,
    minRating: 0,
    videoOnly: false,
    language: undefined,
    gkvOnly: true,
  }
}

export function filterDoctors(params: {
  doctors: Doctor[]
  specialtyQuery: string
  insurance: InsuranceType
  filters: ResultsFilters
}): { visible: Doctor[]; blockedByInsurance: Doctor[] } {
  const { doctors, specialtyQuery, insurance, filters } = params

  const specialtyFiltered = doctors.filter((d) => specialtyMatches(specialtyQuery, d.specialty))

  const blockedByInsurance =
    insurance === 'GKV' && filters.gkvOnly
      ? specialtyFiltered.filter((d) => d.insurance === 'Privat')
      : []

  const insuranceFiltered =
    insurance === 'GKV' && filters.gkvOnly
      ? specialtyFiltered.filter((d) => d.insurance !== 'Privat')
      : specialtyFiltered

  const filtered = insuranceFiltered.filter((d) => {
    if (d.distanceKm > filters.maxDistanceKm) return false
    if (d.ratingAverage < filters.minRating) return false
    if (filters.videoOnly && !d.videoAvailable) return false
    if (filters.language && !d.languages.includes(filters.language)) return false
    return true
  })

  return { visible: filtered, blockedByInsurance }
}

export function sortDoctors(doctors: Doctor[], sort: SortKey) {
  const copy = [...doctors]
  if (sort === 'distance') return copy.sort((a, b) => a.distanceKm - b.distanceKm)
  if (sort === 'rating') return copy.sort((a, b) => b.ratingAverage - a.ratingAverage)
  return copy.sort((a, b) => {
    /**
     * Business intent: “Soonest” should reflect earliest available slot per doctor (BOOK-005),
     * while still behaving deterministically in the prototype.
     *
     * When slot info is missing, we push the doctor later rather than guessing.
     */
    const aISO = a.__nextSlotStartISO ?? null
    const bISO = b.__nextSlotStartISO ?? null
    if (aISO && bISO) return aISO.localeCompare(bISO)
    if (aISO && !bISO) return -1
    if (!aISO && bISO) return 1
    return a.distanceKm - b.distanceKm
  })
}


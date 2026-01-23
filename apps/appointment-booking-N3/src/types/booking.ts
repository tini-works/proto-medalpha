import type { InsuranceType } from './user'

export interface Doctor {
  id: string
  name: string
  specialty: string
  city: string
  address: string
  rating: number
  reviewCount: number
  accepts: InsuranceType[]
  nextAvailableISO: string
  imageUrl?: string
  about?: string
  languages: string[]
}

export interface Store {
  id: string
  name: string
  type: 'dm' | 'pharmacy'
  address: string
  city: string
  openNow: boolean
  distanceKm: number
  services: string[]
}

export interface TimeSlot {
  dateISO: string
  time: string
  available: boolean
}

export interface Appointment {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  storeId?: string
  dateISO: string
  time: string
  forUserId: string
  forUserName: string
  status: 'confirmed' | 'completed' | 'cancelled'
  reminderSet: boolean
  calendarSynced: boolean
}

export interface SearchFilters {
  specialty: string
  city: string
  insuranceType: InsuranceType | ''
  includeStores: boolean
  radius?: number
}

export interface BookingState {
  currentSearch: SearchFilters | null
  selectedDoctor: Doctor | null
  selectedSlot: TimeSlot | null
  selectedFamilyMemberId: string | null
}

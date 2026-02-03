import type { InsuranceChoice, InsuranceType } from './user'

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

// Availability slot for specialty-first booking flow
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri'
export type TimeRange = 'morning' | 'afternoon' | 'evening'

export interface AvailabilitySlot {
  day: DayOfWeek
  timeRange: TimeRange
}

export interface AvailabilityPrefs {
  fullyFlexible: boolean
  slots: AvailabilitySlot[]
}

export type BookingType = 'fast_lane' | 'by_specialty' | 'by_doctor'

export interface MatchingRequest {
  symptom?: string
  requestedAt: string
  city: string
  insuranceType: InsuranceType
  // For specialty-first flow
  selectedDoctorId?: string
  availabilitySlots?: AvailabilitySlot[]
  fullyFlexible?: boolean
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
  createdAt?: string
  updatedAt?: string
  feedbackRating?: number
  feedbackComment?: string
  feedbackDismissed?: boolean
  feedbackSubmittedAt?: string
  cancelReason?: string
  status:
    | 'matching'
    | 'await_confirm'
    | 'confirmed'
    | 'completed'
    | 'cancelled_patient'
    | 'cancelled_doctor'
  reminderSet: boolean
  calendarSynced: boolean
  bookingType?: BookingType
  matchingRequest?: MatchingRequest
}

export interface SearchFilters {
  specialty: string
  city: string
  insuranceType: InsuranceType | ''
  includeStores: boolean
  radius?: number
  visitType?: 'in_clinic' | 'home_visit'
  urgency?: 'routine' | 'urgent'
  onlyPublic?: boolean
  minRating?: number
  languages?: string[]
  sortBy?: 'earliest' | 'rating' | 'distance'
  // Availability constraints for specialty-first flow
  fullyFlexible?: boolean
  availabilitySlots?: AvailabilitySlot[]
}

export interface BookingState {
  currentSearch: SearchFilters | null
  selectedDoctor: Doctor | null
  selectedSlot: TimeSlot | null
  selectedFamilyMemberId: string | null
  // Availability preferences for specialty-first flow
  availabilityPrefs: AvailabilityPrefs | null
}

// Reschedule flow types
export interface RescheduleContext {
  originalAppointment: Appointment
  suggestedSlots: SuggestedSlot[]
  selectedNewSlot: TimeSlot | null
  reason?: 'conflict' | 'earlier' | 'later' | 'other'
}

export interface SuggestedSlot extends TimeSlot {
  reason: 'same_time' | 'similar_time' | 'soonest' | 'same_weekday'
  reasonLabel: string
}

// Book Again flow types
export interface BookAgainContext {
  sourceAppointmentId: string
  sourceDate: string
  doctor: Doctor
  location: {
    city: string
    postalCode: string
  }
  insurance: {
    type: InsuranceChoice | ''
  }
  patient: {
    id: string
    name: string
    relationship: 'self' | 'child'
  }
}

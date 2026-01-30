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

export interface FavoriteDoctor {
  doctorId: string
  doctorName: string
  specialty: string
  city: string
  lastBookedAt: string
}

export interface FavoritesState {
  doctors: FavoriteDoctor[]
}

export interface Feedback {
  id: string
  appointmentId: string
  rating: number
  comment: string
  createdAt: string
}

export interface FeedbackRequest {
  id: string
  appointmentId: string
  doctorId: string
  doctorName: string
  specialty: string
  dateISO: string
  time: string
  forUserName: string
  scheduledAt: string
  sent: boolean
}

export interface FeedbackState {
  feedbacks: Feedback[]
  requests: FeedbackRequest[]
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

export interface TimeSlot {
  dateISO: string
  time: string
  available: boolean
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
  fullyFlexible?: boolean
  availabilitySlots?: AvailabilitySlot[]
}

export interface BookingState {
  currentSearch: SearchFilters | null
  selectedDoctor: Doctor | null
  selectedSlot: TimeSlot | null
  selectedFamilyMemberId: string | null
  availabilityPrefs: AvailabilityPrefs | null
}

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

export type InsuranceType = 'GKV' | 'PKV'

export type LanguageCode = 'de' | 'en' | 'tr' | 'ar' | 'ru'

export type Doctor = {
  id: string
  name: string
  specialty: string
  address: {
    street: string
    city: string
    postalCode: string
    country: 'DE'
  }
  distanceKm: number
  ratingAverage: number
  ratingCount: number
  insurance: 'Kasse' | 'Privat' | 'Beides'
  videoAvailable: boolean
  languages: LanguageCode[]
  about: string
  services: { title: string; description: string }[]
  /**
   * Business intent: allow results sorting by “soonest” using generated/cached slots
   * without introducing a parallel view-model type (BOOK-005).
   */
  __nextSlotStartISO?: string
}

export type Review = {
  id: string
  doctorId: string
  rating: 1 | 2 | 3 | 4 | 5
  dateISO: string
  text: string
}

export type AppointmentSlot = {
  id: string
  doctorId: string
  /** ISO start timestamp in local time zone representation. */
  startISO: string
  durationMin: 15 | 30
  appointmentType: 'In-person'
}

export type PatientProfile = {
  id: string
  displayName: string
  insurance: InsuranceType
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export type Booking = {
  id: string
  doctorId: string
  patientId: string
  slot: AppointmentSlot
  status: BookingStatus
  createdAtISO: string
  confirmationNumber: string
  reason?: string
  /**
   * Business intent: link rescheduled bookings so history/details can explain
   * that a new appointment replaced an old one (BOOK-017).
   */
  replacesBookingId?: string
}


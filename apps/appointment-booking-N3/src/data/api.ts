// Simulated API delay helper

export function simulateApiDelay<T>(data: T, delayMs = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs))
}

export function simulateApiError(message: string, delayMs = 300): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delayMs))
}

// Simulated API functions with delays
export async function apiSearchDoctors(
  filters: { specialty?: string; city?: string; insuranceType?: 'GKV' | 'PKV' | '' },
  delayMs = 500
) {
  const { searchDoctors, doctors } = await import('./doctors')
  let results = searchDoctors(filters)

  // Ensure 2-3 results for mock UI consistency
  if (results.length < 2) {
    const fallback = doctors.filter((d) => !results.some((r) => r.id === d.id))
    results = results.concat(fallback.slice(0, 2 - results.length))
  }

  if (results.length > 3) {
    results = results.slice(0, 3)
  }

  return simulateApiDelay(results, delayMs)
}

export async function apiGetDoctor(id: string, delayMs = 300) {
  const { getDoctorById } = await import('./doctors')
  const doctor = getDoctorById(id)
  if (!doctor) {
    return simulateApiError('Doctor not found', delayMs)
  }
  return simulateApiDelay(doctor, delayMs)
}

export async function apiGetAllDoctors(delayMs = 500) {
  const { doctors } = await import('./doctors')
  return simulateApiDelay(doctors, delayMs)
}

export async function apiGetTimeSlots(doctorId: string, delayMs = 400) {
  const { getTimeSlots } = await import('./timeSlots')
  const slots = getTimeSlots(doctorId)
  return simulateApiDelay(slots, delayMs)
}

export async function apiGetAvailableDates(doctorId: string, delayMs = 300) {
  const { getAvailableDates } = await import('./timeSlots')
  const dates = getAvailableDates(doctorId)
  return simulateApiDelay(dates, delayMs)
}

export async function apiGetSlotsForDate(doctorId: string, dateISO: string, delayMs = 300) {
  const { getSlotsForDate } = await import('./timeSlots')
  const slots = getSlotsForDate(doctorId, dateISO)
  return simulateApiDelay(slots, delayMs)
}

export async function apiSearchStores(filters: { city?: string; type?: 'dm' | 'pharmacy' }, delayMs = 400) {
  const { searchStores } = await import('./stores')
  const results = searchStores(filters)
  return simulateApiDelay(results, delayMs)
}

export async function apiGetCMSContent(insuranceType?: 'GKV' | 'PKV' | '', delayMs = 300) {
  const { getActiveCMSContent } = await import('./cms')
  const content = getActiveCMSContent(insuranceType)
  return simulateApiDelay(content, delayMs)
}

// Reschedule API functions
export async function apiGetSuggestedSlots(
  doctorId: string,
  originalAppointment: {
    dateISO: string
    time: string
    doctorId: string
    doctorName: string
    specialty: string
    forUserId: string
    forUserName: string
    status:
      | 'matching'
      | 'await_confirm'
      | 'confirmed'
      | 'completed'
      | 'cancelled_patient'
      | 'cancelled_doctor'
    id: string
    reminderSet: boolean
    calendarSynced: boolean
  },
  delayMs = 400
) {
  const { getSuggestedSlots } = await import('./timeSlots')
  const slots = getSuggestedSlots(doctorId, originalAppointment)
  return simulateApiDelay(slots, delayMs)
}

export async function apiRescheduleAppointment(
  _oldAppointmentId: string,
  _newSlot: { dateISO: string; time: string },
  delayMs = 500
) {
  // Simulate successful reschedule
  // In production: book new slot, then cancel old slot
  const confirmationNumber = `RSCH-${Date.now().toString(36).toUpperCase()}`
  return simulateApiDelay({ success: true, confirmationNumber }, delayMs)
}

export async function apiCancelAppointment(_appointmentId: string, delayMs = 400) {
  // Simulate successful cancellation
  return simulateApiDelay({ success: true }, delayMs)
}

// Fast-Lane matching types
export interface FastLaneRequest {
  specialty: string
  symptom?: string
  city: string
  insuranceType: 'GKV' | 'PKV'
  patientId: string
  patientName: string
}

type MatchingStatus = 'searching' | 'found_doctors' | 'checking_availability' | 'awaiting_confirmation'

export interface FastLaneMatchResult {
  success: boolean
  appointment?: {
    id: string
    doctorId: string
    doctorName: string
    specialty: string
    dateISO: string
    time: string
    forUserId: string
    forUserName: string
    createdAt: string
    status: 'confirmed'
    reminderSet: boolean
    calendarSynced: boolean
    bookingType: 'fast_lane'
    matchingRequest: {
      symptom?: string
      requestedAt: string
      city: string
      insuranceType: 'GKV' | 'PKV'
    }
  }
}

export async function apiFastLaneMatch(
  request: FastLaneRequest,
  onStatusChange?: (status: MatchingStatus, doctorCount?: number) => void
): Promise<FastLaneMatchResult> {
  const startedAt = Date.now()
  const ensureMinTotalDuration = async (totalMs: number) => {
    const elapsed = Date.now() - startedAt
    const remaining = totalMs - elapsed
    if (remaining > 0) {
      await simulateApiDelay(null, remaining)
    }
  }

  const { searchDoctors, getDoctorById } = await import('./doctors')
  const { getSlotsForDate } = await import('./timeSlots')

  // Step 1: Searching (1-2 seconds)
  onStatusChange?.('searching')
  await simulateApiDelay(null, 1500)

  // Find matching doctors
  const matchingDoctors = searchDoctors({
    specialty: request.specialty,
    city: request.city,
    insuranceType: request.insuranceType,
  })

  if (matchingDoctors.length === 0) {
    // Minimum dwell time for no-match so the matching screen feels realistic
    await simulateApiDelay(null, 60000)
    return { success: false }
  }

  // Step 2: Found doctors (1 second)
  onStatusChange?.('found_doctors', matchingDoctors.length)
  await simulateApiDelay(null, 1000)

  // Step 3: Checking availability (1.5 seconds)
  onStatusChange?.('checking_availability')
  await simulateApiDelay(null, 1500)

  // Step 4: Awaiting confirmation (1-2 seconds)
  onStatusChange?.('awaiting_confirmation')
  await simulateApiDelay(null, 1500)

  // ~90% success rate
  const isSuccessful = Math.random() < 0.9

  if (!isSuccessful) {
    // Doctors matched + random fail: keep matching page visible for ~40s total.
    await ensureMinTotalDuration(40000)
    return { success: false }
  }

  // Pick a random doctor from matches
  const selectedDoctor = matchingDoctors[Math.floor(Math.random() * matchingDoctors.length)]
  const doctor = getDoctorById(selectedDoctor.id)

  if (!doctor) {
    return { success: false }
  }

  // Get available slots for the next few days
  const today = new Date()
  let selectedSlot: { dateISO: string; time: string } | null = null

  for (let i = 0; i < 7 && !selectedSlot; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateISO = date.toISOString().split('T')[0]
    const slots = getSlotsForDate(doctor.id, dateISO)
    const availableSlots = slots.filter((s) => s.available)

    if (availableSlots.length > 0) {
      const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)]
      selectedSlot = { dateISO: slot.dateISO, time: slot.time }
    }
  }

  if (!selectedSlot) {
    return { success: false }
  }

  // Create the appointment
  const appointment = {
    id: `FL-${Date.now().toString(36).toUpperCase()}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: request.specialty,
    dateISO: selectedSlot.dateISO,
    time: selectedSlot.time,
    forUserId: request.patientId,
    forUserName: request.patientName,
    createdAt: new Date().toISOString(),
    status: 'confirmed' as const,
    reminderSet: false,
    calendarSynced: false,
    bookingType: 'fast_lane' as const,
    matchingRequest: {
      symptom: request.symptom,
      requestedAt: new Date().toISOString(),
      city: request.city,
      insuranceType: request.insuranceType,
    },
  }

  // Doctors matched + success: keep matching page visible for ~30s total.
  await ensureMinTotalDuration(30000)
  return { success: true, appointment }
}

// Specialty-first matching types
export interface SpecialtyMatchRequest {
  specialty: string
  city: string
  insuranceType: 'GKV' | 'PKV'
  doctorId: string
  doctorName: string
  availabilityPrefs: {
    fullyFlexible: boolean
    slots: Array<{ day: string; timeRange: string }>
  }
  patientId: string
  patientName: string
}

export interface SpecialtyMatchResult {
  success: boolean
  appointment?: {
    id: string
    doctorId: string
    doctorName: string
    specialty: string
    dateISO: string
    time: string
    forUserId: string
    forUserName: string
    createdAt: string
    status: 'confirmed'
    reminderSet: boolean
    calendarSynced: boolean
    bookingType: 'by_specialty'
    matchingRequest: {
      selectedDoctorId: string
      requestedAt: string
      city: string
      insuranceType: 'GKV' | 'PKV'
      fullyFlexible?: boolean
    }
  }
}

export async function apiSpecialtyMatch(
  request: SpecialtyMatchRequest,
  onStatusChange?: (status: MatchingStatus, doctorCount?: number) => void
): Promise<SpecialtyMatchResult> {
  const { getDoctorById } = await import('./doctors')
  const { getSlotsForDate } = await import('./timeSlots')

  // Step 1: Checking with doctor (1 second)
  onStatusChange?.('searching')
  await simulateApiDelay(null, 1000)

  // Verify doctor exists
  const doctor = getDoctorById(request.doctorId)
  if (!doctor) {
    return { success: false }
  }

  // Step 2: Checking availability (1.5 seconds)
  onStatusChange?.('checking_availability')
  await simulateApiDelay(null, 1500)

  // Step 3: Awaiting confirmation (1-2 seconds)
  onStatusChange?.('awaiting_confirmation')
  await simulateApiDelay(null, 1500)

  // ~95% success rate for specialty flow (higher since user selected specific doctor)
  const isSuccessful = Math.random() < 0.95

  if (!isSuccessful) {
    return { success: false }
  }

  // Map availability preferences to actual time ranges
  const timeRangeToHours: Record<string, [number, number]> = {
    morning: [7, 12],
    afternoon: [12, 15],
    evening: [15, 19],
  }

  // Get available slots for the next 14 days
  const today = new Date()
  let selectedSlot: { dateISO: string; time: string } | null = null

  for (let i = 0; i < 14 && !selectedSlot; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateISO = date.toISOString().split('T')[0]
    const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()]

    // Skip weekends
    if (dayOfWeek === 'sun' || dayOfWeek === 'sat') continue

    const slots = getSlotsForDate(doctor.id, dateISO)
    const availableSlots = slots.filter((s) => s.available)

    // If fully flexible, pick any available slot
    if (request.availabilityPrefs.fullyFlexible) {
      if (availableSlots.length > 0) {
        const slot = availableSlots[Math.floor(Math.random() * availableSlots.length)]
        selectedSlot = { dateISO: slot.dateISO, time: slot.time }
      }
      continue
    }

    // Check if this day matches user's availability preferences
    const matchingDayPrefs = request.availabilityPrefs.slots.filter((s) => s.day === dayOfWeek)
    if (matchingDayPrefs.length === 0) continue

    // Filter slots by time range
    const matchingSlots = availableSlots.filter((slot) => {
      const slotHour = parseInt(slot.time.split(':')[0], 10)
      return matchingDayPrefs.some((pref) => {
        const [start, end] = timeRangeToHours[pref.timeRange] || [0, 24]
        return slotHour >= start && slotHour < end
      })
    })

    if (matchingSlots.length > 0) {
      const slot = matchingSlots[Math.floor(Math.random() * matchingSlots.length)]
      selectedSlot = { dateISO: slot.dateISO, time: slot.time }
    }
  }

  if (!selectedSlot) {
    return { success: false }
  }

  // Create the appointment
  const appointment = {
    id: `SP-${Date.now().toString(36).toUpperCase()}`,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: request.specialty,
    dateISO: selectedSlot.dateISO,
    time: selectedSlot.time,
    forUserId: request.patientId,
    forUserName: request.patientName,
    createdAt: new Date().toISOString(),
    status: 'confirmed' as const,
    reminderSet: false,
    calendarSynced: false,
    bookingType: 'by_specialty' as const,
    matchingRequest: {
      selectedDoctorId: request.doctorId,
      requestedAt: new Date().toISOString(),
      city: request.city,
      insuranceType: request.insuranceType,
      fullyFlexible: request.availabilityPrefs.fullyFlexible,
    },
  }

  return { success: true, appointment }
}

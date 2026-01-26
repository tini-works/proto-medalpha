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
  const { searchDoctors } = await import('./doctors')
  const results = searchDoctors(filters)
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
  originalAppointment: { dateISO: string; time: string; doctorId: string; doctorName: string; specialty: string; forUserId: string; forUserName: string; status: 'confirmed' | 'completed' | 'cancelled'; id: string; reminderSet: boolean; calendarSynced: boolean },
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

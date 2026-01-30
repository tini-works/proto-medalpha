import type { TimeSlot, SuggestedSlot, Appointment } from '../types'

// Generate time slots for the next 14 days
function generateSlots(doctorId: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = new Date()

  // Use doctor ID to create some variation in availability
  const seed = parseInt(doctorId.replace('d', ''), 10) || 1

  for (let day = 1; day <= 14; day++) {
    const date = new Date(today)
    date.setDate(today.getDate() + day)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const dateISO = date.toISOString().split('T')[0]

    // Morning slots
    const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
    // Afternoon slots
    const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

    const allTimes = [...morningTimes, ...afternoonTimes]

    allTimes.forEach((time, index) => {
      // Create some unavailable slots based on day and doctor
      const isAvailable = (day + index + seed) % 4 !== 0

      slots.push({
        dateISO,
        time,
        available: isAvailable,
      })
    })
  }

  return slots
}

// Pre-generate slots for all doctors
const slotsByDoctorId: Record<string, TimeSlot[]> = {
  d1: generateSlots('d1'),
  d2: generateSlots('d2'),
  d3: generateSlots('d3'),
  d4: generateSlots('d4'),
  d5: generateSlots('d5'),
  d6: generateSlots('d6'),
  d7: generateSlots('d7'),
  d8: generateSlots('d8'),
}

export function getTimeSlots(doctorId: string): TimeSlot[] {
  return slotsByDoctorId[doctorId] || generateSlots(doctorId)
}

export function getAvailableDates(doctorId: string): string[] {
  const slots = getTimeSlots(doctorId)
  const dates = new Set<string>()

  slots.forEach((slot) => {
    if (slot.available) {
      dates.add(slot.dateISO)
    }
  })

  return Array.from(dates).sort()
}

export function getSlotsForDate(doctorId: string, dateISO: string): TimeSlot[] {
  const slots = getTimeSlots(doctorId)
  return slots.filter((slot) => slot.dateISO === dateISO)
}

/**
 * Get suggested slots for rescheduling an appointment
 * Priority order:
 * 1. Same time, nearest day ("Gleiche Uhrzeit")
 * 2. Similar time ±2 hours ("Ähnliche Uhrzeit")
 * 3. Soonest available ("Nächster Termin")
 * 4. Same day of week ("Gleicher Wochentag")
 */
export function getSuggestedSlots(
  doctorId: string,
  originalAppointment: Appointment,
  limit: number = 5
): SuggestedSlot[] {
  const allSlots = getTimeSlots(doctorId)
  const availableSlots = allSlots.filter(
    (slot) =>
      slot.available &&
      // Exclude the original slot
      !(slot.dateISO === originalAppointment.dateISO && slot.time === originalAppointment.time)
  )

  const suggestions: SuggestedSlot[] = []
  const usedSlotKeys = new Set<string>()

  const getSlotKey = (slot: TimeSlot) => `${slot.dateISO}_${slot.time}`
  const originalTime = originalAppointment.time
  const originalDate = new Date(originalAppointment.dateISO)
  const originalDayOfWeek = originalDate.getDay()

  // Parse time to minutes for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  const originalMinutes = timeToMinutes(originalTime)

  // Priority 1: Same time, nearest day
  const sameTimeSlots = availableSlots
    .filter((slot) => slot.time === originalTime)
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    .slice(0, 2)

  sameTimeSlots.forEach((slot) => {
    const key = getSlotKey(slot)
    if (!usedSlotKeys.has(key)) {
      usedSlotKeys.add(key)
      suggestions.push({
        ...slot,
        reason: 'same_time',
        reasonLabel: 'Same time',
      })
    }
  })

  // Priority 2: Similar time (±2 hours / 120 minutes)
  const similarTimeSlots = availableSlots
    .filter((slot) => {
      const slotMinutes = timeToMinutes(slot.time)
      const diff = Math.abs(slotMinutes - originalMinutes)
      return diff > 0 && diff <= 120 && slot.time !== originalTime
    })
    .sort((a, b) => {
      // Sort by time difference first, then by date
      const aDiff = Math.abs(timeToMinutes(a.time) - originalMinutes)
      const bDiff = Math.abs(timeToMinutes(b.time) - originalMinutes)
      if (aDiff !== bDiff) return aDiff - bDiff
      return new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
    })
    .slice(0, 2)

  similarTimeSlots.forEach((slot) => {
    const key = getSlotKey(slot)
    if (!usedSlotKeys.has(key)) {
      usedSlotKeys.add(key)
      suggestions.push({
        ...slot,
        reason: 'similar_time',
        reasonLabel: 'Similar time',
      })
    }
  })

  // Priority 3: Soonest available
  const soonestSlots = availableSlots
    .sort((a, b) => {
      const dateCompare = new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime()
      if (dateCompare !== 0) return dateCompare
      return timeToMinutes(a.time) - timeToMinutes(b.time)
    })
    .slice(0, 3)

  soonestSlots.forEach((slot) => {
    const key = getSlotKey(slot)
    if (!usedSlotKeys.has(key)) {
      usedSlotKeys.add(key)
      suggestions.push({
        ...slot,
        reason: 'soonest',
        reasonLabel: 'Soonest available',
      })
    }
  })

  // Priority 4: Same day of week
  const sameDaySlots = availableSlots
    .filter((slot) => new Date(slot.dateISO).getDay() === originalDayOfWeek)
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime())
    .slice(0, 2)

  sameDaySlots.forEach((slot) => {
    const key = getSlotKey(slot)
    if (!usedSlotKeys.has(key)) {
      usedSlotKeys.add(key)
      suggestions.push({
        ...slot,
        reason: 'same_weekday',
        reasonLabel: 'Same weekday',
      })
    }
  })

  // Return limited results
  return suggestions.slice(0, limit)
}

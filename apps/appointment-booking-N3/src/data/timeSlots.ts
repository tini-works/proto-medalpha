import type { TimeSlot } from '../types'

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

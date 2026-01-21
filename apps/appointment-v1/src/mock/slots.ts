import type { AppointmentSlot } from '../domain/types'

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function makeSlotId(doctorId: string, startISO: string) {
  return `slot_${doctorId}_${startISO}`
}

/**
 * Business intent: create deterministic week slots for the prototype
 * without depending on any external API.
 */
export function generateWeekSlots(params: {
  doctorId: string
  weekStartISO: string // yyyy-mm-dd (Mon)
  days: number
  startHour: number
  endHour: number
  durationMin: 15 | 30
  cadenceMin: 15 | 30
}): AppointmentSlot[] {
  const { doctorId, weekStartISO, days, startHour, endHour, durationMin, cadenceMin } =
    params

  const base = new Date(`${weekStartISO}T00:00:00`)
  const slots: AppointmentSlot[] = []

  for (let d = 0; d < days; d++) {
    const day = new Date(base)
    day.setDate(base.getDate() + d)

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += cadenceMin) {
        const start = new Date(day)
        start.setHours(hour, minute, 0, 0)

        // Business intent: keep some “unavailable” gaps; UI will show disabled slots.
        const isGap = hour === 12 && minute < 30
        if (isGap) continue

        const startISO = `${start.getFullYear()}-${pad2(
          start.getMonth() + 1,
        )}-${pad2(start.getDate())}T${pad2(start.getHours())}:${pad2(
          start.getMinutes(),
        )}:00`

        slots.push({
          id: makeSlotId(doctorId, startISO),
          doctorId,
          startISO,
          durationMin,
          appointmentType: 'In-person',
        })
      }
    }
  }

  return slots
}


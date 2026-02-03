import type { TimeSlot } from '../../types'

const toSlotTimestamp = (slot: TimeSlot): number => {
  return new Date(`${slot.dateISO}T${slot.time}`).getTime()
}

export function pickNextAvailableSlot(slots: TimeSlot[]): TimeSlot | null {
  const now = Date.now()

  const availableSlots = slots
    .filter((slot) => slot.available)
    .sort((a, b) => toSlotTimestamp(a) - toSlotTimestamp(b))

  if (availableSlots.length === 0) return null

  const upcomingSlot = availableSlots.find((slot) => toSlotTimestamp(slot) >= now)
  return upcomingSlot ?? availableSlots[0]
}

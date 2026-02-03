import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pickNextAvailableSlot } from '../quickRebook'
import type { TimeSlot } from '../../../types'

const slot = (dateISO: string, time: string, available: boolean): TimeSlot => ({
  dateISO,
  time,
  available,
})

describe('pickNextAvailableSlot', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null when no available slots exist', () => {
    const slots = [slot('2026-02-04', '09:00', false)]
    expect(pickNextAvailableSlot(slots)).toBeNull()
  })

  it('picks the earliest upcoming available slot', () => {
    vi.setSystemTime(new Date(2026, 1, 3, 12, 0, 0))

    const slots = [
      slot('2026-02-03', '10:00', true),
      slot('2026-02-03', '12:30', true),
      slot('2026-02-03', '13:00', true),
      slot('2026-02-04', '09:00', true),
    ]

    const nextSlot = pickNextAvailableSlot(slots)
    expect(nextSlot).toEqual(slot('2026-02-03', '12:30', true))
  })

  it('falls back to the earliest available slot when all are in the past', () => {
    vi.setSystemTime(new Date(2026, 1, 5, 9, 0, 0))

    const slots = [
      slot('2026-02-03', '14:00', true),
      slot('2026-02-04', '09:00', true),
    ]

    const nextSlot = pickNextAvailableSlot(slots)
    expect(nextSlot).toEqual(slot('2026-02-03', '14:00', true))
  })
})

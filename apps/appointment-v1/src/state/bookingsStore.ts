import type { Booking } from '../domain/types'
import { readJson, writeJson } from './storage'

const KEY = 'ab.bookings'

/**
 * Business intent: keep bookings persistent for management screens without a backend.
 */
export function readBookings(): Booking[] {
  const raw = readJson(KEY, [] as any) as any as Booking[]
  const nowISO = new Date().toISOString()

  /**
   * Business intent: show “completed” appointments in history without requiring
   * background jobs or server-side status updates (BOOK-018).
   */
  return raw.map((b) => {
    if (b.status !== 'confirmed') return b
    const isPast = b.slot.startISO < nowISO
    return isPast ? { ...b, status: 'completed' as const } : b
  })
}

export function writeBookings(bookings: Booking[]) {
  writeJson(KEY, bookings as any)
}


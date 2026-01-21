import type { Booking, BookingStatus, Doctor, PatientProfile } from './types'

function randomDigits(len: number) {
  let out = ''
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10)
  return out
}

export function makeConfirmationNumber() {
  // Business intent: visible “proof” of booking (BOOK-012).
  return `MA-${randomDigits(6)}`
}

export function makeBookingId() {
  return `book_${Date.now()}_${randomDigits(3)}`
}

export function summarizeCost(params: { doctor: Doctor; patient: PatientProfile }) {
  // Business intent: show clear cost info without payment infra (BOOK-011).
  if (params.patient.insurance === 'GKV' && params.doctor.insurance !== 'Privat') return 'Covered (Kassenleistung)'
  if (params.patient.insurance === 'PKV') return 'Private insurance (PKV)'
  return 'Self-pay: €89'
}

export function isBookingInPast(status: BookingStatus) {
  return status === 'completed' || status === 'cancelled'
}

export function sortBookingsSoonestFirst<T extends Booking>(bookings: T[]) {
  return [...bookings].sort((a, b) => a.slot.startISO.localeCompare(b.slot.startISO))
}


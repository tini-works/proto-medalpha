import type { Booking, Doctor, PatientProfile } from './types'

function icsEscape(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

/**
 * Business intent: provide a web-equivalent “Add to calendar” flow (BOOK-013)
 * without requiring native calendar integrations.
 */
export function makeIcs(params: { booking: Booking; doctor: Doctor; patient: PatientProfile }) {
  const { booking, doctor, patient } = params
  const start = new Date(booking.slot.startISO)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + booking.slot.durationMin)

  // ICS requires UTC timestamps for broad compatibility.
  const dtStart = start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
  const dtEnd = end.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')

  const summary = `Appointment: ${doctor.specialty}`
  const location = `${doctor.address.street}, ${doctor.address.postalCode} ${doctor.address.city}`
  const descriptionLines = [
    `Confirmation: ${booking.confirmationNumber}`,
    `Patient: ${patient.displayName}`,
    booking.reason ? `Reason: ${booking.reason}` : undefined,
    'Powered by Curaay',
  ].filter(Boolean) as string[]

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MedAlpha//Appointment V1//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${icsEscape(booking.id)}@medalpha`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${icsEscape(summary)}`,
    `LOCATION:${icsEscape(location)}`,
    `DESCRIPTION:${icsEscape(descriptionLines.join('\\n'))}`,
    /**
     * Business intent: simulate default calendar reminders (BOOK-013) in the most
     * interoperable way for a web download (VALARM).
     */
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(`Reminder: ${summary}`)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(`Reminder: ${summary}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n')
}


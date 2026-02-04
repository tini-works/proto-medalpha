/**
 * Test fixtures for appointment-related scenarios.
 * Used across integration and contract tests.
 */

import type { Appointment } from '../../../types'

const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const nextWeek = new Date(today)
nextWeek.setDate(nextWeek.getDate() + 7)
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)

const formatDate = (d: Date) => d.toISOString().slice(0, 10)

/**
 * Confirmed appointment for tomorrow.
 */
export const confirmedAppointment: Appointment = {
  id: 'apt-confirmed-1',
  doctorId: 'd1',
  doctorName: 'Dr. Sarah Weber',
  specialty: 'Dermatology',
  dateISO: formatDate(tomorrow),
  time: '09:30',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'confirmed',
  reminderSet: true,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 86400000).toISOString(),
  updatedAt: new Date(today.getTime() - 3600000).toISOString(),
}

/**
 * Appointment awaiting confirmation.
 */
export const awaitConfirmAppointment: Appointment = {
  id: 'apt-await-1',
  doctorId: 'd2',
  doctorName: 'Dr. Mark Fischer',
  specialty: 'Cardiology',
  dateISO: formatDate(nextWeek),
  time: '11:00',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'await_confirm',
  reminderSet: true,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 172800000).toISOString(),
  updatedAt: new Date(today.getTime() - 7200000).toISOString(),
}

/**
 * Appointment in matching state.
 */
export const matchingAppointment: Appointment = {
  id: 'apt-matching-1',
  doctorId: 'd3',
  doctorName: 'Dr. Lena Hoffmann',
  specialty: 'General Medicine',
  dateISO: formatDate(nextWeek),
  time: '10:15',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'matching',
  reminderSet: false,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 1800000).toISOString(),
  updatedAt: new Date(today.getTime() - 300000).toISOString(),
}

/**
 * Completed past appointment.
 */
export const completedAppointment: Appointment = {
  id: 'apt-completed-1',
  doctorId: 'd4',
  doctorName: 'Dr. Paul Schneider',
  specialty: 'ENT',
  dateISO: formatDate(yesterday),
  time: '08:45',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'completed',
  reminderSet: false,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 604800000).toISOString(),
  updatedAt: new Date(yesterday.getTime()).toISOString(),
}

/**
 * Appointment cancelled by patient.
 */
export const cancelledByPatientAppointment: Appointment = {
  id: 'apt-cancelled-patient-1',
  doctorId: 'd5',
  doctorName: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  dateISO: formatDate(yesterday),
  time: '10:30',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'cancelled_patient',
  reminderSet: false,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 432000000).toISOString(),
  updatedAt: new Date(today.getTime() - 259200000).toISOString(),
}

/**
 * Appointment cancelled by doctor.
 */
export const cancelledByDoctorAppointment: Appointment = {
  id: 'apt-cancelled-doctor-1',
  doctorId: 'd6',
  doctorName: 'Dr. Nina Bauer',
  specialty: 'Orthopedics',
  dateISO: formatDate(nextWeek),
  time: '14:00',
  forUserId: 'test-user-1',
  forUserName: 'Maria Schmidt',
  status: 'cancelled_doctor',
  reminderSet: false,
  calendarSynced: false,
  createdAt: new Date(today.getTime() - 345600000).toISOString(),
  updatedAt: new Date(today.getTime() - 86400000).toISOString(),
}

/**
 * Collection of all test appointments.
 */
export const allTestAppointments: Appointment[] = [
  confirmedAppointment,
  awaitConfirmAppointment,
  matchingAppointment,
  completedAppointment,
  cancelledByPatientAppointment,
  cancelledByDoctorAppointment,
]

/**
 * Active appointments (upcoming, not cancelled/completed).
 */
export const activeAppointments: Appointment[] = [
  confirmedAppointment,
  awaitConfirmAppointment,
  matchingAppointment,
]

/**
 * Past/inactive appointments.
 */
export const inactiveAppointments: Appointment[] = [
  completedAppointment,
  cancelledByPatientAppointment,
  cancelledByDoctorAppointment,
]

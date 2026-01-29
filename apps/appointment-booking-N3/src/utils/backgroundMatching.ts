import { apiFastLaneMatch, apiSpecialtyMatch } from '../data/api'
import type { FastLaneRequest, SpecialtyMatchRequest } from '../data/api'
import type { Appointment } from '../types'

type MatchType = 'fast_lane' | 'specialty'

interface BackgroundMatchOptions {
  appointmentId: string
  matchType: MatchType
  params: FastLaneRequest | SpecialtyMatchRequest
  onSuccess: (appointment: Partial<Appointment>) => void
  onFailure: (appointmentId: string) => void
}

/**
 * Runs the matching API in the background and updates the appointment when complete.
 * This is a fire-and-forget function - it doesn't block the UI.
 */
export function runBackgroundMatching(options: BackgroundMatchOptions): void {
  const { appointmentId, matchType, params, onSuccess, onFailure } = options

  // Run matching asynchronously without blocking
  ;(async () => {
    try {
      if (matchType === 'fast_lane') {
        const result = await apiFastLaneMatch(params as FastLaneRequest)

        if (result.success && result.appointment) {
          // Update with confirmed appointment data
          onSuccess({
            doctorId: result.appointment.doctorId,
            doctorName: result.appointment.doctorName,
            specialty: result.appointment.specialty,
            dateISO: result.appointment.dateISO,
            time: result.appointment.time,
            status: 'confirmed',
          })
        } else {
          onFailure(appointmentId)
        }
      } else {
        const result = await apiSpecialtyMatch(params as SpecialtyMatchRequest)

        if (result.success && result.appointment) {
          onSuccess({
            doctorId: result.appointment.doctorId,
            doctorName: result.appointment.doctorName,
            specialty: result.appointment.specialty,
            dateISO: result.appointment.dateISO,
            time: result.appointment.time,
            status: 'confirmed',
          })
        } else {
          onFailure(appointmentId)
        }
      }
    } catch (error) {
      console.error('Background matching failed:', error)
      onFailure(appointmentId)
    }
  })()
}

/**
 * Creates a placeholder appointment with 'matching' status
 */
export function createMatchingAppointment(params: {
  specialty: string
  patientId: string
  patientName: string
  doctorId?: string
  doctorName?: string
}): Appointment {
  return {
    id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    doctorId: params.doctorId || 'pending',
    doctorName: params.doctorName || 'Finding best match...',
    specialty: params.specialty,
    dateISO: new Date().toISOString().split('T')[0],
    time: 'TBD',
    forUserId: params.patientId,
    forUserName: params.patientName,
    status: 'matching',
    reminderSet: false,
    calendarSynced: false,
    createdAt: new Date().toISOString(),
  }
}

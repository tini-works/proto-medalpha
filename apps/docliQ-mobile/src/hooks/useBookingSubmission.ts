import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState, useBooking } from '../state'
import { createMatchingAppointment, runBackgroundMatching } from '../utils/backgroundMatching'
import type { AvailabilityPrefs, InsuranceType } from '../types'
import { PATHS } from '../routes'

interface FastLaneSubmitParams {
  specialty: string
  symptom?: string
  city: string
  insuranceType: InsuranceType
  patientId: string
  patientName: string
}

interface SpecialtySubmitParams {
  specialty: string
  city: string
  insuranceType: InsuranceType
  doctorId: string
  doctorName: string
  availabilityPrefs: AvailabilityPrefs
  patientId: string
  patientName: string
}

/**
 * Hook that encapsulates the booking submission logic shared between
 * CareRequestScreen (fast lane) and AvailabilityScreen (specialty/doctor-first).
 *
 * Handles:
 * 1. Storing request state for the confirmation screen
 * 2. Creating a placeholder appointment with 'matching' status
 * 3. Starting background matching (fire-and-forget)
 * 4. Navigating to the confirmation screen
 */
export function useBookingSubmission() {
  const navigate = useNavigate()
  const { setFastLaneRequest, setSpecialtyMatchRequest } = useBooking()
  const { addAppointment, updateAppointment, cancelAppointment } = useAppState()

  const submitFastLane = useCallback(
    (params: FastLaneSubmitParams) => {
      // Store request state for confirmation screen
      setFastLaneRequest({
        specialty: params.specialty,
        symptom: params.symptom,
        city: params.city,
        insuranceType: params.insuranceType,
        patientId: params.patientId,
        patientName: params.patientName,
      })

      // Create placeholder appointment with 'matching' status
      const appointment = createMatchingAppointment({
        specialty: params.specialty,
        patientId: params.patientId,
        patientName: params.patientName,
      })
      addAppointment(appointment)

      // Start background matching (fire-and-forget)
      runBackgroundMatching({
        appointmentId: appointment.id,
        matchType: 'fast_lane',
        params: {
          specialty: params.specialty,
          city: params.city,
          insuranceType: params.insuranceType,
          patientId: params.patientId,
          patientName: params.patientName,
          symptom: params.symptom,
        },
        onSuccess: (data) => updateAppointment(appointment.id, data),
        onFailure: () => cancelAppointment(appointment.id),
      })

      // Navigate immediately - don't wait for matching
      navigate(PATHS.BOOKING_REQUEST_SENT)
    },
    [navigate, setFastLaneRequest, addAppointment, updateAppointment, cancelAppointment]
  )

  const submitSpecialty = useCallback(
    (params: SpecialtySubmitParams) => {
      // Store request state for confirmation screen
      setSpecialtyMatchRequest({
        specialty: params.specialty,
        city: params.city,
        insuranceType: params.insuranceType,
        doctorId: params.doctorId,
        doctorName: params.doctorName,
        availabilityPrefs: params.availabilityPrefs,
        patientId: params.patientId,
        patientName: params.patientName,
      })

      // Create placeholder appointment with 'matching' status
      const appointment = createMatchingAppointment({
        specialty: params.specialty,
        patientId: params.patientId,
        patientName: params.patientName,
        doctorId: params.doctorId || undefined,
        doctorName: params.doctorName || undefined,
      })
      addAppointment(appointment)

      // Start background matching (fire-and-forget)
      runBackgroundMatching({
        appointmentId: appointment.id,
        matchType: 'specialty',
        params: {
          specialty: params.specialty,
          city: params.city,
          insuranceType: params.insuranceType,
          doctorId: params.doctorId,
          doctorName: params.doctorName,
          availabilityPrefs: {
            fullyFlexible: params.availabilityPrefs.fullyFlexible,
            slots: params.availabilityPrefs.slots.map((slot) => ({
              day: slot.day,
              timeRange: slot.timeRange,
            })),
          },
          patientId: params.patientId,
          patientName: params.patientName,
        },
        onSuccess: (data) => updateAppointment(appointment.id, data),
        onFailure: () => cancelAppointment(appointment.id),
      })

      // Navigate immediately - don't wait for matching
      navigate(PATHS.BOOKING_REQUEST_SENT)
    },
    [navigate, setSpecialtyMatchRequest, addAppointment, updateAppointment, cancelAppointment]
  )

  return { submitFastLane, submitSpecialty }
}

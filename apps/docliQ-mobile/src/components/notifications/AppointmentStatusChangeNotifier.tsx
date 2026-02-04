import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppState } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'
import type { Appointment } from '../../types'
import { appointmentDetailPath } from '../../routes/paths'

type AppointmentStatus = Appointment['status']

/**
 * Maps (previousStatus, newStatus) to toast message key and type for in-app push.
 */
function getToastForStatusChange(
  prevStatus: AppointmentStatus,
  newStatus: AppointmentStatus
): { messageKey: string; type: 'success' | 'info' | 'warning' } | null {
  if (prevStatus === newStatus) return null
  if (prevStatus === 'matching' && newStatus === 'confirmed') {
    return { messageKey: 'toastAppointmentConfirmed', type: 'success' }
  }
  if (prevStatus === 'matching' && newStatus === 'cancelled_patient') {
    return { messageKey: 'toastNoMatchFound', type: 'warning' }
  }
  if (prevStatus === 'confirmed' && newStatus === 'cancelled_patient') {
    return { messageKey: 'toastAppointmentCancelled', type: 'info' }
  }
  if (prevStatus === 'confirmed' && newStatus === 'cancelled_doctor') {
    return { messageKey: 'toastAppointmentCancelledByDoctor', type: 'warning' }
  }
  if (newStatus === 'modified_by_practice') {
    return { messageKey: 'toastAppointmentModified', type: 'warning' }
  }
  if (newStatus === 'completed') {
    return { messageKey: 'toastAppointmentCompleted', type: 'success' }
  }
  return null
}

/**
 * Subscribes to appointments, detects status changes, and shows an in-app toast.
 * Ref holds last-known status per id; we only toast when status actually changes (not on initial load).
 */
export default function AppointmentStatusChangeNotifier() {
  const { state } = useAppState()
  const { showToast } = useNotificationToast()
  const { t } = useTranslation('booking')
  const prevStatusByIdRef = useRef<Record<string, AppointmentStatus>>({})
  const isInitialMount = useRef(true)

  useEffect(() => {
    const appointments = state.appointments
    const prev = prevStatusByIdRef.current

    if (isInitialMount.current) {
      // Seed ref so we don't toast on first run
      appointments.forEach((apt) => {
        prev[apt.id] = apt.status
      })
      isInitialMount.current = false
      return
    }

    appointments.forEach((apt) => {
      const prevStatus = prev[apt.id]
      const newStatus = apt.status
      const toastConfig = prevStatus !== undefined ? getToastForStatusChange(prevStatus, newStatus) : null
      if (toastConfig) {
        showToast({
          title: t(toastConfig.messageKey),
          appointmentId: apt.id,
          type: toastConfig.type,
          actionLabel: toastConfig.messageKey === 'toastAppointmentModified' ? t('toastReviewChanges') : undefined,
          actionPath: toastConfig.messageKey === 'toastAppointmentModified' ? appointmentDetailPath(apt.id) : undefined,
        })
      }
      prev[apt.id] = newStatus
    })

    // Prune ref for appointments that no longer exist (e.g. removed)
    const currentIds = new Set(appointments.map((a) => a.id))
    Object.keys(prev).forEach((id) => {
      if (!currentIds.has(id)) delete prev[id]
    })
  }, [state.appointments, showToast, t])

  return null
}

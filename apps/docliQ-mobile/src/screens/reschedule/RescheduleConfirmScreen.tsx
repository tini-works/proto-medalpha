import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IconX, IconCheck, IconAlertCircle, IconArrowDown } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Page, Header } from '../../components'
import { Button } from '../../components/ui'
import { useReschedule, useBooking } from '../../state'
import { apiRescheduleAppointment } from '../../data/api'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { rescheduleSuccessPath, reschedulePath, PATHS } from '../../routes/paths'

export default function RescheduleConfirmScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation(['appointments', 'booking'])
  const origin = (location.state as any)?.origin as 'suggestions' | 'calendar' | undefined

  const { rescheduleContext, setRescheduleContext } = useReschedule()
  const { cancelAppointment, addAppointment } = useBooking()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator === 'undefined' ? true : navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Validate context
  if (!rescheduleContext || !rescheduleContext.selectedNewSlot) {
    return (
      <Page>
        <Header title={t('reschedule.confirm.title', { ns: 'appointments' })} showBack />
        <div className="px-4 py-8 text-center">
          <p className="text-slate-500">{t('reschedule.confirm.noSlotSelected', { ns: 'appointments' })}</p>
          <Button
            variant="link"
            className="mt-4"
            onClick={() => navigate(id ? reschedulePath(id) : PATHS.HISTORY)}
          >
            {t('reschedule.confirm.backToSlotSelection', { ns: 'appointments' })}
          </Button>
        </div>
      </Page>
    )
  }

  const { originalAppointment, selectedNewSlot } = rescheduleContext

  const handleConfirm = async () => {
    if (!isOnline) return
    setIsSubmitting(true)
    setError(null)

    try {
      // Call API to reschedule
      const result = await apiRescheduleAppointment(originalAppointment.id, {
        dateISO: selectedNewSlot.dateISO,
        time: selectedNewSlot.time,
      })

      if (result.success) {
        // Create new appointment with new details
        const newAppointment = {
          ...originalAppointment,
          id: `apt_${Date.now()}`,
          dateISO: selectedNewSlot.dateISO,
          time: selectedNewSlot.time,
        }

        // Safety rule: book new before canceling old (simulated locally)
        addAppointment(newAppointment)
        cancelAppointment(originalAppointment.id)

        // Update context with confirmation number
        setRescheduleContext({
          ...rescheduleContext,
          confirmationNumber: result.confirmationNumber,
        } as any)

        // Navigate to success
        navigate(rescheduleSuccessPath(originalAppointment.id), {
          state: {
            confirmationNumber: result.confirmationNumber,
            newAppointment,
          },
        })
      }
    } catch (err) {
      setError(t('reschedule.confirm.errors.slotUnavailable', { ns: 'appointments' }))
      // Return to origin selection screen (best-effort)
      if (origin === 'calendar' && id) {
        navigate(reschedulePath(id))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(reschedulePath(originalAppointment.id))
  }

  return (
    <Page safeBottom={false}>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-charcoal-900/50 animate-fade-in" onClick={handleCancel} />
        <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-cream-400" />
          </div>

          <div className="flex items-center justify-between px-4 pb-4">
            <Header title={t('reschedule.confirm.title', { ns: 'appointments' })} showBack onBack={handleCancel} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
            {/* Comparison View */}
            <div className="space-y-4">
              {/* Old Appointment */}
              <div className="bg-coral-50 border border-coral-600 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-coral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconX className="w-4 h-4 text-coral-700" stroke={2} />
                  </div>
                  <div>
                    <p className="text-sm text-coral-700 font-medium mb-1">{t('reschedule.confirm.previousAppointment', { ns: 'appointments' })}</p>
                    <p className="font-semibold text-charcoal-500">
                      {t('reschedule.confirm.dateAtTime', { ns: 'appointments', date: formatDateWithWeekday(originalAppointment.dateISO), time: formatTime(originalAppointment.time) })}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{t('reschedule.confirm.willBeCancelled', { ns: 'appointments' })}</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-cream-200 flex items-center justify-center">
                  <IconArrowDown className="w-5 h-5 text-slate-500" stroke={2} />
                </div>
              </div>

              {/* New Appointment */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <IconCheck className="w-4 h-4 text-teal-600" stroke={2} />
                  </div>
                  <div>
                    <p className="text-sm text-teal-600 font-medium mb-1">{t('reschedule.confirm.newAppointment', { ns: 'appointments' })}</p>
                    <p className="font-semibold text-charcoal-500">
                      {t('reschedule.confirm.dateAtTime', { ns: 'appointments', date: formatDateWithWeekday(selectedNewSlot.dateISO), time: formatTime(selectedNewSlot.time) })}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{t('reschedule.confirm.willBeBooked', { ns: 'appointments' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-white rounded-xl border border-cream-400 divide-y divide-cream-200">
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-1">{t('reschedule.confirm.doctor', { ns: 'appointments' })}</p>
                <p className="font-medium text-charcoal-500">{originalAppointment.doctorName}</p>
                <p className="text-sm text-slate-600">{originalAppointment.specialty}</p>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-500 mb-1">{t('reschedule.confirm.location', { ns: 'appointments' })}</p>
                <p className="font-medium text-charcoal-500">Marktplatz 5, 10178 Berlin</p>
              </div>
              {originalAppointment.forUserName && (
                <div className="p-4">
                  <p className="text-sm text-slate-500 mb-1">{t('reschedule.confirm.patient', { ns: 'appointments' })}</p>
                  <p className="font-medium text-charcoal-500">{originalAppointment.forUserName}</p>
                </div>
              )}
            </div>

            {/* Safety Note */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex gap-3">
                <IconAlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" stroke={2} />
                <p className="text-sm text-slate-700">
                  {t('reschedule.confirm.safetyNote', { ns: 'appointments' })}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-coral-50 border border-coral-600 rounded-xl p-4">
                <p className="text-sm text-coral-800">{error}</p>
              </div>
            )}
          </div>

          {/* Sticky bottom actions */}
          <div className="border-t border-cream-300 bg-white px-4 py-4 safe-area-bottom">
            <div className="mx-auto max-w-md flex flex-col gap-3">
              <Button
                onClick={handleConfirm}
                disabled={isSubmitting || !isOnline}
                variant="primary"
                size="md"
                fullWidth
                loading={isSubmitting}
              >
                {isOnline ? t('reschedule.confirm.submit', { ns: 'appointments' }) : t('offline', { ns: 'booking' })}
              </Button>

              <Button
                onClick={handleCancel}
                disabled={isSubmitting}
                variant="tertiary"
                size="md"
                fullWidth
              >
                {t('reschedule.confirm.keepCurrent', { ns: 'appointments' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

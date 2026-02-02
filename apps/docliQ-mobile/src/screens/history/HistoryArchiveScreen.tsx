import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppointmentListCard, EmptyState, Header, Page } from '../../components'
import { PATHS, appointmentDetailPath } from '../../routes/paths'
import { useBooking, useHistory } from '../../state'
import type { Appointment, HistoryItem } from '../../types'

function mapHistoryToAppointment(item: HistoryItem): Appointment {
  const title = item.title.replace('Appointment:', '').trim()
  const [doctorNameRaw] = item.subtitle.split('·').map((part) => part.trim())
  const doctorName = doctorNameRaw || 'Dr. Taylor'
  const specialty = title || 'General Medicine'
  const details = item.details ?? {}
  return {
    id: item.id,
    doctorId: 'd1',
    doctorName,
    specialty,
    dateISO: item.dateISO,
    time: '10:00',
    forUserId: item.forUserId,
    forUserName: item.forUserName,
    status: item.status === 'cancelled' ? 'cancelled_patient' : 'completed',
    reminderSet: false,
    calendarSynced: false,
    storeId: undefined,
    feedbackRating: typeof details.feedbackRating === 'number' ? details.feedbackRating : undefined,
    feedbackComment: typeof details.feedbackComment === 'string' ? details.feedbackComment : undefined,
    feedbackDismissed: Boolean(details.feedbackDismissed),
    feedbackSubmittedAt: typeof details.feedbackSubmittedAt === 'string' ? details.feedbackSubmittedAt : undefined,
  }
}

export default function HistoryArchiveScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('history')
  const { appointments } = useBooking()
  const { getFilteredItems } = useHistory()

  const archivedAppointments = useMemo(() => {
    const historyItems = getFilteredItems({ type: 'appointment' })
      .filter((item) => item.status === 'completed' || item.status === 'cancelled')
      .map(mapHistoryToAppointment)
      .filter((apt) => apt.status === 'completed' || apt.status === 'cancelled_patient')

    const upcomingStore = appointments.filter(
      (apt) => apt.status === 'completed' || apt.status === 'cancelled_patient'
    )

    const byId = new Map<string, Appointment>()
    for (const apt of historyItems) byId.set(apt.id, apt)
    for (const apt of upcomingStore) byId.set(apt.id, apt)

    return Array.from(byId.values()).sort((a, b) => {
      const aTs = new Date(`${a.dateISO}T${a.time}`).getTime()
      const bTs = new Date(`${b.dateISO}T${b.time}`).getTime()
      return bTs - aTs
    })
  }, [appointments, getFilteredItems])

  return (
    <Page>
      <Header title={t('archiveTitle')} showBack onBack={() => navigate(PATHS.HISTORY)} />

      <div className="px-4 py-4 pb-16">
        {archivedAppointments.length === 0 ? (
          <EmptyState
            icon="history"
            title={t('archiveEmptyTitle')}
            description={t('archiveEmptyDescription')}
          />
        ) : (
          <div className="space-y-3">
            {archivedAppointments.map((appointment) => (
              <AppointmentListCard
                key={appointment.id}
                appointment={appointment}
                onClick={
                  appointment.status === 'completed'
                    ? () => navigate(appointmentDetailPath(appointment.id))
                    : undefined
                }
                onRate={
                  appointment.status === 'completed'
                    ? () => navigate(appointmentDetailPath(appointment.id), { state: { rateVisit: true } })
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}

import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointmentListCard, EmptyState, Header, Page } from '../../components'
import { PATHS } from '../../routes/paths'
import { useBooking, useHistory } from '../../state'
import type { Appointment, HistoryItem } from '../../types'

function mapHistoryToAppointment(item: HistoryItem): Appointment {
  const title = item.title.replace('Appointment:', '').trim()
  const [doctorNameRaw] = item.subtitle.split('·').map((part) => part.trim())
  const doctorName = doctorNameRaw || 'Dr. Taylor'
  const specialty = title || 'General Medicine'
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
  }
}

export default function HistoryArchiveScreen() {
  const navigate = useNavigate()
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
      <Header title="History" showBack onBack={() => navigate(PATHS.HISTORY)} />

      <div className="px-4 py-4 pb-16">
        {archivedAppointments.length === 0 ? (
          <EmptyState
            icon="history"
            title="No history yet"
            description="Completed and canceled appointments will appear here."
          />
        ) : (
          <div className="space-y-3">
            {archivedAppointments.map((appointment) => (
              <AppointmentListCard
                key={appointment.id}
                appointment={appointment}
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}

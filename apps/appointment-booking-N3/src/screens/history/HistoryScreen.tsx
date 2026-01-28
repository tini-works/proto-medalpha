import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, TabBar, AppointmentCard, EmptyState } from '../../components'
import { useBooking } from '../../state'
import { PATHS, historyDetailPath } from '../../routes/paths'
import { formatDateLong } from '../../utils/format'
import type { Appointment } from '../../types'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { appointments } = useBooking()

  const [statusFilter, setStatusFilter] = useState<'all' | 'matching' | 'confirmed' | 'cancelled_doctor'>('all')

  const displayedAppointments = useMemo(() => {
    const nowTs = Date.now()
    const allowedStatuses: Appointment['status'][] = ['matching', 'confirmed', 'cancelled_doctor']
    const allowed = appointments.filter((apt) => allowedStatuses.includes(apt.status))
    const filtered = statusFilter === 'all' ? allowed : allowed.filter((apt) => apt.status === statusFilter)
    return filtered.sort((a, b) => {
      const aTs = new Date(`${a.dateISO}T${a.time}`).getTime()
      const bTs = new Date(`${b.dateISO}T${b.time}`).getTime()
      const aIsPast = aTs < nowTs
      const bIsPast = bTs < nowTs
      if (aIsPast !== bIsPast) return aIsPast ? 1 : -1
      return Math.abs(aTs - nowTs) - Math.abs(bTs - nowTs)
    })
  }, [appointments, statusFilter])

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Appointment[]>()
    for (const apt of displayedAppointments) {
      const bucket = groups.get(apt.dateISO) || []
      bucket.push(apt)
      groups.set(apt.dateISO, bucket)
    }
    return Array.from(groups.entries())
  }, [displayedAppointments])

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(historyDetailPath(appointmentId))
  }

  const handleReschedule = (appointmentId: string) => {
    // Navigate to reschedule flow
    navigate(`/reschedule/${appointmentId}/reason`)
  }

  const handleCancel = (appointmentId: string) => {
    // Navigate to appointment details with cancel action
    navigate(historyDetailPath(appointmentId) + '?action=cancel')
  }

  return (
      <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-charcoal-500">My Appointments</h1>
          <button
            type="button"
            onClick={() => navigate(PATHS.HISTORY_ARCHIVE)}
            className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors duration-normal ease-out-brand"
            aria-label="Appointment history"
          >
            <svg className="w-5 h-5 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Filters + List */}
      <div className="px-4 py-4 pb-16 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { value: 'all', label: 'All' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'matching', label: 'Matching' },
              { value: 'cancelled_doctor', label: 'Doctor canceled' },
            ] as const
          ).map((chip) => {
            const isActive = statusFilter === chip.value
            return (
              <button
                key={chip.value}
                type="button"
                onClick={() => setStatusFilter(chip.value)}
                className={`whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium border transition-colors duration-normal ease-out-brand ${
                  isActive
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-white text-charcoal-500 border-cream-400 hover:border-cream-500'
                }`}
              >
                {chip.label}
              </button>
            )
          })}
        </div>

        {displayedAppointments.length === 0 ? (
          <EmptyState
            icon="calendar"
            title="No appointments"
            description="Try changing the status filter or book a new appointment."
          />
        ) : (
          <div className="space-y-6">
            {groupedByDate.map(([dateISO, items]) => (
              <section key={dateISO} className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-600">{formatDateLong(dateISO)}</h2>
                <div className="space-y-3">
                  {items.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      variant="upcoming"
                      onClick={() => handleAppointmentClick(appointment.id)}
                      onReschedule={appointment.status === 'confirmed' ? () => handleReschedule(appointment.id) : undefined}
                      onCancel={appointment.status === 'confirmed' ? () => handleCancel(appointment.id) : undefined}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate(PATHS.BOOKING_SEARCH)}
        className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all duration-normal ease-out-brand"
        aria-label="Book new appointment"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <TabBar />
    </Page>
  )
}

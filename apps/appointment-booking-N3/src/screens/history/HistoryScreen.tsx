import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, TabBar, AppointmentCard, EmptyState } from '../../components'
import { TabToggle } from '../../components/forms'
import { useHistory, useBooking, useProfile } from '../../state'
import { PATHS, historyDetailPath } from '../../routes/paths'
import type { Appointment, HistoryItem } from '../../types'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { getFilteredItems, addHistoryItem } = useHistory()
  const { appointments } = useBooking()
  const { profile } = useProfile()

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

  // Filter upcoming appointments (confirmed status, future dates)
  const today = new Date().toISOString().split('T')[0]
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' && apt.dateISO >= today
  )

  // Get past appointments from history
  const pastAppointments = getFilteredItems({ type: 'appointment' }).filter(
    (item) => item.status === 'completed' || item.status === 'cancelled' || item.dateISO < today
  )

  useEffect(() => {
    if (pastAppointments.length > 0) return
    addHistoryItem({
      id: 'hist_fallback_1',
      type: 'appointment',
      title: 'Appointment: Dermatology',
      subtitle: 'Dr. Sarah Weber · Berlin',
      dateISO: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'completed',
      forUserId: 'self',
      forUserName: profile.fullName || 'You',
    })
  }, [pastAppointments.length, addHistoryItem, profile.fullName])

  const displayedPastAppointments = pastAppointments

  const mapHistoryToAppointment = (item: HistoryItem): Appointment => {
    const title = item.title.replace('Appointment:', '').trim()
    const [doctorNameRaw, cityRaw] = item.subtitle.split('·').map((part) => part.trim())
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
      status: item.status === 'planned' ? 'confirmed' : item.status,
      reminderSet: false,
      calendarSynced: false,
      storeId: undefined,
    }
  }

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

  const handleBookAgain = (item: typeof pastAppointments[0]) => {
    // Navigate to Book Again flow with pre-filled context
    navigate(`/book-again/${item.id}`)
  }

  return (
      <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-charcoal-500">My Appointments</h1>
          <span className="w-10 h-10" aria-hidden="true" />
        </div>

        {/* Tab Toggle */}
        <div className="px-4 pb-3">
          <TabToggle
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'history', label: 'Past' },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'upcoming' | 'history')}
          />
        </div>
      </header>

      {/* Content with bottom padding for fixed CTA */}
      <div className="px-4 py-4 pb-16">
        {activeTab === 'upcoming' ? (
          // Upcoming Tab Content - fade in on tab switch
          <div key="upcoming" className="animate-fade-in">
            {upcomingAppointments.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="No upcoming appointments"
                description="Book your first appointment to get started."
              />
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    variant="upcoming"
                    onClick={() => handleAppointmentClick(appointment.id)}
                    onReschedule={() => handleReschedule(appointment.id)}
                    onCancel={() => handleCancel(appointment.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // History Tab Content - fade in on tab switch
          <div key="history" className="animate-fade-in">
            {displayedPastAppointments.length === 0 ? (
              <EmptyState
                icon="history"
                title="No past appointments"
                description="Your completed appointments will appear here."
              />
            ) : (
              <div className="space-y-3">
                {displayedPastAppointments.map((item) => {
                  const appointmentCard = mapHistoryToAppointment(item)
                  return (
                    <AppointmentCard
                      key={item.id}
                      appointment={appointmentCard}
                      variant="upcoming"
                      onClick={() => handleAppointmentClick(item.id)}
                      onBookAgain={() => handleBookAgain(item)}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <TabBar />
    </Page>
  )
}

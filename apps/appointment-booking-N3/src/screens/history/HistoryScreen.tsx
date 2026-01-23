import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page, TabBar, AppointmentCard, HistoryCard, EmptyState } from '../../components'
import { TabToggle } from '../../components/forms'
import { useHistory, useBooking } from '../../state'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { getFilteredItems } = useHistory()
  const { appointments } = useBooking()

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

  // Filter upcoming appointments (confirmed status, future dates)
  const today = new Date().toISOString().split('T')[0]
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'confirmed' && apt.dateISO >= today
  )

  // Get past appointments from history
  const pastAppointments = getFilteredItems({ type: 'appointment' }).filter(
    (item) => item.status === 'completed' || item.dateISO < today
  )

  const handleReschedule = (appointmentId: string) => {
    // Navigate to booking flow with appointment context
    console.log('Reschedule:', appointmentId)
    navigate('/search')
  }

  const handleCancel = (appointmentId: string) => {
    // Show cancellation modal
    console.log('Cancel:', appointmentId)
  }

  const handleBookAgain = (_item: typeof pastAppointments[0]) => {
    // Navigate to booking flow with doctor context
    // TODO: Pre-fill search with doctor/specialty from _item.details
    navigate('/search')
  }

  const handleBookNew = () => {
    navigate('/search')
  }

  return (
    <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-neutral-900">My Appointments</h1>
          <button
            onClick={handleBookNew}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 transition-colors"
            aria-label="Add to calendar"
          >
            <svg className="w-6 h-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v6m3-3H9" />
            </svg>
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-4 pb-3">
          <TabToggle
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'history', label: 'History' },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as 'upcoming' | 'history')}
          />
        </div>
      </header>

      {/* Content with bottom padding for fixed CTA */}
      <div className="px-4 py-4 pb-24">
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
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-3">
              Past Appointments
            </h2>
            {pastAppointments.length === 0 ? (
              <EmptyState
                icon="history"
                title="No past appointments"
                description="Your completed appointments will appear here."
              />
            ) : (
              <div className="space-y-3">
                {pastAppointments.map((item) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    variant="history"
                    onBookAgain={() => handleBookAgain(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent">
        <button
          onClick={handleBookNew}
          className="w-full h-14 bg-neutral-800 text-white rounded-xl shadow-lg flex items-center justify-center gap-2 font-medium hover:bg-neutral-700 active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book New Appointment
        </button>
      </div>

      <TabBar />
    </Page>
  )
}

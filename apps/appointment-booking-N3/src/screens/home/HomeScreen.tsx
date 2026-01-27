import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Page, TabBar, CMSCard, AppointmentCard, Avatar, TodaysFocusCard } from '../../components'
import { useAuth, useProfile, useBooking } from '../../state'
import { apiGetCMSContent } from '../../data'
import { PATHS, appointmentDetailPath } from '../../routes'
import type { CMSContent } from '../../types'

export default function HomeScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isVerified } = useAuth()
  const { profile } = useProfile()
  const { appointments } = useBooking()
  const [cmsContent, setCmsContent] = useState<CMSContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetCMSContent(profile.insuranceType || undefined)
      .then(setCmsContent)
      .finally(() => setLoading(false))
  }, [profile.insuranceType, location.key])

  const upcomingAppointments = useMemo(() => {
    const now = new Date()
    return appointments
      .filter((appointment) => {
        const appointmentDateTime = new Date(`${appointment.dateISO}T${appointment.time}`)
        return appointment.status === 'confirmed' && appointmentDateTime >= now
      })
      .sort((a, b) => {
        const aTime = new Date(`${a.dateISO}T${a.time}`).getTime()
        const bTime = new Date(`${b.dateISO}T${b.time}`).getTime()
        return aTime - bTime
      })
  }, [appointments])

  const nextAppointment = upcomingAppointments[0]
  const upcomingPreview = upcomingAppointments.slice(0, 2)

  return (
    <Page>
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-cream-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to={PATHS.SETTINGS}>
              <Avatar name={profile.fullName || 'N'} size="md" />
            </Link>
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-xl font-semibold text-charcoal-500">{profile.fullName || 'User'}</h1>
            </div>
          </div>
          {/* Bell icon with dot badge - navigates to notifications */}
          <Link to={PATHS.NOTIFICATIONS} className="relative">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors duration-normal ease-out-brand">
              <svg className="w-5 h-5 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            {/* Unread indicator dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />
          </Link>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Today's Focus */}
        {isVerified && nextAppointment && (
          <section>
            <TodaysFocusCard
              appointment={nextAppointment}
              onCheckIn={() => navigate(appointmentDetailPath(nextAppointment.id))}
            />
          </section>
        )}

        {/* Upcoming Appointments */}
        {upcomingPreview.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-charcoal-500">Upcoming Appointments</h2>
              <Link to={PATHS.HISTORY} className="text-sm text-teal-700 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingPreview.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}

        {/* CMS Content */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal-500 mb-3">For You</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-cream-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {cmsContent.slice(0, 4).map((content) => (
                <CMSCard key={content.id} content={content} />
              ))}
            </div>
          )}
        </section>
      </div>

      <TabBar />
    </Page>
  )
}

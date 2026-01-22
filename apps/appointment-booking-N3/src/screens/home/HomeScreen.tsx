import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Page, TabBar, CMSCard, AppointmentCard, Avatar } from '../../components'
import { useProfile, useBooking } from '../../state'
import { apiGetCMSContent } from '../../data'
import { PATHS } from '../../routes'
import type { CMSContent } from '../../types'

export default function HomeScreen() {
  const { profile } = useProfile()
  const { appointments } = useBooking()
  const [cmsContent, setCmsContent] = useState<CMSContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetCMSContent(profile.insuranceType || undefined)
      .then(setCmsContent)
      .finally(() => setLoading(false))
  }, [profile.insuranceType])

  const upcomingAppointments = appointments
    .filter((a) => a.status === 'confirmed' && a.dateISO >= new Date().toISOString().split('T')[0])
    .slice(0, 2)

  return (
    <Page>
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Willkommen zurück,</p>
            <h1 className="text-xl font-semibold text-neutral-900">{profile.fullName || 'Nutzer'}</h1>
          </div>
          <Link to={PATHS.SETTINGS}>
            <Avatar name={profile.fullName || 'N'} size="md" />
          </Link>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Schnellzugriff</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={PATHS.BOOKING_SEARCH}
              className="p-4 bg-neutral-800 rounded-lg text-white hover:bg-neutral-900 transition-colors"
            >
              <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Termin buchen</span>
            </Link>

            <Link
              to={PATHS.PROFILE_FAMILY}
              className="p-4 bg-white border border-neutral-200 rounded-lg text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              <svg className="w-6 h-6 mb-2 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">Familie</span>
            </Link>
          </div>
        </section>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-neutral-900">Anstehende Termine</h2>
              <Link to={PATHS.HISTORY} className="text-sm text-neutral-700 font-medium">
                Alle anzeigen
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </section>
        )}

        {/* CMS Content */}
        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-3">Für Sie</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
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

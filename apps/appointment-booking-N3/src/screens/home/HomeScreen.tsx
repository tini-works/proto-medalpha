import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page, TabBar, Avatar, TodaysFocusCard, SwipeableAppointmentStack } from '../../components'
import { LatestNewsSection } from '../../components/newsfeed'
import { useAuth, useProfile, useBooking } from '../../state'
import { mockNewsArticles } from '../../data/newsfeed'
import { PATHS, appointmentDetailPath } from '../../routes'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { isVerified } = useAuth()
  const { profile } = useProfile()
  const { appointments } = useBooking()
  const { t } = useTranslation('home')
  const [pendingStackIndex, setPendingStackIndex] = useState(0)

  const getLastUpdatedTs = (appointment: (typeof appointments)[number]) => {
    const ts =
      (appointment.updatedAt ? new Date(appointment.updatedAt).getTime() : NaN) ||
      (appointment.createdAt ? new Date(appointment.createdAt).getTime() : NaN)
    if (Number.isFinite(ts)) return ts
    return new Date(`${appointment.dateISO}T${appointment.time}`).getTime()
  }

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        return (
          appointment.status === 'matching' ||
          appointment.status === 'await_confirm'
        )
      })
      .sort((a, b) => {
        return getLastUpdatedTs(b) - getLastUpdatedTs(a)
      })
  }, [appointments])

  const nextAppointment = useMemo(() => {
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
      })[0]
  }, [appointments])
  const pendingAppointments = upcomingAppointments
  const safePendingIndex = Math.min(Math.max(pendingStackIndex, 0), Math.max(pendingAppointments.length - 1, 0))

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
              <p className="text-sm text-slate-500">{t('welcomeBack')}</p>
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
              onClick={() => navigate(appointmentDetailPath(nextAppointment.id))}
            />
          </section>
        )}

        {/* Pending Appointments */}
        {pendingAppointments.length > 0 && (
          <section>
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-charcoal-500">{t('pendingAppointments')}</h2>
                <div className="mt-1 flex items-center gap-2 overflow-x-auto pb-1">
                  {pendingAppointments.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-8 rounded-full ${idx === safePendingIndex ? 'bg-charcoal-500' : 'bg-cream-300'}`}
                    />
                  ))}
                </div>
              </div>
              <Link to={PATHS.HISTORY} className="text-sm text-teal-700 font-medium hover:underline">
                {t('viewAll')}
              </Link>
            </div>
            <SwipeableAppointmentStack
              appointments={pendingAppointments}
              onOpen={(id) => navigate(appointmentDetailPath(id))}
              onActiveIndexChange={setPendingStackIndex}
            />
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal-500 mb-3">{t('quickActions')}</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={PATHS.BOOKING_SEARCH}
              className="p-4 bg-teal-500 rounded-lg text-white hover:bg-teal-600 transition-colors duration-normal ease-out-brand"
            >
              <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{t('bookAppointment')}</span>
            </Link>

            <Link
              to={PATHS.PROFILE_FAMILY}
              className="p-4 bg-white border border-cream-400 rounded-lg text-charcoal-500 hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
            >
              <svg className="w-6 h-6 mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-medium">{t('family')}</span>
            </Link>
          </div>
        </section>

        {/* Latest Health News */}
        <section>
          <LatestNewsSection articles={mockNewsArticles.slice(0, 3)} />
        </section>
      </div>

      <TabBar />
    </Page>
  )
}

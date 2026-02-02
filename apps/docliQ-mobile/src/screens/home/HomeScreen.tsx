import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconBell, IconCalendar, IconUsers } from '@tabler/icons-react'
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
              <Avatar name={profile.fullName || 'User'} imageUrl={profile.photoUrl} size="md" />
            </Link>
            <div>
              <p className="text-sm text-slate-500">{t('welcomeBack')}</p>
              <h1 className="text-xl font-semibold text-charcoal-500">{profile.fullName || 'User'}</h1>
            </div>
          </div>
          {/* Bell icon with dot badge - navigates to notifications */}
          <Link to={PATHS.NOTIFICATIONS} className="relative">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors duration-normal ease-out-brand">
              <IconBell size={20} className="text-charcoal-500" strokeWidth={2} />
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
              to={PATHS.BOOKING}
              className="p-4 bg-teal-500 rounded-lg text-white hover:bg-teal-600 transition-colors duration-normal ease-out-brand"
            >
              <IconCalendar size={24} strokeWidth={2} className="mb-2" />
              <span className="font-medium">{t('bookAppointment')}</span>
            </Link>

            <Link
              to={PATHS.PROFILE_FAMILY}
              className="p-4 bg-white border border-cream-400 rounded-lg text-charcoal-500 hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
            >
              <IconUsers size={24} strokeWidth={2} className="mb-2 text-slate-600" />
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

import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconBell, IconCalendar, IconUsers, IconChevronRight, IconHeart } from '@tabler/icons-react'
import { Page, TabBar, Avatar, TodaysFocusCard, SwipeableAppointmentStack } from '../../components'
import { OfflineBookingSheet } from '../../components/sheets'
import { PendingDeletionBanner } from '../../components/account'
import { ConfirmModal } from '../../components/ui'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { LatestNewsSection } from '../../components/newsfeed'
import { useAuth, useProfile, useBooking, useAppState } from '../../state'
import { mockNewsArticles } from '../../data/newsfeed'
import { PATHS, appointmentDetailPath } from '../../routes'
import { getTimeSlots } from '../../data'
import { pickNextAvailableSlot } from '../booking/quickRebook'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { isVerified } = useAuth()
  const { profile, toggleMyDoctor } = useProfile()
  const { appointments, selectDoctor, selectSlot, setBookingFlow, resetBooking } = useBooking()
  const { pendingDeletion, cancelDeletion, completeDeletion } = useAppState()
  const { t } = useTranslation('home')
  const [pendingStackIndex, setPendingStackIndex] = useState(0)
  const { isOnline } = useOnlineStatus()
  const [showOfflineSheet, setShowOfflineSheet] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

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

  const myDoctors = profile.myDoctors ?? []
  const continueDoctor = myDoctors[0]?.doctor

  const handleQuickBookDoctor = (doctor: any) => {
    if (!isOnline) {
      setShowOfflineSheet(true)
      return
    }

    const nextSlot = pickNextAvailableSlot(getTimeSlots(doctor.id))
    if (!nextSlot) return

    resetBooking()
    setBookingFlow('fast_lane')
    selectDoctor(doctor)
    selectSlot(nextSlot)
    navigate(PATHS.BOOKING_CONFIRM)
  }

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

      {pendingDeletion && (
        <PendingDeletionBanner
          expiresAt={pendingDeletion.expiresAt}
          onCancel={() => setShowCancelModal(true)}
          onSkipToDeletion={() => {
            completeDeletion()
            navigate(PATHS.AUTH_WELCOME)
          }}
        />
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Approach2: Quick rebook + My Doctors */}
        <section className="space-y-4">
          {continueDoctor ? (
            <button
              type="button"
              onClick={() => handleQuickBookDoctor(continueDoctor)}
              className="w-full text-left bg-white border border-cream-400 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                    {t('continueWithDoctor', { name: continueDoctor.name })}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">
                    {t('nextAvailableInline')}
                  </p>
                </div>
                <div className="shrink-0 w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center text-slate-600">
                  <IconChevronRight size={18} stroke={2} />
                </div>
              </div>
            </button>
          ) : (
            <div className="bg-white border border-cream-400 rounded-2xl p-4">
              <p className="text-sm text-slate-600">{t('myDoctorsEmptyTitle')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('myDoctorsEmptySubtitle')}</p>
            </div>
          )}

          {myDoctors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-charcoal-500">{t('myDoctors')}</h2>
                <Link to={PATHS.BOOKING_RESULTS} className="text-xs text-teal-700 font-medium hover:underline">
                  {t('searchNewDoctor')}
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {myDoctors.slice(0, 5).map((entry) => (
                  <div
                    key={entry.doctor.id}
                    onClick={() => handleQuickBookDoctor(entry.doctor as any)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleQuickBookDoctor(entry.doctor as any)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="relative w-[132px] shrink-0 bg-white border border-cream-400 rounded-2xl p-3 text-left hover:bg-cream-50 transition-colors duration-normal ease-out-brand cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMyDoctor(entry.doctor as any)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-slate-500 hover:bg-cream-200 transition-colors"
                      aria-label={t('toggleFavorite')}
                    >
                      <IconHeart size={16} stroke={2} />
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream-100 mb-2">
                      <Avatar name={entry.doctor.name} imageUrl={entry.doctor.imageUrl} size="sm" />
                    </div>
                    <p className="text-sm font-semibold text-charcoal-500 truncate">{entry.doctor.name}</p>
                    <p className="text-xs text-slate-500 truncate">{entry.doctor.specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

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
            <button
              type="button"
              onClick={() => (isOnline ? navigate(PATHS.BOOKING) : setShowOfflineSheet(true))}
              aria-disabled={!isOnline}
              className={`p-4 rounded-lg text-white transition-colors duration-normal ease-out-brand ${
                isOnline
                  ? 'bg-teal-500 hover:bg-teal-600'
                  : 'bg-teal-300 cursor-not-allowed'
              }`}
            >
              <IconCalendar size={24} strokeWidth={2} className="mb-2" />
              <span className="font-medium">{t('bookAppointment')}</span>
            </button>

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

      <OfflineBookingSheet open={showOfflineSheet} onClose={() => setShowOfflineSheet(false)} />

      <ConfirmModal
        open={showCancelModal}
        title={t('deleteCancel.title', { ns: 'legal' })}
        message={t('deleteCancel.message', { ns: 'legal' })}
        confirmLabel={t('deleteCancel.keepButton', { ns: 'legal' })}
        cancelLabel={t('deleteCancel.continueButton', { ns: 'legal' })}
        onConfirm={() => {
          cancelDeletion()
          setShowCancelModal(false)
        }}
        onCancel={() => setShowCancelModal(false)}
      />
    </Page>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconClock, IconFilter, IconSearch, IconX, IconPlus, IconArchive } from '@tabler/icons-react'
import { Page, TabBar, AppointmentListCard, EmptyState, SwipeableAppointmentStack } from '../../components'
import { OfflineBookingSheet } from '../../components/sheets'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useBooking } from '../../state'
import { PATHS, appointmentDetailPath } from '../../routes/paths'
import { formatDateLong } from '../../utils/format'
import type { Appointment } from '../../types'

/** Dedupe by id so React never sees duplicate keys; keep latest by updatedAt. */
function dedupeAppointmentsById(appointments: Appointment[]): Appointment[] {
  const byId = new Map<string, Appointment>()
  for (const apt of appointments) {
    const existing = byId.get(apt.id)
    if (!existing) {
      byId.set(apt.id, apt)
      continue
    }
    const existingTs = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0
    const ts = apt.updatedAt ? new Date(apt.updatedAt).getTime() : 0
    if (ts >= existingTs) byId.set(apt.id, apt)
  }
  return Array.from(byId.values())
}

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('history')
  const { appointments } = useBooking()
  const appointmentsDeduped = useMemo(() => dedupeAppointmentsById(appointments), [appointments])
  const { isOnline } = useOnlineStatus()
  const [showOfflineSheet, setShowOfflineSheet] = useState(false)

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'matching' | 'await_confirm' | 'cancelled_doctor' | 'modified_by_practice'
  >('all')

  const getLastUpdatedTs = (appointment: Appointment) => {
    const ts =
      (appointment.updatedAt ? new Date(appointment.updatedAt).getTime() : NaN) ||
      (appointment.createdAt ? new Date(appointment.createdAt).getTime() : NaN)
    if (Number.isFinite(ts)) return ts
    return new Date(`${appointment.dateISO}T${appointment.time}`).getTime()
  }

  const groupByDate = (items: Appointment[]) => {
    const groups = new Map<string, Appointment[]>()
    for (const apt of items) {
      const bucket = groups.get(apt.dateISO) || []
      bucket.push(apt)
      groups.set(apt.dateISO, bucket)
    }

    const entries = Array.from(groups.entries()).map(([dateISO, grouped]) => {
      const sortedItems = [...grouped].sort((a, b) => getLastUpdatedTs(b) - getLastUpdatedTs(a))
      const maxUpdated = Math.max(...sortedItems.map((i) => getLastUpdatedTs(i)))
      return { dateISO, items: sortedItems, sortKey: maxUpdated }
    })

    entries.sort((a, b) => b.sortKey - a.sortKey)
    return entries
  }

  // Upcoming section: always show confirmed appointments (not affected by filter)
  const upcomingConfirmed = useMemo(() => {
    return appointmentsDeduped
      .filter((apt) => apt.status === 'confirmed')
      .sort((a, b) => getLastUpdatedTs(b) - getLastUpdatedTs(a))
      .slice(0, 3)
  }, [appointmentsDeduped])

  // Others section: filter applies only here
  const others = useMemo(() => {
    const otherStatuses: Appointment['status'][] = ['matching', 'await_confirm', 'cancelled_doctor', 'modified_by_practice']
    const allowed = appointmentsDeduped.filter((apt) => otherStatuses.includes(apt.status))
    const filtered = statusFilter === 'all' ? allowed : allowed.filter((apt) => apt.status === statusFilter)
    return filtered.sort((a, b) => getLastUpdatedTs(b) - getLastUpdatedTs(a))
  }, [appointmentsDeduped, statusFilter])

  const groupedUpcoming = useMemo(() => groupByDate(upcomingConfirmed), [upcomingConfirmed])
  const groupedOthers = useMemo(() => groupByDate(others), [others])

  const statusChips = [
    {
      value: 'all',
      labelKey: 'filterAll',
      icon: IconFilter,
    },
    {
      value: 'await_confirm',
      labelKey: 'filterAwaitConfirm',
      icon: IconClock,
    },
    {
      value: 'matching',
      labelKey: 'filterMatching',
      icon: IconSearch,
    },
    {
      value: 'cancelled_doctor',
      labelKey: 'filterDoctorCanceled',
      icon: IconX,
    },
    {
      value: 'modified_by_practice',
      labelKey: 'filterDoctorRescheduled',
      icon: IconClock,
    },
  ] as const

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(appointmentDetailPath(appointmentId))
  }


  return (
      <Page>
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 h-16 bg-white border-b border-cream-300">
        <div className="flex h-full items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-charcoal-500">{t('title')}</h1>
          <button
            type="button"
            onClick={() => navigate(PATHS.HISTORY_ARCHIVE)}
            className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors duration-normal ease-out-brand"
            aria-label={t('archiveButton')}
          >
            <IconArchive size={20} className="text-charcoal-500" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Filters + List */}
      <div className="px-4 py-4 pb-16 space-y-4">
        {upcomingConfirmed.length === 0 && others.length === 0 ? (
          <EmptyState
            icon="calendar"
            title={t('emptyTitle')}
            description={t('emptyDescription')}
          />
        ) : (
          <div className="space-y-8">
            {groupedUpcoming.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-charcoal-500">
                    {t('upcoming')} <span className="text-sm font-medium text-slate-500">({upcomingConfirmed.length})</span>
                  </h2>
                </div>
                <SwipeableAppointmentStack
                  appointments={upcomingConfirmed}
                  onOpen={handleAppointmentClick}
                />
              </section>
            )}

            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-charcoal-500 whitespace-nowrap">
                  {t('others')} <span className="text-sm font-medium text-slate-500">({others.length})</span>
                </h2>
                <div className="ml-auto flex max-w-[70%] justify-end overflow-x-auto pb-1">
                  <div className="flex gap-2">
                    {statusChips.map((chip) => {
                      const isActive = statusFilter === chip.value
                      const IconComponent = chip.icon
                      const label = t(chip.labelKey)
                      return (
                        <button
                          key={chip.value}
                          type="button"
                          onClick={() => setStatusFilter(chip.value)}
                          aria-pressed={isActive}
                          aria-label={label}
                          title={label}
                          className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium border transition-colors duration-normal ease-out-brand ${
                            isActive
                              ? 'bg-teal-500 text-white border-teal-500'
                              : 'bg-white text-charcoal-500 border-cream-400 hover:border-cream-500'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-slate-600'}>
                            <IconComponent size={16} strokeWidth={2} />
                          </span>
                          {isActive && <span>{label}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {groupedOthers.length > 0 ? (
                <div className="space-y-6">
                  {groupedOthers.map((group) => (
                    <section key={`oth_${group.dateISO}`} className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-600">{formatDateLong(group.dateISO)}</h3>
                      <div className="space-y-3">
                        {group.items.map((appointment) => (
                          <AppointmentListCard
                            key={appointment.id}
                            appointment={appointment}
                            onClick={() => handleAppointmentClick(appointment.id)}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="search"
                  title={t('emptyOthersTitle')}
                  description={t('emptyOthersDescription')}
                />
              )}
            </section>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() =>
          isOnline ? navigate(PATHS.BOOKING_INTENT, { state: { from: PATHS.HISTORY } }) : setShowOfflineSheet(true)
        }
        aria-disabled={!isOnline}
        className={`fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center active:scale-95 transition-all duration-normal ease-out-brand ${
          isOnline ? 'bg-teal-500 hover:bg-teal-600' : 'bg-teal-300 cursor-not-allowed'
        }`}
        aria-label={t('bookNewAppointment')}
      >
        <IconPlus size={28} strokeWidth={2} />
      </button>

      <TabBar />
      <OfflineBookingSheet open={showOfflineSheet} onClose={() => setShowOfflineSheet(false)} />
    </Page>
  )
}

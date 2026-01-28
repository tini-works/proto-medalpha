import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconClock, IconFilter, IconSearch, IconX, IconPlus, IconArchive } from '@tabler/icons-react'
import { Page, TabBar, AppointmentListCard, EmptyState, SwipeableAppointmentStack } from '../../components'
import { useBooking } from '../../state'
import { PATHS, appointmentDetailPath } from '../../routes/paths'
import { formatDateLong } from '../../utils/format'
import type { Appointment } from '../../types'

export default function HistoryScreen() {
  const navigate = useNavigate()
  const { appointments } = useBooking()

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'matching' | 'await_confirm' | 'cancelled_doctor'
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
    return appointments
      .filter((apt) => apt.status === 'confirmed')
      .sort((a, b) => getLastUpdatedTs(b) - getLastUpdatedTs(a))
  }, [appointments])

  // Others section: filter applies only here
  const others = useMemo(() => {
    const otherStatuses: Appointment['status'][] = ['matching', 'await_confirm', 'cancelled_doctor']
    const allowed = appointments.filter((apt) => otherStatuses.includes(apt.status))
    const filtered = statusFilter === 'all' ? allowed : allowed.filter((apt) => apt.status === statusFilter)
    return filtered.sort((a, b) => getLastUpdatedTs(b) - getLastUpdatedTs(a))
  }, [appointments, statusFilter])

  const groupedUpcoming = useMemo(() => groupByDate(upcomingConfirmed), [upcomingConfirmed])
  const groupedOthers = useMemo(() => groupByDate(others), [others])

  const statusChips = [
    {
      value: 'all',
      label: 'All',
      icon: IconFilter,
    },
    {
      value: 'await_confirm',
      label: 'Await confirm',
      icon: IconClock,
    },
    {
      value: 'matching',
      label: 'Matching',
      icon: IconSearch,
    },
    {
      value: 'cancelled_doctor',
      label: 'Doctor canceled',
      icon: IconX,
    },
  ] as const

  const handleAppointmentClick = (appointmentId: string) => {
    navigate(appointmentDetailPath(appointmentId))
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
            aria-label="Appointment archive"
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
            title="No appointments"
            description="Try changing the status filter or book a new appointment."
          />
        ) : (
          <div className="space-y-8">
            {groupedUpcoming.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-charcoal-500">
                    Upcoming <span className="text-sm font-medium text-slate-500">({upcomingConfirmed.length})</span>
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
                  Others <span className="text-sm font-medium text-slate-500">({others.length})</span>
                </h2>
                <div className="ml-auto flex max-w-[70%] justify-end overflow-x-auto pb-1">
                  <div className="flex gap-2">
                    {statusChips.map((chip) => {
                      const isActive = statusFilter === chip.value
                      const IconComponent = chip.icon
                      return (
                        <button
                          key={chip.value}
                          type="button"
                          onClick={() => setStatusFilter(chip.value)}
                          aria-pressed={isActive}
                          aria-label={chip.label}
                          title={chip.label}
                          className={`inline-flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium border transition-colors duration-normal ease-out-brand ${
                            isActive
                              ? 'bg-teal-500 text-white border-teal-500'
                              : 'bg-white text-charcoal-500 border-cream-400 hover:border-cream-500'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-slate-600'}>
                            <IconComponent size={16} strokeWidth={2} />
                          </span>
                          {isActive && <span>{chip.label}</span>}
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
                  title="No other appointments"
                  description="Try changing the filters to see more."
                />
              )}
            </section>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate(PATHS.BOOKING_SEARCH)}
        className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all duration-normal ease-out-brand"
        aria-label="Book new appointment"
      >
        <IconPlus size={28} strokeWidth={2} />
      </button>

      <TabBar />
    </Page>
  )
}

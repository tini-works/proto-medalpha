import { Button, Card, CardBody } from '@meda/ui'
import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { readCachedSlotsForDoctor } from '../domain/cache'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import { addDays, getWeekStartMonday, toYmd } from '../domain/week'
import { doctors } from '../mock/doctors'
import { generateWeekSlots } from '../mock/slots'
import { useOnlineStatus } from '../state/connectivity'
import { useLocalStorageState } from '../state/useLocalStorageState'

export function ScheduleRoute() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const online = useOnlineStatus()

  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId])

  const [weekStartISO, setWeekStartISO] = useLocalStorageState<string>(
    `ab.schedule.${doctorId}.weekStart`,
    toYmd(getWeekStartMonday(new Date())),
  )
  const [selectedSlotId, setSelectedSlotId] = useLocalStorageState<string | null>(
    `ab.selection.${doctorId}.slotId`,
    null,
  )

  const weekSlots = useMemo(() => {
    if (!doctorId) return []
    /**
     * Business intent: keep schedule usable offline by reusing cached slots (BOOK-020),
     * limited to the last cached week (≤ 5 minutes).
     */
    if (!online) {
      const cached = readCachedSlotsForDoctor({ doctorId, weekStartISO })
      if (cached) return cached
    }

    return generateWeekSlots({
      doctorId,
      weekStartISO,
      days: 7,
      startHour: 9,
      endHour: 17,
      durationMin: 30,
      cadenceMin: 30,
    })
  }, [doctorId, online, weekStartISO])

  const slotsByDay = useMemo(() => {
    const map = new Map<string, typeof weekSlots>()
    for (const slot of weekSlots) {
      const dayKey = slot.startISO.slice(0, 10)
      const list = map.get(dayKey) ?? []
      list.push(slot)
      map.set(dayKey, list)
    }
    return map
  }, [weekSlots])

  const dayKeys = useMemo(() => {
    const base = new Date(`${weekStartISO}T00:00:00`)
    return Array.from({ length: 7 }, (_, i) => toYmd(addDays(base, i)))
  }, [weekStartISO])

  function goToday() {
    setWeekStartISO(toYmd(getWeekStartMonday(new Date())))
  }

  function goPrevWeek() {
    setWeekStartISO(toYmd(addDays(new Date(`${weekStartISO}T00:00:00`), -7)))
  }

  function goNextWeek() {
    setWeekStartISO(toYmd(addDays(new Date(`${weekStartISO}T00:00:00`), 7)))
  }

  function continueToConfirm() {
    if (!doctor || !doctorId || !selectedSlotId) return
    localStorage.setItem('ab.selection.doctorId', doctorId)
    localStorage.setItem('ab.selection.slotId', selectedSlotId)
    navigate('/confirm')
  }

  return (
    <MobileShell title="Choose a time" step={{ current: 3, total: 4 }}>
      {!doctor ? (
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-6 text-center">
            <div className="text-base font-semibold text-neutral-800">Doctor not found</div>
            <div className="mt-4">
              <Link className="text-sm font-semibold text-brand-blue-700 hover:underline" to="/results">
                Back to results
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3 pb-20">
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-sm font-semibold text-neutral-800">{doctor.name}</div>
              <div className="text-xs text-neutral-600">{doctor.specialty}</div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  onClick={goPrevWeek}
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  onClick={goToday}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  onClick={goNextWeek}
                >
                  Next →
                </button>
              </div>
            </CardBody>
          </Card>

          {/* Business intent: week view showing availability vs disabled slots (BOOK-008). */}
          {dayKeys.map((dayKey) => {
            const slots = (slotsByDay.get(dayKey) ?? []).slice(0, 10)
            const dayDate = new Date(`${dayKey}T00:00:00`)
            return (
              <Card key={dayKey} className="rounded-2xl">
                <CardBody className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-neutral-800">
                      {formatGermanDate(dayDate)}
                    </div>
                    <div className="text-xs text-neutral-600">30 min</div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {slots.length ? (
                      slots.map((slot) => {
                        const d = new Date(slot.startISO)
                        const selected = slot.id === selectedSlotId
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            className={[
                              'rounded-xl border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                              selected
                                ? 'border-brand-blue-500 bg-brand-mint-100'
                                : 'border-neutral-300 bg-white hover:bg-neutral-100',
                            ].join(' ')}
                            onClick={() => setSelectedSlotId(slot.id)}
                          >
                            {formatGermanTime(d)}
                          </button>
                        )
                      })
                    ) : (
                      <div className="col-span-3 text-sm text-neutral-600">No slots</div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}

          <div className="fixed bottom-0 left-0 right-0 z-20">
            <div className="mx-auto w-full max-w-[420px] border-t border-neutral-200 bg-white/90 p-4 backdrop-blur">
              <Button
                className="w-full rounded-xl py-3"
                disabled={!selectedSlotId}
                onClick={continueToConfirm}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  )
}


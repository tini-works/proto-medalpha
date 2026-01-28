import { useRef, useState } from 'react'
import { IconCalendar, IconClock, IconUser } from '@tabler/icons-react'
import type { PointerEvent } from 'react'
import type { Appointment } from '../../types'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import { Pill } from '../display/Pill'

export function SwipeableAppointmentStack({
  appointments,
  onOpen,
}: {
  appointments: Appointment[]
  onOpen: (id: string) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const startXRef = useRef<number | null>(null)
  const lastXRef = useRef<number | null>(null)
  const didDragRef = useRef(false)

  const safeActiveIndex = Math.min(Math.max(activeIndex, 0), Math.max(appointments.length - 1, 0))

  const statusConfig: Record<
    Appointment['status'],
    { tone: 'info' | 'positive' | 'warning' | 'negative' | 'neutral'; label: string }
  > = {
    matching: { tone: 'info', label: 'Matching' },
    await_confirm: { tone: 'warning', label: 'Await confirm' },
    confirmed: { tone: 'positive', label: 'Confirmed' },
    cancelled_doctor: { tone: 'negative', label: 'Doctor canceled' },
    completed: { tone: 'neutral', label: 'Completed' },
    cancelled_patient: { tone: 'negative', label: 'Patient canceled' },
  }

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX
    lastXRef.current = e.clientX
    didDragRef.current = false
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return
    lastXRef.current = e.clientX
    const delta = e.clientX - startXRef.current
    if (Math.abs(delta) > 6) didDragRef.current = true
    setDragX(delta)
  }

  const endGesture = () => {
    if (startXRef.current == null || lastXRef.current == null) return
    const delta = lastXRef.current - startXRef.current
    const threshold = 60
    let nextIndex = safeActiveIndex
    if (delta <= -threshold) nextIndex = safeActiveIndex + 1
    if (delta >= threshold) nextIndex = safeActiveIndex - 1
    nextIndex = Math.min(Math.max(nextIndex, 0), Math.max(appointments.length - 1, 0))
    setActiveIndex(nextIndex)
    setDragX(0)
    startXRef.current = null
    lastXRef.current = null
  }

  if (appointments.length === 0) return null

  return (
    <div className="relative">
      {/* Background stack layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[28px] bg-white/70 border border-cream-300 translate-y-3 scale-[0.98]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[28px] bg-white/50 border border-cream-300 translate-y-6 scale-[0.96]"
      />

      {/* Foreground card */}
      <div className="relative rounded-[28px] bg-white border border-cream-300 shadow-[0_14px_40px_rgba(0,0,0,0.10)] p-5">
        {/* Progress */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {appointments.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-8 rounded-full ${idx === safeActiveIndex ? 'bg-charcoal-500' : 'bg-cream-300'}`}
              />
            ))}
          </div>
          {appointments.length > 7 && (
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {safeActiveIndex + 1}/{appointments.length}
            </span>
          )}
        </div>

        {/* Slides */}
        <div
          className="mt-6 overflow-hidden touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
        >
          <div
            className={`flex ${startXRef.current ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{
              transform: `translateX(calc(${-safeActiveIndex * 100}% + ${dragX}px))`,
            }}
          >
            {appointments.map((appointment) => {
              const status = statusConfig[appointment.status]
              return (
                <div key={appointment.id} className="w-full shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (didDragRef.current) {
                        didDragRef.current = false
                        return
                      }
                      onOpen(appointment.id)
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold tracking-wide text-slate-600">APPOINTMENT</p>
                        <h3 className="mt-2 text-xl font-bold text-charcoal-500 leading-snug">
                          {appointment.doctorName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">{appointment.specialty}</p>
                      </div>
                      <Pill tone={status.tone}>{status.label}</Pill>
                    </div>

                    <div className="mt-5 rounded-2xl border border-cream-300 bg-cream-50 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <IconCalendar className="w-4 h-4 flex-shrink-0" stroke={1.5} />
                        <span>{formatDateWithWeekday(appointment.dateISO)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <IconClock className="w-4 h-4 flex-shrink-0" stroke={1.5} />
                        <span>{formatTime(appointment.time)} Uhr</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <IconUser className="w-4 h-4 flex-shrink-0" stroke={1.5} />
                        <span>{appointment.forUserName}</span>
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

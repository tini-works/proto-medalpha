import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { Appointment } from '../../types'
import { AppointmentListCard } from './AppointmentListCard'

export function SwipeableAppointmentStack({
  appointments,
  onOpen,
  onActiveIndexChange,
}: {
  appointments: Appointment[]
  onOpen: (id: string) => void
  onActiveIndexChange?: (index: number) => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const startXRef = useRef<number | null>(null)
  const startYRef = useRef<number | null>(null)
  const lastXRef = useRef<number | null>(null)
  const lastYRef = useRef<number | null>(null)
  const didDragRef = useRef(false)
  const lastEmittedIndexRef = useRef<number | null>(null)

  const safeActiveIndex = Math.min(Math.max(activeIndex, 0), Math.max(appointments.length - 1, 0))

  useEffect(() => {
    if (!onActiveIndexChange) return
    if (lastEmittedIndexRef.current === safeActiveIndex) return
    lastEmittedIndexRef.current = safeActiveIndex
    onActiveIndexChange(safeActiveIndex)
  }, [onActiveIndexChange, safeActiveIndex])

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    lastXRef.current = e.clientX
    lastYRef.current = e.clientY
    didDragRef.current = false
  }

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return
    lastXRef.current = e.clientX
    lastYRef.current = e.clientY

    const dx = e.clientX - startXRef.current
    const dy = (startYRef.current == null ? 0 : e.clientY - startYRef.current)

    // Treat as "swipe" only when horizontal movement is intentional.
    // This prevents minor finger jitter from blocking taps on the card.
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) didDragRef.current = true

    setDragX(dx)
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
    startYRef.current = null
    lastXRef.current = null
    lastYRef.current = null
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
      <div className="relative rounded-[28px] bg-white border border-cream-300 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
        {/* Slides */}
        <div
          className="overflow-hidden touch-pan-y select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onPointerLeave={endGesture}
        >
          <div
            className={`flex ${startXRef.current ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{
              transform: `translateX(calc(${-safeActiveIndex * 100}% + ${dragX}px))`,
            }}
          >
            {appointments.map((appointment) => {
              return (
                <div key={appointment.id} className="w-full shrink-0">
                  <AppointmentListCard
                    appointment={appointment}
                    onClick={() => {
                      if (didDragRef.current) {
                        didDragRef.current = false
                        return
                      }
                      onOpen(appointment.id)
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

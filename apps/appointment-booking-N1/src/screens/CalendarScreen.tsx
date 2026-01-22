import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Card, TimeSlot, PrimaryButton } from '../components'
import { doctors, getWeekDates, TimeSlot as TimeSlotType } from '../data/mockData'

export default function CalendarScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = doctors.find((d) => d.id === id)

  const [weekOffset, setWeekOffset] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotType | null>(null)

  if (!doctor) {
    return <div style={{ padding: 'var(--space-lg)' }}>Doctor not found</div>
  }

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() + weekOffset * 7)
  const weekDates = getWeekDates(weekStart)

  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return doctor.availableSlots.filter((s) => s.date === dateStr)
  }

  const handleConfirm = () => {
    if (selectedSlot) {
      navigate('/confirm', { state: { doctor, slot: selectedSlot } })
    }
  }

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="Select Time" subtitle={doctor.name} showBack />

      <div style={{ padding: 'var(--space-lg)' }}>
        {/* Week Navigation */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              style={{
                background: 'none',
                fontSize: '20px',
                opacity: weekOffset === 0 ? 0.3 : 1,
                padding: '8px',
              }}
            >
              ←
            </button>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 600 }}>
                {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              style={{ background: 'none', fontSize: '20px', padding: '8px' }}
            >
              →
            </button>
          </div>

          {/* Week Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 'var(--space-lg)' }}>
            {weekDates.map((date, i) => {
              const isToday = date.toDateString() === today.toDateString()
              const isWeekend = i >= 5
              const hasSlots = getSlotsForDate(date).some((s) => s.available)
              return (
                <div
                  key={i}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-sm)',
                    borderRadius: 'var(--radius-sm)',
                    background: isToday ? 'var(--primary)' : 'transparent',
                    color: isToday ? '#fff' : isWeekend ? 'var(--muted)' : 'var(--text)',
                    opacity: isWeekend ? 0.5 : 1,
                  }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 600 }}>{weekdayNames[i]}</p>
                  <p style={{ fontSize: '16px', fontWeight: 700 }}>{date.getDate()}</p>
                  {hasSlots && !isWeekend && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isToday ? '#fff' : 'var(--success)',
                        margin: '4px auto 0',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>

          <button
            onClick={() => setWeekOffset(0)}
            style={{
              background: 'none',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            Today
          </button>
        </Card>

        {/* Time Slots by Day */}
        {weekDates.slice(0, 5).map((date, i) => {
          const slots = getSlotsForDate(date)
          if (slots.length === 0) return null

          return (
            <Card key={i} style={{ marginTop: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: 'var(--space-md)', color: 'var(--muted)' }}>
                {date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {slots.map((slot) => (
                  <TimeSlot
                    key={slot.id}
                    time={slot.time}
                    active={selectedSlot?.id === slot.id}
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot)}
                  />
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Fixed CTA */}
      {selectedSlot && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 'var(--space-lg)',
            paddingBottom: 'var(--space-xl)',
            background: 'var(--card)',
            borderTop: '1px solid var(--border)',
          }}
        >
          <p style={{ fontSize: '14px', marginBottom: 'var(--space-sm)', color: 'var(--muted)' }}>
            Selected: {new Date(selectedSlot.date).toLocaleDateString('en-US')} at {selectedSlot.time}
          </p>
          <PrimaryButton fullWidth onClick={handleConfirm}>
            Select {selectedSlot.time}
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

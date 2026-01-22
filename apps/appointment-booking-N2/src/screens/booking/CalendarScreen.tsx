import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Header, Page, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { doctors, formatDate, timeSlotsByDoctorId } from '../../data/booking'

export default function CalendarScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = useMemo(() => doctors.find((d) => d.id === id), [id])
  const availability = useMemo(() => (id ? timeSlotsByDoctorId[id] || [] : []), [id])

  const [selectedDateISO, setSelectedDateISO] = useState(availability[0]?.dateISO || '')
  const selectedDay = availability.find((d) => d.dateISO === selectedDateISO)
  const [selectedTime, setSelectedTime] = useState(selectedDay?.slots[0] || '')

  if (!doctor) {
    return (
      <Page>
        <Header title="Calendar" backTo="/booking/results" />
        <Card>Doctor profile not found.</Card>
      </Page>
    )
  }

  const canContinue = Boolean(selectedDateISO && selectedTime)

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Choose time" backTo={`/booking/doctor/${doctor.id}`} />

        <Card>
          <div className="h2">{doctor.name}</div>
          <div className="label" style={{ marginTop: 6 }}>
            {doctor.specialty} · {doctor.city}
          </div>

          <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="label">Date</div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {availability.map((d) => (
                <SecondaryButton
                  key={d.dateISO}
                  onClick={() => {
                    setSelectedDateISO(d.dateISO)
                    setSelectedTime(d.slots[0] || '')
                  }}
                  disabled={d.dateISO === selectedDateISO}
                >
                  {formatDate(d.dateISO)}
                </SecondaryButton>
              ))}
            </div>

            <div className="label" style={{ marginTop: 'var(--space-3)' }}>Time</div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {(selectedDay?.slots || []).map((t) => (
                <SecondaryButton key={t} onClick={() => setSelectedTime(t)} disabled={t === selectedTime}>
                  {t}
                </SecondaryButton>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            disabled={!canContinue}
            onClick={() =>
              navigate('/booking/confirm', {
                state: { doctorId: doctor.id, dateISO: selectedDateISO, time: selectedTime },
              })
            }
          >
            Continue
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

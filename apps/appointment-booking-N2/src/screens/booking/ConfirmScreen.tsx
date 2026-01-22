import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, TabBar } from '../../components'
import { doctors } from '../../data/booking'
import { useAppState } from '../../state/AppState'

type ConfirmState = { doctorId: string; dateISO: string; time: string }

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addHistoryItem } = useAppState()

  const confirm = (location.state || null) as ConfirmState | null
  const doctor = useMemo(() => doctors.find((d) => d.id === confirm?.doctorId), [confirm?.doctorId])

  if (!confirm || !doctor) {
    return (
      <Page>
        <Header title="Confirmation" backTo="/booking/search" />
        <Card>
          <Pill tone="warn">Please choose a time first.</Pill>
        </Card>
      </Page>
    )
  }

  const dateLabel = new Date(`${confirm.dateISO}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Confirmation" subtitle="Please review the details" backTo={`/booking/doctor/${doctor.id}/calendar`} />

        <Card>
          <div className="h2">{doctor.name}</div>
          <div className="label" style={{ marginTop: 6 }}>
            {doctor.specialty} · {doctor.city}
          </div>
          <div className="label" style={{ marginTop: 6 }}>
            {doctor.address}
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Pill tone="info">{dateLabel}</Pill>
            <Pill tone="info">{confirm.time}</Pill>
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            onClick={() => {
              addHistoryItem({
                id: `appt_${Date.now()}`,
                type: 'appointment',
                title: 'Appointment: Doctor',
                subtitle: `${doctor.name} · ${doctor.city}`,
                dateISO: confirm.dateISO,
                status: 'planned',
              })
              navigate('/booking/success', { state: { doctorId: doctor.id, dateISO: confirm.dateISO, time: confirm.time } })
            }}
          >
            Confirm booking
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

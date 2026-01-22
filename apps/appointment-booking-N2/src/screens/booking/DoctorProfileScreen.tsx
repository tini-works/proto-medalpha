import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, TabBar } from '../../components'
import { doctors } from '../../data/booking'
import { useAppState } from '../../state/AppState'

export default function DoctorProfileScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state } = useAppState()
  const doctor = useMemo(() => doctors.find((d) => d.id === id), [id])

  if (!doctor) {
    return (
      <Page>
        <Header title="Profile" backTo="/booking/results" />
        <Card>
          <Pill tone="danger">Doctor profile not found.</Pill>
        </Card>
      </Page>
    )
  }

  const insuranceOk = state.profile.insuranceType ? doctor.accepts.includes(state.profile.insuranceType as any) : true

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Profile" backTo="/booking/results" />

        <Card>
          <div className="h2">{doctor.name}</div>
          <div className="label" style={{ marginTop: 6 }}>
            {doctor.specialty} · {doctor.city}
          </div>
          <div className="label" style={{ marginTop: 6 }}>Address: {doctor.address}</div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Pill tone={insuranceOk ? 'ok' : 'warn'}>Insurance: {insuranceOk ? 'compatible' : 'may not match'}</Pill>
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton fullWidth onClick={() => navigate(`/booking/doctor/${doctor.id}/calendar`)}>
            Choose time
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

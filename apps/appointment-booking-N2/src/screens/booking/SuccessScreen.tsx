import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'

type SuccessState = { dateISO: string; time: string }

export default function SuccessScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const data = (location.state || null) as SuccessState | null

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Success" subtitle="Appointment saved" backTo="/home" />

        <Card>
          <Pill tone="ok">Booking completed (prototype)</Pill>
          {data ? (
            <div className="label" style={{ marginTop: 'var(--space-4)' }}>
              {new Date(`${data.dateISO}T12:00:00`).toLocaleDateString('en-US')} · {data.time}
            </div>
          ) : null}
          <div className="label" style={{ marginTop: 10 }}>
            You can review the appointment in History and manage reminders.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton fullWidth onClick={() => navigate('/history')}>
            Go to History
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

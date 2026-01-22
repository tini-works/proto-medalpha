import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'

type TeleState = { specialty: string; patientId: string; symptoms: string }

export default function TeleWebViewScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const tele = (location.state || null) as TeleState | null

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Telemedicine" subtitle="Partner web view" backTo="/tele/symptoms" />

        <Card>
          <Pill tone="info">Teleclinic web view (placeholder)</Pill>
          <div className="label" style={{ marginTop: 'var(--space-4)' }}>
            In the real app, this hands off to the partner including camera and microphone checks.
          </div>
        </Card>

        <Card>
          <div className="h2">Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Pill tone="ok">Device check passed (prototype)</Pill>
            <Pill tone="info">Session active</Pill>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton fullWidth onClick={() => navigate('/tele/summary', { state: tele || {} })}>
            End consult
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/tele/symptoms')}>
            Report an issue
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="tele" />
    </Page>
  )
}

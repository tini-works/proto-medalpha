import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

type TeleState = { specialty?: string; symptoms?: string }

export default function TeleSummaryScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const tele = (location.state || {}) as TeleState
  const { addHistoryItem } = useAppState()

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Summary" subtitle="Telemedicine" backTo="/tele/entry" />

        <Card>
          <Pill tone="ok">Consult completed (prototype)</Pill>
          <div className="label" style={{ marginTop: 'var(--space-4)' }}>
            Specialty: {tele.specialty || '—'}
          </div>
          <div className="label" style={{ marginTop: 6 }}>
            Note: {tele.symptoms ? tele.symptoms.slice(0, 120) : '—'}
          </div>
        </Card>

        <Card>
          <div className="h2">Next step</div>
          <div className="label" style={{ marginTop: 6 }}>
            If you received a prescription, you can redeem it now.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            onClick={() => {
              addHistoryItem({
                id: `tele_${Date.now()}`,
                type: 'telemedicine',
                title: 'Telemedicine consult',
                subtitle: tele.specialty ? `Specialty: ${tele.specialty}` : 'Teleclinic',
                dateISO: new Date().toISOString().slice(0, 10),
                status: 'done',
              })
              navigate('/rx/entry')
            }}
          >
            Open ePrescription
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/home')}>
            Back to Home
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="tele" />
    </Page>
  )
}

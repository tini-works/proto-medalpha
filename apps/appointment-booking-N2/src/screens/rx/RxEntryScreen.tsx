import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, PrimaryButton, SecondaryButton, TabBar } from '../../components'

export default function RxEntryScreen() {
  const navigate = useNavigate()

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="ePrescription" subtitle="Redeem" backTo="/home" />

        <Card tone="mint">
          <div className="h2">Options</div>
          <div className="label" style={{ marginTop: 6 }}>
            Redeem online (NFC) or pick up nearby.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
          <Card>
            <div className="h2">Redeem online</div>
            <div className="label" style={{ marginTop: 6 }}>
              NFC scan with eGK, then delivery or click & collect.
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <PrimaryButton fullWidth onClick={() => navigate('/rx/online/scan')}>
                Start
              </PrimaryButton>
            </div>
          </Card>

          <Card>
            <div className="h2">Redeem in person</div>
            <div className="label" style={{ marginTop: 6 }}>
              Find dm stores and pharmacies nearby.
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SecondaryButton fullWidth onClick={() => navigate('/rx/offline/search')}>
                Search
              </SecondaryButton>
            </div>
          </Card>
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

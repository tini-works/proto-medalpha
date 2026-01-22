import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'

type TrackingState = { fulfillment?: 'delivery' | 'collect'; payback?: boolean; discreet?: boolean }

export default function RxTrackingScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const t = (location.state || {}) as TrackingState

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Tracking" subtitle="ePrescription" backTo="/rx/entry" />

        <Card>
          <div className="h2">Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Pill tone="ok">Order created</Pill>
            <Pill tone="info">Processing</Pill>
            <Pill tone="info">{t.fulfillment === 'collect' ? 'Ready for pickup' : 'Preparing shipment'}</Pill>
          </div>
          <div className="label" style={{ marginTop: 'var(--space-4)' }}>
            Payback: {t.payback ? 'on' : 'off'} · Discreet: {t.discreet ? 'on' : 'off'}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          {t.fulfillment === 'collect' ? (
            <PrimaryButton fullWidth onClick={() => navigate('/stores')}>
              Open Stores
            </PrimaryButton>
          ) : null}
          <SecondaryButton fullWidth onClick={() => navigate('/history')}>
            Go to History
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

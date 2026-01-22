import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'

export default function RxOnlineScanScreen() {
  const navigate = useNavigate()

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="NFC scan" subtitle="Redeem online" backTo="/rx/entry" />

        <Card>
          <Pill tone="info">Placeholder</Pill>
          <div className="label" style={{ marginTop: 'var(--space-4)' }}>
            Hold your eGK to the phone. In the real app, CardLink is used.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton fullWidth onClick={() => navigate('/rx/online/details')}>
            Simulate scan
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/rx/entry')}>
            Cancel
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

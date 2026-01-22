import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { mockRx } from '../../data/rx'

export default function RxOnlineDetailsScreen() {
  const navigate = useNavigate()
  const [fulfillment, setFulfillment] = useState<'delivery' | 'collect'>('delivery')
  const canContinue = useMemo(() => Boolean(fulfillment), [fulfillment])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Details" subtitle="ePrescription" backTo="/rx/online/scan" />

        <Card>
          <div className="h2">Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'var(--space-4)' }}>
            {mockRx.items.map((i) => (
              <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>{i.name}</div>
                <div className="label">{i.quantity}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Pill tone="info">Estimated total: {mockRx.estimatedTotalEUR}</Pill>
          </div>
        </Card>

        <Card>
          <div className="h2">Fulfillment</div>
          <div className="label" style={{ marginTop: 6 }}>
            Choose delivery or click & collect.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <SecondaryButton fullWidth onClick={() => setFulfillment('delivery')} disabled={fulfillment === 'delivery'}>
              Delivery
            </SecondaryButton>
            <SecondaryButton fullWidth onClick={() => setFulfillment('collect')} disabled={fulfillment === 'collect'}>
              Click & Collect
            </SecondaryButton>
          </div>
        </Card>

        <div style={{ marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            disabled={!canContinue}
            onClick={() => navigate('/rx/online/checkout', { state: { fulfillment } })}
          >
            Continue
          </PrimaryButton>
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

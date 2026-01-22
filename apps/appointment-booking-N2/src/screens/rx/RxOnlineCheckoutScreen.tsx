import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, Toggle, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

type CheckoutState = { fulfillment: 'delivery' | 'collect' }

export default function RxOnlineCheckoutScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, addHistoryItem } = useAppState()
  const checkout = (location.state || { fulfillment: 'delivery' }) as CheckoutState

  const [payback, setPayback] = useState(true)
  const [discreet, setDiscreet] = useState(false)

  const address = useMemo(() => {
    const p = state.profile
    return `${p.addressLine}, ${p.postalCode} ${p.city}`
  }, [state.profile])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Checkout" subtitle="ePrescription" backTo="/rx/online/details" />

        <Card>
          <div className="h2">Destination</div>
          {checkout.fulfillment === 'delivery' ? (
            <div className="label" style={{ marginTop: 6 }}>
              Deliver to: {address}
            </div>
          ) : (
            <div className="label" style={{ marginTop: 6 }}>
              Click & Collect: choose a store in the next step.
            </div>
          )}
        </Card>

        <Card>
          <div className="h2">Options</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <Toggle
              label="Apply Payback"
              description="Points are applied during checkout."
              checked={payback}
              onChange={setPayback}
            />
            <Toggle
              label="Discreet packaging"
              description="No sensitive information on the package."
              checked={discreet}
              onChange={setDiscreet}
            />
          </div>
        </Card>

        {checkout.fulfillment === 'collect' ? (
          <Card>
            <Pill tone="warn">Click & Collect requires a store selection.</Pill>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SecondaryButton fullWidth onClick={() => navigate('/stores')}>
                Open Stores
              </SecondaryButton>
            </div>
          </Card>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            onClick={() => {
              addHistoryItem({
                id: `rx_${Date.now()}`,
                type: 'rx',
                title: 'ePrescription redeemed',
                subtitle: checkout.fulfillment === 'delivery' ? 'Delivery' : 'Click & Collect',
                dateISO: new Date().toISOString().slice(0, 10),
                status: 'planned',
              })
              navigate('/rx/tracking', { state: { fulfillment: checkout.fulfillment, payback, discreet } })
            }}
          >
            Place order
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

import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { stores } from '../../data/stores'
import { useAppState } from '../../state/AppState'

type DetailState = { storeId: string }

export default function RxOfflineDetailScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addHistoryItem } = useAppState()
  const d = (location.state || null) as DetailState | null

  const store = useMemo(() => stores.find((s) => s.id === d?.storeId), [d?.storeId])

  if (!store) {
    return (
      <Page>
        <Header title="Location" backTo="/rx/offline/search" />
        <Card>
          <Pill tone="warn">Location not found.</Pill>
        </Card>
      </Page>
    )
  }

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Location" subtitle="Redeem in person" backTo="/rx/offline/search" />

        <Card>
          <div className="h2">{store.name}</div>
          <div className="label" style={{ marginTop: 6 }}>
            {store.address} · {store.city}
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Pill tone={store.openNow ? 'ok' : 'warn'}>{store.openNow ? 'Open now' : 'Closed'}</Pill>
          </div>
        </Card>

        <Card>
          <div className="h2">Actions</div>
          <div className="label" style={{ marginTop: 6 }}>
            In the real app, you would open Maps or call the location here.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <PrimaryButton
            fullWidth
            onClick={() => {
              addHistoryItem({
                id: `rx_off_${Date.now()}`,
                type: 'rx',
                title: 'ePrescription redeemed (in person)',
                subtitle: `${store.name} · ${store.city}`,
                dateISO: new Date().toISOString().slice(0, 10),
                status: 'done',
              })
              navigate('/history')
            }}
          >
            Confirm redeemed
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/stores')}>
            Open Stores
          </SecondaryButton>
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

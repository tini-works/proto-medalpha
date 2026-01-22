import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton, TabBar } from '../../components'
import { stores } from '../../data/stores'

export default function RxOfflineSearchScreen() {
  const navigate = useNavigate()

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="In person" subtitle="Find locations" backTo="/rx/entry" />

        <Card>
          <Pill tone="info">Location permission (placeholder)</Pill>
          <div className="label" style={{ marginTop: 'var(--space-4)' }}>
            In the real app, location is used to find nearby dm stores and pharmacies.
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}>
            <PrimaryButton fullWidth onClick={() => {}}>
              Allow
            </PrimaryButton>
            <SecondaryButton fullWidth onClick={() => {}}>
              Deny
            </SecondaryButton>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
          {stores.map((s) => (
            <Card key={s.id} onClick={() => navigate('/rx/offline/detail', { state: { storeId: s.id } })}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>
                {s.type === 'dm' ? 'dm' : 'Pharmacy'} · {s.name}
              </div>
              <div className="label" style={{ marginTop: 6 }}>
                {s.address} · {s.city} · {s.distanceKm.toFixed(1)} km
              </div>
            </Card>
          ))}
        </div>
      </div>

      <TabBar active="rx" />
    </Page>
  )
}

import { useNavigate } from 'react-router-dom'
import { Card, Page, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const upcoming = state.history.items.find((i) => i.type === 'appointment' && i.status === 'planned')

  return (
    <Page>
      <div className="safe-bottom">
        <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-4)' }}>
          <div className="h1">Home</div>
          <div className="label" style={{ marginTop: 6 }}>
            Hello, {state.profile.fullName || 'there'}.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Card tone="mint" onClick={() => navigate('/booking/search')}>
            <div className="h2">Book an appointment</div>
            <div className="label" style={{ marginTop: 6 }}>
              Search by specialty and location. You’ll get a clear confirmation.
            </div>
          </Card>

          {upcoming ? (
            <Card onClick={() => navigate('/history')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>{upcoming.title}</div>
                  <div className="label">{upcoming.subtitle}</div>
                </div>
                <div className="label kpi">{new Date(`${upcoming.dateISO}T12:00:00`).toLocaleDateString('en-US')}</div>
              </div>
            </Card>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <Card onClick={() => navigate('/tele/entry')}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>Telemedicine</div>
              <div className="label" style={{ marginTop: 6 }}>
                Start a video consult.
              </div>
            </Card>
            <Card onClick={() => navigate('/rx/entry')}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>ePrescription</div>
              <div className="label" style={{ marginTop: 6 }}>
                Redeem online or pick up nearby.
              </div>
            </Card>
            <Card onClick={() => navigate('/stores')}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>Stores</div>
              <div className="label" style={{ marginTop: 6 }}>
                dm and pharmacies nearby.
              </div>
            </Card>
            <Card onClick={() => navigate('/settings')}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>Settings</div>
              <div className="label" style={{ marginTop: 6 }}>
                Font size and notifications.
              </div>
            </Card>
          </div>

          <Card>
            <div className="h2">Updates</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>Health tip</div>
                  <div className="label">Short, clear guidance for everyday life.</div>
                </div>
                <div className="label">CMS</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>Offers</div>
                  <div className="label">Relevant deals, without marketing tone.</div>
                </div>
                <div className="label">CMS</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <TabBar active="home" />
    </Page>
  )
}

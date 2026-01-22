import { useMemo, useState } from 'react'
import { Card, Header, Page, Pill, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

type Filter = 'all' | 'appointment' | 'telemedicine' | 'rx'

export default function HistoryScreen() {
  const { state } = useAppState()
  const [filter, setFilter] = useState<Filter>('all')

  const items = useMemo(() => {
    const all = state.history.items
    if (filter === 'all') return all
    return all.filter((i) => i.type === filter)
  }, [filter, state.history.items])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="History" subtitle="Appointments, telemedicine, eRx" backTo="/home" />

        <Card>
          <div className="h2">Filter</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            {([
              { id: 'all', label: 'All' },
              { id: 'appointment', label: 'Appointments' },
              { id: 'telemedicine', label: 'Tele' },
              { id: 'rx', label: 'eRx' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  minHeight: 44,
                  padding: '10px 14px',
                  borderRadius: 9999,
                  border: 'var(--border)',
                  background: filter === f.id ? 'rgba(0,95,115,0.10)' : 'var(--neutral-0)',
                  color: filter === f.id ? 'var(--brand-blue-600)' : 'var(--neutral-800)',
                  fontWeight: 600,
                  fontSize: 'var(--text-14)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
          {items.length === 0 ? (
            <Card>
              <Pill tone="info">No entries for this filter.</Pill>
            </Card>
          ) : null}

          {items.map((i) => (
            <Card key={i.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>{i.title}</div>
                  <div className="label">{i.subtitle}</div>
                </div>
                <div className="label kpi">{new Date(`${i.dateISO}T12:00:00`).toLocaleDateString('en-US')}</div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Pill tone={i.status === 'done' ? 'ok' : i.status === 'canceled' ? 'danger' : 'info'}>
                  Status: {i.status === 'done' ? 'completed' : i.status === 'canceled' ? 'canceled' : 'planned'}
                </Pill>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <TabBar active="history" />
    </Page>
  )
}

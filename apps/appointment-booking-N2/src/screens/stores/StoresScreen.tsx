import { useMemo, useState } from 'react'
import { Card, Header, Page, Pill, TabBar } from '../../components'
import { stores } from '../../data/stores'

type Filter = 'all' | 'open' | 'dm' | 'pharmacy'

export default function StoresScreen() {
  const [filter, setFilter] = useState<Filter>('all')

  const list = useMemo(() => {
    let s = stores.slice()
    if (filter === 'open') s = s.filter((x) => x.openNow)
    if (filter === 'dm') s = s.filter((x) => x.type === 'dm')
    if (filter === 'pharmacy') s = s.filter((x) => x.type === 'pharmacy')
    return s.sort((a, b) => a.distanceKm - b.distanceKm)
  }, [filter])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Stores" subtitle="dm and pharmacies" backTo="/home" />

        <Card>
          <div className="h2">Filters</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
            {([
              { id: 'all', label: 'All' },
              { id: 'open', label: 'Open now' },
              { id: 'dm', label: 'dm' },
              { id: 'pharmacy', label: 'Pharmacy' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  minHeight: 44,
                  padding: '10px 14px',
                  borderRadius: 9999,
                  border: 'var(--border)',
                  background: filter === f.id ? 'rgba(10,147,150,0.12)' : 'var(--neutral-0)',
                  color: filter === f.id ? 'var(--brand-teal-600)' : 'var(--neutral-800)',
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
          {list.map((s) => (
            <Card key={s.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>
                    {s.type === 'dm' ? 'dm' : 'Pharmacy'} · {s.name}
                  </div>
                  <div className="label">
                    {s.address} · {s.city}
                  </div>
                </div>
                <div className="label kpi">{s.distanceKm.toFixed(1)} km</div>
              </div>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Pill tone={s.openNow ? 'ok' : 'warn'}>{s.openNow ? 'Open now' : 'Closed'}</Pill>
              </div>
            </Card>
          ))}
          <Card>
            <div className="label">
              Note: Maps are not integrated in the prototype. This list is a placeholder for Google Maps and the dm store finder.
            </div>
          </Card>
        </div>
      </div>

      <TabBar active="stores" />
    </Page>
  )
}

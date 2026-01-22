import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, TabBar } from '../../components'
import { doctors } from '../../data/booking'
import { useAppState } from '../../state/AppState'

type SearchState = { specialty: string; city: string }

export default function BookingResultsScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useAppState()
  const search = (location.state || { specialty: '', city: '' }) as SearchState

  const results = useMemo(() => {
    const s = search.specialty.toLowerCase()
    const c = search.city.toLowerCase()
    return doctors
      .filter((d) => d.specialty.toLowerCase().includes(s) || s.length === 0)
      .filter((d) => d.city.toLowerCase().includes(c) || c.length === 0)
      .filter((d) => (state.profile.insuranceType ? d.accepts.includes(state.profile.insuranceType as any) : true))
  }, [search.city, search.specialty, state.profile.insuranceType])

  return (
    <Page>
      <div className="safe-bottom">
        <Header
          title="Results"
          subtitle={search.specialty && search.city ? `${search.specialty} · ${search.city}` : 'Matches'}
          backTo="/booking/search"
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {results.length === 0 ? (
            <Card>
              <Pill tone="warn">No results. Please adjust your search.</Pill>
            </Card>
          ) : null}

          {results.map((d) => (
            <Card key={d.id} onClick={() => navigate(`/booking/doctor/${d.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-16)' }}>{d.name}</div>
                  <div className="label">
                    {d.specialty} · {d.city}
                  </div>
                </div>
                <div className="label kpi">{d.rating.toFixed(1)}</div>
              </div>
              <div className="label" style={{ marginTop: 8 }}>
                Next available: {new Date(`${d.nextAvailableISO}T12:00:00`).toLocaleDateString('en-US')}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

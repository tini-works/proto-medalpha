import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, PrimaryButton, TabBar } from '../../components'
import { useAppState } from '../../state/AppState'

export default function BookingSearchScreen() {
  const navigate = useNavigate()
  const { state } = useAppState()
  const [specialty, setSpecialty] = useState('Primary care')
  const [city, setCity] = useState(state.profile.city || 'Berlin')

  const canSearch = useMemo(() => specialty.trim().length >= 3 && city.trim().length >= 2, [specialty, city])

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Booking" subtitle="Find a doctor appointment" backTo="/home" />

        <Card>
          <div className="h2">Search</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Field label="Specialty" value={specialty} onChange={setSpecialty} placeholder="e.g. Dermatology" />
            <Field label="City" value={city} onChange={setCity} placeholder="e.g. Berlin" />
            <div className="label">
              Insurance:{' '}
              <span style={{ fontWeight: 600, color: 'var(--neutral-800)' }}>{state.profile.insuranceType || '—'}</span>
            </div>
            <PrimaryButton
              fullWidth
              disabled={!canSearch}
              onClick={() => navigate('/booking/results', { state: { specialty: specialty.trim(), city: city.trim() } })}
            >
              Show results
            </PrimaryButton>
          </div>
        </Card>
      </div>

      <TabBar active="booking" />
    </Page>
  )
}

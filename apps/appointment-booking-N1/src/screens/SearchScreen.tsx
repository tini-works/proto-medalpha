import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Input, PrimaryButton, Chip, Card } from '../components'
import { specialties, recentSearches } from '../data/mockData'

export default function SearchScreen() {
  const navigate = useNavigate()
  const [specialty, setSpecialty] = useState('')
  const [location, setLocation] = useState('')
  const [insurance, setInsurance] = useState<'public' | 'private'>('public')
  const [showSpecialtySuggestions, setShowSpecialtySuggestions] = useState(false)

  const filteredSpecialties = specialties.filter((s) =>
    s.toLowerCase().includes(specialty.toLowerCase())
  )

  const handleSearch = () => {
    navigate('/results', {
      state: { specialty, location, insurance },
    })
  }

  return (
    <div>
      <Header title="Book Appointment" showBack />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Specialty Input */}
        <div>
          <Input
            label="Specialty"
            placeholder="e.g. Dermatology, ENT..."
            value={specialty}
            onChange={(val) => {
              setSpecialty(val)
              setShowSpecialtySuggestions(val.length >= 2)
            }}
            icon={<span>🔍</span>}
          />
          {showSpecialtySuggestions && filteredSpecialties.length > 0 && (
            <Card style={{ marginTop: '-12px', padding: 'var(--space-sm)' }}>
              {filteredSpecialties.slice(0, 5).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpecialty(s)
                    setShowSpecialtySuggestions(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: 'var(--space-md)',
                    background: 'none',
                    fontSize: '15px',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {s}
                </button>
              ))}
            </Card>
          )}
        </div>

        {/* Quick Specialty Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', marginTop: '-8px' }}>
          {['General Practitioner', 'Dermatology', 'ENT', 'Dentist'].map((s) => (
            <Chip key={s} active={specialty === s} onClick={() => setSpecialty(s)}>
              {s}
            </Chip>
          ))}
        </div>

        {/* Location Input */}
        <div>
          <Input
            label="City or ZIP Code"
            placeholder="e.g. Berlin, 10115..."
            value={location}
            onChange={setLocation}
            icon={<span>📍</span>}
          />
          <button
            onClick={() => setLocation('Berlin (GPS)')}
            style={{
              background: 'none',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 600,
              marginTop: '-8px',
            }}
          >
            📍 Use current location
          </button>
        </div>

        {/* Insurance Toggle */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
            Insurance
          </label>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <Chip active={insurance === 'public'} onClick={() => setInsurance('public')}>
              Public Insurance
            </Chip>
            <Chip active={insurance === 'private'} onClick={() => setInsurance('private')}>
              Private Insurance
            </Chip>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Recent Searches</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    const [spec, loc] = search.split(' · ')
                    setSpecialty(spec)
                    setLocation(loc)
                  }}
                  style={{
                    background: '#F3F4F6',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Button */}
        <PrimaryButton fullWidth onClick={handleSearch} disabled={!specialty || !location}>
          Find Doctors
        </PrimaryButton>
      </div>
    </div>
  )
}

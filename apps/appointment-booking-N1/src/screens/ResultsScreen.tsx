import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header, Card, Tag, TimeSlot, Chip, BottomSheet, EmptyState } from '../components'
import { doctors, Doctor, TimeSlot as TimeSlotType } from '../data/mockData'

export default function ResultsScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = location.state as { specialty?: string; location?: string; insurance?: string } | null

  const [sortBy, setSortBy] = useState<'soonest' | 'distance' | 'rating'>('soonest')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    distance: 10,
    videoOnly: false,
    publicOnly: false,
  })

  // Filter and sort doctors
  let filteredDoctors = doctors.filter((d) => {
    if (searchParams?.specialty && !d.specialty.toLowerCase().includes(searchParams.specialty.toLowerCase())) {
      return false
    }
    if (filters.publicOnly && !d.insuranceTypes.includes('Kasse')) return false
    if (filters.videoOnly && !d.hasVideo) return false
    if (d.distance > filters.distance) return false
    return true
  })

  filteredDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortBy === 'distance') return a.distance - b.distance
    if (sortBy === 'rating') return b.rating - a.rating
    // soonest - by first available slot
    const aSlot = a.availableSlots.find((s) => s.available)
    const bSlot = b.availableSlots.find((s) => s.available)
    if (!aSlot) return 1
    if (!bSlot) return -1
    return new Date(aSlot.date + 'T' + aSlot.time).getTime() - new Date(bSlot.date + 'T' + bSlot.time).getTime()
  })

  const handleQuickBook = (doctor: Doctor, slot: TimeSlotType) => {
    navigate('/confirm', { state: { doctor, slot } })
  }

  return (
    <div style={{ paddingBottom: 'var(--space-3xl)' }}>
      <Header
        title="Results"
        subtitle={`${filteredDoctors.length} doctors found`}
        showBack
        rightAction={
          <button
            onClick={() => setShowFilters(true)}
            style={{
              background: '#E0ECFF',
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--primary)',
            }}
          >
            Filter {filters.publicOnly || filters.videoOnly ? '(1)' : ''}
          </button>
        }
      />

      {/* Sort Options */}
      <div style={{ padding: '0 var(--space-lg) var(--space-md)', display: 'flex', gap: 'var(--space-sm)' }}>
        {[
          { id: 'soonest', label: 'Soonest' },
          { id: 'distance', label: 'Distance' },
          { id: 'rating', label: 'Rating' },
        ].map((opt) => (
          <Chip
            key={opt.id}
            active={sortBy === opt.id}
            onClick={() => setSortBy(opt.id as typeof sortBy)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      {/* Results */}
      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {filteredDoctors.length === 0 ? (
          <EmptyState
            title="No results"
            description="Try adjusting your filters or expanding your search radius."
          />
        ) : (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onCardClick={() => navigate(`/doctor/${doctor.id}`)}
              onSlotClick={(slot) => handleQuickBook(doctor, slot)}
            />
          ))
        )}
      </div>

      {/* Filter Sheet */}
      <BottomSheet open={showFilters} onClose={() => setShowFilters(false)}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-xl)' }}>Filters</h3>

        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
            Maximum distance: {filters.distance} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={filters.distance}
            onChange={(e) => setFilters({ ...filters, distance: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <input
            type="checkbox"
            checked={filters.publicOnly}
            onChange={(e) => setFilters({ ...filters, publicOnly: e.target.checked })}
            style={{ width: '20px', height: '20px' }}
          />
          <span>Public insurance only</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
          <input
            type="checkbox"
            checked={filters.videoOnly}
            onChange={(e) => setFilters({ ...filters, videoOnly: e.target.checked })}
            style={{ width: '20px', height: '20px' }}
          />
          <span>Video available</span>
        </label>

        <button
          onClick={() => setFilters({ distance: 10, videoOnly: false, publicOnly: false })}
          style={{ background: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}
        >
          Reset filters
        </button>
      </BottomSheet>
    </div>
  )
}

function DoctorCard({
  doctor,
  onCardClick,
  onSlotClick,
}: {
  doctor: Doctor
  onCardClick: () => void
  onSlotClick: (slot: TimeSlotType) => void
}) {
  const availableSlots = doctor.availableSlots.filter((s) => s.available).slice(0, 3)
  const hasSlots = availableSlots.length > 0

  return (
    <Card style={{ opacity: hasSlots ? 1 : 0.6 }}>
      <div onClick={onCardClick} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: '16px' }}>{doctor.name}</p>
            <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
              {doctor.specialty} · {doctor.distance} km
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#F59E0B' }}>★</span>
            <span style={{ fontWeight: 600 }}>{doctor.rating}</span>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>({doctor.reviewCount})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
          {doctor.insuranceTypes.map((type) => (
            <Tag key={type} tone={type === 'Kasse' ? 'success' : 'muted'}>
              {type === 'Kasse' ? 'Public' : 'Private'}
            </Tag>
          ))}
          {doctor.hasVideo && <Tag tone="primary">Video available</Tag>}
        </div>
      </div>

      {hasSlots ? (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {availableSlots.map((slot) => (
              <TimeSlot
                key={slot.id}
                time={slot.time}
                onClick={() => onSlotClick(slot)}
              />
            ))}
          </div>
          <button
            onClick={onCardClick}
            style={{
              background: 'none',
              color: 'var(--primary)',
              fontSize: '14px',
              fontWeight: 600,
              marginTop: 'var(--space-md)',
            }}
          >
            More times →
          </button>
        </div>
      ) : (
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: 'var(--space-md)' }}>
          No slots available today
        </p>
      )}
    </Card>
  )
}

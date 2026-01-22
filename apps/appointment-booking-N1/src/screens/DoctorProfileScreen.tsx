import { useNavigate, useParams } from 'react-router-dom'
import { Header, Card, Tag, PrimaryButton, StarRating } from '../components'
import { doctors, reviews } from '../data/mockData'

export default function DoctorProfileScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const doctor = doctors.find((d) => d.id === id)
  const doctorReviews = reviews.filter((r) => r.doctorId === id).slice(0, 3)

  if (!doctor) {
    return <div style={{ padding: 'var(--space-lg)' }}>Doctor not found</div>
  }

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title={doctor.name} subtitle={doctor.specialty} showBack />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Doctor Header Card */}
        <Card>
          <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-lg)',
                background: '#E0ECFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
              }}
            >
              👨‍⚕️
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{doctor.name}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{doctor.specialty}</p>
              <div style={{ marginTop: 'var(--space-sm)' }}>
                <StarRating rating={doctor.rating} count={doctor.reviewCount} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
            {doctor.insuranceTypes.map((type) => (
              <Tag key={type} tone={type === 'Kasse' ? 'success' : 'muted'}>
                {type === 'Kasse' ? 'Public' : 'Private'}
              </Tag>
            ))}
            {doctor.hasVideo && <Tag tone="primary">Video available</Tag>}
            {doctor.languages.map((lang) => (
              <Tag key={lang} tone="muted">
                {lang}
              </Tag>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>About</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{doctor.about}</p>
        </Card>

        {/* Services */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Services</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {doctor.services.map((service) => (
              <div
                key={service}
                style={{
                  padding: 'var(--space-md)',
                  background: '#F9FAFB',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                }}
              >
                {service}
              </div>
            ))}
          </div>
        </Card>

        {/* Location */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Location</h3>
          <div
            style={{
              height: '120px',
              background: '#E0ECFF',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-md)',
            }}
          >
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Map</span>
          </div>
          <p style={{ fontWeight: 600 }}>{doctor.address}</p>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
            {doctor.city} · {doctor.distance} km away
          </p>
        </Card>

        {/* Reviews */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Reviews</h3>
            <button style={{ background: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}>
              View all
            </button>
          </div>

          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <StarRating rating={doctor.rating} count={doctor.reviewCount} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {doctorReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: 'var(--space-md)',
                  background: '#F9FAFB',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{review.authorInitials}</span>
                  <span style={{ color: '#F59E0B', fontSize: '14px' }}>{'★'.repeat(review.rating)}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{review.text}</p>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                  {new Date(review.date).toLocaleDateString('en-US')}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fixed CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--space-lg)',
          paddingBottom: 'var(--space-xl)',
          background: 'var(--card)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <PrimaryButton fullWidth onClick={() => navigate(`/doctor/${id}/calendar`)}>
          Book Appointment
        </PrimaryButton>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { Card, PrimaryButton, Tag, TabBar } from '../components'
import { upcomingAppointments, formatShortDate } from '../data/mockData'

export default function HomeScreen() {
  const navigate = useNavigate()
  const nextAppointment = upcomingAppointments[0]

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ padding: 'var(--space-lg)', paddingTop: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>MedAlpha</h1>
        <p style={{ color: 'var(--muted)', marginTop: '4px' }}>Welcome back</p>
      </div>

      <div style={{ padding: '0 var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Main CTA */}
        <Card style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' }}>
          <div style={{ color: '#fff' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Book Appointment</h2>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: 'var(--space-lg)' }}>
              Find a doctor appointment near you quickly
            </p>
            <PrimaryButton
              onClick={() => navigate('/search')}
              style={{ background: 'var(--accent)', color: 'var(--text)' }}
            >
              Search Now
            </PrimaryButton>
          </div>
        </Card>

        {/* Next Appointment */}
        {nextAppointment && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Next Appointment</h3>
            <Card onClick={() => navigate(`/appointments/${nextAppointment.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '16px' }}>{nextAppointment.doctor.name}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{nextAppointment.doctor.specialty}</p>
                </div>
                <Tag tone="primary">{formatShortDate(nextAppointment.date)}</Tag>
              </div>
              <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-lg)' }}>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Time</p>
                  <p style={{ fontWeight: 600 }}>{nextAppointment.time}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Address</p>
                  <p style={{ fontWeight: 600 }}>{nextAppointment.doctor.address}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: 'var(--space-md)' }}>Quick Access</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <Card onClick={() => navigate('/appointments')} style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📅</div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>My Appointments</p>
            </Card>
            <Card onClick={() => navigate('/appointments/history')} style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>📋</div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>History</p>
            </Card>
          </div>
        </div>
      </div>

      <TabBar active="home" />
    </div>
  )
}

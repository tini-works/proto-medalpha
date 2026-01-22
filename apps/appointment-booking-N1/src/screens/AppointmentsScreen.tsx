import { useNavigate } from 'react-router-dom'
import { Header, Card, Tag, TabBar, EmptyState } from '../components'
import { upcomingAppointments, formatShortDate } from '../data/mockData'

export default function AppointmentsScreen() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="My Appointments" subtitle="Upcoming appointments" />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            title="No upcoming appointments"
            description="Book your next doctor appointment now."
          />
        ) : (
          upcomingAppointments.map((apt) => (
            <Card key={apt.id} onClick={() => navigate(`/appointments/${apt.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: 'var(--radius-md)',
                      background: '#E0ECFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    👨‍⚕️
                  </div>
                  <div>
                    <p style={{ fontWeight: 700 }}>{apt.doctor.name}</p>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{apt.doctor.specialty}</p>
                  </div>
                </div>
                <Tag tone="primary">{formatShortDate(apt.date)}</Tag>
              </div>

              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  paddingTop: 'var(--space-md)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  gap: 'var(--space-xl)',
                }}
              >
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Time</p>
                  <p style={{ fontWeight: 600 }}>{apt.time}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Address</p>
                  <p style={{ fontWeight: 600 }}>{apt.doctor.address}</p>
                </div>
              </div>
            </Card>
          ))
        )}

        <button
          onClick={() => navigate('/appointments/history')}
          style={{
            background: 'none',
            color: 'var(--primary)',
            fontWeight: 600,
            padding: 'var(--space-lg)',
            textAlign: 'center',
          }}
        >
          View past appointments →
        </button>
      </div>

      <TabBar active="appointments" />
    </div>
  )
}

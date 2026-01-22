import { useNavigate } from 'react-router-dom'
import { Header, Card, Tag, EmptyState } from '../components'
import { pastAppointments, formatShortDate } from '../data/mockData'

export default function HistoryScreen() {
  const navigate = useNavigate()

  return (
    <div>
      <Header title="Past Appointments" showBack />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {pastAppointments.length === 0 ? (
          <EmptyState
            title="No past appointments"
            description="Your completed and cancelled appointments will appear here."
          />
        ) : (
          pastAppointments.map((apt) => (
            <Card key={apt.id} onClick={() => navigate(`/appointments/${apt.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: 'var(--radius-md)',
                      background: '#F3F4F6',
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{formatShortDate(apt.date)}</span>
                  <Tag tone={apt.status === 'completed' ? 'success' : 'danger'}>
                    {apt.status === 'completed' ? 'Completed' : 'Cancelled'}
                  </Tag>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/doctor/${apt.doctor.id}/calendar`)
                }}
                style={{
                  background: 'none',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginTop: 'var(--space-md)',
                }}
              >
                Book again →
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

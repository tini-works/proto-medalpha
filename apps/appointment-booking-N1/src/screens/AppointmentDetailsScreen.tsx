import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Card, PrimaryButton, SecondaryButton, BottomSheet, Tag } from '../components'
import { upcomingAppointments, pastAppointments, formatDate } from '../data/mockData'

export default function AppointmentDetailsScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const appointment = [...upcomingAppointments, ...pastAppointments].find((a) => a.id === id)

  if (!appointment) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <p>Appointment not found.</p>
        <PrimaryButton onClick={() => navigate('/appointments')}>Back to Appointments</PrimaryButton>
      </div>
    )
  }

  const isUpcoming = appointment.status === 'upcoming'

  const handleCancel = () => {
    setShowCancelDialog(false)
    alert('Appointment cancelled')
    navigate('/appointments/history')
  }

  const handleReschedule = () => {
    navigate(`/doctor/${appointment.doctor.id}/calendar`)
  }

  const handleRebook = () => {
    navigate(`/doctor/${appointment.doctor.id}/calendar`)
  }

  const handleOpenRoute = () => {
    alert(`Directions to: ${appointment.doctor.address}, ${appointment.doctor.city}`)
  }

  return (
    <div>
      <Header title="Appointment Details" showBack />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Status Badge */}
        {!isUpcoming && (
          <Tag tone={appointment.status === 'completed' ? 'success' : 'danger'}>
            {appointment.status === 'completed' ? 'Completed' : 'Cancelled'}
          </Tag>
        )}

        {/* Doctor Info */}
        <Card>
          <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                background: '#E0ECFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              👨‍⚕️
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '16px' }}>{appointment.doctor.name}</p>
              <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{appointment.doctor.specialty}</p>
              <button
                onClick={() => navigate(`/doctor/${appointment.doctor.id}`)}
                style={{ background: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: 600, marginTop: '4px' }}
              >
                View profile →
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Date</p>
              <p style={{ fontWeight: 600 }}>{formatDate(appointment.date)}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Time</p>
              <p style={{ fontWeight: 600 }}>{appointment.time}</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Duration</p>
              <p style={{ fontWeight: 600 }}>{appointment.duration} minutes</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Patient</p>
              <p style={{ fontWeight: 600 }}>{appointment.patient}</p>
            </div>
          </div>

          {appointment.reason && (
            <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Reason for visit</p>
              <p>{appointment.reason}</p>
            </div>
          )}
        </Card>

        {/* Location */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Location</h3>
          <div
            style={{
              height: '100px',
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
          <p style={{ fontWeight: 600 }}>{appointment.doctor.address}</p>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{appointment.doctor.city}</p>
          <SecondaryButton onClick={handleOpenRoute} style={{ marginTop: 'var(--space-md)', width: '100%' }}>
            🗺️ Get Directions
          </SecondaryButton>
        </Card>

        {/* Confirmation Number */}
        <Card style={{ background: '#F9FAFB' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Confirmation Number</p>
          <p style={{ fontWeight: 700, fontFamily: 'monospace' }}>{appointment.confirmationNumber}</p>
        </Card>

        {/* Actions */}
        {isUpcoming ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <PrimaryButton fullWidth onClick={handleReschedule}>
              Reschedule Appointment
            </PrimaryButton>
            <SecondaryButton
              fullWidth
              onClick={() => setShowCancelDialog(true)}
              style={{ color: 'var(--danger)' }}
            >
              Cancel Appointment
            </SecondaryButton>
          </div>
        ) : (
          <PrimaryButton fullWidth onClick={handleRebook}>
            Book Again
          </PrimaryButton>
        )}
      </div>

      {/* Cancel Dialog */}
      <BottomSheet open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Cancel Appointment?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Are you sure you want to cancel this appointment?
        </p>
        <Card style={{ background: '#FFF8E1', border: 'none', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: '14px', color: '#8D6E00' }}>
            <strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before the appointment.
          </p>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <PrimaryButton fullWidth onClick={handleCancel} style={{ background: 'var(--danger)' }}>
            Yes, Cancel Appointment
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => setShowCancelDialog(false)}>
            Keep Appointment
          </SecondaryButton>
        </div>
      </BottomSheet>
    </div>
  )
}

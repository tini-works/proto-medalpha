import { useNavigate, useLocation } from 'react-router-dom'
import { Card, PrimaryButton, SecondaryButton } from '../components'
import { Doctor, TimeSlot, formatDate } from '../data/mockData'

export default function SuccessScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { doctor, slot, patient, confirmationNumber } = (location.state as {
    doctor: Doctor
    slot: TimeSlot
    patient: string
    confirmationNumber: string
  }) || {}

  if (!doctor || !slot) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <p>No booking data found.</p>
        <PrimaryButton onClick={() => navigate('/')}>Back to Home</PrimaryButton>
      </div>
    )
  }

  const handleAddToCalendar = () => {
    alert('Appointment added to calendar!')
  }

  const handleOpenRoute = () => {
    alert(`Directions to: ${doctor.address}, ${doctor.city}`)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Success Animation */}
        <div style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--success-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-lg)',
              fontSize: '40px',
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--success)', marginBottom: '8px' }}>
            Appointment Confirmed!
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            You will receive a confirmation via email and push notification.
          </p>
        </div>

        {/* Booking Details */}
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Confirmation Number</p>
            <p style={{ fontWeight: 700, fontSize: '16px', fontFamily: 'monospace' }}>{confirmationNumber}</p>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
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
                <p style={{ fontWeight: 700 }}>{doctor.name}</p>
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>{doctor.specialty}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Date</p>
                <p style={{ fontWeight: 600 }}>{formatDate(slot.date)}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Time</p>
                <p style={{ fontWeight: 600 }}>{slot.time}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Patient</p>
                <p style={{ fontWeight: 600 }}>{patient}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Address</p>
                <p style={{ fontWeight: 600 }}>{doctor.address}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
          <PrimaryButton onClick={handleAddToCalendar} style={{ flex: 1 }}>
            📅 Add to Calendar
          </PrimaryButton>
          <SecondaryButton onClick={handleOpenRoute} style={{ flex: 1 }}>
            🗺️ Get Directions
          </SecondaryButton>
        </div>

        {/* Done Button */}
        <PrimaryButton fullWidth onClick={() => navigate('/')} style={{ background: 'var(--text)' }}>
          Done
        </PrimaryButton>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Header, Card, PrimaryButton, SecondaryButton, Chip } from '../components'
import { Doctor, TimeSlot, familyMembers, formatDate } from '../data/mockData'

export default function ConfirmScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { doctor, slot } = (location.state as { doctor: Doctor; slot: TimeSlot }) || {}

  const [reason, setReason] = useState('')
  const [patient, setPatient] = useState('self')

  if (!doctor || !slot) {
    return (
      <div style={{ padding: 'var(--space-lg)' }}>
        <p>No booking data found.</p>
        <PrimaryButton onClick={() => navigate('/')}>Back to Home</PrimaryButton>
      </div>
    )
  }

  const handleConfirm = () => {
    // Simulate booking
    const confirmationNumber = `MEDA-2026-${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`
    navigate('/success', {
      state: {
        doctor,
        slot,
        patient: familyMembers.find((m) => m.id === patient)?.name || 'Me',
        confirmationNumber,
      },
    })
  }

  return (
    <div>
      <Header title="Confirm Appointment" showBack />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Summary Card */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Summary</h3>

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
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Duration</p>
              <p style={{ fontWeight: 600 }}>{slot.duration} minutes</p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Address</p>
              <p style={{ fontWeight: 600 }}>{doctor.address}</p>
            </div>
          </div>
        </Card>

        {/* Patient Selector */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>Who is this appointment for?</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {familyMembers.map((member) => (
              <Chip key={member.id} active={patient === member.id} onClick={() => setPatient(member.id)}>
                {member.name}
              </Chip>
            ))}
          </div>
        </Card>

        {/* Reason */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Reason for visit <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(optional)</span>
          </h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value.slice(0, 200))}
            placeholder="Briefly describe why you need this appointment..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: 'var(--space-md)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
          <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'right', marginTop: '4px' }}>
            {reason.length}/200
          </p>
        </Card>

        {/* Cost Info */}
        <Card style={{ background: 'var(--success-light)', border: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ fontSize: '24px' }}>✓</span>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--success)' }}>Covered by Insurance</p>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                This appointment is covered by your public health insurance.
              </p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <PrimaryButton fullWidth onClick={handleConfirm}>
            Confirm Appointment
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate(-1)}>
            Cancel
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

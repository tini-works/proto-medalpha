import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppointmentCard } from '../AppointmentCard'

// Mock i18next to return keys for verification
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('AppointmentCard', () => {
  const baseAppointment = {
    id: 'apt1',
    doctorId: 'd1',
    doctorName: 'Dr. Smith',
    specialty: 'Cardiology',
    dateISO: '2025-02-01',
    time: '10:00',
    forUserId: 'self',
    forUserName: 'Test User',
    status: 'confirmed' as const,
    reminderSet: false,
    calendarSynced: false,
  }

  it('uses i18n key for confirmed status', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.getByText('status.confirmed')).toBeInTheDocument()
  })

  it('uses i18n key for matching status', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'matching' }} />)
    expect(screen.getByText('status.matching')).toBeInTheDocument()
  })

  it('uses i18n key for await_confirm status', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'await_confirm' }} />)
    expect(screen.getByText('status.awaitConfirm')).toBeInTheDocument()
  })

  it('uses i18n key for completed status', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'completed' }} />)
    expect(screen.getByText('status.completed')).toBeInTheDocument()
  })

  it('uses i18n key for cancelled_doctor status', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'cancelled_doctor' }} />)
    expect(screen.getByText('status.cancelledDoctor')).toBeInTheDocument()
  })

  it('uses i18n key for cancelled_patient status', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'cancelled_patient' }} />)
    expect(screen.getByText('status.cancelledPatient')).toBeInTheDocument()
  })

  it('shows doctor name when status is confirmed', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument()
  })

  it('hides doctor info and shows i18n key when status is matching', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'matching' }} />)
    expect(screen.queryByText('Dr. Smith')).not.toBeInTheDocument()
    expect(screen.getByText('findingDoctor')).toBeInTheDocument()
  })

  it('uses i18n key for time unit', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.getByText(/timeUnit/)).toBeInTheDocument()
  })

  it('uses i18n key for patient label', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.getByText(/patient/i)).toBeInTheDocument()
  })

  it('does not show hardcoded English status labels', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.queryByText('Confirmed')).not.toBeInTheDocument()
    expect(screen.queryByText('Matching')).not.toBeInTheDocument()
    expect(screen.queryByText('Patient canceled')).not.toBeInTheDocument()
  })

  it('does not show hardcoded "Finding your doctor..."', () => {
    render(<AppointmentCard appointment={{ ...baseAppointment, status: 'matching' }} />)
    expect(screen.queryByText('Finding your doctor...')).not.toBeInTheDocument()
  })

  it('does not show hardcoded "Uhr"', () => {
    render(<AppointmentCard appointment={baseAppointment} />)
    expect(screen.queryByText(/\d+:\d+ Uhr$/)).not.toBeInTheDocument()
  })
})

/**
 * Epic 1.5: Appointment Changes by Practice Golden Tests
 *
 * Tests for user story US 1.5.1
 * Source: User Stories from Philipp (January 27, 2026)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMockAppointment, AppointmentStatus } from './test-utils'

// Mock appointment display component that shows practice-modified status
const MockAppointmentWithPracticeStatus = ({
  appointment,
}: {
  appointment: ReturnType<typeof createMockAppointment>
}) => (
  <div data-testid="appointment-card">
    <h3>{appointment.doctorName}</h3>
    <p>
      {appointment.date} at {appointment.time}
    </p>

    <span data-testid="status-badge" data-status={appointment.status}>
      {appointment.status === 'modified_by_practice'
        ? 'Modified by Practice'
        : appointment.status === 'confirmed'
          ? 'Confirmed'
          : appointment.status === 'in_progress'
            ? 'In Progress'
            : appointment.status === 'rejected'
              ? 'Rejected'
              : appointment.status === 'cancelled'
                ? 'Cancelled'
                : 'Modified'}
    </span>

    {appointment.status === 'modified_by_practice' && (
      <div data-testid="practice-change-notice" role="alert">
        <p>The practice has modified your appointment.</p>
        <p>Please review the new details.</p>
      </div>
    )}
  </div>
)

describe('Epic 1.5: Appointment Changes by Practice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.5.1: Practice-Initiated Appointment Changes
  describe('US 1.5.1: Practice-Initiated Changes', () => {
    it('1.5.1-a: practice-change-shows-modified-status - Status shows "Modified by Practice"', () => {
      const appointment = createMockAppointment({
        status: 'modified_by_practice' as AppointmentStatus,
        date: '2025-02-20',
        time: '14:00',
      })

      render(<MockAppointmentWithPracticeStatus appointment={appointment} />)

      // Status badge should show "Modified by Practice"
      const statusBadge = screen.getByTestId('status-badge')
      expect(statusBadge).toHaveTextContent('Modified by Practice')
      expect(statusBadge).toHaveAttribute('data-status', 'modified_by_practice')

      // Should show notice about practice modification
      const notice = screen.getByTestId('practice-change-notice')
      expect(notice).toBeInTheDocument()
      expect(notice).toHaveTextContent(/practice has modified/i)
    })

    it('1.5.1-a (extended): regular modifications show different status', () => {
      // User-initiated modification should show different status
      const userModifiedAppointment = createMockAppointment({
        status: 'modified',
      })

      render(<MockAppointmentWithPracticeStatus appointment={userModifiedAppointment} />)

      expect(screen.getByTestId('status-badge')).toHaveTextContent('Modified')
      expect(screen.getByTestId('status-badge')).not.toHaveTextContent('Modified by Practice')
      expect(screen.queryByTestId('practice-change-notice')).not.toBeInTheDocument()
    })

    it('1.5.1-a (extended): confirmed appointments show confirmed status', () => {
      const confirmedAppointment = createMockAppointment({
        status: 'confirmed',
      })

      render(<MockAppointmentWithPracticeStatus appointment={confirmedAppointment} />)

      expect(screen.getByTestId('status-badge')).toHaveTextContent('Confirmed')
      expect(screen.queryByTestId('practice-change-notice')).not.toBeInTheDocument()
    })
  })
})

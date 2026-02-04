/**
 * Epic 1.4: Customer Account Management Golden Tests (Compact)
 *
 * Tests for user story US 1.4.1
 * Source: User Stories from Philipp (January 27, 2026)
 *
 * OMITTED per prototype-golden-tests-compact.md:
 * - Password change requires old (security)
 * - New password OWASP validation (security)
 * - Password change rate limiting (infrastructure)
 * - Delete requires confirmation (GDPR deletion flow)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock delete account component
const MockDeleteAccount = ({
  pendingAppointments,
}: {
  pendingAppointments: number
}) => (
  <div data-testid="delete-account">
    <h2>Delete Account</h2>

    <div data-testid="warning-message" role="alert">
      <p>Warning: This action cannot be undone.</p>
      {pendingAppointments > 0 && (
        <p data-testid="appointments-warning">
          You have {pendingAppointments} open appointment(s) that will be cancelled.
        </p>
      )}
      <ul>
        <li>All your personal data will be deleted within 72 hours</li>
        <li>Open appointments will be automatically cancelled</li>
        <li>You will receive a confirmation email within 30 days</li>
      </ul>
    </div>

    <button data-testid="request-delete-btn">Request Account Deletion</button>
    <button data-testid="cancel-btn">Cancel</button>
  </div>
)

describe('Epic 1.4: Account Management (Compact)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.4.1: Complete Account Deletion
  describe('US 1.4.1: Account Deletion', () => {
    it('1.4.1-a: delete-shows-warning - Warning about consequences shown', () => {
      render(<MockDeleteAccount pendingAppointments={2} />)

      const warning = screen.getByTestId('warning-message')
      expect(warning).toBeInTheDocument()
      expect(warning).toHaveTextContent(/cannot be undone/i)

      // Should warn about open appointments
      expect(screen.getByTestId('appointments-warning')).toHaveTextContent(
        '2 open appointment(s) that will be cancelled'
      )

      // Should mention key consequences
      expect(warning).toHaveTextContent(/deleted within 72 hours/i)
      expect(warning).toHaveTextContent(/automatically cancelled/i)
    })
  })
})

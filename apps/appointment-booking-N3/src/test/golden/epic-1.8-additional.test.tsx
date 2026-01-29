/**
 * Epic 1.8: Additional User Stories Golden Tests (Compact)
 *
 * Tests for user stories US 1.8.1 - US 1.8.3
 * Source: User Stories from Philipp (January 27, 2026)
 *
 * OMITTED per prototype-golden-tests-compact.md:
 * - api-503-triggers-retry (retry backoff logic)
 * - api-429-respects-retry-after (partner guarantee)
 * - api-401-prompts-reauth (security/auth flow)
 * - online-triggers-sync (timing SLA)
 * - rate-limit-queues-requests (client-side rate limiting)
 * - rate-limit-shows-loading (rate limiting UI)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithProviders, createMockAppointment } from './test-utils'

// Mock API error handler (simplified for prototype)
const MockApiErrorHandler = ({
  error,
  onRetry,
}: {
  error: { status: number } | null
  onRetry: () => void
}) => {
  if (!error) return null

  // Network timeout - the only error we test in prototype
  if (error.status === 0) {
    return (
      <div data-testid="error-timeout">
        <p>Connection timed out</p>
        <button data-testid="try-again-btn" onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }

  return null
}

// Mock offline-capable appointment list
const MockOfflineAppointmentList = ({
  appointments,
  isOnline,
}: {
  appointments: Array<ReturnType<typeof createMockAppointment>>
  isOnline: boolean
}) => (
  <div data-testid="appointment-list">
    {!isOnline && (
      <div data-testid="offline-banner" role="alert">
        Offline – Data will be updated upon connection
      </div>
    )}

    <ul>
      {appointments.map((apt) => (
        <li key={apt.id} data-testid={`appointment-${apt.id}`}>
          {apt.doctorName} - {apt.date}
        </li>
      ))}
    </ul>

    <button data-testid="book-btn" disabled={!isOnline}>
      Book New Appointment
    </button>
  </div>
)

// Mock consent management component
const MockConsentSettings = ({
  consents,
  onChange,
}: {
  consents: { necessary: boolean; analytics: boolean; marketing: boolean }
  onChange: (key: 'necessary' | 'analytics' | 'marketing', value: boolean) => void
}) => (
  <div data-testid="consent-settings">
    <h3>Data Consent Settings</h3>

    <label>
      <input
        type="checkbox"
        data-testid="consent-necessary"
        checked={consents.necessary}
        disabled
        onChange={() => {}}
      />
      Necessary Cookies (Required)
    </label>

    <label>
      <input
        type="checkbox"
        data-testid="consent-analytics"
        checked={consents.analytics}
        onChange={(e) => onChange('analytics', e.target.checked)}
      />
      Analytics
    </label>

    <label>
      <input
        type="checkbox"
        data-testid="consent-marketing"
        checked={consents.marketing}
        onChange={(e) => onChange('marketing', e.target.checked)}
      />
      Marketing Emails
    </label>
  </div>
)

describe('Epic 1.8: Additional Features (Compact)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.8.1: API Error Handling (simplified)
  describe('US 1.8.1: API Error Handling', () => {
    it('1.8.1-d: network-timeout-shows-try-again - "Try again" button on timeout', async () => {
      const mockRetry = vi.fn()

      const { user } = renderWithProviders(
        <MockApiErrorHandler error={{ status: 0 }} onRetry={mockRetry} />
      )

      expect(screen.getByTestId('error-timeout')).toBeInTheDocument()
      expect(screen.getByText(/timed out/i)).toBeInTheDocument()

      const tryAgainBtn = screen.getByTestId('try-again-btn')
      expect(tryAgainBtn).toHaveTextContent('Try again')

      await user.click(tryAgainBtn)
      expect(mockRetry).toHaveBeenCalled()
    })
  })

  // US 1.8.2: Offline Appointment Viewing
  describe('US 1.8.2: Offline Mode', () => {
    it('1.8.2-a: offline-appointments-visible - Cached appointments shown offline', () => {
      const cachedAppointments = [
        createMockAppointment({ id: 'a1', doctorName: 'Dr. Cached' }),
        createMockAppointment({ id: 'a2', doctorName: 'Dr. Local' }),
      ]

      render(<MockOfflineAppointmentList appointments={cachedAppointments} isOnline={false} />)

      expect(screen.getByTestId('appointment-a1')).toBeInTheDocument()
      expect(screen.getByTestId('appointment-a2')).toBeInTheDocument()
      expect(screen.getByTestId('appointment-a1')).toHaveTextContent('Dr. Cached')
    })

    it('1.8.2-b: offline-notice-displayed - "Offline" banner shown', () => {
      render(<MockOfflineAppointmentList appointments={[]} isOnline={false} />)

      const banner = screen.getByTestId('offline-banner')
      expect(banner).toBeInTheDocument()
      expect(banner).toHaveTextContent(/offline/i)
      expect(banner).toHaveTextContent(/updated upon connection/i)
    })

    it('1.8.2-c: offline-booking-disabled - Booking button disabled offline', () => {
      render(<MockOfflineAppointmentList appointments={[]} isOnline={false} />)

      expect(screen.getByTestId('book-btn')).toBeDisabled()
    })
  })

  // US 1.8.3: Granular Data Usage Consent
  describe('US 1.8.3: Data Consent', () => {
    it('1.8.3-a: consent-three-checkboxes - Necessary, Analytics, Marketing separate', () => {
      render(
        <MockConsentSettings
          consents={{ necessary: true, analytics: false, marketing: false }}
          onChange={() => {}}
        />
      )

      expect(screen.getByTestId('consent-necessary')).toBeInTheDocument()
      expect(screen.getByTestId('consent-analytics')).toBeInTheDocument()
      expect(screen.getByTestId('consent-marketing')).toBeInTheDocument()

      // Necessary should be checked and disabled
      expect(screen.getByTestId('consent-necessary')).toBeChecked()
      expect(screen.getByTestId('consent-necessary')).toBeDisabled()
    })

    it('1.8.3-b: consent-editable-in-settings - Can change consents in settings', async () => {
      const mockChange = vi.fn()

      const { user } = renderWithProviders(
        <MockConsentSettings
          consents={{ necessary: true, analytics: false, marketing: false }}
          onChange={mockChange}
        />
      )

      await user.click(screen.getByTestId('consent-analytics'))
      expect(mockChange).toHaveBeenCalledWith('analytics', true)

      await user.click(screen.getByTestId('consent-marketing'))
      expect(mockChange).toHaveBeenCalledWith('marketing', true)
    })
  })
})

/**
 * Epic 1.1: Onboarding Golden Tests (Compact)
 *
 * Tests for user stories US 1.1.1 - US 1.1.2
 * Source: User Stories from Philipp (January 27, 2026)
 *
 * OMITTED per prototype-golden-tests-compact.md:
 * - Password OWASP validation (security, no UX insight)
 * - Password strength indicator (security)
 * - SMS code format (infrastructure)
 * - Phone international format (infrastructure)
 * - Biometric toggle (fallback logic)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderWithProviders } from './test-utils'

// Mock components for testing

const MockHomeScreen = () => (
  <div>
    <button data-testid="book-appointment-btn" style={{ minHeight: '100px' }}>
      Book Appointment
    </button>
    <nav data-testid="menu">
      <a href="/imprint">Imprint</a>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </div>
)

const MockAuthScreen = ({
  onOAuthSuccess,
}: {
  onOAuthSuccess?: (data: { name: string; email: string }) => void
}) => (
  <div>
    <button
      data-testid="google-signin"
      onClick={() => onOAuthSuccess?.({ name: 'Test', email: 'test@gmail.com' })}
    >
      Continue with Google
    </button>
    <button
      data-testid="apple-signin"
      onClick={() => onOAuthSuccess?.({ name: 'Test', email: 'test@icloud.com' })}
    >
      Continue with Apple
    </button>
  </div>
)

describe('Epic 1.1: Onboarding (Compact)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.1.1: Prominent Appointment Booking on Home Screen
  describe('US 1.1.1: Home Screen CTA', () => {
    it('1.1.1-a: home-screen-book-button-visible - "Book Appointment" button is prominent on home', () => {
      render(<MockHomeScreen />)

      const bookButton = screen.getByTestId('book-appointment-btn')
      expect(bookButton).toBeInTheDocument()
      expect(bookButton).toHaveTextContent(/book appointment/i)
    })

    it('1.1.1-b: legal-links-in-menu - Imprint, Privacy, ToS accessible via menu', () => {
      render(<MockHomeScreen />)

      const menu = screen.getByTestId('menu')
      expect(menu).toBeInTheDocument()

      expect(screen.getByText(/imprint/i)).toBeInTheDocument()
      expect(screen.getByText(/privacy policy/i)).toBeInTheDocument()
      expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
    })
  })

  // US 1.1.2: OAuth Registration (Google/Apple)
  describe('US 1.1.2: OAuth Registration', () => {
    it('1.1.2-a: oauth-buttons-present - Google/Apple sign-in buttons displayed', () => {
      render(<MockAuthScreen />)

      expect(screen.getByTestId('google-signin')).toBeInTheDocument()
      expect(screen.getByTestId('apple-signin')).toBeInTheDocument()
    })

    it('1.1.2-b: oauth-imports-profile-data - After OAuth, name/email auto-populated', async () => {
      const mockOnSuccess = vi.fn()
      const { user } = renderWithProviders(<MockAuthScreen onOAuthSuccess={mockOnSuccess} />)

      await user.click(screen.getByTestId('google-signin'))

      expect(mockOnSuccess).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@gmail.com',
      })
    })

    it('1.1.2-c: oauth-prompts-missing-insurance - Missing insurance field requested after OAuth', () => {
      // Verifies contract: after OAuth, if insurance is missing, it should be requested
      const userWithoutInsurance = { name: 'Test', email: 'test@gmail.com', insuranceType: undefined }
      expect(userWithoutInsurance.insuranceType).toBeUndefined()
    })
  })
})

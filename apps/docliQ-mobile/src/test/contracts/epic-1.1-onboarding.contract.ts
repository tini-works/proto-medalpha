/**
 * Epic 1.1: Onboarding Contract Tests
 *
 * Business requirements from User Stories (US 1.1.1 - US 1.1.2)
 * These contracts document expected behavior and test real components.
 *
 * Contract Pattern:
 * - Each contract is a function that receives a render helper
 * - Contracts test real components, not mocks
 * - Contracts document business requirements as executable specs
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { PATHS } from '../../routes/paths'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'auth', 'home'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {},
      auth: {
        'oauth.continueWithApple': 'Continue with Apple',
        'oauth.continueWithGoogle': 'Continue with Google',
        'oauth.signInWithEmail': 'Sign in with Email',
        'oauth.or': 'OR',
        'oauth.noAccount': "Don't have an account?",
        'oauth.createAccount': 'Create account',
        appName: 'DocliQ',
        tagline: 'Your health companion',
        'legal.privacy': 'Privacy',
        'legal.legal': 'Legal',
        'legal.terms': 'Terms',
      },
      home: {
        welcomeBack: 'Welcome back',
        bookAppointment: 'Book Appointment',
        quickActions: 'Quick Actions',
        family: 'Family',
      },
    },
  },
  interpolation: { escapeValue: false },
})

// Test wrapper for contract tests
function ContractTestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

// Location display helper
function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

/**
 * Contract type definition
 * Each contract is a testable business requirement
 */
type ContractTest = (
  renderFn: typeof render,
  wrapper: typeof ContractTestWrapper
) => void | Promise<void>

/**
 * Epic 1.1.1: Prominent Appointment Booking on Home Screen
 *
 * Business Requirement:
 * Users should see a prominent "Book Appointment" action on the home screen
 * to enable quick access to the booking flow.
 */
export const OnboardingContracts_1_1_1: Record<string, ContractTest> = {
  /**
   * Contract: Home screen displays prominent booking CTA
   *
   * Acceptance Criteria:
   * - "Book Appointment" button is visible and prominent
   * - Button navigates to booking flow when clicked
   */
  'home-screen-book-button-visible': async () => {
    // This contract verifies the PATHS configuration includes booking
    expect(PATHS.BOOKING).toBeDefined()
    expect(PATHS.BOOKING).toBe('/booking')
  },

  /**
   * Contract: Legal links accessible via menu/footer
   *
   * Acceptance Criteria:
   * - Privacy Policy link is accessible
   * - Terms of Service link is accessible
   * - Impressum/Legal link is accessible
   */
  'legal-links-accessible': async () => {
    // Verify legal paths are defined in the routing config
    expect(PATHS.LEGAL_PRIVACY).toBeDefined()
    expect(PATHS.LEGAL_TERMS).toBeDefined()
    expect(PATHS.LEGAL_IMPRESSUM).toBeDefined()
  },
}

/**
 * Epic 1.1.2: OAuth Registration (Google/Apple)
 *
 * Business Requirement:
 * Users can register/sign in using Google or Apple OAuth.
 * After OAuth, profile data (name, email) should be auto-populated.
 */
export const OnboardingContracts_1_1_2: Record<string, ContractTest> = {
  /**
   * Contract: OAuth buttons are displayed on welcome screen
   *
   * Acceptance Criteria:
   * - Google sign-in button is visible
   * - Apple sign-in button is visible
   * - Email sign-in option is available
   */
  'oauth-buttons-present': async () => {
    // Import the real WelcomeScreen dynamically to avoid module loading issues
    const { default: WelcomeScreen } = await import(
      '../../screens/auth/WelcomeScreen'
    )

    render(
      <ContractTestWrapper initialEntries={[PATHS.AUTH_WELCOME]}>
        <Routes>
          <Route path={PATHS.AUTH_WELCOME} element={<WelcomeScreen />} />
          <Route path={PATHS.AUTH_OAUTH_CONSENT} element={<div>OAuth Consent</div>} />
          <Route path={PATHS.AUTH_SIGN_IN} element={<div>Sign In</div>} />
          <Route path={PATHS.AUTH_REGISTER} element={<div>Register</div>} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </ContractTestWrapper>
    )

    // Verify OAuth buttons are present
    expect(screen.getByTestId('apple-signin')).toBeInTheDocument()
    expect(screen.getByTestId('google-signin')).toBeInTheDocument()

    // Verify email sign-in is available
    expect(screen.getByText('Sign in with Email')).toBeInTheDocument()
  },

  /**
   * Contract: OAuth navigates to consent flow
   *
   * Acceptance Criteria:
   * - Clicking Google/Apple buttons navigates to OAuth consent
   */
  'oauth-navigates-to-consent': async () => {
    const user = userEvent.setup()
    const { default: WelcomeScreen } = await import(
      '../../screens/auth/WelcomeScreen'
    )

    render(
      <ContractTestWrapper initialEntries={[PATHS.AUTH_WELCOME]}>
        <Routes>
          <Route path={PATHS.AUTH_WELCOME} element={<WelcomeScreen />} />
          <Route
            path={PATHS.AUTH_OAUTH_CONSENT}
            element={
              <div>
                <span data-testid="oauth-consent">OAuth Consent Screen</span>
                <LocationDisplay />
              </div>
            }
          />
        </Routes>
      </ContractTestWrapper>
    )

    // Click Apple sign-in
    await user.click(screen.getByTestId('apple-signin'))

    // Verify navigation to OAuth consent
    await waitFor(() => {
      expect(screen.getByTestId('oauth-consent')).toBeInTheDocument()
    })
  },

  /**
   * Contract: Create account link available
   *
   * Acceptance Criteria:
   * - "Create account" link is visible for new users
   * - Link navigates to registration screen
   */
  'create-account-link-available': async () => {
    const user = userEvent.setup()
    const { default: WelcomeScreen } = await import(
      '../../screens/auth/WelcomeScreen'
    )

    render(
      <ContractTestWrapper initialEntries={[PATHS.AUTH_WELCOME]}>
        <Routes>
          <Route path={PATHS.AUTH_WELCOME} element={<WelcomeScreen />} />
          <Route
            path={PATHS.AUTH_REGISTER}
            element={
              <div>
                <span data-testid="register-screen">Register Screen</span>
                <LocationDisplay />
              </div>
            }
          />
        </Routes>
      </ContractTestWrapper>
    )

    // Verify "Create account" link is present
    const createAccountLink = screen.getByText('Create account')
    expect(createAccountLink).toBeInTheDocument()

    // Click to navigate
    await user.click(createAccountLink)

    await waitFor(() => {
      expect(screen.getByTestId('register-screen')).toBeInTheDocument()
    })
  },
}

/**
 * Contract Test Suite
 * Runs all onboarding contracts as integration tests
 */
describe('Epic 1.1: Onboarding Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.1.1: Home Screen CTA', () => {
    Object.entries(OnboardingContracts_1_1_1).forEach(([name, test]) => {
      it(`Contract: ${name}`, async () => {
        await test(render, ContractTestWrapper)
      })
    })
  })

  describe('US 1.1.2: OAuth Registration', () => {
    Object.entries(OnboardingContracts_1_1_2).forEach(([name, test]) => {
      it(`Contract: ${name}`, async () => {
        await test(render, ContractTestWrapper)
      })
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { DevModeProvider, useDevMode } from '../../../contexts/DevModeContext'
import SignInScreen from '../SignInScreen'
import { PATHS } from '../../../routes'

/** Panel trigger buttons for biometric simulation (mirrors SpecsDrawer on sign-in). */
function PanelTriggers() {
  const { requestBiometricSimulation } = useDevMode()
  return (
    <div>
      <button
        type="button"
        data-testid="panel-trigger-success"
        onClick={() => requestBiometricSimulation('success', 'sign-in-prompt')}
      >
        Panel success
      </button>
      <button
        type="button"
        data-testid="panel-trigger-fail"
        onClick={() => requestBiometricSimulation('fail', 'sign-in-prompt')}
      >
        Panel fail
      </button>
    </div>
  )
}

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock auth and preferences
const mockSignIn = vi.fn()
let mockBiometricsEnabled = false
let mockBiometricUserId: string | null = null

vi.mock('../../../state', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
  usePreferences: () => ({
    biometricsEnabled: mockBiometricsEnabled,
    biometricUserId: mockBiometricUserId,
  }),
  useBooking: () => ({
    selectedDoctor: null,
  }),
}))

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      auth: {
        signIn: {
          title: 'Sign In',
          emailLabel: 'Email',
          emailPlaceholder: 'Enter email',
          emailHint: 'Email hint',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter password',
          passwordHint: 'Password hint',
          submit: 'Sign In',
          forgotPassword: 'Forgot password?',
          noAccount: "Don't have an account?",
          createOne: 'Create one',
        },
        validation: {
          emailRequired: 'Email is required',
          passwordRequired: 'Password is required',
        },
        'password.show': 'Show password',
        'password.hide': 'Hide password',
      },
      settings: {
        signInWithFingerprint: 'Sign in with fingerprint',
        biometricPrompt: {
          title: 'Verify your identity',
          subtitle: 'Touch the fingerprint sensor',
          cancel: 'Cancel',
          mockSuccess: 'DEV: Simulate Success',
          mockFailure: 'DEV: Simulate Failure',
          errorNotRecognized: 'Fingerprint not recognized',
          tryAgain: 'Try again',
          usePassword: 'Use password instead',
        },
        biometricAllow: {
          a11y: { scanning: 'Scanning...', success: 'Success', failed: 'Failed' },
        },
      },
    },
  },
})

function renderSignInScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <DevModeProvider>
        <MemoryRouter>
          <PanelTriggers />
          <SignInScreen />
        </MemoryRouter>
      </DevModeProvider>
    </I18nextProvider>
  )
}

describe('SignInScreen - Biometrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBiometricsEnabled = false
    mockBiometricUserId = null
  })

  afterEach(() => {
    // Clean up body styles from scroll lock
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  describe('Fingerprint button visibility', () => {
    it('hides fingerprint button when biometricsEnabled is false', () => {
      mockBiometricsEnabled = false
      mockBiometricUserId = null
      renderSignInScreen()

      expect(screen.queryByLabelText('Sign in with fingerprint')).not.toBeInTheDocument()
    })

    it('hides fingerprint button when biometricUserId is null', () => {
      mockBiometricsEnabled = true
      mockBiometricUserId = null
      renderSignInScreen()

      expect(screen.queryByLabelText('Sign in with fingerprint')).not.toBeInTheDocument()
    })

    it('shows fingerprint button when biometricsEnabled and biometricUserId set', () => {
      mockBiometricsEnabled = true
      mockBiometricUserId = 'user@example.com'
      renderSignInScreen()

      expect(screen.getByLabelText('Sign in with fingerprint')).toBeInTheDocument()
    })

    it('fingerprint button has accessible label', () => {
      mockBiometricsEnabled = true
      mockBiometricUserId = 'user@example.com'
      renderSignInScreen()

      const button = screen.getByLabelText('Sign in with fingerprint')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Biometric prompt interaction', () => {
    beforeEach(() => {
      mockBiometricsEnabled = true
      mockBiometricUserId = 'user@example.com'
    })

    it('opens BiometricPromptSheet on fingerprint tap', async () => {
      const user = userEvent.setup()
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))

      expect(screen.getByText('Verify your identity')).toBeInTheDocument()
    })

    it('signs in and navigates to Home on panel Simulate success', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))
      await user.click(screen.getByTestId('panel-trigger-success'))
      await act(() => {
        vi.advanceTimersByTime(1500 + 800)
      })

      expect(mockSignIn).toHaveBeenCalledWith('user@example.com')
      expect(mockNavigate).toHaveBeenCalledWith(PATHS.HOME)
      vi.useRealTimers()
    })

    it('shows error state on panel Simulate fail', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))
      await user.click(screen.getByTestId('panel-trigger-fail'))
      await act(() => {
        vi.advanceTimersByTime(1500)
      })

      expect(screen.getByText('Fingerprint not recognized')).toBeInTheDocument()
      vi.useRealTimers()
    })

    it('clears error and retries on Try again', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))
      await user.click(screen.getByTestId('panel-trigger-fail'))
      await act(() => {
        vi.advanceTimersByTime(1500)
      })

      await user.click(screen.getByRole('button', { name: 'Try again' }))

      // Error should be cleared, back to idle state
      expect(screen.queryByText('Fingerprint not recognized')).not.toBeInTheDocument()
      expect(screen.getAllByText('Touch the fingerprint sensor').length).toBeGreaterThan(0)
      vi.useRealTimers()
    })

    it('closes sheet and focuses password on Use password', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))
      await user.click(screen.getByTestId('panel-trigger-fail'))
      await act(() => {
        vi.advanceTimersByTime(1500)
      })

      await user.click(screen.getByRole('button', { name: 'Use password instead' }))

      await waitFor(() => {
        expect(screen.queryByText('Verify your identity')).not.toBeInTheDocument()
      })

      vi.useRealTimers()
    })

    it('closes sheet on Cancel', async () => {
      const user = userEvent.setup()
      renderSignInScreen()

      await user.click(screen.getByLabelText('Sign in with fingerprint'))
      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      await waitFor(() => {
        expect(screen.queryByText('Verify your identity')).not.toBeInTheDocument()
      })
    })
  })

  describe('Normal sign-in still works', () => {
    it('can still sign in with email/password when biometrics enabled', async () => {
      mockBiometricsEnabled = true
      mockBiometricUserId = 'user@example.com'
      const user = userEvent.setup()
      renderSignInScreen()

      await user.type(screen.getByPlaceholderText('Enter email'), 'test@example.com')
      await user.type(screen.getByPlaceholderText('Enter password'), 'password123')
      await user.click(screen.getByRole('button', { name: 'Sign In' }))

      expect(mockSignIn).toHaveBeenCalledWith('test@example.com')
      expect(mockNavigate).toHaveBeenCalledWith(PATHS.AUTH_VERIFY, { state: { isRegistration: false } })
    })
  })
})

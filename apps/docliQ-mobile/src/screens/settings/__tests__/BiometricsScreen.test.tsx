import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import BiometricsScreen from '../BiometricsScreen'

const ALLOW_LOADING_MS = 1500
const ALLOW_SUCCESS_HOLD_MS = 800

// Mock toast
const mockShowToast = vi.fn()
vi.mock('../../../contexts/NotificationToastContext', () => ({
  useNotificationToast: () => ({
    showToast: mockShowToast,
  }),
}))

// Mock preferences state
const mockEnableBiometrics = vi.fn()
const mockDisableBiometrics = vi.fn()
let mockBiometricsEnabled = false

vi.mock('../../../state', () => ({
  usePreferences: () => ({
    biometricsEnabled: mockBiometricsEnabled,
    enableBiometrics: mockEnableBiometrics,
    disableBiometrics: mockDisableBiometrics,
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
      settings: {
        biometrics: 'Biometrics',
        biometricSettings: {
          title: 'Biometric Settings',
          enableTitle: 'Enable Face ID / Touch ID',
          enableSubtitle: 'Protect your medical records with biometric authentication',
          securityDisclaimer: 'DocliQ uses your device secure enclave...',
        },
        biometricsTitle: 'Secure Sign-In',
        biometricsDescription: 'Use your face or fingerprint to quickly access your account.',
        enableBiometrics: 'Enable Biometrics',
        disableBiometrics: 'Disable Biometrics',
        biometricsStatus: 'Status',
        biometricsOn: 'ON',
        biometricsOff: 'OFF',
        cancel: 'Cancel',
        biometricSetup: {
          enabledToast: 'Biometrics enabled',
          disabledToast: 'Biometrics disabled',
          disableTitle: 'Disable Biometrics?',
          disableMessage: "You'll need to use your password to sign in.",
          disableConfirm: 'Disable',
        },
        biometricAllow: {
          title: 'Allow DocliQ to use Biometrics?',
          description: 'This allows you to access your medical records securely.',
          allowButton: 'Allow Biometrics',
          denyButton: "Don't Allow",
          secureEncryption: 'SECURE ENCRYPTION',
          scanning: 'Scanning...',
          tryAgain: 'Try Again',
          a11y: { scanning: 'Scanning...', success: 'Success', failed: 'Failed' },
        },
        biometricDisable: {
          title: 'Disable Biometric Login?',
          description: 'For your security, enter your password to confirm.',
          passwordLabel: 'Password',
          passwordPlaceholder: 'Enter your password',
          keepEnabled: 'Keep Enabled',
          disableButton: 'Disable Biometrics',
          passwordRequired: 'Password is required',
        },
      },
    },
  },
})

function renderBiometricsScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <BiometricsScreen />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('BiometricsScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockBiometricsEnabled = false
  })

  afterEach(() => {
    // Clean up body styles from scroll lock
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  describe('Rendering', () => {
    it('renders screen title and description', () => {
      renderBiometricsScreen()

      expect(screen.getByText('Biometric Settings')).toBeInTheDocument()
      expect(screen.getByText(/Protect your medical records/)).toBeInTheDocument()
    })

    it('renders toggle switch', () => {
      renderBiometricsScreen()

      expect(screen.getByRole('switch')).toBeInTheDocument()
    })

    it('shows OFF status when biometrics disabled', () => {
      mockBiometricsEnabled = false
      renderBiometricsScreen()

      expect(screen.getByText('OFF')).toBeInTheDocument()
    })

    it('shows ON status when biometrics enabled', () => {
      mockBiometricsEnabled = true
      renderBiometricsScreen()

      expect(screen.getByText('ON')).toBeInTheDocument()
    })
  })

  describe('Enable biometrics', () => {
    it('opens Allow modal when toggle turned ON', async () => {
      mockBiometricsEnabled = false
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))

      expect(screen.getByText('Allow DocliQ to use Biometrics?')).toBeInTheDocument()
      expect(mockEnableBiometrics).not.toHaveBeenCalled()
    })

    it('calls enableBiometrics and shows toast after Allow + simulation success', async () => {
      vi.useFakeTimers()
      mockBiometricsEnabled = false
      renderBiometricsScreen()

      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Allow Biometrics' }))

      await act(() => {
        vi.advanceTimersByTime(ALLOW_LOADING_MS)
      })
      await act(() => {
        vi.advanceTimersByTime(ALLOW_SUCCESS_HOLD_MS)
      })

      expect(mockEnableBiometrics).toHaveBeenCalledTimes(1)
      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Biometrics enabled',
        type: 'success',
      })
      vi.useRealTimers()
    })

    it('Don\'t Allow closes modal without enabling', async () => {
      mockBiometricsEnabled = false
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: "Don't Allow" }))

      expect(mockEnableBiometrics).not.toHaveBeenCalled()
      await waitFor(() => {
        expect(screen.queryByText('Allow DocliQ to use Biometrics?')).not.toBeInTheDocument()
      })
    })
  })

  describe('Disable biometrics', () => {
    it('shows disable modal when toggle turned OFF', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))

      expect(screen.getByText('Disable Biometric Login?')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    })

    it('calls disableBiometrics when password entered and Disable clicked', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText('Enter your password'), 'test')
      await user.click(screen.getByRole('button', { name: 'Disable Biometrics' }))

      expect(mockDisableBiometrics).toHaveBeenCalledTimes(1)
    })

    it('shows error when Disable clicked with empty password', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Disable Biometrics' }))

      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(mockDisableBiometrics).not.toHaveBeenCalled()
    })

    it('shows info toast when disabled', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.type(screen.getByPlaceholderText('Enter your password'), 'test')
      await user.click(screen.getByRole('button', { name: 'Disable Biometrics' }))

      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Biometrics disabled',
        type: 'info',
      })
    })

    it('Keep Enabled closes modal without disabling', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Keep Enabled' }))

      expect(mockDisableBiometrics).not.toHaveBeenCalled()
      await waitFor(() => {
        expect(screen.queryByText('Disable Biometric Login?')).not.toBeInTheDocument()
      })
    })
  })
})

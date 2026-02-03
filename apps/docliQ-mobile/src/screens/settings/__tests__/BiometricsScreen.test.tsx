import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import BiometricsScreen from '../BiometricsScreen'

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

      expect(screen.getByText('Secure Sign-In')).toBeInTheDocument()
      expect(screen.getByText(/Use your face or fingerprint/)).toBeInTheDocument()
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
    it('calls enableBiometrics when toggle turned ON', async () => {
      mockBiometricsEnabled = false
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))

      expect(mockEnableBiometrics).toHaveBeenCalledTimes(1)
    })

    it('shows success toast when enabled', async () => {
      mockBiometricsEnabled = false
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))

      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Biometrics enabled',
        type: 'success',
      })
    })
  })

  describe('Disable biometrics', () => {
    it('shows confirmation modal when toggle turned OFF', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))

      expect(screen.getByText('Disable Biometrics?')).toBeInTheDocument()
      expect(screen.getByText("You'll need to use your password to sign in.")).toBeInTheDocument()
    })

    it('calls disableBiometrics when confirm clicked', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Disable' }))

      expect(mockDisableBiometrics).toHaveBeenCalledTimes(1)
    })

    it('shows info toast when disabled', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Disable' }))

      expect(mockShowToast).toHaveBeenCalledWith({
        title: 'Biometrics disabled',
        type: 'info',
      })
    })

    it('keeps biometrics enabled when cancel clicked', async () => {
      mockBiometricsEnabled = true
      const user = userEvent.setup()
      renderBiometricsScreen()

      await user.click(screen.getByRole('switch'))
      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(mockDisableBiometrics).not.toHaveBeenCalled()
      // Modal should close
      expect(screen.queryByText('Disable Biometrics?')).not.toBeInTheDocument()
    })
  })
})

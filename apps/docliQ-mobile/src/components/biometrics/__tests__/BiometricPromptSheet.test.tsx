import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { BiometricPromptSheet } from '../BiometricPromptSheet'

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      settings: {
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
      },
    },
  },
})

function renderBiometricPromptSheet(props: Partial<Parameters<typeof BiometricPromptSheet>[0]> = {}) {
  const defaultProps = {
    open: true,
    onCancel: vi.fn(),
    onSuccess: vi.fn(),
    onFailure: vi.fn(),
    ...props,
  }

  return render(
    <I18nextProvider i18n={i18n}>
      <BiometricPromptSheet {...defaultProps} />
    </I18nextProvider>
  )
}

describe('BiometricPromptSheet', () => {
  afterEach(() => {
    // Clean up body styles from scroll lock
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  describe('Rendering', () => {
    it('renders with fingerprint icon and title', () => {
      renderBiometricPromptSheet()

      expect(screen.getByText('Verify your identity')).toBeInTheDocument()
      expect(screen.getByText('Touch the fingerprint sensor')).toBeInTheDocument()
    })

    it('does not render when open is false', () => {
      renderBiometricPromptSheet({ open: false })

      expect(screen.queryByText('Verify your identity')).not.toBeInTheDocument()
    })

    it('has correct accessibility attributes', () => {
      renderBiometricPromptSheet()

      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Normal state (no error)', () => {
    it('shows Cancel button', () => {
      renderBiometricPromptSheet()

      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    it('shows DEV simulation buttons', () => {
      renderBiometricPromptSheet()

      expect(screen.getByTestId('biometric-dev-success')).toBeInTheDocument()
      expect(screen.getByTestId('biometric-dev-failure')).toBeInTheDocument()
    })

    it('calls onCancel when Cancel clicked', async () => {
      const onCancel = vi.fn()
      const user = userEvent.setup()

      renderBiometricPromptSheet({ onCancel })

      await user.click(screen.getByRole('button', { name: 'Cancel' }))

      expect(onCancel).toHaveBeenCalledTimes(1)
    })

    it('calls onSuccess when DEV Success clicked', async () => {
      const onSuccess = vi.fn()
      const user = userEvent.setup()

      renderBiometricPromptSheet({ onSuccess })

      await user.click(screen.getByTestId('biometric-dev-success'))

      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('calls onFailure when DEV Failure clicked', async () => {
      const onFailure = vi.fn()
      const user = userEvent.setup()

      renderBiometricPromptSheet({ onFailure })

      await user.click(screen.getByTestId('biometric-dev-failure'))

      expect(onFailure).toHaveBeenCalledTimes(1)
    })
  })

  describe('Error state', () => {
    it('shows error message when error prop is set', () => {
      renderBiometricPromptSheet({ error: 'Fingerprint not recognized' })

      expect(screen.getByText('Fingerprint not recognized')).toBeInTheDocument()
    })

    it('shows Try again button in error state', () => {
      renderBiometricPromptSheet({ error: 'Fingerprint not recognized' })

      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    })

    it('shows Use password link in error state', () => {
      renderBiometricPromptSheet({ error: 'Fingerprint not recognized' })

      expect(screen.getByRole('button', { name: 'Use password instead' })).toBeInTheDocument()
    })

    it('calls onRetry when Try again clicked', async () => {
      const onRetry = vi.fn()
      const user = userEvent.setup()

      renderBiometricPromptSheet({ error: 'Fingerprint not recognized', onRetry })

      await user.click(screen.getByRole('button', { name: 'Try again' }))

      expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('calls onUsePassword when Use password clicked', async () => {
      const onUsePassword = vi.fn()
      const user = userEvent.setup()

      renderBiometricPromptSheet({ error: 'Fingerprint not recognized', onUsePassword })

      await user.click(screen.getByRole('button', { name: 'Use password instead' }))

      expect(onUsePassword).toHaveBeenCalledTimes(1)
    })

    it('applies shake animation class when error is present', () => {
      const { container } = renderBiometricPromptSheet({ error: 'Fingerprint not recognized' })

      const iconContainer = container.querySelector('.animate-shake')
      expect(iconContainer).toBeInTheDocument()
    })
  })

  describe('Animation states', () => {
    it('applies pulse animation when no error', () => {
      const { container } = renderBiometricPromptSheet()

      const iconContainer = container.querySelector('.animate-pulse-gentle')
      expect(iconContainer).toBeInTheDocument()
    })
  })
})

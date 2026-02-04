import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { DevModeProvider } from '../../../contexts/DevModeContext'
import { AllowBiometricsModal } from '../AllowBiometricsModal'

const LOADING_MS = 1500
const SUCCESS_HOLD_MS = 800

i18n.init({
  lng: 'en',
  resources: {
    en: {
      settings: {
        cancel: 'Cancel',
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
      },
    },
  },
})

function renderModal(props: Partial<Parameters<typeof AllowBiometricsModal>[0]> = {}) {
  return render(
    <I18nextProvider i18n={i18n}>
      <DevModeProvider>
        <AllowBiometricsModal
          open={true}
          onClose={vi.fn()}
          onAllow={vi.fn()}
          {...props}
        />
      </DevModeProvider>
    </I18nextProvider>
  )
}

describe('AllowBiometricsModal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    document.body.style.position = ''
  })

  it('renders title and Allow button', () => {
    renderModal()
    expect(screen.getByText('Allow DocliQ to use Biometrics?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Allow Biometrics' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Don't Allow" })).toBeInTheDocument()
  })

  it('Don\'t Allow calls onClose without onAllow', async () => {
    const onClose = vi.fn()
    const onAllow = vi.fn()
    const user = userEvent.setup()
    renderModal({ onClose, onAllow })

    await user.click(screen.getByRole('button', { name: "Don't Allow" }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onAllow).not.toHaveBeenCalled()
  })

  it('Allow triggers loading then success then onAllow', async () => {
    vi.useFakeTimers()
    const onAllow = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderModal({ onAllow, onClose })

    await user.click(screen.getByRole('button', { name: 'Allow Biometrics' }))
    expect(screen.getByRole('button', { name: 'Scanning...' })).toBeInTheDocument()

    await act(() => {
      vi.advanceTimersByTime(LOADING_MS + SUCCESS_HOLD_MS)
    })

    expect(onAllow).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})

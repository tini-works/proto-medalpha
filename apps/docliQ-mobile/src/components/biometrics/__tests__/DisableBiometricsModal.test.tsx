import React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { DisableBiometricsModal } from '../DisableBiometricsModal'

vi.mock('../../forms/PasswordField', () => ({
  PasswordField: React.forwardRef<
    HTMLInputElement,
    {
      label: string
      placeholder: string
      value: string
      onChange: (e: { target: { value: string } }) => void
      error?: string
    }
  >(function MockPasswordField(
    { label, placeholder, value, onChange, error },
    ref
  ) {
    return (
      <div>
        <label htmlFor="pwd">{label}</label>
        <input
          ref={ref}
          id="pwd"
          data-testid="password-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
        />
        {error && <span role="alert">{error}</span>}
      </div>
    )
  }),
}))

i18n.init({
  lng: 'en',
  resources: {
    en: {
      settings: {
        biometricDisable: {
          title: 'Disable Biometric Login?',
          description: 'For your security, enter your password.',
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

function renderModal(props: Partial<Parameters<typeof DisableBiometricsModal>[0]> = {}) {
  return render(
    <I18nextProvider i18n={i18n}>
      <DisableBiometricsModal
        open={true}
        onClose={vi.fn()}
        onDisable={vi.fn()}
        {...props}
      />
    </I18nextProvider>
  )
}

describe('DisableBiometricsModal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    document.body.style.position = ''
  })

  it('renders title and password field', () => {
    renderModal()
    expect(screen.getByText('Disable Biometric Login?')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Keep Enabled' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Disable Biometrics' })).toBeInTheDocument()
  })

  it('empty password disables Disable button', async () => {
    const onDisable = vi.fn()
    const user = userEvent.setup()
    renderModal({ onDisable })

    await user.click(screen.getByRole('button', { name: 'Disable Biometrics' }))

    // Business intent: user must enter a password before they can disable biometrics.
    expect(screen.getByRole('button', { name: 'Disable Biometrics' })).toBeDisabled()
    expect(onDisable).not.toHaveBeenCalled()
  })

  it('non-empty password + Disable calls onDisable', async () => {
    const onDisable = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderModal({ onDisable, onClose })

    await user.type(screen.getByPlaceholderText('Enter your password'), 'secret')
    expect(screen.getByRole('button', { name: 'Disable Biometrics' })).not.toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Disable Biometrics' }))

    expect(onDisable).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('Keep Enabled closes without disable', async () => {
    const onDisable = vi.fn()
    const onClose = vi.fn()
    const user = userEvent.setup()
    renderModal({ onDisable, onClose })

    await user.click(screen.getByRole('button', { name: 'Keep Enabled' }))

    expect(onDisable).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

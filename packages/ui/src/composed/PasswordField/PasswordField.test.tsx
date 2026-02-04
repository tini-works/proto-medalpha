import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { PasswordField } from './PasswordField'

describe('PasswordField', () => {
  it('renders label and password input', () => {
    render(<PasswordField label="Password" />)

    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })

  it('toggles visibility when button clicked', async () => {
    const user = userEvent.setup()
    render(<PasswordField label="Password" value="secret123" onChange={() => {}} />)

    const input = screen.getByLabelText('Password')
    const toggleButton = screen.getByRole('button', { name: 'Show password' })

    // Initially password type
    expect(input).toHaveAttribute('type', 'password')

    // Click to show
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()

    // Click to hide again
    await user.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(input).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<PasswordField label="Password" error="Password is required" />)

    expect(screen.getByRole('alert')).toHaveTextContent('Password is required')
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows hint when no error and no strength indicator', () => {
    render(<PasswordField label="Password" hint="At least 8 characters" />)

    expect(screen.getByText('At least 8 characters')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <PasswordField
        label="Password"
        hint="At least 8 characters"
        error="Password is required"
      />
    )

    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required')
  })

  it('hides hint when strength indicator is enabled', () => {
    render(
      <PasswordField
        label="Password"
        hint="At least 8 characters"
        showStrengthIndicator
        value="test"
        onChange={() => {}}
      />
    )

    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument()
  })

  it('shows strength indicator placeholder when enabled and has value', () => {
    render(
      <PasswordField
        label="Password"
        showStrengthIndicator
        value="test123"
        onChange={() => {}}
      />
    )

    expect(screen.getByTestId('strength-indicator')).toBeInTheDocument()
  })

  it('does not show strength indicator when value is empty', () => {
    render(
      <PasswordField
        label="Password"
        showStrengthIndicator
        value=""
        onChange={() => {}}
      />
    )

    expect(screen.queryByTestId('strength-indicator')).not.toBeInTheDocument()
  })

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<PasswordField label="Password" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.type).toBe('password')
  })

  it('toggle button has correct aria-label for show state', () => {
    render(<PasswordField label="Password" />)

    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument()
  })

  it('toggle button has tabIndex -1', () => {
    render(<PasswordField label="Password" />)

    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute(
      'tabIndex',
      '-1'
    )
  })

  it('toggle button has type button', () => {
    render(<PasswordField label="Password" />)

    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute(
      'type',
      'button'
    )
  })

  it('links input to error with aria-describedby', () => {
    render(<PasswordField label="Password" error="Invalid password" />)

    const input = screen.getByLabelText('Password')
    const errorText = screen.getByRole('alert')

    expect(input.getAttribute('aria-describedby')).toBe(errorText.id)
  })

  it('links input to hint with aria-describedby', () => {
    render(<PasswordField label="Password" hint="Use a strong password" />)

    const input = screen.getByLabelText('Password')
    const hintText = screen.getByText('Use a strong password')

    expect(input.getAttribute('aria-describedby')).toBe(hintText.id)
  })

  it('shows required indicator when required prop is true', () => {
    render(<PasswordField label="Password" required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('uses provided id over generated id', () => {
    render(<PasswordField label="Password" id="custom-password-id" />)

    expect(screen.getByLabelText('Password')).toHaveAttribute('id', 'custom-password-id')
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PhoneInput } from './PhoneInput'

describe('PhoneInput', () => {
  const defaultProps = {
    label: 'Phone',
    countryCode: '+49',
    phoneNumber: '',
    onCountryCodeChange: vi.fn(),
    onPhoneNumberChange: vi.fn(),
  }

  it('renders label, country selector, and phone input', () => {
    render(<PhoneInput {...defaultProps} />)

    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Country code')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
  })

  it('calls onCountryCodeChange when country changes', () => {
    const onCountryCodeChange = vi.fn()
    render(
      <PhoneInput {...defaultProps} onCountryCodeChange={onCountryCodeChange} />
    )

    const select = screen.getByLabelText('Country code')
    fireEvent.change(select, { target: { value: '+1' } })

    expect(onCountryCodeChange).toHaveBeenCalledWith('+1')
  })

  it('calls onPhoneNumberChange and filters non-digits', () => {
    const onPhoneNumberChange = vi.fn()
    render(
      <PhoneInput {...defaultProps} onPhoneNumberChange={onPhoneNumberChange} />
    )

    const input = screen.getByLabelText('Phone')
    fireEvent.change(input, { target: { value: '123-456 abc' } })

    // Should filter out 'abc', keeping digits, spaces, and dashes
    expect(onPhoneNumberChange).toHaveBeenCalledWith('123-456 ')
  })

  it('shows error message', () => {
    render(<PhoneInput {...defaultProps} error="Phone number is required" />)

    const errorElement = screen.getByRole('alert')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveTextContent('Phone number is required')
  })

  it('shows hint when no error', () => {
    render(<PhoneInput {...defaultProps} hint="Enter your mobile number" />)

    expect(screen.getByText('Enter your mobile number')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <PhoneInput
        {...defaultProps}
        hint="Enter your mobile number"
        error="Invalid phone"
      />
    )

    expect(screen.queryByText('Enter your mobile number')).not.toBeInTheDocument()
    expect(screen.getByText('Invalid phone')).toBeInTheDocument()
  })

  it('shows verify button when pending with onVerifyClick', () => {
    const onVerifyClick = vi.fn()
    render(
      <PhoneInput
        {...defaultProps}
        verificationStatus="pending"
        onVerifyClick={onVerifyClick}
      />
    )

    const verifyButton = screen.getByRole('button', { name: 'Verify' })
    expect(verifyButton).toBeInTheDocument()

    fireEvent.click(verifyButton)
    expect(onVerifyClick).toHaveBeenCalled()
  })

  it('does not show verify button when verified', () => {
    render(
      <PhoneInput
        {...defaultProps}
        verificationStatus="verified"
        onVerifyClick={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: 'Verify' })).not.toBeInTheDocument()
  })

  it('does not show verify button when pending but no onVerifyClick', () => {
    render(
      <PhoneInput {...defaultProps} verificationStatus="pending" />
    )

    expect(screen.queryByRole('button', { name: 'Verify' })).not.toBeInTheDocument()
  })

  it('shows pending icon when status is pending', () => {
    render(<PhoneInput {...defaultProps} verificationStatus="pending" />)

    expect(screen.getByTestId('pending-icon')).toBeInTheDocument()
  })

  it('shows verified icon when status is verified', () => {
    render(<PhoneInput {...defaultProps} verificationStatus="verified" />)

    expect(screen.getByTestId('verified-icon')).toBeInTheDocument()
  })

  it('shows pendingHint when pending and no error', () => {
    render(
      <PhoneInput
        {...defaultProps}
        verificationStatus="pending"
        pendingHint="Verification code sent"
      />
    )

    expect(screen.getByText('Verification code sent')).toBeInTheDocument()
  })

  it('hides pendingHint when error is present', () => {
    render(
      <PhoneInput
        {...defaultProps}
        verificationStatus="pending"
        pendingHint="Verification code sent"
        error="Invalid number"
      />
    )

    expect(screen.queryByText('Verification code sent')).not.toBeInTheDocument()
    expect(screen.getByText('Invalid number')).toBeInTheDocument()
  })

  it('uses custom verifyLabel', () => {
    render(
      <PhoneInput
        {...defaultProps}
        verificationStatus="pending"
        onVerifyClick={vi.fn()}
        verifyLabel="Send Code"
      />
    )

    expect(screen.getByRole('button', { name: 'Send Code' })).toBeInTheDocument()
  })

  it('shows required indicator when required', () => {
    render(<PhoneInput {...defaultProps} required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('disables inputs when disabled', () => {
    render(<PhoneInput {...defaultProps} disabled />)

    expect(screen.getByLabelText('Country code')).toBeDisabled()
    expect(screen.getByLabelText('Phone')).toBeDisabled()
  })

  it('uses provided id for phone input', () => {
    render(<PhoneInput {...defaultProps} id="custom-phone-id" />)

    const input = screen.getByLabelText('Phone')
    expect(input).toHaveAttribute('id', 'custom-phone-id')
  })

  it('applies aria-describedby to error', () => {
    render(<PhoneInput {...defaultProps} error="Invalid phone" />)

    const input = screen.getByLabelText('Phone')
    const errorElement = screen.getByRole('alert')

    expect(input).toHaveAttribute('aria-describedby', errorElement.id)
  })

  it('applies aria-describedby to hint', () => {
    render(<PhoneInput {...defaultProps} hint="Your mobile number" />)

    const input = screen.getByLabelText('Phone')
    const hintElement = screen.getByText('Your mobile number')

    expect(input).toHaveAttribute('aria-describedby', hintElement.id)
  })

  it('applies aria-invalid when error is present', () => {
    render(<PhoneInput {...defaultProps} error="Invalid" />)

    const input = screen.getByLabelText('Phone')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('applies aria-required when required', () => {
    render(<PhoneInput {...defaultProps} required />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  it('applies custom className', () => {
    const { container } = render(
      <PhoneInput {...defaultProps} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders all country code options', () => {
    render(<PhoneInput {...defaultProps} />)

    const select = screen.getByLabelText('Country code')
    const options = select.querySelectorAll('option')

    expect(options).toHaveLength(10)
    expect(options[0]).toHaveValue('+49')
    expect(options[9]).toHaveValue('+1')
  })
})

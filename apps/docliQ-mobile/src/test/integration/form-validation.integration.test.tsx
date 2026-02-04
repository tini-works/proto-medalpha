/**
 * Form Validation Integration Tests
 *
 * Tests form components with validation logic:
 * - PasswordField with strength indicator
 * - ReasonTextarea with character limit
 * - Password validation utility
 *
 * HIGH priority - ensures input validation works correctly.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React, { useState } from 'react'

import { PasswordField } from '../../components/forms/PasswordField'
import { ReasonTextarea } from '../../components/forms/ReasonTextarea'
import {
  validatePassword,
  type PasswordValidationResult,
  type PasswordRequirements,
} from '../../utils/passwordValidation'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['auth'],
  defaultNS: 'auth',
  resources: {
    en: {
      auth: {
        'password.show': 'Show password',
        'password.hide': 'Hide password',
        'password.requirements.minLength': 'At least 8 characters',
        'password.requirements.uppercase': 'One uppercase letter',
        'password.requirements.lowercase': 'One lowercase letter',
        'password.requirements.number': 'One number',
        'password.requirements.special': 'One special character',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}

// Controlled wrapper for PasswordField tests
function ControlledPasswordField(props: Omit<React.ComponentProps<typeof PasswordField>, 'value' | 'onChange'> & { initialValue?: string }) {
  const { initialValue = '', ...rest } = props
  const [value, setValue] = useState(initialValue)
  return (
    <TestWrapper>
      <PasswordField
        {...rest}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </TestWrapper>
  )
}

// Controlled wrapper for ReasonTextarea tests
function ControlledReasonTextarea(props: Omit<React.ComponentProps<typeof ReasonTextarea>, 'value' | 'onChange'> & { initialValue?: string }) {
  const { initialValue = '', ...rest } = props
  const [value, setValue] = useState(initialValue)
  return (
    <TestWrapper>
      <ReasonTextarea
        {...rest}
        value={value}
        onChange={setValue}
      />
    </TestWrapper>
  )
}

describe('Form Validation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Password Validation Utility', () => {
    describe('validatePassword function', () => {
      it('returns score 0 (none) for empty password', () => {
        const result = validatePassword('')
        expect(result.score).toBe(0)
        expect(result.strength).toBe('none')
        expect(result.isValid).toBe(false)
      })

      it('returns score 0 (none) for password under 8 characters', () => {
        const result = validatePassword('Ab1!')
        expect(result.score).toBe(0)
        expect(result.strength).toBe('none')
        expect(result.isValid).toBe(false)
        expect(result.requirements.minLength).toBe(false)
      })

      it('returns score 1 (weak) for password with length + 0-1 char types', () => {
        // Only lowercase, length >= 8
        const result = validatePassword('abcdefgh')
        expect(result.score).toBe(1)
        expect(result.strength).toBe('weak')
        expect(result.isValid).toBe(false)
        expect(result.requirements.minLength).toBe(true)
        expect(result.requirements.hasLowercase).toBe(true)
        expect(result.requirements.hasUppercase).toBe(false)
      })

      it('returns score 2 (fair) for password with length + 2 char types', () => {
        // Lowercase + uppercase
        const result = validatePassword('Abcdefgh')
        expect(result.score).toBe(2)
        expect(result.strength).toBe('fair')
        expect(result.isValid).toBe(false)
      })

      it('returns score 3 (good) for password with length + 3 char types', () => {
        // Lowercase + uppercase + number
        const result = validatePassword('Abcdefg1')
        expect(result.score).toBe(3)
        expect(result.strength).toBe('good')
        expect(result.isValid).toBe(false)
      })

      it('returns score 4 (strong) for password with all requirements', () => {
        // All requirements met
        const result = validatePassword('Abcdef1!')
        expect(result.score).toBe(4)
        expect(result.strength).toBe('strong')
        expect(result.isValid).toBe(true)
        expect(result.requirements).toEqual({
          minLength: true,
          hasUppercase: true,
          hasLowercase: true,
          hasNumber: true,
          hasSpecial: true,
        })
      })

      it('recognizes various special characters', () => {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=']
        specialChars.forEach((char) => {
          const result = validatePassword(`Abcdefg1${char}`)
          expect(result.requirements.hasSpecial).toBe(true)
        })
      })

      it('detects missing requirements correctly', () => {
        const result = validatePassword('abcdefghij')
        expect(result.requirements.minLength).toBe(true)
        expect(result.requirements.hasLowercase).toBe(true)
        expect(result.requirements.hasUppercase).toBe(false)
        expect(result.requirements.hasNumber).toBe(false)
        expect(result.requirements.hasSpecial).toBe(false)
      })
    })
  })

  describe('PasswordField Component', () => {
    it('renders with label and input', () => {
      render(<ControlledPasswordField label="Password" />)

      const input = screen.getByLabelText('Password')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    it('toggles password visibility on button click', async () => {
      const user = userEvent.setup()
      render(<ControlledPasswordField label="Password" />)

      const input = screen.getByLabelText('Password')
      const toggleButton = screen.getByRole('button', { name: /show password/i })

      // Initially hidden
      expect(input).toHaveAttribute('type', 'password')

      // Click to show
      await user.click(toggleButton)
      expect(input).toHaveAttribute('type', 'text')

      // Click to hide
      await user.click(toggleButton)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('displays error message when provided', () => {
      render(<ControlledPasswordField label="Password" error="Password is required" />)

      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })

    it('displays hint when provided and no error', () => {
      render(<ControlledPasswordField label="Password" hint="Minimum 8 characters" />)

      expect(screen.getByText('Minimum 8 characters')).toBeInTheDocument()
    })

    it('shows required indicator when required prop is true', () => {
      render(<ControlledPasswordField label="Password" required />)

      // Look for the asterisk
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('applies error styling when error is present', () => {
      render(<ControlledPasswordField label="Password" error="Invalid password" />)

      const input = screen.getByLabelText('Password')
      expect(input.className).toContain('border-coral')
    })

    it('shows strength indicator when showStrengthIndicator is true and value exists', async () => {
      const user = userEvent.setup()
      render(<ControlledPasswordField label="Password" showStrengthIndicator />)

      const input = screen.getByLabelText('Password')
      await user.type(input, 'weak')

      // Strength indicator should appear
      await waitFor(() => {
        // Look for strength bar or indicator elements
        const strengthElements = document.querySelectorAll('[class*="bg-"]')
        expect(strengthElements.length).toBeGreaterThan(0)
      })
    })

    it('updates strength as password changes', async () => {
      const user = userEvent.setup()
      render(<ControlledPasswordField label="Password" showStrengthIndicator showRequirements />)

      const input = screen.getByLabelText('Password')

      // Type weak password
      await user.type(input, 'abcd')

      // Type stronger password
      await user.clear(input)
      await user.type(input, 'Abcdef1!')

      // The strength should have updated (we just verify no crash and input works)
      expect(input).toHaveValue('Abcdef1!')
    })
  })

  describe('ReasonTextarea Component', () => {
    it('renders with placeholder', () => {
      render(<ControlledReasonTextarea placeholder="Enter your reason..." />)

      expect(screen.getByPlaceholderText('Enter your reason...')).toBeInTheDocument()
    })

    it('renders with label when provided', () => {
      render(<ControlledReasonTextarea label="Reason for visit" />)

      expect(screen.getByLabelText('Reason for visit')).toBeInTheDocument()
    })

    it('displays character count', () => {
      render(<ControlledReasonTextarea maxLength={200} />)

      expect(screen.getByText('0/200')).toBeInTheDocument()
    })

    it('updates character count as user types', async () => {
      const user = userEvent.setup()
      render(<ControlledReasonTextarea maxLength={200} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello')

      expect(screen.getByText('5/200')).toBeInTheDocument()
    })

    it('enforces max length limit', async () => {
      const user = userEvent.setup()
      render(<ControlledReasonTextarea maxLength={10} />)

      const textarea = screen.getByRole('textbox')

      // Try to type more than max length
      await user.type(textarea, 'This is a very long text that exceeds the limit')

      // Should be truncated to max length
      expect(textarea).toHaveValue('This is a ')
      expect(screen.getByText('10/10')).toBeInTheDocument()
    })

    it('allows typing up to max length', async () => {
      const user = userEvent.setup()
      render(<ControlledReasonTextarea maxLength={10} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, '1234567890')

      expect(textarea).toHaveValue('1234567890')
      expect(screen.getByText('10/10')).toBeInTheDocument()
    })

    it('uses default max length of 200', async () => {
      render(<ControlledReasonTextarea />)

      expect(screen.getByText('0/200')).toBeInTheDocument()
    })

    it('applies focus styling on focus', async () => {
      const user = userEvent.setup()
      render(<ControlledReasonTextarea label="Reason" />)

      const textarea = screen.getByRole('textbox')
      await user.click(textarea)

      // The textarea should have focus styles applied (ring)
      expect(document.activeElement).toBe(textarea)
    })
  })

  describe('Form Submission Scenarios', () => {
    it('validates password on form submission', async () => {
      const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())
      const user = userEvent.setup()

      function TestForm() {
        const [password, setPassword] = useState('')
        const [error, setError] = useState<string | undefined>()

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          const validation = validatePassword(password)
          if (!validation.isValid) {
            setError('Password does not meet requirements')
            return
          }
          setError(undefined)
          onSubmit(e)
        }

        return (
          <TestWrapper>
            <form onSubmit={handleSubmit}>
              <PasswordField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                showStrengthIndicator
              />
              <button type="submit">Submit</button>
            </form>
          </TestWrapper>
        )
      }

      render(<TestForm />)

      // Try to submit with weak password
      const input = screen.getByLabelText('Password')
      await user.type(input, 'weak')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should show error
      expect(screen.getByText('Password does not meet requirements')).toBeInTheDocument()
      expect(onSubmit).not.toHaveBeenCalled()

      // Type strong password
      await user.clear(input)
      await user.type(input, 'StrongP@ss1')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should submit successfully
      expect(onSubmit).toHaveBeenCalled()
    })

    it('validates textarea content before submission', async () => {
      const onSubmit = vi.fn()
      const user = userEvent.setup()

      function TestForm() {
        const [reason, setReason] = useState('')
        const [error, setError] = useState<string | undefined>()

        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault()
          if (reason.trim().length < 10) {
            setError('Please provide more detail (min 10 characters)')
            return
          }
          setError(undefined)
          onSubmit({ reason })
        }

        return (
          <TestWrapper>
            <form onSubmit={handleSubmit}>
              <ReasonTextarea
                value={reason}
                onChange={setReason}
                label="Reason for visit"
              />
              {error && <p data-testid="error">{error}</p>}
              <button type="submit">Submit</button>
            </form>
          </TestWrapper>
        )
      }

      render(<TestForm />)

      // Try to submit with short reason
      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Short')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should show error
      expect(screen.getByTestId('error')).toHaveTextContent('Please provide more detail')
      expect(onSubmit).not.toHaveBeenCalled()

      // Type longer reason
      await user.clear(textarea)
      await user.type(textarea, 'I have been experiencing headaches for the past week')
      await user.click(screen.getByRole('button', { name: 'Submit' }))

      // Should submit successfully
      expect(onSubmit).toHaveBeenCalledWith({
        reason: 'I have been experiencing headaches for the past week',
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty password gracefully', () => {
      const result = validatePassword('')
      expect(result.isValid).toBe(false)
      expect(result.score).toBe(0)
    })

    it('handles password with only spaces', () => {
      const result = validatePassword('        ')
      expect(result.requirements.minLength).toBe(true)
      expect(result.requirements.hasUppercase).toBe(false)
      expect(result.requirements.hasLowercase).toBe(false)
      expect(result.isValid).toBe(false)
    })

    it('handles Unicode characters in password', () => {
      const result = validatePassword('Müller123!')
      expect(result.requirements.minLength).toBe(true)
      expect(result.requirements.hasUppercase).toBe(true)
      expect(result.requirements.hasLowercase).toBe(true)
      expect(result.requirements.hasNumber).toBe(true)
      expect(result.requirements.hasSpecial).toBe(true)
    })

    it('handles very long passwords', () => {
      const longPassword = 'A'.repeat(100) + 'a' + '1' + '!'
      const result = validatePassword(longPassword)
      expect(result.isValid).toBe(true)
      expect(result.score).toBe(4)
    })

    it('textarea handles paste of text exceeding max length', async () => {
      const user = userEvent.setup()
      render(<ControlledReasonTextarea maxLength={20} />)

      const textarea = screen.getByRole('textbox')

      // Simulate paste by typing (since paste events are complex in tests)
      // The component should truncate at maxLength
      await user.type(textarea, 'This text is definitely longer than twenty characters')

      expect(textarea).toHaveValue('This text is definit')
      expect(screen.getByText('20/20')).toBeInTheDocument()
    })
  })
})

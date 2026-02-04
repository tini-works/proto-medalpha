import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Field } from './Field'

describe('Field', () => {
  it('renders label and input', () => {
    render(<Field label="Email" />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Email').tagName).toBe('INPUT')
  })

  it('shows required indicator when required', () => {
    render(<Field label="Email" required />)

    // Label should contain the asterisk
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('shows error message with role="alert"', () => {
    render(<Field label="Email" error="Invalid email" />)

    const errorElement = screen.getByRole('alert')
    expect(errorElement).toBeInTheDocument()
    expect(errorElement).toHaveTextContent('Invalid email')
  })

  it('shows hint when no error', () => {
    render(<Field label="Email" hint="We'll never share your email" />)

    expect(screen.getByText("We'll never share your email")).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <Field
        label="Email"
        hint="We'll never share your email"
        error="Invalid email"
      />
    )

    expect(screen.queryByText("We'll never share your email")).not.toBeInTheDocument()
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('links aria-describedby to error', () => {
    render(<Field label="Email" error="Invalid email" />)

    const input = screen.getByLabelText('Email')
    const errorElement = screen.getByRole('alert')

    expect(input).toHaveAttribute('aria-describedby', errorElement.id)
  })

  it('links aria-describedby to hint', () => {
    render(<Field label="Email" hint="Enter your email" />)

    const input = screen.getByLabelText('Email')
    const hintElement = screen.getByText('Enter your email')

    expect(input).toHaveAttribute('aria-describedby', hintElement.id)
  })

  it('does not have aria-describedby when no error or hint', () => {
    render(<Field label="Email" />)

    const input = screen.getByLabelText('Email')
    expect(input).not.toHaveAttribute('aria-describedby')
  })

  it('forwards ref to input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Field label="Email" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toBe(screen.getByLabelText('Email'))
  })

  it('applies hasError styling on error', () => {
    render(<Field label="Email" error="Invalid" />)

    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('border-coral-600')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables input when disabled', () => {
    render(<Field label="Email" disabled />)

    const input = screen.getByLabelText('Email')
    expect(input).toBeDisabled()
  })

  it('applies aria-required when required', () => {
    render(<Field label="Email" required />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  it('does not have aria-required when not required', () => {
    render(<Field label="Email" />)

    const input = screen.getByLabelText('Email')
    expect(input).not.toHaveAttribute('aria-required')
  })

  it('uses provided id when given', () => {
    render(<Field label="Email" id="custom-email-id" />)

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('id', 'custom-email-id')
  })

  it('passes through input props', () => {
    render(
      <Field
        label="Email"
        type="email"
        placeholder="Enter email"
        name="userEmail"
        autoComplete="email"
      />
    )

    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('placeholder', 'Enter email')
    expect(input).toHaveAttribute('name', 'userEmail')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorText } from './ErrorText'

describe('ErrorText', () => {
  it('renders paragraph element with children', () => {
    render(<ErrorText>Please enter a valid email.</ErrorText>)
    expect(screen.getByText('Please enter a valid email.')).toBeInTheDocument()
    expect(screen.getByText('Please enter a valid email.').tagName).toBe('P')
  })

  it('has role="alert" for screen reader announcement', () => {
    render(<ErrorText>Error message</ErrorText>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Error message')
  })

  it('applies id attribute for aria-describedby linking', () => {
    render(<ErrorText id="email-error">Error</ErrorText>)
    expect(screen.getByText('Error')).toHaveAttribute('id', 'email-error')
  })

  it('applies error text styling classes', () => {
    render(<ErrorText data-testid="error">Error</ErrorText>)
    const error = screen.getByTestId('error')
    expect(error.className).toContain('text-sm')
    expect(error.className).toContain('text-coral-800')
  })

  it('merges custom className', () => {
    render(<ErrorText className="custom-class" data-testid="error">Error</ErrorText>)
    expect(screen.getByTestId('error').className).toContain('custom-class')
  })

  it('passes through additional props', () => {
    render(<ErrorText data-testid="error" aria-live="assertive">Error</ErrorText>)
    expect(screen.getByTestId('error')).toHaveAttribute('aria-live', 'assertive')
  })
})

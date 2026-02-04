import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HelperText } from './HelperText'

describe('HelperText', () => {
  it('renders paragraph element with children', () => {
    render(<HelperText>We will never share your email.</HelperText>)
    expect(screen.getByText('We will never share your email.')).toBeInTheDocument()
    expect(screen.getByText('We will never share your email.').tagName).toBe('P')
  })

  it('applies id attribute for aria-describedby linking', () => {
    render(<HelperText id="email-hint">Hint text</HelperText>)
    expect(screen.getByText('Hint text')).toHaveAttribute('id', 'email-hint')
  })

  it('applies text styling classes', () => {
    render(<HelperText data-testid="helper">Hint</HelperText>)
    const helper = screen.getByTestId('helper')
    expect(helper.className).toContain('text-sm')
    expect(helper.className).toContain('text-slate-500')
  })

  it('merges custom className', () => {
    render(<HelperText className="custom-class" data-testid="helper">Hint</HelperText>)
    expect(screen.getByTestId('helper').className).toContain('custom-class')
  })

  it('passes through additional props', () => {
    render(<HelperText data-testid="helper" aria-live="polite">Hint</HelperText>)
    expect(screen.getByTestId('helper')).toHaveAttribute('aria-live', 'polite')
  })
})

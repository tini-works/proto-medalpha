import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('renders label element with children', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Email').tagName).toBe('LABEL')
  })

  it('applies htmlFor attribute', () => {
    render(<Label htmlFor="email-input">Email</Label>)
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-input')
  })

  it('shows required indicator when required is true', () => {
    render(<Label required>Email</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('hides required indicator from screen readers', () => {
    render(<Label required>Email</Label>)
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true')
  })

  it('does not show required indicator when required is false', () => {
    render(<Label required={false}>Email</Label>)
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('applies text styling classes', () => {
    render(<Label data-testid="label">Email</Label>)
    const label = screen.getByTestId('label')
    expect(label.className).toContain('text-sm')
    expect(label.className).toContain('font-medium')
    expect(label.className).toContain('text-slate-700')
  })

  it('merges custom className', () => {
    render(<Label className="custom-class" data-testid="label">Email</Label>)
    expect(screen.getByTestId('label').className).toContain('custom-class')
  })

  it('passes through additional props', () => {
    render(<Label id="email-label" data-testid="label">Email</Label>)
    expect(screen.getByTestId('label')).toHaveAttribute('id', 'email-label')
  })
})

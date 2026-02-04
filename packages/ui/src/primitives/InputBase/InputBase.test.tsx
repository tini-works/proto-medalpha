import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { InputBase } from './InputBase'

describe('InputBase', () => {
  it('renders an input element', () => {
    render(<InputBase data-testid="input" />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
    expect(screen.getByTestId('input').tagName).toBe('INPUT')
  })

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<InputBase ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies type attribute', () => {
    render(<InputBase type="email" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'email')
  })

  it('applies placeholder', () => {
    render(<InputBase placeholder="Enter text" data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('placeholder', 'Enter text')
  })

  it('handles value and onChange', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(
      <InputBase
        value=""
        onChange={handleChange}
        data-testid="input"
      />
    )

    await user.type(screen.getByTestId('input'), 'hello')
    expect(handleChange).toHaveBeenCalled()
  })

  it('applies aria-invalid when hasError is true', () => {
    render(<InputBase hasError data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not apply aria-invalid when hasError is false', () => {
    render(<InputBase hasError={false} data-testid="input" />)
    expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid')
  })

  it('applies disabled attribute', () => {
    render(<InputBase disabled data-testid="input" />)
    expect(screen.getByTestId('input')).toBeDisabled()
  })

  it('applies error styling classes when hasError', () => {
    render(<InputBase hasError data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-coral-600')
    expect(input.className).toContain('focus:ring-coral-500')
  })

  it('applies default styling classes when no error', () => {
    render(<InputBase data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('border-cream-400')
    expect(input.className).toContain('focus:ring-teal-500')
  })

  it('applies disabled styling classes', () => {
    render(<InputBase disabled data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input.className).toContain('bg-cream-200')
    expect(input.className).toContain('cursor-not-allowed')
  })

  it('merges custom className', () => {
    render(<InputBase className="custom-class" data-testid="input" />)
    expect(screen.getByTestId('input').className).toContain('custom-class')
  })

  it('passes through additional props', () => {
    render(<InputBase name="email" autoComplete="email" data-testid="input" />)
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('autoComplete', 'email')
  })
})

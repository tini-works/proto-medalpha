import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { Select } from './Select'

const mockOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
]

describe('Select', () => {
  it('renders label and select element', () => {
    render(<Select label="Country" options={mockOptions} />)

    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders all options', () => {
    render(<Select label="Country" options={mockOptions} />)

    expect(screen.getByRole('option', { name: 'United States' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Canada' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Mexico' })).toBeInTheDocument()
  })

  it('shows placeholder when provided', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        placeholder="Select a country"
      />
    )

    const placeholder = screen.getByRole('option', { name: 'Select a country' })
    expect(placeholder).toBeInTheDocument()
    expect(placeholder).toBeDisabled()
  })

  it('shows error message when error prop is provided', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        error="Please select a country"
      />
    )

    expect(screen.getByText('Please select a country')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows hint when no error is present', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        hint="Choose your country"
      />
    )

    expect(screen.getByText('Choose your country')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        hint="Choose your country"
        error="Required field"
      />
    )

    expect(screen.queryByText('Choose your country')).not.toBeInTheDocument()
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('forwards ref to select element', () => {
    const ref = createRef<HTMLSelectElement>()
    render(<Select ref={ref} label="Country" options={mockOptions} />)

    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('links aria-describedby to error message', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        error="Required field"
        id="country-select"
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-describedby', 'country-select-error')
  })

  it('links aria-describedby to hint when no error', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        hint="Choose wisely"
        id="country-select"
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('aria-describedby', 'country-select-hint')
  })

  it('sets aria-invalid when error is present', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        error="Invalid selection"
      />
    )

    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid when no error', () => {
    render(<Select label="Country" options={mockOptions} />)

    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid')
  })

  it('applies error styling classes when error is present', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        error="Error"
        data-testid="select"
      />
    )

    const select = screen.getByRole('combobox')
    expect(select.className).toContain('border-coral-600')
    expect(select.className).toContain('focus-visible:ring-coral-500')
  })

  it('applies normal styling classes when no error', () => {
    render(<Select label="Country" options={mockOptions} data-testid="select" />)

    const select = screen.getByRole('combobox')
    expect(select.className).toContain('border-cream-400')
    expect(select.className).toContain('focus-visible:ring-teal-500')
  })

  it('applies disabled styling when disabled', () => {
    render(<Select label="Country" options={mockOptions} disabled />)

    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
    expect(select.className).toContain('bg-cream-200')
    expect(select.className).toContain('text-slate-500')
  })

  it('shows required indicator when required', () => {
    render(<Select label="Country" options={mockOptions} required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('associates label with select via htmlFor', () => {
    render(<Select label="Country" options={mockOptions} id="my-select" />)

    const label = screen.getByText('Country')
    expect(label).toHaveAttribute('for', 'my-select')
  })

  it('merges custom className', () => {
    render(
      <Select label="Country" options={mockOptions} className="custom-class" />
    )

    expect(screen.getByRole('combobox').className).toContain('custom-class')
  })

  it('passes through additional props', () => {
    render(
      <Select
        label="Country"
        options={mockOptions}
        name="country"
        data-testid="select"
      />
    )

    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('name', 'country')
    expect(select).toHaveAttribute('data-testid', 'select')
  })
})

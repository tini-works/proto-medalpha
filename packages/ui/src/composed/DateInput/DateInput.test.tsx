import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateInput } from './DateInput'

describe('DateInput', () => {
  it('renders label and date input', () => {
    render(<DateInput label="Date of Birth" value="" onChange={() => {}} />)

    expect(screen.getByText('Date of Birth')).toBeInTheDocument()
    // Date inputs don't have textbox role, use getByLabelText instead
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument()
    expect(screen.getByLabelText('Date of Birth')).toHaveAttribute('type', 'date')
  })

  it('associates label with input via htmlFor', () => {
    render(<DateInput label="Start Date" value="" onChange={() => {}} id="start-date" />)

    const label = screen.getByText('Start Date')
    expect(label).toHaveAttribute('for', 'start-date')
  })

  it('calls onChange with value when date is selected', async () => {
    const handleChange = vi.fn()
    render(<DateInput label="Date" value="" onChange={handleChange} />)

    const input = screen.getByLabelText('Date')
    await userEvent.clear(input)
    await userEvent.type(input, '2024-06-15')

    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message when error prop is provided', () => {
    render(
      <DateInput
        label="Date"
        value=""
        onChange={() => {}}
        error="Please select a valid date"
      />
    )

    expect(screen.getByText('Please select a valid date')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a valid date')
  })

  it('shows hint when no error is present', () => {
    render(
      <DateInput
        label="Date"
        value=""
        onChange={() => {}}
        hint="Select your preferred date"
      />
    )

    expect(screen.getByText('Select your preferred date')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <DateInput
        label="Date"
        value=""
        onChange={() => {}}
        hint="Select your preferred date"
        error="Invalid date"
      />
    )

    expect(screen.queryByText('Select your preferred date')).not.toBeInTheDocument()
    expect(screen.getByText('Invalid date')).toBeInTheDocument()
  })

  it('respects min prop', () => {
    render(
      <DateInput label="Date" value="" onChange={() => {}} min="2024-01-01" />
    )

    const input = screen.getByLabelText('Date')
    expect(input).toHaveAttribute('min', '2024-01-01')
  })

  it('respects max prop', () => {
    render(
      <DateInput label="Date" value="" onChange={() => {}} max="2024-12-31" />
    )

    const input = screen.getByLabelText('Date')
    expect(input).toHaveAttribute('max', '2024-12-31')
  })

  it('applies disabled state', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} disabled />)

    const input = screen.getByLabelText('Date')
    expect(input).toBeDisabled()
  })

  it('shows required indicator when required is true', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('sets aria-required when required', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} required />)

    const input = screen.getByLabelText(/Date/)
    expect(input).toHaveAttribute('aria-required', 'true')
  })

  it('sets aria-invalid when error is present', () => {
    render(
      <DateInput label="Date" value="" onChange={() => {}} error="Invalid" />
    )

    const input = screen.getByLabelText('Date')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-describedby to error id when error exists', () => {
    render(
      <DateInput
        label="Date"
        value=""
        onChange={() => {}}
        id="my-date"
        error="Invalid date"
      />
    )

    const input = screen.getByLabelText('Date')
    expect(input).toHaveAttribute('aria-describedby', 'my-date-error')
  })

  it('sets aria-describedby to hint id when only hint exists', () => {
    render(
      <DateInput
        label="Date"
        value=""
        onChange={() => {}}
        id="my-date"
        hint="Pick a date"
      />
    )

    const input = screen.getByLabelText('Date')
    expect(input).toHaveAttribute('aria-describedby', 'my-date-hint')
  })

  it('uses auto-generated id when id prop is not provided', () => {
    render(<DateInput label="Date" value="" onChange={() => {}} />)

    const label = screen.getByText('Date')
    const input = screen.getByLabelText('Date')
    expect(label).toHaveAttribute('for')
    expect(input).toHaveAttribute('id')
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'))
  })

  it('applies custom className to container', () => {
    const { container } = render(
      <DateInput label="Date" value="" onChange={() => {}} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('displays value in input', () => {
    render(<DateInput label="Date" value="2024-06-15" onChange={() => {}} />)

    const input = screen.getByLabelText('Date')
    expect(input).toHaveValue('2024-06-15')
  })
})

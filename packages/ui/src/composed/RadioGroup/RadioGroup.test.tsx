import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RadioGroup } from './RadioGroup'

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
]

const optionsWithDescriptions = [
  { value: 'basic', label: 'Basic Plan', description: 'Good for individuals' },
  { value: 'pro', label: 'Pro Plan', description: 'Best for teams' },
]

describe('RadioGroup', () => {
  it('renders legend and all options', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Select option')).toBeInTheDocument()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
    expect(screen.getByText('Option 3')).toBeInTheDocument()
  })

  it('shows option descriptions when provided', () => {
    render(
      <RadioGroup
        label="Choose plan"
        name="plan"
        options={optionsWithDescriptions}
        value=""
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Good for individuals')).toBeInTheDocument()
    expect(screen.getByText('Best for teams')).toBeInTheDocument()
  })

  it('calls onChange when option selected', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={handleChange}
      />
    )

    await user.click(screen.getByLabelText('Option 2'))

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith('option2')
  })

  it('shows error message', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={() => {}}
        error="Please select an option"
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Please select an option')
  })

  it('shows required indicator', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={() => {}}
        required
      />
    )

    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-coral-600')
  })

  it('applies selected styling to checked option', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value="option2"
        onChange={() => {}}
      />
    )

    const selectedRadio = screen.getByLabelText('Option 2')
    expect(selectedRadio).toBeChecked()

    // The label (parent) should have selected styling
    const selectedLabel = selectedRadio.closest('label')
    expect(selectedLabel?.className).toContain('border-teal-500')
    expect(selectedLabel?.className).toContain('bg-teal-50')

    // Unselected option should have default styling
    const unselectedRadio = screen.getByLabelText('Option 1')
    const unselectedLabel = unselectedRadio.closest('label')
    expect(unselectedLabel?.className).toContain('border-cream-400')
    expect(unselectedLabel?.className).toContain('bg-white')
  })

  it('disabled state prevents interaction', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={handleChange}
        disabled
      />
    )

    const radio = screen.getByLabelText('Option 1')
    expect(radio).toBeDisabled()

    await user.click(radio)
    expect(handleChange).not.toHaveBeenCalled()

    // Check disabled styling on label
    const label = radio.closest('label')
    expect(label?.className).toContain('cursor-not-allowed')
    expect(label?.className).toContain('opacity-50')
  })

  it('uses fieldset/legend for proper a11y structure', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={() => {}}
      />
    )

    const fieldset = screen.getByRole('group')
    expect(fieldset.tagName).toBe('FIELDSET')
    expect(fieldset.querySelector('legend')).toHaveTextContent('Select option')
  })

  it('applies custom className', () => {
    render(
      <RadioGroup
        label="Select option"
        name="test"
        options={defaultOptions}
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    )

    const fieldset = screen.getByRole('group')
    expect(fieldset.className).toContain('custom-class')
  })
})

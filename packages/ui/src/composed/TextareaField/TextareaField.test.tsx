import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TextareaField } from './TextareaField'

describe('TextareaField', () => {
  it('renders label and textarea', () => {
    render(<TextareaField label="Description" value="" onChange={() => {}} />)

    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('associates label with textarea via htmlFor', () => {
    render(
      <TextareaField label="Description" value="" onChange={() => {}} id="my-textarea" />
    )

    const label = screen.getByText('Description')
    expect(label).toHaveAttribute('for', 'my-textarea')
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'my-textarea')
  })

  it('shows character count when maxLength is provided', () => {
    render(
      <TextareaField
        label="Description"
        value="Hello"
        onChange={() => {}}
        maxLength={100}
      />
    )

    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('enforces maxLength by truncating input', () => {
    const onChange = vi.fn()
    render(
      <TextareaField value="" onChange={onChange} maxLength={5} />
    )

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello World' } })

    // Should truncate to maxLength
    expect(onChange).toHaveBeenCalledWith('Hello')
  })

  it('allows input within maxLength', () => {
    const onChange = vi.fn()
    render(
      <TextareaField value="" onChange={onChange} maxLength={20} />
    )

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })

    expect(onChange).toHaveBeenCalledWith('Hello')
  })

  it('calls onChange with value when no maxLength', () => {
    const onChange = vi.fn()
    render(<TextareaField value="" onChange={onChange} />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Any length text' } })

    expect(onChange).toHaveBeenCalledWith('Any length text')
  })

  it('shows error message when error prop is provided', () => {
    render(
      <TextareaField
        label="Description"
        value=""
        onChange={() => {}}
        error="This field is required"
      />
    )

    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('shows hint when no error is present', () => {
    render(
      <TextareaField
        label="Description"
        value=""
        onChange={() => {}}
        hint="Enter a brief description"
      />
    )

    expect(screen.getByText('Enter a brief description')).toBeInTheDocument()
  })

  it('shows error instead of hint when both are provided', () => {
    render(
      <TextareaField
        label="Description"
        value=""
        onChange={() => {}}
        error="Required"
        hint="Enter a description"
      />
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.queryByText('Enter a description')).not.toBeInTheDocument()
  })

  it('applies error styling when error is present', () => {
    render(
      <TextareaField
        label="Description"
        value=""
        onChange={() => {}}
        error="Error message"
      />
    )

    const textarea = screen.getByRole('textbox')
    expect(textarea.className).toContain('border-coral-600')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not apply error styling when no error', () => {
    render(<TextareaField label="Description" value="" onChange={() => {}} />)

    const textarea = screen.getByRole('textbox')
    expect(textarea.className).not.toContain('border-coral-600')
    expect(textarea).not.toHaveAttribute('aria-invalid')
  })

  it('shows required indicator when required is true', () => {
    render(
      <TextareaField label="Description" value="" onChange={() => {}} required />
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies disabled state', () => {
    render(
      <TextareaField label="Description" value="" onChange={() => {}} disabled />
    )

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders with placeholder', () => {
    render(
      <TextareaField
        value=""
        onChange={() => {}}
        placeholder="Type here..."
      />
    )

    expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument()
  })

  it('applies custom rows', () => {
    render(<TextareaField value="" onChange={() => {}} rows={6} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6')
  })

  it('merges custom className', () => {
    render(
      <TextareaField value="" onChange={() => {}} className="custom-class" />
    )

    expect(screen.getByRole('textbox').className).toContain('custom-class')
  })

  it('links textarea to error via aria-describedby', () => {
    render(
      <TextareaField
        value=""
        onChange={() => {}}
        error="Error"
        id="test-field"
      />
    )

    const textarea = screen.getByRole('textbox')
    const describedBy = textarea.getAttribute('aria-describedby')
    expect(describedBy).toContain('test-field-error')
  })

  it('links textarea to hint via aria-describedby when no error', () => {
    render(
      <TextareaField
        value=""
        onChange={() => {}}
        hint="Hint text"
        id="test-field"
      />
    )

    const textarea = screen.getByRole('textbox')
    const describedBy = textarea.getAttribute('aria-describedby')
    expect(describedBy).toContain('test-field-hint')
  })

  it('links textarea to character count via aria-describedby', () => {
    render(
      <TextareaField
        value=""
        onChange={() => {}}
        maxLength={100}
        id="test-field"
      />
    )

    const textarea = screen.getByRole('textbox')
    const describedBy = textarea.getAttribute('aria-describedby')
    expect(describedBy).toContain('test-field-count')
  })
})

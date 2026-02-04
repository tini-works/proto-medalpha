import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    placeholder: 'Search...',
    'aria-label': 'Search input',
  }

  it('renders search icon and input', () => {
    render(<SearchInput {...defaultProps} />)

    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('calls onChange with value when typing', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<SearchInput {...defaultProps} onChange={handleChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'test')

    expect(handleChange).toHaveBeenCalledWith('t')
    expect(handleChange).toHaveBeenCalledWith('e')
    expect(handleChange).toHaveBeenCalledWith('s')
    expect(handleChange).toHaveBeenCalledWith('t')
    expect(handleChange).toHaveBeenCalledTimes(4)
  })

  it('calls onKeyDown when key pressed', async () => {
    const handleKeyDown = vi.fn()
    const user = userEvent.setup()

    render(<SearchInput {...defaultProps} onKeyDown={handleKeyDown} />)

    const input = screen.getByRole('textbox')
    await user.type(input, '{Enter}')

    expect(handleKeyDown).toHaveBeenCalled()
    expect(handleKeyDown.mock.calls[0][0].key).toBe('Enter')
  })

  it('has correct aria-label', () => {
    render(<SearchInput {...defaultProps} aria-label="Search specialists" />)

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-label',
      'Search specialists'
    )
  })

  it('applies disabled state', () => {
    render(<SearchInput {...defaultProps} disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input.className).toContain('disabled:cursor-not-allowed')
  })

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<SearchInput {...defaultProps} ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.tagName).toBe('INPUT')
  })

  it('displays placeholder text', () => {
    render(<SearchInput {...defaultProps} placeholder="Search doctors..." />)

    expect(screen.getByPlaceholderText('Search doctors...')).toBeInTheDocument()
  })

  it('displays current value', () => {
    render(<SearchInput {...defaultProps} value="cardiology" />)

    expect(screen.getByRole('textbox')).toHaveValue('cardiology')
  })

  it('merges custom className', () => {
    render(<SearchInput {...defaultProps} className="custom-class" />)

    const input = screen.getByRole('textbox')
    expect(input.className).toContain('custom-class')
  })
})

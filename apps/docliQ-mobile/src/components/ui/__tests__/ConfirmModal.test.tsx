import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from '../ConfirmModal'

describe('ConfirmModal', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmLabel: 'Yes',
    cancelLabel: 'No',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renders when open is true', () => {
    render(<ConfirmModal {...defaultProps} />)

    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<ConfirmModal {...defaultProps} open={false} />)

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', async () => {
    const onConfirm = vi.fn()
    const user = userEvent.setup()

    render(<ConfirmModal {...defaultProps} onConfirm={onConfirm} />)

    await user.click(screen.getByRole('button', { name: 'Yes' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'No' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when close button clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />)

    const backdrop = screen.getByTestId('modal-backdrop')
    await user.click(backdrop)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<ConfirmModal {...defaultProps} onCancel={onCancel} />)

    await user.keyboard('{Escape}')

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('applies destructive styling when variant is destructive', () => {
    render(<ConfirmModal {...defaultProps} variant="destructive" />)

    const confirmButton = screen.getByRole('button', { name: 'Yes' })
    expect(confirmButton).toHaveClass('bg-red-600')
  })

  it('applies default styling when variant is default', () => {
    render(<ConfirmModal {...defaultProps} variant="default" />)

    const confirmButton = screen.getByRole('button', { name: 'Yes' })
    expect(confirmButton).toHaveClass('bg-teal-500')
  })

  it('has proper accessibility attributes', () => {
    render(<ConfirmModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteWarningModal } from '../DeleteWarningModal'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'deleteWarning.title': 'Delete Your Account?',
        'deleteWarning.consequence1': 'All upcoming appointments will be cancelled',
        'deleteWarning.consequence2': 'Your health records will be permanently deleted',
        'deleteWarning.consequence3': 'Connections with your doctors will be severed',
        'deleteWarning.consequence4': 'This action cannot be undone',
        'deleteWarning.cancel': 'Cancel',
        'deleteWarning.continue': 'I Understand, Continue',
      }
      return translations[key] || key
    },
  }),
}))

describe('DeleteWarningModal', () => {
  const defaultProps = {
    open: true,
    onCancel: vi.fn(),
    onContinue: vi.fn(),
  }

  afterEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  it('renders all consequence items when open', () => {
    render(<DeleteWarningModal {...defaultProps} />)

    expect(screen.getByText('Delete Your Account?')).toBeInTheDocument()
    expect(screen.getByText('All upcoming appointments will be cancelled')).toBeInTheDocument()
    expect(screen.getByText('Your health records will be permanently deleted')).toBeInTheDocument()
    expect(screen.getByText('Connections with your doctors will be severed')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<DeleteWarningModal {...defaultProps} open={false} />)

    expect(screen.queryByText('Delete Your Account?')).not.toBeInTheDocument()
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<DeleteWarningModal {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onContinue when "I Understand, Continue" button is clicked', async () => {
    const onContinue = vi.fn()
    const user = userEvent.setup()

    render(<DeleteWarningModal {...defaultProps} onContinue={onContinue} />)

    await user.click(screen.getByRole('button', { name: 'I Understand, Continue' }))

    expect(onContinue).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<DeleteWarningModal {...defaultProps} onCancel={onCancel} />)

    await user.keyboard('{Escape}')

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop is clicked', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<DeleteWarningModal {...defaultProps} onCancel={onCancel} />)

    const backdrop = screen.getByTestId('delete-warning-modal-backdrop')
    await user.click(backdrop)

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('has destructive styling on continue button', () => {
    render(<DeleteWarningModal {...defaultProps} />)

    const continueButton = screen.getByRole('button', { name: 'I Understand, Continue' })
    expect(continueButton).toHaveClass('bg-red-600')
  })

  it('has proper accessibility attributes', () => {
    render(<DeleteWarningModal {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })
})

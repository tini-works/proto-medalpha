import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PendingDeletionBanner } from '../PendingDeletionBanner'

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: { time?: string }) => {
      const translations: Record<string, string> = {
        'deletePending.title': 'Account deletion scheduled',
        'deletePending.countdown': `Your account will be deleted in ${params?.time || '{{time}}'}`,
        'deletePending.cancelButton': 'Cancel Deletion',
        'deletePending.mockSkip': 'DEV: Skip to deletion',
      }
      return translations[key] || key
    },
  }),
}))

describe('PendingDeletionBanner', () => {
  // Set a fixed time for testing
  const now = new Date('2024-01-15T10:00:00Z').getTime()
  const expiresAt = new Date('2024-01-18T10:00:00Z').toISOString() // 72 hours later

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  const defaultProps = {
    expiresAt,
    onCancel: vi.fn(),
  }

  it('renders the banner with countdown', () => {
    render(<PendingDeletionBanner {...defaultProps} />)

    expect(screen.getByText('Account deletion scheduled')).toBeInTheDocument()
    expect(screen.getByText(/Your account will be deleted in 72h 0m/)).toBeInTheDocument()
  })

  it('renders Cancel Deletion button', () => {
    render(<PendingDeletionBanner {...defaultProps} />)

    expect(screen.getByRole('button', { name: 'Cancel Deletion' })).toBeInTheDocument()
  })

  it('calls onCancel when Cancel Deletion is clicked', async () => {
    vi.useRealTimers() // Need real timers for userEvent
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(<PendingDeletionBanner {...defaultProps} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancel Deletion' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('renders DEV skip button when onSkipToDeletion is provided', () => {
    const onSkipToDeletion = vi.fn()
    render(<PendingDeletionBanner {...defaultProps} onSkipToDeletion={onSkipToDeletion} />)

    expect(screen.getByTestId('dev-skip-deletion')).toBeInTheDocument()
    expect(screen.getByText('DEV: Skip to deletion')).toBeInTheDocument()
  })

  it('does not render DEV skip button when onSkipToDeletion is not provided', () => {
    render(<PendingDeletionBanner {...defaultProps} />)

    expect(screen.queryByTestId('dev-skip-deletion')).not.toBeInTheDocument()
  })

  it('calls onSkipToDeletion when DEV skip button is clicked', async () => {
    vi.useRealTimers()
    const onSkipToDeletion = vi.fn()
    const user = userEvent.setup()

    render(<PendingDeletionBanner {...defaultProps} onSkipToDeletion={onSkipToDeletion} />)

    await user.click(screen.getByTestId('dev-skip-deletion'))

    expect(onSkipToDeletion).toHaveBeenCalledTimes(1)
  })

  it('has alert role for accessibility', () => {
    render(<PendingDeletionBanner {...defaultProps} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders with correct test id', () => {
    render(<PendingDeletionBanner {...defaultProps} />)

    expect(screen.getByTestId('pending-deletion-banner')).toBeInTheDocument()
  })

  it('formats countdown correctly for less than 1 hour', () => {
    const expiresIn30Minutes = new Date(now + 30 * 60 * 1000).toISOString()
    render(<PendingDeletionBanner {...defaultProps} expiresAt={expiresIn30Minutes} />)

    expect(screen.getByText(/Your account will be deleted in 0h 30m/)).toBeInTheDocument()
  })
})

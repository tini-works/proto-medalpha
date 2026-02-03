import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import DeleteEmailConfirmScreen from '../DeleteEmailConfirmScreen'

const mockNavigate = vi.fn()
const mockStartDeletion = vi.fn()

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock state - need to mock all hooks used by components
vi.mock('../../../state', () => ({
  useProfile: () => ({
    profile: { email: 'john@example.com' },
  }),
  useAppState: () => ({
    startDeletion: mockStartDeletion,
  }),
  useBooking: () => ({
    selectedDoctor: null,
  }),
}))

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'deleteEmail.title': 'Confirm via Email',
        'deleteEmail.description': 'For your security, we\'ll send a confirmation link to:',
        'deleteEmail.explanation': 'Click the link in the email to start the 72-hour deletion countdown.',
        'deleteEmail.sendButton': 'Send Confirmation Email',
        'deleteEmail.checkInbox': 'Check your inbox',
        'deleteEmail.resend': 'Resend email',
        'deleteEmail.mockConfirm': 'DEV: Simulate Email Confirmed',
      }
      return translations[key] || key
    },
  }),
}))

describe('DeleteEmailConfirmScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <DeleteEmailConfirmScreen />
      </BrowserRouter>
    )
  }

  it('renders email confirmation UI with masked email', () => {
    renderComponent()

    expect(screen.getAllByText('Confirm via Email').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/j\*\*\*n@example\.com/)).toBeInTheDocument()
    expect(screen.getByText('For your security, we\'ll send a confirmation link to:')).toBeInTheDocument()
  })

  it('shows "Send Confirmation Email" button initially', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Send Confirmation Email' })).toBeInTheDocument()
    expect(screen.queryByText('Check your inbox')).not.toBeInTheDocument()
  })

  it('shows "Check inbox" and mock confirm button after clicking Send', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Send Confirmation Email' }))

    expect(screen.getByText('Check your inbox')).toBeInTheDocument()
    expect(screen.getByTestId('mock-email-confirm')).toBeInTheDocument()
    expect(screen.getByText('DEV: Simulate Email Confirmed')).toBeInTheDocument()
  })

  it('calls startDeletion and navigates when mock confirm is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    // First send the email
    await user.click(screen.getByRole('button', { name: 'Send Confirmation Email' }))

    // Then click mock confirm
    await user.click(screen.getByTestId('mock-email-confirm'))

    expect(mockStartDeletion).toHaveBeenCalledWith('j***n@example.com')
    expect(mockNavigate).toHaveBeenCalledWith('/settings/privacy')
  })

  it('shows resend button after email is sent', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Send Confirmation Email' }))

    expect(screen.getByRole('button', { name: 'Resend email' })).toBeInTheDocument()
  })
})

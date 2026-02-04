import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import PrivacyDataScreen from '../PrivacyDataScreen'

const mockNavigate = vi.fn()
const mockCancelDeletion = vi.fn()
const mockCompleteDeletion = vi.fn()

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Variable to control pending deletion state
let mockPendingDeletion: { requestedAt: string; expiresAt: string; email: string } | null = null

// Mock state - need to mock all hooks used by components
vi.mock('../../../state', () => ({
  useAppState: () => ({
    pendingDeletion: mockPendingDeletion,
    cancelDeletion: mockCancelDeletion,
    completeDeletion: mockCompleteDeletion,
  }),
  useBooking: () => ({
    selectedDoctor: null,
  }),
}))

// Mock legal components
vi.mock('../../../components/legal', () => ({
  resetCookiePreferences: vi.fn(),
  CookiePreferencesModal: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? <div data-testid="cookie-preferences-modal"><button onClick={onClose}>Close</button></div> : null,
}))

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: (ns?: string) => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'privacyData': 'Privacy & Data',
        'cancel': 'Cancel',
        'privacyHub.dangerZone': 'Danger Zone',
        'privacyHub.deleteAccount': 'Delete My Account',
        'privacyHub.deleteAccountDesc': 'Permanently delete all your data',
        'privacyHub.deleteAccountWarning': 'Open appointments will be cancelled automatically.',
        'deleteWarning.title': 'Delete Your Account?',
        'deleteWarning.consequence1': 'All upcoming appointments will be cancelled',
        'deleteWarning.consequence2': 'Your health records will be permanently deleted',
        'deleteWarning.consequence3': 'Connections with your doctors will be severed',
        'deleteWarning.consequence4': 'This action cannot be undone',
        'deleteWarning.cancel': 'Cancel',
        'deleteWarning.continue': 'I Understand, Continue',
        'deletePending.title': 'Account deletion scheduled',
        'deletePending.countdown': 'Your account will be deleted in {{time}}',
        'deletePending.cancelButton': 'Cancel Deletion',
        'deleteCancel.title': 'Keep Your Account?',
        'deleteCancel.message': 'Your account will not be deleted and all your data will remain intact.',
        'deleteCancel.keepButton': 'Keep My Account',
        'deleteCancel.continueButton': 'Continue Deletion',
        'deleteEmail.explanation': 'Click the link in the email to start the 72-hour deletion countdown.',
      }
      return translations[key] || key
    },
  }),
}))

describe('PrivacyDataScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPendingDeletion = null
  })

  afterEach(() => {
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.top = ''
    document.body.style.width = ''
  })

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <PrivacyDataScreen />
      </BrowserRouter>
    )
  }

  it('shows delete button when no pending deletion', () => {
    renderComponent()

    expect(screen.getByRole('button', { name: 'Delete My Account' })).toBeInTheDocument()
  })

  it('opens DeleteWarningModal when delete button is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    await user.click(screen.getByRole('button', { name: 'Delete My Account' }))

    await waitFor(() => {
      expect(screen.getByText('Delete Your Account?')).toBeInTheDocument()
    })
    expect(screen.getByText('All upcoming appointments will be cancelled')).toBeInTheDocument()
  })

  it('navigates to email confirm screen when warning modal continue is clicked', async () => {
    const user = userEvent.setup()
    renderComponent()

    // Open the warning modal
    await user.click(screen.getByRole('button', { name: 'Delete My Account' }))

    // Click continue
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'I Understand, Continue' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: 'I Understand, Continue' }))

    expect(mockNavigate).toHaveBeenCalledWith('/settings/delete-email-confirm')
  })

  it('shows pending status UI when pendingDeletion is active', () => {
    mockPendingDeletion = {
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      email: 'j***n@example.com',
    }

    renderComponent()

    // Multiple elements will have this text (banner + danger zone)
    expect(screen.getAllByText('Account deletion scheduled').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByRole('button', { name: 'Delete My Account' })).not.toBeInTheDocument()
  })

  it('shows cancel deletion button instead of delete button during pending state', () => {
    mockPendingDeletion = {
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      email: 'j***n@example.com',
    }

    renderComponent()

    // Should show Cancel Deletion button in danger zone (not the delete button)
    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel Deletion' })
    expect(cancelButtons.length).toBeGreaterThan(0)
    expect(screen.queryByRole('button', { name: 'Delete My Account' })).not.toBeInTheDocument()
  })

  it('shows PendingDeletionBanner when pendingDeletion is active', () => {
    mockPendingDeletion = {
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      email: 'j***n@example.com',
    }

    renderComponent()

    expect(screen.getByTestId('pending-deletion-banner')).toBeInTheDocument()
  })
})

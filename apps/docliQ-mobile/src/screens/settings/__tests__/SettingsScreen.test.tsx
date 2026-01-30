import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import SettingsScreen from '../SettingsScreen'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock state hooks
const mockSignOut = vi.fn()
vi.mock('../../../state', () => ({
  useProfile: () => ({
    profile: {
      fullName: 'Test User',
      email: 'test@example.com',
      insuranceType: 'GKV',
    },
  }),
  useAuth: () => ({
    signOut: mockSignOut,
  }),
  usePreferences: () => ({
    language: 'en',
  }),
  useBooking: () => ({
    selectedDoctor: null,
  }),
}))

// Spy on window.confirm
const windowConfirmSpy = vi.spyOn(window, 'confirm')

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      settings: {
        settings: 'Settings',
        logOut: 'Log Out',
        signOut: 'Sign Out',
        confirmSignOut: 'Are you sure you want to sign out?',
        cancel: 'Cancel',
        familyMembers: 'Family Members',
        linkedHealthAccounts: 'Linked accounts',
        language: 'Language',
        setAppLanguage: 'Set language',
        notifications: 'Notifications',
        alertsAndReminders: 'Alerts',
        privacyData: 'Privacy',
        manageYourSecurity: 'Security',
        support: 'Support',
        faqs: 'FAQs',
        commonQuestionsAnswers: 'Common questions',
        contactSupport: 'Contact',
        getHelpFromTeam: 'Get help',
        helpCentre: 'Help',
        browseGuidesAndTutorials: 'Browse guides',
        tabs: {
          home: 'Home',
          appointments: 'Appointments',
          settings: 'Settings',
        },
      },
    },
  },
})

function renderSettingsScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <SettingsScreen />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('SettingsScreen - Sign Out', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    windowConfirmSpy.mockClear()
  })

  it('does not use native window.confirm', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    const logoutButton = screen.getByRole('button', { name: /log out/i })
    await user.click(logoutButton)

    // Native confirm should NOT be called
    expect(windowConfirmSpy).not.toHaveBeenCalled()
  })

  it('shows custom confirmation modal when logout clicked', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    await user.click(screen.getByRole('button', { name: /log out/i }))

    // Custom modal should appear
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByText('Are you sure you want to sign out?')).toBeInTheDocument()
  })

  it('closes modal and stays on settings when cancel clicked', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    // Open modal
    await user.click(screen.getByRole('button', { name: /log out/i }))

    // Click cancel
    await user.click(screen.getByRole('button', { name: /cancel/i }))

    // Modal closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // Did not sign out
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('signs out when confirm clicked in modal', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    // Open modal
    await user.click(screen.getByRole('button', { name: /log out/i }))

    // Click confirm (Log Out button in modal)
    const confirmButtons = screen.getAllByRole('button', { name: /log out/i })
    // The second "Log Out" button is in the modal
    const modalConfirmButton = confirmButtons[1]
    await user.click(modalConfirmButton)

    // Should sign out and navigate
    expect(mockSignOut).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalled()
  })

  it('closes modal when backdrop clicked', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    // Open modal
    await user.click(screen.getByRole('button', { name: /log out/i }))

    // Click backdrop
    const backdrop = screen.getByTestId('modal-backdrop')
    await user.click(backdrop)

    // Modal closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // Did not sign out
    expect(mockSignOut).not.toHaveBeenCalled()
  })

  it('closes modal when Escape key pressed', async () => {
    const user = userEvent.setup()
    renderSettingsScreen()

    // Open modal
    await user.click(screen.getByRole('button', { name: /log out/i }))

    // Press Escape
    await user.keyboard('{Escape}')

    // Modal closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // Did not sign out
    expect(mockSignOut).not.toHaveBeenCalled()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import ConfirmScreen from '../ConfirmScreen'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { from: '/booking/availability' } }),
  }
})

// Mock state hooks
const mockAddAppointment = vi.fn()
const mockResetBooking = vi.fn()
const mockSelectFamilyMember = vi.fn()
const mockAddHistoryItem = vi.fn()

vi.mock('../../../state', () => ({
  useBooking: () => ({
    selectedDoctor: {
      id: 'd1',
      name: 'Dr. Test',
      specialty: 'General Medicine',
      city: 'Berlin',
      address: 'Test Street 1',
      imageUrl: '',
    },
    selectedSlot: { dateISO: '2025-02-01', time: '10:00' },
    selectedFamilyMemberId: null,
    selectFamilyMember: mockSelectFamilyMember,
    addAppointment: mockAddAppointment,
    resetBooking: mockResetBooking,
  }),
  useProfile: () => ({
    profile: {
      id: 'user1',
      fullName: 'Test User',
      email: 'test@example.com',
      insuranceType: 'GKV',
      familyMembers: [],
    },
    upsertMyDoctor: vi.fn(),
  }),
  useHistory: () => ({
    addHistoryItem: mockAddHistoryItem,
  }),
  usePreferences: () => ({
    language: 'en',
  }),
}))

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      booking: {
        confirmAppointment: 'Confirm Appointment',
        confirmAppointmentBtn: 'Confirm',
        offline: 'Offline',
        whoIsAppointmentFor: 'Who is this for?',
        costCoverage: 'Cost Coverage',
        reasonForVisit: 'Reason for visit',
        reasonPlaceholder: 'Describe your symptoms',
      },
    },
  },
})

function renderConfirmScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ConfirmScreen />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('ConfirmScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset navigator.onLine to true
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true)
  })

  it('renders confirm button', () => {
    renderConfirmScreen()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('disables confirm button and shows loading when clicked', async () => {
    const user = userEvent.setup()
    renderConfirmScreen()

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    expect(confirmButton).toBeDisabled()

    await user.type(screen.getByRole('textbox'), 'Headache and dizziness')
    expect(confirmButton).not.toBeDisabled()

    await user.click(confirmButton)

    // Button should be disabled after click (loading state)
    expect(confirmButton).toBeDisabled()
  })

  it('prevents double-click on confirm button', async () => {
    const user = userEvent.setup()
    renderConfirmScreen()

    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.type(screen.getByRole('textbox'), 'Headache and dizziness')

    // Click twice rapidly
    await user.click(confirmButton)
    await user.click(confirmButton)

    // Should only call addAppointment once
    expect(mockAddAppointment).toHaveBeenCalledTimes(1)
  })

  it('calls addAppointment and navigates on confirm', async () => {
    const user = userEvent.setup()
    renderConfirmScreen()

    await user.type(screen.getByRole('textbox'), 'Headache and dizziness')
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    expect(mockAddAppointment).toHaveBeenCalledTimes(1)
    expect(mockAddHistoryItem).toHaveBeenCalledTimes(1)
    expect(mockResetBooking).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/booking/request-sent', expect.anything())
  })

  it('navigates back to last route when close is clicked', async () => {
    const user = userEvent.setup()
    renderConfirmScreen()

    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/booking/availability')
  })

  it('disables confirm button when offline', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    renderConfirmScreen()

    const confirmButton = screen.getByRole('button', { name: /offline/i })
    expect(confirmButton).toBeDisabled()
  })

  it('does not submit when offline', async () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    const user = userEvent.setup()
    renderConfirmScreen()

    const confirmButton = screen.getByRole('button', { name: /offline/i })
    await user.click(confirmButton)

    expect(mockAddAppointment).not.toHaveBeenCalled()
  })
})

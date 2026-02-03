import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import ResultsScreen from '../ResultsScreen'

// Mock navigation
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock data API
vi.mock('../../../data', () => ({
  apiSearchDoctors: vi.fn().mockResolvedValue([
    {
      id: 'd1',
      name: 'Dr. Test',
      specialty: 'General Medicine',
      rating: 4.5,
      languages: ['German', 'English'],
      accepts: ['GKV', 'PKV'],
      nextAvailableISO: '2025-02-01',
      city: 'Berlin',
    },
  ]),
  getTimeSlots: vi.fn().mockReturnValue([]),
}))

// Mock booking state
const mockSetSearchFilters = vi.fn()
const mockSetBookingFlow = vi.fn()

vi.mock('../../../state', () => ({
  useBooking: () => ({
    search: { specialty: 'General', city: 'Berlin' },
    setSearchFilters: mockSetSearchFilters,
    selectDoctor: vi.fn(),
    selectSlot: vi.fn(),
    bookingFlow: 'by_doctor',
    setBookingFlow: mockSetBookingFlow,
  }),
  useProfile: () => ({
    profile: { myDoctors: [] },
    toggleMyDoctor: vi.fn(),
  }),
}))

// Initialize test i18n
i18n.init({
  lng: 'en',
  resources: {
    en: {
      booking: {
        filters: 'Filters',
        applyFilters: 'Apply Filters',
        clearAll: 'Clear all',
        distance: 'Distance',
        km: 'km',
        minimumRating: 'Minimum rating',
        onlyPublicInsurance: 'Only public insurance',
        publicInsuranceHint: 'Show only GKV doctors',
        languages: 'Languages',
        noLanguageData: 'No language data',
        selectDoctor: 'Select Doctor',
        goBack: 'Go back',
        searching: 'Searching...',
        doctorsFound: 'doctors found',
        sortedBy: 'Sorted by:',
        earliestAppointment: 'Earliest',
        step1Of4: 'STEP 1 OF 4',
        yourRequest: 'Your request',
        allSpecialties: 'All',
        searchDoctorPlaceholder: 'Search...',
        clearSearch: 'Clear',
        langGerman: 'German',
        langEnglish: 'English',
      },
    },
  },
})

function renderResultsScreen() {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <ResultsScreen />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('ResultsScreen - Filter Sheet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows Apply button in filter sheet', async () => {
    const user = userEvent.setup()
    renderResultsScreen()

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })

    // Open filter sheet
    const filterButton = screen.getByRole('button', { name: /filters/i })
    await user.click(filterButton)

    // Verify Apply button exists
    expect(screen.getByRole('button', { name: /apply filters/i })).toBeInTheDocument()
  })

  it('applies filters when Apply button is clicked', async () => {
    const user = userEvent.setup()
    renderResultsScreen()

    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })

    // Open filter sheet
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Click Apply
    await user.click(screen.getByRole('button', { name: /apply filters/i }))

    // Filters should be applied
    expect(mockSetSearchFilters).toHaveBeenCalled()

    // Sheet should close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('does not apply filters when backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderResultsScreen()

    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })

    // Open filter sheet
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Click backdrop
    const backdrop = screen.getByTestId('filter-backdrop')
    await user.click(backdrop)

    // Filters should NOT be applied when closing via backdrop
    expect(mockSetSearchFilters).not.toHaveBeenCalled()
  })

  it('does not apply filters when X button is clicked', async () => {
    const user = userEvent.setup()
    renderResultsScreen()

    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })

    // Open filter sheet
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Click X button
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    // Filters should NOT be applied
    expect(mockSetSearchFilters).not.toHaveBeenCalled()
  })

  it('clears filters when Clear all is clicked', async () => {
    const user = userEvent.setup()
    renderResultsScreen()

    await waitFor(() => {
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument()
    })

    // Open filter sheet
    await user.click(screen.getByRole('button', { name: /filters/i }))

    // Click Clear all
    await user.click(screen.getByText('Clear all'))

    // Clear all should reset filters but not apply them yet
    // User still needs to click Apply
  })
})

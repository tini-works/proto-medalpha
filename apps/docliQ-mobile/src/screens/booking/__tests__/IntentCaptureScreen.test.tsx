import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from '../../../state'
import IntentCaptureScreen from '../IntentCaptureScreen'
import { PATHS } from '../../../routes'

// Wrapper component for testing
const renderIntentCapture = () => {
  return render(
    <MemoryRouter initialEntries={[PATHS.BOOKING_INTENT]}>
      <AppStateProvider>
        <Routes>
          <Route path={PATHS.BOOKING_INTENT} element={<IntentCaptureScreen />} />
          <Route path={PATHS.FAST_LANE} element={<div data-testid="fast-lane">Fast Lane</div>} />
          <Route path={PATHS.BOOKING_SPECIALTY} element={<div data-testid="specialty-flow">Specialty Flow</div>} />
          <Route path={PATHS.BOOKING_RESULTS} element={<div data-testid="results">Results</div>} />
          <Route path={PATHS.BOOKING_AVAILABILITY} element={<div data-testid="availability">Availability</div>} />
          <Route path={PATHS.BOOKING_CONFIRM} element={<div data-testid="confirm">Confirm</div>} />
        </Routes>
      </AppStateProvider>
    </MemoryRouter>
  )
}

describe('IntentCaptureScreen', () => {
  it('renders patient selection with myself and family options', () => {
    renderIntentCapture()
    
    expect(screen.getByText('whoIsAppointmentFor')).toBeInTheDocument()
    expect(screen.getByText('myself')).toBeInTheDocument()
    expect(screen.getByText('familyMember')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText('intentSearchPlaceholder')
    expect(searchInput).toBeInTheDocument()
  })

  it('shows quick options including Fast-Lane and Book by Specialty', () => {
    renderIntentCapture()
    
    expect(screen.getByText('quickOptions')).toBeInTheDocument()
    expect(screen.getByText('fastLane')).toBeInTheDocument()
    expect(screen.getByText('bookBySpecialty')).toBeInTheDocument()
  })

  it('routes to Fast-Lane when Fast-Lane quick option is clicked', async () => {
    renderIntentCapture()
    
    const fastLaneButton = screen.getByText('fastLane').closest('button')
    fireEvent.click(fastLaneButton!)
    
    await waitFor(() => {
      expect(screen.getByTestId('confirm')).toBeInTheDocument()
    })
  })

  it('shows manual options when intent is unclear', async () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText('intentSearchPlaceholder')
    fireEvent.change(searchInput, { target: { value: 'xyz' } })
    
    const continueButton = screen.getByText('continueBtn')
    fireEvent.click(continueButton)
    
    await waitFor(() => {
      expect(screen.getByText('unclearIntentHelp')).toBeInTheDocument()
      expect(screen.getByText('howWouldYouLikeToBook')).toBeInTheDocument()
    })
  })

  it('routes to doctor flow when doctor name is entered', async () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText('intentSearchPlaceholder')
    fireEvent.change(searchInput, { target: { value: 'Anna' } })
    
    const continueButton = screen.getByText('continueBtn')
    fireEvent.click(continueButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('availability')).toBeInTheDocument()
    })
  })

  it('does not show "See my doctor again" when user has no favorites', () => {
    renderIntentCapture()
    
    expect(screen.queryByText('seeMyDoctorAgain')).not.toBeInTheDocument()
  })

  it('shows doctor suggestions for short queries', async () => {
    renderIntentCapture()

    const searchInput = screen.getByPlaceholderText('intentSearchPlaceholder')
    fireEvent.change(searchInput, { target: { value: 'sm' } })

    await waitFor(() => {
      expect(screen.getByText('Dr. Michael Schmidt')).toBeInTheDocument()
    })
  })

  it('shows "View all doctors" in suggestions and routes to results', async () => {
    renderIntentCapture()

    const searchInput = screen.getByPlaceholderText('intentSearchPlaceholder')
    fireEvent.change(searchInput, { target: { value: 'sm' } })

    const viewAll = await screen.findByText('viewAllDoctors')
    fireEvent.click(viewAll)

    await waitFor(() => {
      expect(screen.getByTestId('results')).toBeInTheDocument()
    })
  })
})

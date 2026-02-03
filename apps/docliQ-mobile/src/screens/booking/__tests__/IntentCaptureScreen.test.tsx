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
          <Route path={PATHS.BOOKING_SLOTS} element={<div data-testid="slots">Slots</div>} />
        </Routes>
      </AppStateProvider>
    </MemoryRouter>
  )
}

describe('IntentCaptureScreen', () => {
  it('renders patient selection with myself and family options', () => {
    renderIntentCapture()
    
    expect(screen.getByText('Who is this appointment for?')).toBeInTheDocument()
    expect(screen.getByText('Myself')).toBeInTheDocument()
    expect(screen.getByText('Family Member')).toBeInTheDocument()
  })

  it('renders search input with placeholder', () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText(/e.g.*Dr.*Müller.*cardiology/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('shows quick options including Fast-Lane and Book by Specialty', () => {
    renderIntentCapture()
    
    expect(screen.getByText('Quick options')).toBeInTheDocument()
    expect(screen.getByText('Fast-Lane')).toBeInTheDocument()
    expect(screen.getByText('Book by Specialty')).toBeInTheDocument()
  })

  it('routes to Fast-Lane when Fast-Lane quick option is clicked', async () => {
    renderIntentCapture()
    
    const fastLaneButton = screen.getByText('Fast-Lane').closest('button')
    fireEvent.click(fastLaneButton!)
    
    await waitFor(() => {
      expect(screen.getByTestId('fast-lane')).toBeInTheDocument()
    })
  })

  it('shows manual options when intent is unclear', async () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText(/e.g.*Dr.*Müller.*cardiology/i)
    fireEvent.change(searchInput, { target: { value: 'xyz' } })
    
    const analyzeButton = screen.getByText('Analyze My Request')
    fireEvent.click(analyzeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/not sure what you're looking for/i)).toBeInTheDocument()
      expect(screen.getByText('How would you like to book?')).toBeInTheDocument()
    })
  })

  it('routes to doctor flow when doctor name is entered', async () => {
    renderIntentCapture()
    
    const searchInput = screen.getByPlaceholderText(/e.g.*Dr.*Müller.*cardiology/i)
    fireEvent.change(searchInput, { target: { value: 'Dr. Anna' } })
    
    const analyzeButton = screen.getByText('Analyze My Request')
    fireEvent.click(analyzeButton)
    
    // Should show suggestion or route to doctor
    await waitFor(() => {
      expect(screen.getByText(/Looking for a specific doctor/i)).toBeInTheDocument()
    })
  })

  it('shows "See my doctor again" quick option text', () => {
    renderIntentCapture()
    
    // Quick option should be visible even without doctors (just tests UI presence)
    expect(screen.getByText('See my doctor again')).toBeInTheDocument()
  })
})

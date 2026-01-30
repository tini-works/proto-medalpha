import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SuccessScreen from '../SuccessScreen'

// Mock i18next to return keys for verification
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('SuccessScreen', () => {
  it('uses i18n key for empty state message', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking/success', state: {} }]}>
        <SuccessScreen />
      </MemoryRouter>
    )

    // Should use translation key, not hardcoded English
    expect(screen.getByText('noAppointmentDataFound')).toBeInTheDocument()
  })

  it('does not show hardcoded English text', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking/success', state: {} }]}>
        <SuccessScreen />
      </MemoryRouter>
    )

    expect(screen.queryByText('No appointment data found.')).not.toBeInTheDocument()
  })

  it('uses i18n key for appointment confirmed title', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking/success', state: {} }]}>
        <SuccessScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('appointmentConfirmed')).toBeInTheDocument()
  })

  it('uses i18n key for view appointments button', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking/success', state: {} }]}>
        <SuccessScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('viewAppointments')).toBeInTheDocument()
  })

  it('uses i18n key for back to home button', () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/booking/success', state: {} }]}>
        <SuccessScreen />
      </MemoryRouter>
    )

    expect(screen.getByText('backToHome')).toBeInTheDocument()
  })
})

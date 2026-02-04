/**
 * Epic 1.2: Appointment Booking Contract Tests
 *
 * Business requirements from User Stories (US 1.2.1 - US 1.2.10)
 * These contracts document expected behavior and test real components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { PATHS, appointmentDetailPath, doctorPath } from '../../routes/paths'
import { AppointmentCard } from '../../components/cards/AppointmentCard'
import type { Appointment } from '../../types'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'booking', 'appointments'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {},
      booking: {
        bookAppointment: 'Book Appointment',
        howWouldYouLikeToBook: 'How would you like to book?',
        fastLane: 'Fast Lane',
        fastLaneDesc: 'Get matched with available doctors',
        bookBySpecialty: 'By Specialty',
        bookBySpecialtyDesc: 'Choose specialty first',
        bookByDoctor: 'By Doctor',
        bookByDoctorDesc: 'Search for a specific doctor',
        quickest: 'Quickest',
        'status.matching': 'Matching',
        'status.awaitConfirm': 'Awaiting Confirmation',
        'status.confirmed': 'Confirmed',
        'status.completed': 'Completed',
        'status.cancelledPatient': 'Cancelled',
        'status.cancelledDoctor': 'Cancelled by Doctor',
        findingDoctor: 'Finding a doctor...',
        patient: 'Patient',
        timeUnit: 'Uhr',
        'verificationRequired.title': 'Verification Required',
        'verificationRequired.message': 'Please verify your identity to book appointments',
        'verificationRequired.verify': 'Verify Now',
        'verificationRequired.cancel': 'Cancel',
      },
      appointments: {
        upcoming: 'Upcoming',
        past: 'Past',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function ContractTestWrapper({
  children,
  initialEntries = ['/'],
}: {
  children: React.ReactNode
  initialEntries?: string[]
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppStateProvider>{children}</AppStateProvider>
      </MemoryRouter>
    </I18nextProvider>
  )
}

// Mock appointment factory
function createTestAppointment(overrides: Partial<Appointment> = {}): Appointment {
  return {
    id: 'apt-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Maria Schmidt',
    specialty: 'General Medicine',
    dateISO: '2030-02-15',
    time: '10:00',
    status: 'confirmed',
    forUserId: 'user-1',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Epic 1.2.1: Book Appointment by Specialty
 */
describe('Epic 1.2: Appointment Booking Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.2.1: Specialty Selection', () => {
    it('Contract: booking-type-screen-shows-options - Three booking options available', async () => {
      const { default: BookingTypeScreen } = await import(
        '../../screens/booking/BookingTypeScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.BOOKING]}>
          <Routes>
            <Route path={PATHS.BOOKING} element={<BookingTypeScreen />} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify all three booking options are displayed
      expect(screen.getByText('Fast Lane')).toBeInTheDocument()
      expect(screen.getByText('By Specialty')).toBeInTheDocument()
      expect(screen.getByText('By Doctor')).toBeInTheDocument()
    })

    it('Contract: specialty-path-defined - Booking paths are correctly configured', () => {
      expect(PATHS.BOOKING).toBe('/booking')
      expect(PATHS.BOOKING_SPECIALTY).toBeDefined()
      expect(PATHS.FAST_LANE).toBeDefined()
      expect(PATHS.BOOKING_RESULTS).toBeDefined()
    })
  })

  describe('US 1.2.3: Appointment Types', () => {
    it('Contract: appointment-type-screen-available - Booking type selection screen exists', async () => {
      const { default: BookingTypeScreen } = await import(
        '../../screens/booking/BookingTypeScreen'
      )

      render(
        <ContractTestWrapper initialEntries={[PATHS.BOOKING]}>
          <Routes>
            <Route path={PATHS.BOOKING} element={<BookingTypeScreen />} />
          </Routes>
        </ContractTestWrapper>
      )

      // Verify the booking type screen renders
      expect(screen.getByText('Book Appointment')).toBeInTheDocument()
      expect(screen.getByText('How would you like to book?')).toBeInTheDocument()
    })
  })

  describe('US 1.2.5: Appointment Status Display', () => {
    it('Contract: status-matching-displayed - Matching status shows loading state', () => {
      const appointment = createTestAppointment({ status: 'matching' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Matching')).toBeInTheDocument()
      expect(screen.getByText('Finding a doctor...')).toBeInTheDocument()
    })

    it('Contract: status-await-confirm-displayed - Awaiting confirmation status shown', () => {
      const appointment = createTestAppointment({ status: 'await_confirm' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Awaiting Confirmation')).toBeInTheDocument()
    })

    it('Contract: status-confirmed-displayed - Confirmed status shows doctor info', () => {
      const appointment = createTestAppointment({
        status: 'confirmed',
        doctorName: 'Dr. Hans Weber',
      })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Confirmed')).toBeInTheDocument()
      expect(screen.getByText('Dr. Hans Weber')).toBeInTheDocument()
    })

    it('Contract: status-cancelled-patient-displayed - Patient cancellation status shown', () => {
      const appointment = createTestAppointment({ status: 'cancelled_patient' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Cancelled')).toBeInTheDocument()
    })

    it('Contract: status-cancelled-doctor-displayed - Doctor cancellation status shown', () => {
      const appointment = createTestAppointment({ status: 'cancelled_doctor' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Cancelled by Doctor')).toBeInTheDocument()
    })

    it('Contract: status-completed-displayed - Completed status shown', () => {
      const appointment = createTestAppointment({ status: 'completed' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Completed')).toBeInTheDocument()
    })
  })

  describe('US 1.2.4: Booking for Dependents', () => {
    it('Contract: family-member-name-displayed - Family member name shown on appointment', () => {
      const appointment = createTestAppointment({
        forUserId: 'family-member-1',
        forUserName: 'Anna Schmidt',
      })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Patient: Anna Schmidt')).toBeInTheDocument()
    })
  })

  describe('US 1.2.8: Appointment List', () => {
    it('Contract: appointment-paths-defined - Appointment detail paths work correctly', () => {
      // Test path helper functions
      expect(appointmentDetailPath('apt-123')).toBe('/appointments/apt-123')
      expect(PATHS.APPOINTMENT_DETAIL).toBe('/appointments/:id')
    })

    it('Contract: appointment-card-clickable - Appointment card triggers onClick', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const appointment = createTestAppointment()

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} onClick={onClick} />
        </ContractTestWrapper>
      )

      await user.click(screen.getByRole('button'))
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe('US 1.2.6: Calendar Export (Path Configuration)', () => {
    it('Contract: appointment-detail-path-exists - Detail screen path configured', () => {
      expect(PATHS.APPOINTMENT_DETAIL).toBeDefined()
      expect(appointmentDetailPath('test-id')).toContain('test-id')
    })
  })

  describe('Doctor Search', () => {
    it('Contract: doctor-path-defined - Doctor detail path works correctly', () => {
      expect(doctorPath('doc-123')).toBe('/booking/doctor/doc-123')
      expect(PATHS.BOOKING_DOCTOR).toBe('/booking/doctor/:doctorId')
    })
  })
})

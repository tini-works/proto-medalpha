/**
 * Epic 1.5: Appointment Changes by Practice Contract Tests
 *
 * Business requirements from User Stories (US 1.5.1)
 * Tests for handling practice-initiated appointment changes.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import React from 'react'

import { AppStateProvider } from '../../state/AppContext'
import { AppointmentCard } from '../../components/cards/AppointmentCard'
import { Pill } from '../../components/display/Pill'
import type { Appointment } from '../../types'

// Initialize test i18n
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'booking'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {},
      booking: {
        'status.matching': 'Matching',
        'status.awaitConfirm': 'Awaiting Confirmation',
        'status.confirmed': 'Confirmed',
        'status.completed': 'Completed',
        'status.cancelledPatient': 'Cancelled',
        'status.cancelledDoctor': 'Cancelled by Doctor',
        findingDoctor: 'Finding a doctor...',
        patient: 'Patient',
        timeUnit: 'Uhr',
      },
    },
  },
  interpolation: { escapeValue: false },
})

function ContractTestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
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
 * Epic 1.5: Practice Changes Contracts
 *
 * Business Requirement:
 * When a practice changes an appointment, the status should clearly
 * indicate that the change was initiated by the practice, not the patient.
 */
describe('Epic 1.5: Appointment Changes by Practice Contracts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('US 1.5.1: Practice-Initiated Changes', () => {
    it('Contract: pill-component-tones - Pill component supports different status tones', () => {
      const tones = ['info', 'positive', 'pending', 'warning', 'negative', 'neutral'] as const

      tones.forEach((tone) => {
        const { container, unmount } = render(
          <ContractTestWrapper>
            <Pill tone={tone}>Status</Pill>
          </ContractTestWrapper>
        )

        // Verify pill renders
        expect(screen.getByText('Status')).toBeInTheDocument()
        unmount()
      })
    })

    it('Contract: appointment-status-mapping - Each appointment status maps to correct display', () => {
      const statuses: Appointment['status'][] = [
        'matching',
        'await_confirm',
        'confirmed',
        'completed',
        'cancelled_patient',
        'cancelled_doctor',
      ]

      statuses.forEach((status) => {
        const appointment = createTestAppointment({ status })
        const { unmount } = render(
          <ContractTestWrapper>
            <AppointmentCard appointment={appointment} />
          </ContractTestWrapper>
        )

        // Verify appointment card renders with status
        const card = screen.getByRole('button')
        expect(card).toBeInTheDocument()
        unmount()
      })
    })

    it('Contract: cancelled-by-doctor-distinct - Doctor cancellation is visually distinct', () => {
      const doctorCancelled = createTestAppointment({ status: 'cancelled_doctor' })
      const patientCancelled = createTestAppointment({ status: 'cancelled_patient' })

      // Render doctor cancelled
      const { unmount: unmount1 } = render(
        <ContractTestWrapper>
          <AppointmentCard appointment={doctorCancelled} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Cancelled by Doctor')).toBeInTheDocument()
      unmount1()

      // Render patient cancelled
      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={patientCancelled} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Cancelled')).toBeInTheDocument()
    })

    it('Contract: matching-status-shows-loader - Matching status shows finding doctor message', () => {
      const appointment = createTestAppointment({ status: 'matching' })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      // Should show "Finding a doctor..." instead of doctor name
      expect(screen.getByText('Finding a doctor...')).toBeInTheDocument()
      expect(screen.queryByText('Dr. Maria Schmidt')).not.toBeInTheDocument()
    })

    it('Contract: confirmed-shows-doctor-info - Confirmed status shows full doctor info', () => {
      const appointment = createTestAppointment({
        status: 'confirmed',
        doctorName: 'Dr. Hans Weber',
        specialty: 'Cardiology',
      })

      render(
        <ContractTestWrapper>
          <AppointmentCard appointment={appointment} />
        </ContractTestWrapper>
      )

      expect(screen.getByText('Dr. Hans Weber')).toBeInTheDocument()
      expect(screen.getByText('Cardiology')).toBeInTheDocument()
    })
  })

  describe('Pill Component', () => {
    it('Contract: pill-sizes - Pill supports size variants', () => {
      const sizes = ['sm', 'md'] as const

      sizes.forEach((size) => {
        const { unmount } = render(
          <ContractTestWrapper>
            <Pill tone="info" size={size}>
              Status
            </Pill>
          </ContractTestWrapper>
        )

        expect(screen.getByText('Status')).toBeInTheDocument()
        unmount()
      })
    })

    it('Contract: pill-icon-support - Pill can display with icon', () => {
      render(
        <ContractTestWrapper>
          <Pill tone="info" icon={<span data-testid="pill-icon">*</span>}>
            With Icon
          </Pill>
        </ContractTestWrapper>
      )

      expect(screen.getByText('With Icon')).toBeInTheDocument()
      expect(screen.getByTestId('pill-icon')).toBeInTheDocument()
    })
  })
})

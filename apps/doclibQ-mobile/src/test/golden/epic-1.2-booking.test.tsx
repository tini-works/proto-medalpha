/**
 * Epic 1.2: Appointment Booking and Management Golden Tests (Compact)
 *
 * Tests for user stories US 1.2.1 - US 1.2.10
 * Source: User Stories from Philipp (January 27, 2026)
 *
 * OMITTED per prototype-golden-tests-compact.md:
 * - favorites-sorted-by-last-booking (timing precision)
 * - favorites-max-5-stored (infrastructure limit)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import {
  renderWithProviders,
  formValidation,
  createMockDoctor,
  createMockAppointment,
  createMockUser,
  createMockFamilyMember,
  canModifyAppointment,
  SPECIALTIES,
  PREVENTION_REASONS,
  AppointmentStatus,
  AppointmentType,
} from './test-utils'

// Mock components

const MockSpecialtyList = ({
  specialties,
  error,
  onRetry,
}: {
  specialties: Array<{ id: string; name: string }>
  error?: boolean
  onRetry?: () => void
}) => (
  <div>
    {error ? (
      <div>
        <p>Error loading specialties</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    ) : (
      <ul data-testid="specialty-list">
        {specialties.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    )}
  </div>
)

const MockFavoriteDoctors = ({
  doctors,
  onAdd,
  onRemove,
}: {
  doctors: Array<ReturnType<typeof createMockDoctor>>
  onAdd?: (id: string) => void
  onRemove?: (id: string) => void
}) => (
  <div data-testid="my-doctors">
    <h3>My Doctors</h3>
    {doctors.length === 0 ? (
      <p>No favorite doctors yet</p>
    ) : (
      <ul>
        {doctors.map((doc) => (
          <li key={doc.id} data-testid={`doctor-${doc.id}`}>
            {doc.name}
            <button onClick={() => onRemove?.(doc.id)} data-testid={`remove-${doc.id}`}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
    <button onClick={() => onAdd?.('new-doc')} data-testid="add-favorite">
      Add to Favorites
    </button>
  </div>
)

const MockAppointmentTypeSelector = ({
  selected,
  onSelect,
  symptomText,
  onSymptomChange,
  preventionReason,
  onPreventionReasonChange,
  previousAppointmentRef,
  onPreviousRefChange,
}: {
  selected: AppointmentType | null
  onSelect: (type: AppointmentType) => void
  symptomText?: string
  onSymptomChange?: (text: string) => void
  preventionReason?: string
  onPreventionReasonChange?: (reason: string) => void
  previousAppointmentRef?: string
  onPreviousRefChange?: (ref: string) => void
}) => (
  <div data-testid="appointment-type-selector">
    <label>
      <input
        type="radio"
        name="type"
        value="acute"
        checked={selected === 'acute'}
        onChange={() => onSelect('acute')}
        data-testid="type-acute"
      />
      Acute Appointment
    </label>
    <label>
      <input
        type="radio"
        name="type"
        value="prevention"
        checked={selected === 'prevention'}
        onChange={() => onSelect('prevention')}
        data-testid="type-prevention"
      />
      Prevention
    </label>
    <label>
      <input
        type="radio"
        name="type"
        value="follow_up"
        checked={selected === 'follow_up'}
        onChange={() => onSelect('follow_up')}
        data-testid="type-followup"
      />
      Follow-Up
    </label>

    {selected === 'acute' && (
      <textarea
        data-testid="symptom-input"
        value={symptomText}
        onChange={(e) => onSymptomChange?.(e.target.value)}
        placeholder="Describe your symptoms (min. 10 characters)"
        aria-invalid={symptomText !== undefined && symptomText.length < 10}
      />
    )}

    {selected === 'prevention' && (
      <select
        data-testid="prevention-dropdown"
        value={preventionReason}
        onChange={(e) => onPreventionReasonChange?.(e.target.value)}
      >
        <option value="">Select reason</option>
        {PREVENTION_REASONS.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
    )}

    {selected === 'follow_up' && (
      <input
        type="text"
        data-testid="previous-ref-input"
        value={previousAppointmentRef}
        onChange={(e) => onPreviousRefChange?.(e.target.value)}
        placeholder="Reference previous appointment (optional)"
      />
    )}
  </div>
)

const MockFamilyMemberSelector = ({
  user,
  familyMembers,
  selectedId,
  onSelect,
}: {
  user: ReturnType<typeof createMockUser>
  familyMembers: Array<ReturnType<typeof createMockFamilyMember>>
  selectedId: string | null
  onSelect: (id: string) => void
}) => (
  <div data-testid="who-is-for">
    <label>Who is this appointment for?</label>
    <select
      data-testid="patient-dropdown"
      value={selectedId ?? user.id}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value={user.id}>{user.fullName} (Me)</option>
      {familyMembers.map((fm) => (
        <option key={fm.id} value={fm.id}>
          {fm.name}
        </option>
      ))}
    </select>
  </div>
)

const MockAppointmentStatus = ({
  appointment,
}: {
  appointment: ReturnType<typeof createMockAppointment>
}) => (
  <div data-testid="appointment-status">
    <span data-testid="status-badge">{appointment.status}</span>
    <span data-testid="last-updated">{appointment.lastUpdated}</span>
    {appointment.status === 'rejected' && appointment.rejectionReason && (
      <p data-testid="rejection-reason">{appointment.rejectionReason}</p>
    )}
  </div>
)

const MockAppointmentList = ({
  appointments,
  activeTab,
  onTabChange,
}: {
  appointments: Array<ReturnType<typeof createMockAppointment>>
  activeTab: 'upcoming' | 'past'
  onTabChange: (tab: 'upcoming' | 'past') => void
}) => {
  const now = new Date()
  const upcoming = appointments
    .filter((a) => new Date(`${a.date}T${a.time}`) > now)
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
  const past = appointments
    .filter((a) => new Date(`${a.date}T${a.time}`) <= now)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())

  const list = activeTab === 'upcoming' ? upcoming : past

  return (
    <div>
      <div data-testid="tabs">
        <button
          data-testid="tab-upcoming"
          aria-selected={activeTab === 'upcoming'}
          onClick={() => onTabChange('upcoming')}
        >
          Upcoming
        </button>
        <button
          data-testid="tab-past"
          aria-selected={activeTab === 'past'}
          onClick={() => onTabChange('past')}
        >
          Past
        </button>
      </div>
      <ul data-testid="appointment-list">
        {list.map((apt) => (
          <li key={apt.id} data-testid={`apt-${apt.id}`} data-date={apt.date}>
            {apt.doctorName} - {apt.date} {apt.time}
          </li>
        ))}
      </ul>
    </div>
  )
}

const MockAppointmentActions = ({
  appointment,
  onModify,
  onCancel,
  onExport,
}: {
  appointment: ReturnType<typeof createMockAppointment>
  onModify?: () => void
  onCancel?: () => void
  onExport?: () => void
}) => {
  const canModify = canModifyAppointment(appointment.date, appointment.time)
  const isConfirmed = appointment.status === 'confirmed'

  return (
    <div data-testid="appointment-actions">
      {isConfirmed && (
        <button data-testid="export-btn" onClick={onExport}>
          Add to Calendar
        </button>
      )}
      <button data-testid="modify-btn" disabled={!canModify} onClick={onModify}>
        Modify
      </button>
      <button data-testid="cancel-btn" disabled={!canModify} onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

describe('Epic 1.2: Appointment Booking (Compact)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // US 1.2.1: Book Appointment by Specialty
  describe('US 1.2.1: Specialty Selection', () => {
    it('1.2.1-a: specialty-list-renders - Specialties list displays', () => {
      render(<MockSpecialtyList specialties={SPECIALTIES} />)

      const list = screen.getByTestId('specialty-list')
      expect(list).toBeInTheDocument()
      expect(screen.getByText('General Practitioner')).toBeInTheDocument()
      expect(screen.getByText('Cardiologist')).toBeInTheDocument()
    })

    it('1.2.1-b: api-error-shows-retry - On API error, shows "Retry" button', async () => {
      const mockRetry = vi.fn()
      const { user } = renderWithProviders(
        <MockSpecialtyList specialties={[]} error onRetry={mockRetry} />
      )

      expect(screen.getByText(/error loading/i)).toBeInTheDocument()
      const retryButton = screen.getByRole('button', { name: /retry/i })
      await user.click(retryButton)
      expect(mockRetry).toHaveBeenCalled()
    })
  })

  // US 1.2.2: Save Favorite Doctors
  describe('US 1.2.2: Favorite Doctors', () => {
    it('1.2.2-a: favorite-doctors-shown-in-booking - "My Doctors" section visible', () => {
      const doctors = [createMockDoctor({ id: 'd1', name: 'Dr. Schmidt' })]
      render(<MockFavoriteDoctors doctors={doctors} />)

      expect(screen.getByTestId('my-doctors')).toBeInTheDocument()
      expect(screen.getByText('My Doctors')).toBeInTheDocument()
    })

    it('1.2.2-b: add-remove-favorite-doctor - Add/remove works', async () => {
      const mockAdd = vi.fn()
      const mockRemove = vi.fn()
      const doctors = [createMockDoctor({ id: 'd1', name: 'Dr. Schmidt' })]

      const { user } = renderWithProviders(
        <MockFavoriteDoctors doctors={doctors} onAdd={mockAdd} onRemove={mockRemove} />
      )

      await user.click(screen.getByTestId('remove-d1'))
      expect(mockRemove).toHaveBeenCalledWith('d1')

      await user.click(screen.getByTestId('add-favorite'))
      expect(mockAdd).toHaveBeenCalledWith('new-doc')
    })
  })

  // US 1.2.3: Select Appointment Type
  describe('US 1.2.3: Appointment Types', () => {
    it('1.2.3-a: three-appointment-types - Acute, Prevention, Follow-Up selectable', () => {
      render(<MockAppointmentTypeSelector selected={null} onSelect={() => {}} />)

      expect(screen.getByTestId('type-acute')).toBeInTheDocument()
      expect(screen.getByTestId('type-prevention')).toBeInTheDocument()
      expect(screen.getByTestId('type-followup')).toBeInTheDocument()
    })

    it('1.2.3-b: acute-requires-symptom-10-chars - Acute validates min 10 char symptom', () => {
      expect(formValidation.isValidSymptomDescription('I have a headache and fever')).toBe(true)
      expect(formValidation.isValidSymptomDescription('Headache')).toBe(false)
    })

    it('1.2.3-c: prevention-shows-dropdown - Prevention has reason dropdown', () => {
      render(
        <MockAppointmentTypeSelector
          selected="prevention"
          onSelect={() => {}}
          preventionReason=""
          onPreventionReasonChange={() => {}}
        />
      )

      expect(screen.getByTestId('prevention-dropdown')).toBeInTheDocument()
      expect(screen.getByText('Check-Up')).toBeInTheDocument()
    })

    it('1.2.3-d: followup-optional-reference - Follow-Up has optional ref', () => {
      render(
        <MockAppointmentTypeSelector
          selected="follow_up"
          onSelect={() => {}}
          previousAppointmentRef=""
          onPreviousRefChange={() => {}}
        />
      )

      const refInput = screen.getByTestId('previous-ref-input')
      expect(refInput).toHaveAttribute('placeholder', expect.stringContaining('optional'))
    })
  })

  // US 1.2.4: Book Appointments for Dependents
  describe('US 1.2.4: Booking for Dependents', () => {
    it('1.2.4-a: add-up-to-5-dependents - Can add max 5 family members', () => {
      const addMember = (members: string[], id: string, max = 5) => {
        if (members.length >= max) return members
        return [...members, id]
      }

      let members: string[] = []
      for (let i = 1; i <= 6; i++) {
        members = addMember(members, `fm${i}`)
      }
      expect(members).toHaveLength(5)
    })

    it('1.2.4-b: dependent-fields-stored - Name, DOB, insurance saved', () => {
      const member = createMockFamilyMember({
        name: 'Anna User',
        dob: '2018-05-15',
        insuranceType: 'GKV',
      })

      expect(member.name).toBe('Anna User')
      expect(member.dob).toBe('2018-05-15')
      expect(member.insuranceType).toBe('GKV')
    })

    it('1.2.4-c: booking-who-for-dropdown - "Who is this for?" dropdown present', () => {
      const user = createMockUser()
      const familyMembers = [createMockFamilyMember({ id: 'fm1', name: 'Child 1' })]

      render(
        <MockFamilyMemberSelector
          user={user}
          familyMembers={familyMembers}
          selectedId={null}
          onSelect={() => {}}
        />
      )

      expect(screen.getByText(/who is this appointment for/i)).toBeInTheDocument()
      expect(screen.getByTestId('patient-dropdown')).toBeInTheDocument()
    })
  })

  // US 1.2.5: Real-Time Appointment Status
  describe('US 1.2.5: Appointment Status', () => {
    it('1.2.5-a: status-in-progress-confirmed-rejected - Three statuses displayed', () => {
      const statuses: AppointmentStatus[] = ['in_progress', 'confirmed', 'rejected']

      statuses.forEach((status) => {
        const appointment = createMockAppointment({ status })
        const { unmount } = render(<MockAppointmentStatus appointment={appointment} />)
        expect(screen.getByTestId('status-badge')).toHaveTextContent(status)
        unmount()
      })
    })

    it('1.2.5-b: status-shows-timestamp - Last update timestamp visible', () => {
      const appointment = createMockAppointment({ lastUpdated: '2025-01-20T14:30:00Z' })
      render(<MockAppointmentStatus appointment={appointment} />)
      expect(screen.getByTestId('last-updated')).toHaveTextContent('2025-01-20T14:30:00Z')
    })

    it('1.2.5-c: rejected-shows-reason - Rejection reason displayed', () => {
      const appointment = createMockAppointment({
        status: 'rejected',
        rejectionReason: 'Doctor not available',
      })
      render(<MockAppointmentStatus appointment={appointment} />)
      expect(screen.getByTestId('rejection-reason')).toHaveTextContent('Doctor not available')
    })
  })

  // US 1.2.6: Export Appointment to Calendar
  describe('US 1.2.6: Calendar Export', () => {
    it('1.2.6-a: export-only-when-confirmed - Export button hidden unless confirmed', () => {
      const confirmed = createMockAppointment({ status: 'confirmed' })
      const { unmount } = render(<MockAppointmentActions appointment={confirmed} />)
      expect(screen.getByTestId('export-btn')).toBeInTheDocument()
      unmount()

      const inProgress = createMockAppointment({ status: 'in_progress' })
      render(<MockAppointmentActions appointment={inProgress} />)
      expect(screen.queryByTestId('export-btn')).not.toBeInTheDocument()
    })
  })

  // US 1.2.8: Appointment List Overview
  describe('US 1.2.8: Appointment List', () => {
    it('1.2.8-a: appointment-tabs-upcoming-past - Two tabs present', () => {
      render(<MockAppointmentList appointments={[]} activeTab="upcoming" onTabChange={() => {}} />)

      expect(screen.getByTestId('tab-upcoming')).toBeInTheDocument()
      expect(screen.getByTestId('tab-past')).toBeInTheDocument()
    })

    it('1.2.8-b: upcoming-sorted-ascending - Upcoming sorted by date ASC', () => {
      const d1 = '2030-02-01', d2 = '2030-02-15', d3 = '2030-02-10'
      const appointments = [
        createMockAppointment({ id: 'a1', date: d2 }),
        createMockAppointment({ id: 'a2', date: d1 }),
        createMockAppointment({ id: 'a3', date: d3 }),
      ]

      render(<MockAppointmentList appointments={appointments} activeTab="upcoming" onTabChange={() => {}} />)

      const list = screen.getByTestId('appointment-list')
      const items = within(list).getAllByRole('listitem')
      expect(items[0]).toHaveAttribute('data-date', d1)
      expect(items[1]).toHaveAttribute('data-date', d3)
      expect(items[2]).toHaveAttribute('data-date', d2)
    })

    it('1.2.8-c: past-sorted-descending - Past sorted by date DESC', () => {
      const d1 = '2020-01-01', d2 = '2020-01-15', d3 = '2020-01-10'
      const appointments = [
        createMockAppointment({ id: 'a1', date: d1 }),
        createMockAppointment({ id: 'a2', date: d2 }),
        createMockAppointment({ id: 'a3', date: d3 }),
      ]

      render(<MockAppointmentList appointments={appointments} activeTab="past" onTabChange={() => {}} />)

      const list = screen.getByTestId('appointment-list')
      const items = within(list).getAllByRole('listitem')
      expect(items[0]).toHaveAttribute('data-date', d2)
      expect(items[1]).toHaveAttribute('data-date', d3)
      expect(items[2]).toHaveAttribute('data-date', d1)
    })
  })

  // US 1.2.9: Modify Confirmed Appointment
  describe('US 1.2.9: Modify Appointment', () => {
    it('1.2.9-a: modify-disabled-under-24h - Modify blocked <24h before', () => {
      const now = new Date()
      const twoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      const soon = createMockAppointment({
        date: twoHours.toISOString().split('T')[0],
        time: twoHours.toTimeString().slice(0, 5),
      })

      const { unmount } = render(<MockAppointmentActions appointment={soon} />)
      expect(screen.getByTestId('modify-btn')).toBeDisabled()
      unmount()

      const twoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      const later = createMockAppointment({
        date: twoDays.toISOString().split('T')[0],
        time: twoDays.toTimeString().slice(0, 5),
      })

      render(<MockAppointmentActions appointment={later} />)
      expect(screen.getByTestId('modify-btn')).not.toBeDisabled()
    })
  })

  // US 1.2.10: Cancel Appointment
  describe('US 1.2.10: Cancel Appointment', () => {
    it('1.2.10-a: cancel-disabled-under-24h - Cancel blocked <24h before', () => {
      const now = new Date()
      const twoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000)
      const soon = createMockAppointment({
        date: twoHours.toISOString().split('T')[0],
        time: twoHours.toTimeString().slice(0, 5),
      })

      const { unmount } = render(<MockAppointmentActions appointment={soon} />)
      expect(screen.getByTestId('cancel-btn')).toBeDisabled()
      unmount()

      const twoDays = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      const later = createMockAppointment({
        date: twoDays.toISOString().split('T')[0],
        time: twoDays.toTimeString().slice(0, 5),
      })

      render(<MockAppointmentActions appointment={later} />)
      expect(screen.getByTestId('cancel-btn')).not.toBeDisabled()
    })
  })
})

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AppointmentCard } from '@docliQ/components/cards/AppointmentCard'
import { DocliQDecorator } from '../decorators/DocliQDecorator'
import type { Appointment } from '@docliQ/types'

// Mock appointment factory
function createAppointment(
  overrides: Partial<Appointment> = {}
): Appointment {
  return {
    id: '1',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Mueller',
    specialty: 'General Medicine',
    dateISO: '2025-02-15',
    time: '10:30',
    forUserId: 'user-1',
    forUserName: '',
    status: 'confirmed',
    reminderSet: true,
    calendarSynced: false,
    ...overrides,
  }
}

const meta = {
  title: 'Patterns/Cards/AppointmentCard',
  component: AppointmentCard,
  decorators: [DocliQDecorator],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Appointment display card with status-aware styling.

**Variants:**
- \`default\`: Full card with avatar and time details
- \`upcoming\`: Compact card for lists

**Status-aware features:**
- Different Pill tones based on appointment status
- Loading spinner for "matching" status
- Hides doctor info during matching phase
- Shows patient name for family bookings
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'upcoming'],
    },
  },
} satisfies Meta<typeof AppointmentCard>

export default meta
type Story = StoryObj<typeof meta>

export const Confirmed: Story = {
  args: {
    appointment: createAppointment({ status: 'confirmed' }),
    variant: 'default',
  },
}

export const Pending: Story = {
  args: {
    appointment: createAppointment({ status: 'await_confirm' }),
    variant: 'default',
  },
}

export const Matching: Story = {
  args: {
    appointment: createAppointment({
      status: 'matching',
      doctorName: '',
      doctorId: '',
    }),
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading spinner while the system finds a matching doctor.',
      },
    },
  },
}

export const Modified: Story = {
  args: {
    appointment: createAppointment({ status: 'modified_by_practice' }),
    variant: 'default',
  },
}

export const Completed: Story = {
  args: {
    appointment: createAppointment({ status: 'completed' }),
    variant: 'default',
  },
}

export const CancelledByPatient: Story = {
  args: {
    appointment: createAppointment({ status: 'cancelled_patient' }),
    variant: 'default',
  },
}

export const CancelledByDoctor: Story = {
  args: {
    appointment: createAppointment({ status: 'cancelled_doctor' }),
    variant: 'default',
  },
}

// Variant: Upcoming (compact)
export const UpcomingVariant: Story = {
  args: {
    appointment: createAppointment({ status: 'confirmed' }),
    variant: 'upcoming',
  },
}

// With family member
export const ForFamilyMember: Story = {
  args: {
    appointment: createAppointment({
      status: 'confirmed',
      forUserName: 'Emma Mueller (Child)',
    }),
    variant: 'default',
  },
}

// Different specialties
export const Cardiology: Story = {
  args: {
    appointment: createAppointment({
      specialty: 'Cardiology',
      doctorName: 'Dr. Hans Weber',
    }),
    variant: 'default',
  },
}

export const Dermatology: Story = {
  args: {
    appointment: createAppointment({
      specialty: 'Dermatology',
      doctorName: 'Dr. Lisa Schmidt',
    }),
    variant: 'default',
  },
}

// All statuses overview
export const AllStatuses: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <AppointmentCard
        appointment={createAppointment({ status: 'matching', doctorName: '', doctorId: '' })}
      />
      <AppointmentCard
        appointment={createAppointment({ status: 'await_confirm' })}
      />
      <AppointmentCard
        appointment={createAppointment({ status: 'confirmed' })}
      />
      <AppointmentCard
        appointment={createAppointment({ status: 'modified_by_practice' })}
      />
      <AppointmentCard
        appointment={createAppointment({ status: 'completed' })}
      />
      <AppointmentCard
        appointment={createAppointment({ status: 'cancelled_patient' })}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Overview of all appointment status states.',
      },
    },
  },
}

// Upcoming variant list
export const UpcomingList: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <AppointmentCard
        appointment={createAppointment({
          status: 'confirmed',
          specialty: 'General Medicine',
        })}
        variant="upcoming"
      />
      <AppointmentCard
        appointment={createAppointment({
          status: 'await_confirm',
          specialty: 'Cardiology',
          doctorName: 'Dr. Hans Weber',
        })}
        variant="upcoming"
      />
      <AppointmentCard
        appointment={createAppointment({
          status: 'matching',
          specialty: 'Dermatology',
          doctorName: '',
        })}
        variant="upcoming"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact upcoming variant for appointment lists.',
      },
    },
  },
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pill } from '@docliQ/components/display/Pill'

const meta = {
  title: 'Patterns/Display/Pill',
  component: Pill,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Status badge component with semantic color tones.

**Usage Guidelines:**
- \`positive\`: ONLY for deltas, improvements, compliance-safe positive signals
- \`negative\`: For errors, cancellations, negative deltas
- \`pending\`: For pending appointment states (amber)
- \`warning\`: For attention needed
- \`info\`: For informational badges (insurance type, etc.)
- \`neutral\`: Default for most status badges
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: 'select',
      options: ['info', 'positive', 'pending', 'warning', 'negative', 'neutral'],
      description: 'Semantic color tone',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant',
    },
  },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Status',
    tone: 'neutral',
    size: 'sm',
  },
}

export const Info: Story = {
  args: {
    children: 'Matching',
    tone: 'info',
  },
}

export const Positive: Story = {
  args: {
    children: 'Confirmed',
    tone: 'positive',
  },
}

export const Pending: Story = {
  args: {
    children: 'Pending',
    tone: 'pending',
  },
}

export const Warning: Story = {
  args: {
    children: 'Modified',
    tone: 'warning',
  },
}

export const Negative: Story = {
  args: {
    children: 'Cancelled',
    tone: 'negative',
  },
}

export const Neutral: Story = {
  args: {
    children: 'Completed',
    tone: 'neutral',
  },
}

export const MediumSize: Story = {
  args: {
    children: 'Large Pill',
    tone: 'info',
    size: 'md',
  },
}

// Showcase all tones together
export const AllTones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Pill tone="info">Info</Pill>
      <Pill tone="positive">Positive</Pill>
      <Pill tone="pending">Pending</Pill>
      <Pill tone="warning">Warning</Pill>
      <Pill tone="negative">Negative</Pill>
      <Pill tone="neutral">Neutral</Pill>
    </div>
  ),
}

// Appointment status example
export const AppointmentStatuses: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Pill tone="info">Matching</Pill>
        <span className="text-sm text-slate-500">Finding a doctor...</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone="pending">Pending</Pill>
        <span className="text-sm text-slate-500">Awaiting confirmation</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone="positive">Confirmed</Pill>
        <span className="text-sm text-slate-500">Appointment confirmed</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone="warning">Modified</Pill>
        <span className="text-sm text-slate-500">Changed by practice</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone="neutral">Completed</Pill>
        <span className="text-sm text-slate-500">Visit completed</span>
      </div>
      <div className="flex items-center gap-3">
        <Pill tone="negative">Cancelled</Pill>
        <span className="text-sm text-slate-500">Appointment cancelled</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common appointment status badges used throughout the DocliQ app.',
      },
    },
  },
}

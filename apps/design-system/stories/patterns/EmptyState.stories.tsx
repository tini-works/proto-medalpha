import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from '@docliQ/components/display/EmptyState'
import { Button } from '@meda/ui'

const meta = {
  title: 'Patterns/Feedback/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Empty state component for displaying when lists or search results have no content.

**Icon presets:**
- \`search\`: No search results
- \`calendar\`: No appointments
- \`history\`: No history items
- \`user\`: No user/profile data
- (default): Generic inbox/empty icon
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['search', 'calendar', 'history', 'user', undefined],
    },
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'No items found',
    description: 'There are no items to display at this time.',
  },
}

export const NoSearchResults: Story = {
  args: {
    icon: 'search',
    title: 'No results found',
    description: 'Try adjusting your search or filters to find what you\'re looking for.',
    action: <Button variant="secondary" size="sm">Clear filters</Button>,
  },
}

export const NoAppointments: Story = {
  args: {
    icon: 'calendar',
    title: 'No upcoming appointments',
    description: 'You don\'t have any scheduled appointments yet.',
    action: <Button variant="primary" size="sm">Book appointment</Button>,
  },
}

export const NoHistory: Story = {
  args: {
    icon: 'history',
    title: 'No appointment history',
    description: 'Your past appointments will appear here.',
  },
}

export const NoUser: Story = {
  args: {
    icon: 'user',
    title: 'No family members',
    description: 'Add family members to book appointments on their behalf.',
    action: <Button variant="secondary" size="sm">Add member</Button>,
  },
}

export const WithCustomAction: Story = {
  args: {
    icon: 'search',
    title: 'No doctors found',
    description: 'We couldn\'t find doctors matching your criteria.',
    action: (
      <div className="flex gap-2">
        <Button variant="tertiary" size="sm">Expand search</Button>
        <Button variant="primary" size="sm">Try again</Button>
      </div>
    ),
  },
}

// All icon variants
export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8">
      <EmptyState icon="search" title="Search" description="No search results" />
      <EmptyState icon="calendar" title="Calendar" description="No appointments" />
      <EmptyState icon="history" title="History" description="No history" />
      <EmptyState icon="user" title="User" description="No user data" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
}

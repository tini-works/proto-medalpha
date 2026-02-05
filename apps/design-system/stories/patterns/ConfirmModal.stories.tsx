import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ConfirmModal } from '@docliQ/components/ui/ConfirmModal'
import { Button } from '@meda/ui'

const meta = {
  title: 'Patterns/Overlays/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Simple confirmation dialog built on top of the Sheet component.

**Variants:**
- \`default\`: Standard confirmation with primary button
- \`destructive\`: Destructive action with red button

**Features:**
- Focus auto-set to confirm button
- Escape key to cancel
- Backdrop click to cancel
- Centered modal variant
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
    },
  },
} satisfies Meta<typeof ConfirmModal>

export default meta
type Story = StoryObj<typeof meta>

function ConfirmModalDemo({
  variant = 'default',
  title,
  message,
  confirmLabel,
  cancelLabel,
}: {
  variant?: 'default' | 'destructive'
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleConfirm = () => {
    setResult('Confirmed!')
    setOpen(false)
    setTimeout(() => setResult(null), 2000)
  }

  const handleCancel = () => {
    setResult('Cancelled')
    setOpen(false)
    setTimeout(() => setResult(null), 2000)
  }

  return (
    <div className="text-center">
      <Button
        onClick={() => setOpen(true)}
        variant={variant === 'destructive' ? 'destructive' : 'primary'}
      >
        Open {variant} modal
      </Button>
      {result && (
        <p className="mt-2 text-sm text-slate-500">{result}</p>
      )}
      <ConfirmModal
        open={open}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={variant}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <ConfirmModalDemo
      title="Confirm Action"
      message="Are you sure you want to proceed with this action?"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
    />
  ),
}

export const Destructive: Story = {
  render: () => (
    <ConfirmModalDemo
      variant="destructive"
      title="Cancel Appointment"
      message="Are you sure you want to cancel this appointment? This action cannot be undone."
      confirmLabel="Cancel Appointment"
      cancelLabel="Keep Appointment"
    />
  ),
}

export const DeleteConfirmation: Story = {
  render: () => (
    <ConfirmModalDemo
      variant="destructive"
      title="Delete Family Member"
      message="Are you sure you want to remove this family member? Their appointment history will be preserved."
      confirmLabel="Delete"
      cancelLabel="Keep"
    />
  ),
}

export const LogoutConfirmation: Story = {
  render: () => (
    <ConfirmModalDemo
      title="Sign Out"
      message="Are you sure you want to sign out? You'll need to sign in again to access your appointments."
      confirmLabel="Sign Out"
      cancelLabel="Stay Signed In"
    />
  ),
}

export const SubmitConfirmation: Story = {
  render: () => (
    <ConfirmModalDemo
      title="Submit Booking"
      message="Please confirm your appointment booking. You'll receive a confirmation once the practice accepts."
      confirmLabel="Book Now"
      cancelLabel="Review Details"
    />
  ),
}

// Both variants side by side
export const BothVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <ConfirmModalDemo
        title="Confirm"
        message="Default confirmation modal."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
      />
      <ConfirmModalDemo
        variant="destructive"
        title="Delete"
        message="Destructive confirmation modal."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  ),
}

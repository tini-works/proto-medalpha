import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { OTPInput } from '@meda/ui'

const meta = {
  title: 'Components/OTPInput',
  component: OTPInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    length: {
      control: 'select',
      options: [4, 6],
    },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    mask: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
  },
} satisfies Meta<typeof OTPInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    length: 6,
    autoFocus: false,
  },
}

export const FourDigits: Story = {
  args: {
    length: 4,
    autoFocus: false,
  },
}

export const WithError: Story = {
  args: {
    length: 6,
    error: 'Invalid verification code',
    autoFocus: false,
  },
}

export const Masked: Story = {
  args: {
    length: 6,
    mask: true,
    autoFocus: false,
  },
}

export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    autoFocus: false,
  },
}

export const Interactive: Story = {
  render: function Render() {
    const [code, setCode] = useState('')
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')

    const handleComplete = async (otp: string) => {
      setStatus('verifying')
      // Simulate verification
      await new Promise((r) => setTimeout(r, 1500))
      if (otp === '123456') {
        setStatus('success')
      } else {
        setStatus('error')
      }
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <OTPInput
          length={6}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          error={status === 'error' ? 'Invalid code. Try 123456' : undefined}
          autoFocus={false}
        />
        <p className="text-sm text-neutral-500">
          {status === 'idle' && 'Enter the 6-digit code'}
          {status === 'verifying' && 'Verifying...'}
          {status === 'success' && '✓ Code verified!'}
          {status === 'error' && 'Try entering: 123456'}
        </p>
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-neutral-600 mb-2">6 digits (default)</p>
        <OTPInput length={6} autoFocus={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">4 digits</p>
        <OTPInput length={4} autoFocus={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Masked</p>
        <OTPInput length={6} mask autoFocus={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">With error</p>
        <OTPInput length={6} error="Invalid code" autoFocus={false} />
      </div>
      <div>
        <p className="text-sm text-neutral-600 mb-2">Disabled</p>
        <OTPInput length={6} disabled autoFocus={false} />
      </div>
    </div>
  ),
}

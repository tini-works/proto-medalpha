import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ResendTimer } from '@meda/ui'

const meta = {
  title: 'Components/ResendTimer',
  component: ResendTimer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialSeconds: { control: 'number' },
    label: { control: 'text' },
    resendingLabel: { control: 'text' },
    countdownLabel: { control: 'text' },
    startEnabled: { control: 'boolean' },
  },
} satisfies Meta<typeof ResendTimer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onResend: async () => {
      await new Promise((r) => setTimeout(r, 1000))
    },
    initialSeconds: 10,
  },
}

export const StartEnabled: Story = {
  args: {
    onResend: async () => {
      await new Promise((r) => setTimeout(r, 1000))
    },
    startEnabled: true,
  },
}

export const CustomLabels: Story = {
  args: {
    onResend: async () => {
      await new Promise((r) => setTimeout(r, 1000))
    },
    initialSeconds: 5,
    label: 'Send again',
    resendingLabel: 'Sending code...',
    countdownLabel: 'Wait {{seconds}}s',
  },
}

export const LongTimer: Story = {
  args: {
    onResend: async () => {
      await new Promise((r) => setTimeout(r, 1000))
    },
    initialSeconds: 120,
  },
}

export const Interactive: Story = {
  render: function Render() {
    const [resendCount, setResendCount] = useState(0)
    const [lastResent, setLastResent] = useState<string | null>(null)

    const handleResend = async () => {
      await new Promise((r) => setTimeout(r, 1500))
      setResendCount((c) => c + 1)
      setLastResent(new Date().toLocaleTimeString())
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <ResendTimer onResend={handleResend} initialSeconds={10} />
        <div className="text-sm text-neutral-500">
          <p>Resend count: {resendCount}</p>
          {lastResent && <p>Last resent: {lastResent}</p>}
        </div>
      </div>
    )
  },
}

export const InOTPContext: Story = {
  render: function Render() {
    const [code, setCode] = useState(['', '', '', '', '', ''])

    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-sm text-neutral-600">Enter the code sent to your phone</p>
        <div className="flex gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const newCode = [...code]
                newCode[i] = e.target.value
                setCode(newCode)
              }}
              className="w-10 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          ))}
        </div>
        <ResendTimer
          onResend={async () => {
            await new Promise((r) => setTimeout(r, 1000))
            setCode(['', '', '', '', '', ''])
          }}
          initialSeconds={30}
        />
      </div>
    )
  },
}

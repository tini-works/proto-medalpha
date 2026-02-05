import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PasswordField } from '@meda/ui'

const meta = {
  title: 'Components/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    showStrengthIndicator: { control: 'boolean' },
    showRequirements: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof PasswordField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    hint: 'Must be at least 8 characters',
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    error: 'Password is required',
  },
}

export const WithStrengthIndicator: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <PasswordField
          label="New Password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showStrengthIndicator
          placeholder="Create a strong password"
        />
      </div>
    )
  },
}

export const WithRequirements: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <PasswordField
          label="New Password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showRequirements
          placeholder="Create a strong password"
        />
      </div>
    )
  },
}

export const FullFeatures: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <PasswordField
          label="New Password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          showStrengthIndicator
          showRequirements
          required
          placeholder="Create a strong password"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  args: {
    label: 'Password',
    disabled: true,
    value: 'secretpassword',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <PasswordField label="Default" placeholder="Enter password" />
      <PasswordField label="With hint" placeholder="Enter password" hint="At least 8 characters" />
      <PasswordField label="With error" error="Password is too weak" />
      <PasswordField label="Required" placeholder="Enter password" required />
      <PasswordField label="Disabled" disabled value="hidden" />
    </div>
  ),
}

import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Field } from '@meda/ui'

const meta = {
  title: 'Components/Field',
  component: Field,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Full Name',
    placeholder: 'Enter your full name',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    hint: 'This will be your public display name',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'invalid-email',
    error: 'Please enter a valid email address',
  },
}

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Account ID',
    defaultValue: 'ACC-12345',
    disabled: true,
    hint: 'This cannot be changed',
  },
}

export const WithHintAndError: Story = {
  args: {
    label: 'Password',
    type: 'password',
    hint: 'Must be at least 8 characters',
    error: 'Password is too weak',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Field label="Default" placeholder="Enter text..." />
      <Field label="With hint" placeholder="Enter text..." hint="This is helper text" />
      <Field label="Required" placeholder="Required field" required />
      <Field label="With error" defaultValue="Bad input" error="This field has an error" />
      <Field
        label="Error + hint"
        defaultValue="Bad input"
        hint="Original hint text"
        error="Error takes precedence"
      />
      <Field label="Disabled" defaultValue="Cannot edit" disabled hint="Read-only field" />
    </div>
  ),
}

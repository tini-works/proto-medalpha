import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@meda/ui'

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel'],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Email',
    defaultValue: 'user@example.com',
  },
}

export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'invalid-email',
    error: 'Please enter a valid email address',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Email',
    defaultValue: 'user@example.com',
    disabled: true,
  },
}

export const Required: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    required: true,
  },
}

export const NumberInput: Story = {
  args: {
    label: 'Age',
    type: 'number',
    placeholder: 'Enter your age',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Input label="Default" placeholder="Enter text..." />
      <Input label="With value" defaultValue="Some value" />
      <Input label="With error" defaultValue="Bad input" error="This field has an error" />
      <Input label="Disabled" defaultValue="Cannot edit" disabled />
      <Input label="Required" placeholder="Required field" required />
    </div>
  ),
}

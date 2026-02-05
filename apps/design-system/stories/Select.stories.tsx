import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Select } from '@meda/ui'

const countryOptions = [
  { value: 'de', label: 'Germany' },
  { value: 'at', label: 'Austria' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'fr', label: 'France' },
  { value: 'nl', label: 'Netherlands' },
]

const meta = {
  title: 'Components/Select',
  component: Select,
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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'de',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    hint: 'Choose your country of residence',
  },
}

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    error: 'Please select a country',
  },
}

export const Required: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country',
    required: true,
  },
}

export const Disabled: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    defaultValue: 'de',
    disabled: true,
  },
}

export const Interactive: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <Select
          label="Country"
          options={countryOptions}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Select a country"
          hint={value ? `Selected: ${value}` : 'No selection yet'}
        />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Select label="Default" options={countryOptions} placeholder="Select..." />
      <Select label="With value" options={countryOptions} defaultValue="de" />
      <Select
        label="With hint"
        options={countryOptions}
        placeholder="Select..."
        hint="Helper text"
      />
      <Select
        label="With error"
        options={countryOptions}
        placeholder="Select..."
        error="Selection required"
      />
      <Select label="Required" options={countryOptions} placeholder="Select..." required />
      <Select label="Disabled" options={countryOptions} defaultValue="de" disabled />
    </div>
  ),
}

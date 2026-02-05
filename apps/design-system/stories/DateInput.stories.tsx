import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DateInput } from '@meda/ui'

const meta = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof DateInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <DateInput label="Date of Birth" value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: function Render() {
    const [value, setValue] = useState('1990-05-15')
    return (
      <div className="w-80">
        <DateInput label="Date of Birth" value={value} onChange={setValue} />
      </div>
    )
  },
}

export const WithHint: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <DateInput
          label="Date of Birth"
          value={value}
          onChange={setValue}
          hint="Format: YYYY-MM-DD"
        />
      </div>
    )
  },
}

export const WithError: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <DateInput
          label="Date of Birth"
          value={value}
          onChange={setValue}
          error="Please enter a valid date"
        />
      </div>
    )
  },
}

export const WithMinMax: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const today = new Date().toISOString().split('T')[0]
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() - 18)
    const maxDateStr = maxDate.toISOString().split('T')[0]

    return (
      <div className="w-80">
        <DateInput
          label="Date of Birth"
          value={value}
          onChange={setValue}
          max={maxDateStr}
          min="1900-01-01"
          hint="Must be 18 or older"
        />
      </div>
    )
  },
}

export const Required: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <DateInput label="Appointment Date" value={value} onChange={setValue} required />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-80">
        <DateInput
          label="Registration Date"
          value="2024-01-15"
          onChange={() => {}}
          disabled
          hint="Cannot be changed"
        />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: function Render() {
    const [values, setValues] = useState({
      default: '',
      withValue: '2024-06-15',
      withHint: '',
      withError: '',
      required: '',
      disabled: '2024-01-01',
    })

    const update = (key: keyof typeof values) => (val: string) =>
      setValues((prev) => ({ ...prev, [key]: val }))

    return (
      <div className="flex flex-col gap-6 w-80">
        <DateInput label="Default" value={values.default} onChange={update('default')} />
        <DateInput label="With value" value={values.withValue} onChange={update('withValue')} />
        <DateInput
          label="With hint"
          value={values.withHint}
          onChange={update('withHint')}
          hint="Helper text"
        />
        <DateInput
          label="With error"
          value={values.withError}
          onChange={update('withError')}
          error="Invalid date"
        />
        <DateInput
          label="Required"
          value={values.required}
          onChange={update('required')}
          required
        />
        <DateInput
          label="Disabled"
          value={values.disabled}
          onChange={update('disabled')}
          disabled
        />
      </div>
    )
  },
}

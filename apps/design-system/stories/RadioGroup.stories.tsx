import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup } from '@meda/ui'

const appointmentOptions = [
  { value: 'in-person', label: 'In-Person Visit', description: 'Visit the clinic in person' },
  { value: 'video', label: 'Video Call', description: 'Online consultation via video' },
  { value: 'phone', label: 'Phone Call', description: 'Consultation over the phone' },
]

const simpleOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-96">
        <RadioGroup
          label="Appointment Type"
          name="appointment-type"
          options={appointmentOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const WithSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState('video')
    return (
      <div className="w-96">
        <RadioGroup
          label="Appointment Type"
          name="appointment-type-selected"
          options={appointmentOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const SimpleOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <RadioGroup
          label="Do you have insurance?"
          name="has-insurance"
          options={simpleOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const WithError: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-96">
        <RadioGroup
          label="Appointment Type"
          name="appointment-type-error"
          options={appointmentOptions}
          value={value}
          onChange={setValue}
          error="Please select an appointment type"
        />
      </div>
    )
  },
}

export const Required: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-96">
        <RadioGroup
          label="Appointment Type"
          name="appointment-type-required"
          options={appointmentOptions}
          value={value}
          onChange={setValue}
          required
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-96">
        <RadioGroup
          label="Appointment Type"
          name="appointment-type-disabled"
          options={appointmentOptions}
          value="video"
          onChange={() => {}}
          disabled
        />
      </div>
    )
  },
}

export const ManyOptions: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const languageOptions = [
      { value: 'en', label: 'English', description: 'Primary language' },
      { value: 'de', label: 'German', description: 'Deutsch' },
      { value: 'fr', label: 'French', description: 'Français' },
      { value: 'es', label: 'Spanish', description: 'Español' },
      { value: 'it', label: 'Italian', description: 'Italiano' },
    ]
    return (
      <div className="w-96">
        <RadioGroup
          label="Preferred Language"
          name="language"
          options={languageOptions}
          value={value}
          onChange={setValue}
        />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: function Render() {
    const [values, setValues] = useState({
      default: '',
      selected: 'video',
      error: '',
      required: '',
      disabled: 'phone',
    })

    return (
      <div className="flex flex-col gap-8 w-96">
        <RadioGroup
          label="Default"
          name="state-default"
          options={appointmentOptions}
          value={values.default}
          onChange={(v) => setValues((prev) => ({ ...prev, default: v }))}
        />
        <RadioGroup
          label="With selection"
          name="state-selected"
          options={appointmentOptions}
          value={values.selected}
          onChange={(v) => setValues((prev) => ({ ...prev, selected: v }))}
        />
        <RadioGroup
          label="With error"
          name="state-error"
          options={appointmentOptions}
          value={values.error}
          onChange={(v) => setValues((prev) => ({ ...prev, error: v }))}
          error="Selection required"
        />
        <RadioGroup
          label="Required"
          name="state-required"
          options={appointmentOptions}
          value={values.required}
          onChange={(v) => setValues((prev) => ({ ...prev, required: v }))}
          required
        />
        <RadioGroup
          label="Disabled"
          name="state-disabled"
          options={appointmentOptions}
          value={values.disabled}
          onChange={(v) => setValues((prev) => ({ ...prev, disabled: v }))}
          disabled
        />
      </div>
    )
  },
}

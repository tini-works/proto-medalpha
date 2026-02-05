import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { TextareaField } from '@meda/ui'

const meta = {
  title: 'Components/TextareaField',
  component: TextareaField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    placeholder: { control: 'text' },
    maxLength: { control: 'number' },
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof TextareaField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <TextareaField
          label="Description"
          value={value}
          onChange={setValue}
          placeholder="Enter a description..."
        />
      </div>
    )
  },
}

export const WithMaxLength: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <TextareaField
          label="Bio"
          value={value}
          onChange={setValue}
          maxLength={200}
          placeholder="Tell us about yourself..."
          hint="Keep it brief"
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
        <TextareaField
          label="Description"
          value={value}
          onChange={setValue}
          error="Description is required"
        />
      </div>
    )
  },
}

export const WithHint: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <TextareaField
          label="Notes"
          value={value}
          onChange={setValue}
          hint="Add any additional notes for the doctor"
          placeholder="Optional notes..."
        />
      </div>
    )
  },
}

export const CustomRows: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <TextareaField
          label="Short note"
          value={value}
          onChange={setValue}
          rows={2}
          placeholder="Brief note..."
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
        <TextareaField
          label="Message"
          value={value}
          onChange={setValue}
          required
          placeholder="Enter your message..."
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-80">
        <TextareaField
          label="Notes"
          value="This content cannot be edited."
          onChange={() => {}}
          disabled
        />
      </div>
    )
  },
}

export const AllStates: Story = {
  render: function Render() {
    const [values, setValues] = useState({
      default: '',
      withMax: 'Some initial text',
      withHint: '',
      withError: '',
      required: '',
      disabled: 'Read-only content',
    })

    const update = (key: keyof typeof values) => (val: string) =>
      setValues((prev) => ({ ...prev, [key]: val }))

    return (
      <div className="flex flex-col gap-6 w-80">
        <TextareaField
          label="Default"
          value={values.default}
          onChange={update('default')}
          placeholder="Enter text..."
        />
        <TextareaField
          label="With max length"
          value={values.withMax}
          onChange={update('withMax')}
          maxLength={100}
        />
        <TextareaField
          label="With hint"
          value={values.withHint}
          onChange={update('withHint')}
          hint="Helper text"
        />
        <TextareaField
          label="With error"
          value={values.withError}
          onChange={update('withError')}
          error="This field has an error"
        />
        <TextareaField
          label="Required"
          value={values.required}
          onChange={update('required')}
          required
        />
        <TextareaField
          label="Disabled"
          value={values.disabled}
          onChange={update('disabled')}
          disabled
        />
      </div>
    )
  },
}

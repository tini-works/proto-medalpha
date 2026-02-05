import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SearchInput } from '@meda/ui'

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    return (
      <div className="w-80">
        <SearchInput
          value={value}
          onChange={setValue}
          placeholder="Search..."
          aria-label="Search"
        />
      </div>
    )
  },
}

export const WithValue: Story = {
  render: function Render() {
    const [value, setValue] = useState('Doctor appointment')
    return (
      <div className="w-80">
        <SearchInput
          value={value}
          onChange={setValue}
          placeholder="Search..."
          aria-label="Search"
        />
      </div>
    )
  },
}

export const Disabled: Story = {
  render: function Render() {
    return (
      <div className="w-80">
        <SearchInput
          value="Search disabled"
          onChange={() => {}}
          placeholder="Search..."
          aria-label="Search"
          disabled
        />
      </div>
    )
  },
}

export const WithKeyboardHandler: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const [submitted, setSubmitted] = useState('')

    return (
      <div className="w-80 space-y-4">
        <SearchInput
          value={value}
          onChange={setValue}
          placeholder="Type and press Enter..."
          aria-label="Search"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSubmitted(value)
            }
          }}
        />
        {submitted && (
          <p className="text-sm text-neutral-600">
            Searched for: <strong>{submitted}</strong>
          </p>
        )}
      </div>
    )
  },
}

export const InContext: Story = {
  render: function Render() {
    const [value, setValue] = useState('')
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']
    const filtered = items.filter((item) => item.toLowerCase().includes(value.toLowerCase()))

    return (
      <div className="w-80 space-y-4">
        <SearchInput
          value={value}
          onChange={setValue}
          placeholder="Search fruits..."
          aria-label="Search fruits"
        />
        <ul className="border rounded-lg divide-y">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li key={item} className="px-3 py-2 text-sm">
                {item}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-neutral-500">No results found</li>
          )}
        </ul>
      </div>
    )
  },
}

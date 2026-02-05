import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from '@meda/ui'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    'aria-label': 'Toggle setting',
  },
}

export const Checked: Story = {
  args: {
    checked: true,
    'aria-label': 'Toggle setting',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Toggle setting (disabled)',
  },
}

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
    'aria-label': 'Toggle setting (disabled, on)',
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    checked: true,
    'aria-label': 'Toggle setting (loading)',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    'aria-label': 'Small toggle',
  },
}

export const SmallChecked: Story = {
  args: {
    size: 'sm',
    checked: true,
    'aria-label': 'Small toggle',
  },
}

// Interactive story with all states
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-neutral-600">Default</span>
        <Switch aria-label="Default off" />
        <Switch checked aria-label="Default on" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-neutral-600">Disabled</span>
        <Switch disabled aria-label="Disabled off" />
        <Switch disabled checked aria-label="Disabled on" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-neutral-600">Loading</span>
        <Switch loading aria-label="Loading off" />
        <Switch loading checked aria-label="Loading on" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-32 text-sm text-neutral-600">Small</span>
        <Switch size="sm" aria-label="Small off" />
        <Switch size="sm" checked aria-label="Small on" />
      </div>
    </div>
  ),
}

// Interactive controlled example
export const WithLabel: Story = {
  render: function Render() {
    const [checked, setChecked] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = async (newChecked: boolean) => {
      setLoading(true)
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1000))
      setChecked(newChecked)
      setLoading(false)
    }

    return (
      <div className="flex items-center gap-3">
        <Switch
          checked={checked}
          onChange={handleChange}
          loading={loading}
          aria-labelledby="notifications-label"
        />
        <label id="notifications-label" className="text-sm text-neutral-700">
          Enable notifications
        </label>
      </div>
    )
  },
}

// Keyboard navigation demo
export const KeyboardDemo: Story = {
  render: function Render() {
    const [values, setValues] = useState({
      first: false,
      second: true,
      third: false,
    })

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-neutral-500 mb-2">
          Use Tab to navigate between switches, Space or Enter to toggle
        </p>
        <div className="flex items-center gap-3">
          <Switch
            checked={values.first}
            onChange={(v) => setValues((prev) => ({ ...prev, first: v }))}
            aria-label="First option"
          />
          <span className="text-sm">First option</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={values.second}
            onChange={(v) => setValues((prev) => ({ ...prev, second: v }))}
            aria-label="Second option"
          />
          <span className="text-sm">Second option</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={values.third}
            onChange={(v) => setValues((prev) => ({ ...prev, third: v }))}
            aria-label="Third option"
          />
          <span className="text-sm">Third option</span>
        </div>
      </div>
    )
  },
}

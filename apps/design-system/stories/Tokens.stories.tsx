import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { colors } from '@meda/tokens'

// Color swatch component
const ColorSwatch = ({
  name,
  value,
  textDark = false,
}: {
  name: string
  value: string
  textDark?: boolean
}) => (
  <div className="flex flex-col">
    <div
      className="w-full h-14 rounded-lg border border-neutral-200 flex items-end justify-between p-2"
      style={{ backgroundColor: value }}
    >
      <span className={`text-xs font-mono ${textDark ? 'text-neutral-900' : 'text-white'}`}>
        {name}
      </span>
    </div>
    <span className="text-xs text-neutral-500 mt-1 font-mono">{value}</span>
  </div>
)

// Color scale component
const ColorScale = ({
  name,
  colorSet,
}: {
  name: string
  colorSet: Record<string, string>
}) => {
  const scales = Object.entries(colorSet).sort(
    ([a], [b]) => parseInt(a) - parseInt(b)
  )

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-neutral-800 mb-3 capitalize">
        {name.replace('-', ' ')}
      </h3>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
        {scales.map(([scale, value]) => (
          <ColorSwatch
            key={scale}
            name={scale}
            value={value}
            textDark={parseInt(scale) <= 200}
          />
        ))}
      </div>
    </div>
  )
}

// Meta for the Tokens documentation
const meta = {
  title: 'Tokens/Colors',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// All Colors
export const AllColors: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Color Tokens</h2>
        <p className="text-neutral-600 mb-8">
          Design tokens from <code className="bg-neutral-100 px-2 py-1 rounded">@meda/tokens</code>.
          Use in Tailwind as <code className="bg-neutral-100 px-2 py-1 rounded">bg-brand-blue-500</code> or
          import as <code className="bg-neutral-100 px-2 py-1 rounded">{`colors['brand-blue']['500']`}</code>.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-2 border-b">Brand Colors</h2>
        <ColorScale name="brand-blue" colorSet={colors['brand-blue']} />
        <ColorScale name="brand-teal" colorSet={colors['brand-teal']} />
        <ColorScale name="brand-mint" colorSet={colors['brand-mint']} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-2 border-b">Neutral Colors</h2>
        <ColorScale name="neutral" colorSet={colors['neutral']} />
        <ColorScale name="charcoal" colorSet={colors['charcoal']} />
        <ColorScale name="slate" colorSet={colors['slate']} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-2 border-b">Accent Colors</h2>
        <ColorScale name="teal" colorSet={colors['teal']} />
        <ColorScale name="coral" colorSet={colors['coral']} />
        <ColorScale name="cream" colorSet={colors['cream']} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-neutral-800 mb-4 pb-2 border-b">Semantic Colors</h2>
        <ColorScale name="success" colorSet={colors['success']} />
        <ColorScale name="error" colorSet={colors['error']} />
      </section>
    </div>
  ),
}

// Brand Colors Only
export const BrandColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Brand Colors</h2>
      <ColorScale name="brand-blue" colorSet={colors['brand-blue']} />
      <ColorScale name="brand-teal" colorSet={colors['brand-teal']} />
      <ColorScale name="brand-mint" colorSet={colors['brand-mint']} />
    </div>
  ),
}

// Neutral Colors Only
export const NeutralColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Neutral Colors</h2>
      <ColorScale name="neutral" colorSet={colors['neutral']} />
      <ColorScale name="charcoal" colorSet={colors['charcoal']} />
      <ColorScale name="slate" colorSet={colors['slate']} />
    </div>
  ),
}

// Semantic Colors Only
export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-neutral-900">Semantic Colors</h2>
      <p className="text-neutral-600 mb-4">
        Use for feedback states: success, error, warnings.
      </p>
      <ColorScale name="success" colorSet={colors['success']} />
      <ColorScale name="error" colorSet={colors['error']} />
    </div>
  ),
}

// Color Usage Examples
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-neutral-900">Usage Examples</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Buttons</h3>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-brand-blue-600 text-white rounded-lg hover:bg-brand-blue-700">
            Primary
          </button>
          <button className="px-4 py-2 bg-brand-teal-600 text-white rounded-lg hover:bg-brand-teal-700">
            Secondary
          </button>
          <button className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700">
            Destructive
          </button>
          <button className="px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700">
            Success
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <div className="space-y-3">
          <div className="p-4 bg-success-50 border border-success-500 text-success-700 rounded-lg">
            Success: Your changes have been saved.
          </div>
          <div className="p-4 bg-error-50 border border-error-500 text-error-700 rounded-lg">
            Error: Something went wrong. Please try again.
          </div>
          <div className="p-4 bg-brand-blue-50 border border-brand-blue-500 text-brand-blue-700 rounded-lg">
            Info: Your appointment is confirmed.
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cards</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-cream-50 border border-cream-200 rounded-lg">
            <p className="font-medium text-charcoal-800">Warm Card</p>
            <p className="text-sm text-charcoal-600">Using cream tones</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="font-medium text-slate-800">Cool Card</p>
            <p className="text-sm text-slate-600">Using slate tones</p>
          </div>
          <div className="p-4 bg-brand-mint-50 border border-brand-mint-200 rounded-lg">
            <p className="font-medium text-brand-mint-800">Accent Card</p>
            <p className="text-sm text-brand-mint-600">Using mint tones</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Text Hierarchy</h3>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-neutral-900">Heading (neutral-900)</p>
          <p className="text-lg text-neutral-700">Subheading (neutral-700)</p>
          <p className="text-neutral-600">Body text (neutral-600)</p>
          <p className="text-sm text-neutral-500">Caption text (neutral-500)</p>
          <p className="text-xs text-neutral-400">Muted text (neutral-400)</p>
        </div>
      </div>
    </div>
  ),
}

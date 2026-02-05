import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Sheet } from '@docliQ/components/ui/Sheet'
import { Button } from '@meda/ui'

const meta = {
  title: 'Patterns/Overlays/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Versatile modal/sheet component with three variants.

**Variants:**
- \`bottom\`: Slides up from bottom (default) - ideal for mobile actions
- \`center\`: Scales in at center - ideal for confirmations/dialogs
- \`fullscreen\`: Fades in fullscreen - ideal for complex forms

**Features:**
- Configurable sizes: auto, sm, md, lg, xl
- Body scroll lock
- Focus trap and restoration
- Escape key handling
- Backdrop click to close
- Compound component API (Sheet.Header, Sheet.Body, Sheet.Footer)
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['bottom', 'center', 'fullscreen'],
    },
    size: {
      control: 'select',
      options: ['auto', 'sm', 'md', 'lg', 'xl'],
    },
    open: { control: 'boolean' },
    showDragHandle: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    closeOnBackdropClick: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

// Interactive wrapper for stories
function SheetDemo({
  variant = 'bottom',
  size = 'auto',
  title,
  withFooter = false,
}: {
  variant?: 'bottom' | 'center' | 'fullscreen'
  size?: 'auto' | 'sm' | 'md' | 'lg' | 'xl'
  title?: string
  withFooter?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open {variant} sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        variant={variant}
        size={size}
        title={title}
        footer={
          withFooter ? (
            <div className="flex gap-3">
              <Button variant="tertiary" fullWidth onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          ) : undefined
        }
      >
        <div className="px-4 py-4">
          <p className="text-slate-600">
            This is the sheet content. It can contain any React elements.
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-slate-500">• Variant: {variant}</p>
            <p className="text-sm text-slate-500">• Size: {size}</p>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

export const BottomSheet: Story = {
  render: () => <SheetDemo variant="bottom" title="Bottom Sheet" />,
}

export const CenterSheet: Story = {
  render: () => <SheetDemo variant="center" title="Center Dialog" />,
}

export const FullscreenSheet: Story = {
  render: () => <SheetDemo variant="fullscreen" title="Fullscreen" />,
}

export const WithFooter: Story = {
  render: () => <SheetDemo variant="bottom" title="With Footer" withFooter />,
}

export const SmallSize: Story = {
  render: () => <SheetDemo variant="bottom" size="sm" title="Small Sheet" />,
}

export const LargeSize: Story = {
  render: () => <SheetDemo variant="bottom" size="lg" title="Large Sheet" />,
}

// Complex content example
function FilterSheetDemo() {
  const [open, setOpen] = useState(false)
  const [distance, setDistance] = useState(10)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open Filters</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        variant="bottom"
        size="md"
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button variant="tertiary" fullWidth onClick={() => setOpen(false)}>
              Clear all
            </Button>
            <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
              Apply filters
            </Button>
          </div>
        }
      >
        <div className="px-4 py-4 space-y-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-500 mb-2">
              Distance: {distance} km
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-500 mb-2">
              Insurance Type
            </label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">GKV</Button>
              <Button variant="ghost" size="sm">PKV</Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal-500 mb-2">
              Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {['German', 'English', 'Turkish', 'Arabic'].map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-cream-200 text-charcoal-500 rounded-full text-sm cursor-pointer hover:bg-cream-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

export const FilterSheet: Story = {
  render: () => <FilterSheetDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of a filter sheet with form controls.',
      },
    },
  },
}

// All variants side by side
export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4">
      <SheetDemo variant="bottom" title="Bottom" />
      <SheetDemo variant="center" title="Center" />
      <SheetDemo variant="fullscreen" title="Fullscreen" />
    </div>
  ),
}

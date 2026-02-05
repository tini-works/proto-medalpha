import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Label, HelperText, ErrorText, InputBase } from '@meda/ui'

// Label Stories
const labelMeta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    required: { control: 'boolean' },
  },
} satisfies Meta<typeof Label>

export default labelMeta
type LabelStory = StoryObj<typeof labelMeta>

export const LabelDefault: LabelStory = {
  args: {
    children: 'Email address',
  },
}

export const LabelRequired: LabelStory = {
  args: {
    children: 'Email address',
    required: true,
  },
}

export const LabelWithInput: LabelStory = {
  render: () => (
    <div className="flex flex-col gap-1">
      <Label htmlFor="email-input" required>
        Email address
      </Label>
      <InputBase id="email-input" placeholder="you@example.com" />
    </div>
  ),
}

// HelperText Stories
export const HelperTextDefault: StoryObj<typeof HelperText> = {
  render: () => <HelperText>This will be your public display name</HelperText>,
}

export const HelperTextInContext: StoryObj<typeof HelperText> = {
  render: () => (
    <div className="flex flex-col gap-1 w-80">
      <Label htmlFor="username">Username</Label>
      <InputBase id="username" placeholder="johndoe" />
      <HelperText>Only letters, numbers, and underscores allowed</HelperText>
    </div>
  ),
}

// ErrorText Stories
export const ErrorTextDefault: StoryObj<typeof ErrorText> = {
  render: () => <ErrorText>Please enter a valid email address</ErrorText>,
}

export const ErrorTextInContext: StoryObj<typeof ErrorText> = {
  render: () => (
    <div className="flex flex-col gap-1 w-80">
      <Label htmlFor="email-error">Email</Label>
      <InputBase id="email-error" defaultValue="invalid-email" hasError />
      <ErrorText>Please enter a valid email address</ErrorText>
    </div>
  ),
}

// InputBase Stories
export const InputBaseDefault: StoryObj<typeof InputBase> = {
  render: () => <InputBase placeholder="Enter text..." />,
}

export const InputBaseWithError: StoryObj<typeof InputBase> = {
  render: () => <InputBase placeholder="Enter text..." hasError defaultValue="Invalid input" />,
}

export const InputBaseDisabled: StoryObj<typeof InputBase> = {
  render: () => <InputBase placeholder="Disabled" disabled />,
}

// All Primitives Together
export const AllPrimitives: StoryObj<typeof Label> = {
  render: () => (
    <div className="flex flex-col gap-8 w-80">
      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Label</h3>
        <div className="flex flex-col gap-2">
          <Label>Default label</Label>
          <Label required>Required label</Label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">HelperText</h3>
        <HelperText>This is helper text providing additional guidance</HelperText>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">ErrorText</h3>
        <ErrorText>This is an error message</ErrorText>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">InputBase</h3>
        <div className="flex flex-col gap-2">
          <InputBase placeholder="Default input" />
          <InputBase placeholder="With error" hasError />
          <InputBase placeholder="Disabled" disabled />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Combined Example</h3>
        <div className="flex flex-col gap-1">
          <Label htmlFor="combined" required>
            Email
          </Label>
          <InputBase id="combined" placeholder="you@example.com" />
          <HelperText>We&apos;ll never share your email</HelperText>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Combined with Error</h3>
        <div className="flex flex-col gap-1">
          <Label htmlFor="combined-error" required>
            Email
          </Label>
          <InputBase id="combined-error" defaultValue="bad-email" hasError />
          <ErrorText>Please enter a valid email</ErrorText>
        </div>
      </div>
    </div>
  ),
}

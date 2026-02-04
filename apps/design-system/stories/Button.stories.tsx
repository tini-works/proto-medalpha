import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@meda/ui'
import { IconPlus, IconArrowRight, IconTrash, IconX } from '@tabler/icons-react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'ghost',
        'accent',
        'destructive',
        'destructive-filled',
        'icon',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Variant stories
export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
  },
}

export const Tertiary: Story = {
  args: {
    children: 'Button',
    variant: 'tertiary',
  },
}

export const Ghost: Story = {
  args: {
    children: 'Button',
    variant: 'ghost',
  },
}

export const Accent: Story = {
  args: {
    children: 'Button',
    variant: 'accent',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const DestructiveFilled: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive-filled',
  },
}

export const Icon: Story = {
  args: {
    children: <IconX size={20} />,
    variant: 'icon',
  },
}

export const Link: Story = {
  args: {
    children: 'Learn more',
    variant: 'link',
  },
}

// Size stories
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

// State stories
export const Loading: Story = {
  args: {
    children: 'Saving...',
    loading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
}

// Icon stories
export const WithLeftIcon: Story = {
  args: {
    children: 'Add Item',
    leftIcon: <IconPlus size={20} />,
  },
}

export const WithRightIcon: Story = {
  args: {
    children: 'Continue',
    rightIcon: <IconArrowRight size={20} />,
  },
}

export const DestructiveWithIcon: Story = {
  args: {
    children: 'Delete Item',
    variant: 'destructive-filled',
    leftIcon: <IconTrash size={20} />,
  },
}

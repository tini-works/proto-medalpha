import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter, Button } from '@meda/ui'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <CardBody>
        <p>This is a basic card with some content.</p>
      </CardBody>
    ),
  },
}

export const WithHeader: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-lg font-semibold">Card Title</h3>
      </CardHeader>
      <CardBody>
        <p className="text-neutral-600">
          This card has a header section for titles or actions.
        </p>
      </CardBody>
    </Card>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardBody>
        <p className="text-neutral-600">
          This card has a footer section for actions.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
}

export const FullCard: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <h3 className="text-lg font-semibold">Account Settings</h3>
        <p className="text-sm text-neutral-500">Manage your account preferences</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Email</p>
            <p className="text-neutral-600">user@example.com</p>
          </div>
          <div>
            <p className="text-sm font-medium">Plan</p>
            <p className="text-neutral-600">Professional</p>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
        <Button size="sm">Update</Button>
      </CardFooter>
    </Card>
  ),
}

export const CardVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Card className="w-80">
        <CardBody>
          <p className="font-medium">Simple Card</p>
          <p className="text-sm text-neutral-500">Just body content</p>
        </CardBody>
      </Card>
      <Card className="w-80">
        <CardHeader>
          <p className="font-medium">Header Only</p>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-neutral-600">With body content below</p>
        </CardBody>
      </Card>
      <Card className="w-80">
        <CardBody>
          <p className="text-sm text-neutral-600">Body with footer actions</p>
        </CardBody>
        <CardFooter>
          <Button size="sm">Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}

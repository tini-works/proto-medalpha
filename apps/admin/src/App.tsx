import { Button, Card, CardHeader, CardBody, Input } from '@meda/ui'

export function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-neutral-900">MA Admin</h1>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Design System Demo</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input label="Email" type="email" placeholder="Enter your email" />
            <Input label="Password" type="password" placeholder="Enter your password" />
            <div className="flex gap-2">
              <Button variant="primary">Sign In</Button>
              <Button variant="secondary">Cancel</Button>
              <Button variant="ghost">Forgot Password?</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

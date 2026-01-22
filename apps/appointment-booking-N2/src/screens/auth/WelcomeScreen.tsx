import { useNavigate } from 'react-router-dom'
import { Card, Page, PrimaryButton, SecondaryButton } from '../../components'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  return (
    <Page>
      <div style={{ paddingTop: 'var(--space-8)' }}>
        <div className="h1">Welcome</div>
        <div className="label" style={{ marginTop: 6 }}>
          Please sign in to continue.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-6)' }}>
        <Card tone="mint">
          <div className="h2">Secure access</div>
          <div className="label" style={{ marginTop: 6 }}>
            Your profile is required to connect bookings and prescriptions reliably.
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <PrimaryButton fullWidth onClick={() => navigate('/auth/sign-in')}>
            Sign in
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/auth/register')}>
            Create account
          </SecondaryButton>
        </div>

        <div className="label" style={{ paddingBottom: 'var(--space-6)' }}>
          Note: This is a prototype. No real bookings are created.
        </div>
      </div>
    </Page>
  )
}

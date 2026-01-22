import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function SignInScreen() {
  const navigate = useNavigate()
  const { signIn } = useAppState()
  const [emailOrPhone, setEmailOrPhone] = useState('')

  const canContinue = useMemo(() => emailOrPhone.trim().length >= 5, [emailOrPhone])

  return (
    <Page>
      <Header title="Sign in" backTo="/auth/welcome" />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Field
            label="Email or phone"
            value={emailOrPhone}
            onChange={setEmailOrPhone}
            placeholder="e.g. name@example.com"
            type="email"
          />
          <Field label="Password" value="••••••••" onChange={() => {}} type="password" />

          <PrimaryButton
            fullWidth
            disabled={!canContinue}
            onClick={() => {
              signIn(emailOrPhone.trim())
              navigate('/auth/verify')
            }}
          >
            Continue
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/auth/register')}>
            Create account
          </SecondaryButton>
        </div>
      </Card>
    </Page>
  )
}

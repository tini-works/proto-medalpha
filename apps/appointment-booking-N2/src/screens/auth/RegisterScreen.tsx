import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const { signIn, updateProfile } = useAppState()
  const [fullName, setFullName] = useState('')
  const [emailOrPhone, setEmailOrPhone] = useState('')

  const canContinue = useMemo(() => fullName.trim().length >= 3 && emailOrPhone.trim().length >= 5, [fullName, emailOrPhone])

  return (
    <Page>
      <Header title="Create account" backTo="/auth/welcome" />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Field label="Full name" value={fullName} onChange={setFullName} placeholder="First and last name" />
          <Field
            label="Email or phone"
            value={emailOrPhone}
            onChange={setEmailOrPhone}
            placeholder="e.g. name@example.com"
          />
          <Field label="Password" value="••••••••" onChange={() => {}} type="password" />

          <PrimaryButton
            fullWidth
            disabled={!canContinue}
            onClick={() => {
              updateProfile({ fullName: fullName.trim(), emailOrPhone: emailOrPhone.trim() })
              signIn(emailOrPhone.trim())
              navigate('/auth/verify')
            }}
          >
            Continue
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => navigate('/auth/sign-in')}>
            I already have an account
          </SecondaryButton>
        </div>
      </Card>
    </Page>
  )
}

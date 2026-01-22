import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, Pill, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function VerifyScreen() {
  const navigate = useNavigate()
  const { state, markVerified } = useAppState()
  const [code, setCode] = useState('')
  const canVerify = useMemo(() => code.trim().length >= 4, [code])

  return (
    <Page>
      <Header title="Verification" backTo="/auth/welcome" />

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Pill tone="info">Code sent to: {state.profile.emailOrPhone || 'your account'}</Pill>
          <Field label="Code" value={code} onChange={setCode} placeholder="e.g. 1234" />
          <PrimaryButton
            fullWidth
            disabled={!canVerify}
            onClick={() => {
              markVerified()
              navigate('/profile/complete')
            }}
          >
            Confirm
          </PrimaryButton>
          <SecondaryButton fullWidth onClick={() => setCode('')}>
            Resend code
          </SecondaryButton>
        </div>
      </Card>
    </Page>
  )
}

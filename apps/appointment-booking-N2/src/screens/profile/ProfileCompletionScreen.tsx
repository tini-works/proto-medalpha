import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Field, Header, Page, Pill, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function ProfileCompletionScreen() {
  const navigate = useNavigate()
  const { state, updateProfile, isProfileComplete } = useAppState()

  const canContinue = useMemo(() => isProfileComplete, [isProfileComplete])

  return (
    <Page>
      <Header title="Complete profile" subtitle="Required for core features" backTo="/auth/welcome" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <Card tone="mint">
          <div className="h2">Insurance</div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <SecondaryButton
              fullWidth
              onClick={() => updateProfile({ insuranceType: 'GKV' })}
              disabled={state.profile.insuranceType === 'GKV'}
            >
              GKV
            </SecondaryButton>
            <SecondaryButton
              fullWidth
              onClick={() => updateProfile({ insuranceType: 'PKV' })}
              disabled={state.profile.insuranceType === 'PKV'}
            >
              PKV
            </SecondaryButton>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Field
              label="eGK number"
              value={state.profile.egkNumber}
              onChange={(egkNumber) => updateProfile({ egkNumber })}
              placeholder="e.g. 1234567890"
            />
          </div>
        </Card>

        <Card>
          <div className="h2">Address</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            <Field
              label="Street and number"
              value={state.profile.addressLine}
              onChange={(addressLine) => updateProfile({ addressLine })}
              placeholder="e.g. Main Street 12"
            />
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ flex: 1 }}>
                <Field
                  label="Postal code"
                  value={state.profile.postalCode}
                  onChange={(postalCode) => updateProfile({ postalCode })}
                  placeholder="e.g. 10115"
                />
              </div>
              <div style={{ flex: 2 }}>
                <Field label="City" value={state.profile.city} onChange={(city) => updateProfile({ city })} placeholder="e.g. Berlin" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="h2">Family</div>
          <div className="label" style={{ marginTop: 6 }}>
            Optional. You can add more people later.
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <SecondaryButton fullWidth onClick={() => navigate('/profile/family')}>
              Manage family members ({state.profile.familyMembers.length})
            </SecondaryButton>
          </div>
        </Card>

        {!canContinue ? <Pill tone="warn">Please complete all required fields.</Pill> : <Pill tone="ok">Profile complete.</Pill>}

        <PrimaryButton fullWidth disabled={!canContinue} onClick={() => navigate('/home')}>
          Continue to Home
        </PrimaryButton>
      </div>
    </Page>
  )
}

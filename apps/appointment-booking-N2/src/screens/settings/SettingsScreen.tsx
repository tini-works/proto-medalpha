import { useNavigate } from 'react-router-dom'
import { Card, Header, Page, Pill, PrimaryButton, SecondaryButton } from '../../components'
import { useAppState } from '../../state/AppState'

export default function SettingsScreen() {
  const navigate = useNavigate()
  const { state, setFontScale, resetAll, signOut, isProfileComplete } = useAppState()

  return (
    <Page>
      <div className="safe-bottom">
        <Header title="Settings" backTo="/home" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Card>
            <div className="h2">Font size</div>
            <div className="label" style={{ marginTop: 6 }}>
              This setting scales text and spacing together.
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <SecondaryButton fullWidth onClick={() => setFontScale(1)} disabled={state.preferences.fontScale === 1}>
                100 %
              </SecondaryButton>
              <SecondaryButton fullWidth onClick={() => setFontScale(1.15)} disabled={state.preferences.fontScale === 1.15}>
                115 %
              </SecondaryButton>
              <SecondaryButton fullWidth onClick={() => setFontScale(1.3)} disabled={state.preferences.fontScale === 1.3}>
                130 %
              </SecondaryButton>
            </div>
          </Card>

          <Card>
            <div className="h2">Notifications</div>
            <div className="label" style={{ marginTop: 6 }}>
              Control reminders and updates.
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SecondaryButton fullWidth onClick={() => navigate('/settings/notifications')}>
                Open
              </SecondaryButton>
            </div>
          </Card>

          <Card>
            <div className="h2">Profile status</div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              {isProfileComplete ? <Pill tone="ok">Profile complete</Pill> : <Pill tone="warn">Profile incomplete</Pill>}
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <SecondaryButton fullWidth onClick={() => navigate('/profile/complete')}>
                Edit profile
              </SecondaryButton>
            </div>
          </Card>

          <Card>
            <div className="h2">Session</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              <PrimaryButton fullWidth onClick={() => signOut()}>
                Sign out
              </PrimaryButton>
              <SecondaryButton
                fullWidth
                onClick={() => {
                  resetAll()
                  navigate('/auth/welcome')
                }}
              >
                Reset data
              </SecondaryButton>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  )
}

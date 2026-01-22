import { Card, Header, Page, Toggle } from '../../components'
import { useAppState } from '../../state/AppState'

export default function NotificationsScreen() {
  const { state, setNotificationPreferences } = useAppState()
  const { preferences } = state

  return (
    <Page>
      <Header title="Notifications" subtitle="Settings" backTo="/settings" />

      <Card>
        <div className="h2">Preferences</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          <Toggle
            label="Appointment reminders"
            description="Show reminders before appointments."
            checked={preferences.notifications.appointmentReminders}
            onChange={(v) => setNotificationPreferences({ appointmentReminders: v })}
          />
          <Toggle
            label="Prescription status"
            description="Updates on redemption and delivery."
            checked={preferences.notifications.prescriptionUpdates}
            onChange={(v) => setNotificationPreferences({ prescriptionUpdates: v })}
          />
          <Toggle
            label="Deals"
            description="Relevant offers, in a calm tone."
            checked={preferences.notifications.deals}
            onChange={(v) => setNotificationPreferences({ deals: v })}
          />
        </div>
      </Card>

      <Card>
        <div className="label">
          Note: The prototype does not send real push notifications. These settings exist for navigation and understanding.
        </div>
      </Card>
    </Page>
  )
}

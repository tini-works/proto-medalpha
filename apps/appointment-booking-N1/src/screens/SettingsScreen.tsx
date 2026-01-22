import { useState } from 'react'
import { Header, Card, TabBar, PrimaryButton } from '../components'

export default function SettingsScreen() {
  const [reminders, setReminders] = useState({
    push24h: true,
    push1h: true,
    email24h: true,
  })

  const handleSave = () => {
    alert('Settings saved!')
  }

  return (
    <div style={{ paddingBottom: '100px' }}>
      <Header title="Settings" />

      <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
        {/* Reminder Settings */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Reminders</h3>

          <label
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>Push notification (24h)</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>One day before the appointment</p>
            </div>
            <input
              type="checkbox"
              checked={reminders.push24h}
              onChange={(e) => setReminders({ ...reminders, push24h: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>Push notification (1h)</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>One hour before the appointment</p>
            </div>
            <input
              type="checkbox"
              checked={reminders.push1h}
              onChange={(e) => setReminders({ ...reminders, push1h: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-md) 0',
            }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>Email reminder</p>
              <p style={{ fontSize: '14px', color: 'var(--muted)' }}>One day before the appointment</p>
            </div>
            <input
              type="checkbox"
              checked={reminders.email24h}
              onChange={(e) => setReminders({ ...reminders, email24h: e.target.checked })}
              style={{ width: '20px', height: '20px' }}
            />
          </label>
        </Card>

        {/* Account Info */}
        <Card>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>Account</h3>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Insurance</p>
            <p style={{ fontWeight: 600 }}>Public Health Insurance</p>
          </div>
          <div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>Email</p>
            <p style={{ fontWeight: 600 }}>john.doe@email.com</p>
          </div>
        </Card>

        <PrimaryButton fullWidth onClick={handleSave}>
          Save Settings
        </PrimaryButton>

        {/* Version */}
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
          MedAlpha v1.0.0
        </p>
      </div>

      <TabBar active="settings" />
    </div>
  )
}

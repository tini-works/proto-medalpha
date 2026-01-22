import { Header, Page } from '../../components'
import { usePreferences } from '../../state'

export default function NotificationsScreen() {
  const { notifications, setNotificationPreferences } = usePreferences()

  const toggleSetting = (key: keyof typeof notifications) => {
    setNotificationPreferences({ [key]: !notifications[key] })
  }

  return (
    <Page safeBottom={false}>
      <Header title="Notifications" showBack />

      <div className="px-4 py-6">
        <p className="text-sm text-neutral-500 mb-6">
          Choose which notifications you&apos;d like to receive. You can change these settings at any time.
        </p>

        <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
          {/* Appointment reminders */}
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex-1 mr-4">
              <p className="font-medium text-neutral-900">Appointment Reminders</p>
              <p className="text-sm text-neutral-500">Get reminded before your appointments</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.appointmentReminders}
              onChange={() => toggleSetting('appointmentReminders')}
              className="w-5 h-5 rounded text-neutral-800 border-neutral-300 focus:ring-neutral-500"
            />
          </label>

          {/* Prescription updates */}
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex-1 mr-4">
              <p className="font-medium text-neutral-900">Prescription Updates</p>
              <p className="text-sm text-neutral-500">Status updates for your prescriptions</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.prescriptionUpdates}
              onChange={() => toggleSetting('prescriptionUpdates')}
              className="w-5 h-5 rounded text-neutral-800 border-neutral-300 focus:ring-neutral-500"
            />
          </label>

          {/* Deals and offers */}
          <label className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex-1 mr-4">
              <p className="font-medium text-neutral-900">Deals & Offers</p>
              <p className="text-sm text-neutral-500">Special offers and health deals</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.deals}
              onChange={() => toggleSetting('deals')}
              className="w-5 h-5 rounded text-neutral-800 border-neutral-300 focus:ring-neutral-500"
            />
          </label>
        </div>
      </div>
    </Page>
  )
}

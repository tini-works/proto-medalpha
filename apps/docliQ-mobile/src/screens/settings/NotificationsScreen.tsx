import { useTranslation } from 'react-i18next'
import { IconShield, IconToggleRight, IconToggleLeft } from '@tabler/icons-react'
import { Header, Page, TabBar } from '../../components'
import { usePreferences } from '../../state'

/**
 * Notifications preferences screen.
 * Allows users to toggle Appointments and Marketing & News notifications.
 */
export default function NotificationsScreen() {
  const { t } = useTranslation('settings')
  const { notifications, setNotificationPreferences } = usePreferences()

  const toggleAppointments = () => {
    setNotificationPreferences({ appointmentReminders: !notifications.appointmentReminders })
  }

  const toggleMarketing = () => {
    setNotificationPreferences({ deals: !notifications.deals })
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('notifications')} showBack />

      <div className="flex-1 flex flex-col px-4 py-6">
        {/* Preferences header */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{t('preferences')}</h3>
          <p className="text-sm text-slate-500 mt-1">
            {t('manageUpdates')}
          </p>
        </div>

        {/* Notification cards */}
        <div className="space-y-4">
          {/* Appointments */}
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-charcoal-500">{t('appointments')}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {t('appointmentReminders')}
                </p>
              </div>
              <button
                onClick={toggleAppointments}
                className="flex-shrink-0"
                aria-label={notifications.appointmentReminders ? 'Disable appointment reminders' : 'Enable appointment reminders'}
              >
                {notifications.appointmentReminders ? (
                  <IconToggleRight size={32} className="text-teal-600" />
                ) : (
                  <IconToggleLeft size={32} className="text-slate-300" />
                )}
              </button>
            </div>
          </div>

          {/* Marketing & News */}
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-charcoal-500">{t('marketingNews')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('stayUpdated')}</p>
              </div>
              <button
                onClick={toggleMarketing}
                className="flex-shrink-0"
                aria-label={notifications.deals ? 'Disable marketing updates' : 'Enable marketing updates'}
              >
                {notifications.deals ? (
                  <IconToggleRight size={32} className="text-teal-600" />
                ) : (
                  <IconToggleLeft size={32} className="text-slate-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Spacer to push security notice to bottom */}
        <div className="flex-1" />

        {/* Security notice */}
        <div className="mt-6 flex items-center justify-center gap-2 py-4 bg-teal-50 rounded-xl">
          <IconShield size={20} className="text-teal-600" />
          <p className="text-sm text-teal-700">{t('dataEncrypted')}</p>
        </div>
      </div>

      <TabBar />
    </Page>
  )
}

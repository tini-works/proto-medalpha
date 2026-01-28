import { useTranslation } from 'react-i18next'
import { Header, Page, TabBar } from '../../components'
import { usePreferences } from '../../state'

/**
 * Toggle switch component with iOS-style design.
 * Track is shorter than knob, creating overlapping pill effect.
 * Teal when enabled, slate grey when disabled.
 */
function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="relative inline-flex h-8 w-[52px] flex-shrink-0 cursor-pointer items-center focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-2 rounded-full"
    >
      {/* Track - shorter than knob, creates inset look */}
      <span
        className={`absolute left-0 right-0 h-[22px] rounded-full transition-colors duration-200 ${
          checked ? 'bg-teal-500' : 'bg-slate-300'
        }`}
      />
      {/* Knob - larger than track height, overlaps edges */}
      <span
        className={`relative z-10 inline-block h-7 w-7 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-[24px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

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
              <ToggleSwitch checked={notifications.appointmentReminders} onChange={toggleAppointments} />
            </div>
          </div>

          {/* Marketing & News */}
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-charcoal-500">{t('marketingNews')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('stayUpdated')}</p>
              </div>
              <ToggleSwitch checked={notifications.deals} onChange={toggleMarketing} />
            </div>
          </div>
        </div>

        {/* Spacer to push security notice to bottom */}
        <div className="flex-1" />

        {/* Security notice */}
        <div className="mt-6 flex items-center justify-center gap-2 py-4 bg-teal-50 rounded-xl">
          <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <p className="text-sm text-teal-700">{t('dataEncrypted')}</p>
        </div>
      </div>

      <TabBar />
    </Page>
  )
}

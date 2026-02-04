import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconShield } from '@tabler/icons-react'
import { Switch } from '@meda/ui'
import { Button, Sheet } from '../../components/ui'
import { Header, Page, TabBar } from '../../components'
import { usePreferences } from '../../state'
import { useNotificationToast } from '../../contexts/NotificationToastContext'

/**
 * Notifications preferences screen.
 * Allows users to toggle Appointments and Marketing & News notifications.
 */
export default function NotificationsScreen() {
  const { t } = useTranslation('settings')
  const { notifications, setNotificationPreferences } = usePreferences()
  const { showToast } = useNotificationToast()

  // Loading states for mock 1s persistence
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [marketingLoading, setMarketingLoading] = useState(false)
  const [showFeedbackSheet, setShowFeedbackSheet] = useState(false)

  const handleToggleAppointments = async (checked: boolean) => {
    setAppointmentsLoading(true)
    setNotificationPreferences({ appointmentReminders: checked })
    await new Promise((r) => setTimeout(r, 1000))
    setAppointmentsLoading(false)
    showToast({
      title: t('preferencesSaved'),
      type: 'success',
    })
  }

  const handleToggleMarketing = async (checked: boolean) => {
    setMarketingLoading(true)
    setNotificationPreferences({ deals: checked })
    await new Promise((r) => setTimeout(r, 1000))
    setMarketingLoading(false)
    showToast({
      title: t('preferencesSaved'),
      type: 'success',
    })
  }

  const handleToggleFeedbackReminders = async (checked: boolean) => {
    if (checked) {
      setShowFeedbackSheet(true)
      return
    }
    setFeedbackLoading(true)
    setNotificationPreferences({ visitFeedbackReminders: false })
    await new Promise((r) => setTimeout(r, 1000))
    setFeedbackLoading(false)
    showToast({
      title: t('preferencesSaved'),
      type: 'success',
    })
  }

  const handleConfirmFeedbackReminders = async () => {
    setShowFeedbackSheet(false)
    setFeedbackLoading(true)
    setNotificationPreferences({ visitFeedbackReminders: true })
    await new Promise((r) => setTimeout(r, 1000))
    setFeedbackLoading(false)
    showToast({
      title: t('preferencesSaved'),
      type: 'success',
    })
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
              <Switch
                checked={notifications.appointmentReminders}
                onChange={handleToggleAppointments}
                loading={appointmentsLoading}
                aria-label={
                  notifications.appointmentReminders
                    ? 'Disable appointment reminders'
                    : 'Enable appointment reminders'
                }
              />
            </div>
          </div>

          {/* Visit feedback reminders */}
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-charcoal-500">{t('visitFeedbackReminders')}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {t('visitFeedbackRemindersDesc')}
                </p>
              </div>
              <Switch
                checked={notifications.visitFeedbackReminders}
                onChange={handleToggleFeedbackReminders}
                loading={feedbackLoading}
                aria-label={
                  notifications.visitFeedbackReminders
                    ? 'Disable visit feedback reminders'
                    : 'Enable visit feedback reminders'
                }
              />
            </div>
          </div>

          {/* Marketing & News */}
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-charcoal-500">{t('marketingNews')}</p>
                <p className="text-sm text-slate-500 mt-1">{t('stayUpdated')}</p>
              </div>
              <Switch
                checked={notifications.deals}
                onChange={handleToggleMarketing}
                loading={marketingLoading}
                aria-label={
                  notifications.deals
                    ? 'Disable marketing updates'
                    : 'Enable marketing updates'
                }
              />
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

      <Sheet
        open={showFeedbackSheet}
        onClose={() => setShowFeedbackSheet(false)}
        title={t('visitFeedbackRemindersSheetTitle')}
        description={t('visitFeedbackRemindersSheetBody')}
        variant="center"
        size="sm"
        showDragHandle={false}
      >
        <Sheet.Body className="px-4 pb-6 space-y-3">
          <p className="text-sm text-slate-600">
            {t('visitFeedbackRemindersSheetBody')}
          </p>
        </Sheet.Body>
        <Sheet.Footer>
          <div className="flex flex-col gap-2">
            <Button onClick={handleConfirmFeedbackReminders} fullWidth>
              {t('visitFeedbackRemindersSheetConfirm')}
            </Button>
            <Button onClick={() => setShowFeedbackSheet(false)} variant="tertiary" fullWidth>
              {t('cancel')}
            </Button>
          </div>
        </Sheet.Footer>
      </Sheet>
    </Page>
  )
}

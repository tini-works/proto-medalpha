import { useNotificationToast } from '../../contexts/NotificationToastContext'
import Toast from './Toast'

/**
 * Renders the current in-app toast when one is shown by the toast context.
 * Must be mounted inside NotificationToastProvider.
 */
export default function ToastRenderer() {
  const { currentToast, dismissToast } = useNotificationToast()

  if (!currentToast) return null

  return <Toast toast={currentToast} onClose={() => dismissToast(currentToast.id)} />
}

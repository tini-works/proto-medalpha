import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCircleCheckFilled, IconCircleXFilled, IconAlertTriangle, IconX } from '@tabler/icons-react'
import type { ToastData } from '../../contexts/NotificationToastContext'
import { appointmentDetailPath } from '../../routes'

interface ToastProps {
  toast: ToastData
  onClose: () => void
}

/**
 * In-app toast for appointment status changes.
 * UI matches NotificationCard design for visual consistency.
 */
export default function Toast({ toast, onClose }: ToastProps) {
  const { t } = useTranslation('booking')

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <IconCircleCheckFilled className="text-teal-600" size={20} />
          </div>
        )
      case 'warning':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle className="text-amber-600" size={20} stroke={2} />
          </div>
        )
      case 'info':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <IconCircleXFilled className="text-slate-600" size={20} />
          </div>
        )
    }
  }

  return (
    <div
      role="alert"
      className="fixed top-6 left-4 right-4 z-50 max-w-md mx-auto bg-white rounded-lg p-4 border border-cream-300 shadow-lg safe-area-top"
    >
      <div className="flex items-center gap-3">
        {renderIcon()}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-charcoal-500">{toast.title}</h3>
          {toast.appointmentId && (
            <Link
              to={appointmentDetailPath(toast.appointmentId)}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
              onClick={onClose}
            >
              {t('viewDetails')} →
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-1 -mr-1 rounded-full hover:bg-cream-100 text-slate-400"
          aria-label="Dismiss"
        >
          <IconX size={16} stroke={2} />
        </button>
      </div>
    </div>
  )
}

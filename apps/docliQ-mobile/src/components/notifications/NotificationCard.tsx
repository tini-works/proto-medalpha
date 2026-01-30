import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCircleCheckFilled, IconCircleXFilled, IconCalendar, IconUsers } from '@tabler/icons-react'
import type { Notification } from '../../types'

interface NotificationCardProps {
  notification: Notification
}

// Map category types to i18n keys
const categoryToI18nKey: Record<string, string> = {
  'BOOKING UPDATE': 'categoryBookingUpdate',
  'CANCELLATION ALERT': 'categoryCancellationAlert',
  'UPCOMING': 'categoryUpcoming',
  'SECURITY': 'categorySecurity',
  'FAMILY PROFILE': 'categoryFamilyProfile',
}

// Map action labels to i18n keys
const actionLabelToI18nKey: Record<string, string> = {
  'View Details': 'actionViewDetails',
  'Reschedule': 'actionReschedule',
  'My Profile': 'actionMyProfile',
  'Manage Family': 'actionManageFamily',
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const { t } = useTranslation('notifications')
  // Render icon based on notification type
  const renderIcon = () => {
    switch (notification.type) {
      case 'BOOKING_UPDATE':
      case 'SECURITY':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <IconCircleCheckFilled className="text-teal-600" size={20} />
          </div>
        )
      case 'CANCELLATION_ALERT':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <IconCircleXFilled className="text-red-600" size={20} />
          </div>
        )
      case 'UPCOMING':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <IconCalendar className="text-teal-600" size={20} stroke={2} />
          </div>
        )
      case 'FAMILY_PROFILE':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <IconUsers className="text-slate-600" size={20} stroke={2} />
          </div>
        )
      default:
        return null
    }
  }

  // Get color for the dot indicator
  const getDotColor = () => {
    switch (notification.type) {
      case 'BOOKING_UPDATE':
      case 'SECURITY':
      case 'UPCOMING':
        return 'bg-teal-500'
      case 'CANCELLATION_ALERT':
        return 'bg-red-500'
      case 'FAMILY_PROFILE':
        return 'bg-slate-500'
      default:
        return 'bg-slate-500'
    }
  }

  // Build the card content with optional action
  const cardContent = (
    <div className="flex gap-3">
      {renderIcon()}
      <div className="flex-1">
        <p className="text-xs text-slate-400 uppercase font-medium mb-1">{t(categoryToI18nKey[notification.category] || 'categoryGeneral')}</p>
        <h3 className="text-sm font-semibold text-charcoal-500 mb-1">{notification.title}</h3>
        <p className="text-sm text-slate-600 mb-3">{notification.message}</p>
        {notification.actionLabel && notification.actionPath && (
          <Link
            to={notification.actionPath}
            className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-block"
          >
            {t(actionLabelToI18nKey[notification.actionLabel] || 'actionViewDetails')} {actionLabelToI18nKey[notification.actionLabel] === 'actionViewDetails' ? '→' : '🔧'}
          </Link>
        )}
      </div>
      <div className={`w-3 h-3 rounded-full ${getDotColor()} flex-shrink-0 mt-1`} />
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-4 border border-cream-300 hover:bg-cream-50 transition-colors duration-normal ease-out-brand">
      {cardContent}
    </div>
  )
}

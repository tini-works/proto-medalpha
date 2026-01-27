import { Link } from 'react-router-dom'
import type { Notification } from '../../types'

interface NotificationCardProps {
  notification: Notification
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  // Render icon based on notification type
  const renderIcon = () => {
    switch (notification.type) {
      case 'BOOKING_UPDATE':
      case 'SECURITY':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      case 'CANCELLATION_ALERT':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      case 'UPCOMING':
        return (
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )
      case 'FAMILY_PROFILE':
        return (
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.5 1.5H9.5A1.5 1.5 0 008 3v2.5a1 1 0 002 0V3a1 1 0 011-1h1a1 1 0 011 1v2.5a1 1 0 002 0V3a1.5 1.5 0 00-1.5-1.5z" />
              <path d="M3 8a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2zm4 0a1 1 0 110 2 1 1 0 010-2z" />
              <path
                fillRule="evenodd"
                d="M2.5 11a1 1 0 011-1h13a1 1 0 011 1v5a2 2 0 01-2 2h-10a2 2 0 01-2-2v-5zm2 1a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
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
        <p className="text-xs text-slate-400 uppercase font-medium mb-1">{notification.category}</p>
        <h3 className="text-sm font-semibold text-charcoal-500 mb-1">{notification.title}</h3>
        <p className="text-sm text-slate-600 mb-3">{notification.message}</p>
        {notification.actionLabel && notification.actionPath && (
          <Link
            to={notification.actionPath}
            className="text-sm font-medium text-teal-700 hover:text-teal-800 inline-block"
          >
            {notification.actionLabel} {notification.actionLabel === 'View Details' ? '→' : '🔧'}
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

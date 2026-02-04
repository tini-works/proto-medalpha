import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconArrowLeft, IconSearch } from '@tabler/icons-react'
import i18n from '../../i18n'
import { Page } from '../../components'
import { Button } from '../../components/ui'
import { PATHS } from '../../routes'
import NotificationCard from '../../components/notifications/NotificationCard'
import { FeaturedStoryCard, LatestNewsSection } from '../../components/newsfeed'
import { getLocalizedNotifications, groupNotificationsByDate } from '../../data/notifications'
import { mockFeaturedStory, mockNewsArticles } from '../../data/newsfeed'
import { useState, useEffect } from 'react'

function UpdatesScreen() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'notifications' | 'newsfeed'>('notifications')
  const { t } = useTranslation('notifications')

  // When navigating back from article detail, show News Feed tab
  useEffect(() => {
    if (location.state?.activeTab === 'newsfeed') {
      setActiveTab('newsfeed')
    }
  }, [location.state])

  // Get localized notifications based on current language
  const mockNotifications = getLocalizedNotifications(i18n.language)
  const grouped = groupNotificationsByDate(mockNotifications)
  const dateGroups = ['TODAY', 'YESTERDAY', ...Object.keys(grouped).filter((key) => key !== 'TODAY' && key !== 'YESTERDAY')]

  return (
    <Page>
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-cream-300 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          {/* Back button to home screen */}
          <Link
            to={PATHS.HOME}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand"
            aria-label="Go back to home"
          >
            <IconArrowLeft className="w-6 h-6 text-slate-700" stroke={2} />
          </Link>
          <h1 className="text-xl font-semibold text-charcoal-500 flex-1">{t('updates')}</h1>

          {/* Search icon */}
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand" aria-label="Search">
            <IconSearch className="w-5 h-5 text-slate-700" stroke={2} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-cream-300">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 text-sm font-medium transition-colors duration-normal ease-out-brand ${
              activeTab === 'notifications'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-slate-500 hover:text-charcoal-500'
            }`}
          >
            {t('notificationsTab')}
          </button>
          <button
            onClick={() => setActiveTab('newsfeed')}
            className={`pb-3 text-sm font-medium transition-colors duration-normal ease-out-brand ${
              activeTab === 'newsfeed'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-slate-500 hover:text-charcoal-500'
            }`}
          >
            {t('newsFeedTab')}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pb-6">
        {activeTab === 'notifications' ? (
          <div className="px-4 py-6 space-y-6">
            {/* Render grouped notifications */}
            {dateGroups.map((dateGroup) => {
              const notifs = grouped[dateGroup] || []
              if (notifs.length === 0) return null

              // Translate the date group label
              const displayLabel = dateGroup === 'TODAY' ? t('today') : dateGroup === 'YESTERDAY' ? t('yesterday') : dateGroup

              return (
                <div key={dateGroup}>
                  {/* Date heading */}
                  <h2 className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wider">{displayLabel}</h2>

                  {/* Notification cards */}
                  <div className="space-y-3">
                    {notifs.map((notif) => (
                      <NotificationCard key={notif.id} notification={notif} />
                    ))}
                  </div>
                </div>
              )
            })}

            {/* View earlier link at bottom */}
            {mockNotifications.length > 0 && (
              <div className="pt-6 text-center">
                <Button
                  variant="link"
                  className="text-sm text-slate-400 hover:text-slate-600"
                >
                  {t('viewEarlier')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          // News Feed tab content
          <div className="py-6">
            <FeaturedStoryCard story={mockFeaturedStory} />
            <LatestNewsSection articles={mockNewsArticles} />
          </div>
        )}
      </div>
    </Page>
  )
}

export default UpdatesScreen

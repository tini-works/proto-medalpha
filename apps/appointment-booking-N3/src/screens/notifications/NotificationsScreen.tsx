import { Link } from 'react-router-dom'
import { Page } from '../../components'
import { PATHS } from '../../routes'
import NotificationCard from '../../components/notifications/NotificationCard'
import { ShortGuidesSection, FeaturedStoryCard, LatestNewsSection } from '../../components/newsfeed'
import { mockNotifications, groupNotificationsByDate } from '../../data/notifications'
import { mockShortGuides, mockFeaturedStory, mockNewsArticles } from '../../data/newsfeed'
import { useState } from 'react'

function UpdatesScreen() {
  const [activeTab, setActiveTab] = useState<'notifications' | 'newsfeed'>('notifications')

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
            <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-charcoal-500 flex-1">Updates</h1>
          
          {/* Search icon */}
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-cream-100 transition-colors duration-normal ease-out-brand" aria-label="Search">
            <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
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
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('newsfeed')}
            className={`pb-3 text-sm font-medium transition-colors duration-normal ease-out-brand ${
              activeTab === 'newsfeed'
                ? 'text-teal-700 border-b-2 border-teal-700'
                : 'text-slate-500 hover:text-charcoal-500'
            }`}
          >
            News Feed
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

              return (
                <div key={dateGroup}>
                  {/* Date heading */}
                  <h2 className="text-xs text-slate-400 uppercase font-semibold mb-3 tracking-wider">{dateGroup}</h2>

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
                <button className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-normal ease-out-brand">
                  View Earlier Notifications
                </button>
              </div>
            )}
          </div>
        ) : (
          // News Feed tab content
          <div className="py-6">
            <ShortGuidesSection guides={mockShortGuides} />
            <FeaturedStoryCard story={mockFeaturedStory} />
            <LatestNewsSection articles={mockNewsArticles} />
          </div>
        )}
      </div>
    </Page>
  )
}

export default UpdatesScreen

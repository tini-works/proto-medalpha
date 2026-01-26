import { Header, Page } from '../../components'

/**
 * Help Centre screen with categorized help topics.
 * Placeholder content for prototype demonstration.
 */

interface HelpTopic {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of using DocliQ',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    id: 'appointments',
    title: 'Appointments',
    description: 'Booking, rescheduling, and cancellations',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 'account',
    title: 'Account & Profile',
    description: 'Manage your account settings',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: 'family',
    title: 'Family Members',
    description: 'Adding and managing family accounts',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    description: 'Data protection and security features',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    ),
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    icon: (
      <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function HelpCentreScreen() {
  return (
    <Page safeBottom={false}>
      <Header title="Help Centre" showBack />

      <div className="px-4 py-6 space-y-6">
        <p className="text-sm text-slate-500">Browse guides and tutorials to get the most out of DocliQ.</p>

        {/* Help topics grid */}
        <div className="grid grid-cols-2 gap-3">
          {HELP_TOPICS.map((topic) => (
            <button
              key={topic.id}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-cream-400 hover:bg-cream-100 transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">{topic.icon}</div>
              <p className="font-medium text-charcoal-500 text-sm">{topic.title}</p>
              <p className="text-xs text-slate-500 mt-1">{topic.description}</p>
            </button>
          ))}
        </div>

        {/* Video tutorials section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">Video Tutorials</h3>
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="aspect-video bg-cream-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-teal-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">Video tutorials coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

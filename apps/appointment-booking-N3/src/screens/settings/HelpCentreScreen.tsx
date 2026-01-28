import { useTranslation } from 'react-i18next'
import {
  Zap,
  Calendar,
  User,
  Users,
  Lock,
  Settings,
  PlayerPlay,
} from '@tabler/icons-react'
import { Header, Page } from '../../components'

/**
 * Help Centre screen with categorized help topics.
 * Topic titles and descriptions are loaded from i18n settings namespace.
 */

interface HelpTopic {
  id: string
  titleKey: string
  descKey: string
  icon: React.ReactNode
}

export default function HelpCentreScreen() {
  const { t } = useTranslation('settings')

  const HELP_TOPICS: HelpTopic[] = [
    {
      id: 'getting-started',
      titleKey: 'helpTopic_gettingStarted',
      descKey: 'helpTopic_gettingStarted_desc',
      icon: <Zap size={20} className="text-teal-600" />,
    },
    {
      id: 'appointments',
      titleKey: 'helpTopic_appointments',
      descKey: 'helpTopic_appointments_desc',
      icon: <Calendar size={20} className="text-teal-600" />,
    },
    {
      id: 'account',
      titleKey: 'helpTopic_account',
      descKey: 'helpTopic_account_desc',
      icon: <User size={20} className="text-teal-600" />,
    },
    {
      id: 'family',
      titleKey: 'helpTopic_family',
      descKey: 'helpTopic_family_desc',
      icon: <Users size={20} className="text-teal-600" />,
    },
    {
      id: 'privacy',
      titleKey: 'helpTopic_privacy',
      descKey: 'helpTopic_privacy_desc',
      icon: <Lock size={20} className="text-teal-600" />,
    },
    {
      id: 'troubleshooting',
      titleKey: 'helpTopic_troubleshooting',
      descKey: 'helpTopic_troubleshooting_desc',
      icon: <Settings size={20} className="text-teal-600" />,
    },
  ]

  return (
    <Page safeBottom={false}>
      <Header title={t('helpCentre')} showBack />

      <div className="px-4 py-6 space-y-6">
        <p className="text-sm text-slate-500">{t('browseGuidesAndTutorials')}</p>

        {/* Help topics grid */}
        <div className="grid grid-cols-2 gap-3">
          {HELP_TOPICS.map((topic) => (
            <button
              key={topic.id}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-cream-400 hover:bg-cream-100 transition-colors text-center"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">{topic.icon}</div>
              <p className="font-medium text-charcoal-500 text-sm">{t(topic.titleKey)}</p>
              <p className="text-xs text-slate-500 mt-1">{t(topic.descKey)}</p>
            </button>
          ))}
        </div>

        {/* Video tutorials section */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">{t('videoTutorials')}</h3>
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <div className="aspect-video bg-cream-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
                  <PlayerPlay size={32} className="text-teal-600 ml-1" fill="currentColor" />
                </div>
                <p className="text-sm text-slate-500">{t('videoTutorialsComingSoon')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

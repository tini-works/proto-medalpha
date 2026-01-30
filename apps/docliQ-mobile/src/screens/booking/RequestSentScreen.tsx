import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCheck } from '@tabler/icons-react'
import { Page } from '../../components'
import { PATHS } from '../../routes'

export default function RequestSentScreen() {
  const { t } = useTranslation('booking')

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col px-6 py-10">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Success icon */}
          <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg animate-bounce-in">
            <IconCheck size={40} stroke={3} className="text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-charcoal-500 mb-3">
            {t('requestSentTitle')}
          </h1>
          <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
            {t('requestSentSubtitle')}
          </p>
        </div>
      </div>

      {/* Fixed bottom buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-6 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <Link to={PATHS.HISTORY} className="btn btn-primary btn-block text-center block">
            {t('viewMyAppointments')}
          </Link>
          <Link to={PATHS.HOME} className="btn btn-tertiary btn-block text-center block">
            {t('backToHome')}
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </Page>
  )
}

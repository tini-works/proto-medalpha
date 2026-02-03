import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCheck } from '@tabler/icons-react'
import { Page, ProgressIndicator, StickyActionBar } from '../../components'
import { PATHS } from '../../routes'
import { useBooking } from '../../state'
import { resolveBookingProgress } from './bookingProgress'

export default function RequestSentScreen() {
  const { t } = useTranslation('booking')
  const { bookingFlow, fastLaneRequest, specialtyMatchRequest } = useBooking()

  const inferredFlow =
    bookingFlow ??
    (fastLaneRequest ? 'fast_lane' : specialtyMatchRequest ? (specialtyMatchRequest.doctorId ? 'by_doctor' : 'by_specialty') : null)
  const progress = resolveBookingProgress({
    bookingFlow: inferredFlow,
    fallbackFlow: 'by_specialty',
    currentStep: 999,
  })

  return (
    <Page safeBottom={false}>
      <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">{t(progress.stepLabelKey)}</span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator
          currentStep={progress.currentStep}
          totalSteps={progress.totalSteps}
          variant="bar"
          showLabel={false}
          showPercentage={false}
        />
      </div>

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
      <StickyActionBar containerClassName="px-6">
        <div className="space-y-3">
          <Link to={PATHS.HISTORY} className="btn btn-primary btn-block text-center block">
            {t('viewMyAppointments')}
          </Link>
          <Link to={PATHS.HOME} className="btn btn-tertiary btn-block text-center block">
            {t('backToHome')}
          </Link>
        </div>
      </StickyActionBar>

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

import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMoodSad, IconRefresh, IconExchange, IconList } from '@tabler/icons-react'
import { Page } from '../../../components'
import { useBooking } from '../../../state'
import { PATHS } from '../../../routes'

export default function NoMatchScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { fastLaneRequest, clearFastLaneRequest } = useBooking()

  const handleSearchAgain = () => {
    navigate(PATHS.FAST_LANE)
  }

  const handleTryDifferentSpecialty = () => {
    clearFastLaneRequest()
    navigate(PATHS.BOOKING_SPECIALTY)
  }

  const handleBrowseDoctors = () => {
    clearFastLaneRequest()
    navigate(PATHS.BOOKING_SPECIALTY)
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col px-6 py-10">
        {/* Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mb-6">
            <IconMoodSad size={40} stroke={1.5} className="text-slate-400" />
          </div>

          <h1 className="text-xl font-semibold text-charcoal-500 mb-2">
            {t('noDoctorsAvailable')}
          </h1>
          <p className="text-sm text-slate-500 max-w-xs">
            {t('noMatchMessage')}
          </p>

          {/* Request summary */}
          {fastLaneRequest && (
            <div className="mt-6 bg-cream-100 rounded-xl p-4 w-full max-w-sm">
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                {t('yourRequest')}
              </p>
              <p className="text-sm text-charcoal-500">
                {fastLaneRequest.specialty} • {fastLaneRequest.city} • {fastLaneRequest.insuranceType}
              </p>
            </div>
          )}

          {/* Option cards */}
          <div className="mt-8 w-full max-w-sm space-y-3">
            <OptionCard
              icon={<IconRefresh size={24} stroke={2} />}
              title={t('searchAgain')}
              subtitle={t('searchAgainDesc')}
              onClick={handleSearchAgain}
            />
            <OptionCard
              icon={<IconExchange size={24} stroke={2} />}
              title={t('tryDifferentSpecialty')}
              subtitle={t('tryDifferentSpecialtyDesc')}
              onClick={handleTryDifferentSpecialty}
            />
            <OptionCard
              icon={<IconList size={24} stroke={2} />}
              title={t('browseDoctors')}
              subtitle={t('browseDoctorsDesc')}
              onClick={handleBrowseDoctors}
            />
          </div>
        </div>

        {/* Back to home link */}
        <div className="py-4 safe-area-bottom">
          <Link
            to={PATHS.HOME}
            className="btn btn-tertiary btn-block text-center block"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </Page>
  )
}

function OptionCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-cream-400 rounded-xl p-4 text-left hover:border-teal-400 hover:shadow-md transition-all active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center text-teal-600">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-charcoal-500">{title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </button>
  )
}

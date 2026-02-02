import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconBolt, IconStethoscope, IconUserSearch, IconChevronRight } from '@tabler/icons-react'
import { Header, Page, TabBar } from '../../components'
import { ConfirmModal } from '../../components/ui'
import { useBooking, useAuth } from '../../state'
import { PATHS } from '../../routes'

interface BookingTypeOption {
  id: 'fast_lane' | 'by_specialty' | 'by_doctor'
  icon: React.ReactNode
  titleKey: string
  subtitleKey: string
  badge?: string
  path: string
  disabled?: boolean
}

const bookingTypes: BookingTypeOption[] = [
  {
    id: 'fast_lane',
    icon: <IconBolt className="w-6 h-6" stroke={2} />,
    titleKey: 'fastLane',
    subtitleKey: 'fastLaneDesc',
    badge: 'quickest',
    path: PATHS.FAST_LANE,
  },
  {
    id: 'by_specialty',
    icon: <IconStethoscope className="w-6 h-6" stroke={2} />,
    titleKey: 'bookBySpecialty',
    subtitleKey: 'bookBySpecialtyDesc',
    path: PATHS.BOOKING_SPECIALTY,
  },
  {
    id: 'by_doctor',
    icon: <IconUserSearch className="w-6 h-6" stroke={2} />,
    titleKey: 'bookByDoctor',
    subtitleKey: 'bookByDoctorDesc',
    path: PATHS.BOOKING_RESULTS,
  },
]

export default function BookingTypeScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { setBookingFlow, resetBooking } = useBooking()
  const { isIdentityVerified } = useAuth()
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [pendingOption, setPendingOption] = useState<BookingTypeOption | null>(null)

  const handleSelect = (option: BookingTypeOption) => {
    if (option.disabled) return

    // Check if user is verified - if not, show modal
    if (!isIdentityVerified) {
      setPendingOption(option)
      setShowVerificationModal(true)
      return
    }

    // Reset any previous booking state and set the new flow
    resetBooking()
    setBookingFlow(option.id)
    navigate(option.path)
  }

  const handleVerify = () => {
    setShowVerificationModal(false)
    navigate(PATHS.ONBOARDING_VERIFY)
  }

  return (
    <Page>
      <Header title={t('bookAppointment')} />

      <div className="px-4 py-6 space-y-4">
        <p className="text-sm text-slate-600 mb-2">{t('howWouldYouLikeToBook')}</p>

        {bookingTypes.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            disabled={option.disabled}
            className={`w-full bg-white border rounded-2xl p-4 text-left transition-all duration-200 ${
              option.disabled
                ? 'border-cream-300 opacity-50 cursor-not-allowed'
                : 'border-cream-400 hover:border-teal-400 hover:shadow-md active:scale-[0.98]'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  option.id === 'fast_lane'
                    ? 'bg-amber-100 text-amber-600'
                    : option.id === 'by_specialty'
                      ? 'bg-teal-100 text-teal-600'
                      : 'bg-purple-100 text-purple-600'
                }`}
              >
                {option.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-charcoal-500">{t(option.titleKey)}</h3>
                  {option.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide bg-amber-100 text-amber-700 rounded-full">
                      {t(option.badge)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">{t(option.subtitleKey)}</p>
                {option.disabled && (
                  <p className="text-xs text-slate-400 mt-2 italic">{t('comingSoon')}</p>
                )}
              </div>

              <IconChevronRight
                className={`w-5 h-5 flex-shrink-0 ${option.disabled ? 'text-slate-300' : 'text-slate-400'}`}
                stroke={2}
              />
            </div>
          </button>
        ))}
      </div>

      <TabBar />

      {/* Verification Required Modal */}
      <ConfirmModal
        open={showVerificationModal}
        title={t('verificationRequired.title')}
        message={t('verificationRequired.message')}
        confirmLabel={t('verificationRequired.verify')}
        cancelLabel={t('verificationRequired.cancel')}
        onConfirm={handleVerify}
        onCancel={() => setShowVerificationModal(false)}
      />
    </Page>
  )
}

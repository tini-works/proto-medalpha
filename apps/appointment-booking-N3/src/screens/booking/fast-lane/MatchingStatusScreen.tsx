import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconX } from '@tabler/icons-react'
import { Page } from '../../../components'
import { useBooking, useAppState } from '../../../state'
import { PATHS } from '../../../routes'
import { apiFastLaneMatch } from '../../../data/api'

type MatchingStatus = 'searching' | 'found_doctors' | 'checking_availability' | 'awaiting_confirmation'

export default function MatchingStatusScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { fastLaneRequest, clearFastLaneRequest } = useBooking()
  const { addAppointment } = useAppState()

  const [status, setStatus] = useState<MatchingStatus>('searching')
  const [doctorCount, setDoctorCount] = useState(0)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    if (!fastLaneRequest) {
      navigate(PATHS.FAST_LANE)
      return
    }

    const runMatching = async () => {
      try {
        const result = await apiFastLaneMatch(
          fastLaneRequest,
          (newStatus, count) => {
            if (cancelled) return
            setStatus(newStatus)
            if (count !== undefined) setDoctorCount(count)
          }
        )

        if (cancelled) return

        if (result.success && result.appointment) {
          addAppointment(result.appointment)
          navigate(PATHS.FAST_LANE_SUCCESS, {
            state: { appointment: result.appointment },
            replace: true,
          })
        } else {
          navigate(PATHS.FAST_LANE_NO_MATCH, { replace: true })
        }
      } catch (error) {
        if (!cancelled) {
          navigate(PATHS.FAST_LANE_NO_MATCH, { replace: true })
        }
      }
    }

    runMatching()

    return () => {
      setCancelled(true)
    }
  }, [fastLaneRequest, navigate, addAppointment, cancelled])

  const handleCancel = () => {
    setCancelled(true)
    clearFastLaneRequest()
    navigate(PATHS.HOME)
  }

  const handleViewAppointments = () => {
    navigate(PATHS.HISTORY)
  }

  const statusMessages: Record<MatchingStatus, string> = {
    searching: t('matchingSearching'),
    found_doctors: t('matchingFoundDoctors', { count: doctorCount }),
    checking_availability: t('matchingCheckingAvailability'),
    awaiting_confirmation: t('matchingAwaitingConfirmation'),
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header without back button */}
        <div className="px-4 py-4 border-b border-cream-200">
          <h1 className="text-lg font-semibold text-charcoal-500 text-center">
            {t('findingYourAppointment')}
          </h1>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Animated pulse/radar graphic */}
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 rounded-full bg-teal-100 animate-ping opacity-25" />
            <div className="absolute inset-4 rounded-full bg-teal-200 animate-ping opacity-40 animation-delay-300" />
            <div className="absolute inset-8 rounded-full bg-teal-300 animate-ping opacity-50 animation-delay-600" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Status message */}
          <p className="text-lg font-medium text-charcoal-500 text-center mb-2">
            {statusMessages[status]}
          </p>
          <p className="text-sm text-slate-500 text-center">
            {t('matchingPleaseWait')}
          </p>

          {/* Request summary card */}
          {fastLaneRequest && (
            <div className="mt-8 bg-cream-100 rounded-xl p-4 w-full max-w-sm">
              <p className="text-sm text-slate-600 text-center">
                {fastLaneRequest.specialty} • {fastLaneRequest.city} • {fastLaneRequest.insuranceType}
              </p>
              <p className="text-xs text-slate-500 text-center mt-1">
                {t('for')}: {fastLaneRequest.patientName}
              </p>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="px-4 py-6 space-y-3 safe-area-bottom">
          <button
            onClick={handleCancel}
            className="btn btn-secondary btn-block flex items-center justify-center gap-2"
          >
            <IconX size={20} stroke={2} />
            {t('cancelSearch')}
          </button>
          <button
            onClick={handleViewAppointments}
            className="btn btn-tertiary btn-block"
          >
            {t('viewAllAppointments')}
          </button>
        </div>
      </div>

      <style>{`
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </Page>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconX } from '@tabler/icons-react'
import { Page, Avatar } from '../../../components'
import { useBooking, useAppState } from '../../../state'
import { PATHS } from '../../../routes'
import { apiFastLaneMatch, apiSpecialtyMatch } from '../../../data/api'

type MatchingStatus = 'searching' | 'found_doctors' | 'checking_availability' | 'awaiting_confirmation'

export default function MatchingStatusScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { fastLaneRequest, clearFastLaneRequest, specialtyMatchRequest, clearSpecialtyMatchRequest } = useBooking()
  const { addAppointment } = useAppState()

  const [status, setStatus] = useState<MatchingStatus>('searching')
  const [doctorCount, setDoctorCount] = useState(0)
  const [cancelled, setCancelled] = useState(false)

  // Determine which flow we're in
  const isSpecialtyFlow = Boolean(specialtyMatchRequest)
  const currentRequest = specialtyMatchRequest || fastLaneRequest

  useEffect(() => {
    if (!currentRequest) {
      navigate(isSpecialtyFlow ? PATHS.BOOKING_RESULTS : PATHS.FAST_LANE)
      return
    }

    const runMatching = async () => {
      try {
        let result

        if (isSpecialtyFlow && specialtyMatchRequest) {
          // Use specialty match API
          result = await apiSpecialtyMatch(
            specialtyMatchRequest,
            (newStatus, count) => {
              if (cancelled) return
              setStatus(newStatus)
              if (count !== undefined) setDoctorCount(count)
            }
          )
        } else if (fastLaneRequest) {
          // Use fast-lane match API
          result = await apiFastLaneMatch(
            fastLaneRequest,
            (newStatus, count) => {
              if (cancelled) return
              setStatus(newStatus)
              if (count !== undefined) setDoctorCount(count)
            }
          )
        } else {
          throw new Error('No request found')
        }

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
  }, [currentRequest, isSpecialtyFlow, specialtyMatchRequest, fastLaneRequest, navigate, addAppointment, cancelled])

  const handleCancel = () => {
    setCancelled(true)
    if (isSpecialtyFlow) {
      clearSpecialtyMatchRequest()
    } else {
      clearFastLaneRequest()
    }
    navigate(PATHS.HOME)
  }

  const handleViewAppointments = () => {
    navigate(PATHS.HISTORY)
  }

  // Different status messages for specialty flow vs fast-lane
  const getStatusMessage = () => {
    if (isSpecialtyFlow && specialtyMatchRequest) {
      switch (status) {
        case 'searching':
          return t('matchingCheckingWithDoctor', { name: specialtyMatchRequest.doctorName })
        case 'checking_availability':
          return t('matchingCheckingAvailabilityWith', { name: specialtyMatchRequest.doctorName })
        case 'awaiting_confirmation':
          return t('matchingAwaitingDoctorConfirmation', { name: specialtyMatchRequest.doctorName })
        default:
          return t('matchingSearching')
      }
    }

    const statusMessages: Record<MatchingStatus, string> = {
      searching: t('matchingSearching'),
      found_doctors: t('matchingFoundDoctors', { count: doctorCount }),
      checking_availability: t('matchingCheckingAvailability'),
      awaiting_confirmation: t('matchingAwaitingConfirmation'),
    }
    return statusMessages[status]
  }

  return (
    <Page safeBottom={false}>
      <div className="min-h-screen flex flex-col">
        {/* Header without back button */}
        <div className="px-4 py-4 border-b border-cream-200">
          <h1 className="text-lg font-semibold text-charcoal-500 text-center">
            {isSpecialtyFlow ? t('confirmingWithDoctor') : t('findingYourAppointment')}
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
            {getStatusMessage()}
          </p>
          <p className="text-sm text-slate-500 text-center">
            {t('matchingPleaseWait')}
          </p>

          {/* Request summary card - specialty flow */}
          {isSpecialtyFlow && specialtyMatchRequest && (
            <div className="mt-8 bg-cream-100 rounded-xl p-4 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={specialtyMatchRequest.doctorName} size="md" />
                <div>
                  <p className="font-medium text-charcoal-500">{specialtyMatchRequest.doctorName}</p>
                  <p className="text-sm text-slate-500">{specialtyMatchRequest.specialty}</p>
                </div>
              </div>
              <div className="text-sm text-slate-600 text-center border-t border-cream-300 pt-3">
                {specialtyMatchRequest.city} • {specialtyMatchRequest.insuranceType}
              </div>
              <p className="text-xs text-slate-500 text-center mt-1">
                {t('for')}: {specialtyMatchRequest.patientName}
              </p>
            </div>
          )}

          {/* Request summary card - fast-lane flow */}
          {!isSpecialtyFlow && fastLaneRequest && (
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

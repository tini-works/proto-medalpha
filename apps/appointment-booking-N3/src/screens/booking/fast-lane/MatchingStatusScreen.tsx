import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconSearch, IconX } from '@tabler/icons-react'
import { Header, Page } from '../../../components'
import { useBooking, useAppState } from '../../../state'
import { PATHS } from '../../../routes'
import { apiFastLaneMatch, apiSpecialtyMatch } from '../../../data/api'

type MatchingStatus = 'searching' | 'found_doctors' | 'checking_availability' | 'awaiting_confirmation'

function statusStepIndex(status: MatchingStatus): number {
  switch (status) {
    case 'searching':
      return 0
    case 'found_doctors':
      return 1
    case 'checking_availability':
      return 2
    case 'awaiting_confirmation':
      return 3
    default:
      return 0
  }
}

export default function MatchingStatusScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { fastLaneRequest, clearFastLaneRequest, specialtyMatchRequest, clearSpecialtyMatchRequest } = useBooking()
  const { addAppointment } = useAppState()

  const [status, setStatus] = useState<MatchingStatus>('searching')
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
            (newStatus) => {
              if (cancelled) return
              setStatus(newStatus)
            }
          )
        } else if (fastLaneRequest) {
          // Use fast-lane match API
          result = await apiFastLaneMatch(
            fastLaneRequest,
            (newStatus) => {
              if (cancelled) return
              setStatus(newStatus)
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

  const activeStep = statusStepIndex(status)
  const steps = [
    { label: t('matchingStepReviewRequest') },
    { label: t('matchingStepSearchDoctors') },
    { label: t('matchingStepCheckAvailability') },
    { label: t('matchingStepConfirm') },
  ]

  return (
    <Page safeBottom={false} className="pb-32">
      <Header title={isSpecialtyFlow ? t('confirmingWithDoctor') : t('findingYourAppointment')} />

      <div className="px-6 py-10 flex flex-col items-center">
        <div className="w-28 h-28 rounded-full bg-teal-100 flex items-center justify-center mb-7">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center animate-pulse">
            <IconSearch className="w-8 h-8 text-white" stroke={2} />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-charcoal-500 mb-2 text-center">
          {t('findingYourAppointment')}
        </h1>
        <p className="text-slate-600 text-center mb-8 max-w-sm">
          {t('findingMatchDescription')}
        </p>

        <div className="w-full max-w-sm space-y-4">
          {steps.map((step, idx) => {
            const done = idx < activeStep
            const active = idx === activeStep
            return (
              <div key={idx} className="flex items-center gap-3">
                {done ? (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : active ? (
                  <div className="w-6 h-6 rounded-full border-2 border-teal-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-cream-400 flex-shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    done ? 'text-green-700' : active ? 'text-charcoal-500' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-sm text-slate-500 text-center mt-6">{t('matchingPleaseWait')}</p>

        {/* Request summary */}
        {isSpecialtyFlow && specialtyMatchRequest && (
          <div className="mt-8 bg-cream-100 rounded-xl p-4 w-full max-w-sm">
            <p className="text-sm text-slate-600 text-center">
              {specialtyMatchRequest.doctorName} • {specialtyMatchRequest.specialty}
            </p>
            <div className="text-sm text-slate-600 text-center mt-2">
              {specialtyMatchRequest.city} • {specialtyMatchRequest.insuranceType}
            </div>
            <p className="text-xs text-slate-500 text-center mt-1">
              {t('for')}: {specialtyMatchRequest.patientName}
            </p>
          </div>
        )}

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

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <button
            onClick={handleCancel}
            className="btn btn-secondary btn-block flex items-center justify-center gap-2"
          >
            <IconX size={20} stroke={2} />
            {t('cancelSearch')}
          </button>
          <button onClick={handleViewAppointments} className="btn btn-tertiary btn-block">
            {t('viewAllAppointments')}
          </button>
        </div>
      </div>
    </Page>
  )
}

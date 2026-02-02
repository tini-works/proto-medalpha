import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page } from '../../../components'
import { useBooking, useAppState } from '../../../state'
import { PATHS, appointmentDetailPath } from '../../../routes'
import { apiFastLaneMatch, apiSpecialtyMatch } from '../../../data/api'
import { MatchingStatusView } from '../../../components/appointments/MatchingStatusView'
import { addRecentSpecialty } from '../../../data/recentSpecialties'

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
          addRecentSpecialty(result.appointment.specialty)
          // Standardize confirmed view: go to canonical Appointment Details screen
          navigate(appointmentDetailPath(result.appointment.id), { replace: true })
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
    { label: t('matchingStepReviewRequest'), done: activeStep > 0, active: activeStep === 0 },
    { label: t('matchingStepSearchDoctors'), done: activeStep > 1, active: activeStep === 1 },
    { label: t('matchingStepCheckAvailability'), done: activeStep > 2, active: activeStep === 2 },
    { label: t('matchingStepConfirm'), done: false, active: activeStep === 3 },
  ]

  return (
    <Page className="flex flex-col" safeBottom={false}>
      <BackHeader />

      <MatchingStatusView
        title={`${isSpecialtyFlow ? t('confirmingWithDoctor') : t('findingYourAppointment')}…`}
        description={t('findingMatchDescription')}
        steps={steps}
        connectionTitle={t('matchingConnectionFixingTitle')}
        connectionSubtitle={t('matchingConnectionFixingSubtitle')}
        footerNote={<p className="text-sm text-slate-500">{t('matchingPleaseWait')}</p>}
        primaryActionLabel={t('cancelRequest')}
        onPrimaryAction={handleCancel}
        secondaryActionLabel={t('viewAllAppointments')}
        onSecondaryAction={handleViewAppointments}
      />
    </Page>
  )
}

function BackHeader() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 h-16 bg-white px-4 flex items-center">
      <button
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-cream-100 transition-colors"
        aria-label="Go back"
      >
        <svg className="w-6 h-6 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </header>
  )
}

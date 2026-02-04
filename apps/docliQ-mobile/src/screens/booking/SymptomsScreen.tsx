import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header, Page, ProgressIndicator, ReasonTextarea, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'
import { resolveBookingProgress } from './bookingProgress'

export default function SymptomsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { selectedDoctor, setSymptomInfo, bookingFlow } = useBooking()

  const [additionalNotes, setAdditionalNotes] = useState('')

  // Redirect if no doctor selected
  useEffect(() => {
    if (!selectedDoctor) {
      navigate(PATHS.BOOKING_RESULTS)
    }
  }, [selectedDoctor, navigate])

  if (!selectedDoctor) {
    return null
  }

  // Some specialties may return more than 4 symptoms; we only show 4 chips
  const handleBack = () => {
    navigate(PATHS.BOOKING_RESULTS)
  }

  const handleContinue = () => {
    setSymptomInfo({
      symptoms: [],
      additionalNotes: additionalNotes.trim(),
    })
    navigate(PATHS.BOOKING_AVAILABILITY)
  }

  // At least 1 symptom OR text required
  const canContinue = additionalNotes.trim().length > 0

  return (
    <Page safeBottom={false}>
      <Header title={t('describeSymptoms')} showBack onBack={handleBack} />

      {/* Progress indicator - Step 3 of 5 (after Booking Type) */}
      <div className="px-4 py-4 space-y-3 bg-white border-b border-cream-300">
        {(() => {
          const progress = resolveBookingProgress({ bookingFlow, fallbackFlow: 'by_doctor', currentStep: 3 })
          return (
            <>
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
            </>
          )
        })()}
      </div>

      <div className="px-4 pb-28 space-y-6">
        {/* Doctor info banner */}
        <div className="bg-cream-100 rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            {selectedDoctor.imageUrl ? (
              <img
                src={selectedDoctor.imageUrl}
                alt={selectedDoctor.name}
                className="w-12 h-12 object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-teal-100 flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-lg">
                  {selectedDoctor.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-charcoal-500 truncate">{selectedDoctor.name}</p>
            <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
          </div>
        </div>

        <section>
          <p className="text-sm text-slate-500">
            {t('fastLaneSymptomInstruction')}
          </p>
        </section>

        {/* Additional notes - always visible */}
        <section>
          <ReasonTextarea
            value={additionalNotes}
            onChange={setAdditionalNotes}
            label={t('additionalDetails')}
            placeholder={t('additionalDetailsPlaceholder')}
            maxLength={500}
          />
          <p className="text-xs text-slate-400 mt-2">
            {t('symptomRequirement')}
          </p>
        </section>
      </div>

      {/* Sticky Footer */}
      <StickyActionBar>
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          variant="primary"
          fullWidth
          size="lg"
        >
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}

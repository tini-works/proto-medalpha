import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconCheck, IconArrowRight } from '@tabler/icons-react'
import { Header, Page, ProgressIndicator, ReasonTextarea } from '../../components'
import { Button } from '../../components/ui'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'
import { getSymptomsForSpecialty } from '../../data/symptoms'

export default function SymptomsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { selectedDoctor, setSymptomInfo } = useBooking()

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
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

  // Get symptoms filtered by doctor's specialty
  const relevantSymptoms = getSymptomsForSpecialty(selectedDoctor.specialty)

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const handleBack = () => {
    navigate(PATHS.BOOKING_RESULTS)
  }

  const handleContinue = () => {
    setSymptomInfo({
      symptoms: selectedSymptoms,
      additionalNotes: additionalNotes.trim(),
    })
    navigate(PATHS.BOOKING_AVAILABILITY)
  }

  // At least 1 symptom OR text required
  const canContinue = selectedSymptoms.length > 0 || additionalNotes.trim().length > 0

  return (
    <Page safeBottom={false}>
      <Header title={t('describeSymptoms')} showBack onBack={handleBack} />

      {/* Progress indicator - Step 2 of 4 */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-slate-600">
            {t('step2Of4')}
          </span>
          <span className="text-xs text-slate-500">{t('yourRequest')}</span>
        </div>
        <ProgressIndicator
          currentStep={2}
          totalSteps={4}
          variant="bar"
          showLabel={false}
          showPercentage={false}
        />
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

        {/* Symptoms selection */}
        <section>
          <h2 className="text-sm font-medium text-charcoal-500 mb-2">
            {t('whatBringsYouIn')}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            {t('selectAllThatApply')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {relevantSymptoms.map((symptom) => {
              const isSelected = selectedSymptoms.includes(symptom.id)
              return (
                <button
                  key={symptom.id}
                  onClick={() => toggleSymptom(symptom.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left flex items-center gap-2 ${
                    isSelected
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-white border border-cream-400 text-charcoal-500 hover:border-teal-400'
                  }`}
                >
                  {isSelected && <IconCheck size={16} stroke={2.5} className="flex-shrink-0" />}
                  <span className="flex-1">{t(symptom.labelKey)}</span>
                </button>
              )
            })}
          </div>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md">
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            variant="primary"
            fullWidth
            size="lg"
          >
            <span className="flex items-center justify-center gap-2">
              {t('continueBtn')}
              <IconArrowRight size={20} stroke={2} />
            </span>
          </Button>
        </div>
      </div>
    </Page>
  )
}

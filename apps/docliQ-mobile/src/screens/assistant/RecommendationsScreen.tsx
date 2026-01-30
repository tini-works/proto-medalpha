import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DoctorCard, Header, Page, Pill, ProgressIndicator } from '../../components'
import { doctors, getTimeSlots } from '../../data'
import { assistantDoctorPath, PATHS } from '../../routes'
import { useBooking } from '../../state'
import type { Doctor, TimeSlot } from '../../types'
import { IconInfoCircle } from '@tabler/icons-react'

export default function RecommendationsScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { search, selectDoctor, selectSlot } = useBooking()

  const recommendedDoctors = useMemo(() => doctors.slice(0, 3), [])
  const slotsByDoctor = useMemo(() => {
    return recommendedDoctors.reduce<Record<string, TimeSlot[]>>((acc, doctor) => {
      acc[doctor.id] = getTimeSlots(doctor.id)
      return acc
    }, {})
  }, [recommendedDoctors])

  const requestSummary =
    search?.specialty && search?.city
      ? t('assistant.requestSummary', { specialty: search.specialty, city: search.city })
      : t('assistant.requestSummaryDefault')

  const handleSelectDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(assistantDoctorPath(doctor.id))
  }

  const handleSelectSlot = (doctor: Doctor, slot: TimeSlot) => {
    selectDoctor(doctor)
    selectSlot(slot)
    navigate(PATHS.ASSISTANT_CONFIRM)
  }

  return (
    <Page>
      <Header title={t('assistant.recommendationsTitle')} showBack onBack={() => navigate(PATHS.ASSISTANT_VOICE)} />

      <div className="px-4 py-4 space-y-5">
        <div className="bg-white rounded-2xl border border-cream-400 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-slate-600">{t('assistant.step1Of3')}</span>
            <span className="text-xs text-slate-500">{t('assistant.voiceRequest')}</span>
          </div>
          <ProgressIndicator currentStep={1} totalSteps={3} variant="bar" showLabel={false} showPercentage={false} />
          <p className="text-sm text-charcoal-500">{requestSummary}</p>
          <div className="flex flex-wrap gap-2">
            <Pill tone="info">{t('assistant.pills.locationRadius')}</Pill>
            <Pill tone="neutral">{t('assistant.pills.publicInsurance')}</Pill>
            <Pill tone="neutral">{t('assistant.pills.thisWeek')}</Pill>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-charcoal-500">{t('assistant.topMatches')}</h2>
          <span className="text-xs text-slate-500">{t('assistant.resultsCount', { count: recommendedDoctors.length })}</span>
        </div>

        <div className="space-y-3">
          {recommendedDoctors.map((doctor, index) => (
            <div key={doctor.id} className="relative">
              {index === 0 && (
                <span className="absolute -top-2 left-4 z-10 px-2 py-1 rounded-full bg-charcoal-500 text-white text-[10px] font-semibold tracking-wide">
                  {t('assistant.topMatch')}
                </span>
              )}
              <DoctorCard
                doctor={doctor}
                slots={slotsByDoctor[doctor.id] || []}
                onSelectDoctor={() => handleSelectDoctor(doctor)}
                onSelectSlot={(slot) => handleSelectSlot(doctor, slot)}
              />
            </div>
          ))}
        </div>

        <div className="bg-cream-50 border border-cream-300 rounded-xl p-3 text-xs text-slate-600 flex items-start gap-2">
          <IconInfoCircle className="w-4 h-4 text-teal-600 mt-0.5" />
          <p>{t('assistant.recommendationsHint')}</p>
        </div>
      </div>
    </Page>
  )
}

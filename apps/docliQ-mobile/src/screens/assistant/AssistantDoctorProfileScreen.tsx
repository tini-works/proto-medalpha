import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar, Header, Page, Pill, Rating, StickyActionBar } from '../../components'
import { Button } from '../../components/ui'
import { apiGetDoctor, getTimeSlots } from '../../data'
import { PATHS } from '../../routes'
import { useBooking } from '../../state'
import type { Doctor, TimeSlot } from '../../types'
import { TimeSlotButton } from '../../components/forms/TimeSlotButton'

function getSlotLabel(slot: TimeSlot, opts: { t: (key: string, options?: any) => string; language: string }) {
  const today = new Date()
  const slotDate = new Date(slot.dateISO)
  const diffDays = Math.ceil((slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return opts.t('today')
  if (diffDays === 1) return opts.t('tomorrow')
  return slotDate.toLocaleDateString(opts.language === 'de' ? 'de-DE' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function AssistantDoctorProfileScreen() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation('booking')
  const { selectedDoctor, selectDoctor, selectSlot } = useBooking()
  const [doctor, setDoctor] = useState<Doctor | null>(selectedDoctor)
  const [loading, setLoading] = useState(!selectedDoctor)
  const [pickedSlot, setPickedSlot] = useState<TimeSlot | null>(null)

  useEffect(() => {
    if (selectedDoctor?.id === id) {
      setDoctor(selectedDoctor)
      return
    }

    if (id) {
      setLoading(true)
      apiGetDoctor(id)
        .then((d) => {
          setDoctor(d)
          selectDoctor(d)
        })
        .catch(() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS))
        .finally(() => setLoading(false))
    }
  }, [id, selectedDoctor, selectDoctor, navigate])

  const slots = useMemo(() => {
    if (!doctor) return []
    return getTimeSlots(doctor.id).filter((slot) => slot.available).slice(0, 9)
  }, [doctor])

  if (loading || !doctor) {
    return (
      <Page safeBottom={false}>
        <Header title={t('doctorProfile')} showBack onBack={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)} />
        <div className="p-4">
          <div className="h-48 bg-cream-200 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('doctorProfile')} showBack onBack={() => navigate(PATHS.ASSISTANT_RECOMMENDATIONS)} />

      <div className="px-4 py-4 space-y-6 pb-32">
        <div className="bg-white rounded-2xl border border-cream-400 p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-charcoal-500">{doctor.name}</h2>
              <p className="text-sm text-teal-600 font-medium">{doctor.specialty}</p>
              <div className="mt-2">
                <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {doctor.accepts.map((insurance) => (
              <Pill key={insurance} tone={insurance === 'GKV' ? 'info' : 'neutral'}>
                {insurance}
              </Pill>
            ))}
            {doctor.languages.slice(0, 2).map((lang) => (
              <Pill key={lang} tone="neutral">
                {lang}
              </Pill>
            ))}
          </div>

          <div className="mt-4 text-sm text-slate-600">
            {doctor.address}, {doctor.city}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-cream-400 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal-500">{t('assistant.availableSlots')}</h3>
            <span className="text-xs text-slate-500">{t('assistant.next3Days')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <TimeSlotButton
                key={`${slot.dateISO}-${slot.time}`}
                time={slot.time}
                subtitle={getSlotLabel(slot, { t, language: i18n.language })}
                selected={pickedSlot?.dateISO === slot.dateISO && pickedSlot?.time === slot.time}
                onClick={() => setPickedSlot(slot)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Sticky bottom button */}
      <StickyActionBar>
        <Button
          variant="primary"
          size="lg"
          disabled={!pickedSlot}
          fullWidth
          onClick={() => {
            if (!pickedSlot) return
            selectSlot(pickedSlot)
            navigate(PATHS.ASSISTANT_CONFIRM)
          }}
        >
          {t('continueBtn')}
        </Button>
      </StickyActionBar>
    </Page>
  )
}

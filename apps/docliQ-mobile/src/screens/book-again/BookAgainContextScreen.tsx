import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Page, Header, Avatar, Rating, PatientSelector } from '../../components'
import { Button } from '../../components/ui'
import { useBookAgain, useBooking, useHistory, useProfile } from '../../state'
import { getDoctorById } from '../../data'
import { formatDate } from '../../utils/format'
import { doctorSlotsPath, PATHS } from '../../routes/paths'
import type { Doctor } from '../../types'
import { IconAlertTriangle, IconEdit } from '@tabler/icons-react'

export default function BookAgainContextScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('booking')

  const { appointments } = useBooking()
  const { items: historyItems } = useHistory()
  const { profile } = useProfile()
  const { setBookAgainContext } = useBookAgain()

  const [isLoading, setIsLoading] = useState(true)
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [editSheet, setEditSheet] = useState<null | 'location' | 'insurance' | 'patient'>(null)
  const [locationDraft, setLocationDraft] = useState({
    city: profile.address.city || 'Berlin',
    postalCode: profile.address.postalCode || '10178',
  })
  const [insuranceDraft, setInsuranceDraft] = useState(
    profile.insuranceType === 'GKV'
      ? t('publicGkv')
      : profile.insuranceType === 'PKV'
      ? t('privatePkv')
      : t('selfPay')
  )
  const [patientDraft, setPatientDraft] = useState<'myself' | 'child'>('myself')

  // Find the source appointment/history item
  const appointment = appointments.find((apt) => apt.id === id)
  const historyItem = historyItems.find((item) => item.id === id)

  const sourceData = appointment || historyItem

  useEffect(() => {
    if (!sourceData) {
      setError(t('bookAgain.context.errors.notFound'))
      setIsLoading(false)
      return
    }

    const doctorId = appointment?.doctorId || 'd1' // Fallback to d1 for history items
    setIsLoading(true)
    const doctorData = getDoctorById(doctorId)
    if (!doctorData) {
      setError(t('bookAgain.context.errors.doctorUnavailable'))
      setIsLoading(false)
      return
    }

    setDoctor(doctorData)
    setBookAgainContext({
      sourceAppointmentId: sourceData.id,
      sourceDate: sourceData.dateISO,
      doctor: doctorData,
      location: {
        city: profile.address.city || 'Berlin',
        postalCode: profile.address.postalCode || '10178',
      },
      insurance: {
        type: profile.insuranceType as 'GKV' | 'PKV' | 'Selbstzahler' | '',
      },
      patient: {
        id: profile.id || 'self',
        name: profile.fullName || t('assistant.you'),
        relationship: 'self',
      },
    })
    setIsLoading(false)
  }, [
    sourceData?.id,
    sourceData?.dateISO,
    appointment?.doctorId,
    profile.address.city,
    profile.address.postalCode,
    profile.insuranceType,
    profile.fullName,
    profile.id,
    setBookAgainContext,
  ])

  const handleViewSlots = () => {
    if (doctor && sourceData) {
      navigate(doctorSlotsPath(doctor.id) + `?bookAgain=${sourceData.id}`)
    }
  }

  const computeTimingHint = (dateISO: string) => {
    const then = new Date(dateISO)
    const now = new Date()
    const days = Math.max(0, Math.round((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)))
    if (days < 30) return t('bookAgain.context.timingHints.recent')
    if (days < 180) return t('bookAgain.context.timingHints.months')
    return t('bookAgain.context.timingHints.long')
  }

  if (isLoading) {
    return (
      <Page>
        <Header title={t('bookAgain.context.title')} showBack />
        <div className="px-4 py-4 space-y-4">
          {/* Skeleton loading */}
          <div className="bg-cream-200 rounded-xl p-4 animate-pulse">
            <div className="h-4 w-40 bg-cream-300 rounded mb-2" />
            <div className="h-5 w-24 bg-cream-300 rounded" />
          </div>
          <div className="h-px bg-cream-300" />
          <div className="bg-white rounded-xl border border-cream-400 p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cream-300" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-cream-300 rounded" />
                <div className="h-4 w-24 bg-cream-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }

  if (error || !sourceData) {
    return (
      <Page>
        <Header title={t('bookAgain.context.title')} showBack />
        <div className="px-4 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-coral-50 flex items-center justify-center mx-auto mb-4">
            <IconAlertTriangle className="w-8 h-8 text-coral-700" />
          </div>
          <p className="text-slate-700 mb-4">{error || 'Appointment not found'}</p>
          <div className="flex flex-col gap-3 items-center">
            <Button onClick={() => navigate(PATHS.BOOKING_SEARCH)} variant="primary">
              {t('bookAgain.context.searchForDoctors')}
            </Button>
            {id && (
              <Button
                onClick={() => navigate(PATHS.BOOK_AGAIN_ALTERNATIVES.replace(':id', id))}
                variant="secondary"
              >
                {t('bookAgain.context.seeAlternatives')}
              </Button>
            )}
          </div>
        </div>
      </Page>
    )
  }

  const historyDoctorName = historyItem?.subtitle?.split('·')[0]?.trim()
  const historyLocation = historyItem?.subtitle?.split('·')[1]?.trim()
  const historySpecialty = historyItem?.title?.replace('Appointment:', '').trim()

  const displayName = appointment?.doctorName || historyDoctorName || 'Dr. Sarah Weber'
  const displaySpecialty = appointment?.specialty || historySpecialty || 'Dermatology'
  const displayLocation = doctor?.city || historyLocation || profile.address.city || 'Berlin'
  const displayRating = doctor?.rating ?? 4.9
  const displayReviewCount = doctor?.reviewCount ?? 124

  const openEditSheet = (type: 'location' | 'insurance' | 'patient') => {
    if (type === 'location') {
      setLocationDraft({
        city: profile.address.city || locationDraft.city,
        postalCode: profile.address.postalCode || locationDraft.postalCode,
      })
    }
    if (type === 'insurance') {
      setInsuranceDraft(
        profile.insuranceType === 'GKV'
          ? t('publicGkv')
          : profile.insuranceType === 'PKV'
          ? t('privatePkv')
          : t('selfPay')
      )
    }
    if (type === 'patient') {
      setPatientDraft('myself')
    }
    setEditSheet(type)
  }

  const handleSaveEdit = () => {
    setEditSheet(null)
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('bookAgain.context.title')} subtitle={t('bookAgain.context.subtitle', { date: formatDate(sourceData.dateISO) })} showBack />

      <div className="px-4 py-4 space-y-6 pb-40">
        {/* Timing hint (stubbed, no AI calls) */}
        <div className="bg-white rounded-xl border border-cream-400 p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <IconAlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal-500">{t('bookAgain.context.timingHintTitle')}</p>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{computeTimingHint(sourceData.dateISO)}</p>
          </div>
        </div>

        {/* Doctor card */}
        <div className="bg-white rounded-2xl border border-cream-400 p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar name={displayName} size="lg" />
            <div className="flex-1">
              <p className="font-semibold text-charcoal-500">{displayName}</p>
              <p className="text-sm text-slate-600">{displaySpecialty}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Rating value={displayRating} reviewCount={displayReviewCount} />
                <span className="text-cream-400">|</span>
                <span>{displayLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm details */}
        <div>
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">{t('bookAgain.context.confirmDetails')}</h3>
          <div className="bg-white rounded-2xl border border-cream-400 divide-y divide-cream-200">
            <button
              type="button"
              onClick={() => openEditSheet('location')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('location')}</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {locationDraft.city} ({locationDraft.postalCode})
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconEdit className="w-4 h-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => openEditSheet('insurance')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('insurance')}</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {insuranceDraft}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconEdit className="w-4 h-4" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => openEditSheet('patient')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('bookAgain.context.patientLabel')}</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {patientDraft === 'myself' ? t('myself') : t('child')}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <IconEdit className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <Button
            onClick={handleViewSlots}
            disabled={!doctor}
            variant="primary"
            size="md"
            fullWidth
          >
            {t('viewAvailableAppointments')}
          </Button>
          <Button
            onClick={() => navigate(PATHS.BOOK_AGAIN_ALTERNATIVES.replace(':id', sourceData.id))}
            variant="secondary"
            size="md"
            fullWidth
          >
            {t('bookAgain.context.seeAlternatives')}
          </Button>
        </div>
      </div>

      {editSheet && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-charcoal-900/50 animate-fade-in" onClick={() => setEditSheet(null)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-4 pb-6 animate-slide-up">
            <div className="flex justify-center pb-3">
              <div className="w-10 h-1 rounded-full bg-cream-400" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal-500 mb-4">
              {editSheet === 'location'
                ? t('bookAgain.context.edit.location')
                : editSheet === 'insurance'
                  ? t('bookAgain.context.edit.insurance')
                  : t('bookAgain.context.edit.patient')}
            </h3>

            {editSheet === 'location' && (
              <div className="space-y-3">
                <div>
                  <label className="form-label">{t('bookAgain.context.city')}</label>
                  <input
                    className="input-field"
                    value={locationDraft.city}
                    onChange={(e) => setLocationDraft((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">{t('bookAgain.context.postalCode')}</label>
                  <input
                    className="input-field"
                    value={locationDraft.postalCode}
                    onChange={(e) => setLocationDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {editSheet === 'insurance' && (
              <div className="space-y-2">
                {[t('publicGkv'), t('privatePkv'), t('selfPay')].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInsuranceDraft(opt)}
                    className={`w-full text-left rounded-xl border p-3 transition-colors duration-normal ease-out-brand ${
                      insuranceDraft === opt ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {editSheet === 'patient' && (
              <div>
                <PatientSelector
                  value={patientDraft}
                  onChange={(value) => setPatientDraft(value as 'myself' | 'child')}
                  label={t('bookAgain.context.patientLabel')}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <Button onClick={handleSaveEdit} variant="primary" size="md" fullWidth>
                {t('bookAgain.context.save')}
              </Button>
              <Button onClick={() => setEditSheet(null)} variant="tertiary" size="md" fullWidth>
                {t('bookAgain.context.cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}

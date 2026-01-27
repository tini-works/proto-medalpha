import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Header, Avatar, Rating, PatientSelector } from '../../components'
import { useBookAgain, useBooking, useHistory, useProfile } from '../../state'
import { getDoctorById } from '../../data'
import { formatDate } from '../../utils/format'
import { doctorSlotsPath, PATHS } from '../../routes/paths'
import type { Doctor } from '../../types'

export default function BookAgainContextScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

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
      ? 'Public (GKV)'
      : profile.insuranceType === 'PKV'
      ? 'Private (PKV)'
      : 'Self-pay'
  )
  const [patientDraft, setPatientDraft] = useState<'myself' | 'child'>('myself')

  // Find the source appointment/history item
  const appointment = appointments.find((apt) => apt.id === id)
  const historyItem = historyItems.find((item) => item.id === id)

  const sourceData = appointment || historyItem

  useEffect(() => {
    if (!sourceData) {
      setError('Appointment not found')
      setIsLoading(false)
      return
    }

    const doctorId = appointment?.doctorId || 'd1' // Fallback to d1 for history items
    setIsLoading(true)
    const doctorData = getDoctorById(doctorId)
    if (!doctorData) {
      setError('This doctor is no longer available. Please search for another doctor.')
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
        name: profile.fullName || 'You',
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
    if (days < 30) return 'You recently visited this doctor. If symptoms changed, consider updating the reason in confirm.'
    if (days < 180) return 'It has been a few months since your last visit. Routine check-ups may be appropriate.'
    return 'It has been a while since your last visit. Consider booking a routine follow-up if needed.'
  }

  if (isLoading) {
    return (
      <Page>
        <Header title="Book Again" showBack />
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
        <Header title="Book Again" showBack />
        <div className="px-4 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-coral-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-coral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-700 mb-4">{error || 'Appointment not found'}</p>
          <div className="flex flex-col gap-3 items-center">
            <button onClick={() => navigate(PATHS.BOOKING_SEARCH)} className="btn btn-primary">
              Search for Doctors
            </button>
            {id && (
              <button
                onClick={() => navigate(PATHS.BOOK_AGAIN_ALTERNATIVES.replace(':id', id))}
                className="btn btn-secondary"
              >
                See alternatives
              </button>
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
          ? 'Public (GKV)'
          : profile.insuranceType === 'PKV'
          ? 'Private (PKV)'
          : 'Self-pay'
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
      <Header title="Book Again" subtitle={`Based on your appointment from ${formatDate(sourceData.dateISO)}`} showBack />

      <div className="px-4 py-4 space-y-6 pb-40">
        {/* Timing hint (stubbed, no AI calls) */}
        <div className="bg-white rounded-xl border border-cream-400 p-4 flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-7.364l-1.414 1.414M8.05 15.95l-1.414 1.414m0-11.314L8.05 8.05m8.9 8.9l1.414 1.414" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-charcoal-500">Timing hint</p>
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
          <h3 className="text-sm font-semibold text-charcoal-500 mb-3">Confirm details</h3>
          <div className="bg-white rounded-2xl border border-cream-400 divide-y divide-cream-200">
            <button
              type="button"
              onClick={() => openEditSheet('location')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Location</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {locationDraft.city} ({locationDraft.postalCode})
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 013.536 3.536L12.5 14.5H9v-3.5z" />
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={() => openEditSheet('insurance')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Insurance</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {insuranceDraft}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 013.536 3.536L12.5 14.5H9v-3.5z" />
                </svg>
              </span>
            </button>
            <button
              type="button"
              onClick={() => openEditSheet('patient')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-50 transition-colors"
            >
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide">Patient</p>
                <p className="text-sm font-semibold text-charcoal-500">
                  {patientDraft === 'myself' ? 'Myself' : 'Child'}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6.232-6.232a2.5 2.5 0 013.536 3.536L12.5 14.5H9v-3.5z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <div className="mx-auto max-w-md space-y-3">
          <button
            onClick={handleViewSlots}
            disabled={!doctor}
            className="btn btn-primary btn-block h-12 py-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Available Appointments
          </button>
          <button
            onClick={() => navigate(PATHS.BOOK_AGAIN_ALTERNATIVES.replace(':id', sourceData.id))}
            className="btn btn-secondary btn-block h-12 py-0"
          >
            See alternatives
          </button>
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
              {editSheet === 'location' ? 'Edit location' : editSheet === 'insurance' ? 'Edit insurance' : 'Edit patient'}
            </h3>

            {editSheet === 'location' && (
              <div className="space-y-3">
                <div>
                  <label className="form-label">City</label>
                  <input
                    className="input-field"
                    value={locationDraft.city}
                    onChange={(e) => setLocationDraft((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Postal code</label>
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
                {['Public (GKV)', 'Private (PKV)', 'Self-pay'].map((opt) => (
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
                  label="Patient"
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3">
              <button onClick={handleSaveEdit} className="btn btn-primary btn-block h-12 py-0">
                Save
              </button>
              <button onClick={() => setEditSheet(null)} className="btn btn-tertiary btn-block h-12 py-0">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Page>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Page, Header, Avatar } from '../../components'
import { useBookAgain, useBooking, useHistory, useProfile } from '../../state'
import { apiGetDoctor } from '../../data/api'
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

    const fetchDoctor = async () => {
      setIsLoading(true)
      try {
        const doctorData = await apiGetDoctor(doctorId)
        setDoctor(doctorData)

        // Set up book again context
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
      } catch (err) {
        setError('This doctor is no longer available. Please search for another doctor.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctor()
  }, [sourceData, appointment, profile, setBookAgainContext])

  const handleViewSlots = () => {
    if (doctor) {
      navigate(doctorSlotsPath(doctor.id) + '?bookAgain=true')
    }
  }

  if (isLoading) {
    return (
      <Page>
        <Header title="Book Again" showBack />
        <div className="px-4 py-4 space-y-4">
          {/* Skeleton loading */}
          <div className="bg-neutral-50 rounded-xl p-4 animate-pulse">
            <div className="h-4 w-40 bg-neutral-200 rounded mb-2" />
            <div className="h-5 w-24 bg-neutral-200 rounded" />
          </div>
          <div className="h-px bg-neutral-200" />
          <div className="bg-white rounded-xl border border-neutral-200 p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-200" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-neutral-200 rounded" />
                <div className="h-4 w-24 bg-neutral-200 rounded" />
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
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-neutral-700 mb-4">{error || 'Appointment not found'}</p>
          <button
            onClick={() => navigate(PATHS.BOOKING_SEARCH)}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium"
          >
            Search for Doctors
          </button>
        </div>
      </Page>
    )
  }

  const displayName = appointment?.doctorName || historyItem?.title || ''
  const displaySpecialty = appointment?.specialty || historyItem?.subtitle || ''

  return (
    <Page>
      <Header title="Book Again" showBack />

      <div className="px-4 py-4 space-y-6">
        {/* Reference to previous appointment */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <p className="text-sm text-neutral-500 mb-1">Based on your appointment from</p>
          <p className="font-semibold text-neutral-900">{formatDate(sourceData.dateISO)}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200" />

        {/* Pre-filled Context */}
        <div className="space-y-4">
          {/* Doctor (not editable) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Doctor</label>
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-4">
                <Avatar name={displayName} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate">{displayName}</h3>
                  <p className="text-sm text-neutral-600">{displaySpecialty}</p>
                  {doctor && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-neutral-500">
                        {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                      </span>
                      <span className="text-neutral-300">|</span>
                      <span className="text-sm text-neutral-500">{doctor.city}</span>
                    </div>
                  )}
                </div>
                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Specialty (not editable) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Specialty</label>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
              <span className="text-neutral-900">{displaySpecialty}</span>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Location (editable in future) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
              <span className="text-neutral-900">
                {profile.address.city || 'Berlin'} ({profile.address.postalCode || '10178'})
              </span>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Insurance (editable in future) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Insurance</label>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
              <span className="text-neutral-900">
                {profile.insuranceType === 'GKV'
                  ? 'Public (GKV)'
                  : profile.insuranceType === 'PKV'
                  ? 'Private (PKV)'
                  : 'Self-pay'}
              </span>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Patient (editable in future) */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Patient</label>
            <div className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center justify-between">
              <span className="text-neutral-900">{profile.fullName || 'You'}</span>
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* View Slots Button */}
        <div className="pt-4">
          <button
            onClick={handleViewSlots}
            disabled={!doctor}
            className="w-full h-12 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            View Available Times
          </button>
        </div>
      </div>
    </Page>
  )
}

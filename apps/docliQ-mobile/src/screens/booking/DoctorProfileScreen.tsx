import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMapPin } from '@tabler/icons-react'
import { Header, Page, Avatar, Rating, Pill } from '../../components'
import { useBooking, useProfile, usePreferences } from '../../state'
import { apiGetDoctor } from '../../data'
import { doctorSlotsPath, PATHS } from '../../routes'
import { getLocale } from '../../utils'
import type { Doctor } from '../../types'

export default function DoctorProfileScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { profile } = useProfile()
  const {
    selectedDoctor,
    selectDoctor,
    availabilityPrefs,
    search,
    setSpecialtyMatchRequest,
    bookingFlow,
  } = useBooking()
  const { language } = usePreferences()

  // Check if we're in the specialty-first flow
  const isSpecialtyFirstFlow = Boolean(availabilityPrefs || search?.fullyFlexible || search?.availabilitySlots)
  // Check if we're in the doctor-first flow
  const isDoctorFirstFlow = bookingFlow === 'by_doctor'
  const [doctor, setDoctor] = useState<Doctor | null>(selectedDoctor)
  const [loading, setLoading] = useState(!selectedDoctor)

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
        .catch(() => navigate(PATHS.BOOKING_RESULTS))
        .finally(() => setLoading(false))
    }
  }, [id, selectedDoctor, selectDoctor, navigate])

  if (loading || !doctor) {
    return (
      <Page safeBottom={false}>
        <Header title={t('doctorProfile')} showBack />
        <div className="p-4">
          <div className="h-48 bg-cream-200 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title={t('doctorProfile')} showBack />

      <div className="px-4 py-6">
        {/* Profile header */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-charcoal-500">{doctor.name}</h1>
            <p className="text-slate-600">{doctor.specialty}</p>
            <div className="mt-2">
              <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
            </div>
          </div>
        </div>

        {/* Insurance */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-slate-500 mb-2">{t('accepts')}</h2>
          <div className="flex gap-2">
            {doctor.accepts.map((insurance) => (
              <Pill key={insurance} tone={insurance === 'GKV' ? 'info' : 'neutral'} size="md">
                {insurance}
              </Pill>
            ))}
          </div>
        </section>

        {/* Location */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-slate-500 mb-2">{t('location')}</h2>
          <div className="flex items-start gap-2 text-charcoal-500">
            <IconMapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" size={20} stroke={2} />
            <div>
              <p>{doctor.address}</p>
              <p className="text-sm text-slate-500">{doctor.city}</p>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-slate-500 mb-2">{t('languages')}</h2>
          <p className="text-charcoal-500">{doctor.languages.join(', ')}</p>
        </section>

        {/* About */}
        {doctor.about && (
          <section className="mb-6">
            <h2 className="text-sm font-medium text-slate-500 mb-2">{t('about')}</h2>
            <p className="text-slate-700">{doctor.about}</p>
          </section>
        )}

        {/* Reviews preview */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-slate-500">{t('reviews')}</h2>
            <button
              onClick={() => navigate(PATHS.BOOKING_REVIEWS.replace(':id', doctor.id))}
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>
          <div className="bg-white rounded-xl border border-cream-400 p-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              {t('sampleReviewText')}
            </p>
            <p className="text-xs text-slate-500 mt-2">{t('sampleReview')}</p>
          </div>
        </section>

        {/* Next available */}
        <section className="mb-8 p-4 bg-cream-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-medium">{t('nextAvailable')}</span>{' '}
            {new Date(doctor.nextAvailableISO).toLocaleDateString(getLocale(language), {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </section>

        {/* Book button */}
        {isDoctorFirstFlow ? (
          <button
            onClick={() => navigate(PATHS.BOOKING_AVAILABILITY)}
            className="btn btn-primary btn-block"
          >
            {t('continueToAvailability')}
          </button>
        ) : isSpecialtyFirstFlow ? (
          <button
            onClick={() => {
              // Set up the specialty match request
              setSpecialtyMatchRequest({
                specialty: search?.specialty || doctor.specialty,
                city: search?.city || doctor.city,
                insuranceType: (search?.insuranceType || 'GKV') as 'GKV' | 'PKV',
                doctorId: doctor.id,
                doctorName: doctor.name,
                availabilityPrefs: availabilityPrefs || { fullyFlexible: true, slots: [] },
                patientId: profile.id,
                patientName: profile.fullName,
              })
              navigate(PATHS.FAST_LANE_MATCHING)
            }}
            className="btn btn-primary btn-block"
          >
            {t('selectThisDoctor')}
          </button>
        ) : (
          <button
            onClick={() => navigate(doctorSlotsPath(doctor.id))}
            className="btn btn-primary btn-block"
          >
            {t('selectAppointmentTime')}
          </button>
        )}
      </div>
    </Page>
  )
}

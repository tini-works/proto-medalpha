import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Page, Avatar, Rating, Pill } from '../../components'
import { useBooking } from '../../state'
import { apiGetDoctor } from '../../data'
import { doctorSlotsPath, PATHS } from '../../routes'
import type { Doctor } from '../../types'

export default function DoctorProfileScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedDoctor, selectDoctor } = useBooking()
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
        <Header title="Doctor Profile" showBack />
        <div className="p-4">
          <div className="h-48 bg-cream-200 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title="Doctor Profile" showBack />

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
          <h2 className="text-sm font-medium text-slate-500 mb-2">Accepts</h2>
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
          <h2 className="text-sm font-medium text-slate-500 mb-2">Location</h2>
          <div className="flex items-start gap-2 text-charcoal-500">
            <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p>{doctor.address}</p>
              <p className="text-sm text-slate-500">{doctor.city}</p>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-slate-500 mb-2">Languages</h2>
          <p className="text-charcoal-500">{doctor.languages.join(', ')}</p>
        </section>

        {/* About */}
        {doctor.about && (
          <section className="mb-6">
            <h2 className="text-sm font-medium text-slate-500 mb-2">About</h2>
            <p className="text-slate-700">{doctor.about}</p>
          </section>
        )}

        {/* Next available */}
        <section className="mb-8 p-4 bg-cream-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <span className="font-medium">Next available:</span>{' '}
            {new Date(doctor.nextAvailableISO).toLocaleDateString('de-DE', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </section>

        {/* Book button */}
        <button
          onClick={() => navigate(doctorSlotsPath(doctor.id))}
          className="btn btn-primary btn-block"
        >
          Select Appointment Time
        </button>
      </div>
    </Page>
  )
}

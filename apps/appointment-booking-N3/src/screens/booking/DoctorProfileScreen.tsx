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
        <Header title="Arztprofil" showBack />
        <div className="p-4">
          <div className="h-48 bg-neutral-100 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title="Arztprofil" showBack />

      <div className="px-4 py-6">
        {/* Profile header */}
        <div className="flex items-start gap-4 mb-6">
          <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-neutral-900">{doctor.name}</h1>
            <p className="text-neutral-600">{doctor.specialty}</p>
            <div className="mt-2">
              <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
            </div>
          </div>
        </div>

        {/* Insurance */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Akzeptierte Versicherungen</h2>
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
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Standort</h2>
          <div className="flex items-start gap-2 text-neutral-900">
            <svg className="w-5 h-5 text-neutral-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <p className="text-sm text-neutral-500">{doctor.city}</p>
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Sprachen</h2>
          <p className="text-neutral-900">{doctor.languages.join(', ')}</p>
        </section>

        {/* About */}
        {doctor.about && (
          <section className="mb-6">
            <h2 className="text-sm font-medium text-neutral-500 mb-2">Über den Arzt</h2>
            <p className="text-neutral-700">{doctor.about}</p>
          </section>
        )}

        {/* Next available */}
        <section className="mb-8 p-4 bg-neutral-100 rounded-lg">
          <p className="text-sm text-neutral-700">
            <span className="font-medium">Nächster verfügbarer Termin:</span>{' '}
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
          className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
        >
          Termin auswählen
        </button>
      </div>
    </Page>
  )
}

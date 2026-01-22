import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, TabBar, DoctorCard, EmptyState } from '../../components'
import { useBooking } from '../../state'
import { apiSearchDoctors } from '../../data'
import { doctorPath, PATHS } from '../../routes'
import type { Doctor } from '../../types'

export default function ResultsScreen() {
  const navigate = useNavigate()
  const { search, selectDoctor } = useBooking()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!search) {
      // No search filters, search all
      apiSearchDoctors({})
        .then(setDoctors)
        .finally(() => setLoading(false))
      return
    }

    apiSearchDoctors({
      specialty: search.specialty,
      city: search.city,
      insuranceType: search.insuranceType,
    })
      .then(setDoctors)
      .finally(() => setLoading(false))
  }, [search])

  const handleSelectDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorPath(doctor.id))
  }

  return (
    <Page>
      <Header
        title="Suchergebnisse"
        subtitle={loading ? 'Suche läuft...' : `${doctors.length} ${doctors.length === 1 ? 'Arzt' : 'Ärzte'} gefunden`}
        showBack
        onBack={() => navigate(PATHS.BOOKING_SEARCH)}
      />

      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon="search"
            title="Keine Ärzte gefunden"
            description="Passen Sie Ihre Suchkriterien an, um weitere Ergebnisse zu erhalten."
            action={
              <button
                onClick={() => navigate(PATHS.BOOKING_SEARCH)}
                className="px-4 py-2.5 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
              >
                Suche anpassen
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} onClick={() => handleSelectDoctor(doctor)} />
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </Page>
  )
}

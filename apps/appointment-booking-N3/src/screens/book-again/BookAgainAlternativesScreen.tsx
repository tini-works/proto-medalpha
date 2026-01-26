import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Page, DoctorCard, EmptyState } from '../../components'
import { apiSearchDoctors, getTimeSlots } from '../../data'
import { useBookAgain, useBooking, useProfile } from '../../state'
import { doctorPath, doctorSlotsPath, PATHS } from '../../routes'
import type { Doctor, TimeSlot } from '../../types'

export default function BookAgainAlternativesScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { setBookAgainContext, bookAgainContext, getAppointmentById, getHistoryItemById } = useBookAgain()
  const { selectDoctor } = useBooking()

  const [loading, setLoading] = useState(true)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [doctorSlots, setDoctorSlots] = useState<Record<string, TimeSlot[]>>({})

  const sourceAppointment = id ? getAppointmentById(id) : undefined
  const sourceHistory = id ? getHistoryItemById(id) : undefined

  const specialty = sourceAppointment?.specialty || sourceHistory?.subtitle || ''
  const city = profile.address.city || 'Berlin'

  useEffect(() => {
    if (!id) {
      navigate(PATHS.HISTORY)
      return
    }

    // Ensure book-again context exists (best effort).
    if (!bookAgainContext && specialty) {
      setBookAgainContext({
        sourceAppointmentId: id,
        sourceDate: sourceAppointment?.dateISO || sourceHistory?.dateISO || new Date().toISOString().slice(0, 10),
        doctor: {
          id: 'd1',
          name: '—',
          specialty: specialty || 'Primary care',
          city,
          address: '',
          rating: 0,
          reviewCount: 0,
          accepts: [],
          nextAvailableISO: new Date().toISOString().slice(0, 10),
          languages: [],
        },
        location: { city, postalCode: profile.address.postalCode || '' },
        insurance: { type: (profile.insuranceType as any) || '' },
        patient: { id: profile.id || 'self', name: profile.fullName || 'You', relationship: 'self' },
      })
    }

    const run = async () => {
      setLoading(true)
      try {
        const results = await apiSearchDoctors({ specialty, city, insuranceType: profile.insuranceType || '' })
        setDoctors(results)

        const slotsMap: Record<string, TimeSlot[]> = {}
        for (const d of results) {
          slotsMap[d.id] = getTimeSlots(d.id)
        }
        setDoctorSlots(slotsMap)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [id, specialty, city, profile.insuranceType, profile.address.postalCode, profile.fullName, profile.id, navigate, setBookAgainContext, bookAgainContext, sourceAppointment?.dateISO, sourceHistory?.dateISO])

  const recommended = useMemo(() => doctors[0] || null, [doctors])
  const others = useMemo(() => (recommended ? doctors.slice(1) : doctors), [doctors, recommended])

  const handleChooseDoctor = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorPath(doctor.id))
  }

  const handleChooseEarliest = (doctor: Doctor) => {
    selectDoctor(doctor)
    navigate(doctorSlotsPath(doctor.id) + `?bookAgain=${id}`)
  }

  return (
    <Page>
      <Header title="Book again alternatives" showBack />

      <div className="px-4 py-4 space-y-4 pb-20">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700">
          Your previous doctor may be unavailable. Here are alternatives based on specialty and location.
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-cream-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <EmptyState
            icon="search"
            title="No alternatives found"
            description="Try a new search to find more doctors."
            action={
              <button onClick={() => navigate(PATHS.BOOKING_SEARCH)} className="btn btn-primary btn-block">
                Search again
              </button>
            }
          />
        ) : (
          <>
            {recommended && (
              <div className="bg-white rounded-xl border border-teal-200 p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-charcoal-500">Recommended</p>
                  <button
                    onClick={() => handleChooseEarliest(recommended)}
                    className="text-sm font-medium text-teal-700 hover:underline"
                  >
                    View availability
                  </button>
                </div>
                <DoctorCard
                  doctor={recommended}
                  slots={doctorSlots[recommended.id] || []}
                  onSelectDoctor={() => handleChooseDoctor(recommended)}
                  onSelectSlot={() => handleChooseEarliest(recommended)}
                  onMoreAppointments={() => handleChooseEarliest(recommended)}
                />
              </div>
            )}

            {others.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-1">Other options</p>
                {others.map((d) => (
                  <DoctorCard
                    key={d.id}
                    doctor={d}
                    slots={doctorSlots[d.id] || []}
                    onSelectDoctor={() => handleChooseDoctor(d)}
                    onSelectSlot={() => handleChooseEarliest(d)}
                    onMoreAppointments={() => handleChooseEarliest(d)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  )
}


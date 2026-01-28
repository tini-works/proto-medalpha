import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Page, EmptyState } from '../../components'
import { Button } from '../../components/ui'
import { apiSearchDoctors, getTimeSlots } from '../../data'
import { useBookAgain, useBooking, useProfile } from '../../state'
import { doctorSlotsPath, PATHS } from '../../routes'
import { formatDateWithWeekday, formatTime } from '../../utils/format'
import type { Doctor, TimeSlot } from '../../types'
import { IconStar, IconCalendarCheck, IconCheck } from '@tabler/icons-react'

export default function BookAgainAlternativesScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useProfile()
  const { setBookAgainContext, bookAgainContext, getAppointmentById, getHistoryItemById } = useBookAgain()
  const { selectDoctor, selectSlot } = useBooking()

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

  const getEarliestSlot = (slots: TimeSlot[]) => slots.find((slot) => slot.available) || null

  const handleChooseEarliest = (doctor: Doctor) => {
    const slot = getEarliestSlot(doctorSlots[doctor.id] || [])
    selectDoctor(doctor)
    if (slot) {
      selectSlot(slot)
      navigate(PATHS.BOOKING_CONFIRM)
      return
    }
    navigate(doctorSlotsPath(doctor.id) + `?bookAgain=${id}`)
  }

  return (
    <Page>
      <Header title="Similar Specialists" showBack />

      <div className="px-4 py-4 space-y-4 pb-20">
        <p className="text-sm text-slate-500 text-center">
          We found these times based on your previous preference.
        </p>

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
              <Button onClick={() => navigate(PATHS.BOOKING_SEARCH)} variant="primary" fullWidth>
                Search again
              </Button>
            }
          />
        ) : (
          <>
            {recommended && (
              <div className="bg-white rounded-2xl border border-teal-200 p-4 space-y-3 shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
                  <IconStar className="w-4 h-4" />
                  Recommended
                </div>
                <div>
                  <p className="text-lg font-semibold text-charcoal-500">
                    {(() => {
                      const slot = getEarliestSlot(doctorSlots[recommended.id] || [])
                      return slot ? `${formatDateWithWeekday(slot.dateISO)} • ${formatTime(slot.time)}` : 'Next available'
                    })()}
                  </p>
                  <p className="text-sm text-teal-700 font-medium">Best match for your schedule</p>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Why this slot:</div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                    <IconCheck className="w-4 h-4" />
                  </span>
                  {recommended.name}
                </div>
                <Button onClick={() => handleChooseEarliest(recommended)} variant="primary" size="md" fullWidth>
                  Select Recommended Slot
                </Button>
              </div>
            )}

            {others.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Other options</p>
                {others.map((d, index) => {
                  const slot = getEarliestSlot(doctorSlots[d.id] || [])
                  const tag = index === 0 ? '1 day earlier' : index === 1 ? 'Next available' : 'Next week'
                  return (
                    <div key={d.id} className="bg-white rounded-2xl border border-cream-400 p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center text-teal-700">
                          <IconCalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-cream-100 text-[10px] font-semibold text-teal-700 border border-cream-300 mb-1">
                            {tag}
                          </span>
                          <p className="text-sm font-semibold text-charcoal-500">
                            {slot ? `${formatDateWithWeekday(slot.dateISO)} • ${formatTime(slot.time)}` : 'Next available'}
                          </p>
                          <p className="text-xs text-slate-500">{d.name}</p>
                        </div>
                      </div>
                      <button onClick={() => handleChooseEarliest(d)} className="px-3 h-9 rounded-lg border border-cream-300 text-sm text-charcoal-500 hover:bg-cream-50">
                        Select
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Page>
  )
}

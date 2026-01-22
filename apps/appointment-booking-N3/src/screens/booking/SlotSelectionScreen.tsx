import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Header, Page } from '../../components'
import { useBooking, useProfile } from '../../state'
import { apiGetAvailableDates, apiGetSlotsForDate } from '../../data'
import { PATHS } from '../../routes'
import type { TimeSlot } from '../../types'

export default function SlotSelectionScreen() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { selectedDoctor, selectSlot, selectFamilyMember } = useBooking()
  const { profile } = useProfile()

  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlotValue, setSelectedSlotValue] = useState<TimeSlot | null>(null)
  const [selectedFor, setSelectedFor] = useState<string>('self')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id || !selectedDoctor) {
      navigate(PATHS.BOOKING_SEARCH)
      return
    }

    apiGetAvailableDates(id)
      .then((dates) => {
        setAvailableDates(dates)
        if (dates.length > 0) {
          setSelectedDate(dates[0])
        }
      })
      .finally(() => setLoading(false))
  }, [id, selectedDoctor, navigate])

  useEffect(() => {
    if (id && selectedDate) {
      apiGetSlotsForDate(id, selectedDate).then(setSlots)
    }
  }, [id, selectedDate])

  const handleSelectSlot = (slot: TimeSlot) => {
    if (!slot.available) return
    setSelectedSlotValue(slot)
  }

  const handleContinue = () => {
    if (!selectedSlotValue) return

    selectSlot(selectedSlotValue)
    selectFamilyMember(selectedFor === 'self' ? null : selectedFor)
    navigate(PATHS.BOOKING_CONFIRM)
  }

  if (loading) {
    return (
      <Page safeBottom={false}>
        <Header title="Termin wählen" showBack />
        <div className="p-4">
          <div className="h-48 bg-neutral-100 rounded-lg animate-pulse" />
        </div>
      </Page>
    )
  }

  return (
    <Page safeBottom={false}>
      <Header title="Termin wählen" subtitle={selectedDoctor?.name} showBack />

      <div className="px-4 py-6 space-y-6">
        {/* Date selection */}
        <section>
          <h2 className="text-sm font-medium text-neutral-700 mb-3">Datum auswählen</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {availableDates.slice(0, 7).map((date) => {
              const d = new Date(date)
              const isSelected = date === selectedDate
              return (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-16 py-3 rounded-lg text-center transition-colors ${
                    isSelected
                      ? 'bg-neutral-800 text-white'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div className="text-xs opacity-80">
                    {d.toLocaleDateString('de-DE', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-semibold">{d.getDate()}</div>
                  <div className="text-xs opacity-80">
                    {d.toLocaleDateString('de-DE', { month: 'short' })}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Time slots */}
        <section>
          <h2 className="text-sm font-medium text-neutral-700 mb-3">Verfügbare Zeiten</h2>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => {
              const isSelected = selectedSlotValue?.time === slot.time && selectedSlotValue?.dateISO === slot.dateISO
              return (
                <button
                  key={`${slot.dateISO}-${slot.time}`}
                  onClick={() => handleSelectSlot(slot)}
                  disabled={!slot.available}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    !slot.available
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : isSelected
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {slot.time}
                </button>
              )
            })}
          </div>
        </section>

        {/* Who is this for */}
        {profile.familyMembers.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-neutral-700 mb-3">Für wen ist dieser Termin?</h2>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                  selectedFor === 'self' ? 'border-neutral-800 bg-neutral-50' : 'border-neutral-200 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="bookingFor"
                  value="self"
                  checked={selectedFor === 'self'}
                  onChange={(e) => setSelectedFor(e.target.value)}
                  className="w-4 h-4 text-neutral-800"
                />
                <span className="font-medium">Für mich ({profile.fullName})</span>
              </label>
              {profile.familyMembers.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    selectedFor === member.id ? 'border-neutral-800 bg-neutral-50' : 'border-neutral-200 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="bookingFor"
                    value={member.id}
                    checked={selectedFor === member.id}
                    onChange={(e) => setSelectedFor(e.target.value)}
                    className="w-4 h-4 text-neutral-800"
                  />
                  <span className="font-medium">{member.name}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selectedSlotValue}
          className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
        >
          Weiter
        </button>
      </div>
    </Page>
  )
}

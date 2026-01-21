import { Button, Card, CardBody, Input } from '@meda/ui'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { makeBookingId, makeConfirmationNumber, summarizeCost } from '../domain/booking'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import type { Booking, PatientProfile } from '../domain/types'
import { readCachedSlotsForDoctor } from '../domain/cache'
import { doctors } from '../mock/doctors'
import { patients } from '../mock/patients'
import { generateWeekSlots } from '../mock/slots'
import { readBookings, writeBookings } from '../state/bookingsStore'
import { useLocalStorageState } from '../state/useLocalStorageState'

export function ConfirmRoute() {
  const navigate = useNavigate()
  const selectedDoctorId = localStorage.getItem('ab.selection.doctorId')
  const selectedSlotId = localStorage.getItem('ab.selection.slotId')
  const rescheduleFromBookingId = localStorage.getItem('ab.reschedule.fromBookingId')
  // Business intent: keep the old slot id for potential UI copy; not required for logic.
  // const rescheduleFromSlotId = localStorage.getItem('ab.reschedule.fromSlotId')

  const [patientId, setPatientId] = useLocalStorageState<string>('ab.confirm.patientId', 'pat_self')
  const [reason, setReason] = useLocalStorageState<string>('ab.confirm.reason', '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const doctor = useMemo(
    () => doctors.find((d) => d.id === selectedDoctorId),
    [selectedDoctorId],
  )
  const patient = useMemo(
    () => patients.find((p) => p.id === patientId) ?? patients[0],
    [patientId],
  )

  const slot = useMemo(() => {
    if (!selectedDoctorId || !selectedSlotId) return null
    // Business intent: reconstruct slot from deterministic generator for the prototype.
    const weekStartISO = selectedSlotId.split('_').slice(-1)[0]?.slice(0, 10) ?? '2026-01-01'
    const cached = readCachedSlotsForDoctor({ doctorId: selectedDoctorId, weekStartISO })
    const slots =
      cached ??
      generateWeekSlots({
        doctorId: selectedDoctorId,
        weekStartISO,
        days: 7,
        startHour: 9,
        endHour: 17,
        durationMin: 30,
        cadenceMin: 30,
      })
    return slots.find((s) => s.id === selectedSlotId) ?? null
  }, [selectedDoctorId, selectedSlotId])

  const summary = useMemo(() => {
    if (!doctor || !slot) return null
    const d = new Date(slot.startISO)
    return {
      date: formatGermanDate(d),
      time: formatGermanTime(d),
      duration: `${slot.durationMin} min`,
      address: `${doctor.address.street}, ${doctor.address.postalCode} ${doctor.address.city}`,
    }
  }, [doctor, slot])

  const costLabel = useMemo(() => {
    if (!doctor) return ''
    return summarizeCost({ doctor, patient: patient as PatientProfile })
  }, [doctor, patient])

  function availabilityCheck(): { ok: boolean; message?: string } {
    if (!doctor || !slot) return { ok: false, message: 'Missing selection.' }
    const existing = readBookings()
    const alreadyBooked = existing.some(
      (b) => b.status === 'confirmed' && b.doctorId === doctor.id && b.slot.id === slot.id,
    )
    if (alreadyBooked) return { ok: false, message: 'Termin nicht mehr verfügbar.' }

    // Business intent: optional randomized failure path to demonstrate real-time contention (BOOK-010).
    const randomFail = Math.random() < 0.08
    if (randomFail) return { ok: false, message: 'Termin nicht mehr verfügbar.' }

    return { ok: true }
  }

  async function onConfirm() {
    setError(null)
    if (!doctor || !slot || !patient) {
      setError('Please select a doctor and time slot first.')
      return
    }

    if (reason.length > 200) {
      setError('Reason must be 200 characters or less.')
      return
    }

    setIsSubmitting(true)
    try {
      const check = availabilityCheck()
      if (!check.ok) {
        setError(check.message ?? 'Termin nicht mehr verfügbar.')
        return
      }

      const booking: Booking = {
        id: makeBookingId(),
        doctorId: doctor.id,
        patientId: patient.id,
        slot,
        status: 'confirmed',
        createdAtISO: new Date().toISOString(),
        confirmationNumber: makeConfirmationNumber(),
        reason: reason.trim() ? reason.trim() : undefined,
        replacesBookingId: rescheduleFromBookingId ?? undefined,
      }

      const existing = readBookings()

      const next = (() => {
        /**
         * Business intent: reschedule creates a new booking and cancels the old one
         * only after the new booking is confirmed (BOOK-017).
         */
        if (!rescheduleFromBookingId) return [...existing, booking]
        return [
          ...existing.map((b) =>
            b.id === rescheduleFromBookingId ? { ...b, status: 'cancelled' as const } : b,
          ),
          booking,
        ]
      })()

      writeBookings(next)

      if (rescheduleFromBookingId) {
        localStorage.removeItem('ab.reschedule.fromBookingId')
        localStorage.removeItem('ab.reschedule.fromSlotId')
      }

      navigate(`/success/${booking.id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MobileShell title="Confirm" step={{ current: 4, total: 4 }}>
      {/* Business intent: route-based bottom sheet so back/forward works like native (BOOK-011). */}
      <div
        className="fixed inset-0 z-40 flex items-end bg-black/40 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Confirm booking"
        onClick={() => navigate(-1)}
      >
        <div
          className="w-full max-w-[420px] rounded-t-2xl bg-white p-4 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-4">
            {/* Business intent: bottom-sheet-like summary so the user knows what they confirm (BOOK-011). */}
            <div className="text-sm font-semibold text-neutral-800">Summary</div>

            {!doctor || !slot || !summary ? (
              <div className="mt-2 text-sm text-neutral-600">
                Missing doctor or time selection. Go back to results to pick a slot.
              </div>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-neutral-700">
                <div>
                  <span className="font-semibold text-neutral-800">{doctor.name}</span> •{' '}
                  {doctor.specialty}
                </div>
                <div>
                  {summary.date} • {summary.time} • {summary.duration}
                </div>
                <div className="text-xs text-neutral-600">{summary.address}</div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardBody className="px-4 py-4">
            <div className="text-sm font-semibold text-neutral-800">For whom?</div>
            <p className="mt-1 text-xs text-neutral-600">
              Business intent: enable booking for children (BOOK-021).
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={[
                    'rounded-xl border px-3 py-3 text-left text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                    patientId === p.id
                      ? 'border-brand-blue-500 bg-brand-mint-100'
                      : 'border-neutral-300 bg-white hover:bg-neutral-100',
                  ].join(' ')}
                  onClick={() => setPatientId(p.id)}
                >
                  {p.displayName}{' '}
                  <span className="ml-2 text-xs font-normal text-neutral-600">
                    ({p.insurance})
                  </span>
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardBody className="px-4 py-4">
            <div className="text-sm font-semibold text-neutral-800">Reason (optional)</div>
            <div className="mt-3">
              <Input
                label="Grund des Besuchs"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReason(e.target.value)}
                maxLength={200}
                placeholder="Short note for the practice (optional)"
              />
              <div className="mt-1 text-xs text-neutral-600">{reason.length}/200</div>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl">
          <CardBody className="px-4 py-4">
            <div className="text-sm font-semibold text-neutral-800">Cost</div>
            <div className="mt-2 text-sm text-neutral-700">{costLabel}</div>
          </CardBody>
        </Card>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-neutral-800">
            {error}
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="w-full rounded-xl py-3"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            className="w-full rounded-xl py-3"
            disabled={!doctor || !slot || isSubmitting}
            onClick={onConfirm}
          >
            {isSubmitting ? 'Confirming…' : 'Confirm booking'}
          </Button>
        </div>
          </div>
        </div>
      </div>
    </MobileShell>
  )
}


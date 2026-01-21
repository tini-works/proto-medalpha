import { Button, Card, CardBody } from '@meda/ui'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import { makeIcs } from '../domain/ics'
import { doctors } from '../mock/doctors'
import { patients } from '../mock/patients'
import { readBookings, writeBookings } from '../state/bookingsStore'

export function AppointmentDetailsRoute() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>(null)

  const booking = useMemo(() => readBookings().find((b) => b.id === bookingId), [bookingId])
  const doctor = useMemo(
    () => (booking ? doctors.find((d) => d.id === booking.doctorId) : undefined),
    [booking],
  )
  const patient = useMemo(
    () => (booking ? patients.find((p) => p.id === booking.patientId) : undefined),
    [booking],
  )

  const icsContent = useMemo(() => {
    if (!booking || !doctor || !patient) return null
    return makeIcs({ booking, doctor, patient })
  }, [booking, doctor, patient])

  function downloadIcs() {
    if (!icsContent || !booking) return
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `appointment-${booking.confirmationNumber}.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setToast('Calendar file downloaded.')
    window.setTimeout(() => setToast(null), 2500)
  }

  function cancelBooking() {
    if (!booking) return
    const ok = window.confirm('Cancel this appointment? (Free cancellation up to 24h before)')
    if (!ok) return
    const all = readBookings()
    const next = all.map((b) => (b.id === booking.id ? { ...b, status: 'cancelled' as const } : b))
    writeBookings(next)
    setToast('Appointment cancelled.')
    window.setTimeout(() => setToast(null), 2000)
    navigate('/appointments')
  }

  function reschedule() {
    if (!booking) return
    // Business intent: reuse schedule + confirm; user picks a new slot then confirms.
    localStorage.setItem('ab.selection.doctorId', booking.doctorId)
    localStorage.setItem('ab.reschedule.fromBookingId', booking.id)
    localStorage.setItem('ab.reschedule.fromSlotId', booking.slot.id)
    navigate(`/doctor/${booking.doctorId}/schedule`)
  }

  return (
    <MobileShell title="Appointment details">
      {!booking || !doctor || !patient ? (
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-6 text-center">
            <div className="text-base font-semibold text-neutral-800">Appointment not found</div>
            <div className="mt-4">
              <Link className="text-sm font-semibold text-brand-blue-700 hover:underline" to="/appointments">
                Back to appointments
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-base font-semibold text-neutral-800">{doctor.name}</div>
              <div className="mt-1 text-sm text-neutral-700">{doctor.specialty}</div>
              <div className="mt-2 text-sm text-neutral-700">
                {formatGermanDate(new Date(booking.slot.startISO))} •{' '}
                {formatGermanTime(new Date(booking.slot.startISO))} • {booking.slot.durationMin} min
              </div>
              <div className="mt-1 text-xs text-neutral-600">
                {doctor.address.street}, {doctor.address.postalCode} {doctor.address.city}
              </div>
              <div className="mt-2 text-xs text-neutral-600">
                For: {patient.displayName} • Status:{' '}
                <span className="font-semibold">{booking.status}</span>
              </div>
              {booking.reason ? (
                <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
                  <div className="text-xs font-semibold text-neutral-700">Reason</div>
                  <div className="mt-1">{booking.reason}</div>
                </div>
              ) : null}
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-2">
            <Button className="w-full rounded-xl py-3" onClick={downloadIcs}>
              Add to calendar
            </Button>
            <a
              className="inline-flex items-center justify-center rounded-xl bg-[#FFC603] px-4 py-3 text-base font-semibold text-neutral-900 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${doctor.address.street}, ${doctor.address.postalCode} ${doctor.address.city}`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Open route
            </a>
          </div>

          {booking.status === 'confirmed' ? (
            <Card className="rounded-2xl">
              <CardBody className="px-4 py-4">
                {/* Business intent: cancellation + reschedule flows for management epics. */}
                <div className="text-sm font-semibold text-neutral-800">Manage</div>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" className="w-full rounded-xl py-3" onClick={reschedule}>
                    Reschedule
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl py-3"
                    onClick={cancelBooking}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="mt-2 text-xs text-neutral-600">
                  Cancellation policy: Free cancellation up to 24h before.
                </div>
              </CardBody>
            </Card>
          ) : null}

          <div className="text-center text-xs text-neutral-600">Powered by Curaay</div>
        </div>
      )}

      {toast ? (
        <div className="fixed bottom-4 left-0 right-0 z-30">
          <div className="mx-auto w-full max-w-[420px] px-4">
            <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow">
              {toast}
            </div>
          </div>
        </div>
      ) : null}
    </MobileShell>
  )
}


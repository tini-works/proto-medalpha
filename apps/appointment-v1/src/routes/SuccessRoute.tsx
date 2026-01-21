import { Button, Card, CardBody } from '@meda/ui'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { makeIcs } from '../domain/ics'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import { doctors } from '../mock/doctors'
import { patients } from '../mock/patients'
import { readBookings } from '../state/bookingsStore'

export function SuccessRoute() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [toast, setToast] = useState<string | null>('Email and push confirmation sent (simulated).')

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

  return (
    <MobileShell title="Booked" step={{ current: 4, total: 4 }}>
      {!booking || !doctor || !patient ? (
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-6 text-center">
            <div className="text-base font-semibold text-neutral-800">Booking not found</div>
            <div className="mt-4">
              <Link className="text-sm font-semibold text-brand-blue-700 hover:underline" to="/search">
                Back to search
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-5">
              {/* Business intent: clear success state with gentle “animation” feel (BOOK-012). */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-semantic-green-500 text-white">
                ✓
              </div>
              <div className="mt-3 text-center text-lg font-semibold text-neutral-800">
                Appointment booked
              </div>
              <div className="mt-1 text-center text-sm text-neutral-600">
                Confirmation: <span className="font-mono">{booking.confirmationNumber}</span>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-sm font-semibold text-neutral-800">Details</div>
              <div className="mt-3 space-y-1 text-sm text-neutral-700">
                <div className="font-semibold text-neutral-800">{doctor.name}</div>
                <div>{doctor.specialty}</div>
                <div>
                  {formatGermanDate(new Date(booking.slot.startISO))} •{' '}
                  {formatGermanTime(new Date(booking.slot.startISO))}
                </div>
                <div className="text-xs text-neutral-600">
                  {doctor.address.street}, {doctor.address.postalCode} {doctor.address.city}
                </div>
                <div className="text-xs text-neutral-600">For: {patient.displayName}</div>
              </div>
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
              onClick={() => {
                setToast('Opening directions…')
                window.setTimeout(() => setToast(null), 1500)
              }}
            >
              Open route
            </a>
          </div>

          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-xs text-neutral-600">
                Powered by Curaay
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="w-full rounded-xl py-3"
              onClick={() => navigate('/appointments')}
            >
              My appointments
            </Button>
            <Button className="w-full rounded-xl py-3" onClick={() => navigate('/search')}>
              Done
            </Button>
          </div>

          {toast ? (
            <div className="fixed bottom-4 left-0 right-0 z-30">
              <div className="mx-auto w-full max-w-[420px] px-4">
                <div className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 shadow">
                  {toast}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </MobileShell>
  )
}


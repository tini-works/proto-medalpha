import { Button, Card, CardBody } from '@meda/ui'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import { sortBookingsSoonestFirst } from '../domain/booking'
import { doctors } from '../mock/doctors'
import { patients } from '../mock/patients'
import { readBookings } from '../state/bookingsStore'

export function AppointmentsRoute() {
  const navigate = useNavigate()
  const upcoming = useMemo(() => {
    const all = readBookings().filter((b) => b.status === 'confirmed')
    return sortBookingsSoonestFirst(all)
  }, [])

  return (
    <MobileShell title="My appointments">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button className="w-full rounded-xl py-3" onClick={() => navigate('/search')}>
            Book another
          </Button>
          <Button
            variant="secondary"
            className="w-full rounded-xl py-3"
            onClick={() => navigate('/history')}
          >
            History
          </Button>
        </div>

        {upcoming.length ? (
          <div className="space-y-3">
            {upcoming.map((b) => {
              const doctor = doctors.find((d) => d.id === b.doctorId)
              const patient = patients.find((p) => p.id === b.patientId)
              return (
                <Card key={b.id} className="rounded-2xl">
                  <CardBody className="px-4 py-4">
                    <Link
                      to={`/appointments/${b.id}`}
                      className="block rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    >
                      <div className="text-base font-semibold text-neutral-800">
                        {doctor?.name ?? 'Doctor'}
                      </div>
                      <div className="mt-1 text-sm text-neutral-700">
                        {doctor?.specialty ?? ''}
                      </div>
                      <div className="mt-1 text-xs text-neutral-600">
                        {formatGermanDate(new Date(b.slot.startISO))} •{' '}
                        {formatGermanTime(new Date(b.slot.startISO))}
                      </div>
                      <div className="mt-1 text-xs text-neutral-600">
                        For: {patient?.displayName ?? 'Patient'}
                      </div>
                      <div className="mt-2 text-xs text-neutral-600">
                        {doctor
                          ? `${doctor.address.street}, ${doctor.address.postalCode} ${doctor.address.city}`
                          : ''}
                      </div>
                    </Link>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-6 text-center">
              <div className="text-base font-semibold text-neutral-800">No upcoming appointments</div>
              <div className="mt-1 text-sm text-neutral-600">
                Book your next appointment in a few taps.
              </div>
              <div className="mt-4">
                <Button className="w-full rounded-xl py-3" onClick={() => navigate('/search')}>
                  Book appointment
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <div className="text-center text-xs text-neutral-600">Powered by Curaay</div>
      </div>
    </MobileShell>
  )
}


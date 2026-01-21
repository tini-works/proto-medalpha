import { Button, Card, CardBody } from '@meda/ui'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import { doctors } from '../mock/doctors'
import { patients } from '../mock/patients'
import { readBookings } from '../state/bookingsStore'

export function HistoryRoute() {
  const navigate = useNavigate()
  const past = useMemo(() => {
    /**
     * Business intent: show most recent history first (BOOK-018),
     * including derived “completed” statuses from the store.
     */
    return readBookings()
      .filter((b) => b.status !== 'confirmed')
      .sort((a, b) => b.slot.startISO.localeCompare(a.slot.startISO))
  }, [])

  return (
    <MobileShell title="Past appointments">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button variant="secondary" className="w-full rounded-xl py-3" onClick={() => navigate('/appointments')}>
            Upcoming
          </Button>
          <Button className="w-full rounded-xl py-3" onClick={() => navigate('/search')}>
            Book
          </Button>
        </div>

        {past.length ? (
          <div className="space-y-3">
            {past.map((b) => {
              const doctor = doctors.find((d) => d.id === b.doctorId)
              const patient = patients.find((p) => p.id === b.patientId)
              return (
                <Card key={b.id} className="rounded-2xl">
                  <CardBody className="px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-neutral-800">{doctor?.name ?? 'Doctor'}</div>
                        <div className="mt-1 text-xs text-neutral-600">
                          {formatGermanDate(new Date(b.slot.startISO))} • {formatGermanTime(new Date(b.slot.startISO))}
                        </div>
                        <div className="mt-1 text-xs text-neutral-600">
                          Status: <span className="font-semibold">{b.status}</span> • For: {patient?.displayName ?? 'Patient'}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="shrink-0 rounded-xl px-3 py-2"
                        onClick={() => {
                          /**
                           * Business intent: “Erneut buchen” should take the user straight back into booking,
                           * keeping the same doctor context (BOOK-018).
                           */
                          if (doctor) localStorage.setItem('ab.selection.doctorId', doctor.id)
                          navigate(doctor ? `/doctor/${doctor.id}/schedule` : '/search')
                        }}
                      >
                        Book again
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Link className="text-sm font-semibold text-brand-blue-700 hover:underline" to={`/appointments/${b.id}`}>
                        View details →
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-6 text-center">
              <div className="text-base font-semibold text-neutral-800">No past appointments</div>
              <div className="mt-1 text-sm text-neutral-600">Your history will appear here.</div>
            </CardBody>
          </Card>
        )}
      </div>
    </MobileShell>
  )
}


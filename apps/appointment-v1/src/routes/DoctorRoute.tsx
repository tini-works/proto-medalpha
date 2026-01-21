import { Button, Card, CardBody } from '@meda/ui'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import { formatGermanDate } from '../domain/format'
import { doctors } from '../mock/doctors'
import { reviews } from '../mock/reviews'

function truncateReview(text: string, maxLen: number) {
  // Business intent: keep reviews skimmable in the profile while supporting “Mehr lesen” (BOOK-009).
  if (text.length <= maxLen) return { short: text, truncated: false }
  return { short: `${text.slice(0, maxLen).trimEnd()}…`, truncated: true }
}

export function DoctorRoute() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [expandedReviewIds, setExpandedReviewIds] = useState<Record<string, boolean>>({})

  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId), [doctorId])
  const doctorReviews = useMemo(
    () => reviews.filter((r) => r.doctorId === doctorId),
    [doctorId],
  )

  return (
    <MobileShell title="Doctor profile" step={{ current: 3, total: 4 }}>
      {!doctor ? (
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-6 text-center">
            <div className="text-base font-semibold text-neutral-800">Doctor not found</div>
            <div className="mt-4">
              <Link className="text-sm font-semibold text-brand-blue-700 hover:underline" to="/results">
                Back to results
              </Link>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3 pb-20">
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-neutral-800">{doctor.name}</div>
                  <div className="text-sm text-neutral-700">{doctor.specialty}</div>
                  <div className="mt-1 text-xs text-neutral-600">
                    ★ {doctor.ratingAverage.toFixed(1)} ({doctor.ratingCount}) • {doctor.distanceKm.toFixed(1)} km
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-700">
                    <span className="rounded-full bg-neutral-100 px-2 py-1">{doctor.insurance}</span>
                    {doctor.videoAvailable ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-1">Video possible</span>
                    ) : null}
                    <span className="rounded-full bg-neutral-100 px-2 py-1">
                      {doctor.languages.join(', ').toUpperCase()}
                    </span>
                  </div>
                </div>
                {/* Business intent: photo placeholder keeps layout similar to mobile cards. */}
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-neutral-100" aria-hidden="true" />
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold text-neutral-800">About</div>
                <div className="mt-1 text-sm text-neutral-700">{doctor.about}</div>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-sm font-semibold text-neutral-800">Services</div>
              <div className="mt-3 space-y-3">
                {doctor.services.map((s) => (
                  <div key={s.title} className="rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-sm font-semibold text-neutral-800">{s.title}</div>
                    <div className="mt-1 text-sm text-neutral-700">{s.description}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="text-sm font-semibold text-neutral-800">Location</div>
              <div className="mt-2 text-sm text-neutral-700">
                {doctor.address.street}, {doctor.address.postalCode} {doctor.address.city}
              </div>
              {/* Business intent: map preview is represented as a tappable placeholder. */}
              <a
                className="mt-3 block rounded-2xl border border-neutral-200 bg-neutral-100 p-4 text-sm font-semibold text-neutral-800 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${doctor.address.street}, ${doctor.address.postalCode} ${doctor.address.city}`,
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Open map preview →
              </a>
            </CardBody>
          </Card>

          <Card className="rounded-2xl">
            <CardBody className="px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-neutral-800">Reviews</div>
                {doctorReviews.length ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue-500 rounded-md"
                    onClick={() => setShowAllReviews((v) => !v)}
                  >
                    {showAllReviews ? 'Show less' : 'All reviews'}
                  </button>
                ) : null}
              </div>

              {doctorReviews.length ? (
                <div className="mt-3 space-y-3">
                  {(showAllReviews ? doctorReviews : doctorReviews.slice(0, 3)).map((r) => (
                    <div key={r.id} className="rounded-xl border border-neutral-200 bg-white p-3">
                      <div className="flex items-center justify-between text-xs text-neutral-600">
                        <span>★ {r.rating}</span>
                        <span>{formatGermanDate(new Date(r.dateISO))}</span>
                      </div>
                      <div className="mt-2 text-sm text-neutral-700">
                        {(() => {
                          const expanded = !!expandedReviewIds[r.id]
                          const { short, truncated } = truncateReview(r.text, 140)
                          return (
                            <>
                              <div>{expanded || !truncated ? r.text : short}</div>
                              {truncated ? (
                                <button
                                  type="button"
                                  className="mt-2 rounded-md text-sm font-semibold text-brand-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                                  onClick={() =>
                                    setExpandedReviewIds((prev) => ({
                                      ...prev,
                                      [r.id]: !prev[r.id],
                                    }))
                                  }
                                >
                                  {/* Business intent: explicit expand control to match “Mehr lesen” AC (BOOK-009). */}
                                  {expanded ? 'Weniger' : 'Mehr lesen'}
                                </button>
                              ) : null}
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-neutral-600">No reviews yet.</div>
              )}
            </CardBody>
          </Card>

          {/* Business intent: sticky CTA mirrors mobile booking affordance (BOOK-007). */}
          <div className="fixed bottom-0 left-0 right-0 z-20">
            <div className="mx-auto w-full max-w-[420px] border-t border-neutral-200 bg-white/90 p-4 backdrop-blur">
              <Button
                className="w-full rounded-xl py-3"
                onClick={() => navigate(`/doctor/${doctor.id}/schedule`)}
              >
                Book appointment
              </Button>
              <div className="mt-2 text-center text-xs text-neutral-600">Powered by Curaay</div>
            </div>
          </div>
        </div>
      )}
    </MobileShell>
  )
}


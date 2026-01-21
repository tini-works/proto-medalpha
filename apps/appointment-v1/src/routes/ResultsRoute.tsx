import { Button, Card, CardBody } from '@meda/ui'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import {
  readResultsCache,
  resolveVisibleDoctors,
  writeResultsCache,
  type ResultsCachePayload,
} from '../domain/cache'
import { filterDoctors, getDefaultFilters, sortDoctors, type SortKey } from '../domain/results'
import { formatGermanDate, formatGermanTime } from '../domain/format'
import type { ResultsFilters } from '../domain/results'
import type { Doctor, InsuranceType } from '../domain/types'
import { doctors as allDoctors } from '../mock/doctors'
import { generateWeekSlots } from '../mock/slots'
import { useOnlineStatus } from '../state/connectivity'
import { useLocalStorageState } from '../state/useLocalStorageState'

export function ResultsRoute() {
  const navigate = useNavigate()
  const online = useOnlineStatus()

  const [specialty] = useLocalStorageState('ab.search.specialty', '')
  const [location] = useLocalStorageState('ab.search.location', 'Berlin')
  const [insurance] = useLocalStorageState<InsuranceType>('ab.search.insurance', 'GKV')

  const [filters, setFilters] = useLocalStorageState<ResultsFilters>(
    'ab.results.filters',
    getDefaultFilters(),
  )
  const [sort, setSort] = useLocalStorageState<SortKey>('ab.results.sort', 'soonest')
  const [showFilters, setShowFilters] = useState(false)

  const weekStartISO = useMemo(() => {
    // Business intent: stable “current week” anchor for the demo.
    const now = new Date()
    const day = now.getDay() // 0..6 (Sun..Sat)
    const diffToMonday = (day + 6) % 7
    const monday = new Date(now)
    monday.setDate(now.getDate() - diffToMonday)
    const y = monday.getFullYear()
    const m = String(monday.getMonth() + 1).padStart(2, '0')
    const d = String(monday.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }, [])

  const cached = useMemo(() => {
    // Business intent: re-check cache when connectivity changes (BOOK-020).
    return readResultsCache()
  }, [online])

  const slotsByDoctorId = useMemo(() => {
    /**
     * Business intent: generate and cache slots so the booking flow stays usable
     * offline for 5 minutes (BOOK-020).
     */
    if (!online && cached && cached.weekStartISO === weekStartISO) return cached.slotsByDoctorId

    const out: ResultsCachePayload['slotsByDoctorId'] = {}
    for (const d of allDoctors) {
      out[d.id] = generateWeekSlots({
        doctorId: d.id,
        weekStartISO,
        days: 5,
        startHour: 9,
        endHour: 17,
        durationMin: 30,
        cadenceMin: 30,
      })
    }
    return out
  }, [cached, online, weekStartISO])

  const { visibleDoctors, blockedByInsurance } = useMemo(() => {
    /**
     * Business intent: when offline, show last cached visible doctors (fresh ≤ 5 min).
     * When online, compute fresh results and write cache for later offline use.
     */
    if (!online) {
      if (!cached || cached.weekStartISO !== weekStartISO) return { visibleDoctors: [] as Doctor[], blockedByInsurance: [] as Doctor[] }
      const cachedDoctors = resolveVisibleDoctors({
        allDoctors,
        visibleDoctorIds: cached.visibleDoctorIds,
      })
      return { visibleDoctors: cachedDoctors, blockedByInsurance: [] as Doctor[] }
    }

    const { visible, blockedByInsurance } = filterDoctors({
      doctors: allDoctors,
      specialtyQuery: specialty,
      insurance,
      filters,
    })

    const enriched = visible.map((d) => {
      const slots = slotsByDoctorId[d.id] ?? []
      const nextStartISO = slots[0]?.startISO
      return { ...d, __nextSlotStartISO: nextStartISO }
    })

    const sorted = sortDoctors(enriched, sort)

    writeResultsCache({
      weekStartISO,
      visibleDoctorIds: sorted.map((d) => d.id),
      slotsByDoctorId,
    })

    return { visibleDoctors: sorted, blockedByInsurance }
  }, [cached, filters, insurance, online, sort, specialty, slotsByDoctorId, weekStartISO])

  const banner = !online ? (
    <div className="rounded-xl border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-700">
      {/* Business intent: clear offline indicator (BOOK-020). */}
      You’re offline. Showing cached results from the last 5 minutes where possible.
    </div>
  ) : null

  function openQuickConfirm(params: { doctor: Doctor; slotId: string }) {
    // Business intent: quick-book should keep the user in context (bottom-sheet later).
    const { doctor, slotId } = params
    const slots = slotsByDoctorId[doctor.id] ?? []
    const slot = slots.find((s) => s.id === slotId)
    if (!slot) return

    localStorage.setItem('ab.selection.doctorId', doctor.id)
    localStorage.setItem('ab.selection.slotId', slot.id)
    navigate('/confirm')
  }

  return (
    <MobileShell
      title="Results"
      step={{ current: 2, total: 4 }}
      banner={banner}
      rightSlot={
        <Link
          to="/search"
          className="rounded-md px-2 py-2 text-sm font-semibold text-brand-blue-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
        >
          Edit
        </Link>
      }
    >
      <div className="space-y-3">
        <Card className="rounded-2xl">
          <CardBody className="px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-800">
                  {specialty ? specialty : 'Any specialty'}
                </div>
                <div className="text-xs text-neutral-600">
                  {location} • Insurance: {insurance}
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                onClick={() => setShowFilters(true)}
              >
                Filters
                <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700">
                  {[
                    filters.gkvOnly ? 1 : 0,
                    filters.videoOnly ? 1 : 0,
                    filters.language ? 1 : 0,
                    filters.maxDistanceKm !== 10 ? 1 : 0,
                    filters.minRating !== 0 ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </span>
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={[
                  'flex-1 rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                  sort === 'soonest'
                    ? 'border-brand-blue-500 bg-brand-mint-100'
                    : 'border-neutral-300 bg-white hover:bg-neutral-100',
                ].join(' ')}
                onClick={() => setSort('soonest')}
              >
                Soonest
              </button>
              <button
                type="button"
                className={[
                  'flex-1 rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                  sort === 'distance'
                    ? 'border-brand-blue-500 bg-brand-mint-100'
                    : 'border-neutral-300 bg-white hover:bg-neutral-100',
                ].join(' ')}
                onClick={() => setSort('distance')}
              >
                Distance
              </button>
              <button
                type="button"
                className={[
                  'flex-1 rounded-xl border px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                  sort === 'rating'
                    ? 'border-brand-blue-500 bg-brand-mint-100'
                    : 'border-neutral-300 bg-white hover:bg-neutral-100',
                ].join(' ')}
                onClick={() => setSort('rating')}
              >
                Rating
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Business intent: warn when insurance filter removes doctors entirely (BOOK-003). */}
        {insurance === 'GKV' && filters.gkvOnly && !visibleDoctors.length && blockedByInsurance.length ? (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-neutral-800">
            No results match your insurance filter. Try turning off “GKV only”.
          </div>
        ) : null}

        {/* Business intent: loading skeleton instead of spinner (BOOK-020). */}
        {!online ? null : (
          <div className="sr-only">Results loaded</div>
        )}

        {visibleDoctors.length ? (
          <div className="space-y-3">
            {visibleDoctors.map((doctor) => {
              const slots = slotsByDoctorId[doctor.id] ?? []
              const nextSlots = slots.slice(0, 3)
              return (
                <Card key={doctor.id} className="rounded-2xl">
                  <CardBody className="px-4 py-4">
                    <Link
                      to={`/doctor/${doctor.id}`}
                      className="block focus:outline-none focus:ring-2 focus:ring-brand-blue-500 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-base font-semibold text-neutral-800">
                            {doctor.name}
                          </div>
                          <div className="text-sm text-neutral-700">{doctor.specialty}</div>
                          <div className="mt-1 text-xs text-neutral-600">
                            {doctor.address.city} • {doctor.distanceKm.toFixed(1)} km • ★{' '}
                            {doctor.ratingAverage.toFixed(1)} ({doctor.ratingCount})
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-700">
                            <span className="rounded-full bg-neutral-100 px-2 py-1">
                              {doctor.insurance}
                            </span>
                            {doctor.videoAvailable ? (
                              <span className="rounded-full bg-neutral-100 px-2 py-1">
                                Video possible
                              </span>
                            ) : null}
                            <span className="rounded-full bg-neutral-100 px-2 py-1">
                              {doctor.languages.join(', ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <div className="mt-4">
                      <div className="text-xs font-semibold text-neutral-700">
                        Next available
                      </div>
                      <div className="mt-2 flex gap-2">
                        {nextSlots.map((slot) => {
                          const d = new Date(slot.startISO)
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              className="flex-1 rounded-xl bg-[#FFC603] px-2 py-2 text-sm font-semibold text-neutral-900 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                              onClick={() => openQuickConfirm({ doctor, slotId: slot.id })}
                            >
                              <div className="text-xs font-normal">{formatGermanDate(d)}</div>
                              <div>{formatGermanTime(d)}</div>
                            </button>
                          )
                        })}
                      </div>
                      <div className="mt-2">
                        <Link
                          to={`/doctor/${doctor.id}/schedule`}
                          className="text-sm font-semibold text-brand-blue-700 hover:underline"
                        >
                          Mehr Termine →
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="rounded-2xl">
            <CardBody className="px-4 py-6 text-center">
              <div className="text-base font-semibold text-neutral-800">No results</div>
              <div className="mt-1 text-sm text-neutral-600">
                {online
                  ? 'Try changing your filters or search terms.'
                  : 'No cached results are available offline. Please reconnect and retry.'}
              </div>
              <div className="mt-4">
                {online ? (
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl py-3"
                    onClick={() => setShowFilters(true)}
                  >
                    Adjust filters
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl py-3"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {showFilters ? (
        <FiltersSheet
          value={filters}
          onClose={() => setShowFilters(false)}
          onChange={(next) => setFilters(next)}
          insurance={insurance}
        />
      ) : null}
    </MobileShell>
  )
}

function FiltersSheet(props: {
  value: ResultsFilters
  insurance: InsuranceType
  onChange: (next: ResultsFilters) => void
  onClose: () => void
}) {
  const { value, onChange, onClose, insurance } = props
  const [draft, setDraft] = useState<ResultsFilters>(value)

  function apply() {
    onChange(draft)
    onClose()
  }

  function clearAll() {
    onChange(getDefaultFilters())
    onClose()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // Business intent: allow keyboard users to dismiss the sheet (basic accessibility).
    if (e.key === 'Escape') onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      className="fixed inset-0 z-50 flex items-end bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-t-2xl bg-white p-4 shadow-xl"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Business intent: bottom-sheet style filters for mobile ergonomics. */}
        <div className="flex items-center justify-between">
          <div className="text-base font-semibold text-neutral-800">Filters</div>
          <button
            type="button"
            className="rounded-md px-2 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {insurance === 'GKV' ? (
            <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-3">
              <div>
                <div className="text-sm font-semibold text-neutral-800">GKV only</div>
                <div className="text-xs text-neutral-600">Hide private-only doctors</div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5"
                checked={draft.gkvOnly}
                onChange={(e) => setDraft({ ...draft, gkvOnly: e.target.checked })}
              />
            </label>
          ) : null}

          <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-3 py-3">
            <div>
              <div className="text-sm font-semibold text-neutral-800">Video available</div>
              <div className="text-xs text-neutral-600">Only show doctors offering video</div>
            </div>
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={draft.videoOnly}
              onChange={(e) => setDraft({ ...draft, videoOnly: e.target.checked })}
            />
          </label>

          <div className="rounded-xl border border-neutral-200 px-3 py-3">
            <div className="text-sm font-semibold text-neutral-800">Max distance</div>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-600">
              <span>{draft.maxDistanceKm} km</span>
              <span>10 km default</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={draft.maxDistanceKm}
              className="mt-2 w-full"
              onChange={(e) => setDraft({ ...draft, maxDistanceKm: Number(e.target.value) })}
            />
          </div>

          <div className="rounded-xl border border-neutral-200 px-3 py-3">
            <div className="text-sm font-semibold text-neutral-800">Minimum rating</div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[0, 3.5, 4.0, 4.5].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={[
                    'rounded-xl border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                    draft.minRating === v
                      ? 'border-brand-blue-500 bg-brand-mint-100'
                      : 'border-neutral-300 bg-white hover:bg-neutral-100',
                  ].join(' ')}
                  onClick={() => setDraft({ ...draft, minRating: v })}
                >
                  {v === 0 ? 'Any' : `★ ${v}`}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 px-3 py-3">
            <div className="text-sm font-semibold text-neutral-800">Language</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                { id: undefined, label: 'Any' },
                { id: 'de', label: 'DE' },
                { id: 'en', label: 'EN' },
                { id: 'tr', label: 'TR' },
                { id: 'ar', label: 'AR' },
                { id: 'ru', label: 'RU' },
              ].map((opt) => (
                <button
                  key={String(opt.id)}
                  type="button"
                  className={[
                    'rounded-xl border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                    draft.language === opt.id
                      ? 'border-brand-blue-500 bg-brand-mint-100'
                      : 'border-neutral-300 bg-white hover:bg-neutral-100',
                  ].join(' ')}
                  onClick={() => setDraft({ ...draft, language: opt.id as any })}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="w-full rounded-xl py-3" onClick={clearAll}>
            Clear all
          </Button>
          <Button className="w-full rounded-xl py-3" onClick={apply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}


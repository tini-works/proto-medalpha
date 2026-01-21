import { Button } from '@meda/ui'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileShell } from '../components/Layout/MobileShell'
import type { InsuranceType } from '../domain/types'
import { specialtyChips } from '../mock/specialties'
import { useLocalStorageState } from '../state/useLocalStorageState'

export function SearchRoute() {
  const navigate = useNavigate()
  const [specialty, setSpecialty] = useLocalStorageState('ab.search.specialty', '')
  const [location, setLocation] = useLocalStorageState('ab.search.location', 'Berlin')
  const [insurance, setInsurance] = useLocalStorageState<InsuranceType>(
    'ab.search.insurance',
    'GKV',
  )
  const [recent, setRecent] = useLocalStorageState<string[]>('ab.search.recent', [])
  const [typing, setTyping] = useState('')

  const suggestions = useMemo(() => {
    const q = typing.trim().toLowerCase()
    if (q.length < 2) return []
    const all = Array.from(new Set([...specialtyChips, 'Dermatologe', 'HNO', 'Kinderarzt']))
    return all.filter((s) => s.toLowerCase().includes(q)).slice(0, 6)
  }, [typing])

  function commitRecent(value: string) {
    const v = value.trim()
    if (!v) return
    const next = [v, ...recent.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 5)
    setRecent(next)
  }

  function onContinue() {
    commitRecent(specialty)
    navigate('/results')
  }

  return (
    <MobileShell
      title="Book an appointment"
      step={{ current: 1, total: 4 }}
      bottomBar={
        <div className="border-t border-neutral-200 bg-white/90 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 backdrop-blur">
          <Button onClick={onContinue} className="w-full rounded-xl py-3">
            {/* Business intent: primary CTA for Sarah’s “<2 min” flow. */}
            Search appointments
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <label className="block text-sm font-semibold text-neutral-800">
            Specialty
          </label>
          <p className="mt-1 text-xs text-neutral-600">
            Start typing (2+ chars) to see suggestions. Supports German terms like “HNO”.
          </p>
          <input
            className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
            value={specialty}
            onChange={(e) => {
              setSpecialty(e.target.value)
              setTyping(e.target.value)
            }}
            placeholder="e.g. Dermatology, HNO, Pediatrics"
            aria-label="Specialty"
          />

          {suggestions.length ? (
            <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 p-2">
              <div className="text-xs font-semibold text-neutral-700">
                Suggestions
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    onClick={() => {
                      setSpecialty(s)
                      setTyping('')
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4">
            <div className="text-xs font-semibold text-neutral-700">Common</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {specialtyChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  onClick={() => setSpecialty(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <label className="block text-sm font-semibold text-neutral-800">
            Location
          </label>
          <p className="mt-1 text-xs text-neutral-600">
            For the prototype, “Use current location” simulates GPS selection.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or postal code"
              aria-label="Location"
            />
            <button
              type="button"
              className="shrink-0 rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
              onClick={() => setLocation('Berlin (GPS)')}
            >
              Use GPS
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <label className="block text-sm font-semibold text-neutral-800">
            Insurance
          </label>
          <p className="mt-1 text-xs text-neutral-600">
            Used to filter eligible doctors (GKV/PKV).
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className={[
                'rounded-xl border px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                insurance === 'GKV'
                  ? 'border-brand-blue-500 bg-brand-mint-100'
                  : 'border-neutral-300 bg-white hover:bg-neutral-100',
              ].join(' ')}
              onClick={() => setInsurance('GKV')}
            >
              GKV (public)
            </button>
            <button
              type="button"
              className={[
                'rounded-xl border px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-blue-500',
                insurance === 'PKV'
                  ? 'border-brand-blue-500 bg-brand-mint-100'
                  : 'border-neutral-300 bg-white hover:bg-neutral-100',
              ].join(' ')}
              onClick={() => setInsurance('PKV')}
            >
              PKV (private)
            </button>
          </div>
        </div>

        {recent.length ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-sm font-semibold text-neutral-800">
              Recent searches
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {recent.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                  onClick={() => setSpecialty(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </MobileShell>
  )
}


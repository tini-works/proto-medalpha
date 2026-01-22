export type Doctor = {
  id: string
  name: string
  specialty: string
  city: string
  address: string
  rating: number
  reviewCount: number
  accepts: Array<'GKV' | 'PKV'>
  nextAvailableISO: string
}

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Anna Wagner',
    specialty: 'Primary care',
    city: 'Berlin',
    address: 'Friedrichstraße 120',
    rating: 4.6,
    reviewCount: 214,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: '2026-01-26',
  },
  {
    id: 'd2',
    name: 'Dr. Murat Yilmaz',
    specialty: 'Dermatology',
    city: 'Berlin',
    address: 'Kantstraße 22',
    rating: 4.4,
    reviewCount: 98,
    accepts: ['PKV'],
    nextAvailableISO: '2026-01-29',
  },
  {
    id: 'd3',
    name: 'Dr. Lea Schneider',
    specialty: 'Internal medicine',
    city: 'Potsdam',
    address: 'Hegelallee 8',
    rating: 4.7,
    reviewCount: 156,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: '2026-01-28',
  },
]

export const timeSlotsByDoctorId: Record<string, Array<{ dateISO: string; slots: string[] }>> = {
  d1: [
    { dateISO: '2026-01-26', slots: ['09:10', '10:20', '11:30'] },
    { dateISO: '2026-01-27', slots: ['08:40', '09:50', '14:10'] },
  ],
  d2: [
    { dateISO: '2026-01-29', slots: ['12:00', '12:20', '13:40'] },
    { dateISO: '2026-01-30', slots: ['09:00', '10:00'] },
  ],
  d3: [
    { dateISO: '2026-01-28', slots: ['08:20', '09:10', '15:30'] },
    { dateISO: '2026-01-31', slots: ['10:10', '11:10'] },
  ],
}

export function formatDate(dateISO: string) {
  const d = new Date(`${dateISO}T12:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })
}

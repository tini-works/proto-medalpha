export type Store = {
  id: string
  name: string
  type: 'dm' | 'pharmacy'
  address: string
  city: string
  openNow: boolean
  distanceKm: number
}

export const stores: Store[] = [
  { id: 's1', name: 'dm-drogerie markt', type: 'dm', address: 'Alexanderplatz 3', city: 'Berlin', openNow: true, distanceKm: 1.2 },
  { id: 's2', name: 'Apotheke am Hackeschen Markt', type: 'pharmacy', address: 'Rosenthaler Str. 10', city: 'Berlin', openNow: false, distanceKm: 2.4 },
  { id: 's3', name: 'dm-drogerie markt', type: 'dm', address: 'Schloßstraße 36', city: 'Berlin', openNow: true, distanceKm: 4.8 },
]


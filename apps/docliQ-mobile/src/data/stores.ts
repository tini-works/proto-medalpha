import type { Store } from '../types'

export const stores: Store[] = [
  {
    id: 's1',
    name: 'dm-drogerie markt Alexanderplatz',
    type: 'dm',
    address: 'Alexanderplatz 3, 10178 Berlin',
    city: 'Berlin',
    openNow: true,
    distanceKm: 0.8,
    services: ['blood-pressure', 'vitamin-check', 'beauty-consultation'],
  },
  {
    id: 's2',
    name: 'dm-drogerie markt Friedrichstrasse',
    type: 'dm',
    address: 'Friedrichstrasse 90, 10117 Berlin',
    city: 'Berlin',
    openNow: true,
    distanceKm: 1.2,
    services: ['blood-pressure', 'skin-analysis', 'beauty-consultation'],
  },
  {
    id: 's3',
    name: 'Adler Apotheke',
    type: 'pharmacy',
    address: 'Kurfürstendamm 15, 10719 Berlin',
    city: 'Berlin',
    openNow: true,
    distanceKm: 2.1,
    services: ['prescription-pickup', 'vaccination', 'health-advice'],
  },
  {
    id: 's4',
    name: 'dm-drogerie markt Marienplatz',
    type: 'dm',
    address: 'Marienplatz 1, 80331 Munich',
    city: 'Munich',
    openNow: false,
    distanceKm: 0.5,
    services: ['blood-pressure', 'beauty-consultation', 'allergy-test'],
  },
  {
    id: 's5',
    name: 'Rathaus Apotheke',
    type: 'pharmacy',
    address: 'Rathaus-Gasse 4, 80331 Munich',
    city: 'Munich',
    openNow: true,
    distanceKm: 0.7,
    services: ['prescription-pickup', 'vaccination', 'medication-review'],
  },
]

export function searchStores(filters: { city?: string; type?: 'dm' | 'pharmacy' }): Store[] {
  return stores.filter((s) => {
    if (filters.city && !s.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }
    if (filters.type && s.type !== filters.type) {
      return false
    }
    return true
  })
}

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id)
}

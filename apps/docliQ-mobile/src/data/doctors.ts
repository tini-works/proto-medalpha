import type { Doctor } from '../types'

function nextDateISO(daysFromNow: number) {
  const d = new Date()
  d.setDate(d.getDate() + Math.max(0, daysFromNow))
  return d.toISOString().split('T')[0]
}

export const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Anna Wagner',
    specialty: 'Primary care',
    city: 'Berlin',
    address: 'Friedrichstrasse 120, 10117 Berlin',
    rating: 4.6,
    reviewCount: 214,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: nextDateISO(1),
    imageUrl: undefined,
    about:
      'Dr. Wagner is a board-certified general practitioner with over 15 years of experience. She specializes in preventive care and chronic disease management.',
    languages: ['German', 'English'],
  },
  {
    id: 'd2',
    name: 'Dr. Michael Schmidt',
    specialty: 'Cardiology',
    city: 'Berlin',
    address: 'Kurfürstendamm 45, 10719 Berlin',
    rating: 4.8,
    reviewCount: 156,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: nextDateISO(3),
    imageUrl: undefined,
    about:
      'Dr. Schmidt is a cardiologist specializing in heart disease prevention and treatment. He uses the latest diagnostic technologies.',
    languages: ['German', 'English', 'French'],
  },
  {
    id: 'd3',
    name: 'Dr. Elena Bauer',
    specialty: 'Dermatology',
    city: 'Munich',
    address: 'Maximilianstrasse 22, 80539 Munich',
    rating: 4.9,
    reviewCount: 312,
    accepts: ['PKV'],
    nextAvailableISO: nextDateISO(2),
    imageUrl: undefined,
    about:
      'Dr. Bauer specializes in both medical and cosmetic dermatology, with expertise in acne treatment and skin cancer screening.',
    languages: ['German', 'English', 'Italian'],
  },
  {
    id: 'd4',
    name: 'Dr. Thomas Müller',
    specialty: 'Pediatrics',
    city: 'Hamburg',
    address: 'Jungfernstieg 30, 20354 Hamburg',
    rating: 4.7,
    reviewCount: 189,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: nextDateISO(2),
    imageUrl: undefined,
    about:
      'Dr. Müller is a pediatrician with a gentle approach to child healthcare. He focuses on developmental milestones and preventive care.',
    languages: ['German', 'English'],
  },
  {
    id: 'd5',
    name: 'Dr. Sarah Klein',
    specialty: 'Orthopedics',
    city: 'Frankfurt',
    address: 'Goethestrasse 15, 60313 Frankfurt',
    rating: 4.5,
    reviewCount: 98,
    accepts: ['GKV'],
    nextAvailableISO: nextDateISO(4),
    imageUrl: undefined,
    about:
      'Dr. Klein specializes in sports medicine and joint problems. She works with amateur and professional athletes.',
    languages: ['German', 'English', 'Spanish'],
  },
  {
    id: 'd6',
    name: 'Dr. Hans Weber',
    specialty: 'Primary care',
    city: 'Berlin',
    address: 'Unter den Linden 50, 10117 Berlin',
    rating: 4.4,
    reviewCount: 276,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: nextDateISO(1),
    imageUrl: undefined,
    about: 'Dr. Weber provides comprehensive primary care services with a focus on preventive health and wellness.',
    languages: ['German'],
  },
  {
    id: 'd7',
    name: 'Dr. Lisa Fischer',
    specialty: 'Gynecology',
    city: 'Munich',
    address: 'Leopoldstrasse 80, 80802 Munich',
    rating: 4.8,
    reviewCount: 203,
    accepts: ['GKV', 'PKV'],
    nextAvailableISO: nextDateISO(5),
    imageUrl: undefined,
    about:
      "Dr. Fischer specializes in women's health, including prenatal care, fertility consultations, and preventive screenings.",
    languages: ['German', 'English'],
  },
  {
    id: 'd8',
    name: 'Dr. Peter Hoffmann',
    specialty: 'Ophthalmology',
    city: 'Cologne',
    address: 'Hohenzollernring 12, 50672 Cologne',
    rating: 4.6,
    reviewCount: 145,
    accepts: ['PKV'],
    nextAvailableISO: nextDateISO(6),
    imageUrl: undefined,
    about:
      'Dr. Hoffmann is an eye specialist with expertise in cataract surgery and treatment of age-related eye conditions.',
    languages: ['German', 'English'],
  },
  // Additional mock doctors for richer result sets and filter combinations
  ...((): Doctor[] => {
    const cities = [
      { city: 'Berlin', postal: '10117' },
      { city: 'Munich', postal: '80331' },
      { city: 'Hamburg', postal: '20095' },
      { city: 'Frankfurt', postal: '60311' },
      { city: 'Cologne', postal: '50667' },
      { city: 'Stuttgart', postal: '70173' },
      { city: 'Düsseldorf', postal: '40213' },
      { city: 'Leipzig', postal: '04109' },
    ]

    const specialties = [
      'Primary care',
      'Cardiology',
      'Dermatology',
      'Gynecology',
      'Orthopedics',
      'Pediatrics',
      'Ophthalmology',
      'Dentistry',
      'ENT (HNO)',
      'Neurology',
      'Psychiatry',
      'Gastroenterology',
      'Pulmonology',
    ]

    const languagesPool = ['German', 'English', 'French', 'Spanish', 'Italian', 'Turkish', 'Arabic', 'Polish']
    const acceptsPool: Array<Doctor['accepts']> = [['GKV'], ['PKV'], ['GKV', 'PKV']]

    const names = [
      'Dr. Marie Schneider',
      'Dr. Jonas Neumann',
      'Dr. Sophia Becker',
      'Dr. Leon Wagner',
      'Dr. Emilia Hoffmann',
      'Dr. Noah Koch',
      'Dr. Mia Richter',
      'Dr. Elias Wolf',
      'Dr. Hannah Braun',
      'Dr. Paul Krüger',
      'Dr. Lina Mayer',
      'Dr. Felix Schulz',
      'Dr. Clara Zimmermann',
      'Dr. Luca Hartmann',
      'Dr. Laura Krause',
      'Dr. Tim Sommer',
      'Dr. Jana Peters',
      'Dr. Moritz Fuchs',
      'Dr. Nina König',
      'Dr. Erik Lange',
      'Dr. Sara Brandt',
      'Dr. David Otto',
      'Dr. Alina Busch',
      'Dr. Philipp Seidel',
    ]

    const pick = <T,>(arr: T[], idx: number) => arr[idx % arr.length]
    const pickSome = (arr: string[], idx: number) => {
      const a = arr[idx % arr.length]
      const b = arr[(idx + 3) % arr.length]
      const c = arr[(idx + 5) % arr.length]
      const set = new Set<string>(['German', a, b, c])
      return Array.from(set).slice(0, 3)
    }

    return names.map((name, i) => {
      const idNum = 9 + i
      const { city, postal } = pick(cities, idNum)
      const specialty = pick(specialties, idNum)
      const accepts = pick(acceptsPool, idNum)

      // Ratings span to support min-rating filtering.
      const rating = Number((3.2 + ((idNum * 7) % 18) / 10).toFixed(1)) // 3.2..5.0
      const reviewCount = 20 + ((idNum * 37) % 420)

      return {
        id: `d${idNum}`,
        name,
        specialty,
        city,
        address: `Hauptstrasse ${10 + (idNum % 40)}, ${postal} ${city}`,
        rating,
        reviewCount,
        accepts,
        nextAvailableISO: nextDateISO(1 + (idNum % 10)),
        imageUrl: undefined,
        about: `Focus areas include ${specialty.toLowerCase()} consultations with a patient-centered approach.`,
        languages: pickSome(languagesPool, idNum),
      }
    })
  })(),
]

export function searchDoctors(filters: {
  specialty?: string
  city?: string
  insuranceType?: 'GKV' | 'PKV' | ''
}): Doctor[] {
  const knownCities = Array.from(new Set(doctors.map((d) => d.city.toLowerCase())))

  const normalizeCityQuery = (q?: string) => {
    const raw = (q || '').toLowerCase().trim()
    if (!raw) return ''
    if (raw.includes('current location') || raw.includes('aktueller standort')) return ''

    // If the query is a full address, try to extract a known city name.
    // If no known city is found, skip city filtering (return empty string).
    const match = knownCities.find((c) => raw.includes(c))
    return match || ''
  }

  return doctors.filter((d) => {
    if (filters.specialty && !d.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) {
      return false
    }
    const cityQuery = normalizeCityQuery(filters.city)
    if (cityQuery && !d.city.toLowerCase().includes(cityQuery)) return false
    if (filters.insuranceType && !d.accepts.includes(filters.insuranceType)) {
      return false
    }
    return true
  })
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id)
}

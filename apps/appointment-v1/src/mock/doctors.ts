import type { Doctor } from '../domain/types'

// Business intent: deterministic fixture data for consistent demos and screenshots.
export const doctors: Doctor[] = [
  {
    id: 'doc_anna_schmidt',
    name: 'Dr. Anna Schmidt',
    specialty: 'ENT (HNO)',
    address: {
      street: 'Friedrichstraße 12',
      city: 'Berlin',
      postalCode: '10117',
      country: 'DE',
    },
    distanceKm: 2.3,
    ratingAverage: 4.6,
    ratingCount: 214,
    insurance: 'Beides',
    videoAvailable: true,
    languages: ['de', 'en'],
    about:
      'Specialized in ENT with a focus on fast diagnostics and clear treatment plans.',
    services: [
      {
        title: 'Acute ENT consultation',
        description: 'Assessment of infections, allergies, and ear pain.',
      },
      {
        title: 'Hearing check',
        description: 'Basic hearing assessment and follow-up recommendations.',
      },
    ],
  },
  {
    id: 'doc_lukas_meier',
    name: 'Dr. Lukas Meier',
    specialty: 'Dermatology',
    address: {
      street: 'Königsallee 5',
      city: 'Düsseldorf',
      postalCode: '40212',
      country: 'DE',
    },
    distanceKm: 6.8,
    ratingAverage: 4.2,
    ratingCount: 88,
    insurance: 'Kasse',
    videoAvailable: false,
    languages: ['de', 'en', 'tr'],
    about:
      'Dermatology practice with emphasis on preventive screenings and clear communication.',
    services: [
      {
        title: 'Skin screening',
        description: 'Preventive examination for early detection.',
      },
      {
        title: 'Acne consultation',
        description: 'Treatment planning for persistent acne.',
      },
    ],
  },
  {
    id: 'doc_samira_hassan',
    name: 'Dr. Samira Hassan',
    specialty: 'Pediatrics',
    address: {
      street: 'Domstraße 1',
      city: 'Köln',
      postalCode: '50667',
      country: 'DE',
    },
    distanceKm: 9.9,
    ratingAverage: 4.9,
    ratingCount: 312,
    insurance: 'Beides',
    videoAvailable: true,
    languages: ['de', 'en', 'ar'],
    about:
      'Pediatrics with a calm, child-friendly approach and time for questions.',
    services: [
      {
        title: 'Check-ups (U-Untersuchungen)',
        description: 'Routine check-ups for children and adolescents.',
      },
      {
        title: 'Vaccinations',
        description: 'Consultation and administration with clear guidance.',
      },
    ],
  },
  {
    id: 'doc_private_only',
    name: 'Dr. Privat Beispiel',
    specialty: 'Orthopedics',
    address: {
      street: 'Maximilianstraße 9',
      city: 'München',
      postalCode: '80539',
      country: 'DE',
    },
    distanceKm: 3.4,
    ratingAverage: 4.4,
    ratingCount: 41,
    insurance: 'Privat',
    videoAvailable: false,
    languages: ['de', 'en', 'ru'],
    about:
      'Orthopedics focused on sports injuries and movement diagnostics (private only).',
    services: [
      {
        title: 'Sports injury consult',
        description: 'Assessment and treatment planning for acute injuries.',
      },
    ],
  },
]


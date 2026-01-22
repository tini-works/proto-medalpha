import type { Doctor } from '../types'

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
    nextAvailableISO: '2026-01-26',
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
    nextAvailableISO: '2026-01-28',
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
    nextAvailableISO: '2026-01-24',
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
    nextAvailableISO: '2026-01-25',
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
    nextAvailableISO: '2026-01-27',
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
    nextAvailableISO: '2026-01-24',
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
    nextAvailableISO: '2026-01-29',
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
    nextAvailableISO: '2026-01-30',
    imageUrl: undefined,
    about:
      'Dr. Hoffmann is an eye specialist with expertise in cataract surgery and treatment of age-related eye conditions.',
    languages: ['German', 'English'],
  },
]

export function searchDoctors(filters: {
  specialty?: string
  city?: string
  insuranceType?: 'GKV' | 'PKV' | ''
}): Doctor[] {
  return doctors.filter((d) => {
    if (filters.specialty && !d.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) {
      return false
    }
    if (filters.city && !d.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }
    if (filters.insuranceType && !d.accepts.includes(filters.insuranceType)) {
      return false
    }
    return true
  })
}

export function getDoctorById(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id)
}

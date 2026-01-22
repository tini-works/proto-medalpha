export interface Doctor {
  id: string
  name: string
  specialty: string
  address: string
  city: string
  distance: number
  rating: number
  reviewCount: number
  imageUrl: string
  insuranceTypes: ('Kasse' | 'Privat')[]
  hasVideo: boolean
  languages: string[]
  about: string
  services: string[]
  availableSlots: TimeSlot[]
}

export interface TimeSlot {
  id: string
  date: string
  time: string
  duration: number
  available: boolean
}

export interface Review {
  id: string
  doctorId: string
  rating: number
  date: string
  text: string
  authorInitials: string
}

export interface Appointment {
  id: string
  doctor: Doctor
  date: string
  time: string
  duration: number
  reason?: string
  patient: string
  status: 'upcoming' | 'completed' | 'cancelled'
  confirmationNumber: string
}

export const specialties = [
  'General Medicine',
  'Dermatology',
  'Gynecology',
  'ENT (Ear, Nose, Throat)',
  'Internal Medicine',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'Psychiatry',
  'Urology',
  'Dentist',
]

export const recentSearches = [
  'Dermatology · Berlin',
  'General Practitioner · Munich',
  'ENT · Hamburg',
]

function generateSlots(startDate: Date, days: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']

  for (let d = 0; d < days; d++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + d)
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const dateStr = date.toISOString().split('T')[0]
    times.forEach((time, i) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time,
        duration: 30,
        available: Math.random() > 0.3,
      })
    })
  }
  return slots
}

const today = new Date()

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Klein',
    specialty: 'Dermatology',
    address: 'Friedrichstraße 123',
    city: 'Berlin',
    distance: 0.8,
    rating: 4.8,
    reviewCount: 124,
    imageUrl: '',
    insuranceTypes: ['Kasse', 'Privat'],
    hasVideo: true,
    languages: ['German', 'English'],
    about: 'Board-certified dermatologist specializing in skin cancer prevention and aesthetic dermatology. Over 15 years of experience.',
    services: ['Skin Cancer Screening', 'Acne Treatment', 'Allergy Testing', 'Laser Treatment'],
    availableSlots: generateSlots(today, 14),
  },
  {
    id: '2',
    name: 'Dr. Jonas Meier',
    specialty: 'Dermatology',
    address: 'Kurfürstendamm 45',
    city: 'Berlin',
    distance: 2.1,
    rating: 4.5,
    reviewCount: 89,
    imageUrl: '',
    insuranceTypes: ['Kasse'],
    hasVideo: false,
    languages: ['German'],
    about: 'Specialist in chronic skin conditions and eczema treatment.',
    services: ['Eczema Treatment', 'Psoriasis Therapy', 'Allergology'],
    availableSlots: generateSlots(today, 14),
  },
  {
    id: '3',
    name: 'Dr. Anna Weber',
    specialty: 'Dermatology',
    address: 'Alexanderplatz 10',
    city: 'Berlin',
    distance: 3.4,
    rating: 4.9,
    reviewCount: 203,
    imageUrl: '',
    insuranceTypes: ['Privat'],
    hasVideo: true,
    languages: ['German', 'English', 'French'],
    about: 'Premium dermatology with state-of-the-art treatment methods.',
    services: ['Anti-Aging', 'Botox', 'Laser Treatment', 'Skin Cancer Screening'],
    availableSlots: generateSlots(today, 14),
  },
  {
    id: '4',
    name: 'Dr. Thomas Schulz',
    specialty: 'General Medicine',
    address: 'Prenzlauer Allee 78',
    city: 'Berlin',
    distance: 1.2,
    rating: 4.7,
    reviewCount: 312,
    imageUrl: '',
    insuranceTypes: ['Kasse', 'Privat'],
    hasVideo: true,
    languages: ['German', 'Turkish'],
    about: 'Your family doctor for the whole family. Home visits available.',
    services: ['Preventive Care', 'Vaccinations', 'Health Check-up', 'Home Visits'],
    availableSlots: generateSlots(today, 14),
  },
  {
    id: '5',
    name: 'Dr. Lisa Hoffmann',
    specialty: 'ENT (Ear, Nose, Throat)',
    address: 'Schönhauser Allee 55',
    city: 'Berlin',
    distance: 1.8,
    rating: 4.6,
    reviewCount: 156,
    imageUrl: '',
    insuranceTypes: ['Kasse'],
    hasVideo: false,
    languages: ['German', 'English'],
    about: 'ENT specialist focusing on allergology and sleep medicine.',
    services: ['Hearing Test', 'Allergy Test', 'Snoring Therapy', 'Tinnitus Treatment'],
    availableSlots: generateSlots(today, 14),
  },
]

export const reviews: Review[] = [
  { id: '1', doctorId: '1', rating: 5, date: '2026-01-15', text: 'Very competent doctor, takes time for her patients. Highly recommended!', authorInitials: 'M.K.' },
  { id: '2', doctorId: '1', rating: 5, date: '2026-01-10', text: 'Friendly staff and short waiting times. Very satisfied.', authorInitials: 'S.B.' },
  { id: '3', doctorId: '1', rating: 4, date: '2026-01-05', text: 'Good consultation, modern office facilities.', authorInitials: 'A.W.' },
  { id: '4', doctorId: '2', rating: 5, date: '2026-01-12', text: 'Finally a doctor who takes my eczema seriously!', authorInitials: 'T.M.' },
  { id: '5', doctorId: '2', rating: 4, date: '2026-01-08', text: 'Competent and friendly.', authorInitials: 'L.S.' },
]

export const upcomingAppointments: Appointment[] = [
  {
    id: 'apt-1',
    doctor: doctors[0],
    date: '2026-01-25',
    time: '14:30',
    duration: 30,
    reason: 'Skin checkup',
    patient: 'Me',
    status: 'upcoming',
    confirmationNumber: 'MEDA-2026-001234',
  },
]

export const pastAppointments: Appointment[] = [
  {
    id: 'apt-2',
    doctor: doctors[3],
    date: '2026-01-10',
    time: '10:00',
    duration: 30,
    reason: 'Cold symptoms',
    patient: 'Me',
    status: 'completed',
    confirmationNumber: 'MEDA-2026-000891',
  },
  {
    id: 'apt-3',
    doctor: doctors[0],
    date: '2025-12-15',
    time: '09:30',
    duration: 30,
    reason: 'Skin cancer screening',
    patient: 'Me',
    status: 'completed',
    confirmationNumber: 'MEDA-2025-004521',
  },
]

export const familyMembers = [
  { id: 'self', name: 'Me' },
  { id: 'child1', name: 'Max (Child, 8 years)' },
  { id: 'child2', name: 'Emma (Child, 5 years)' },
]

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = []
  const start = new Date(startDate)
  start.setDate(start.getDate() - start.getDay() + 1)
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(d)
  }
  return dates
}

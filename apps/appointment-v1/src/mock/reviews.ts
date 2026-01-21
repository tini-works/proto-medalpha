import type { Review } from '../domain/types'

// Business intent: reviews must be realistic but contain no patient PII (BOOK-009).
export const reviews: Review[] = [
  {
    id: 'rev_1',
    doctorId: 'doc_anna_schmidt',
    rating: 5,
    dateISO: '2026-01-10',
    text: 'Quick appointment, clear explanations, and very friendly staff.',
  },
  {
    id: 'rev_2',
    doctorId: 'doc_anna_schmidt',
    rating: 4,
    dateISO: '2025-12-18',
    text: 'Good experience overall. Waiting time was reasonable.',
  },
  {
    id: 'rev_3',
    doctorId: 'doc_lukas_meier',
    rating: 4,
    dateISO: '2025-12-02',
    text: 'Professional consultation and practical advice for follow-up care.',
  },
  {
    id: 'rev_4',
    doctorId: 'doc_samira_hassan',
    rating: 5,
    dateISO: '2026-01-02',
    text: 'Great with children. Took the time to answer all questions.',
  },
  {
    id: 'rev_5',
    doctorId: 'doc_samira_hassan',
    rating: 5,
    dateISO: '2025-11-20',
    text: 'Very reassuring and organized. Booking was straightforward.',
  },
]


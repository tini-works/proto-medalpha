import type { Doctor } from '../../types'
import { Avatar } from '../display/Avatar'
import { Rating } from '../display/Rating'
import { Pill } from '../display/Pill'
import { formatDateShort } from '../../utils/format'

interface DoctorCardProps {
  doctor: Doctor
  onClick?: () => void
}

export function DoctorCard({ doctor, onClick }: DoctorCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
    >
      <div className="flex gap-3">
        <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral-900 truncate">{doctor.name}</h3>
          <p className="text-sm text-neutral-600">{doctor.specialty}</p>
          <div className="mt-1">
            <Rating value={doctor.rating} reviewCount={doctor.reviewCount} size="sm" />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="truncate">{doctor.city}</span>
      </div>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5">
          {doctor.accepts.map((insurance) => (
            <Pill key={insurance} tone="info">
              {insurance}
            </Pill>
          ))}
        </div>
        <span className="text-sm text-neutral-600">
          Nächster Termin: {formatDateShort(doctor.nextAvailableISO)}
        </span>
      </div>
    </button>
  )
}

import { useTranslation } from 'react-i18next'
import { IconMapPin, IconHeart, IconHeartFilled } from '@tabler/icons-react'
import { Avatar } from '../display/Avatar'
import { Rating } from '../display/Rating'
import { Pill } from '../display/Pill'
import { Button, Sheet } from '../ui'
import type { Doctor } from '../../types'
import { translateSpecialty, translateLanguageList } from '../../utils'

interface DoctorDetailSheetProps {
  doctor: Doctor
  onClose: () => void
  onSelect: () => void
  saved?: boolean
  onToggleSaved?: () => void
}

export function DoctorDetailSheet({ doctor, onClose, onSelect, saved = false, onToggleSaved }: DoctorDetailSheetProps) {
  const { t } = useTranslation('booking')

  return (
    <Sheet
      open={true}
      onClose={onClose}
      variant="bottom"
      size="lg"
      title={t('doctorDetails')}
      testId="doctor-detail-sheet"
      footer={
        <Button onClick={onSelect} variant="primary" fullWidth size="lg">
          {t('selectThisDoctor')}
        </Button>
      }
    >
      <Sheet.Body className="px-4 pb-8">
        {/* Profile header */}
        <div className="flex items-start gap-4 py-4 border-b border-cream-300">
          <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-xl font-semibold text-charcoal-500">{doctor.name}</h3>
              <button
                type="button"
                onClick={onToggleSaved}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  saved ? 'text-coral-500 hover:bg-coral-50' : 'text-slate-400 hover:bg-cream-100'
                }`}
                aria-label={saved ? t('removeFromFavorites') : t('addToFavorites')}
              >
                {saved ? <IconHeartFilled size={20} stroke={2} /> : <IconHeart size={20} stroke={2} />}
              </button>
            </div>
            <p className="text-teal-600 font-medium">{translateSpecialty(t, doctor.specialty)}</p>
            <div className="mt-2">
              <Rating value={doctor.rating} reviewCount={doctor.reviewCount} />
            </div>
          </div>
        </div>

        {/* Location */}
        <section className="py-4 border-b border-cream-300">
          <div className="flex items-start gap-2 text-charcoal-500">
            <IconMapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" size={20} stroke={2} />
            <div>
              <p>{doctor.address}</p>
              <p className="text-sm text-slate-500">{doctor.city}</p>
            </div>
          </div>
        </section>

        {/* Insurance */}
        <section className="py-4 border-b border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('accepts')}</h4>
          <div className="flex gap-2">
            {doctor.accepts.map((insurance) => (
              <Pill key={insurance} tone={insurance === 'GKV' ? 'info' : 'neutral'} size="md">
                {insurance}
              </Pill>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section className="py-4 border-b border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('languages')}</h4>
          <p className="text-charcoal-500">{translateLanguageList(t, doctor.languages)}</p>
        </section>

        {/* About */}
        {doctor.about && (
          <section className="py-4 border-b border-cream-300">
            <h4 className="text-sm font-medium text-slate-500 mb-2">{t('about')}</h4>
            <p className="text-slate-700 leading-relaxed">{doctor.about}</p>
          </section>
        )}

        {/* Reviews preview */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-slate-500">
              {t('reviews')} ({doctor.reviewCount})
            </h4>
          </div>
          <div className="bg-cream-100 rounded-xl p-4">
            <p className="text-sm text-slate-700 leading-relaxed">
              "Clear communication and professional care. Appointment started on time."
            </p>
            <p className="text-xs text-slate-500 mt-2">{t('sampleReview')}</p>
          </div>
        </section>
      </Sheet.Body>
    </Sheet>
  )
}

import { useTranslation } from 'react-i18next'
import { IconX, IconMapPin } from '@tabler/icons-react'
import { Avatar } from '../display/Avatar'
import { Rating } from '../display/Rating'
import { Pill } from '../display/Pill'
import type { Doctor } from '../../types'

interface DoctorDetailSheetProps {
  doctor: Doctor
  onClose: () => void
  onSelect: () => void
}

export function DoctorDetailSheet({ doctor, onClose, onSelect }: DoctorDetailSheetProps) {
  const { t } = useTranslation('booking')

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-cream-400" />
        </div>

        {/* Header with close button */}
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-lg font-semibold text-charcoal-500">{t('doctorDetails')}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors"
            aria-label="Close"
          >
            <IconX size={20} stroke={2} className="text-slate-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-4 pb-32" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {/* Profile header */}
          <div className="flex items-start gap-4 py-4 border-b border-cream-300">
            <Avatar name={doctor.name} imageUrl={doctor.imageUrl} size="lg" />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-charcoal-500">{doctor.name}</h3>
              <p className="text-teal-600 font-medium">{doctor.specialty}</p>
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
            <p className="text-charcoal-500">{doctor.languages.join(', ')}</p>
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
        </div>

        {/* Sticky footer with action */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
          <button
            onClick={onSelect}
            className="w-full py-3.5 px-4 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
          >
            {t('selectThisDoctor')}
          </button>
        </div>
      </div>
    </>
  )
}

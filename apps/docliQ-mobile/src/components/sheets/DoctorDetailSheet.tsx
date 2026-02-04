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

function mockPracticeName(doctor: Doctor) {
  const lastName = doctor.name.split(' ').slice(-1)[0] ?? doctor.name
  return `Praxis ${lastName}`
}

function mockPhoneNumber(doctor: Doctor) {
  const seed = Math.abs(parseInt(doctor.id.replace(/\D/g, ''), 10) || 0)
  const ext = 1000 + (seed * 137) % 9000
  return `+49 30 ${ext}`
}

function chamberForCity(city: string) {
  const c = city.toLowerCase()
  if (c.includes('berlin')) return 'Ärztekammer Berlin'
  if (c.includes('munich') || c.includes('münchen')) return 'Bayerische Landesärztekammer'
  if (c.includes('hamburg')) return 'Ärztekammer Hamburg'
  if (c.includes('frankfurt')) return 'Landesärztekammer Hessen'
  if (c.includes('cologne') || c.includes('köln')) return 'Ärztekammer Nordrhein'
  return 'Ärztekammer'
}

function mockLicenseReference(doctor: Doctor) {
  const seed = Math.abs(parseInt(doctor.id.replace(/\D/g, ''), 10) || 0)
  const reg = 100000 + (seed * 173) % 900000
  return `${chamberForCity(doctor.city)} · Reg.-Nr. ${reg}`
}

function mockAcceptingNewPatients(doctor: Doctor) {
  const seed = Math.abs(parseInt(doctor.id.replace(/\D/g, ''), 10) || 0)
  return seed % 3 !== 0
}

function mockYearsExperience(doctor: Doctor) {
  const seed = Math.abs(parseInt(doctor.id.replace(/\D/g, ''), 10) || 0)
  return 5 + (seed % 21)
}

function insuranceLimitations(doctor: Doctor) {
  const acceptsGkv = doctor.accepts.includes('GKV')
  const acceptsPkv = doctor.accepts.includes('PKV')
  if (acceptsGkv && acceptsPkv) return null
  if (acceptsGkv) return 'Public insurance (GKV) only'
  if (acceptsPkv) return 'Private insurance (PKV) only'
  return 'Please contact the practice to confirm insurance eligibility'
}

export function DoctorDetailSheet({ doctor, onClose, onSelect, saved = false, onToggleSaved }: DoctorDetailSheetProps) {
  const { t } = useTranslation('booking')
  const practiceName = mockPracticeName(doctor)
  const phoneNumber = mockPhoneNumber(doctor)
  const licenseRef = mockLicenseReference(doctor)
  const acceptsNewPatients = mockAcceptingNewPatients(doctor)
  const yearsExperience = mockYearsExperience(doctor)
  const insuranceNotes = insuranceLimitations(doctor)

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

        {/* Practice (name + phone) */}
        <section className="py-4 border-b border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('practice')}</h4>
          <div className="space-y-1">
            <p className="text-charcoal-500">{practiceName}</p>
            <p className="text-sm text-slate-600">
              {t('phone')}: {phoneNumber}
            </p>
          </div>
        </section>

        {/* Professional */}
        <section className="py-4 border-b border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('professional')}</h4>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">{t('medicalLicense')}: {licenseRef}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">{t('acceptingNewPatients')}:</span>
              <Pill tone={acceptsNewPatients ? 'info' : 'neutral'} size="sm">
                {acceptsNewPatients ? t('yes') : t('no')}
              </Pill>
            </div>
          </div>
        </section>

        {/* About */}
        {doctor.about && (
          <section className="py-4 border-b border-cream-300">
            <h4 className="text-sm font-medium text-slate-500 mb-2">{t('about')}</h4>
            <p className="text-slate-700 leading-relaxed">{doctor.about}</p>
          </section>
        )}

        {/* Insurance limitations (if any) */}
        {insuranceNotes && (
          <section className="py-4 border-b border-cream-300">
            <h4 className="text-sm font-medium text-slate-500 mb-2">{t('insuranceDetails')}</h4>
            <p className="text-charcoal-500">{insuranceNotes}</p>
          </section>
        )}

        {/* Experience */}
        <section className="py-4 border-b border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('experience')}</h4>
          <p className="text-charcoal-500">{t('yearsExperience')}: {yearsExperience}</p>
        </section>

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

        {/* Map preview (static placeholder) */}
        <section className="py-4 border-t border-cream-300">
          <h4 className="text-sm font-medium text-slate-500 mb-2">{t('mapPreview')}</h4>
          <div className="bg-cream-100 border border-cream-300 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-600">
              <IconMapPin size={18} stroke={2} className="text-slate-500" />
              <span className="text-sm">{doctor.address}</span>
            </div>
            <div className="mt-3 h-28 rounded-lg bg-gradient-to-br from-cream-200 to-cream-100 border border-cream-200" />
          </div>
        </section>
      </Sheet.Body>
    </Sheet>
  )
}

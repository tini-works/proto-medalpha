import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IconMapPin, IconShieldCheck, IconCheck } from '@tabler/icons-react'
import { Header, Page } from '../../../components'
import { useProfile, useBooking } from '../../../state'
import { PATHS } from '../../../routes'
import { symptoms, specialties, getSpecialtyForSymptom } from '../../../data/symptoms'

type TabType = 'symptoms' | 'specialty'

export default function CareRequestScreen() {
  const navigate = useNavigate()
  const { t } = useTranslation('booking')
  const { profile } = useProfile()
  const { setFastLaneRequest } = useBooking()

  const [activeTab, setActiveTab] = useState<TabType>('symptoms')
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [selectedPatientId, setSelectedPatientId] = useState<string>(profile.id)

  const familyMembers = profile.familyMembers || []
  const hasFamilyMembers = familyMembers.length > 0

  const selectedPatient =
    selectedPatientId === profile.id
      ? { id: profile.id, name: profile.fullName, insuranceType: profile.insuranceType }
      : familyMembers.find((m) => m.id === selectedPatientId)

  const patientInsurance = selectedPatient?.insuranceType || profile.insuranceType
  const patientCity = profile.address?.city || ''

  const selection = activeTab === 'symptoms' ? selectedSymptom : selectedSpecialty
  const canSubmit = selection !== null && patientCity && patientInsurance

  const handleSubmit = () => {
    if (!canSubmit) return

    const specialty =
      activeTab === 'symptoms' ? getSpecialtyForSymptom(selectedSymptom!) : selectedSpecialty

    if (!specialty) return

    const symptomLabel =
      activeTab === 'symptoms'
        ? symptoms.find((s) => s.id === selectedSymptom)?.labelKey
        : undefined

    setFastLaneRequest({
      specialty,
      symptom: symptomLabel,
      city: patientCity,
      insuranceType: patientInsurance as 'GKV' | 'PKV',
      patientId: selectedPatientId,
      patientName: selectedPatient?.name || profile.fullName,
    })

    navigate(PATHS.FAST_LANE_MATCHING)
  }

  return (
    <Page>
      <Header title={t('fastLaneBooking')} showBack />

      <div className="px-4 py-4 space-y-6 pb-32">
        {/* Patient Selector - only show if family members exist */}
        {hasFamilyMembers && (
          <section>
            <h2 className="text-sm font-medium text-charcoal-500 mb-3">{t('whoNeedsCare')}</h2>
            <div className="flex flex-wrap gap-2">
              <PatientChip
                name={profile.fullName}
                relationship="self"
                selected={selectedPatientId === profile.id}
                onSelect={() => setSelectedPatientId(profile.id)}
              />
              {familyMembers.map((member) => (
                <PatientChip
                  key={member.id}
                  name={member.name}
                  relationship={member.relationship}
                  selected={selectedPatientId === member.id}
                  onSelect={() => setSelectedPatientId(member.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* What do you need - Tabs */}
        <section>
          <h2 className="text-sm font-medium text-charcoal-500 mb-3">{t('whatDoYouNeed')}</h2>

          {/* Tab Toggle */}
          <div className="flex bg-cream-200 rounded-xl p-1 mb-4">
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'symptoms'
                  ? 'bg-white text-charcoal-500 shadow-sm'
                  : 'text-slate-500 hover:text-charcoal-500'
              }`}
            >
              {t('symptoms')}
            </button>
            <button
              onClick={() => setActiveTab('specialty')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'specialty'
                  ? 'bg-white text-charcoal-500 shadow-sm'
                  : 'text-slate-500 hover:text-charcoal-500'
              }`}
            >
              {t('specialty')}
            </button>
          </div>

          {/* Symptoms Grid */}
          {activeTab === 'symptoms' && (
            <div className="grid grid-cols-2 gap-2">
              {symptoms.map((symptom) => (
                <SelectionChip
                  key={symptom.id}
                  label={t(symptom.labelKey)}
                  selected={selectedSymptom === symptom.id}
                  onSelect={() => {
                    setSelectedSymptom(symptom.id)
                    setSelectedSpecialty(null)
                  }}
                />
              ))}
            </div>
          )}

          {/* Specialty Grid */}
          {activeTab === 'specialty' && (
            <div className="grid grid-cols-2 gap-2">
              {specialties.map((specialty) => (
                <SelectionChip
                  key={specialty.id}
                  label={t(specialty.labelKey)}
                  selected={selectedSpecialty === specialty.value}
                  onSelect={() => {
                    setSelectedSpecialty(specialty.value)
                    setSelectedSymptom(null)
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Location Preview */}
        <section className="bg-cream-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500">
              <IconMapPin size={20} stroke={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{t('location')}</p>
              <p className="text-sm font-medium text-charcoal-500">
                {patientCity || t('noLocationSet')}
              </p>
            </div>
          </div>
        </section>

        {/* Insurance Preview */}
        <section className="bg-cream-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-500">
              <IconShieldCheck size={20} stroke={2} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{t('insurance')}</p>
              <p className="text-sm font-medium text-charcoal-500">
                {patientInsurance || t('noInsuranceSet')}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-cream-300 px-4 py-4 safe-area-bottom">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn btn-primary btn-block disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('findAppointment')}
        </button>
      </div>
    </Page>
  )
}

function PatientChip({
  name,
  relationship,
  selected,
  onSelect,
}: {
  name: string
  relationship: string
  selected: boolean
  onSelect: () => void
}) {
  const { t } = useTranslation('booking')
  const relationshipLabel = relationship === 'self' ? '' : ` (${t(`relationship_${relationship}`)})`

  return (
    <button
      onClick={onSelect}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
        selected
          ? 'bg-teal-500 text-white'
          : 'bg-white border border-cream-400 text-charcoal-500 hover:border-teal-400'
      }`}
    >
      {selected && <IconCheck size={16} stroke={2.5} />}
      {name}
      {relationshipLabel}
    </button>
  )
}

function SelectionChip({
  label,
  selected,
  onSelect,
}: {
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
        selected
          ? 'bg-teal-500 text-white shadow-md'
          : 'bg-white border border-cream-400 text-charcoal-500 hover:border-teal-400'
      }`}
    >
      {label}
    </button>
  )
}

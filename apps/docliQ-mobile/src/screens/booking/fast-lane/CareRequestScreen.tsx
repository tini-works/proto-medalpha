import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconMapPin, IconShieldCheck, IconCheck, IconSearch, IconX } from '@tabler/icons-react'
import { Header, Page, ReasonTextarea } from '../../../components'
import { LocationSelector } from '../../../components/forms/LocationSelector'
import type { LocationValue } from '../../../components/forms/LocationSelector'
import { useProfile } from '../../../state'
import { symptoms, specialties, getSpecialtyForSymptom } from '../../../data/symptoms'
import { useBookingSubmission } from '../../../hooks/useBookingSubmission'
import { clearRecentSpecialties, getRecentSpecialties } from '../../../data/recentSpecialties'
import type { InsuranceType } from '../../../types'

type TabType = 'symptoms' | 'specialty'

const OTHER_ID = '__other__'
type InsuranceChoice = InsuranceType | ''

export default function CareRequestScreen() {
  const { t } = useTranslation('booking')
  const { profile } = useProfile()
  const { submitFastLane } = useBookingSubmission()

  const [activeTab, setActiveTab] = useState<TabType>('symptoms')
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [otherSymptomText, setOtherSymptomText] = useState('')
  const [specialtyQuery, setSpecialtyQuery] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string>(profile.id)
  const [recentSpecialties, setRecentSpecialties] = useState<string[]>([])

  const familyMembers = profile.familyMembers || []
  const hasFamilyMembers = familyMembers.length > 0

  const selectedPatient =
    selectedPatientId === profile.id
      ? { id: profile.id, name: profile.fullName, insuranceType: profile.insuranceType }
      : familyMembers.find((m) => m.id === selectedPatientId)

  // Location + insurance (cloned from Set Your Preferences)
  const [selectedCity, setSelectedCity] = useState<string>(profile.address?.city || '')
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [insurance, setInsurance] = useState<InsuranceChoice>(
    (selectedPatient?.insuranceType as InsuranceChoice) || (profile.insuranceType as InsuranceChoice) || ''
  )
  const hasAutoOpenedLocationPicker = useRef(false)

  useEffect(() => {
    // When patient changes, reset insurance to their insurance (or empty).
    setInsurance(
      (selectedPatient?.insuranceType as InsuranceChoice) || (profile.insuranceType as InsuranceChoice) || ''
    )
  }, [selectedPatient?.insuranceType, profile.insuranceType])

  useEffect(() => {
    // If there's no prefilled location, prompt by opening the picker once.
    if (hasAutoOpenedLocationPicker.current) return
    if (selectedCity) return
    hasAutoOpenedLocationPicker.current = true
    setIsLocationPickerOpen(true)
  }, [selectedCity])

  useEffect(() => {
    setRecentSpecialties(getRecentSpecialties())
  }, [])

  const selection = activeTab === 'symptoms' ? selectedSymptom : selectedSpecialty
  const isOtherSelected = activeTab === 'symptoms' && selectedSymptom === OTHER_ID
  // Keep the symptom grid compact (8 chips total including "Other")
  const symptomChips = symptoms.slice(0, 7)
  const canSubmit =
    selection !== null &&
    Boolean(selectedCity) &&
    Boolean(insurance) &&
    (!isOtherSelected || Boolean(otherSymptomText.trim()))

  const handleSubmit = () => {
    if (!canSubmit) return

    const specialty = (() => {
      if (activeTab === 'symptoms') {
        if (selectedSymptom === OTHER_ID) return 'Primary care'
        return getSpecialtyForSymptom(selectedSymptom!)
      }
      return selectedSpecialty
    })()

    if (!specialty) return

    const symptomLabel =
      activeTab !== 'symptoms'
        ? undefined
        : selectedSymptom === OTHER_ID
          ? otherSymptomText.trim()
          : symptoms.find((s) => s.id === selectedSymptom)?.labelKey

    const patientName = selectedPatient?.name || profile.fullName

    submitFastLane({
      specialty,
      symptom: symptomLabel,
      city: selectedCity,
      insuranceType: insurance as 'GKV' | 'PKV',
      patientId: selectedPatientId,
      patientName,
    })
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
            <>
              <div className="grid grid-cols-2 gap-2">
                {symptomChips.map((symptom) => (
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
                <SelectionChip
                  label={t('other')}
                  selected={selectedSymptom === OTHER_ID}
                  onSelect={() => {
                    setSelectedSymptom(OTHER_ID)
                    setSelectedSpecialty(null)
                  }}
                />
              </div>

              {selectedSymptom === OTHER_ID && (
                <div className="mt-4">
                  <ReasonTextarea
                    value={otherSymptomText}
                    onChange={setOtherSymptomText}
                    label={t('otherSymptomLabel')}
                    placeholder={t('otherSymptomPlaceholder')}
                    maxLength={200}
                  />
                </div>
              )}
            </>
          )}

          {/* Specialty Grid */}
          {activeTab === 'specialty' && (
            <>
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <IconSearch className="w-5 h-5 text-neutral-400" size={20} stroke={2} />
                </div>
                <input
                  type="text"
                  value={specialtyQuery}
                  onChange={(e) => setSpecialtyQuery(e.target.value)}
                  placeholder={t('specialtySearchPlaceholder')}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-white shadow-sm ring-1 ring-cream-400 focus:ring-2 focus:ring-teal-500 focus:outline-none text-charcoal-500 placeholder:text-slate-400 transition-colors duration-normal ease-out-brand"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {specialtyQuery.trim().length === 0 && recentSpecialties.length > 0 && (
                  <>
                    <div className="col-span-2 flex items-center justify-between pt-1">
                      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                        {t('recentSpecialties')}
                      </p>
                      <button
                        type="button"
                        className="text-xs font-medium text-teal-700 hover:underline"
                        onClick={() => {
                          clearRecentSpecialties()
                          setRecentSpecialties([])
                        }}
                      >
                        {t('clearRecent')}
                      </button>
                    </div>
                    {recentSpecialties.slice(0, 4).map((value) => (
                      <SelectionChip
                        key={`recent-${value}`}
                        label={value}
                        selected={selectedSpecialty === value}
                        onSelect={() => {
                          setSelectedSpecialty(value)
                          setSelectedSymptom(null)
                        }}
                      />
                    ))}
                  </>
                )}
                {specialties
                  .filter((specialty) => {
                    const q = specialtyQuery.trim().toLowerCase()
                    if (!q) return true
                    const label = t(specialty.labelKey).toLowerCase()
                    const value = specialty.value.toLowerCase()
                    return label.includes(q) || value.includes(q)
                  })
                  .slice(0, 8)
                  .map((specialty) => (
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
            </>
          )}
        </section>

        {/* Location + Insurance (cloned from Set Your Preferences) */}
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-charcoal-500">{t('whereAreYouLocated')}</h2>

          <button
            type="button"
            onClick={() => setIsLocationPickerOpen(true)}
            className="w-full bg-white rounded-2xl border border-cream-400 p-4 text-left hover:bg-cream-50 transition-colors duration-normal ease-out-brand"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center text-slate-500">
                <IconMapPin size={20} stroke={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 uppercase tracking-wide">{t('location')}</p>
                <p className="font-medium text-charcoal-500 truncate">{selectedCity || t('selectCity')}</p>
              </div>
              <span className="text-sm font-medium text-teal-700">{t('change')}</span>
            </div>
          </button>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-charcoal-500">{t('yourInsuranceType')}</h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setInsurance('GKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                insurance === 'GKV' ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={insurance === 'GKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={insurance === 'GKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('publicGkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('statutoryInsurance')}</p>
            </button>

            <button
              type="button"
              onClick={() => setInsurance('PKV')}
              className={`rounded-2xl border p-4 text-center transition-colors duration-normal ease-out-brand ${
                insurance === 'PKV' ? 'border-teal-500 bg-teal-50' : 'border-cream-400 bg-white hover:bg-cream-50'
              }`}
              aria-pressed={insurance === 'PKV'}
            >
              <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center bg-cream-100">
                <IconShieldCheck
                  size={20}
                  stroke={2}
                  className={insurance === 'PKV' ? 'text-teal-600' : 'text-slate-500'}
                />
              </div>
              <p className="font-semibold text-charcoal-500">{t('privatePkv')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('privateInsurance')}</p>
            </button>
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

      {/* Location picker (bottom sheet) */}
      {isLocationPickerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-charcoal-900/50 animate-fade-in"
            onClick={() => setIsLocationPickerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-[90vh] flex flex-col rounded-t-3xl bg-white overflow-hidden animate-slide-up">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-cream-400" />
            </div>
            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="text-lg font-semibold text-charcoal-500">{t('chooseLocation')}</h2>
              <button
                onClick={() => setIsLocationPickerOpen(false)}
                className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center hover:bg-cream-300 transition-colors duration-normal ease-out-brand"
                aria-label="Close"
              >
                <IconX size={20} stroke={2} className="text-slate-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              <LocationSelector
                onLocationSelect={(location: LocationValue) => {
                  setSelectedCity(location.value)
                  setIsLocationPickerOpen(false)
                }}
                savedLocations={[]}
                initialRadius={10}
                showRadius={false}
                showMapPreview={false}
                showSavedLocations={false}
              />
            </div>
          </div>
        </div>
      )}
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

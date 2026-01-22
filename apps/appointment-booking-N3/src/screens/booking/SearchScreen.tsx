import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, TabBar } from '../../components'
import { Select } from '../../components/forms'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

const specialties = [
  { value: '', label: 'Alle Fachrichtungen' },
  { value: 'Primary care', label: 'Allgemeinmedizin' },
  { value: 'Cardiology', label: 'Kardiologie' },
  { value: 'Dermatology', label: 'Dermatologie' },
  { value: 'Pediatrics', label: 'Pädiatrie' },
  { value: 'Orthopedics', label: 'Orthopädie' },
  { value: 'Gynecology', label: 'Gynäkologie' },
  { value: 'Ophthalmology', label: 'Augenheilkunde' },
]

const cities = [
  { value: '', label: 'Alle Städte' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Munich', label: 'München' },
  { value: 'Hamburg', label: 'Hamburg' },
  { value: 'Frankfurt', label: 'Frankfurt' },
  { value: 'Cologne', label: 'Köln' },
]

export default function SearchScreen() {
  const navigate = useNavigate()
  const { setSearchFilters } = useBooking()

  const [formData, setFormData] = useState({
    specialty: '',
    city: '',
    insuranceType: '' as InsuranceType | '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    setSearchFilters({
      specialty: formData.specialty,
      city: formData.city,
      insuranceType: formData.insuranceType,
      includeStores: false,
    })

    navigate(PATHS.BOOKING_RESULTS)
  }

  return (
    <Page>
      <Header title="Arzt suchen" subtitle="Nach Fachrichtung oder Standort suchen" />

      <form onSubmit={handleSearch} className="px-4 py-6 space-y-5">
        <Select
          label="Fachrichtung"
          value={formData.specialty}
          onChange={(e) => handleChange('specialty', e.target.value)}
          options={specialties}
        />

        <Select
          label="Stadt"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          options={cities}
        />

        <Select
          label="Versicherungsart"
          value={formData.insuranceType}
          onChange={(e) => handleChange('insuranceType', e.target.value)}
          options={[
            { value: '', label: 'Alle Versicherungen' },
            { value: 'GKV', label: 'Gesetzlich (GKV)' },
            { value: 'PKV', label: 'Privat (PKV)' },
          ]}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Ärzte suchen
          </button>
        </div>
      </form>

      <TabBar />
    </Page>
  )
}

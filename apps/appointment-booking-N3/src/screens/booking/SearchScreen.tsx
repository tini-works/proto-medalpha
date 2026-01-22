import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Page, TabBar } from '../../components'
import { Select } from '../../components/forms'
import { useBooking } from '../../state'
import { PATHS } from '../../routes'
import type { InsuranceType } from '../../types'

const specialties = [
  { value: '', label: 'All specialties' },
  { value: 'Primary care', label: 'Primary care' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Gynecology', label: 'Gynecology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
]

const cities = [
  { value: '', label: 'All cities' },
  { value: 'Berlin', label: 'Berlin' },
  { value: 'Munich', label: 'Munich' },
  { value: 'Hamburg', label: 'Hamburg' },
  { value: 'Frankfurt', label: 'Frankfurt' },
  { value: 'Cologne', label: 'Cologne' },
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
      <Header title="Find a Doctor" subtitle="Search by specialty or location" />

      <form onSubmit={handleSearch} className="px-4 py-6 space-y-5">
        <Select
          label="Specialty"
          value={formData.specialty}
          onChange={(e) => handleChange('specialty', e.target.value)}
          options={specialties}
        />

        <Select
          label="City"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          options={cities}
        />

        <Select
          label="Insurance Type"
          value={formData.insuranceType}
          onChange={(e) => handleChange('insuranceType', e.target.value)}
          options={[
            { value: '', label: 'All types' },
            { value: 'GKV', label: 'GKV (Statutory)' },
            { value: 'PKV', label: 'PKV (Private)' },
          ]}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Search Doctors
          </button>
        </div>
      </form>

      <TabBar />
    </Page>
  )
}

export interface Symptom {
  id: string
  labelKey: string
  specialty: string // Primary specialty (for backward compatibility)
  specialties: string[] // All applicable specialties
  icon?: string
}

export interface SpecialtyOption {
  id: string
  labelKey: string
  value: string
}

export const symptoms: Symptom[] = [
  { id: 'headache', labelKey: 'symptomHeadache', specialty: 'Neurology', specialties: ['Neurology', 'Primary care'] },
  { id: 'fever', labelKey: 'symptomFever', specialty: 'Primary care', specialties: ['Primary care', 'Pediatrics'] },
  { id: 'skin_issue', labelKey: 'symptomSkinIssue', specialty: 'Dermatology', specialties: ['Dermatology'] },
  { id: 'chest_pain', labelKey: 'symptomChestPain', specialty: 'Cardiology', specialties: ['Cardiology', 'Primary care'] },
  { id: 'back_pain', labelKey: 'symptomBackPain', specialty: 'Orthopedics', specialties: ['Orthopedics', 'Primary care'] },
  { id: 'eye_problem', labelKey: 'symptomEyeProblem', specialty: 'Ophthalmology', specialties: ['Ophthalmology'] },
  { id: 'dental_pain', labelKey: 'symptomDentalPain', specialty: 'Dentistry', specialties: ['Dentistry'] },
  { id: 'mental_health', labelKey: 'symptomMentalHealth', specialty: 'Psychiatry', specialties: ['Psychiatry', 'Primary care'] },
  { id: 'stomach_pain', labelKey: 'symptomStomachPain', specialty: 'Gastroenterology', specialties: ['Gastroenterology', 'Primary care'] },
  { id: 'breathing', labelKey: 'symptomBreathing', specialty: 'Pulmonology', specialties: ['Pulmonology', 'Primary care', 'ENT (HNO)'] },
  { id: 'ear_nose_throat', labelKey: 'symptomENT', specialty: 'ENT (HNO)', specialties: ['ENT (HNO)'] },
  { id: 'womens_health', labelKey: 'symptomWomensHealth', specialty: 'Gynecology', specialties: ['Gynecology'] },
  { id: 'joint_pain', labelKey: 'symptomJointPain', specialty: 'Orthopedics', specialties: ['Orthopedics', 'Rheumatology', 'Primary care'] },
  { id: 'fatigue', labelKey: 'symptomFatigue', specialty: 'Primary care', specialties: ['Primary care', 'Endocrinology'] },
  { id: 'anxiety', labelKey: 'symptomAnxiety', specialty: 'Psychiatry', specialties: ['Psychiatry', 'Primary care'] },
  { id: 'cough', labelKey: 'symptomCough', specialty: 'Primary care', specialties: ['Primary care', 'ENT (HNO)', 'Pulmonology'] },
  { id: 'heart_palpitations', labelKey: 'symptomHeartPalpitations', specialty: 'Cardiology', specialties: ['Cardiology', 'Primary care'] },
  { id: 'dizziness', labelKey: 'symptomDizziness', specialty: 'Neurology', specialties: ['Neurology', 'ENT (HNO)', 'Primary care'] },
]

export const specialties: SpecialtyOption[] = [
  { id: 'primary_care', labelKey: 'specialtyPrimaryCare', value: 'Primary care' },
  { id: 'cardiology', labelKey: 'specialtyCardiology', value: 'Cardiology' },
  { id: 'dermatology', labelKey: 'specialtyDermatology', value: 'Dermatology' },
  { id: 'orthopedics', labelKey: 'specialtyOrthopedics', value: 'Orthopedics' },
  { id: 'gynecology', labelKey: 'specialtyGynecology', value: 'Gynecology' },
  { id: 'ophthalmology', labelKey: 'specialtyOphthalmology', value: 'Ophthalmology' },
  { id: 'pediatrics', labelKey: 'specialtyPediatrics', value: 'Pediatrics' },
  { id: 'neurology', labelKey: 'specialtyNeurology', value: 'Neurology' },
  { id: 'psychiatry', labelKey: 'specialtyPsychiatry', value: 'Psychiatry' },
  { id: 'dentistry', labelKey: 'specialtyDentistry', value: 'Dentistry' },
  { id: 'ent', labelKey: 'specialtyENT', value: 'ENT (HNO)' },
  { id: 'gastroenterology', labelKey: 'specialtyGastroenterology', value: 'Gastroenterology' },
]

export function getSpecialtyForSymptom(symptomId: string): string | undefined {
  const symptom = symptoms.find((s) => s.id === symptomId)
  return symptom?.specialty
}

// Get symptoms relevant to a given specialty
export function getSymptomsForSpecialty(specialty: string): Symptom[] {
  const matched = symptoms.filter((s) =>
    s.specialties.some((sp) => sp.toLowerCase() === specialty.toLowerCase())
  )

  // If few matches, include general/primary care symptoms
  if (matched.length < 4) {
    const general = symptoms.filter((s) => s.specialties.includes('Primary care'))
    const combined = [...matched]
    for (const g of general) {
      if (!combined.find((m) => m.id === g.id)) {
        combined.push(g)
      }
      if (combined.length >= 8) break
    }
    return combined.slice(0, 8)
  }

  return matched.slice(0, 8)
}

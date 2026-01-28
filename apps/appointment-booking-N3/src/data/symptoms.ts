export interface Symptom {
  id: string
  labelKey: string
  specialty: string
  icon?: string
}

export interface SpecialtyOption {
  id: string
  labelKey: string
  value: string
}

export const symptoms: Symptom[] = [
  { id: 'headache', labelKey: 'symptomHeadache', specialty: 'Neurology' },
  { id: 'fever', labelKey: 'symptomFever', specialty: 'Primary care' },
  { id: 'skin_issue', labelKey: 'symptomSkinIssue', specialty: 'Dermatology' },
  { id: 'chest_pain', labelKey: 'symptomChestPain', specialty: 'Cardiology' },
  { id: 'back_pain', labelKey: 'symptomBackPain', specialty: 'Orthopedics' },
  { id: 'eye_problem', labelKey: 'symptomEyeProblem', specialty: 'Ophthalmology' },
  { id: 'dental_pain', labelKey: 'symptomDentalPain', specialty: 'Dentistry' },
  { id: 'mental_health', labelKey: 'symptomMentalHealth', specialty: 'Psychiatry' },
  { id: 'stomach_pain', labelKey: 'symptomStomachPain', specialty: 'Gastroenterology' },
  { id: 'breathing', labelKey: 'symptomBreathing', specialty: 'Pulmonology' },
  { id: 'ear_nose_throat', labelKey: 'symptomENT', specialty: 'ENT (HNO)' },
  { id: 'womens_health', labelKey: 'symptomWomensHealth', specialty: 'Gynecology' },
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

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Field } from '../../components/forms'
import { useAuth, useProfile } from '../../state'
import { PATHS } from '../../routes'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { updateProfile } = useProfile()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name ist erforderlich'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein'
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Update profile with name
    updateProfile({ fullName: formData.fullName })

    // Sign in (this sets email and marks as authenticated but not verified)
    signIn(formData.email)

    // Navigate to verification
    navigate(PATHS.AUTH_VERIFY)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Registrieren" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label="Vollständiger Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Vor- und Nachname"
          error={errors.fullName}
          required
          autoComplete="name"
        />

        <Field
          label="E-Mail-Adresse"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="ihre.email@beispiel.de"
          error={errors.email}
          required
          autoComplete="email"
        />

        <Field
          label="Passwort"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Passwort erstellen"
          error={errors.password}
          hint="Mindestens 8 Zeichen erforderlich"
          required
          autoComplete="new-password"
        />

        <Field
          label="Passwort bestätigen"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="Passwort wiederholen"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Konto erstellen
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Bereits registriert?{' '}
          <Link to={PATHS.AUTH_SIGN_IN} className="text-neutral-700 font-medium hover:underline">
            Anmelden
          </Link>
        </p>
      </form>
    </Page>
  )
}

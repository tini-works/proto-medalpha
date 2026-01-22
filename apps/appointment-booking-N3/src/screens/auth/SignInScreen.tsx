import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header, Page } from '../../components'
import { Field } from '../../components/forms'
import { useAuth } from '../../state'
import { PATHS } from '../../routes'

export default function SignInScreen() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich'
    }

    if (!formData.password) {
      newErrors.password = 'Passwort ist erforderlich'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Sign in (mock - any email/password works)
    signIn(formData.email)

    // Navigate to verification
    navigate(PATHS.AUTH_VERIFY)
  }

  return (
    <Page safeBottom={false}>
      <Header title="Anmelden" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
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
          placeholder="Passwort eingeben"
          error={errors.password}
          required
          autoComplete="current-password"
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-neutral-800 text-white font-medium rounded-lg hover:bg-neutral-900 transition-colors"
          >
            Anmelden
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Noch kein Konto?{' '}
          <Link to={PATHS.AUTH_REGISTER} className="text-neutral-700 font-medium hover:underline">
            Registrieren
          </Link>
        </p>
      </form>
    </Page>
  )
}

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
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      <Header title="Create Account" showBack />

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-5">
        <Field
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          placeholder="Enter your full name"
          error={errors.fullName}
          required
          autoComplete="name"
        />

        <Field
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter your email"
          error={errors.email}
          required
          autoComplete="email"
        />

        <Field
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder="Create a password"
          error={errors.password}
          hint="Must be at least 8 characters"
          required
          autoComplete="new-password"
        />

        <Field
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-primary btn-block"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link to={PATHS.AUTH_SIGN_IN} className="text-neutral-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Page>
  )
}

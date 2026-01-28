interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'rounded'
  maxInitials?: number
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

function normalizeNameForInitials(name: string): string {
  const raw = name.trim()
  if (!raw) return ''

  const honorifics = new Set([
    'dr',
    'prof',
    'frau',
    'herr',
    'mr',
    'mrs',
    'ms',
    'med',
  ])

  const words = raw
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)

  const filtered = words.filter((w) => {
    const token = w.replace(/\.+$/, '').toLowerCase()
    return !honorifics.has(token)
  })

  // If we stripped everything (e.g., name is just "Dr."), fall back to the original words.
  return (filtered.length > 0 ? filtered : words).join(' ')
}

function getInitials(name: string, maxInitials: number): string {
  const safeMax = Math.max(1, maxInitials)
  const normalized = normalizeNameForInitials(name)
  const words = normalized.split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  if (words.length === 1) {
    return Array.from(words[0]).slice(0, safeMax).join('').toUpperCase()
  }

  const first = words[0][0]
  const last = words[words.length - 1][0]
  const middle = words.length > 2 ? words[1][0] : ''
  const initials = `${first}${middle}${last}`
  return Array.from(initials).slice(0, safeMax).join('').toUpperCase()
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
  ]

  let hash = 0
  const normalized = normalizeNameForInitials(name) || name
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ name, imageUrl, size = 'md', shape = 'circle', maxInitials = 2 }: AvatarProps) {
  const rounding = shape === 'rounded' ? 'rounded-lg' : 'rounded-full'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeStyles[size]} ${rounding} object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeStyles[size]} ${getColorFromName(name)} ${rounding} flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name, maxInitials)}
    </div>
  )
}

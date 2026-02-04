import { useRef } from 'react'
import { IconCamera } from '@tabler/icons-react'

interface AvatarProps {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'rounded'
  maxInitials?: number
  showEditOverlay?: boolean
  onEdit?: () => void
  onAvatarChange?: (dataUrl: string) => void
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-20 h-20 text-xl',
}

const editIconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
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

export function Avatar({
  name,
  imageUrl,
  size = 'md',
  shape = 'circle',
  maxInitials = 2,
  showEditOverlay = false,
  onEdit,
  onAvatarChange,
}: AvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const rounding = shape === 'rounded' ? 'rounded-lg' : 'rounded-full'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onAvatarChange) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) onAvatarChange(dataUrl)
    }
    reader.readAsDataURL(file)

    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleOverlayClick = () => {
    if (onAvatarChange) {
      fileInputRef.current?.click()
    } else if (onEdit) {
      onEdit()
    }
  }

  const avatarContent = imageUrl ? (
    <img
      src={imageUrl}
      alt={name}
      className={`${sizeStyles[size]} ${rounding} object-cover`}
    />
  ) : (
    <div
      className={`${sizeStyles[size]} ${getColorFromName(name)} ${rounding} flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name, maxInitials)}
    </div>
  )

  if (showEditOverlay && (onEdit || onAvatarChange)) {
    return (
      <>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
        <button
          onClick={handleOverlayClick}
          className="relative group"
          aria-label="Change profile photo"
        >
          {avatarContent}
          <div
            className={`absolute bottom-0 right-0 w-6 h-6 bg-teal-500 ${rounding} flex items-center justify-center border-2 border-white shadow-sm group-hover:bg-teal-600 transition-colors`}
          >
            <IconCamera size={editIconSizes[size]} className="text-white" />
          </div>
        </button>
      </>
    )
  }

  return avatarContent
}

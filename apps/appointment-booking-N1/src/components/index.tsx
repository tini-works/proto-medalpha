import React from 'react'
import { useNavigate } from 'react-router-dom'

// ============ BUTTONS ============

export function PrimaryButton({
  children,
  onClick,
  disabled,
  fullWidth,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? 'var(--muted)' : 'var(--primary)',
        color: '#fff',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        fontSize: '16px',
        fontWeight: 700,
        width: fullWidth ? '100%' : 'auto',
        minHeight: '48px',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  fullWidth,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  fullWidth?: boolean
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#E5E7EB',
        color: 'var(--text)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        fontSize: '16px',
        fontWeight: 600,
        width: fullWidth ? '100%' : 'auto',
        minHeight: '48px',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        color: 'var(--primary)',
        padding: '14px 20px',
        fontSize: '16px',
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ============ CARD ============

export function Card({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--card)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ============ TAGS ============

type TagTone = 'muted' | 'accent' | 'success' | 'danger' | 'primary'

export function Tag({ children, tone = 'muted' }: { children: React.ReactNode; tone?: TagTone }) {
  const styles: Record<TagTone, { bg: string; color: string }> = {
    muted: { bg: '#F3F4F6', color: 'var(--muted)' },
    accent: { bg: 'var(--accent-light)', color: '#8D6E00' },
    success: { bg: 'var(--success-light)', color: 'var(--success)' },
    danger: { bg: 'var(--danger-light)', color: 'var(--danger)' },
    primary: { bg: '#E0ECFF', color: 'var(--primary)' },
  }
  const s = styles[tone]
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        color: s.color,
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '13px',
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  )
}

// ============ TIME SLOT ============

export function TimeSlot({
  time,
  active,
  disabled,
  onClick,
}: {
  time: string
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background: disabled ? '#F3F4F6' : active ? 'var(--accent)' : '#FFF8E1',
        border: `1px solid ${disabled ? 'var(--border)' : active ? 'var(--primary)' : '#F2D777'}`,
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        minWidth: '72px',
        fontSize: '15px',
        fontWeight: 700,
        color: disabled ? 'var(--muted)' : 'var(--text)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {time}
    </button>
  )
}

// ============ INPUT ============

export function Input({
  label,
  placeholder,
  value,
  onChange,
  icon,
}: {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (val: string) => void
  icon?: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: '6px',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            paddingLeft: icon ? '44px' : '16px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '16px',
            background: '#fff',
          }}
        />
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
            }}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  )
}

// ============ HEADER ============

export function Header({
  title,
  subtitle,
  showBack,
  rightAction,
}: {
  title: string
  subtitle?: string
  showBack?: boolean
  rightAction?: React.ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        padding: 'var(--space-lg)',
        paddingTop: 'var(--space-xl)',
        background: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              padding: '8px',
              marginLeft: '-8px',
              fontSize: '20px',
            }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)' }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '2px' }}>{subtitle}</p>}
        </div>
        {rightAction}
      </div>
    </div>
  )
}

// ============ BOTTOM SHEET ============

export function BottomSheet({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        borderRadius: '40px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 40px 40px',
          padding: 'var(--space-xl)',
          paddingBottom: 'var(--space-3xl)',
          width: '100%',
          maxHeight: '85%',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '40px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px',
            margin: '0 auto var(--space-lg)',
          }}
        />
        {children}
      </div>
    </div>
  )
}

// ============ STAR RATING ============

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: '#F59E0B' }}>
        {'★'.repeat(fullStars)}
        {hasHalf && '☆'}
        {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
      </span>
      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{rating.toFixed(1)}</span>
      {count !== undefined && <span style={{ color: 'var(--muted)' }}>({count})</span>}
    </span>
  )
}

// ============ EMPTY STATE ============

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-3xl)', color: 'var(--muted)' }}>
      <div style={{ fontSize: '48px', marginBottom: 'var(--space-md)' }}>📭</div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>{title}</h3>
      {description && <p style={{ fontSize: '14px' }}>{description}</p>}
    </div>
  )
}

// ============ TAB BAR ============

export function TabBar({ active }: { active: 'home' | 'appointments' | 'settings' }) {
  const navigate = useNavigate()
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠', path: '/' },
    { id: 'appointments', label: 'Appointments', icon: '📅', path: '/appointments' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ] as const

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--card)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        padding: 'var(--space-sm) 0 var(--space-xl)',
        zIndex: 100,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.path)}
          style={{
            flex: 1,
            background: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: 'var(--space-sm)',
            color: active === tab.id ? 'var(--primary)' : 'var(--muted)',
          }}
        >
          <span style={{ fontSize: '20px' }}>{tab.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: active === tab.id ? 600 : 400 }}>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ============ CHIP ============

export function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? 'var(--primary)' : '#E0ECFF',
        color: active ? '#fff' : 'var(--primary)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '14px',
        fontWeight: 600,
        border: active ? '1px solid var(--primary)' : '1px solid transparent',
      }}
    >
      {children}
    </button>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="app-container">{children}</div>
}

export function Header({
  title,
  subtitle,
  backTo,
  right,
}: {
  title: string
  subtitle?: string
  backTo?: string
  right?: React.ReactNode
}) {
  const navigate = useNavigate()
  return (
    <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        {backTo ? (
          <button
            onClick={() => navigate(backTo)}
            style={{
              minWidth: '44px',
              minHeight: '44px',
              borderRadius: 14,
              border: 'var(--border)',
              background: 'var(--neutral-0)',
              color: 'var(--neutral-800)',
            }}
            aria-label="Back"
            title="Back"
          >
            ←
          </button>
        ) : (
          <div style={{ width: '44px' }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="h1">{title}</div>
          {subtitle ? (
            <div className="label" style={{ marginTop: 4 }}>
              {subtitle}
            </div>
          ) : null}
        </div>
        {right ? <div style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}>{right}</div> : null}
      </div>
    </div>
  )
}

export function Card({
  children,
  onClick,
  tone = 'default',
}: {
  children: React.ReactNode
  onClick?: () => void
  tone?: 'default' | 'mint'
}) {
  return (
    <div
      className={`card${tone === 'mint' ? ' card--mint' : ''}`}
      onClick={onClick}
      style={{
        padding: 'var(--space-5)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
    >
      {children}
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'password'
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="label">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight: 44 }}
      />
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        minHeight: 48,
        padding: '12px 16px',
        borderRadius: 16,
        background: disabled ? 'var(--neutral-200)' : 'var(--brand-blue-500)',
        color: disabled ? 'var(--neutral-700)' : 'var(--neutral-0)',
        fontSize: 'var(--text-16)',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  fullWidth,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        width: fullWidth ? '100%' : 'auto',
        minHeight: 48,
        padding: '12px 16px',
        borderRadius: 16,
        border: 'var(--border)',
        background: 'var(--neutral-0)',
        color: 'var(--neutral-800)',
        fontSize: 'var(--text-16)',
        fontWeight: 600,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: '12px 12px',
        borderRadius: 16,
        border: 'var(--border)',
        background: 'var(--neutral-0)',
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-16)', color: 'var(--neutral-800)' }}>{label}</div>
        {description ? (
          <div className="label" style={{ marginTop: 4 }}>
            {description}
          </div>
        ) : null}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          minWidth: 52,
          height: 32,
          borderRadius: 9999,
          border: 'var(--border)',
          background: checked ? 'rgba(10,147,150,0.20)' : 'var(--neutral-0)',
          position: 'relative',
        }}
        aria-pressed={checked}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 25 : 3,
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: checked ? 'var(--brand-teal-600)' : 'var(--neutral-200)',
          }}
        />
      </button>
    </div>
  )
}

export function Pill({
  tone,
  children,
}: {
  tone: 'info' | 'ok' | 'warn' | 'danger'
  children: React.ReactNode
}) {
  const map = {
    info: { bg: 'rgba(0,95,115,0.10)', fg: 'var(--brand-blue-600)' },
    ok: { bg: 'rgba(155,230,90,0.25)', fg: 'var(--neutral-800)' },
    warn: { bg: 'rgba(214,161,0,0.18)', fg: 'var(--neutral-800)' },
    danger: { bg: 'rgba(209,67,67,0.14)', fg: 'var(--semantic-red-500)' },
  } as const
  const s = map[tone]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        borderRadius: 9999,
        background: s.bg,
        color: s.fg,
        fontSize: 'var(--text-14)',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 9999,
          background: s.fg,
          flex: '0 0 auto',
        }}
      />
      {children}
    </span>
  )
}

export type TabId = 'home' | 'booking' | 'tele' | 'rx' | 'stores' | 'history'

export function TabBar({ active }: { active: TabId }) {
  const navigate = useNavigate()
  const tabs: Array<{ id: TabId; label: string; path: string }> = [
    { id: 'home', label: 'Home', path: '/home' },
    { id: 'booking', label: 'Booking', path: '/booking/search' },
    { id: 'tele', label: 'Tele', path: '/tele/entry' },
    { id: 'rx', label: 'eRx', path: '/rx/entry' },
    { id: 'stores', label: 'Stores', path: '/stores' },
    { id: 'history', label: 'History', path: '/history' },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(247,250,251,0.92)',
        backdropFilter: 'blur(10px)',
        borderTop: 'var(--border)',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0 calc(10px + env(safe-area-inset-bottom))',
        zIndex: 50,
      }}
    >
      <div style={{ width: '100%', maxWidth: 430, display: 'flex', padding: '0 var(--space-5)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 16,
              background: active === tab.id ? 'rgba(10,147,150,0.12)' : 'transparent',
              color: active === tab.id ? 'var(--brand-teal-600)' : 'var(--neutral-700)',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 6px',
            }}
            aria-current={active === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

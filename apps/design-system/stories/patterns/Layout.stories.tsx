import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import { IconBell, IconFilter } from '@tabler/icons-react'
import { Button } from '@meda/ui'

// Simplified layout components for Storybook (without complex hooks)
// These demonstrate the visual patterns without the full app context

// Initialize minimal i18n
const i18nInstance = i18n.createInstance()
i18nInstance.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      settings: {
        'tabs.home': 'Home',
        'tabs.appointments': 'Appointments',
        'tabs.settings': 'Settings',
        offlineBanner: 'You\'re offline. Some features may not work.',
        offlineTryAgain: 'Try again',
        onlineUpdating: 'Connected! Updating...',
      },
    },
  },
})

// Header Component (simplified)
function Header({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}: {
  title: string
  subtitle?: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-10 h-16 bg-white border-b border-cream-300">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-3">
          {showBack && (
            <Button variant="icon" size="sm" onClick={onBack} className="-ml-2" aria-label="Go back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </Button>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-charcoal-500">{title}</h1>
            {subtitle && <p className="truncate text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  )
}

// Page Component (simplified)
function Page({
  children,
  className = '',
  safeBottom = true,
  showOfflineBanner = false,
  isOffline = false,
}: {
  children: React.ReactNode
  className?: string
  safeBottom?: boolean
  showOfflineBanner?: boolean
  isOffline?: boolean
}) {
  return (
    <div className={`min-h-[600px] bg-cream-100 ${safeBottom ? 'pb-32' : ''} ${className}`}>
      <div className="mx-auto max-w-md">
        {showOfflineBanner && isOffline && (
          <div className="px-4 pt-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 flex items-center gap-2">
              <span className="flex-1">You're offline. Some features may not work.</span>
              <button type="button" className="text-xs font-semibold text-teal-700 hover:text-teal-800">
                Try again
              </button>
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// TabBar Component (simplified)
function TabBar({ activeTab = 'home' }: { activeTab?: 'home' | 'appointments' | 'settings' }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-cream-300">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                className={`flex flex-col items-center gap-1 px-2 py-2 flex-1 ${
                  isActive ? 'text-charcoal-500' : 'text-slate-400'
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={tab.icon} />
                </svg>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

// StickyActionBar Component (simplified)
function StickyActionBar({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`absolute bottom-16 left-0 right-0 z-20 bg-white border-t border-cream-300 ${className}`}>
      <div className="mx-auto max-w-md px-4 py-4">
        {children}
      </div>
    </div>
  )
}

// Meta configuration
const meta = {
  title: 'Patterns/Layout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Core layout components for building DocliQ screens.

**Components:**
- **Page**: Main container with offline handling and safe area padding
- **Header**: Sticky header with back navigation and action slots
- **TabBar**: Bottom navigation (Home, Appointments, Settings)
- **StickyActionBar**: Fixed bottom action bar for CTAs
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18nInstance}>
        <MemoryRouter>
          <div className="max-w-[390px] mx-auto bg-cream-100 min-h-[700px] relative overflow-hidden rounded-lg shadow-xl">
            <Story />
          </div>
        </MemoryRouter>
      </I18nextProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Header Stories
export const HeaderBasic: Story = {
  render: () => (
    <div className="bg-cream-100">
      <Header title="Settings" />
      <div className="p-4">
        <p className="text-slate-500">Page content goes here...</p>
      </div>
    </div>
  ),
}

export const HeaderWithBack: Story = {
  render: () => (
    <div className="bg-cream-100">
      <Header
        title="Appointment Details"
        showBack
        onBack={() => alert('Back clicked')}
      />
      <div className="p-4">
        <p className="text-slate-500">Page content goes here...</p>
      </div>
    </div>
  ),
}

export const HeaderWithSubtitle: Story = {
  render: () => (
    <div className="bg-cream-100">
      <Header
        title="Dr. Sarah Mueller"
        subtitle="General Medicine"
        showBack
        onBack={() => {}}
      />
      <div className="p-4">
        <p className="text-slate-500">Doctor profile content...</p>
      </div>
    </div>
  ),
}

export const HeaderWithAction: Story = {
  render: () => (
    <div className="bg-cream-100">
      <Header
        title="Home"
        rightAction={
          <Button variant="icon" size="sm">
            <IconBell size={24} stroke={2} className="text-slate-600" />
          </Button>
        }
      />
      <div className="p-4">
        <p className="text-slate-500">Home screen content...</p>
      </div>
    </div>
  ),
}

// TabBar Stories
export const TabBarHome: Story = {
  render: () => (
    <div className="h-[600px] relative">
      <Page>
        <Header title="Home" />
        <div className="p-4">
          <p className="text-slate-500">Home screen content...</p>
        </div>
      </Page>
      <TabBar activeTab="home" />
    </div>
  ),
}

export const TabBarAppointments: Story = {
  render: () => (
    <div className="h-[600px] relative">
      <Page>
        <Header title="Appointments" />
        <div className="p-4">
          <p className="text-slate-500">Appointments list...</p>
        </div>
      </Page>
      <TabBar activeTab="appointments" />
    </div>
  ),
}

export const TabBarSettings: Story = {
  render: () => (
    <div className="h-[600px] relative">
      <Page>
        <Header title="Settings" />
        <div className="p-4">
          <p className="text-slate-500">Settings options...</p>
        </div>
      </Page>
      <TabBar activeTab="settings" />
    </div>
  ),
}

// StickyActionBar Stories
export const WithStickyActionBar: Story = {
  render: () => (
    <div className="h-[600px] relative">
      <Page safeBottom={false} className="pb-40">
        <Header title="Search Results" showBack onBack={() => {}} />
        <div className="p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white rounded-lg border border-cream-400">
              <p className="text-charcoal-500">Doctor card {i}</p>
            </div>
          ))}
        </div>
      </Page>
      <StickyActionBar>
        <Button variant="primary" fullWidth>
          Continue with selected
        </Button>
      </StickyActionBar>
      <TabBar />
    </div>
  ),
}

// Offline state
export const OfflineState: Story = {
  render: () => (
    <div className="h-[600px] relative">
      <Page showOfflineBanner isOffline>
        <Header title="Home" />
        <div className="p-4">
          <p className="text-slate-500">Content with offline banner above...</p>
        </div>
      </Page>
      <TabBar activeTab="home" />
    </div>
  ),
}

// Full page layout example
export const FullPageLayout: Story = {
  render: () => (
    <div className="h-[700px] relative">
      <Page>
        <Header
          title="Find a Doctor"
          showBack
          onBack={() => {}}
          rightAction={
            <Button variant="icon" size="sm">
              <IconFilter size={20} stroke={2} className="text-slate-600" />
            </Button>
          }
        />
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Search specialties..."
            className="w-full px-4 py-3 bg-white rounded-lg border border-cream-400 text-charcoal-500 placeholder:text-slate-400"
          />
          <div className="space-y-3">
            {['General Medicine', 'Cardiology', 'Dermatology'].map((specialty) => (
              <button
                key={specialty}
                className="w-full p-4 bg-white rounded-lg border border-cream-400 text-left hover:border-teal-500 transition-colors"
              >
                <span className="font-medium text-charcoal-500">{specialty}</span>
              </button>
            ))}
          </div>
        </div>
      </Page>
      <TabBar activeTab="home" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete page layout showing Header, Page, content, and TabBar together.',
      },
    },
  },
}

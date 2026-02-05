import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import {
  IconBell,
  IconCalendar,
  IconUsers,
  IconChevronRight,
  IconHeart,
  IconMapPin,
  IconSearch,
} from '@tabler/icons-react'
import { Button } from '@meda/ui'
import { Pill } from '@docliQ/components/display/Pill'

// ============================================
// Mock Data
// ============================================

const mockUser = {
  fullName: 'Max Mustermann',
  photoUrl: '',
}

const mockNextAppointment = {
  id: 'apt-1',
  doctorName: 'Dr. Sarah Mueller',
  specialty: 'General Medicine',
  dateISO: '2025-02-06',
  time: '10:30',
  status: 'confirmed' as const,
  city: 'Berlin',
}

const mockPendingAppointments = [
  {
    id: 'apt-2',
    doctorName: '',
    specialty: 'Dermatology',
    dateISO: '2025-02-10',
    time: '14:00',
    status: 'matching' as const,
    city: 'Berlin',
  },
  {
    id: 'apt-3',
    doctorName: 'Dr. Hans Weber',
    specialty: 'Cardiology',
    dateISO: '2025-02-12',
    time: '09:30',
    status: 'await_confirm' as const,
    city: 'Munich',
  },
]

const mockMyDoctors = [
  { id: 'doc-1', name: 'Dr. Sarah Mueller', specialty: 'General Medicine', imageUrl: '' },
  { id: 'doc-2', name: 'Dr. Hans Weber', specialty: 'Cardiology', imageUrl: '' },
  { id: 'doc-3', name: 'Dr. Lisa Schmidt', specialty: 'Dermatology', imageUrl: '' },
]

const mockNewsArticles = [
  { id: '1', title: 'Heart Health Tips for Winter', category: 'Cardiology', readTime: 5 },
  { id: '2', title: 'Understanding Your Blood Pressure', category: 'General', readTime: 3 },
]

// ============================================
// i18n Setup
// ============================================

const i18nInstance = i18n.createInstance()
i18nInstance.use(initReactI18next).init({
  lng: 'en',
  resources: {
    en: {
      home: {
        welcomeBack: 'Welcome back,',
        nextAppointment: 'Next Appointment',
        today: 'Today',
        tomorrow: 'Tomorrow',
        dateAt: '{{date}} at',
        viewDetails: 'View Details',
        pendingAppointments: 'Pending Appointments',
        viewAll: 'View All',
        quickActions: 'Quick Actions',
        bookAppointment: 'Book Appointment',
        family: 'Family',
        continueWithDoctor: 'Continue with {{name}}',
        nextAvailableInline: 'Next available slot',
        myDoctors: 'My Doctors',
        searchNewDoctor: 'Search new',
        toggleFavorite: 'Toggle favorite',
        latestNews: 'Health Tips',
        practiceName: 'Practice {{name}}',
        locationUnavailable: 'Location unavailable',
      },
      appointments: {
        'status.matching': 'Matching',
        'status.awaitConfirm': 'Pending',
        'status.confirmed': 'Confirmed',
        'matching.requestedSpecialty': 'Requested specialty',
        'matching.locationPreference': 'Location',
        estimatedWaitShort: '~{{min}}-{{max}} min',
        timeSuffix: '',
      },
      booking: {
        'specialty.General Medicine': 'General Medicine',
        'specialty.Cardiology': 'Cardiology',
        'specialty.Dermatology': 'Dermatology',
      },
    },
  },
})

// ============================================
// Simplified Components (Shell versions)
// ============================================

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-xl',
  }
  const colors = ['bg-teal-500', 'bg-coral-500', 'bg-sky-500', 'bg-amber-500', 'bg-emerald-500']
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const initials = name
    .split(' ')
    .filter((w) => !['Dr.', 'Prof.'].includes(w))
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className={`${sizeStyles[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium`}>
      {initials || '?'}
    </div>
  )
}

function TodaysFocusCard({ appointment, onClick }: { appointment: typeof mockNextAppointment; onClick?: () => void }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-teal-600 p-5 text-white cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-teal-500 opacity-20" />
      <div className="relative z-10">
        <div className="mb-4 inline-block">
          <Pill tone="neutral" size="sm">Next Appointment</Pill>
        </div>
        <div className="mb-1 text-sm font-medium opacity-90">Tomorrow at</div>
        <div className="mb-6 text-5xl font-bold">10:30</div>
        <div className="mb-5 flex items-center gap-3">
          <Avatar name={appointment.doctorName} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-white">{appointment.doctorName}</h3>
            <p className="truncate text-sm opacity-90">{appointment.specialty}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <IconMapPin className="h-4 w-4 flex-shrink-0" stroke={1.5} />
            <span className="truncate">Practice Mueller, {appointment.city}</span>
          </div>
          <button className="flex-shrink-0 rounded-full bg-white px-6 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-cream-50">
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

function AppointmentListCard({ appointment }: { appointment: (typeof mockPendingAppointments)[0] }) {
  const isMatching = appointment.status === 'matching'
  const statusConfig = {
    matching: { tone: 'info' as const, label: 'Matching' },
    await_confirm: { tone: 'pending' as const, label: 'Pending' },
    confirmed: { tone: 'positive' as const, label: 'Confirmed' },
  }
  const status = statusConfig[appointment.status]

  return (
    <div className="p-4">
      <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5">
            {isMatching ? (
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                <IconSearch className="w-6 h-6 text-sky-600" stroke={2} />
              </div>
            ) : (
              <Avatar name={appointment.doctorName} size="lg" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-charcoal-500 truncate">
              {isMatching ? appointment.specialty : appointment.doctorName}
            </h3>
            <div className="mt-0.5 flex items-center gap-2 min-w-0">
              <p className="min-w-0 truncate text-sm text-slate-600">
                {isMatching ? 'Requested specialty' : appointment.specialty}
              </p>
              {isMatching && (
                <span className="shrink-0 text-xs font-semibold text-sky-700">~1-2 min</span>
              )}
            </div>
            {isMatching && (
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <IconMapPin className="w-3.5 h-3.5" stroke={2} />
                <span>Location: {appointment.city}</span>
              </div>
            )}
            {!isMatching && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <IconCalendar className="w-4 h-4" stroke={2} />
                <span>{appointment.dateISO}, {appointment.time}</span>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <Pill tone={status.tone}>{status.label}</Pill>
        </div>
      </div>
    </div>
  )
}

function SwipeableAppointmentStack({ appointments }: { appointments: typeof mockPendingAppointments }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative">
      <div aria-hidden className="absolute inset-0 rounded-[28px] bg-white/70 border border-cream-300 translate-y-3 scale-[0.98]" />
      <div aria-hidden className="absolute inset-0 rounded-[28px] bg-white/50 border border-cream-300 translate-y-6 scale-[0.96]" />
      <div className="relative rounded-[28px] bg-white border border-cream-300 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${-activeIndex * 100}%)` }}
          >
            {appointments.map((apt) => (
              <div key={apt.id} className="w-full shrink-0">
                <AppointmentListCard appointment={apt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TabBar({ activeTab = 'home' }: { activeTab?: string }) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: IconCalendar },
    { id: 'appointments', label: 'Appointments', Icon: IconCalendar },
    { id: 'settings', label: 'Settings', Icon: IconUsers },
  ]

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-cream-300">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center gap-1 px-2 py-2 flex-1 ${
              tab.id === activeTab ? 'text-charcoal-500' : 'text-slate-400'
            }`}
          >
            <tab.Icon size={24} stroke={2} />
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

// ============================================
// HomeScreen Shell Component
// ============================================

interface HomeScreenShellProps {
  user?: typeof mockUser
  nextAppointment?: typeof mockNextAppointment | null
  pendingAppointments?: typeof mockPendingAppointments
  myDoctors?: typeof mockMyDoctors
  showNews?: boolean
}

function HomeScreenShell({
  user = mockUser,
  nextAppointment = mockNextAppointment,
  pendingAppointments = mockPendingAppointments,
  myDoctors = mockMyDoctors,
  showNews = true,
}: HomeScreenShellProps) {
  const [pendingStackIndex, setPendingStackIndex] = useState(0)
  const safePendingIndex = Math.min(pendingStackIndex, Math.max(pendingAppointments.length - 1, 0))

  return (
    <div className="min-h-[800px] bg-cream-100 pb-20 relative">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-cream-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={user.fullName} size="md" />
            <div>
              <p className="text-sm text-slate-500">Welcome back,</p>
              <h1 className="text-xl font-semibold text-charcoal-500">{user.fullName}</h1>
            </div>
          </div>
          <button className="relative">
            <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors">
              <IconBell size={20} className="text-charcoal-500" strokeWidth={2} />
            </div>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Today's Focus */}
        {nextAppointment && (
          <section>
            <TodaysFocusCard appointment={nextAppointment} onClick={() => {}} />
          </section>
        )}

        {/* Pending Appointments */}
        {pendingAppointments.length > 0 && (
          <section>
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-charcoal-500">Pending Appointments</h2>
                <div className="mt-1 flex items-center gap-2">
                  {pendingAppointments.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 w-8 rounded-full ${idx === safePendingIndex ? 'bg-charcoal-500' : 'bg-cream-300'}`}
                    />
                  ))}
                </div>
              </div>
              <button className="text-sm text-teal-700 font-medium hover:underline">View All</button>
            </div>
            <SwipeableAppointmentStack appointments={pendingAppointments} />
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-charcoal-500 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors text-left">
              <IconCalendar size={24} strokeWidth={2} className="mb-2" />
              <span className="font-medium">Book Appointment</span>
            </button>
            <button className="p-4 bg-white border border-cream-400 rounded-lg text-charcoal-500 hover:bg-cream-50 transition-colors text-left">
              <IconUsers size={24} strokeWidth={2} className="mb-2 text-slate-600" />
              <span className="font-medium">Family</span>
            </button>
          </div>
        </section>

        {/* Continue with Doctor */}
        {myDoctors.length > 0 && (
          <section className="space-y-4">
            <button className="w-full text-left bg-white border border-cream-400 rounded-2xl p-4 shadow-sm hover:bg-cream-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-slate-600 uppercase">
                    Continue with {myDoctors[0].name}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">Next available slot</p>
                </div>
                <div className="shrink-0 w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center text-slate-600">
                  <IconChevronRight size={18} stroke={2} />
                </div>
              </div>
            </button>

            {/* My Doctors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-charcoal-500">My Doctors</h2>
                <button className="text-xs text-teal-700 font-medium hover:underline">Search new</button>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {myDoctors.slice(0, 5).map((doctor) => (
                  <div
                    key={doctor.id}
                    className="relative w-[132px] shrink-0 bg-white border border-cream-400 rounded-2xl p-3 text-left hover:bg-cream-50 transition-colors cursor-pointer"
                  >
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center text-slate-500 hover:bg-cream-200 transition-colors">
                      <IconHeart size={16} stroke={2} />
                    </button>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-cream-100 mb-2">
                      <Avatar name={doctor.name} size="sm" />
                    </div>
                    <p className="text-sm font-semibold text-charcoal-500 truncate">{doctor.name}</p>
                    <p className="text-xs text-slate-500 truncate">{doctor.specialty}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Health Tips */}
        {showNews && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-charcoal-500">Health Tips</h2>
              <button className="text-sm text-teal-700 font-medium hover:underline">See all</button>
            </div>
            <div className="space-y-3">
              {mockNewsArticles.map((article) => (
                <div key={article.id} className="bg-white border border-cream-400 rounded-xl p-4 hover:bg-cream-50 transition-colors cursor-pointer">
                  <p className="text-xs text-teal-700 font-medium mb-1">{article.category}</p>
                  <h3 className="font-medium text-charcoal-500">{article.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{article.readTime} min read</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <TabBar activeTab="home" />
    </div>
  )
}

// ============================================
// Storybook Configuration
// ============================================

const meta = {
  title: 'Screens/HomeScreen',
  component: HomeScreenShell,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
The HomeScreen is the main dashboard showing:
- **Header**: User greeting and notification bell
- **Today's Focus**: Next confirmed appointment (hero card)
- **Pending Appointments**: Swipeable stack of matching/pending appointments
- **Quick Actions**: Book appointment & Family management
- **My Doctors**: Horizontal scroll of saved doctors
- **Health Tips**: News articles section
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18nInstance}>
        <MemoryRouter>
          <div className="max-w-[390px] mx-auto bg-cream-100 min-h-screen relative overflow-hidden rounded-lg shadow-xl border border-cream-300">
            <Story />
          </div>
        </MemoryRouter>
      </I18nextProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof HomeScreenShell>

export default meta
type Story = StoryObj<typeof meta>

// ============================================
// Stories
// ============================================

export const Default: Story = {
  args: {},
}

export const NewUser: Story = {
  args: {
    nextAppointment: null,
    pendingAppointments: [],
    myDoctors: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'HomeScreen for a new user with no appointments or saved doctors.',
      },
    },
  },
}

export const WithPendingOnly: Story = {
  args: {
    nextAppointment: null,
    pendingAppointments: mockPendingAppointments,
    myDoctors: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'User has pending appointments but no confirmed upcoming appointment.',
      },
    },
  },
}

export const WithConfirmedOnly: Story = {
  args: {
    nextAppointment: mockNextAppointment,
    pendingAppointments: [],
    myDoctors: mockMyDoctors,
  },
  parameters: {
    docs: {
      description: {
        story: 'User has a confirmed appointment but no pending ones.',
      },
    },
  },
}

export const NoNews: Story = {
  args: {
    showNews: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'HomeScreen without the Health Tips section.',
      },
    },
  },
}

export const ManyDoctors: Story = {
  args: {
    myDoctors: [
      ...mockMyDoctors,
      { id: 'doc-4', name: 'Dr. Anna Becker', specialty: 'Neurology', imageUrl: '' },
      { id: 'doc-5', name: 'Dr. Thomas Klein', specialty: 'Orthopedics', imageUrl: '' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'User with many saved doctors (tests horizontal scroll).',
      },
    },
  },
}

export const LongUserName: Story = {
  args: {
    user: {
      fullName: 'Maximilian von Mustermann-Schmidt',
      photoUrl: '',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Tests text truncation with a long user name.',
      },
    },
  },
}

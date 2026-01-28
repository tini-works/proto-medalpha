import { Link, useLocation } from 'react-router-dom'
import { IconHome, IconCalendar, IconClock, IconSettings } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

interface TabItem {
  path: string
  labelKey: 'tabs.home' | 'tabs.appointments' | 'tabs.settings'
  icon: 'home' | 'calendar' | 'history' | 'settings'
}

const tabs: TabItem[] = [
  { path: '/home', labelKey: 'tabs.home', icon: 'home' },
  { path: '/history', labelKey: 'tabs.appointments', icon: 'calendar' },
  { path: '/settings', labelKey: 'tabs.settings', icon: 'settings' },
]

function TabIcon({ icon, active }: { icon: TabItem['icon']; active: boolean }) {
  const color = active ? 'text-charcoal-500' : 'text-slate-400'

  // Use Tabler icons with appropriate styling for navigation bar
  switch (icon) {
    case 'home':
      return <IconHome className={color} size={24} stroke={2} />
    case 'calendar':
      return <IconCalendar className={color} size={24} stroke={2} />
    case 'history':
      return <IconClock className={color} size={24} stroke={2} />
    case 'settings':
      return <IconSettings className={color} size={24} stroke={2} />
  }
}

export function TabBar() {
  const location = useLocation()
  const { t } = useTranslation('settings')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-cream-300">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path.split('/')[1] ? `/${tab.path.split('/')[1]}` : tab.path)
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center gap-1 px-4 py-2 min-w-[64px] ${
                  isActive ? 'text-charcoal-500' : 'text-slate-400'
                }`}
              >
                <TabIcon icon={tab.icon} active={isActive} />
                <span className="text-xs font-medium">{t(tab.labelKey)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import { TabBar } from '../TabBar'

// Initialize test i18n with German translations
i18n.init({
  lng: 'de',
  resources: {
    de: {
      settings: {
        tabs: {
          home: 'Startseite',
          appointments: 'Termine',
          settings: 'Einstellungen',
        },
      },
    },
    en: {
      settings: {
        tabs: {
          home: 'Home',
          appointments: 'Appointments',
          settings: 'Settings',
        },
      },
    },
  },
})

function renderTabBar(route = '/home') {
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <TabBar />
      </MemoryRouter>
    </I18nextProvider>
  )
}

describe('TabBar', () => {
  it('renders all three tabs', () => {
    renderTabBar()

    expect(screen.getByText('Startseite')).toBeInTheDocument()
    expect(screen.getByText('Termine')).toBeInTheDocument()
    expect(screen.getByText('Einstellungen')).toBeInTheDocument()
  })

  it('tabs have flex-1 for equal distribution', () => {
    const { container } = renderTabBar()

    const links = container.querySelectorAll('a')
    links.forEach((link) => {
      expect(link.classList.contains('flex-1')).toBe(true)
    })
  })

  it('tab labels have truncate class for overflow handling', () => {
    const { container } = renderTabBar()

    const labels = container.querySelectorAll('span')
    labels.forEach((label) => {
      expect(label.classList.contains('truncate')).toBe(true)
    })
  })

  it('renders long German text without breaking layout', () => {
    renderTabBar()

    // Einstellungen (13 chars) should render without issue
    const settingsTab = screen.getByText('Einstellungen')
    expect(settingsTab).toBeInTheDocument()
    expect(settingsTab).toBeVisible()
  })

  it('renders English translations when language changes', async () => {
    await i18n.changeLanguage('en')
    renderTabBar()

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Appointments')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()

    // Reset to German
    await i18n.changeLanguage('de')
  })
})

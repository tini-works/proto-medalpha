import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import type { ReactElement, ReactNode } from 'react'
import { AppProvider } from '../state/AppContext'

// Initialize a test i18n instance that returns keys
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  ns: ['common', 'booking', 'auth', 'settings', 'home', 'history'],
  defaultNS: 'common',
  resources: {
    en: {
      common: {},
      booking: {},
      auth: {},
      settings: {},
      home: {},
      history: {},
    },
  },
  interpolation: {
    escapeValue: false,
  },
})

interface WrapperProps {
  children: ReactNode
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[]
}

function AllProviders({ children }: WrapperProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppProvider>{children}</AppProvider>
      </BrowserRouter>
    </I18nextProvider>
  )
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { initialEntries, ...renderOptions } = options || {}

  if (initialEntries) {
    return render(ui, {
      wrapper: ({ children }) => (
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={initialEntries}>
            <AppProvider>{children}</AppProvider>
          </MemoryRouter>
        </I18nextProvider>
      ),
      ...renderOptions,
    })
  }

  return render(ui, { wrapper: AllProviders, ...renderOptions })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

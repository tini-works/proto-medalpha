import type { Preview } from '@storybook/react'
import '../styles.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'cream',
      values: [
        { name: 'cream', value: '#FAF8F5' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'charcoal', value: '#1C2A30' },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '390px', height: '844px' },
        },
        mobileSm: {
          name: 'Mobile Small',
          styles: { width: '320px', height: '568px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
      },
      defaultViewport: 'mobile',
    },
  },
}

export default preview

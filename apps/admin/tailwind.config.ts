import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [medaPreset],
} satisfies Config

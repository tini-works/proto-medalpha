import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

// Business intent: keep visual language consistent across MedAlpha prototypes.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  presets: [medaPreset],
} satisfies Config


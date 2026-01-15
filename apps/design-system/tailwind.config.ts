import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: [
    './stories/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [medaPreset],
} satisfies Config

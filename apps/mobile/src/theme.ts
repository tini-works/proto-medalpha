import { colors, spacing, typography } from '@meda/tokens'

export const theme = {
  colors,
  spacing,
  typography,
}

// Type-safe style helpers
export const getColor = (path: string): string => {
  const parts = path.split('.')
  let value: unknown = colors
  for (const part of parts) {
    value = (value as Record<string, unknown>)[part]
  }
  return value as string
}

export const getSpacing = (key: keyof typeof spacing): number => {
  return spacing[key]
}

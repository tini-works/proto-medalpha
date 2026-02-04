import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const srcDir = path.join(__dirname, '..', 'src')
const outDir = path.join(__dirname, '..', 'generated')

// Ensure output directory exists
fs.mkdirSync(outDir, { recursive: true })

// Read source tokens
const colors = JSON.parse(fs.readFileSync(path.join(srcDir, 'colors.json'), 'utf-8'))
const spacing = JSON.parse(fs.readFileSync(path.join(srcDir, 'spacing.json'), 'utf-8'))
const typography = JSON.parse(fs.readFileSync(path.join(srcDir, 'typography.json'), 'utf-8'))

const BASE_FONT_SIZE = 16

// Helper: convert rem string to number for RN
function remToNumber(value: string): number {
  if (value === '0') return 0
  const match = value.match(/^([\d.]+)rem$/)
  if (match) {
    return parseFloat(match[1]) * BASE_FONT_SIZE
  }
  return parseFloat(value) || 0
}

// Helper: recursively convert spacing values for RN
function convertSpacingForRN(obj: Record<string, string>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = remToNumber(value)
  }
  return result
}

// Helper: convert fontSize for RN
function convertFontSizeForRN(obj: Record<string, string>): Record<string, number> {
  const result: Record<string, number> = {}
  for (const [key, value] of Object.entries(obj)) {
    result[key] = remToNumber(value)
  }
  return result
}

// Generate tokens.ts (RN-ready with numbers)
const tokensTs = `// AUTO-GENERATED - DO NOT EDIT
// Source: packages/tokens/src/*.json

export const colors = ${JSON.stringify(colors, null, 2)} as const

export type Colors = typeof colors

export const spacing = ${JSON.stringify(convertSpacingForRN(spacing), null, 2)} as const

export type Spacing = typeof spacing

export const typography = {
  fontFamily: ${JSON.stringify(typography.fontFamily, null, 2)},
  fontSize: ${JSON.stringify(convertFontSizeForRN(typography.fontSize), null, 2)},
  fontWeight: ${JSON.stringify(typography.fontWeight, null, 2)},
  lineHeight: ${JSON.stringify(typography.lineHeight, null, 2)},
} as const

export type Typography = typeof typography
`

fs.writeFileSync(path.join(outDir, 'tokens.ts'), tokensTs)
console.log('Generated: tokens.ts')

// Generate tailwind-preset.ts
const tailwindPreset = `// AUTO-GENERATED - DO NOT EDIT
// Source: packages/tokens/src/*.json

export const medaPreset = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)},
      spacing: ${JSON.stringify(spacing, null, 6)},
      fontFamily: ${JSON.stringify(typography.fontFamily, null, 6)},
      fontSize: ${JSON.stringify(typography.fontSize, null, 6)},
      fontWeight: ${JSON.stringify(typography.fontWeight, null, 6)},
      lineHeight: ${JSON.stringify(typography.lineHeight, null, 6)},
    },
  },
}
`

fs.writeFileSync(path.join(outDir, 'tailwind-preset.ts'), tailwindPreset)
console.log('Generated: tailwind-preset.ts')

// Generate CSS variables
function flattenToCSS(obj: Record<string, unknown>, prefix = ''): string[] {
  const vars: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key
    if (typeof value === 'object' && value !== null) {
      vars.push(...flattenToCSS(value as Record<string, unknown>, varName))
    } else {
      vars.push(`  --${varName}: ${value};`)
    }
  }
  return vars
}

const cssVars = [
  '/* AUTO-GENERATED - DO NOT EDIT */',
  '/* Source: packages/tokens/src/*.json */',
  '',
  ':root {',
  ...flattenToCSS({ color: colors }),
  ...flattenToCSS({ spacing }),
  ...flattenToCSS({ font: typography.fontFamily }),
  ...flattenToCSS({ 'font-size': typography.fontSize }),
  '}',
].join('\n')

fs.writeFileSync(path.join(outDir, 'css-variables.css'), cssVars)
console.log('Generated: css-variables.css')

console.log('Token build complete!')

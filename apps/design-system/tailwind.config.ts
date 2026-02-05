import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

export default {
  content: [
    './stories/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../apps/docliQ-mobile/src/**/*.{ts,tsx}',
  ],
  presets: [medaPreset],
  theme: {
    extend: {
      // DocliQ Brand Colors (from docliQ-mobile)
      colors: {
        teal: {
          50: '#E8F6F8',
          100: '#C5E9ED',
          200: '#9DD9E0',
          300: '#6EC6D0',
          400: '#40B3C3',
          500: '#13A3B5',
          600: '#0F8A99',
          700: '#0B6F7C',
          800: '#085560',
          900: '#053B43',
        },
        charcoal: {
          50: '#E8EAEB',
          100: '#C5CACC',
          200: '#9DA6AA',
          300: '#748188',
          400: '#4E5D64',
          500: '#1C2A30',
          600: '#182428',
          700: '#131D21',
          800: '#0F1719',
          900: '#0A1012',
        },
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F3EF',
          300: '#EFEBE5',
          400: '#E8E3DB',
          500: '#E1DBD1',
        },
        slate: {
          50: '#EEF1F3',
          100: '#D5DBDF',
          200: '#B8C3C9',
          300: '#9AABB3',
          400: '#7C939D',
          500: '#5E7A86',
          600: '#4E666F',
          700: '#3E5159',
          800: '#2E3D43',
          900: '#1F292D',
        },
        coral: {
          50: '#FDF3F0',
          100: '#FAE0D9',
          200: '#F5C7BC',
          300: '#F0AD9E',
          400: '#EC9488',
          500: '#E88A73',
          600: '#E06A4F',
          700: '#C9503A',
          800: '#A03D2D',
          900: '#772D21',
        },
      },
      fontFamily: {
        sans: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      },
      fontSize: {
        'display-lg': ['72px', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
        'display-md': ['48px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'display-sm': ['32px', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '-0.01em' }],
        'headline-lg': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-lg': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'label-md': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.02em' }],
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        scaleIn: {
          from: { transform: 'scale(0.95)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' },
        },
      },
    },
  },
} satisfies Config

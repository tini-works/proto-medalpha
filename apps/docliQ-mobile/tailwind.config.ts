import type { Config } from 'tailwindcss'
import { medaPreset } from '@meda/tokens/tailwind'

/**
 * DocliQ Design Tokens - Tailwind Configuration
 * Based on DocliQ Brand Guide 2025
 * WCAG 2.1 AA Compliant
 */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  presets: [medaPreset],
  theme: {
    extend: {
      colors: {
        // DocliQ Brand Colors - Primitive Palette
        teal: {
          50: '#E8F6F8',
          100: '#C5E9ED',
          200: '#9DD9E0',
          300: '#6EC6D0',
          400: '#40B3C3',
          500: '#13A3B5', // Primary CTA
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
          500: '#1C2A30', // Primary text
          600: '#182428',
          700: '#131D21',
          800: '#0F1719',
          900: '#0A1012',
        },
        cream: {
          50: '#FDFCFB',
          100: '#FAF8F5', // Main background
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
          500: '#5E7A86', // Secondary text
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
          500: '#E88A73', // Accent
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
        // DocliQ Type Scale
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
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(28, 42, 48, 0.05)',
        md: '0 4px 6px -1px rgba(28, 42, 48, 0.07), 0 2px 4px -2px rgba(28, 42, 48, 0.05)',
        lg: '0 10px 15px -3px rgba(28, 42, 48, 0.08), 0 4px 6px -4px rgba(28, 42, 48, 0.05)',
        xl: '0 20px 25px -5px rgba(28, 42, 48, 0.1), 0 8px 10px -6px rgba(28, 42, 48, 0.05)',
        '2xl': '0 25px 50px -12px rgba(28, 42, 48, 0.15)',
        focus: '0 0 0 3px rgba(19, 163, 181, 0.4)',
      },
      spacing: {
        '11': '44px', // Touch target minimum
      },
      transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      transitionTimingFunction: {
        // Use as `ease-out-brand`
        'out-brand': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-out': 'slideOut 200ms ease-in forwards',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        'modal-enter': 'modalEnter 350ms cubic-bezier(0, 0, 0.2, 1)',
        'modal-exit': 'modalExit 250ms cubic-bezier(0.4, 0, 1, 1)',
        'pulse-scan': 'pulseGentle 1500ms ease-in-out infinite',
        'success-spring': 'successSpring 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake-error': 'shakeError 400ms ease-in-out',
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
        scaleOut: {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          from: { transform: 'translateY(-10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(-10px)', opacity: '0' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.85' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        modalEnter: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        modalExit: {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.95)' },
        },
        successSpring: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shakeError: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-8px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(8px)' },
        },
      },
    },
  },
} satisfies Config

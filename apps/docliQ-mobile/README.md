# DocliQ - Appointment Booking N3

A comprehensive healthcare appointment booking web application built with React and TypeScript. This is the N3 iteration of the appointment booking prototype, featuring a complete user flow from authentication through appointment confirmation.

## Overview

DocliQ N3 is a full-featured appointment booking platform that enables users to:
- Search and book doctor appointments
- Manage family member profiles
- View appointment history
- Access personalized health content
- Manage account settings and notifications

The app follows a mobile-first design approach with a focus on trust, efficiency, and humanity, aligned with German healthcare standards and GDPR compliance.

## Features

### Component System
- **Button**: `src/components/ui/Button.tsx` — 8 variants (primary, secondary, tertiary, accent, destructive, destructive-filled, icon, link), sizes sm/md/lg, loading + icon slots
- **Icons**: Tabler Icons (`@tabler/icons-react`) — 60+ icons across nav, actions, status, user, location; used app-wide; `GoogleGIcon` (colored Google G) for OAuth sign-in
- **Design**: DocliQ tokens (teal, coral, red) + Tailwind v3

### Auth & Profile
- Welcome, register, sign in, forgot/reset password, verify identity; password field (show/hide) + strength indicator (OWASP)
- Profile + insurance (GKV/PKV), family members + dependents

### Booking Flow
- **Paths**: Fast Lane (symptoms → auto-match), By specialty (specialty → city/insurance → availability), By doctor (doctor → symptoms → slot → confirm)
- **Steps**: Search/specialty → location/radius → results + filters → symptoms (doctor path) → doctor profile → slot → confirmation + patient → success
- **Matched doctors**: Radio-style selection (Circle/CircleCheck), 44×44px tap target on confirmation

### i18n
- EN + DE via react-i18next; namespaced by domain (auth, profile, settings, home, booking, notifications)
- Auth, profile, settings, home, notifications translated; FAQ/help from i18n; dates localized (de-DE, en-US); preference in state + localStorage

### Other
- **Home**: Quick actions, upcoming appointments, content
- **Updates**: Notifications (grouped TODAY/YESTERDAY) + News Feed (guides, featured story, articles, article detail with share/save)
- **Appointments**: Detail (summary, location, add to calendar), book again, reschedule, history (grouped, filters, Book new)
- **Request Sent**: Post-submit screen; toasts on status change (configurable); queue + localized offline banner
- CMS content, settings (account, notifications, language, privacy, support), responsive

## Tech Stack

- **Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Routing**: React Router DOM 6.20
- **Styling**: Tailwind CSS 3.4
- **Internationalization**: react-i18next 11.x and i18next 23.x
- **Design System**: 
  - `@meda/tokens` - Shared design tokens
  - `@meda/ui` - Reusable React components
- **State Management**: React Context API with localStorage persistence
- **Font**: DM Sans (Google Fonts)

## Project Structure

```
appointment-booking-N3/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── cards/          # Card components (Appointment, Doctor, CMS, etc.)
│   │   ├── display/        # Display components (Avatar, Rating, EmptyState, etc.)
│   │   ├── forms/          # Form components (Field, Select, RadioGroup, etc.)
│   │   ├── layout/         # Layout components (Header, Page, TabBar)
│   │   ├── newsfeed/       # News Feed components (ShortGuidesSection, FeaturedStoryCard, etc.)
│   │   └── notifications/  # Notification components (NotificationCard)
│   ├── data/               # Mock data and API functions
│   │   ├── api.ts          # API service functions
│   │   ├── doctors.ts      # Doctor data
│   │   ├── stores.ts       # Pharmacy/store data
│   │   ├── timeSlots.ts    # Time slot utilities
│   │   ├── cms.ts          # CMS content
│   │   ├── notifications.ts # Notification mock data
│   │   └── newsfeed.ts     # News Feed articles and guides
│   ├── i18n/               # Internationalization (i18n)
│   │   └── index.ts        # i18next configuration and initialization
│   ├── hooks/              # Custom React hooks
│   │   └── useI18nSync.ts  # Hook to sync i18n language with app state
│   ├── locales/            # Translation files
│   │   ├── en/             # English translations
│   │   │   ├── settings.json
│   │   │   ├── home.json
│   │   │   ├── notifications.json
│   │   │   ├── booking.json
│   │   │   ├── auth.json
│   │   │   └── profile.json
│   │   └── de/             # German translations
│   │       ├── settings.json
│   │       ├── home.json
│   │       ├── notifications.json
│   │       ├── booking.json
│   │       ├── auth.json
│   │       └── profile.json
│   ├── routes/             # Routing configuration
│   │   ├── paths.ts        # Route path constants
│   │   ├── guards.tsx     # Route guards (RequireAuth, RequireProfileComplete)
│   │   └── index.ts        # Route exports
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── assistant/      # Assistant screens
│   │   ├── book-again/     # Book again flow screens
│   │   ├── booking/        # Booking flow screens
│   │   ├── home/           # Home dashboard
│   │   ├── history/        # Appointment history
│   │   ├── appointments/   # Appointment detail screens
│   │   ├── notifications/  # Notifications/Updates screen
│   │   ├── newsfeed/       # Article detail screen
│   │   ├── profile/        # Profile management
│   │   ├── reschedule/     # Reschedule flow screens
│   │   └── settings/       # Settings screens
│   ├── state/              # State management
│   │   ├── AppContext.tsx  # Main app context provider
│   │   ├── storage.ts      # localStorage utilities
│   │   └── index.ts        # State hooks exports
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles and design tokens
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Access to the monorepo root (for shared packages)

### Installation

From the monorepo root:

```bash
# Install all dependencies (including shared packages)
pnpm install

# Build shared packages (required before running the app)
pnpm build:packages
```

### Development

```bash
# Start the development server
pnpm dev:n3

# Or from the app directory
cd apps/appointment-booking-N3
pnpm dev
```

The app will be available at **http://localhost:5190**. The dev server listens on all interfaces, so you can also open the app from other devices on the same LAN using the network URL Vite prints in the terminal.

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Design System

The app uses the **DocliQ Design System** based on the Brand Guide 2025:

### Color Palette
- **Teal** (Primary): `#13A3B5` - Primary CTAs and brand elements
- **Charcoal** (Text): `#1C2A30` - Primary text color
- **Cream** (Background): `#FAF8F5` - Main app background
- **Slate** (Secondary): `#5E7A86` - Secondary text
- **Coral** (Accent): `#E88A73` - Accent elements

### Typography
- **Font Family**: DM Sans
- **Scale**: Responsive type scale optimized for readability
- **WCAG 2.1 AA Compliant**: All text meets contrast requirements

### Components
Reusable components are available from `@meda/ui` and custom components in `src/components/`.

## State Management

The app uses React Context API for state management with localStorage persistence:

- **AppContext**: Main application state (auth, profile, booking, appointments)
- **Storage**: Automatic persistence to localStorage with key `docliq_n3_state_v1`
- **Route Guards**: Protected routes requiring authentication and profile completion

### State Structure

```typescript
{
  auth: { user: User | null }
  profile: { profile: Profile, familyMembers: FamilyMember[] }
  booking: { 
    searchParams: SearchParams
    selectedDoctor: Doctor | null
    selectedSlot: TimeSlot | null
    appointments: Appointment[]
  }
}
```

## Routing

The app uses React Router with the following main routes:

- `/auth/welcome` - Welcome screen
- `/auth/register` - Registration
- `/auth/sign-in` - Sign in
- `/auth/verify` - Email verification
- `/auth/verify-identity` - Identity verification
- `/home` - Home dashboard
- `/notifications` - Updates center with Notifications and News Feed tabs
- `/news/:articleId` - Article detail view with full content
- `/booking/*` - Booking flow (search → location → results → doctor → slots → confirm → success)
- `/history` - Appointment history
- `/appointments/*` - Appointment detail views
- `/book-again/*` - Book again flow
- `/reschedule/*` - Reschedule flow
- `/assistant/*` - Assistant and voice assistant
- `/profile/*` - Profile management
- `/settings/*` - Settings, notifications, language, privacy, support

All routes except auth are protected and require authentication and profile completion.

## Data & API

Currently uses mock data located in `src/data/`. The API functions in `src/data/api.ts` are structured to be easily replaced with real API calls:

- `apiSearchDoctors()` - Search doctors by specialty and location
- `apiGetDoctor(id)` - Get doctor details
- `apiGetAvailableDates(id)` - Get available appointment dates
- `apiGetSlotsForDate(id, date)` - Get time slots for a date
- `apiBookAppointment()` - Book an appointment
- `apiGetCMSContent()` - Get personalized content

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- No semicolons, single quotes, trailing commas (per project standards)
- Component files use PascalCase
- Utility files use camelCase

### Adding Features
1. Create components in appropriate `components/` subdirectory
2. Add screens in `screens/` with corresponding route in `App.tsx`
3. Update types in `types/` as needed
4. Use design tokens from `@meda/tokens` for colors/spacing
5. Follow existing patterns for state management

### Testing
// Automated tests
- `pnpm test`: Run Vitest in watch mode with React Testing Library
- `pnpm test:run`: Run the test suite once (CI-friendly)
- `pnpm test:coverage`: Run tests with coverage reporting

// Manual testing
- Manual testing recommended for UI flows
- Check responsive behavior on mobile and desktop
- Verify route guards work correctly
- Test localStorage persistence

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design optimized for mobile-first

## Documentation

Design and architecture documentation is available in `docs/`:

- [INFO-MAP-v3.md](../../docs/INFO-MAP-v3.md) - Information Architecture with Master IA Diagram
- [USER-FLOWS-v3.md](../../docs/USER-FLOWS-v3.md) - User flows and Jobs-to-be-Done
- [scope-index-v3.md](../../docs/scope-index-v3.md) - Feature scope index

## Version

**DocliQ N3 v1.0.0**

## License

Private - All rights reserved.

# User Flow Diagrams

This folder contains Mermaid user flow diagrams for MedAlpha Connect mobile app implementation.

## Files

| File | Description |
|------|-------------|
| `00-app-overview.mermaid` | High-level app structure and navigation model |
| `01-entry-auth.mermaid` | Entry, onboarding, login, register, SSO, profile completion |
| `02-appointments.mermaid` | Appointments hub, in-person booking, telemedicine, post-appointment |
| `03-prescriptions.mermaid` | Prescriptions hub, home delivery (NFC), pharmacy pickup |
| `04-history.mermaid` | History hub with tabs, detail screens for each type |
| `05-settings-profile.mermaid` | Menu, profile, settings, static pages, logout |

## How to Use

### For AI Implementation

When implementing screens, reference these flows to understand:

1. **Entry points** - How users arrive at each screen
2. **Screen content** - What elements appear on each screen
3. **User actions** - What users can do on each screen
4. **Navigation** - Where users go after each action
5. **States** - Normal, empty, loading, error states

### Screen ID Reference

Each screen has a unique ID matching the IA map:

| Prefix | Area |
|--------|------|
| `SPL-` | Splash |
| `ONB-` | Onboarding |
| `AUTH-` | Authentication |
| `PRF-` | Profile |
| `HOME-` | Home |
| `APT-` | Appointments |
| `RX-` | Prescriptions |
| `HIS-` | History |
| `SET-` | Settings |
| `STA-` | Static pages |

### Navigation Model

**Bottom Tabs (Layer 2):**
- 🏠 Home (HOME-001)
- 📅 Appointments (APT-001)
- 💊 Prescriptions (RX-001)
- 📋 History (HIS-001)

**Menu Access (Layer 3):**
- Profile (PRF-002)
- Settings (SET-001)
- FAQ (STA-001)
- Support (STA-002)
- Privacy Policy (STA-003)
- Legal Disclosure (STA-004)
- Logout

## Related Documents

| Document | Path |
|----------|------|
| IA Map (Patient Mobile) | `artifacts/information-architecture/sitemap.mermaid` |
| IA Map (Admin Web) | `artifacts/information-architecture/admin-sitemap.mermaid` |
| States Matrix | `artifacts/information-architecture/states-matrix.md` |
| Design Document | `docs/plans/2026-01-19-ia-map-improvement-design.md` |

## Rendering Mermaid

To view these diagrams:

1. **VS Code**: Install "Mermaid Preview" extension
2. **GitHub**: Mermaid renders automatically in `.md` files
3. **Online**: Use [Mermaid Live Editor](https://mermaid.live)

## Diagram Conventions

### Node Shapes

| Shape | Meaning |
|-------|---------|
| `([text])` | Entry/exit point |
| `[text]` | Screen or component |
| `{text}` | Decision point |
| `((text))` | Animation/loading |

### Line Styles

| Style | Meaning |
|-------|---------|
| `-->` | Normal navigation |
| `-.->` | Optional/conditional |
| `<-->` | Bidirectional (tabs) |

### Color Classes

| Class | Meaning |
|-------|---------|
| `entry` | Entry points (blue) |
| `hub` | Hub screens (orange) |
| `detail` | Detail screens (green) |
| `error` | Error states (red) |
| `destination` | Exit points (green) |

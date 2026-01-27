# Scope for Exploration: Pharmacy Search (Apothekensuche)

**Feature ID:** MEDA-APOT
**Version:** 1.0
**Last Updated:** 2026-01-20
**Status:** Draft

---

## 1. Overview

### Main Job to Be Done (JTBD)

> **When I need medication immediately or want to find a pharmacy nearby, help me locate pharmacies, check their services and hours, and get directions, so I can get what I need without wasted trips.**

### Purpose

Enable MedAlpha users to discover nearby pharmacies, view their services (e-prescription capability, vaccinations, consultations), check opening hours including emergency/night pharmacies, and navigate to their chosen location. The feature complements e-prescription redemption by providing the local pharmacy option and standalone value for urgent medication needs.

### Strategic Context

- **Complementary Feature:** Integrates with E-Rezept "Local Pharmacy" path; also standalone utility.
- **Partner:** Google Maps for location services; local pharmacy network data.
- **User Value:** Reduces "wasted trips" to closed or unsuitable pharmacies; emergency pharmacy discovery.

---

## 2. Personas & Priority

| Persona | Priority | Key Need |
|---------|----------|----------|
| Helga (68) | Primary | Find nearby pharmacy with easy access; know opening hours before traveling |
| Sarah (34) | Primary | Quick pharmacy finder during errands; child-friendly services; urgent needs |
| Thomas (51) | Secondary | Know exactly what services are available; no surprises |
| Marc (42) | Tertiary | Pharmacies with specific services (e.g., vaccinations, sports medicine) |
| Elena (23) | Tertiary | Modern pharmacies; discreet consultation options |

---

## 3. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PHARMACY SEARCH USER FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    Entry     │
                              │    Point     │
                              └──────────────┘
                                     │
                      ┌──────────────┼──────────────┐
                      ▼              ▼              ▼
               ┌──────────┐   ┌──────────┐   ┌──────────┐
               │  From    │   │  Home    │   │  From    │
               │ E-Rezept │   │  Tab     │   │  Search  │
               │  Flow    │   │          │   │          │
               └──────────┘   └──────────┘   └──────────┘
                      │              │              │
                      └──────────────┼──────────────┘
                                     ▼
                              ┌──────────────┐
                              │   Map View   │
                              │   + List     │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Filters    │
                              │  (Optional)  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Pharmacy   │
                              │   Selection  │
                              └──────────────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   Pharmacy   │
                              │   Details    │
                              └──────────────┘
                                     │
                      ┌──────────────┼──────────────┐
                      ▼              ▼              ▼
               ┌──────────┐   ┌──────────┐   ┌──────────┐
               │  Route   │   │   Call   │   │  Reserve │
               │          │   │          │   │ (E-Rezept│
               │          │   │          │   │  context)│
               └──────────┘   └──────────┘   └──────────┘
```

**Detailed Flow:**
```
Entry Point
    │
    ├──► [Home Tab] Tap "Apotheken"
    │
    ├──► [E-Rezept Flow] "Lokale Apotheke" selection
    │
    └──► [Search] "Apotheke in der Nähe"
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                        MAP VIEW                                  │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │                                                         │    │
      │  │                    🗺️ MAP                               │    │
      │  │                                                         │    │
      │  │            📍(You)                                      │    │
      │  │                     🏪        🏪                        │    │
      │  │                           🏪                            │    │
      │  │                                    🏪                   │    │
      │  │                                                         │    │
      │  │  [📍] Recenter   [🔍] Search area   [📋] List view    │    │
      │  │                                                         │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ [Filter: Jetzt geöffnet] [E-Rezept] [Notdienst] [+]   │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                    PHARMACY LIST / CARDS                         │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  Apotheken in der Nähe (12 gefunden)                           │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ dm Apotheke Mitte                              0.6 km   │    │
      │  │ ●  Geöffnet bis 20:00                                  │    │
      │  │                                                         │    │
      │  │ [E-Rezept ✓] [Impfungen] [Beratung]                   │    │
      │  │                                                         │    │
      │  │                              [Route] [Details]         │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ Stern Apotheke                                 1.2 km   │    │
      │  │ ○  Geschlossen · Öffnet 08:00                          │    │
      │  │                                                         │    │
      │  │ [E-Rezept ✓]                                           │    │
      │  │                                                         │    │
      │  │                              [Route] [Details]         │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ 🔴 NOTDIENST                                           │    │
      │  │ Adler Apotheke (Notdienst)                     3.4 km   │    │
      │  │ ●  24 Stunden geöffnet                                 │    │
      │  │                                                         │    │
      │  │ [E-Rezept ✓] [Notdienst]                               │    │
      │  │                                                         │    │
      │  │                              [Route] [Details]         │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  Powered by Google Maps                                         │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            │ (Tap pharmacy card or "Details")
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                    PHARMACY DETAILS                              │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  dm Apotheke Mitte                                              │
      │  ●  Geöffnet · Schließt um 20:00                               │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ 📍 Friedrichstraße 123                                  │    │
      │  │    10117 Berlin                                         │    │
      │  │                                                         │    │
      │  │    0.6 km · 8 Min zu Fuß                               │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  Öffnungszeiten                                                 │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ Mo-Fr    08:00 - 20:00                                  │    │
      │  │ Sa       10:00 - 18:00                                  │    │
      │  │ So       Geschlossen                                    │    │
      │  │                                                         │    │
      │  │ 📅 Feiertage: Geschlossen                              │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  Leistungen                                                     │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ ✓ E-Rezept Einlösung                                   │    │
      │  │ ✓ Impfungen (Grippe, COVID-19)                         │    │
      │  │ ✓ Blutdruckmessung                                     │    │
      │  │ ✓ Medikamentenberatung                                 │    │
      │  │ ✓ Kosmetikberatung                                     │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
      │  │   Route     │  │   Anrufen   │  │  Termin     │             │
      │  │   🗺️        │  │   📞        │  │  buchen     │             │
      │  └─────────────┘  └─────────────┘  └─────────────┘             │
      │                                                                  │
      │  ───────────────────────────────────────────────────────────    │
      │                                                                  │
      │  [E-Rezept hier einlösen] ◄── If coming from E-Rezept flow     │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ├──► [Route] → Opens Maps app with directions
            │
            ├──► [Anrufen] → Opens phone dialer
            │
            ├──► [Termin buchen] → Opens booking flow (if available)
            │
            └──► [E-Rezept einlösen] → Returns to E-Rezept reservation flow
```

**Emergency Pharmacy Flow:**
```
      ┌─────────────────────────────────────────────────────────────────┐
      │                    EMERGENCY PHARMACY                            │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  🔴 Notdienst-Apotheken                                        │
      │                                                                  │
      │  Heute Nacht (16.01. 20:00 - 17.01. 08:00)                     │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ Adler Apotheke                                 3.4 km   │    │
      │  │ ●  Notdienst bis 08:00                                 │    │
      │  │                                                         │    │
      │  │ ⚠️ Notdienstgebühr: 2,50 € zwischen 20:00-06:00       │    │
      │  │                                                         │    │
      │  │                              [Route] [Anrufen]         │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  Nächster Notdienst                                            │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ 17.01. 20:00 - 18.01. 08:00                            │    │
      │  │ Löwen Apotheke                                  2.1 km  │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ℹ️ Bei medizinischen Notfällen: 112                           │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
```

---

## 4. User Stories & Acceptance Criteria

### Epic: Pharmacy Discovery

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-001 | As a user, I want to see pharmacies near my current location so that I can find the closest options. | 1. Map loads with user's current location centered<br>2. GPS permission request with clear explanation<br>3. Pharmacy pins displayed within default radius (5km)<br>4. "Recenter" button to return to current location<br>5. Fallback to manual location entry if GPS denied |
| APOT-002 | As a user, I want to search for pharmacies in a specific area so that I can plan ahead for a different location. | 1. Search bar for address/city/postal code entry<br>2. Autocomplete suggestions as user types<br>3. Map recenters to searched location<br>4. Recent searches saved for quick access<br>5. "Aktuelle Position" button to return to GPS location |
| APOT-003 | As a user, I want to see pharmacies displayed on a map so that I can understand their locations visually. | 1. Map view with pharmacy pins<br>2. Pins show: Pharmacy icon, Open/Closed indicator<br>3. Tap pin shows preview card (name, distance, status)<br>4. Cluster pins when zoomed out<br>5. Map controls: Zoom, Pan, Recenter |
| APOT-004 | As a user, I want to switch between map and list view so that I can browse in my preferred format. | 1. Toggle button: Map / List views<br>2. List view shows pharmacy cards in distance order<br>3. View preference persists during session<br>4. List scrollable with pull-to-refresh<br>5. Both views show same filtered results |

### Epic: Filtering & Sorting

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-005 | As a user, I want to filter pharmacies by "open now" so that I don't go to a closed pharmacy. | 1. "Jetzt geöffnet" filter chip/toggle<br>2. When active, only shows currently open pharmacies<br>3. Closed pharmacies hidden or grayed out<br>4. Filter state clearly visible<br>5. Updates in real-time as hours pass |
| APOT-006 | As a user, I want to filter by e-prescription capability so that I find pharmacies that can process my digital prescription. | 1. "E-Rezept" filter chip<br>2. Shows only pharmacies with CardLink/e-prescription support<br>3. Badge on pharmacy cards: "E-Rezept ✓"<br>4. Tooltip explaining what this means<br>5. Most pharmacies should have this (>90%) |
| APOT-007 | As a user, I want to find emergency/night pharmacies so that I can get medication outside normal hours. | 1. "Notdienst" filter chip<br>2. Emergency pharmacies prominently marked (red badge)<br>3. Shows current and upcoming emergency duty pharmacies<br>4. Emergency fee warning displayed (2,50 € night surcharge)<br>5. Direct link to official Notdienst service |
| APOT-008 | As a user, I want to filter by specific services so that I find pharmacies offering what I need. | 1. "Mehr Filter" expands full filter list<br>2. Services: Impfungen, Blutdruckmessung, Beratung, Lieferservice<br>3. Multiple filters can be combined<br>4. Active filter count displayed<br>5. "Filter zurücksetzen" clears all |
| APOT-009 | As a user, I want to sort results by distance or relevance so that I see the most useful options first. | 1. Sort options: "Entfernung" (default), "Bewertung", "Relevanz"<br>2. Current sort displayed<br>3. Emergency pharmacies always prioritized if Notdienst filter active<br>4. Sort applied to both map and list views<br>5. Sort persists during session |

### Epic: Pharmacy Information

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-010 | As a user, I want to see pharmacy cards with key info so that I can quickly compare options. | 1. Card shows: Name, Distance, Open/Closed status<br>2. Current hours displayed (e.g., "Geöffnet bis 20:00")<br>3. Service badges (E-Rezept, Impfungen, etc.)<br>4. "Route" quick action button<br>5. "Details" to see full profile |
| APOT-011 | As a user, I want to see detailed pharmacy information so that I can make an informed choice. | 1. Full address with map preview<br>2. Distance and walking/driving time estimate<br>3. Complete opening hours for the week<br>4. Holiday hours noted<br>5. Phone number displayed |
| APOT-012 | As a user, I want to see all services offered by a pharmacy so that I know what's available. | 1. Services list with checkmarks (offered/not offered)<br>2. Common services: E-Rezept, Impfungen, Blutdruckmessung, Beratung<br>3. Special services highlighted (e.g., compounding pharmacy)<br>4. COVID testing if available<br>5. Consultation booking if offered |
| APOT-013 | As Helga (68), I want to see opening hours clearly so that I know when I can visit. | 1. Today's hours prominently displayed<br>2. Open/Closed status with next change time<br>3. Full week hours in expandable section<br>4. Font size 16pt+ for readability<br>5. Special hours (holidays) clearly marked |

### Epic: Actions & Navigation

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-014 | As a user, I want to get directions to a pharmacy so that I can navigate there easily. | 1. "Route" button opens native Maps app<br>2. Destination pre-filled with pharmacy address<br>3. Walking/Driving mode options<br>4. Works from map preview and detail screen<br>5. Fallback: Copy address if no maps app |
| APOT-015 | As a user, I want to call a pharmacy directly so that I can ask questions or check availability. | 1. "Anrufen" button initiates phone call<br>2. Phone number displayed (can be copied)<br>3. Confirmation before dialing<br>4. Works from detail screen<br>5. Track call button taps for analytics |
| APOT-016 | As a user, I want to book a consultation appointment at a pharmacy so that I can get personalized advice. | 1. "Termin buchen" button (if pharmacy offers appointments)<br>2. Shows available services for booking<br>3. Opens booking flow (integrated or partner link)<br>4. Not all pharmacies offer this (graceful absence)<br>5. Confirmation via app/email |
| APOT-017 | As a user coming from E-Rezept flow, I want to quickly reserve my prescription here so that I can complete my task. | 1. "E-Rezept hier einlösen" button shown when in E-Rezept context<br>2. Returns to E-Rezept flow with pharmacy pre-selected<br>3. Prescription details carried through<br>4. Seamless transition (no re-entry)<br>5. Confirmation flow continues in E-Rezept feature |

### Epic: Emergency Pharmacies

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-018 | As a user, I want to find emergency (Notdienst) pharmacies so that I can get medication at night or on holidays. | 1. "Notdienst" quick access from pharmacy home<br>2. Shows current emergency pharmacy on duty<br>3. Next emergency shift displayed<br>4. Emergency pharmacies marked with red badge<br>5. Link to official aponet.de Notdienst finder |
| APOT-019 | As a user, I want to know about emergency pharmacy fees so that I'm not surprised by extra costs. | 1. Fee notice displayed: "Notdienstgebühr: 2,50 €"<br>2. Fee times explained (typically 20:00-06:00)<br>3. Shown before user navigates to pharmacy<br>4. Separate from medication costs<br>5. Required by German law |
| APOT-020 | As a user, I want to see real emergency contact information so that I get appropriate help. | 1. Medical emergency notice: "Notruf: 112"<br>2. Poison control number if applicable<br>3. Clear distinction: Pharmacy emergency ≠ Medical emergency<br>4. Prominent placement for true emergencies<br>5. Not buried in UI |

### Epic: Accessibility & Edge Cases

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| APOT-021 | As Helga (68), I want the map to be easy to use so that I can find pharmacies without frustration. | 1. Large touch targets for pins and buttons<br>2. High contrast map style option<br>3. List view as alternative to map<br>4. Clear, large text for pharmacy names<br>5. Simple gestures (no complex interactions) |
| APOT-022 | As a user without GPS access, I want to manually enter my location so that I can still use the feature. | 1. Manual location entry always available<br>2. Clear prompt if GPS permission denied<br>3. Recent locations saved<br>4. Postal code search works<br>5. Feature fully functional without GPS |
| APOT-023 | As a user, I want offline access to recently viewed pharmacies so that I can reference them without internet. | 1. Last viewed pharmacy details cached<br>2. Favorited pharmacies available offline<br>3. Phone number accessible offline (for calling)<br>4. Map view requires internet (graceful degradation)<br>5. "Offline" indicator when disconnected |
| APOT-024 | As a user, I want to save favorite pharmacies so that I can quickly access my regular pharmacy. | 1. "Favorit" heart icon on pharmacy detail<br>2. Favorites section in pharmacy home<br>3. Favorites persist across sessions<br>4. Quick access from E-Rezept flow<br>5. Max 5 favorites (suggest removing oldest) |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Map loads in <2 seconds; pharmacy data in <1 second |
| Performance | Search results return in <1 second |
| Availability | 99.5% uptime for pharmacy search |
| Accessibility | WCAG 2.1 AA; screen reader compatible map |
| Localization | German (primary), English (launch) |
| Data Freshness | Opening hours updated daily; emergency data real-time |
| Location | GPS accuracy within 50 meters |

---

## 6. Out of Scope (V1)

- Pharmacy ratings and reviews (no reliable German data source)
- Real-time medication stock availability
- Pharmacy delivery booking through MedAlpha
- Prescription transfer between pharmacies
- Loyalty program integration with specific pharmacies
- Pharmacy comparison by price
- In-app pharmacy messaging/chat

---

## 7. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Google Maps SDK | Google | Available |
| Pharmacy Database | Partner/DAV | In progress |
| Notdienst API | aponet.de/ABDA | To be confirmed |
| Location Services | Platform | Available |
| E-Rezept Integration | MedAlpha | Required |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pharmacy discovery usage | >30% MAU | Users who use pharmacy search monthly |
| Route action rate | >50% | Users who tap "Route" after viewing pharmacy |
| E-Rezept → Local conversion | >40% | E-Rezept users who choose local pickup |
| Emergency pharmacy finds | Track | Users finding Notdienst pharmacies |
| Search to selection | <3 taps | Average taps from search to pharmacy detail |

---

## 9. Open Questions

1. What is the data source for pharmacy services (e-prescription, vaccinations)?
2. How do we access official Notdienst (emergency pharmacy) data?
3. Should we allow pharmacies to claim/update their profiles?
4. Is there demand for pharmacy ratings/reviews in Germany?
5. Should we show real-time stock availability (complex, requires pharmacy integration)?
6. How do we handle pharmacy chains vs. independent pharmacies?

---

## 10. References

- [Product Context](../z.product-context-personas/product-context.md)
- [Personas](../z.product-context-personas/personas-details.json)
- [E-Prescription Scope](./03-e-prescription-scope.md) - Integration point
- [aponet.de Notdienst](https://www.aponet.de/apotheke/notdienstsuche) - Emergency pharmacy reference

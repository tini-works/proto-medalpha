# Scope for Exploration: E-Prescription (E-Rezept)

**Feature ID:** MEDA-ERX
**Version:** 1.0
**Last Updated:** 2026-01-20
**Status:** Draft

---

## 1. Overview

### Main Job to Be Done (JTBD)

> **When I have an e-prescription, help me redeem it at an online pharmacy or find a local pharmacy, so I can get my medication with minimal effort and clear tracking of the process.**

### Purpose

Enable MedAlpha users to retrieve e-prescriptions via NFC (CardLink) or app-based methods, view prescription details, choose between online pharmacy delivery or local pickup, and track order fulfillment. The feature simplifies Germany's complex e-prescription system into a clear, step-by-step experience accessible to all ages.

### Strategic Context

- **Regulatory Tailwind:** E-prescription mandatory since Jan 2024; CardLink approved Mar 2024; gematik app has 27M potential users but only 2,000 have activated NFC PINs.
- **Competitive Gap:** gematik app is "far too many steps" — users give up; DocMorris closed ecosystem pushes their pharmacy; no white-label solution exists.
- **User Pain Points:** NFC+PIN confusion, lack of confirmation at each step, unclear what happened, delivery tracking poor.
- **Partners:** CardLink/gematik (NFC), Apo Group (online pharmacy), local pharmacy network.

---

## 2. Personas & Priority

| Persona | Priority | Key Need |
|---------|----------|----------|
| Helga (68) | Primary | Simple step-by-step; no NFC confusion; clear confirmations; delivery to home |
| Sarah (34) | Primary | Quick refills for children's recurring medications; efficient flow |
| Thomas (51) | Secondary | Transparent pricing; knows exactly what's covered vs. out-of-pocket |
| Elena (23) | Secondary | Discreet delivery for sensitive medications; modern UX |
| Marc (42) | Tertiary | Supplements and OTC via same flow; convenience |

---

## 3. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          E-PRESCRIPTION USER FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    Entry     │
                              │    Point     │
                              └──────────────┘
                                     │
                      ┌──────────────┼──────────────┐
                      ▼              ▼              ▼
               ┌──────────┐   ┌──────────┐   ┌──────────┐
               │   NFC    │   │   QR     │   │  From    │
               │   Scan   │   │   Code   │   │  Tele-   │
               │          │   │          │   │  medizin │
               └──────────┘   └──────────┘   └──────────┘
                      │              │              │
                      └──────────────┼──────────────┘
                                     ▼
                              ┌──────────────┐
                              │ Prescription │
                              │   Details    │
                              └──────────────┘
                                     │
                      ┌──────────────┴──────────────┐
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │    ONLINE    │              │    LOCAL     │
               │   APOTHEKE   │              │   APOTHEKE   │
               │   (Delivery) │              │   (Pickup)   │
               └──────────────┘              └──────────────┘
                      │                              │
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │   Checkout   │              │   Pharmacy   │
               │   (Address,  │              │   Search &   │
               │    Payment)  │              │   Reserve    │
               └──────────────┘              └──────────────┘
                      │                              │
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │   Order      │              │   Reserved   │
               │   Confirm    │              │   Confirm    │
               └──────────────┘              └──────────────┘
                      │                              │
                      ▼                              │
               ┌──────────────┐                      │
               │   Delivery   │                      │
               │   Tracking   │                      │
               └──────────────┘                      │
                      │                              │
                      └──────────────┬──────────────┘
                                     ▼
                              ┌──────────────┐
                              │   Complete   │
                              │   (History)  │
                              └──────────────┘
```

**Detailed Flow:**
```
Entry Point
    │
    ├──► [Home Tab] Tap "E-Rezept"
    │
    ├──► [Telemedicine] "E-Rezept öffnen" from summary
    │
    └──► [Push Notification] "Neues E-Rezept verfügbar"
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                    RETRIEVAL METHOD                              │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  ┌───────────────────┐  ┌───────────────────┐                   │
      │  │    NFC SCAN       │  │    BEREITS IM     │                   │
      │  │─────────────────  │  │    APP            │                   │
      │  │ Gesundheitskarte  │  │─────────────────  │                   │
      │  │ ans Smartphone    │  │ Rezepte aus       │                   │
      │  │ halten            │  │ Telemedizin       │                   │
      │  │                   │  │                   │                   │
      │  │ [Scan starten]    │  │ [Rezepte zeigen]  │                   │
      │  └───────────────────┘  └───────────────────┘                   │
      │                                                                  │
      │  Alternative: QR-Code scannen (vom Papierausdruck)              │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                       NFC SCAN FLOW                              │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  Schritt 1 von 3                                                │
      │  ━━━━━━━━━━░░░░░░░░░░░░░░░░░                                    │
      │                                                                  │
      │  ┌─────────────────────────────────────────┐                    │
      │  │                                         │                    │
      │  │     📱 ← 💳                             │                    │
      │  │                                         │                    │
      │  │  Halten Sie Ihre Gesundheitskarte      │                    │
      │  │  an die Rückseite Ihres Smartphones    │                    │
      │  │                                         │                    │
      │  │  ┌─────────────────────────────────┐   │                    │
      │  │  │ Karte erkannt ✓                 │   │◄── Success state   │
      │  │  └─────────────────────────────────┘   │                    │
      │  │                                         │                    │
      │  └─────────────────────────────────────────┘                    │
      │                                                                  │
      │  Schritt 2 von 3: PIN eingeben                                  │
      │  ┌─────┬─────┬─────┬─────┬─────┬─────┐                         │
      │  │  •  │  •  │  •  │  •  │  _  │  _  │  ◄── 6-digit PIN       │
      │  └─────┴─────┴─────┴─────┴─────┴─────┘                         │
      │                                                                  │
      │  "PIN nicht erhalten? [So erhalten Sie Ihren PIN]"             │
      │                                                                  │
      │  Schritt 3 von 3: Rezepte werden abgerufen...                  │
      │  ┌─────────────────────────────────────────┐                    │
      │  │ ████████████████░░░░░░░░░░ 60%         │                    │
      │  └─────────────────────────────────────────┘                    │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                    PRESCRIPTION DETAILS                          │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  2 Medikamente erkannt                                          │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ ☑ Cetirizin 10mg                                        │    │
      │  │   20 Tabletten · PZN 12345678                           │    │
      │  │   ┌──────────────────┐                                  │    │
      │  │   │ Zuzahlung 5,00 € │ ◄── Cost tag                     │    │
      │  │   └──────────────────┘                                  │    │
      │  │   Verordnet: Dr. Wagner · 16.01.2026                    │    │
      │  │   Gültig bis: 15.04.2026                                │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  ┌─────────────────────────────────────────────────────────┐    │
      │  │ ☑ Hydrocortison Creme 0,5%                              │    │
      │  │   30g Tube · PZN 87654321                               │    │
      │  │   ┌──────────────────┐                                  │    │
      │  │   │ Privatrezept     │ ◄── Different tag                │    │
      │  │   └──────────────────┘                                  │    │
      │  │   Geschätzter Preis: 12,50 €                            │    │
      │  └─────────────────────────────────────────────────────────┘    │
      │                                                                  │
      │  Gesamtkosten: 17,50 € (Zuzahlung + Privat)                    │
      │                                                                  │
      │  [Weiter zur Einlösung]                                         │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ▼
      ┌─────────────────────────────────────────────────────────────────┐
      │                    REDEMPTION CHOICE                             │
      │─────────────────────────────────────────────────────────────────│
      │                                                                  │
      │  Wo möchten Sie Ihr Rezept einlösen?                           │
      │                                                                  │
      │  ┌─────────────────────────┐  ┌─────────────────────────┐      │
      │  │    ONLINE APOTHEKE     │  │    LOKALE APOTHEKE      │      │
      │  │─────────────────────── │  │─────────────────────────│      │
      │  │                        │  │                         │      │
      │  │ 📦 Lieferung nach     │  │ 🏪 Reservieren &        │      │
      │  │    Hause              │  │    vor Ort abholen      │      │
      │  │                        │  │                         │      │
      │  │ • Lieferung morgen    │  │ • Sofort verfügbar      │      │
      │  │ • Tracking inklusive  │  │ • Persönliche Beratung  │      │
      │  │ • Kostenlose Lieferung│  │ • Apotheken in der Nähe │      │
      │  │   ab 29€              │  │                         │      │
      │  │                        │  │                         │      │
      │  │ [Online einlösen]     │  │ [Apotheke wählen]       │      │
      │  └─────────────────────────┘  └─────────────────────────┘      │
      │                                                                  │
      │  Powered by Apo Group                                           │
      │                                                                  │
      └─────────────────────────────────────────────────────────────────┘
            │
            ├──► [Online Path]
            │         │
            │         ▼
            │   ┌─────────────────────────────────────────────────────┐
            │   │                    CHECKOUT                          │
            │   │─────────────────────────────────────────────────────│
            │   │                                                      │
            │   │  Lieferadresse                                       │
            │   │  ┌───────────────────────────────────────────┐      │
            │   │  │ Max Mustermann                            │      │
            │   │  │ Musterstraße 123                          │      │
            │   │  │ 10115 Berlin                              │      │
            │   │  │                          [Ändern]         │      │
            │   │  └───────────────────────────────────────────┘      │
            │   │                                                      │
            │   │  Zusammenfassung                                     │
            │   │  ┌───────────────────────────────────────────┐      │
            │   │  │ Cetirizin 10mg           Zuzahlung 5,00 € │      │
            │   │  │ Hydrocortison Creme      Privat   12,50 € │      │
            │   │  │ ─────────────────────────────────────────  │      │
            │   │  │ Versand                         0,00 € │      │
            │   │  │ ─────────────────────────────────────────  │      │
            │   │  │ Gesamt                         17,50 € │      │
            │   │  └───────────────────────────────────────────┘      │
            │   │                                                      │
            │   │  Zahlungsart                                         │
            │   │  ○ Rechnung (nach Erhalt)                           │
            │   │  ○ PayPal                                           │
            │   │  ○ Kreditkarte                                      │
            │   │                                                      │
            │   │  [Kostenpflichtig bestellen]                        │
            │   │                                                      │
            │   └─────────────────────────────────────────────────────┘
            │         │
            │         ▼
            │   ┌─────────────────────────────────────────────────────┐
            │   │                  ORDER CONFIRMATION                  │
            │   │─────────────────────────────────────────────────────│
            │   │                                                      │
            │   │                    ✓                                 │
            │   │            Bestellung aufgegeben                     │
            │   │                                                      │
            │   │  Bestellnummer: APO-2026-0116-1234                  │
            │   │  Voraussichtliche Lieferung: 17.01.2026             │
            │   │                                                      │
            │   │  [Sendung verfolgen]                                │
            │   │  [Zurück zur Startseite]                            │
            │   │                                                      │
            │   └─────────────────────────────────────────────────────┘
            │         │
            │         ▼
            │   ┌─────────────────────────────────────────────────────┐
            │   │                  DELIVERY TRACKING                   │
            │   │─────────────────────────────────────────────────────│
            │   │                                                      │
            │   │  Sendungsstatus                                      │
            │   │                                                      │
            │   │  ● Bestellung eingegangen        16.01. 14:30       │
            │   │  │                                                   │
            │   │  ● Rezept verifiziert            16.01. 14:35       │
            │   │  │                                                   │
            │   │  ● Versandbereit                 16.01. 16:00       │
            │   │  │                                                   │
            │   │  ◐ In Zustellung (DPD)          17.01. 08:15       │
            │   │  │   Voraussichtlich heute 14-18 Uhr                │
            │   │  │                                                   │
            │   │  ○ Zugestellt                    --                  │
            │   │                                                      │
            │   │  [DPD Tracking öffnen]                              │
            │   │                                                      │
            │   └─────────────────────────────────────────────────────┘
            │
            │
            └──► [Local Pharmacy Path]
                      │
                      ▼
                ┌─────────────────────────────────────────────────────┐
                │                  PHARMACY SEARCH                     │
                │─────────────────────────────────────────────────────│
                │                                                      │
                │  Apotheken in der Nähe                               │
                │                                                      │
                │  ┌───────────────────────────────────────────┐      │
                │  │ 📍 MAP VIEW                               │      │
                │  │    [Your location marked]                 │      │
                │  │    [Pharmacy pins]                        │      │
                │  └───────────────────────────────────────────┘      │
                │                                                      │
                │  ┌───────────────────────────────────────────┐      │
                │  │ dm Apotheke Mitte                 0.6 km  │      │
                │  │ Geöffnet bis 20:00                        │      │
                │  │ [E-Rezept ✓] [Reservierung ✓]            │      │
                │  │                              [Auswählen] │      │
                │  └───────────────────────────────────────────┘      │
                │                                                      │
                │  ┌───────────────────────────────────────────┐      │
                │  │ Stern Apotheke                   1.2 km  │      │
                │  │ Geöffnet bis 18:30                        │      │
                │  │ [E-Rezept ✓]                             │      │
                │  │                              [Auswählen] │      │
                │  └───────────────────────────────────────────┘      │
                │                                                      │
                └─────────────────────────────────────────────────────┘
                      │
                      ▼
                ┌─────────────────────────────────────────────────────┐
                │                RESERVATION CONFIRM                   │
                │─────────────────────────────────────────────────────│
                │                                                      │
                │  dm Apotheke Mitte                                   │
                │  Friedrichstraße 123, 10117 Berlin                  │
                │                                                      │
                │  Reservierte Medikamente:                            │
                │  • Cetirizin 10mg (Zuzahlung 5,00 €)                │
                │  • Hydrocortison Creme (12,50 €)                    │
                │                                                      │
                │  Abholbereit: Heute ab 15:30                        │
                │  Reservierung gültig bis: 17.01.2026                │
                │                                                      │
                │  [Reservierung bestätigen]                          │
                │                                                      │
                └─────────────────────────────────────────────────────┘
                      │
                      ▼
                ┌─────────────────────────────────────────────────────┐
                │                RESERVATION SUCCESS                   │
                │─────────────────────────────────────────────────────│
                │                                                      │
                │                    ✓                                 │
                │            Reservierung bestätigt                    │
                │                                                      │
                │  Bitte holen Sie Ihre Medikamente ab bei:           │
                │                                                      │
                │  dm Apotheke Mitte                                   │
                │  Friedrichstraße 123                                 │
                │  10117 Berlin                                        │
                │                                                      │
                │  Abholbereit ab: Heute 15:30                        │
                │  Reservierungsnummer: RES-4567                      │
                │                                                      │
                │  [Route zur Apotheke]                               │
                │  [Zur Startseite]                                   │
                │                                                      │
                └─────────────────────────────────────────────────────┘
```

---

## 4. User Stories & Acceptance Criteria

### Epic: Prescription Retrieval

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-001 | As a user, I want to retrieve my e-prescription using my health insurance card (NFC) so that I can access my medication digitally. | 1. Clear visual instruction showing card placement<br>2. Phone vibrates/sounds when card detected<br>3. "Karte erkannt ✓" confirmation shown<br>4. Works with NFC-enabled eGK cards<br>5. Error handling for non-NFC cards with clear guidance |
| ERX-002 | As a user, I want to enter my PIN to authenticate so that my prescriptions are securely accessed. | 1. 6-digit PIN input field with masked display<br>2. Number pad for easy entry<br>3. "PIN vergessen?" link to insurance provider help<br>4. Max 3 attempts before lockout warning<br>5. Success confirmation before proceeding |
| ERX-003 | As a user, I want the app to handle PIN/NFC issues gracefully so that I don't get stuck. | 1. "Kein NFC?" alternative: Link to request prescriptions via insurance app<br>2. "PIN nicht erhalten?" guide to request from insurance<br>3. "Karte nicht erkannt" troubleshooting tips<br>4. Option to try again or get help<br>5. Support contact clearly displayed |
| ERX-004 | As a user, I want to access prescriptions issued via telemedicine without NFC so that the process is seamless. | 1. "Bereits im App" section shows telemedicine prescriptions<br>2. No NFC scan required for in-app prescriptions<br>3. Direct link from telemedicine summary<br>4. Push notification when prescription is ready<br>5. Prescriptions appear within 5 minutes of issuance |
| ERX-005 | As a user, I want to scan a QR code from a paper printout so that I can redeem prescriptions issued outside the app. | 1. "QR-Code scannen" option available<br>2. Camera viewfinder with alignment guide<br>3. Auto-detect and process QR code<br>4. Handles gematik e-prescription QR format<br>5. Error if QR code invalid or expired |

### Epic: Prescription Details

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-006 | As a user, I want to see all my retrieved prescriptions so that I know what medications are available. | 1. List shows all prescriptions from scan<br>2. Each item: Name, Dosage, Quantity, PZN<br>3. Prescribing doctor and date shown<br>4. Validity/expiration date displayed<br>5. Multiple prescriptions supported |
| ERX-007 | As a user, I want to see cost information for each medication so that I know what I'll pay. | 1. "Zuzahlung X €" tag for GKV copays<br>2. "Kassenleistung" tag if fully covered<br>3. "Privatrezept X €" for private prescriptions<br>4. Estimated price for uncovered items<br>5. Total cost summary at bottom |
| ERX-008 | As a user, I want to select which prescriptions to redeem so that I can split orders if needed. | 1. Checkbox for each prescription item<br>2. All selected by default<br>3. "Alle auswählen" / "Keine auswählen" toggles<br>4. Total updates based on selection<br>5. Unselected items remain for future redemption |
| ERX-009 | As Helga (68), I want to understand what each medication is for so that I feel confident about my order. | 1. "Was ist das?" expandable info per medication<br>2. Simple language description (not medical jargon)<br>3. Usage instructions if available<br>4. Link to package insert (Beipackzettel)<br>5. Font size 16pt+ for readability |

### Epic: Online Pharmacy (Delivery)

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-010 | As a user, I want to choose online delivery so that my medication comes to my home. | 1. "Online Apotheke" option clearly presented<br>2. Delivery estimate shown (e.g., "Lieferung morgen")<br>3. Free shipping threshold displayed<br>4. Partner pharmacy info (Apo Group)<br>5. Comparison to DocMorris where relevant |
| ERX-011 | As a user, I want to enter or confirm my delivery address so that my medication arrives at the right place. | 1. Saved addresses from profile pre-filled<br>2. "Ändern" to edit or add new address<br>3. Address validation before submission<br>4. Option to add delivery instructions<br>5. Multiple addresses supported |
| ERX-012 | As a user, I want to see a clear order summary before confirming so that I know exactly what I'm paying. | 1. Line items: Medication name, copay/price<br>2. Shipping cost (or "Kostenlos ab X €")<br>3. Total prominently displayed<br>4. Payment method selection<br>5. "Kostenpflichtig bestellen" CTA (legal requirement) |
| ERX-013 | As a user, I want to choose my payment method so that I can pay conveniently. | 1. Options: Rechnung (invoice), PayPal, Credit Card<br>2. Saved payment methods from profile<br>3. Secure payment processing (PCI compliant)<br>4. Payment confirmation before order submission<br>5. "Auf Rechnung" as default for prescription orders |
| ERX-014 | As a user, I want confirmation of my order so that I know it was successful. | 1. Success screen with checkmark animation<br>2. Order number displayed prominently<br>3. Estimated delivery date<br>4. "Sendung verfolgen" button<br>5. Confirmation email sent |

### Epic: Delivery Tracking

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-015 | As a user, I want to track my medication delivery so that I know when it will arrive. | 1. Timeline view with status steps<br>2. Statuses: Bestellt → Verifiziert → Versandbereit → In Zustellung → Zugestellt<br>3. Timestamp for each completed step<br>4. Carrier info and tracking number<br>5. Deep link to carrier tracking |
| ERX-016 | As a user, I want to receive delivery updates via push notification so that I stay informed. | 1. Push notification when order ships<br>2. Push notification with delivery window (e.g., "Heute 14-18 Uhr")<br>3. Push notification when delivered<br>4. Notification preferences configurable<br>5. Email notifications as backup |
| ERX-017 | As a user, I want to see my order history so that I can reference past orders. | 1. "Bestellungen" section in profile<br>2. List shows: Date, Items, Status, Total<br>3. Tap for full order details<br>4. "Erneut bestellen" for refills<br>5. History retained for 24 months |

### Epic: Local Pharmacy (Pickup)

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-018 | As a user, I want to find local pharmacies near me so that I can pick up my medication in person. | 1. Map view with pharmacy pins<br>2. List view with distance and hours<br>3. GPS location or manual search<br>4. Filter: Open now, E-Rezept capable<br>5. "E-Rezept" badge for compatible pharmacies |
| ERX-019 | As a user, I want to reserve my medication at a local pharmacy so that it's ready when I arrive. | 1. "Reservieren" button for selected pharmacy<br>2. Shows availability (in stock or ETA)<br>3. Reservation confirmation with number<br>4. "Abholbereit ab" time estimate<br>5. Reservation valid for 48-72 hours |
| ERX-020 | As a user, I want directions to the pharmacy so that I can find it easily. | 1. "Route" button opens Maps<br>2. Address displayed for manual navigation<br>3. "Anrufen" button for phone contact<br>4. Opening hours prominently shown<br>5. Parking info if available |
| ERX-021 | As a user, I want to know when my reservation is ready so that I don't go too early. | 1. Push notification when ready for pickup<br>2. In-app status update<br>3. Estimated ready time shown at reservation<br>4. Contact pharmacy option if delayed<br>5. Reminder if approaching expiration |

### Epic: Prescription Management

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-022 | As a user, I want to see all my active and past prescriptions so that I can manage my medications. | 1. "Meine Rezepte" section accessible<br>2. Active prescriptions with "Einlösen" option<br>3. Redeemed prescriptions in history<br>4. Expiration dates clearly shown<br>5. Prescription source indicated (Doctor, Telemedicine) |
| ERX-023 | As a user, I want to be reminded before a prescription expires so that I don't lose it. | 1. Push notification 7 days before expiration<br>2. Push notification 1 day before expiration<br>3. Expiring prescriptions highlighted in list<br>4. "Jetzt einlösen" CTA in notification<br>5. Expiration date: 3 months from issuance (standard) |
| ERX-024 | As Sarah (34), I want to manage prescriptions for my children so that I can handle family health in one place. | 1. "Für wen?" selector in prescription flow<br>2. Child profiles from family account<br>3. Child's insurance info used<br>4. Prescriptions tagged with patient name<br>5. Separate history per family member |

### Epic: Accessibility & Edge Cases

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| ERX-025 | As Helga (68), I want step-by-step guidance through the NFC process so that I don't get confused. | 1. Numbered steps: "Schritt 1 von 3"<br>2. Large visuals showing card placement<br>3. Audio feedback on success/failure (optional)<br>4. No time pressure on any step<br>5. "Hilfe" button on every screen |
| ERX-026 | As a user without an NFC-capable card, I want alternative options so that I can still use the service. | 1. Clear message if NFC card not detected<br>2. Guide to request NFC card from insurance<br>3. Alternative: Use insurance provider's app to forward<br>4. QR code scanning as fallback<br>5. Support contact for assistance |
| ERX-027 | As a user, I want clear confirmation at every step so that I know what happened. | 1. Visual confirmation for: Card scanned, PIN accepted, Prescriptions loaded, Order placed<br>2. No silent failures (always show result)<br>3. Error messages with actionable next steps<br>4. Success messages with clear next action<br>5. Email/push confirmation for key actions |
| ERX-028 | As Thomas (51), I want transparent pricing with no surprises so that I trust the service. | 1. All costs shown before "Bestellen" button<br>2. Copay vs. full price clearly distinguished<br>3. Shipping costs included in total<br>4. No hidden fees<br>5. Receipt available after purchase |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | NFC scan completes in <3 seconds |
| Performance | Prescription retrieval <5 seconds after PIN |
| Availability | 99.5% uptime for prescription retrieval |
| Accessibility | WCAG 2.1 AA; extra-large text option |
| Security | End-to-end encryption; GDPR/DSGVO compliant |
| Compliance | CardLink certified; gematik approved |
| Localization | German (primary), English (launch) |

---

## 6. Out of Scope (V1)

- Automatic prescription refills (recurring orders)
- Insurance integration for direct billing (Direktabrechnung)
- Controlled substance prescriptions (BtM-Rezepte)
- Prescription price comparison across pharmacies
- Prescription sharing with family members
- Integration with medication reminder apps
- Paper prescription photo upload (non-QR)

---

## 7. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| CardLink NFC SDK | gematik/Cardlink | Required |
| Apo Group Order API | Partner | In progress |
| Pharmacy Network Data | Partner | In progress |
| Push Notification Service | MedAlpha | Required |
| User Profile (address, payment) | MedAlpha | Required |
| Telemedicine Integration | MedAlpha | Required |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| NFC scan success rate | >85% | (Successful scans / Attempts) |
| Prescription redemption rate | >70% | (Redeemed / Retrieved) |
| Online vs. Local split | 60/40 | Distribution of redemption choice |
| Order completion rate | >80% | (Completed orders / Started checkouts) |
| Delivery satisfaction | >4.2/5 | Post-delivery survey |
| Repeat redemption | >50% | Users who redeem again within 90 days |

---

## 9. Open Questions

1. What is Apo Group's competitive pricing vs. DocMorris (€10/prescription incentive)?
2. How do we handle controlled substances (BtM) in future versions?
3. Should we show generic alternatives to save users money?
4. How do we handle partial pharmacy stock (some items available, some not)?
5. What is the pharmacy reservation SLA (how long until ready)?
6. Should we integrate with insurance apps for card-less retrieval?

---

## 10. References

- [Product Context](../product-context-G.md)
- [Personas](../personas-details-G.json)
- [Social Listening Synthesis](./z.research/social-listening-synthesis.md) - gematik app pain points
- [Competitive Landscape](./z.research/competitive-landscape-research.md)
- [CardLink Documentation](https://www.gematik.de/anwendungen/e-rezept)

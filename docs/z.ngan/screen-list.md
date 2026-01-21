# Screen List — User-Friendly Names
Date: January 20, 2026  
Source: `scope-for-exploration.md`

## Screen IDs & Names
- **S1** Sign Up / Sign In (email/phone/SSO)
- **S2** Verify Code
- **S3** Complete Profile (Insurance, Address, Consent)
- **S4** Family Manager (Add/Switch)
- **S5** Home (Personalized Feed + Quick Actions)
- **S6** Search & Filters (Doctors / In-Store Services)
- **S7** Slot Details & Confirmation
- **S8** Telemedicine Setup (Symptom, Device Check)
- **S9** Live Video Visit
- **S10** Prescription Scan (eGK NFC / Code)
- **S11** Delivery vs Click & Collect Choice
- **S12** Order / Redemption Confirmation & Tracking
- **S13** Store & Pharmacy Finder (Map/List)
- **S14** History & Filters
- **S15** History Detail (Visit/Order/Pickup)
- **S16** Reminders & Notifications Settings
- **S17** Feedback & Follow-Up
- **S18** CMS Content Editor (Partner Admin - future-ready)

## Screen Flow Diagram
```mermaid
flowchart LR
  S1["S1 Sign Up/In"] --> S2["S2 Verify"]
  S2 --> S3["S3 Complete Profile"]
  S3 --> S4["S4 Family Manager"]
  S4 --> S5["S5 Home"]

  subgraph Booking
    S5 --> S6["S6 Search & Filters"]
    S6 --> S7["S7 Slot Confirm"]
  end

  subgraph Telemed
    S5 --> S8["S8 Telemed Setup"]
    S8 --> S9["S9 Live Video"]
    S9 --> S17["S17 Feedback"]
  end

  subgraph Redemption
    S5 --> S10["S10 Prescription Scan"]
    S10 --> S11["S11 Delivery vs C&C"]
    S11 --> S12["S12 Confirmation & Tracking"]
    S5 --> S13["S13 Store/Pharmacy Finder"]
    S13 --> S12
  end

  S5 --> S14["S14 History"]
  S14 --> S15["S15 History Detail"]
  S15 --> S17
  S5 --> S16["S16 Reminders & Notifications"]

  S5 --> S18["S18 CMS Editor (Admin)"]
  S17 --> S14
```

## Notes
- Home (S5) is the main hub with quick actions into Booking, Telemed, and Redemption.
- Family picker surfaces at S6/S7/S10 to keep flows family-aware.
- Notifications deep-link into S7, S9, S12, or S15 depending on trigger.

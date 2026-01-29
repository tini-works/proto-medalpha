# User Flows

**Generated From:** SCOPE-FOR-EXPLORATION.md
**Date:** 2026-01-20
**Focus:** dm-drogerie markt retail partner integration (healthcare + shopping + loyalty)

---

Notes: This document is derived from SCOPE-FOR-EXPLORATION.md. Items listed under Assumptions are inferred and not explicitly stated in the source.


## Jobs-to-be-Done Summary

| Job ID | Feature | Job Statement | Primary Personas |
|--------|---------|---------------|------------------|
| J1 | Registration | When I download the app, I want to register quickly so that I can access healthcare + shopping features | Elena, All |
| J2 | Profile | When I need to use core features, I want to complete my profile so that insurance/family are set up | Helga, Sarah |
| J3 | Booking | When I need care, I want to book doctor/in-store appointments so that I get confirmed slots | Sarah, Marc, Elena |
| J4 | Telemedicine | When I have a health concern, I want video consultation so that I avoid travel | Marc, Sarah, Helga |
| J5 | Online Rx | When I have a prescription, I want to redeem online so that meds come to me | Helga, Sarah, Elena |
| J6 | Offline Rx | When I prefer pickup, I want to find dm/pharmacies so that I get meds locally | Thomas, Sarah |
| J7 | History | When I need records, I want to view history so that I track everything | Sarah, Helga |
| J8 | Home | When I open the app, I want personalized content so that I see relevant actions/deals | Elena, All |
| J9 | Notifications | When something needs attention, I want alerts so that I don't miss important actions | All |

## Flow: User Registration (J1)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open app (first time) | Show registration prompt | - | Prompt displays |
| 2 | Enter name, email/phone, password | Validate inputs | - | No errors |
| 3 | Tap "Registrieren" | Send verification code | User: created (pending) | Code sent |
| 4 | Enter verification code | Verify code | User: verified | Code accepted |
| 5 | (Optional) Link dm account via SSO | Connect dm login | User: dmAccountLinked | SSO success |
| 6 | Navigate to profile completion | Show profile form | - | Form displays |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Verification method | Email or Phone? | Email verification | SMS verification |
| dm account | Has dm account? | SSO handoff | Skip to profile |

### Flow Diagram

```mermaid
flowchart TD
    START([App Download]) --> OPEN[Open App First Time]
    OPEN --> REG_PROMPT[Registration Prompt]

    subgraph REGISTRATION["Registration Flow"]
        REG_PROMPT --> INPUT[Enter Name, Email/Phone, Password]
        INPUT --> VALIDATE{Valid?}
        VALIDATE -->|No| ERROR[Show Errors]
        ERROR --> INPUT
        VALIDATE -->|Yes| SUBMIT[Tap 'Registrieren']
        SUBMIT --> VERIFY_SEND[Send Verification Code]
    end

    subgraph VERIFICATION["Verification"]
        VERIFY_SEND --> VERIFY_INPUT[Enter Code]
        VERIFY_INPUT --> VERIFY_CHECK{Code Valid?}
        VERIFY_CHECK -->|No| RETRY[Retry / Resend]
        RETRY --> VERIFY_INPUT
        VERIFY_CHECK -->|Yes| VERIFIED[Account Verified]
    end

    VERIFIED --> DM_CHECK{Has dm Account?}
    DM_CHECK -->|Yes| SSO[Link via SSO]
    DM_CHECK -->|No| PROFILE
    SSO --> PROFILE[Profile Completion]

    PROFILE --> DONE([Registration Complete])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
    style ERROR fill:#ffebee,stroke:#c62828,color:#b71c1c
```

## Flow: Profile Completion (J2)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | View profile form | Show fields (insurance, address, family) | - | Form loads |
| 2 | Enter insurance details (GKV/PKV, eGK) | Validate insurance | Insurance: created | Insurance saved |
| 3 | Enter address | Save address | Address: created | Address saved |
| 4 | (Optional) Add family members | Show family form | - | Form displays |
| 5 | Enter family member details | Validate, request consent | FamilyMember: created | Member added |
| 6 | Tap "Speichern" | Show success, unlock features | User: profileComplete | Success message |

### Flow Diagram

```mermaid
flowchart TD
    START([Profile Incomplete]) --> FORM[Profile Form]

    subgraph PROFILE_FORM["Profile Completion"]
        FORM --> INS[Enter Insurance Details]
        INS --> INS_TYPE{GKV or PKV?}
        INS_TYPE -->|GKV| GKV_FIELDS[eGK Number, Provider]
        INS_TYPE -->|PKV| PKV_FIELDS[Provider, Policy Number]
        GKV_FIELDS --> ADDR
        PKV_FIELDS --> ADDR

        ADDR[Enter Address]
        ADDR --> FAMILY_Q{Add Family Members?}
        FAMILY_Q -->|Yes| FAMILY_ADD
        FAMILY_Q -->|No| SAVE
    end

    subgraph FAMILY_FLOW["Family Management"]
        FAMILY_ADD[Add Family Member]
        FAMILY_ADD --> FAM_DETAILS[Enter Name, DOB, Relationship]
        FAM_DETAILS --> FAM_INS[Link Insurance]
        FAM_INS --> CONSENT[Request Consent]
        CONSENT --> MORE_FAM{Add Another?}
        MORE_FAM -->|Yes| FAMILY_ADD
        MORE_FAM -->|No| SAVE
    end

    SAVE[Tap 'Speichern'] --> SUCCESS[Success - Features Unlocked]
    SUCCESS --> HOME([Home Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style HOME fill:#000000,stroke:#000000,color:#ffffff
```

## Flow: Appointment Booking (J3)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Termin buchen" | Show search screen | - | Screen loads |
| 2 | Select type (Doctor/Health Check/Beauty) | Filter by type | - | Type selected |
| 3 | Enter specialty/service + location | Search Curaay + dm API | - | Results load |
| 4 | Browse results | Show cards with slots | - | Cards display |
| 5 | Select provider/service + time slot | Show confirmation | - | Details shown |
| 6 | Select patient (self or family) | Update patient field | - | Patient selected |
| 7 | Confirm booking | Process via Curaay/dm | Appointment: created | Confirmation shown |
| 8 | Add to calendar | Create calendar event | Appointment: calendarSynced | Event added |
| 9 | Set reminder | Schedule push | Notification: scheduled | Reminder set |
| 10 | (Optional) View in "Meine Termine" | Show appointment details | - | Details shown |

### Decision Points

| Branch Point | Condition | Path A | Path B | Path C |
|--------------|-----------|--------|--------|--------|
| Booking type | What type? | Doctor (Curaay) | Health Check (dm) | Beauty (dm) |
| Patient | Who is this for? | Self | Family member | - |
| Payment | Beauty service? | Show payment | Skip payment | - |

### Flow Diagram

```mermaid
flowchart TD
    START([Need Appointment]) --> ENTRY[Tap 'Termin buchen']

    subgraph SEARCH["Search & Filter"]
        ENTRY --> TYPE{Select Type}
        TYPE -->|Doctor| DOC_SEARCH[Search Doctors]
        TYPE -->|Health Check| HC_SEARCH[Search dm Health Checks]
        TYPE -->|Beauty| BEAUTY_SEARCH[Search dm Beauty Services]

        DOC_SEARCH --> SPECIALTY[Select Specialty]
        HC_SEARCH --> HC_TYPE[Select Check Type]
        BEAUTY_SEARCH --> BEAUTY_TYPE[Select Service]

        SPECIALTY --> LOCATION[Enter Location]
        HC_TYPE --> LOCATION
        BEAUTY_TYPE --> LOCATION

        LOCATION --> SEARCH_BTN[Search]
    end

    SEARCH_BTN --> RESULTS{Results Found?}
    RESULTS -->|No| NO_RESULTS[Adjust Filters]
    NO_RESULTS --> SEARCH
    RESULTS -->|Yes| LIST[View Results List]

    subgraph SELECTION["Selection"]
        LIST --> SELECT[Select Provider + Slot]
        SELECT --> PATIENT{Who is Patient?}
        PATIENT -->|Self| SELF[Select Self]
        PATIENT -->|Family| FAM_SELECT[Select Family Member]
        SELF --> CONFIRM_DETAILS
        FAM_SELECT --> CONFIRM_DETAILS[Review Details]
    end

    subgraph BOOKING["Booking"]
        CONFIRM_DETAILS --> PAY_CHECK{Requires Payment?}
        PAY_CHECK -->|Yes| PAYMENT[Enter Payment]
        PAY_CHECK -->|No| BOOK
        PAYMENT --> BOOK[Tap 'Buchen']
        BOOK --> PROCESSING[Processing...]
        PROCESSING --> SUCCESS[Booking Confirmed]
    end

    subgraph POST_BOOK["Post-Booking"]
        SUCCESS --> CAL{Add to Calendar?}
        CAL -->|Yes| ADD_CAL[Add Event]
        CAL -->|No| REMINDER
        ADD_CAL --> REMINDER{Set Reminder?}
        REMINDER -->|Yes| SET_REM[Schedule Push]
        REMINDER -->|No| DONE
        SET_REM --> DONE
    end

    DONE([Appointment Booked])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
    style NO_RESULTS fill:#ffebee,stroke:#c62828,color:#b71c1c
```

## Flow: My Appointments (J3a)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open "Termine" tab | Show Termine entry point | - | Screen loads |
| 2 | Open "Meine Termine" | Show appointments list | - | List displays |
| 3 | Select an appointment | Show appointment details | - | Details shown |
| 4 | (Optional) Cancel appointment | Cancel booking via provider/dm | Appointment: canceled | Status updated |
| 5 | (Optional) Reschedule | Start booking flow with context | - | Booking flow opens |
| 6 | (Optional) Add to calendar | Create calendar event | Appointment: calendarSynced | Event added |
| 7 | (Optional) Get directions | Open maps to location | - | Maps opens |

### Flow Diagram

```mermaid
flowchart TD
    START([Need to manage appointment]) --> TAB[Open 'Termine']
    TAB --> MY[Open 'Meine Termine']
    MY --> LIST[View Appointments List]
    LIST --> SELECT[Select Appointment]
    SELECT --> DETAIL[View Appointment Details]

    DETAIL --> ACTION{Choose Action}
    ACTION -->|Cancel| CANCEL[Cancel Appointment]
    ACTION -->|Reschedule| REBOOK[Rebook] --> BOOKING_FLOW([Booking Flow])
    ACTION -->|Calendar| CAL[Add to Calendar]
    ACTION -->|Directions| MAPS[Open Maps]

    CANCEL --> DONE
    CAL --> DONE
    MAPS --> DONE
    DONE([Done])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

## Flow: Telemedicine Consultation (J4)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Telemedizin" | Show Teleclinic entry | - | Entry screen loads |
| 2 | Select specialty (sports/nutrition/derma/general) | Filter doctors | - | Specialty set |
| 3 | Select patient (self or family) | Check consent for minors | - | Patient selected |
| 4 | Input symptoms | Capture description | Consultation: symptoms | Symptoms saved |
| 5 | Check availability | Query Teleclinic 24/7 | - | Availability shown |
| 6 | Enter Teleclinic WebView | Handoff to partner | Consultation: created | WebView loads |
| 7 | Complete video setup (mic/camera test) | Validate devices | - | Setup complete |
| 8 | Conduct consultation | Video session | Consultation: in_progress | Session active |
| 9 | End session | Show summary | Consultation: completed | Summary shown |
| 10 | Prompt for prescription/OTC | Show redemption CTA | - | CTA displayed |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Patient | Self or Family? | Self flow | Minor consent check |
| Post-consult | Prescription issued? | Go to E-Rezept | OTC prompt |
| Follow-up | Doctor recommends? | Schedule follow-up | End |

### Flow Diagram

```mermaid
flowchart TD
    START([Health Concern]) --> ENTRY[Tap 'Telemedizin']

    subgraph SETUP["Consultation Setup"]
        ENTRY --> SPECIALTY[Select Specialty]
        SPECIALTY --> PATIENT{Who is Patient?}
        PATIENT -->|Self| SELF_PAT[Select Self]
        PATIENT -->|Family| FAM_PAT[Select Family Member]
        FAM_PAT --> CONSENT_CHECK{Minor?}
        CONSENT_CHECK -->|Yes| CONSENT[Confirm Consent]
        CONSENT_CHECK -->|No| SYMPTOMS
        CONSENT --> SYMPTOMS
        SELF_PAT --> SYMPTOMS[Input Symptoms]
        SYMPTOMS --> AVAIL[Check Availability]
    end

    AVAIL --> AVAIL_CHECK{Available?}
    AVAIL_CHECK -->|No| SCHEDULE[Schedule for Later]
    AVAIL_CHECK -->|Yes| WEBVIEW[Enter Teleclinic WebView]

    subgraph VIDEO["Video Consultation"]
        WEBVIEW --> SETUP_VID[Video/Audio Setup]
        SETUP_VID --> TEST{Setup OK?}
        TEST -->|No| TROUBLESHOOT[Troubleshoot]
        TROUBLESHOOT --> SETUP_VID
        TEST -->|Yes| JOIN[Join Consultation]
        JOIN --> SESSION[Video Session Active]
        SESSION --> END_BTN[End Session]
    end

    END_BTN --> SUMMARY[Consultation Summary]

    subgraph POST_CONSULT["Post-Consultation"]
        SUMMARY --> RX_CHECK{Prescription Issued?}
        RX_CHECK -->|Yes| RX_CTA[Go to E-Rezept]
        RX_CHECK -->|No| OTC_CHECK{OTC Recommended?}
        OTC_CHECK -->|Yes| OTC_CTA[Order OTC/Supplements]
        OTC_CHECK -->|No| FOLLOWUP
        RX_CTA --> FOLLOWUP
        OTC_CTA --> FOLLOWUP
        FOLLOWUP{Follow-up Needed?}
        FOLLOWUP -->|Yes| SCHED_FOLLOWUP[Schedule Follow-up]
        FOLLOWUP -->|No| DONE
        SCHED_FOLLOWUP --> DONE
    end

    DONE([Consultation Complete])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
    style TROUBLESHOOT fill:#fff3e0,stroke:#ef6c00,color:#e65100
```

## Flow: Online Prescription Redemption (J5)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "E-Rezept" or prompt | Show redemption options | - | Options shown |
| 2 | Choose "Online einlösen" | Show NFC scan screen | - | Scan screen loads |
| 3 | Hold eGK to phone | CardLink NFC scan | - | Card detected |
| 4 | Verify insurance | Check via CardLink | - | Insurance verified |
| 5 | View prescription details | Show medications + costs | Prescription: retrieved | Details shown |
| 6 | Select fulfillment (Delivery/Click & Collect) | Show options | - | Option selected |
| 7a | (Delivery) Confirm address | Load from profile | Order: address set | Address confirmed |
| 7b | (Click & Collect) Select dm store | Show store picker | Order: pickupStore | Store selected |
| 8 | (Optional) Apply Payback | Calculate points | Order: paybackApplied | Points shown |
| 9 | (Optional) Select discreet packaging | Toggle option | Order: discreetPackaging | Option set |
| 10 | Confirm order | Process via Apo Group | Order: created | Order confirmed |
| 11 | View tracking | Show status timeline | Order: status updates | Tracking visible |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Fulfillment | Delivery or Pickup? | Home delivery | Click & Collect at dm |
| Discreet | Sensitive items? | Enable discreet packaging | Standard packaging |
| Recurring | Recurring prescription? | Set up auto-refill reminder | One-time |

### Flow Diagram

```mermaid
flowchart TD
    START([Have Prescription]) --> ENTRY[Tap 'E-Rezept']
    ENTRY --> ONLINE[Choose 'Online einlösen']

    subgraph NFC_SCAN["NFC Scan"]
        ONLINE --> SCAN_PROMPT[Show NFC Instructions]
        SCAN_PROMPT --> HOLD[Hold eGK to Phone]
        HOLD --> DETECT{Card Detected?}
        DETECT -->|No| RETRY[Retry]
        RETRY --> HOLD
        DETECT -->|Yes| VERIFY[Verify Insurance]
        VERIFY --> DETAILS[Show Prescription Details]
    end

    subgraph FULFILLMENT["Fulfillment Choice"]
        DETAILS --> FULFILL{Delivery or Click & Collect?}
        FULFILL -->|Delivery| DELIVERY
        FULFILL -->|Click & Collect| COLLECT

        subgraph DELIVERY["Home Delivery"]
            DEL_ADDR[Confirm/Edit Address]
        end

        subgraph COLLECT["Click & Collect"]
            STORE_SELECT[Select dm Store]
        end
    end

    DEL_ADDR --> OPTIONS
    STORE_SELECT --> OPTIONS

    subgraph ORDER_OPTIONS["Order Options"]
        OPTIONS[Order Options]
        OPTIONS --> PAYBACK{Apply Payback?}
        PAYBACK -->|Yes| ADD_PAYBACK[Add Points]
        PAYBACK -->|No| DISCREET
        ADD_PAYBACK --> DISCREET
        DISCREET{Discreet Packaging?}
        DISCREET -->|Yes| SET_DISCREET[Enable Discreet]
        DISCREET -->|No| SUMMARY
        SET_DISCREET --> SUMMARY[Order Summary]
    end

    SUMMARY --> CONFIRM[Tap 'Bestellen']
    CONFIRM --> PROCESSING[Processing via Apo Group]
    PROCESSING --> SUCCESS[Order Confirmed]

    subgraph TRACKING["Tracking"]
        SUCCESS --> TRACK[View Tracking]
        TRACK --> STATUS[Status Updates]
        STATUS --> COMPLETE{Delivered/Collected?}
        COMPLETE -->|Yes| DONE
        COMPLETE -->|No| STATUS
    end

    DONE([Order Complete])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
    style RETRY fill:#fff3e0,stroke:#ef6c00,color:#e65100
```

### Assumptions

- Apply Payback during online redemption is inferred from loyalty/deals context in the scope.

## Flow: Offline Prescription Redemption (J6)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Choose "Vor Ort einlösen" | Show location search | - | Search loads |
| 2 | Grant location permission | Get GPS coordinates | - | Location acquired |
| 3 | Search dm stores/pharmacies | Query Google Maps + dm API | - | Results shown |
| 4 | Filter (open now, distance, stock) | Update results | - | Filtered |
| 5 | Select dm store or pharmacy | Show details | - | Details shown |
| 6 | View directions | Open Maps app | - | Maps opens |
| 7 | Redeem at location | Update status | Prescription: redeemed | Confirmation |
| 8 | Update history | Add to history | History: updated | History saved |

### Flow Diagram

```mermaid
flowchart TD
    START([Prefer Pickup]) --> ENTRY[Tap 'E-Rezept']
    ENTRY --> OFFLINE[Choose 'Vor Ort einlösen']

    subgraph LOCATION["Location Search"]
        OFFLINE --> LOC_PERM{Location Permission?}
        LOC_PERM -->|Denied| MANUAL[Enter Address Manually]
        LOC_PERM -->|Granted| GPS[Use Current Location]
        MANUAL --> SEARCH
        GPS --> SEARCH[Search dm/Pharmacies]
    end

    subgraph RESULTS["Results"]
        SEARCH --> MAP_LIST[Map + List View]
        MAP_LIST --> FILTERS[Apply Filters]
        FILTERS --> FILTER_OPT{Filter Options}
        FILTER_OPT -->|Open Now| OPEN_FILTER
        FILTER_OPT -->|Distance| DIST_FILTER
        FILTER_OPT -->|Has Stock| STOCK_FILTER
        OPEN_FILTER --> UPDATED
        DIST_FILTER --> UPDATED
        STOCK_FILTER --> UPDATED
        UPDATED[Updated Results]
    end

    UPDATED --> SELECT[Select dm/Pharmacy]

    subgraph STORE_DETAIL["Store Details"]
        SELECT --> DETAIL[View Details]
        DETAIL --> INFO[Hours, Services, Distance]
        INFO --> ACTIONS{Choose Action}
        ACTIONS -->|Directions| MAPS[Open Maps App]
        ACTIONS -->|Call| CALL[Call Store]
    end

    MAPS --> NAVIGATE[Navigate to Store]
    NAVIGATE --> ARRIVE[Arrive at Store]
    ARRIVE --> REDEEM[Redeem Prescription]
    REDEEM --> CONFIRM[Confirmation]
    CONFIRM --> HISTORY[Update History]
    HISTORY --> DONE([Prescription Redeemed])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

## Flow: History Tracking (J7)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Verlauf" tab | Show history list | - | List loads |
| 2 | View chronological list | Display all items | - | Items shown |
| 3 | Filter by type/date/family member | Update list | - | Filtered |
| 4 | Tap item for details | Show detail view | - | Details shown |
| 5 | (Optional) Export to PDF | Generate document | - | PDF created |
| 6 | (Optional) Set refill reminder | Schedule notification | Notification: scheduled | Reminder set |

### Flow Diagram

```mermaid
flowchart TD
    START([Need Records]) --> TAB[Tap 'Verlauf' Tab]

    subgraph HISTORY_VIEW["History View"]
        TAB --> LIST[Chronological List]
        LIST --> ITEMS[Appointments + Orders + Purchases]

        subgraph FILTERS["Filters"]
            ITEMS --> FILTER_BTN[Tap Filter]
            FILTER_BTN --> TYPE_F[By Type]
            FILTER_BTN --> DATE_F[By Date Range]
            FILTER_BTN --> FAM_F[By Family Member]
        end

        TYPE_F --> APPLY
        DATE_F --> APPLY
        FAM_F --> APPLY
        APPLY[Apply Filters] --> FILTERED[Filtered Results]
    end

    FILTERED --> SELECT[Tap Item]
    SELECT --> DETAIL[View Details]

    subgraph ACTIONS["Actions"]
        DETAIL --> ACTION_CHOICE{Choose Action}
        ACTION_CHOICE -->|Export| EXPORT[Export to PDF]
        ACTION_CHOICE -->|Reminder| REMINDER[Set Refill Reminder]
        ACTION_CHOICE -->|Rebook| REBOOK[Book Again]
    end

    EXPORT --> DONE
    REMINDER --> DONE
    REBOOK --> BOOKING_FLOW([Booking Flow])
    DONE([History Viewed])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

## Flow: Home Screen (J8)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open app | Load home screen | - | Screen loads |
| 2 | Check profile status | Gate features if incomplete | - | Status checked |
| 3 | Load CMS content | Fetch deals, health tips, Payback | CMS Content: loaded | Content displays |
| 4 | View personalized sections | Show based on profile | - | Personalized |
| 5 | Tap quick action | Navigate to feature | - | Feature opens |
| 6 | Pull to refresh | Update content | CMS Content: refreshed | Content updated |

### Flow Diagram

```mermaid
flowchart TD
    START([Open App]) --> PROFILE_CHECK{Profile Complete?}
    PROFILE_CHECK -->|No| PROMPT[Profile Completion Prompt]
    PROMPT --> PROFILE_FLOW([Profile Flow])
    PROFILE_CHECK -->|Yes| LOAD[Load Home Screen]

    subgraph HOME_SCREEN["Home Screen"]
        LOAD --> CMS[Load CMS Content]
        CMS --> SECTIONS[Display Sections]

        subgraph CONTENT["Dynamic Content"]
            SECTIONS --> DEALS[dm Deals & Payback]
            SECTIONS --> HEALTH_TIPS[Health Tips]
            SECTIONS --> UPCOMING[Upcoming Appointments]
            SECTIONS --> ACTIVE_RX[Active Prescriptions]
            SECTIONS --> QUICK[Quick Actions]
        end
    end

    subgraph ACTIONS["User Actions"]
        DEALS --> DEAL_TAP[Tap Deal] --> DEAL_DETAIL[View Deal]
        HEALTH_TIPS --> TIP_TAP[Tap Tip] --> TIP_DETAIL[Read Article]
        UPCOMING --> APPT_TAP[Tap Appointment] --> APPT_DETAIL[View Details]
        ACTIVE_RX --> RX_TAP[Tap Prescription] --> RX_FLOW([E-Rezept Flow])
        QUICK --> Q_TAP{Tap Quick Action}
        Q_TAP -->|Book| BOOK_FLOW([Booking Flow])
        Q_TAP -->|Consult| TELE_FLOW([Telemedicine Flow])
        Q_TAP -->|E-Rezept| ERX_FLOW([E-Rezept Flow])
        Q_TAP -->|Stores| STORE_FLOW([Store Finder])
    end

    REFRESH[Pull to Refresh] --> CMS

    style START fill:#000000,stroke:#000000,color:#ffffff
    style PROMPT fill:#fff3e0,stroke:#ef6c00,color:#e65100
```

### Assumptions

- Home sections for Upcoming Appointments and Active Prescriptions are inferred.
- Pull-to-refresh behavior is inferred.

## Flow: Push Notifications (J9)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Event triggers notification | Send via FCM/APNs | Notification: sent | Push delivered |
| 2 | Receive notification | Display on device | - | Notification shows |
| 3 | Tap notification | Deep link to relevant screen | - | Screen opens |
| 4 | Complete action | Update related object | Varies | Action completed |

### Notification Types

| Type | Trigger | Content | Deep Link |
|------|---------|---------|-----------|
| Appointment Reminder | 24h/1h before | "Ihr Termin morgen um 14:00" | Appointment Details |
| Prescription Ready | Order status change | "Ihre Medikamente sind abholbereit" | Order Tracking |
| dm Deals | CMS schedule | "20% auf Vitamine heute!" | Deal Detail |
| Payback | Points earned | "Sie haben 50 Punkte gesammelt" | Payback Dashboard |
| Refill Reminder | History flag | "Zeit für Ihre Rezeptverlängerung" | E-Rezept Entry |
| Post-Appointment | 60 min after | "Wie war Ihr Termin? Rezept einlösen?" | Feedback + E-Rezept |

### Assumptions

- Appointment reminder timing (24h/1h), points-earned notifications, and specific message copy are inferred.

### Flow Diagram

```mermaid
flowchart TD
    subgraph TRIGGERS["Event Triggers"]
        T1[Appointment in 24h]
        T2[Order Status Change]
        T3[CMS Schedule]
        T4[Points Earned]
        T5[Refill Due]
        T6[Appointment Completed]
    end

    T1 --> SEND
    T2 --> SEND
    T3 --> SEND
    T4 --> SEND
    T5 --> SEND
    T6 --> SEND

    SEND[Send Notification via FCM/APNs]
    SEND --> DEVICE[Display on Device]
    DEVICE --> USER_ACTION{User Action}

    USER_ACTION -->|Tap| DEEP_LINK[Deep Link to Screen]
    USER_ACTION -->|Dismiss| DISMISS[Notification Dismissed]
    USER_ACTION -->|Ignore| EXPIRE[Notification Expires]

    DEEP_LINK --> SCREEN{Target Screen}
    SCREEN -->|Appointment| APPT_DETAIL[Appointment Details]
    SCREEN -->|Order| ORDER_TRACK[Order Tracking]
    SCREEN -->|Deal| DEAL_VIEW[Deal Detail]
    SCREEN -->|E-Rezept| ERX_ENTRY[E-Rezept Entry]
    SCREEN -->|Feedback| FEEDBACK[Feedback Form]

    APPT_DETAIL --> ACTION[Complete Action]
    ORDER_TRACK --> ACTION
    DEAL_VIEW --> ACTION
    ERX_ENTRY --> ACTION
    FEEDBACK --> ACTION

    ACTION --> DONE([Action Completed])

    style SEND fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

## Flow Metrics

Note: Metrics and targets are derived assumptions for planning, except the telemedicine session completion >90% stated in the source.

| Flow | Primary Metric | Target | Fallback Metric |
|------|----------------|--------|-----------------|
| Registration | Completion rate | >90% | Time to complete <1 min |
| Profile | Profile completion rate | >80% | Insurance verification success |
| Booking | Booking completion rate | >60% | Time to book <2 min |
| Telemedicine | Session completion rate | >85% | Video setup success >95% |
| Online Rx | Redemption rate | >70% | NFC scan success >85% |
| Offline Rx | Store selection rate | >60% | Directions opened >50% |
| History | Export/reminder usage | >20% | Page views per session |
| Home | Quick action tap rate | >40% | Session duration |
| Notifications | Tap-through rate | >25% | Delivery rate >98% |

---

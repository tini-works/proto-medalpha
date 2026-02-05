# User Flows - MedAlpha Connect v3

**Generated From:** N3 App Implementation Analysis
**Date:** 2026-01-29
**Focus:** Curaay doctor appointments with 3 booking paths (Fast-Lane, Specialty-First, Doctor-First)

---

## Jobs-to-be-Done Summary

| Job ID | Feature | Job Statement | Primary Personas |
|--------|---------|---------------|------------------|
| J1 | Registration | When I download the app, I want to register quickly so that I can access booking features | All |
| J2 | Profile | When I need to book, I want to complete my profile so that insurance/family are set up | Sarah, Helga |
| J3a | Fast-Lane Booking | When I need care quickly, I want to describe symptoms so that I get matched with an available doctor | Marc, Sarah |
| J3b | Specialty Booking | When I want a specific specialty, I want to set my preferences so that I see matching doctors | Sarah, Helga |
| J3c | Doctor Booking | When I want a specific doctor, I want to search by name so that I can book directly | Helga, Thomas |
| J4 | Appointment Mgmt | When I have appointments, I want to view/reschedule/cancel so that I stay organized | All |
| J5 | History | When I need records, I want to view history so that I track past appointments | Sarah, Helga |
| J6 | Notifications | When appointments change status, I want alerts so that I stay informed | All |
| J7 | Content | When I open the app, I want health news so that I stay informed about wellness | Elena, All |

---

## Flow: User Registration (J1)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open app (first time) | Show welcome screen | - | Welcome displays |
| 2 | Tap "Register" | Show registration form | - | Form displays |
| 3 | Enter name, email, password | Validate inputs | - | No errors |
| 4 | Tap "Create Account" | Send verification code | User: created (pending) | Code sent |
| 5 | Enter verification code | Verify code | User: verified | Code accepted |
| 6 | Navigate to home | Show home screen | - | Home displays |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Verification | Code valid? | Continue to home | Retry/Resend |
| Profile | Complete profile now? | Profile completion | Skip to home |

### Flow Diagram

```mermaid
flowchart TD
    START([App Download]) --> OPEN[Open App First Time]
    OPEN --> WELCOME[Welcome Screen]

    subgraph REGISTRATION["Registration Flow"]
        WELCOME --> REG_BTN[Tap 'Register']
        REG_BTN --> INPUT[Enter Name, Email, Password]
        INPUT --> VALIDATE{Valid?}
        VALIDATE -->|No| ERROR[Show Errors]
        ERROR --> INPUT
        VALIDATE -->|Yes| SUBMIT[Tap 'Create Account']
        SUBMIT --> VERIFY_SEND[Send Verification Code]
    end

    subgraph VERIFICATION["Verification"]
        VERIFY_SEND --> VERIFY_INPUT[Enter 6-Digit Code]
        VERIFY_INPUT --> VERIFY_CHECK{Code Valid?}
        VERIFY_CHECK -->|No| RETRY[Retry / Resend]
        RETRY --> VERIFY_INPUT
        VERIFY_CHECK -->|Yes| VERIFIED[Account Verified]
    end

    VERIFIED --> PROFILE_Q{Complete Profile Now?}
    PROFILE_Q -->|Yes| PROFILE[Profile Completion]
    PROFILE_Q -->|No| HOME
    PROFILE --> HOME([Home Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style HOME fill:#000000,stroke:#000000,color:#ffffff
    style ERROR fill:#ffebee,stroke:#c62828,color:#b71c1c
```

---

## Flow: Forgot Password (J1a) - NEW in v3

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Forgot password?" on Sign In | Show forgot password screen | - | Screen displays |
| 2 | Enter registered email | Validate email exists | - | Email valid |
| 3 | Tap "Send Reset Code" | Send verification code | - | Code sent |
| 4 | Enter verification code | Verify code | - | Code accepted |
| 5 | Enter new password + confirm | Validate password match | User: password updated | Password saved |
| 6 | Auto sign-in | Navigate to home | Auth: authenticated | Home displays |

### Flow Diagram

```mermaid
flowchart TD
    START([Forgot Password]) --> SIGNIN[Sign In Screen]
    SIGNIN --> FORGOT[Tap 'Forgot password?']

    subgraph RESET_FLOW["Password Reset Flow"]
        FORGOT --> EMAIL[Enter Registered Email]
        EMAIL --> VALIDATE{Email Valid?}
        VALIDATE -->|No| ERROR[Show Error]
        ERROR --> EMAIL
        VALIDATE -->|Yes| SEND[Tap 'Send Reset Code']
        SEND --> CODE[Enter Verification Code]
        CODE --> CODE_CHECK{Code Valid?}
        CODE_CHECK -->|No| RETRY[Retry / Resend]
        RETRY --> CODE
        CODE_CHECK -->|Yes| NEW_PW[Enter New Password]
        NEW_PW --> CONFIRM[Confirm Password]
        CONFIRM --> MATCH{Passwords Match?}
        MATCH -->|No| PW_ERROR[Show Mismatch Error]
        PW_ERROR --> NEW_PW
        MATCH -->|Yes| SAVE[Save New Password]
    end

    SAVE --> AUTO_LOGIN[Auto Sign-In]
    AUTO_LOGIN --> HOME([Home Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style HOME fill:#000000,stroke:#000000,color:#ffffff
    style ERROR fill:#ffebee,stroke:#c62828,color:#b71c1c
    style PW_ERROR fill:#ffebee,stroke:#c62828,color:#b71c1c
```

---

## Flow: Profile Completion (J2)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | View profile form | Show fields (name, insurance, address) | - | Form loads |
| 2 | Enter insurance details (GKV/PKV) | Validate insurance | Insurance: set | Insurance saved |
| 3 | Enter EGK number (optional) | Save EGK | User: egkNumber | EGK saved |
| 4 | Enter address | Save address | Address: created | Address saved |
| 5 | (Optional) Add family members | Show family form | - | Form displays |
| 6 | Enter family member details | Validate, save member | FamilyMember: created | Member added |
| 7 | Accept GDPR consent | Record consent | User: gdprConsent | Consent saved |
| 8 | Tap "Save" | Show success | User: profileComplete | Success message |

### Flow Diagram

```mermaid
flowchart TD
    START([Profile Incomplete]) --> FORM[Profile Form]

    subgraph PROFILE_FORM["Profile Completion"]
        FORM --> NAME[Verify Name]
        NAME --> INS[Select Insurance Type]
        INS --> INS_TYPE{GKV or PKV?}
        INS_TYPE -->|GKV| GKV_FIELDS[Enter EGK Number]
        INS_TYPE -->|PKV| PKV_FIELDS[Enter Policy Details]
        GKV_FIELDS --> ADDR
        PKV_FIELDS --> ADDR

        ADDR[Enter Address]
        ADDR --> FAMILY_Q{Add Family Members?}
        FAMILY_Q -->|Yes| FAMILY_ADD
        FAMILY_Q -->|No| GDPR
    end

    subgraph FAMILY_FLOW["Family Management"]
        FAMILY_ADD[Add Family Member]
        FAMILY_ADD --> FAM_DETAILS[Enter Name, DOB, Relationship]
        FAM_DETAILS --> FAM_INS[Link Insurance - Optional]
        FAM_INS --> MORE_FAM{Add Another?}
        MORE_FAM -->|Yes| FAMILY_ADD
        MORE_FAM -->|No| GDPR
    end

    GDPR[Accept GDPR Consent]
    GDPR --> SAVE[Tap 'Save']
    SAVE --> SUCCESS[Success - Profile Complete]
    SUCCESS --> HOME([Home Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style HOME fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Fast-Lane Booking (J3a) - NEW in v3

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Book Appointment" | Show booking type selection | - | Screen loads |
| 2 | Select "Fast-Lane" | Show care request form | BookingFlow: fast_lane | Form displays |
| 3 | Select patient (self/family) | Update patient field | Booking: forUser | Patient selected |
| 4 | Select specialty | Update specialty | Booking: specialty | Specialty set |
| 5 | Select symptoms (chips) | Update symptoms | Booking: symptoms | Symptoms selected |
| 6 | Select city | Update location | Booking: city | City set |
| 7 | Select insurance type | Update insurance | Booking: insurance | Insurance set |
| 8 | Tap "Find Appointment" | Create matching appointment | Appointment: matching | Request sent |
| 9 | View Request Sent screen | Show confirmation | - | Confirmation shown |
| 10 | Background matching runs | Update status in real-time | Appointment: status | Matching progresses |
| 11a | (Success) Doctor matched | Show success screen | Appointment: confirmed | Doctor assigned |
| 11b | (No Match) No doctors | Show alternatives | Appointment: cancelled | Alternatives shown |

### Decision Points

| Branch Point | Condition | Path A | Path B | Path C |
|--------------|-----------|--------|--------|--------|
| Patient | Who needs care? | Self | Family member | - |
| Matching result | Doctor found? | Success screen | No Match screen | - |
| No Match action | User choice? | Retry | Change specialty | Browse doctors |

### Flow Diagram

```mermaid
flowchart TD
    START([Need Care Quickly]) --> ENTRY[Tap 'Book Appointment']

    subgraph TYPE_SELECT["Booking Type"]
        ENTRY --> TYPE[Booking Type Selection]
        TYPE --> FAST[Select 'Fast-Lane']
    end

    subgraph CARE_REQUEST["Care Request Form"]
        FAST --> PATIENT{Who Needs Care?}
        PATIENT -->|Self| SELF[Select Self]
        PATIENT -->|Family| FAM[Select Family Member]
        SELF --> SPECIALTY
        FAM --> SPECIALTY[Select Specialty]
        SPECIALTY --> SYMPTOMS[Select Symptoms]
        SYMPTOMS --> CITY[Select City]
        CITY --> INSURANCE[Select Insurance Type]
        INSURANCE --> SUBMIT[Tap 'Find Appointment']
    end

    SUBMIT --> CREATE[Create Matching Appointment]
    CREATE --> SENT[Request Sent Screen]

    subgraph MATCHING["Background Matching"]
        SENT --> PROGRESS[Matching Status Screen]
        PROGRESS --> STEP1[Verifying Preferences]
        STEP1 --> STEP2[Checking Doctor Availability]
        STEP2 --> STEP3[Matching Best Time Slot]
        STEP3 --> STEP4[Confirming Appointment]
        STEP4 --> RESULT{Match Found?}
    end

    RESULT -->|Yes| SUCCESS[Fast-Lane Success]
    RESULT -->|No| NO_MATCH[No Match Screen]

    subgraph ALTERNATIVES["No Match Options"]
        NO_MATCH --> ALT{Choose Action}
        ALT -->|Retry| SUBMIT
        ALT -->|Change Specialty| SPEC_FLOW([Specialty Flow])
        ALT -->|Browse Doctors| DOC_FLOW([Doctor Flow])
    end

    SUCCESS --> DONE([Appointment Confirmed])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
    style NO_MATCH fill:#fff3e0,stroke:#ef6c00,color:#e65100
```

---

## Flow: Specialty-First Booking (J3b) - NEW in v3

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Book Appointment" | Show booking type selection | - | Screen loads |
| 2 | Select "Book by Specialty" | Show specialty search | BookingFlow: by_specialty | Form displays |
| 3 | Search/select specialty | Update specialty | Booking: specialty | Specialty set |
| 4 | Select city | Update location | Booking: city | City set |
| 5 | Select insurance type | Update insurance | Booking: insurance | Insurance set |
| 6 | Tap "Continue" | Show availability screen | - | Screen loads |
| 7 | Set availability (flexible or specific) | Update preferences | AvailabilityPrefs: set | Prefs saved |
| 8 | Tap "Continue" | Start matching, show doctors | - | Doctors display |
| 9 | View matched doctors | Show doctor cards | - | Cards display |
| 10 | (Optional) View doctor details | Show detail sheet | - | Sheet opens |
| 11 | Select a doctor OR skip | Process selection | Booking: selectedDoctor | Doctor set |
| 12 | Confirming with doctor | Show progress | Appointment: await_confirm | Progress shown |
| 13 | Appointment confirmed | Show success | Appointment: confirmed | Success shown |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Availability | User preference? | Fully flexible | Specific days/times |
| Doctor selection | User choice? | Select specific doctor | Skip - system chooses |

### Flow Diagram

```mermaid
flowchart TD
    START([Want Specific Specialty]) --> ENTRY[Tap 'Book Appointment']

    subgraph TYPE_SELECT["Booking Type"]
        ENTRY --> TYPE[Booking Type Selection]
        TYPE --> SPECIALTY_PATH[Select 'Book by Specialty']
    end

    subgraph SEARCH["Specialty Search - Step 1 of 2"]
        SPECIALTY_PATH --> SPEC_SEARCH[Search/Select Specialty]
        SPEC_SEARCH --> CITY[Select City]
        CITY --> INSURANCE[Select Insurance Type]
        INSURANCE --> CONTINUE1[Tap 'Continue']
    end

    subgraph AVAILABILITY["Availability Preferences - Step 2 of 2"]
        CONTINUE1 --> AVAIL_SCREEN[Availability Screen]
        AVAIL_SCREEN --> FLEX{Fully Flexible?}
        FLEX -->|Yes| FLEXIBLE[Select 'I'm Fully Flexible']
        FLEX -->|No| SPECIFIC[Select Specific Days/Times]
        FLEXIBLE --> CONTINUE2
        SPECIFIC --> CONTINUE2[Tap 'Continue']
    end

    CONTINUE2 --> MATCHING[Finding Matched Doctors]

    subgraph RESULTS["Matched Doctors - Step 4 of 4"]
        MATCHING --> DOCTORS[View Doctor Cards]
        DOCTORS --> DETAIL_Q{View Details?}
        DETAIL_Q -->|Yes| SHEET[Doctor Detail Sheet]
        SHEET --> DOCTORS
        DETAIL_Q -->|No| SELECT_Q
        DOCTORS --> SELECT_Q{Select or Skip?}
        SELECT_Q -->|Select| SELECT[Select This Doctor]
        SELECT_Q -->|Skip| SKIP[Let System Choose]
    end

    SELECT --> CONFIRMING
    SKIP --> CONFIRMING[Confirming with Doctor]
    CONFIRMING --> PROGRESS[Checking Availability...]
    PROGRESS --> SUCCESS[Appointment Confirmed]
    SUCCESS --> DONE([Success Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Doctor-First Booking (J3c) - NEW in v3

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Book Appointment" | Show booking type selection | - | Screen loads |
| 2 | Select "Book by Doctor" | Show doctor search | BookingFlow: by_doctor | Screen displays |
| 3 | Search by name or specialty | Filter results | - | Results shown |
| 4 | (Optional) Filter by specialty chip | Update filters | - | Filtered |
| 5 | (Optional) Sort by name/rating/distance | Update sort | - | Sorted |
| 6 | Select a doctor | Show symptoms screen | Booking: selectedDoctor | Doctor set |
| 7 | Select symptom chips | Update symptoms | SymptomInfo: symptoms | Symptoms set |
| 8 | (Optional) Add notes | Update notes | SymptomInfo: notes | Notes saved |
| 9 | Tap "Continue" | Show slot selection | - | Slots display |
| 10 | Select date | Show times for date | - | Times shown |
| 11 | Select time slot | Update slot | Booking: selectedSlot | Slot set |
| 12 | Tap "Continue" | Show confirm screen | - | Confirm displays |
| 13 | Review details | Verify information | - | Details correct |
| 14 | Tap "Confirm Appointment" | Process booking | Appointment: confirmed | Success |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Search | How to find? | By name | By specialty filter |
| Sort | Sort order? | Name A-Z | Rating / Distance |

### Flow Diagram

```mermaid
flowchart TD
    START([Want Specific Doctor]) --> ENTRY[Tap 'Book Appointment']

    subgraph TYPE_SELECT["Booking Type"]
        ENTRY --> TYPE[Booking Type Selection]
        TYPE --> DOC_PATH[Select 'Book by Doctor']
    end

    subgraph DOCTOR_SEARCH["Doctor Search - Step 1 of 4"]
        DOC_PATH --> SEARCH[Search by Name or Specialty]
        SEARCH --> FILTER{Apply Filters?}
        FILTER -->|Yes| CHIPS[Specialty Filter Chips]
        CHIPS --> SORT
        FILTER -->|No| SORT{Sort Results?}
        SORT -->|Name| NAME_SORT[Sort by Name A-Z]
        SORT -->|Rating| RATING_SORT[Sort by Rating]
        SORT -->|Distance| DIST_SORT[Sort by Distance]
        NAME_SORT --> RESULTS
        RATING_SORT --> RESULTS
        DIST_SORT --> RESULTS
        RESULTS[View Doctor Cards]
        RESULTS --> SELECT_DOC[Select a Doctor]
    end

    subgraph SYMPTOMS["Describe Symptoms - Step 2 of 4"]
        SELECT_DOC --> SYMPTOM_SCREEN[Symptoms Screen]
        SYMPTOM_SCREEN --> SYMPTOM_CHIPS[Select Symptom Chips]
        SYMPTOM_CHIPS --> NOTES{Add Notes?}
        NOTES -->|Yes| ADD_NOTES[Enter Additional Details]
        NOTES -->|No| CONTINUE1
        ADD_NOTES --> CONTINUE1[Tap 'Continue']
    end

    subgraph SLOT_SELECT["Slot Selection - Step 3 of 4"]
        CONTINUE1 --> DATES[Date Carousel]
        DATES --> SELECT_DATE[Select Date]
        SELECT_DATE --> TIMES[Available Time Slots]
        TIMES --> SELECT_TIME[Select Time]
        SELECT_TIME --> CONTINUE2[Tap 'Continue']
    end

    subgraph CONFIRM["Confirm - Step 4 of 4"]
        CONTINUE2 --> REVIEW[Review Details]
        REVIEW --> DETAILS[Doctor, Date, Time, Patient, Symptoms]
        DETAILS --> CONFIRM_BTN[Tap 'Confirm Appointment']
    end

    CONFIRM_BTN --> PROCESS[Processing...]
    PROCESS --> SUCCESS[Appointment Confirmed]
    SUCCESS --> DONE([Success Screen])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Appointment Management (J4)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open "History" tab | Show appointments list | - | List loads |
| 2 | Toggle Upcoming/Past | Filter appointments | - | Filtered |
| 3 | Tap appointment card | Show appointment details | - | Details shown |
| 4a | (Optional) Tap "Reschedule" | Start reschedule flow | - | Flow starts |
| 4b | (Optional) Tap "Cancel" | Show cancel confirmation | Appointment: cancelled | Status updated |
| 4c | (Optional) Tap "Book Again" | Start book again flow | - | Flow starts |
| 5 | (Optional) Add to calendar | Create calendar event | Appointment: calendarSynced | Event added |

### Flow Diagram

```mermaid
flowchart TD
    START([Manage Appointments]) --> TAB[Open 'History' Tab]
    TAB --> LIST[View Appointments List]

    subgraph LIST_VIEW["Appointment List"]
        LIST --> TOGGLE{Upcoming or Past?}
        TOGGLE -->|Upcoming| UPCOMING[Upcoming Appointments]
        TOGGLE -->|Past| PAST[Past Appointments]
        UPCOMING --> SELECT
        PAST --> SELECT[Select Appointment]
    end

    SELECT --> DETAIL[View Appointment Details]

    subgraph ACTIONS["Available Actions"]
        DETAIL --> ACTION{Choose Action}
        ACTION -->|Reschedule| RESCHEDULE([Reschedule Flow])
        ACTION -->|Cancel| CANCEL[Cancel Confirmation]
        ACTION -->|Book Again| BOOK_AGAIN([Book Again Flow])
        ACTION -->|Calendar| CALENDAR[Add to Calendar]
    end

    CANCEL --> CANCELLED[Appointment Cancelled]
    CALENDAR --> DONE
    CANCELLED --> DONE([Done])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Reschedule Appointment (J4a)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Reschedule" on detail | Show reason screen | - | Screen loads |
| 2 | Select reason | Update reason | Reschedule: reason | Reason set |
| 3 | Tap "Continue" | Show suggested slots | - | Slots display |
| 4 | Select new time slot | Update selection | Reschedule: newSlot | Slot selected |
| 5 | Tap "Continue" | Show confirm screen | - | Confirm displays |
| 6 | Review old vs new details | Verify changes | - | Details correct |
| 7 | Tap "Confirm Reschedule" | Process reschedule | Appointment: rescheduled | Success |
| 8 | View success screen | Show confirmation | - | Success shown |

### Flow Diagram

```mermaid
flowchart TD
    START([Need to Reschedule]) --> DETAIL[Appointment Detail]
    DETAIL --> RESCHEDULE[Tap 'Reschedule']

    subgraph REASON["Reschedule Reason"]
        RESCHEDULE --> REASON_SCREEN[Select Reason]
        REASON_SCREEN --> REASONS{Reason Type}
        REASONS -->|Schedule Conflict| R1[Schedule Conflict]
        REASONS -->|Feeling Better| R2[Feeling Better]
        REASONS -->|Transportation| R3[Transportation Issue]
        REASONS -->|Other| R4[Other - Enter Text]
        R1 --> CONTINUE1
        R2 --> CONTINUE1
        R3 --> CONTINUE1
        R4 --> CONTINUE1[Tap 'Continue']
    end

    subgraph SLOTS["Suggested Slots"]
        CONTINUE1 --> SLOT_SCREEN[View Suggested Slots]
        SLOT_SCREEN --> DATE_SELECT[Select Date]
        DATE_SELECT --> TIME_SELECT[Select Time]
        TIME_SELECT --> CONTINUE2[Tap 'Continue']
    end

    subgraph CONFIRM["Confirm Reschedule"]
        CONTINUE2 --> REVIEW[Review Changes]
        REVIEW --> OLD_NEW[Old vs New Details]
        OLD_NEW --> CONFIRM_BTN[Tap 'Confirm Reschedule']
    end

    CONFIRM_BTN --> PROCESS[Processing...]
    PROCESS --> SUCCESS[Reschedule Success]
    SUCCESS --> DONE([Appointment Rescheduled])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Book Again (J4b)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "Book Again" on past appointment | Show context screen | BookAgain: context | Screen loads |
| 2 | Review original appointment | Display details | - | Details shown |
| 3a | (Available) Same doctor available | Show slot selection | Booking: selectedDoctor | Slots display |
| 3b | (Unavailable) Doctor not available | Show alternatives | - | Alternatives shown |
| 4 | Select alternative (if needed) | Update doctor | Booking: selectedDoctor | Doctor set |
| 5 | Select time slot | Update slot | Booking: selectedSlot | Slot set |
| 6 | Confirm booking | Process booking | Appointment: confirmed | Success |

### Decision Points

| Branch Point | Condition | Path A | Path B |
|--------------|-----------|--------|--------|
| Doctor availability | Same doctor available? | Direct to slot selection | Show alternatives |

### Flow Diagram

```mermaid
flowchart TD
    START([Want to Rebook]) --> HISTORY[History - Past Tab]
    HISTORY --> SELECT[Select Past Appointment]
    SELECT --> DETAIL[View Details]
    DETAIL --> BOOK_AGAIN[Tap 'Book Again']

    subgraph CONTEXT["Book Again Context"]
        BOOK_AGAIN --> CONTEXT_SCREEN[Review Original Appointment]
        CONTEXT_SCREEN --> AVAIL_CHECK{Same Doctor Available?}
    end

    AVAIL_CHECK -->|Yes| SLOTS[Slot Selection]
    AVAIL_CHECK -->|No| ALTERNATIVES

    subgraph ALT_FLOW["Alternatives"]
        ALTERNATIVES[Show Alternative Doctors]
        ALTERNATIVES --> SELECT_ALT[Select Alternative]
        SELECT_ALT --> SLOTS
    end

    subgraph BOOKING["Complete Booking"]
        SLOTS --> SELECT_SLOT[Select Time Slot]
        SELECT_SLOT --> CONFIRM[Confirm Screen]
        CONFIRM --> CONFIRM_BTN[Tap 'Confirm']
    end

    CONFIRM_BTN --> SUCCESS[Booking Confirmed]
    SUCCESS --> DONE([Appointment Booked])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: History Tracking (J5)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap "History" tab | Show history list | - | List loads |
| 2 | View chronological list | Display all appointments | - | Items shown |
| 3 | Toggle Upcoming/Past | Filter list | - | Filtered |
| 4 | Tap item for details | Show detail view | - | Details shown |
| 5 | (Optional) Tap archive icon | Show archive view | - | Archive shown |
| 6 | (Optional) Book again | Start booking flow | - | Flow starts |

### Flow Diagram

```mermaid
flowchart TD
    START([Need Records]) --> TAB[Tap 'History' Tab]

    subgraph HISTORY_VIEW["History View"]
        TAB --> LIST[Chronological List]
        LIST --> TOGGLE{Toggle View}
        TOGGLE -->|Upcoming| UPCOMING[Upcoming Appointments]
        TOGGLE -->|Past| PAST[Past Appointments]

        UPCOMING --> ITEMS
        PAST --> ITEMS[View Items]

        subgraph STATUS["Status Badges"]
            ITEMS --> MATCHING[Matching]
            ITEMS --> AWAIT[Await Confirm]
            ITEMS --> CONFIRMED[Confirmed]
            ITEMS --> COMPLETED[Completed]
            ITEMS --> CANCELLED[Cancelled]
        end
    end

    ITEMS --> SELECT[Tap Item]
    SELECT --> DETAIL[View Details]

    subgraph ACTIONS["Actions"]
        DETAIL --> ACTION{Choose Action}
        ACTION -->|View Archive| ARCHIVE[Archive View]
        ACTION -->|Book Again| REBOOK([Book Again Flow])
        ACTION -->|Reschedule| RESCHEDULE([Reschedule Flow])
    end

    ARCHIVE --> DONE
    DONE([History Viewed])

    style START fill:#000000,stroke:#000000,color:#ffffff
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: In-App Notifications (J6) - NEW in v3

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Appointment status changes | Detect change | Appointment: status | Change detected |
| 2 | System shows toast | Display notification | - | Toast appears |
| 3 | (Optional) Tap "View" | Navigate to appointment | - | Detail opens |
| 4 | (Optional) Dismiss | Toast auto-dismisses | - | Toast gone |

### Notification Types

| Type | Trigger | Content | Deep Link |
|------|---------|---------|-----------|
| Confirmed | Matching → Confirmed | "Appointment confirmed" | Appointment Detail |
| No Match | Matching → Cancelled | "No match found" | No Match Screen |
| Cancelled by Doctor | Doctor cancels | "Appointment cancelled by doctor" | Appointment Detail |
| Cancelled | User cancels | "Appointment cancelled" | History |
| Completed | Appointment done | "Appointment completed" | History |

### Flow Diagram

```mermaid
flowchart TD
    subgraph TRIGGERS["Status Change Triggers"]
        T1[Matching → Confirmed]
        T2[Matching → No Match]
        T3[Doctor Cancels]
        T4[User Cancels]
        T5[Appointment Completed]
    end

    T1 --> DETECT
    T2 --> DETECT
    T3 --> DETECT
    T4 --> DETECT
    T5 --> DETECT

    DETECT[AppointmentStatusChangeNotifier]
    DETECT --> TOAST[Show Toast Notification]
    TOAST --> USER_ACTION{User Action}

    USER_ACTION -->|Tap 'View'| DEEP_LINK[Navigate to Detail]
    USER_ACTION -->|Dismiss| DISMISS[Toast Dismissed]
    USER_ACTION -->|Ignore| AUTO[Auto-Dismiss 5s]

    DEEP_LINK --> SCREEN{Target Screen}
    SCREEN -->|Confirmed| APPT_DETAIL[Appointment Detail]
    SCREEN -->|No Match| NO_MATCH[No Match Screen]
    SCREEN -->|Cancelled| HISTORY[History Screen]

    APPT_DETAIL --> DONE
    NO_MATCH --> DONE
    HISTORY --> DONE
    DISMISS --> DONE
    AUTO --> DONE([Notification Handled])

    style DETECT fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    style DONE fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: News & Content (J7)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Tap bell icon on Home | Show Notifications Center | - | Screen loads |
| 2 | Tap "News Feed" tab | Show news content | - | Content displays |
| 3 | View Short Guides carousel | Display video cards | - | Carousel shows |
| 4 | View Featured Story | Display featured card | - | Card shows |
| 5 | View Latest Health News | Display article cards | - | Articles show |
| 6 | Tap article | Show article detail | - | Article opens |
| 7 | Read article | Display full content | - | Content readable |
| 8 | (Optional) Share/Save | Trigger action | - | Action complete |
| 9 | Back button | Return to News Feed tab | - | Tab preserved |

### Flow Diagram

```mermaid
flowchart TD
    START([Want Health Content]) --> HOME[Home Screen]
    HOME --> BELL[Tap Bell Icon]

    subgraph NOTIFICATIONS["Notifications Center"]
        BELL --> TABS{Select Tab}
        TABS -->|Updates| UPDATES[Notifications Tab]
        TABS -->|News| NEWS[News Feed Tab]
    end

    subgraph NEWS_FEED["News Feed Content"]
        NEWS --> GUIDES[Short Guides Carousel]
        NEWS --> FEATURED[Featured Story Card]
        NEWS --> LATEST[Latest Health News]
        LATEST --> ARTICLE_CARDS[Article Cards]
    end

    ARTICLE_CARDS --> SELECT[Tap Article]

    subgraph ARTICLE["Article Detail"]
        SELECT --> DETAIL[Article Detail Screen]
        DETAIL --> HERO[Hero Image]
        DETAIL --> CONTENT[Article Content]
        DETAIL --> TAKEAWAY[Key Takeaway]
        DETAIL --> TAGS[Related Topics]
        DETAIL --> ACTIONS{Actions}
        ACTIONS -->|Share| SHARE[Share Article]
        ACTIONS -->|Save| SAVE[Save Article]
    end

    SHARE --> BACK
    SAVE --> BACK
    BACK[Back Button] --> NEWS

    style START fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow: Home Screen (J8)

### Flow Steps

| Step | User Action | System Response | Objects Modified | Success Criteria |
|------|-------------|-----------------|------------------|------------------|
| 1 | Open app | Load home screen | - | Screen loads |
| 2 | View greeting | Display personalized greeting | - | Greeting shows |
| 3 | View Quick Actions | Show Book, Family shortcuts | - | Actions display |
| 4 | View Pending Stack | Show swipeable appointments | - | Stack displays |
| 5 | Swipe appointment cards | Navigate through pending | - | Cards swipe |
| 6 | Tap appointment | Navigate to detail | - | Detail opens |
| 7 | View Latest Health News | Show article previews | - | News displays |
| 8 | Tap quick action | Navigate to feature | - | Feature opens |

### Flow Diagram

```mermaid
flowchart TD
    START([Open App]) --> LOAD[Load Home Screen]

    subgraph HOME_SCREEN["Home Screen"]
        LOAD --> GREETING[Personalized Greeting]
        GREETING --> SECTIONS[Display Sections]

        subgraph CONTENT["Home Content"]
            SECTIONS --> QUICK[Quick Actions]
            SECTIONS --> FOCUS[Today's Focus - Verified Only]
            SECTIONS --> PENDING[Swipeable Pending Stack]
            SECTIONS --> NEWS[Latest Health News]
        end
    end

    subgraph ACTIONS["User Actions"]
        QUICK --> Q_TAP{Tap Quick Action}
        Q_TAP -->|Book| BOOK_FLOW([Booking Type Screen])
        Q_TAP -->|Family| FAMILY([Family Members])

        PENDING --> SWIPE[Swipe Cards]
        SWIPE --> APPT_TAP[Tap Appointment]
        APPT_TAP --> APPT_DETAIL([Appointment Detail])

        NEWS --> NEWS_TAP[Tap Article]
        NEWS_TAP --> ARTICLE([Article Detail])

        FOCUS --> FOCUS_TAP[Tap Focus Card]
        FOCUS_TAP --> APPT_DETAIL
    end

    style START fill:#000000,stroke:#000000,color:#ffffff
```

---

## Flow Metrics

| Flow | Primary Metric | Target | Fallback Metric |
|------|----------------|--------|-----------------|
| Registration | Completion rate | >90% | Time to complete &lt;1 min |
| Profile | Profile completion rate | >70% | Fields completed |
| Fast-Lane Booking | Match success rate | >75% | Time to match &lt;20s |
| Specialty Booking | Booking completion rate | >60% | Time to book &lt;3 min |
| Doctor Booking | Booking completion rate | >65% | Search success rate |
| Reschedule | Reschedule completion rate | >80% | Time to reschedule &lt;1 min |
| Book Again | Rebook conversion rate | >50% | Alternative selection rate |
| History | Page views per session | >2 | Status filter usage |
| Notifications | Toast tap-through rate | >30% | Auto-dismiss rate |
| News Feed | Article read rate | >25% | Scroll depth |

---

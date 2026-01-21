# Scope for Exploration: Telemedicine (Telemedizin)

**Feature ID:** MEDA-TELE
**Version:** 1.0
**Last Updated:** 2026-01-20
**Status:** Draft

---

## 1. Overview

### Main Job to Be Done (JTBD)

> **When I have a health concern that doesn't require physical examination, help me consult a doctor via video immediately or at a scheduled time, so I can get professional advice without leaving home or waiting weeks for an appointment.**

### Purpose

Enable MedAlpha users to access telemedicine consultations through video calls, either on-demand ("Jetzt sprechen") or scheduled. The feature provides symptom pre-assessment, transparent wait times, secure video consultation, and seamless handoff to prescriptions when needed.

### Strategic Context

- **Competitive Gap:** TeleClinic (owned by DocMorris) has German-only UI, deceptive wait times, and support issues. Kry/Livi less established in Germany.
- **User Pain Points:** TeleClinic users report hour-long waits with "kept extending"; sick note delays causing employment issues; language barriers.
- **Partner:** Teleclinic provides telemedicine infrastructure (monitor for DocMorris conflict).

---

## 2. Personas & Priority

| Persona | Priority | Key Need |
|---------|----------|----------|
| Marc (42) | Primary | On-demand consultations for sports injuries, nutrition; 15-min professional advice; premium for speed |
| Sarah (34) | Primary | Quick consultations for children's minor ailments; avoid time off work |
| Helga (68) | Primary | Routine chronic condition follow-ups from home; avoid travel |
| Elena (23) | Secondary | Dermatology consultations; acne treatment; discreet access |
| Thomas (51) | Tertiary | Would appreciate simple symptom checker; values transparent pricing |

---

## 3. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          TELEMEDICINE USER FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────┐
                              │    Entry     │
                              │    Point     │
                              └──────────────┘
                                     │
                      ┌──────────────┴──────────────┐
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │  JETZT       │              │   TERMIN     │
               │  SPRECHEN    │              │   PLANEN     │
               │  (On-demand) │              │  (Scheduled) │
               └──────────────┘              └──────────────┘
                      │                              │
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │   Symptom    │              │   Symptom    │
               │   Check      │              │   Check      │
               └──────────────┘              └──────────────┘
                      │                              │
                      ▼                              ▼
               ┌──────────────┐              ┌──────────────┐
               │   Waiting    │              │   Slot       │
               │   Room       │              │   Selection  │
               └──────────────┘              └──────────────┘
                      │                              │
                      │                              ▼
                      │                       ┌──────────────┐
                      │                       │   Confirm    │
                      │                       │   Booking    │
                      │                       └──────────────┘
                      │                              │
                      │         ┌────────────────────┘
                      │         │ (At scheduled time)
                      ▼         ▼
               ┌──────────────────────┐
               │     VIDEO CALL       │
               │     (Consultation)   │
               └──────────────────────┘
                          │
                          ▼
               ┌──────────────────────┐
               │      SUMMARY         │
               │  (Diagnosis + Next)  │
               └──────────────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
    ┌───────────┐  ┌───────────┐  ┌───────────┐
    │ E-Rezept  │  │  Follow-  │  │   Done    │
    │  (if Rx)  │  │  up Appt  │  │           │
    └───────────┘  └───────────┘  └───────────┘
```

**Detailed Flow:**
```
Entry Point
    │
    ├──► [Home Tab] Tap "Telemedizin"
    │
    └──► [From Appointment] "Video-Sprechstunde" option
            │
            ▼
      ┌─────────────────────────────────────────────────────┐
      │                    MODE SELECTION                    │
      │─────────────────────────────────────────────────────│
      │  ┌─────────────────┐    ┌─────────────────┐        │
      │  │  JETZT SPRECHEN │    │  TERMIN PLANEN  │        │
      │  │─────────────────│    │─────────────────│        │
      │  │ "Arzt verbindet │    │ "Für später     │        │
      │  │  sich in wenigen│    │  einen Slot     │        │
      │  │  Minuten"       │    │  sichern"       │        │
      │  │                 │    │                 │        │
      │  │ [Video jetzt    │    │ [Slot wählen]   │        │
      │  │  starten]       │    │                 │        │
      │  └─────────────────┘    └─────────────────┘        │
      └─────────────────────────────────────────────────────┘
            │                          │
            ▼                          ▼
      ┌─────────────┐           ┌─────────────┐
      │  SPECIALTY  │           │  SPECIALTY  │
      │  SELECTION  │           │  SELECTION  │
      │─────────────│           │─────────────│
      │ • Allgemein │           │ • Same      │
      │ • Derma     │           │             │
      │ • Psycho    │           │             │
      │ • HNO       │           │             │
      │ • etc.      │           │             │
      └─────────────┘           └─────────────┘
            │                          │
            ▼                          ▼
      ┌─────────────┐           ┌─────────────┐
      │   SYMPTOM   │           │   SYMPTOM   │
      │   CHECK     │           │   CHECK     │
      │─────────────│           │─────────────│
      │ Progress:   │           │ Same flow   │
      │ 1/5 ████░░░ │           │             │
      │             │           │             │
      │ • Chips for │           │             │
      │   symptoms  │           │             │
      │ • Free text │           │             │
      │ • Duration  │           │             │
      │ • Severity  │           │             │
      └─────────────┘           └─────────────┘
            │                          │
            ▼                          │
      ┌─────────────┐                  │
      │  INSURANCE  │                  │
      │  VERIFY     │◄─────────────────┘
      │─────────────│
      │ Pre-filled  │
      │ from profile│
      │ Confirm or  │
      │ update      │
      └─────────────┘
            │
            ├──► [On-demand path]
            │         │
            │         ▼
            │   ┌─────────────┐
            │   │  WAITING    │
            │   │  ROOM       │
            │   │─────────────│
            │   │ Position: 3 │
            │   │ Est: 6 min  │
            │   │             │
            │   │ Tips:       │
            │   │ • ID ready  │
            │   │ • Mic/Cam   │
            │   │ • Quiet     │
            │   │             │
            │   │ [Cancel]    │
            │   └─────────────┘
            │         │
            │         ▼
            │   ┌─────────────┐
            │   │  READY      │
            │   │  PROMPT     │
            │   │─────────────│
            │   │ "Arzt ist   │
            │   │  bereit"    │
            │   │             │
            │   │ [Beitreten] │
            │   └─────────────┘
            │         │
            │         │
            └──► [Scheduled path]
                      │
                      ▼
                ┌─────────────┐
                │  SLOT       │
                │  SELECTION  │
                │─────────────│
                │ • Calendar  │
                │ • Time grid │
                │ • Duration  │
                └─────────────┘
                      │
                      ▼
                ┌─────────────┐
                │  CONFIRM    │
                │  BOOKING    │
                │─────────────│
                │ • Summary   │
                │ • Cost info │
                │ • [Confirm] │
                └─────────────┘
                      │
                      ▼
                ┌─────────────┐
                │  BOOKED     │
                │  CONFIRM    │
                │─────────────│
                │ • Details   │
                │ • Calendar  │
                │ • Reminder  │
                │   set       │
                └─────────────┘
                      │
                      │ (At scheduled time)
                      ▼
            ┌─────────────────────┐
            │     VIDEO CALL      │
            │─────────────────────│
            │ ┌─────────────────┐ │
            │ │                 │ │
            │ │  Doctor Video   │ │
            │ │                 │ │
            │ └─────────────────┘ │
            │ ┌───┐ ┌───┐ ┌───┐   │
            │ │Mic│ │Cam│ │End│   │
            │ └───┘ └───┘ └───┘   │
            │ Chat │ Flip │ More  │
            └─────────────────────┘
                      │
                      ▼
            ┌─────────────────────┐
            │      SUMMARY        │
            │─────────────────────│
            │ Dr. Julia Wagner    │
            │ 16. Jan 2026        │
            │                     │
            │ Diagnose:           │
            │ Allergische Reaktion│
            │                     │
            │ Empfehlung:         │
            │ [Text...]           │
            │                     │
            │ ┌─────────────────┐ │
            │ │ E-Rezept öffnen │ │◄─── If prescription issued
            │ └─────────────────┘ │
            │ ┌─────────────────┐ │
            │ │ Folgetermin     │ │◄─── If follow-up recommended
            │ └─────────────────┘ │
            │                     │
            │ Powered by          │
            │ Teleclinic          │
            └─────────────────────┘
```

---

## 4. User Stories & Acceptance Criteria

### Epic: Entry & Mode Selection

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-001 | As a user, I want to choose between immediate consultation or scheduling for later so that I can get care when it suits my situation. | 1. Two clear options presented: "Jetzt sprechen" and "Termin planen"<br>2. "Jetzt sprechen" shows current wait estimate (e.g., "~8 Minuten")<br>3. "Termin planen" shows next available slot (e.g., "Heute 16:30")<br>4. Both options explain what happens next<br>5. User can switch modes before entering symptom check |
| TELE-002 | As a user, I want to select a medical specialty so that I'm connected with an appropriate doctor. | 1. Specialty list includes: Allgemeinmedizin, Dermatologie, Psychologie, HNO, Innere Medizin, Gynäkologie, Urologie, Orthopädie<br>2. Default selection: "Allgemeinmedizin"<br>3. Specialty icons for visual recognition<br>4. "Nicht sicher? Allgemeinarzt hilft weiter" hint<br>5. Selection persists if user navigates back |

### Epic: Symptom Pre-Assessment

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-003 | As a user, I want to describe my symptoms before the call so that the doctor has context and our time is used efficiently. | 1. Progress indicator: "Schritt 2 von 5"<br>2. Symptom chips for common issues (Husten, Fieber, Kopfschmerz, etc.)<br>3. Multiple selections allowed<br>4. Free-text field: "Beschreiben Sie Ihre Symptome" (max 500 chars)<br>5. Data pre-shared with doctor before call |
| TELE-004 | As a user, I want to indicate symptom duration and severity so that the doctor can assess urgency. | 1. Duration options: "Heute", "1-3 Tage", "4-7 Tage", ">1 Woche"<br>2. Severity scale: "Leicht", "Mittel", "Stark"<br>3. Visual scale (1-10) with emoji indicators<br>4. Optional: "Hat sich verschlechtert?" toggle<br>5. Red flag warning for severe symptoms suggesting emergency |
| TELE-005 | As a user, I want to upload photos if relevant so that the doctor can see visual symptoms. | 1. "Foto hinzufügen" button in symptom check<br>2. Camera capture or gallery upload<br>3. Max 3 photos per consultation<br>4. Image preview with delete option<br>5. Privacy note: "Fotos werden nur für diese Konsultation verwendet"<br>6. Supported for dermatology and visible conditions |
| TELE-006 | As the system, I want to show emergency guidance if symptoms indicate danger so that users seek appropriate urgent care. | 1. Red flag symptoms trigger warning: chest pain, difficulty breathing, severe bleeding, etc.<br>2. Warning message: "Diese Symptome erfordern sofortige Hilfe"<br>3. Emergency number prominently displayed: 112<br>4. Option to continue if user confirms non-emergency<br>5. Logged for safety/compliance |

### Epic: Waiting Room (On-Demand)

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-007 | As a user, I want to see my queue position and estimated wait time so that I know what to expect and can plan accordingly. | 1. Queue position displayed: "Position 3 in der Warteschlange"<br>2. Estimated wait time: "Geschätzte Wartezeit: 6 Minuten"<br>3. Updates in real-time (every 30 seconds)<br>4. Honest estimates (conservative, not optimistic)<br>5. Notification when position changes |
| TELE-008 | As a user, I want to see preparation tips while waiting so that I'm ready when the doctor connects. | 1. Checklist displayed: ID ready, Mic/Camera check, Quiet environment<br>2. "Kamera testen" button to verify setup<br>3. Tips context-aware (e.g., "Betroffene Stelle freilegen" for dermatology)<br>4. Insurance card reminder if applicable<br>5. Previous prescriptions reminder |
| TELE-009 | As a user, I want to cancel my waiting position so that I can exit if circumstances change. | 1. "Abbrechen" button always visible<br>2. Confirmation: "Möchten Sie die Warteschlange verlassen?"<br>3. No penalty for cancellation<br>4. Quick re-entry option: "Erneut anmelden"<br>5. Symptom data retained for 30 minutes if re-entering |
| TELE-010 | As a user, I want to be notified when the doctor is ready so that I don't miss my turn. | 1. Push notification: "Ihr Arzt ist bereit"<br>2. Sound alert (even if app backgrounded)<br>3. 60-second window to join<br>4. "Beitreten" button prominent<br>5. If missed: Return to queue with priority or reschedule |

### Epic: Scheduled Booking

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-011 | As a user, I want to select a time slot for a scheduled video consultation so that I can plan around my commitments. | 1. Calendar view with available slots<br>2. Slots in 15-minute increments<br>3. Next 7 days displayed; swipe for more<br>4. Unavailable times grayed out<br>5. Time zone clearly shown |
| TELE-012 | As a user, I want to confirm my scheduled consultation so that I have a guaranteed slot. | 1. Confirmation screen: Date, Time, Specialty, Cost info<br>2. "Termin bestätigen" CTA<br>3. Add to calendar option<br>4. Confirmation email/push sent<br>5. Appears in "Meine Termine" |
| TELE-013 | As a user, I want to receive reminders before my scheduled consultation so that I don't miss it. | 1. Push notification 1 hour before<br>2. Push notification 10 minutes before<br>3. Reminder includes: "Beitreten" action button<br>4. Email reminder 24 hours before<br>5. Calendar event if added |
| TELE-014 | As a user, I want to join my scheduled consultation at the right time so that I can start on time. | 1. "Beitreten" button active 5 minutes before scheduled time<br>2. Countdown timer if early: "Ihr Termin beginnt in 3:45"<br>3. Auto-join option (goes straight to video when ready)<br>4. Doctor status: "Arzt ist bereit" or "Wartet auf Arzt"<br>5. Grace period: 10 minutes late before cancellation |

### Epic: Video Consultation

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-015 | As a user, I want a stable, high-quality video call so that I can communicate clearly with the doctor. | 1. Video resolution: 720p minimum; adaptive to bandwidth<br>2. Audio clear with noise cancellation<br>3. Connection quality indicator displayed<br>4. Automatic reconnection on brief disconnects<br>5. Fallback to audio-only if video fails |
| TELE-016 | As a user, I want to control my microphone and camera during the call so that I can manage my privacy. | 1. Mic mute/unmute button always visible<br>2. Camera on/off button always visible<br>3. Current state clearly indicated (icon + color)<br>4. Flip camera (front/back) button<br>5. Muted state shows "Mikrofon aus" to doctor |
| TELE-017 | As a user, I want to end the call when the consultation is complete so that I can proceed to next steps. | 1. Red "Auflegen" button always visible<br>2. Confirmation if ending before doctor: "Gespräch wirklich beenden?"<br>3. Call duration displayed<br>4. Automatic redirect to summary screen<br>5. Call data (duration, doctor) logged |
| TELE-018 | As a user, I want to use chat during the video call so that I can share information that's easier to type. | 1. Chat icon opens text panel<br>2. Can send text messages to doctor<br>3. Can send pre-uploaded images via chat<br>4. Doctor can share links/documents<br>5. Chat history included in summary |
| TELE-019 | As the system, I want to ensure calls are encrypted and private so that patient-doctor confidentiality is maintained. | 1. End-to-end encryption for video/audio<br>2. No recording without explicit consent<br>3. Peer-to-peer connection where possible<br>4. GDPR/DSGVO compliant data handling<br>5. Security badge visible: "Verschlüsselte Verbindung" |

### Epic: Post-Consultation

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-020 | As a user, I want to see a summary of my consultation so that I remember the diagnosis and recommendations. | 1. Summary screen after call ends<br>2. Shows: Doctor name, Date/Time, Duration<br>3. Diagnosis section (from doctor notes)<br>4. Recommendations/next steps<br>5. Summary saved to consultation history |
| TELE-021 | As a user, I want to access any prescriptions issued during the consultation so that I can get my medication. | 1. "E-Rezept öffnen" button if prescription issued<br>2. Direct navigation to E-Rezept feature<br>3. Prescription details pre-loaded<br>4. Multiple prescriptions supported<br>5. Notification if prescription issued after call |
| TELE-022 | As a user, I want to request a sick note if needed so that I can justify absence from work. | 1. "Arbeitsunfähigkeitsbescheinigung" option in summary<br>2. Doctor issues digitally (AU-Bescheinigung)<br>3. Available in app for download/share<br>4. Sent to employer (if configured)<br>5. Valid for insurance purposes |
| TELE-023 | As a user, I want to book a follow-up appointment from the summary so that I can continue care if recommended. | 1. "Folgetermin buchen" button if doctor recommends<br>2. Pre-selects same specialty<br>3. Option: Video or in-person<br>4. Booking flow with pre-filled context<br>5. Follow-up linked to original consultation |
| TELE-024 | As a user, I want to rate my consultation experience so that I can provide feedback. | 1. Star rating prompt (1-5) after summary<br>2. Optional comment field<br>3. Rating submitted anonymously<br>4. Skip option: "Später bewerten"<br>5. Used for doctor quality metrics |

### Epic: Accessibility & Edge Cases

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| TELE-025 | As Helga (68), I want the video interface to be simple and clear so that I can focus on talking to the doctor. | 1. Large, clear buttons (48dp+ touch targets)<br>2. Minimal controls visible (Mic, Cam, End)<br>3. Doctor video prominent; self-view small<br>4. High contrast UI<br>5. No complex gestures required |
| TELE-026 | As a user with limited German, I want to use the app in my language so that I can understand the process. | 1. Full English support for all telemedicine screens<br>2. Symptom chips in selected language<br>3. Doctor language preferences filterable<br>4. "English-speaking doctors available" indicator<br>5. No language switching mid-flow |
| TELE-027 | As a user, I want honest wait time estimates so that I can decide whether to wait or reschedule. | 1. Wait estimates based on actual queue data (not optimistic)<br>2. If wait exceeds 30 minutes: "Lange Wartezeit – Termin buchen?" suggestion<br>3. No "extending" wait times without explanation<br>4. If delay: "Verzögerung – neue Schätzung: X Min"<br>5. Option to switch to scheduled at any time |
| TELE-028 | As a user, I want my consultation to work even if I have poor internet so that I can still get care. | 1. Audio-only fallback if video fails<br>2. "Schlechte Verbindung" warning with tips<br>3. Auto-reconnect on drops (up to 30 sec)<br>4. Chat continues even if video drops<br>5. Consultation can continue via phone callback (emergency) |

---

## 5. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Video latency <200ms under normal conditions |
| Performance | Waiting room updates within 5 seconds of queue change |
| Availability | 99.9% uptime for video infrastructure |
| Accessibility | WCAG 2.1 AA; screen reader compatible |
| Localization | German (primary), English (launch) |
| Security | End-to-end encryption; GDPR/DSGVO compliant |
| Analytics | Track: Entry→Symptom→Wait→Call→Summary conversion |

---

## 6. Out of Scope (V1)

- Group video consultations (e.g., patient + family member)
- Specialist referral booking within telemedicine flow
- Integration with wearables for real-time vitals
- Screen sharing from patient to doctor
- Recording consultations for patient reference
- Asynchronous consultations (text-only, Zava-style)
- Priority queue for premium users

---

## 7. Dependencies

| Dependency | Owner | Status |
|------------|-------|--------|
| Teleclinic Video API | Partner | In progress |
| Teleclinic Doctor Network | Partner | Available |
| E-Prescription Integration | MedAlpha | Required |
| Push Notification Service | MedAlpha | Required |
| User Profile (insurance) | MedAlpha | Required |
| Sick Note API | Partner/gematik | To be confirmed |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Consultation completion rate | >80% | (Completed / Started) |
| Average wait time (on-demand) | <15 minutes | From queue join to call start |
| Wait time accuracy | Within 3 minutes | Estimated vs. actual |
| User satisfaction | >4.0/5 | Post-call rating |
| E-Rezept conversion | >30% | Consultations resulting in prescription |
| Repeat usage | >35% | Users who use telemedicine again within 90 days |

---

## 9. Open Questions

1. What is the SLA from Teleclinic for maximum wait times?
2. How do we handle the Teleclinic-DocMorris relationship (conflict of interest)?
3. Should we offer priority queue as a premium feature?
4. How do sick notes get transmitted to employers/insurance?
5. What happens if a doctor determines in-person visit is required mid-call?
6. Should we support specialist referrals within the telemedicine flow?

---

## 10. References

- [Product Context](../product-context-G.md)
- [Personas](../personas-details-G.json)
- [Social Listening Synthesis](./z.research/social-listening-synthesis.md) - TeleClinic complaints
- [Competitive Landscape](./z.research/competitive-landscape-research.md)

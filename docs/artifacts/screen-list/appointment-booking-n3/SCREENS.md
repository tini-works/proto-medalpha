---
artifact: screen-list
app: appointment-booking-n3
title: Screen List - Appointment Booking N3
summary: Canonical screen inventory (IDs, routes, components) for N3 booking.
created: 2026-01-27
updated: 2026-01-27
last_updated_by: codex
sources:
  - "[[0-APPOINTMENT-BOOKING-SCOPE]]"
  - "[[IA]]"
guidelines:
  - "[[visual-artifacts-rules]]"
---

# Screen List - Appointment Booking N3

**Related spec:** [[0-APPOINTMENT-BOOKING-SCOPE]]
**Related artifacts:** [[IA]] · [[1-dot-map]] · [[2-user-journeys]]

Implementation references:
- `apps/appointment-booking-N3/src/routes/paths.ts`
- `apps/appointment-booking-N3/src/App.tsx`

---

## Routed Screens (Canonical)

| Screen ID | Node ID | Screen title | Route | Component | Access |
|----------:|---------|--------------|-------|-----------|--------|
| SCR-001 | auth-welcome | Welcome | `/auth/welcome` | `apps/appointment-booking-N3/src/screens/auth/WelcomeScreen.tsx` | Public (redirect if authenticated) |
| SCR-002 | auth-register | Register | `/auth/register` | `apps/appointment-booking-N3/src/screens/auth/RegisterScreen.tsx` | Public (redirect if authenticated) |
| SCR-003 | auth-sign-in | Sign In | `/auth/sign-in` | `apps/appointment-booking-N3/src/screens/auth/SignInScreen.tsx` | Public (redirect if authenticated) |
| SCR-004 | auth-verify | Verify (Email) | `/auth/verify` | `apps/appointment-booking-N3/src/screens/auth/VerifyScreen.tsx` | Public |
| SCR-005 | auth-verify-identity | Verify Identity | `/auth/verify-identity` | `apps/appointment-booking-N3/src/screens/auth/VerifyIdentityScreen.tsx` | Auth required |
| SCR-010 | profile-complete | Profile Completion | `/profile/complete` | `apps/appointment-booking-N3/src/screens/profile/ProfileCompletionScreen.tsx` | Auth required |
| SCR-011 | profile-family | Family Members | `/profile/family` | `apps/appointment-booking-N3/src/screens/profile/FamilyMembersScreen.tsx` | Auth required |
| SCR-012 | profile-family-detail | Family Member Detail | `/profile/family/:id` | `apps/appointment-booking-N3/src/screens/profile/FamilyMemberDetailScreen.tsx` | Auth required |
| SCR-013 | profile-edit | Edit Profile | `/profile/edit` | `apps/appointment-booking-N3/src/screens/profile/EditProfileScreen.tsx` | Auth required |
| SCR-020 | home | Home | `/home` | `apps/appointment-booking-N3/src/screens/home/HomeScreen.tsx` | Auth required |
| SCR-030 | booking-search | Booking: Search | `/booking/search` | `apps/appointment-booking-N3/src/screens/booking/SearchScreen.tsx` | Auth + profile complete |
| SCR-031 | booking-location | Booking: Location | `/booking/location` | `apps/appointment-booking-N3/src/screens/booking/LocationScreen.tsx` | Auth + profile complete |
| SCR-032 | booking-insurance | Booking: Insurance | `/booking/insurance` | `apps/appointment-booking-N3/src/screens/booking/InsuranceScreen.tsx` | Auth + profile complete |
| SCR-033 | booking-results | Booking: Results | `/booking/results` | `apps/appointment-booking-N3/src/screens/booking/ResultsScreen.tsx` | Auth + profile complete |
| SCR-034 | booking-doctor | Booking: Doctor Profile | `/booking/doctor/:id` | `apps/appointment-booking-N3/src/screens/booking/DoctorProfileScreen.tsx` | Auth + profile complete |
| SCR-035 | booking-reviews | Booking: Reviews | `/booking/doctor/:id/reviews` | `apps/appointment-booking-N3/src/screens/booking/ReviewsScreen.tsx` | Auth + profile complete |
| SCR-036 | booking-slots | Booking: Slot Selection | `/booking/doctor/:id/slots` | `apps/appointment-booking-N3/src/screens/booking/SlotSelectionScreen.tsx` | Auth + profile complete |
| SCR-037 | booking-confirm | Booking: Confirm | `/booking/confirm` | `apps/appointment-booking-N3/src/screens/booking/ConfirmScreen.tsx` | Auth + profile complete |
| SCR-038 | booking-success | Booking: Success | `/booking/success` | `apps/appointment-booking-N3/src/screens/booking/SuccessScreen.tsx` | Auth + profile complete |
| SCR-040 | history | History | `/history` | `apps/appointment-booking-N3/src/screens/history/HistoryScreen.tsx` | Auth + profile complete |
| SCR-041 | history-detail | History: Item Detail | `/history/:id` | `apps/appointment-booking-N3/src/screens/history/AppointmentDetailScreen.tsx` | Auth + profile complete |
| SCR-042 | appointment-detail | Appointment Detail | `/appointments/:id` | `apps/appointment-booking-N3/src/screens/appointments/AppointmentDetailScreen.tsx` | Auth required |
| SCR-050 | reschedule-suggested | Reschedule: Suggested Slots | `/reschedule/:id` | `apps/appointment-booking-N3/src/screens/reschedule/SuggestedSlotsScreen.tsx` | Auth + profile complete |
| SCR-051 | reschedule-reason | Reschedule: Reason | `/reschedule/:id/reason` | `apps/appointment-booking-N3/src/screens/reschedule/RescheduleReasonScreen.tsx` | Auth + profile complete |
| SCR-052 | reschedule-confirm | Reschedule: Confirm | `/reschedule/:id/confirm` | `apps/appointment-booking-N3/src/screens/reschedule/RescheduleConfirmScreen.tsx` | Auth + profile complete |
| SCR-053 | reschedule-success | Reschedule: Success | `/reschedule/:id/success` | `apps/appointment-booking-N3/src/screens/reschedule/RescheduleSuccessScreen.tsx` | Auth + profile complete |
| SCR-060 | book-again-context | Book Again: Context | `/book-again/:id` | `apps/appointment-booking-N3/src/screens/book-again/BookAgainContextScreen.tsx` | Auth + profile complete |
| SCR-061 | book-again-alternatives | Book Again: Alternatives | `/book-again/:id/alternatives` | `apps/appointment-booking-N3/src/screens/book-again/BookAgainAlternativesScreen.tsx` | Auth + profile complete |
| SCR-070 | assistant | Assistant | `/assistant` | `apps/appointment-booking-N3/src/screens/assistant/AssistantScreen.tsx` | Auth + profile complete |
| SCR-071 | assistant-voice | Voice Assistant | `/assistant/voice` | `apps/appointment-booking-N3/src/screens/assistant/VoiceAssistantScreen.tsx` | Auth + profile complete |
| SCR-080 | settings | Settings | `/settings` | `apps/appointment-booking-N3/src/screens/settings/SettingsScreen.tsx` | Auth required |
| SCR-081 | settings-notifications | Notifications | `/settings/notifications` | `apps/appointment-booking-N3/src/screens/settings/NotificationsScreen.tsx` | Auth required |
| SCR-082 | settings-language | Language | `/settings/language` | `apps/appointment-booking-N3/src/screens/settings/LanguageScreen.tsx` | Auth required |
| SCR-083 | settings-privacy | Privacy & Data | `/settings/privacy` | `apps/appointment-booking-N3/src/screens/settings/PrivacyDataScreen.tsx` | Auth required |
| SCR-084 | settings-faq | FAQ | `/settings/faq` | `apps/appointment-booking-N3/src/screens/settings/FAQScreen.tsx` | Auth required |
| SCR-085 | settings-contact | Contact Support | `/settings/contact-support` | `apps/appointment-booking-N3/src/screens/settings/ContactSupportScreen.tsx` | Auth required |
| SCR-086 | settings-help | Help Centre | `/settings/help-centre` | `apps/appointment-booking-N3/src/screens/settings/HelpCentreScreen.tsx` | Auth required |

---

## Unrouted Screens (Present in Code, Not Wired in `App.tsx`)

These screens exist in the repo but are not currently reachable via routes:

| Component | Note |
|----------|------|
| `apps/appointment-booking-N3/src/screens/assistant/RecommendationsScreen.tsx` | Likely intended as an assistant sub-step. |
| `apps/appointment-booking-N3/src/screens/assistant/AssistantConfirmScreen.tsx` | Likely intended as an assistant confirmation step. |
| `apps/appointment-booking-N3/src/screens/assistant/AssistantDoctorProfileScreen.tsx` | Likely intended as assistant-linked doctor details. |

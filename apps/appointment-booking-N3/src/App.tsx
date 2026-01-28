import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './state'
import { RequireAuth, RequireProfileComplete, RedirectIfAuthenticated, PATHS } from './routes'
import { useI18nSync } from './hooks/useI18nSync'

// Auth screens
import { WelcomeScreen, RegisterScreen, SignInScreen, VerifyScreen, VerifyIdentityScreen, ForgotPasswordScreen, ResetPasswordScreen } from './screens/auth'

// Profile screens
import {
  ProfileCompletionScreen,
  FamilyMembersScreen,
  FamilyMemberDetailScreen,
  EditProfileScreen,
} from './screens/profile'

// Home screen
import { HomeScreen } from './screens/home'

// Notifications screen (updates view)
import UpdatesScreen from './screens/notifications/NotificationsScreen'

// News Feed screens
import { ArticleDetailScreen } from './screens/newsfeed'

// Booking screens
import {
  BookingTypeScreen,
  SearchScreen as BookingSearchScreen,
  LocationScreen as BookingLocationScreen,
  InsuranceScreen as BookingInsuranceScreen,
  ResultsScreen as BookingResultsScreen,
  DoctorProfileScreen,
  ReviewsScreen as BookingReviewsScreen,
  SlotSelectionScreen,
  ConfirmScreen as BookingConfirmScreen,
  SuccessScreen as BookingSuccessScreen,
  // Fast-Lane screens
  FastLaneCareRequestScreen,
  FastLaneMatchingScreen,
  FastLaneSuccessScreen,
  FastLaneNoMatchScreen,
} from './screens/booking'

// History screens
import { HistoryArchiveScreen, HistoryScreen, AppointmentDetailScreen as HistoryDetailScreen } from './screens/history'

// Reschedule screens
import { SuggestedSlotsScreen, RescheduleConfirmScreen, RescheduleSuccessScreen, RescheduleReasonScreen } from './screens/reschedule'

// Book Again screens
import { BookAgainContextScreen, BookAgainAlternativesScreen } from './screens/book-again'

// Assistant screens
import {
  AssistantScreen,
  VoiceAssistantScreen,
  RecommendationsScreen,
  AssistantDoctorProfileScreen,
  AssistantConfirmScreen,
} from './screens/assistant'

// Appointments screens
import { default as AppointmentDetailScreen } from './screens/appointments/AppointmentDetailScreen'

// Settings screens
import {
  SettingsScreen,
  NotificationsScreen,
  LanguageScreen,
  PrivacyDataScreen,
  FAQScreen,
  ContactSupportScreen,
  HelpCentreScreen,
} from './screens/settings'

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  )
}

// Inner component to use i18n hook within app state context
function AppContent() {
  // Synchronize i18next language with app state preferences
  useI18nSync()

  return (
    <BrowserRouter>
      <div className="app-shell relative">
        <Routes>
          <Route path="/" element={<Navigate to={PATHS.HOME} replace />} />

          {/* Auth */}
          <Route
            path={PATHS.AUTH_WELCOME}
            element={
              <RedirectIfAuthenticated>
                <WelcomeScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={PATHS.AUTH_REGISTER}
            element={
              <RedirectIfAuthenticated>
                <RegisterScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={PATHS.AUTH_SIGN_IN}
            element={
              <RedirectIfAuthenticated>
                <SignInScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route path={PATHS.AUTH_VERIFY} element={<VerifyScreen />} />
          <Route
            path={PATHS.AUTH_VERIFY_IDENTITY}
            element={
              <RequireAuth>
                <VerifyIdentityScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.AUTH_FORGOT_PASSWORD}
            element={
              <RedirectIfAuthenticated>
                <ForgotPasswordScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={PATHS.AUTH_RESET_PASSWORD}
            element={
              <RedirectIfAuthenticated>
                <ResetPasswordScreen />
              </RedirectIfAuthenticated>
            }
          />

          {/* Profile */}
          <Route
            path={PATHS.PROFILE_COMPLETE}
            element={
              <RequireAuth>
                <ProfileCompletionScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.PROFILE_FAMILY}
            element={
              <RequireAuth>
                <FamilyMembersScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.PROFILE_FAMILY_DETAIL}
            element={
              <RequireAuth>
                <FamilyMemberDetailScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.PROFILE_EDIT}
            element={
              <RequireAuth>
                <EditProfileScreen />
              </RequireAuth>
            }
          />

          {/* Home */}
          <Route
            path={PATHS.HOME}
            element={
              <RequireAuth>
                <HomeScreen />
              </RequireAuth>
            }
          />

          {/* Notifications */}
          <Route
            path={PATHS.NOTIFICATIONS}
            element={
              <RequireAuth>
                <UpdatesScreen />
              </RequireAuth>
            }
          />

          {/* News Feed */}
          <Route
            path={PATHS.ARTICLE_DETAIL}
            element={
              <RequireAuth>
                <ArticleDetailScreen />
              </RequireAuth>
            }
          />

          {/* Booking - Entry Point */}
          <Route
            path={PATHS.BOOKING}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingTypeScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Fast-Lane Flow */}
          <Route
            path={PATHS.FAST_LANE}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <FastLaneCareRequestScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.FAST_LANE_MATCHING}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <FastLaneMatchingScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.FAST_LANE_SUCCESS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <FastLaneSuccessScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.FAST_LANE_NO_MATCH}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <FastLaneNoMatchScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Book by Specialty Flow */}
          <Route
            path={PATHS.BOOKING_SPECIALTY}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingSearchScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_SEARCH}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingSearchScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_LOCATION}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingLocationScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_INSURANCE}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingInsuranceScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_RESULTS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingResultsScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_DOCTOR}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <DoctorProfileScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_REVIEWS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingReviewsScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_SLOTS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <SlotSelectionScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_CONFIRM}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingConfirmScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOKING_SUCCESS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingSuccessScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* History */}
          <Route
            path={PATHS.HISTORY}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <HistoryScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.HISTORY_DETAIL}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <HistoryDetailScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.HISTORY_ARCHIVE}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <HistoryArchiveScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Reschedule */}
          <Route
            path={PATHS.RESCHEDULE}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <SuggestedSlotsScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.RESCHEDULE_REASON}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <RescheduleReasonScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.RESCHEDULE_CONFIRM}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <RescheduleConfirmScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.RESCHEDULE_SUCCESS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <RescheduleSuccessScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Book Again */}
          <Route
            path={PATHS.BOOK_AGAIN}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookAgainContextScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.BOOK_AGAIN_ALTERNATIVES}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookAgainAlternativesScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Assistants */}
          <Route
            path={PATHS.ASSISTANT}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <AssistantScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ASSISTANT_VOICE}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <VoiceAssistantScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ASSISTANT_RECOMMENDATIONS}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <RecommendationsScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ASSISTANT_DOCTOR}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <AssistantDoctorProfileScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ASSISTANT_CONFIRM}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <AssistantConfirmScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* Appointments */}
          <Route
            path={PATHS.APPOINTMENT_DETAIL}
            element={
              <RequireAuth>
                <AppointmentDetailScreen />
              </RequireAuth>
            }
          />

          {/* Settings */}
          <Route
            path={PATHS.SETTINGS}
            element={
              <RequireAuth>
                <SettingsScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_NOTIFICATIONS}
            element={
              <RequireAuth>
                <NotificationsScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_LANGUAGE}
            element={
              <RequireAuth>
                <LanguageScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_PRIVACY}
            element={
              <RequireAuth>
                <PrivacyDataScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_FAQ}
            element={
              <RequireAuth>
                <FAQScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_CONTACT}
            element={
              <RequireAuth>
                <ContactSupportScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_HELP}
            element={
              <RequireAuth>
                <HelpCentreScreen />
              </RequireAuth>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

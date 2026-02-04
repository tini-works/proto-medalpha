import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppStateProvider } from './state'
import { RequireAuth, RequireProfileComplete, RedirectIfAuthenticated, PATHS } from './routes'
import { useI18nSync } from './hooks/useI18nSync'
import { NotificationToastProvider } from './contexts/NotificationToastContext'
import { DevModeProvider } from './contexts/DevModeContext'
import AppointmentStatusChangeNotifier from './components/notifications/AppointmentStatusChangeNotifier'
import ToastRenderer from './components/notifications/ToastRenderer'
import { DeviceFrame, DevToggleButton, SpecsDrawer } from './components/dev'

// Auth screens
import { WelcomeScreen, RegisterScreen, SignInScreen, VerifyScreen, VerifyIdentityScreen, ForgotPasswordScreen, ResetPasswordScreen, OAuthConsentScreen, InsuranceRequestScreen, OAuthErrorScreen } from './screens/auth'

// Profile screens
import {
  FamilyMembersScreen,
  AddFamilyMemberScreen,
  FamilyMemberDetailScreen,
  EditProfileScreen,
  VerifyPhoneScreen,
} from './screens/profile'

// Home screen
import { HomeScreen } from './screens/home'

// Notifications screen (updates view)
import UpdatesScreen from './screens/notifications/NotificationsScreen'

// News Feed screens
import { ArticleDetailScreen } from './screens/newsfeed'

// Booking screens
import {
  IntentCaptureScreen,
  SearchScreen as BookingSearchScreen,
  AvailabilityScreen as BookingAvailabilityScreen,
  LocationScreen as BookingLocationScreen,
  InsuranceScreen as BookingInsuranceScreen,
  ResultsScreen as BookingResultsScreen,
  DoctorProfileScreen,
  ReviewsScreen as BookingReviewsScreen,
  SlotsRedirectScreen,
  ConfirmScreen as BookingConfirmScreen,
  SuccessScreen as BookingSuccessScreen,
  RequestSentScreen,
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
  AddressEditScreen,
  InsuranceEditScreen,
  ChangePasswordScreen,
  BiometricsScreen,
} from './screens/settings'

// Privacy sub-screens (GDPR)
import {
  DataExportScreen,
  DataSharingScreen,
  ConsentManagementScreen,
} from './screens/settings/privacy'

// Legal screens
import {
  PrivacyPolicyScreen,
  TermsOfServiceScreen,
  ImpressumScreen,
  CookiePolicyScreen,
} from './screens/legal'

// Onboarding screens (identity verification flow)
import {
  ProfileSetupScreen,
  InsuranceSetupScreen,
  VerifyIntroScreen,
  CardScanScreen,
  VerificationSuccessScreen,
} from './screens/onboarding'

// Cookie consent banner
import { CookieConsentBanner } from './components'
import { recordNavigation } from './utils/navigation'

function BookingEntryRedirect() {
  const location = useLocation()
  return <Navigate to={PATHS.BOOKING_INTENT} replace state={location.state} />
}

function NavigationTracker() {
  const location = useLocation()

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`
    const skip = Boolean((location.state as any)?.skipInBackStack)
    if (!skip) recordNavigation(currentPath)
  }, [location.pathname, location.search])

  return null
}

export default function App() {
  return (
    <DevModeProvider>
      <NotificationToastProvider>
        <AppStateProvider>
          <AppContent />
          <AppointmentStatusChangeNotifier />
        </AppStateProvider>
      </NotificationToastProvider>
      <DevToggleButton />
    </DevModeProvider>
  )
}

// Inner component to use i18n hook within app state context
function AppContent() {
  // Synchronize i18next language with app state preferences
  useI18nSync()

  return (
    <DeviceFrame>
      <BrowserRouter>
        <NavigationTracker />
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
          {/* OAuth flow */}
          <Route
            path={PATHS.AUTH_OAUTH_CONSENT}
            element={
              <RedirectIfAuthenticated>
                <OAuthConsentScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={PATHS.AUTH_INSURANCE_REQUEST}
            element={
              <RedirectIfAuthenticated>
                <InsuranceRequestScreen />
              </RedirectIfAuthenticated>
            }
          />
          <Route
            path={PATHS.AUTH_OAUTH_ERROR}
            element={
              <RedirectIfAuthenticated>
                <OAuthErrorScreen />
              </RedirectIfAuthenticated>
            }
          />

          {/* Onboarding - Identity Verification Flow */}
          <Route
            path={PATHS.ONBOARDING_PROFILE}
            element={
              <RequireAuth>
                <ProfileSetupScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ONBOARDING_INSURANCE}
            element={
              <RequireAuth>
                <InsuranceSetupScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ONBOARDING_VERIFY}
            element={
              <RequireAuth>
                <VerifyIntroScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ONBOARDING_SCAN}
            element={
              <RequireAuth>
                <CardScanScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.ONBOARDING_SUCCESS}
            element={
              <RequireAuth>
                <VerificationSuccessScreen />
              </RequireAuth>
            }
          />

          {/* Profile - Legacy redirect */}
          <Route
            path={PATHS.PROFILE_COMPLETE}
            element={<Navigate to={PATHS.ONBOARDING_PROFILE} replace />}
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
            path={PATHS.PROFILE_FAMILY_ADD}
            element={
              <RequireAuth>
                <AddFamilyMemberScreen />
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
          <Route
            path={PATHS.PROFILE_VERIFY_PHONE}
            element={
              <RequireAuth>
                <VerifyPhoneScreen />
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

          {/* Booking - Entry Point (redirects to intent capture) */}
          <Route
            path={PATHS.BOOKING}
            element={<BookingEntryRedirect />}
          />

          {/* Intent-Based Smart Router (Approach A) */}
          <Route
            path={PATHS.BOOKING_INTENT}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <IntentCaptureScreen />
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

          {/* Book by Doctor Flow - redirect deprecated path to results */}
          <Route
            path={PATHS.BOOKING_DOCTOR_SEARCH}
            element={<Navigate to={PATHS.BOOKING_RESULTS} replace />}
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
            path={PATHS.BOOKING_CONSTRAINTS}
            element={<Navigate to={PATHS.BOOKING_SPECIALTY} replace />}
          />
          <Route
            path={PATHS.BOOKING_SYMPTOMS}
            element={<Navigate to={PATHS.BOOKING_AVAILABILITY} replace />}
          />
          <Route
            path={PATHS.BOOKING_AVAILABILITY}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <BookingAvailabilityScreen />
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
                  <SlotsRedirectScreen />
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
          <Route
            path={PATHS.BOOKING_REQUEST_SENT}
            element={
              <RequireAuth>
                <RequireProfileComplete>
                  <RequestSentScreen />
                </RequireProfileComplete>
              </RequireAuth>
            }
          />

          {/* History */}
          <Route
            path={PATHS.HISTORY}
            element={
              <RequireAuth>
                <HistoryScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.HISTORY_DETAIL}
            element={
              <RequireAuth>
                <HistoryDetailScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.HISTORY_ARCHIVE}
            element={
              <RequireAuth>
                <HistoryArchiveScreen />
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
          <Route
            path={PATHS.SETTINGS_PASSWORD}
            element={
              <RequireAuth>
                <ChangePasswordScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_BIOMETRICS}
            element={
              <RequireAuth>
                <BiometricsScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_ADDRESS}
            element={
              <RequireAuth>
                <AddressEditScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_INSURANCE}
            element={
              <RequireAuth>
                <InsuranceEditScreen />
              </RequireAuth>
            }
          />

          {/* Privacy sub-screens (GDPR) */}
          <Route
            path={PATHS.SETTINGS_PRIVACY_EXPORT}
            element={
              <RequireAuth>
                <DataExportScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_PRIVACY_SHARING}
            element={
              <RequireAuth>
                <DataSharingScreen />
              </RequireAuth>
            }
          />
          <Route
            path={PATHS.SETTINGS_PRIVACY_CONSENTS}
            element={
              <RequireAuth>
                <ConsentManagementScreen />
              </RequireAuth>
            }
          />

          {/* Legal pages - NO AUTH REQUIRED (GDPR transparency) */}
          <Route path={PATHS.LEGAL_PRIVACY} element={<PrivacyPolicyScreen />} />
          <Route path={PATHS.LEGAL_TERMS} element={<TermsOfServiceScreen />} />
          <Route path={PATHS.LEGAL_IMPRESSUM} element={<ImpressumScreen />} />
          <Route path={PATHS.LEGAL_COOKIES} element={<CookiePolicyScreen />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
        </Routes>
      </div>
      {/* Toast must render inside BrowserRouter so its Link has router context */}
      <ToastRenderer />
      {/* Cookie consent banner - TTDSG §25 compliance */}
      <CookieConsentBanner />
      {/* Dev mode specs drawer - needs router context for location */}
      <SpecsDrawer />
    </BrowserRouter>
    </DeviceFrame>
  )
}

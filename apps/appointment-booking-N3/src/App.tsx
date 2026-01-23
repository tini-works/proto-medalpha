import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './state'
import { RequireAuth, RequireProfileComplete, RedirectIfAuthenticated, PATHS } from './routes'

// Auth screens
import { WelcomeScreen, RegisterScreen, SignInScreen, VerifyScreen } from './screens/auth'

// Profile screens
import { ProfileCompletionScreen, FamilyMembersScreen, EditProfileScreen } from './screens/profile'

// Home screen
import { HomeScreen } from './screens/home'

// Booking screens
import {
  SearchScreen as BookingSearchScreen,
  LocationScreen as BookingLocationScreen,
  ResultsScreen as BookingResultsScreen,
  DoctorProfileScreen,
  SlotSelectionScreen,
  ConfirmScreen as BookingConfirmScreen,
  SuccessScreen as BookingSuccessScreen,
} from './screens/booking'

// History screens
import { HistoryScreen } from './screens/history'

// Settings screens
import { SettingsScreen, NotificationsScreen } from './screens/settings'

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <div className="app-shell">
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
                  <RequireProfileComplete>
                    <HomeScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            {/* Booking */}
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

            {/* Catch all */}
            <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppStateProvider>
  )
}

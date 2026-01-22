import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppStateProvider } from './state/AppState'
import { RequireAuth, RequireProfileComplete } from './routes/guards'

import WelcomeScreen from './screens/auth/WelcomeScreen'
import SignInScreen from './screens/auth/SignInScreen'
import RegisterScreen from './screens/auth/RegisterScreen'
import VerifyScreen from './screens/auth/VerifyScreen'

import ProfileCompletionScreen from './screens/profile/ProfileCompletionScreen'
import FamilyMembersScreen from './screens/profile/FamilyMembersScreen'

import HomeScreen from './screens/home/HomeScreen'
import SettingsScreen from './screens/settings/SettingsScreen'
import NotificationsScreen from './screens/settings/NotificationsScreen'

import BookingSearchScreen from './screens/booking/SearchScreen'
import BookingResultsScreen from './screens/booking/ResultsScreen'
import DoctorProfileScreen from './screens/booking/DoctorProfileScreen'
import CalendarScreen from './screens/booking/CalendarScreen'
import ConfirmScreen from './screens/booking/ConfirmScreen'
import SuccessScreen from './screens/booking/SuccessScreen'

import TeleEntryScreen from './screens/tele/TeleEntryScreen'
import TeleSymptomsScreen from './screens/tele/TeleSymptomsScreen'
import TeleWebViewScreen from './screens/tele/TeleWebViewScreen'
import TeleSummaryScreen from './screens/tele/TeleSummaryScreen'

import RxEntryScreen from './screens/rx/RxEntryScreen'
import RxOnlineScanScreen from './screens/rx/RxOnlineScanScreen'
import RxOnlineDetailsScreen from './screens/rx/RxOnlineDetailsScreen'
import RxOnlineCheckoutScreen from './screens/rx/RxOnlineCheckoutScreen'
import RxTrackingScreen from './screens/rx/RxTrackingScreen'
import RxOfflineSearchScreen from './screens/rx/RxOfflineSearchScreen'
import RxOfflineDetailScreen from './screens/rx/RxOfflineDetailScreen'

import StoresScreen from './screens/stores/StoresScreen'
import HistoryScreen from './screens/history/HistoryScreen'

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* Auth */}
            <Route path="/auth/welcome" element={<WelcomeScreen />} />
            <Route path="/auth/sign-in" element={<SignInScreen />} />
            <Route path="/auth/register" element={<RegisterScreen />} />
            <Route path="/auth/verify" element={<VerifyScreen />} />

            {/* Profile */}
            <Route
              path="/profile/complete"
              element={
                <RequireAuth>
                  <ProfileCompletionScreen />
                </RequireAuth>
              }
            />
            <Route
              path="/profile/family"
              element={
                <RequireAuth>
                  <FamilyMembersScreen />
                </RequireAuth>
              }
            />

            {/* Home + core tabs */}
            <Route
              path="/home"
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
              path="/booking/search"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <BookingSearchScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/booking/results"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <BookingResultsScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/booking/doctor/:id"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <DoctorProfileScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/booking/doctor/:id/calendar"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <CalendarScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/booking/confirm"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <ConfirmScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/booking/success"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <SuccessScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            {/* Telemedicine */}
            <Route
              path="/tele/entry"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <TeleEntryScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/tele/symptoms"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <TeleSymptomsScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/tele/webview"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <TeleWebViewScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/tele/summary"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <TeleSummaryScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            {/* ePrescription */}
            <Route
              path="/rx/entry"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxEntryScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/rx/online/scan"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxOnlineScanScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/rx/online/details"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxOnlineDetailsScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/rx/online/checkout"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxOnlineCheckoutScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/rx/tracking"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxTrackingScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            <Route
              path="/rx/offline/search"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxOfflineSearchScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />
            <Route
              path="/rx/offline/detail"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <RxOfflineDetailScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            {/* Stores */}
            <Route
              path="/stores"
              element={
                <RequireAuth>
                  <RequireProfileComplete>
                    <StoresScreen />
                  </RequireProfileComplete>
                </RequireAuth>
              }
            />

            {/* History */}
            <Route
              path="/history"
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
              path="/settings"
              element={
                <RequireAuth>
                  <SettingsScreen />
                </RequireAuth>
              }
            />
            <Route
              path="/settings/notifications"
              element={
                <RequireAuth>
                  <NotificationsScreen />
                </RequireAuth>
              }
            />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppStateProvider>
  )
}

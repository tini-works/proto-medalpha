import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import ResultsScreen from './screens/ResultsScreen'
import DoctorProfileScreen from './screens/DoctorProfileScreen'
import CalendarScreen from './screens/CalendarScreen'
import ConfirmScreen from './screens/ConfirmScreen'
import SuccessScreen from './screens/SuccessScreen'
import AppointmentsScreen from './screens/AppointmentsScreen'
import AppointmentDetailsScreen from './screens/AppointmentDetailsScreen'
import HistoryScreen from './screens/HistoryScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100%', paddingTop: '32px' }}>
        <Routes>
          {/* Entry & Search */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/results" element={<ResultsScreen />} />

          {/* Doctor */}
          <Route path="/doctor/:id" element={<DoctorProfileScreen />} />
          <Route path="/doctor/:id/calendar" element={<CalendarScreen />} />

          {/* Booking */}
          <Route path="/confirm" element={<ConfirmScreen />} />
          <Route path="/success" element={<SuccessScreen />} />

          {/* Appointments */}
          <Route path="/appointments" element={<AppointmentsScreen />} />
          <Route path="/appointments/history" element={<HistoryScreen />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsScreen />} />

          {/* Settings */}
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

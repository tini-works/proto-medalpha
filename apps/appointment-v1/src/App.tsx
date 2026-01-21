import { Navigate, Route, Routes } from 'react-router-dom'
import { AppointmentsRoute } from './routes/AppointmentsRoute'
import { AppointmentDetailsRoute } from './routes/AppointmentDetailsRoute'
import { ConfirmRoute } from './routes/ConfirmRoute'
import { DoctorRoute } from './routes/DoctorRoute'
import { HistoryRoute } from './routes/HistoryRoute'
import { ResultsRoute } from './routes/ResultsRoute'
import { ScheduleRoute } from './routes/ScheduleRoute'
import { SearchRoute } from './routes/SearchRoute'
import { SuccessRoute } from './routes/SuccessRoute'

// Business intent: define the app-level navigation skeleton; individual screens come next.
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/search" replace />} />
      <Route path="/search" element={<SearchRoute />} />
      <Route path="/results" element={<ResultsRoute />} />
      <Route path="/doctor/:doctorId" element={<DoctorRoute />} />
      <Route path="/doctor/:doctorId/schedule" element={<ScheduleRoute />} />
      <Route path="/confirm" element={<ConfirmRoute />} />
      <Route path="/success/:bookingId" element={<SuccessRoute />} />
      <Route path="/appointments" element={<AppointmentsRoute />} />
      <Route path="/appointments/:bookingId" element={<AppointmentDetailsRoute />} />
      <Route path="/history" element={<HistoryRoute />} />
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  )
}


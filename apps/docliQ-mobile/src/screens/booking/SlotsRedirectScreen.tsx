import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Page } from '../../components'
import { apiGetDoctor } from '../../data'
import { PATHS } from '../../routes'
import { useBooking } from '../../state'

export default function SlotsRedirectScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { selectDoctor, setBookingFlow } = useBooking()

  useEffect(() => {
    if (!id) {
      navigate(PATHS.BOOKING_RESULTS, { replace: true })
      return
    }

    apiGetDoctor(id)
      .then((doctor) => {
        setBookingFlow('by_doctor')
        selectDoctor(doctor)
        navigate(PATHS.BOOKING_AVAILABILITY, { replace: true, state: { from: (location.state as any)?.from ?? location.pathname, submitMode: 'confirm' } })
      })
      .catch(() => {
        navigate(PATHS.BOOKING_RESULTS, { replace: true })
      })
  }, [id, location.pathname, location.state, navigate, selectDoctor, setBookingFlow])

  return <Page safeBottom={false} />
}

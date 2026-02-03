import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../state'
import { PATHS } from '../routes'
import { useNotificationToast } from '../contexts/NotificationToastContext'

export function useDeletionExpiryCheck() {
  const navigate = useNavigate()
  const { pendingDeletion, completeDeletion } = useAppState()
  const { showToast } = useNotificationToast()

  useEffect(() => {
    if (!pendingDeletion) return

    const expiresAt = new Date(pendingDeletion.expiresAt).getTime()
    const now = Date.now()

    if (now >= expiresAt) {
      completeDeletion()
      showToast({
        title: 'Account Deleted',
        message: 'Your account has been permanently deleted.',
        type: 'info',
      })
      navigate(PATHS.AUTH_WELCOME, { replace: true })
    }
  }, [pendingDeletion, completeDeletion, showToast, navigate])
}

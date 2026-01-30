import type { Feedback, FeedbackRequest } from '../types'

const STORAGE_KEY_REQUESTS = 'docliq_feedback_requests'
const STORAGE_KEY_SUBMISSIONS = 'docliq_feedback_submissions'

export async function apiGetFeedbackRequests(): Promise<FeedbackRequest[]> {
  const stored = localStorage.getItem(STORAGE_KEY_REQUESTS)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function apiScheduleFeedbackRequest(appointment: {
  id: string
  doctorId: string
  doctorName: string
  specialty: string
  dateISO: string
  time: string
  forUserName: string
}): Promise<FeedbackRequest> {
  const requests = await apiGetFeedbackRequests()

  const newRequest: FeedbackRequest = {
    id: `fb_${Date.now()}`,
    appointmentId: appointment.id,
    doctorId: appointment.doctorId,
    doctorName: appointment.doctorName,
    specialty: appointment.specialty,
    dateISO: appointment.dateISO,
    time: appointment.time,
    forUserName: appointment.forUserName,
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    sent: false,
  }

  requests.push(newRequest)

  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests))
  return newRequest
}

export async function apiCancelFeedbackRequest(requestId: string): Promise<FeedbackRequest[]> {
  const requests = await apiGetFeedbackRequests()
  const updated = requests.filter((r) => r.id !== requestId)
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated))
  return updated
}

export async function apiMarkFeedbackSent(requestId: string): Promise<FeedbackRequest[]> {
  const requests = await apiGetFeedbackRequests()
  const updated = requests.map((r) =>
    r.id === requestId ? { ...r, sent: true } : r
  )
  localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(updated))
  return updated
}

export async function apiClearFeedbackRequests(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY_REQUESTS)
}

export async function apiSubmitFeedback(feedback: {
  appointmentId: string
  rating: number
  comment?: string
}): Promise<Feedback> {
  const stored = localStorage.getItem(STORAGE_KEY_SUBMISSIONS)
  const existing = stored ? JSON.parse(stored) : []

  const newFeedback: Feedback = {
    id: `sub_${Date.now()}`,
    appointmentId: feedback.appointmentId,
    rating: feedback.rating,
    comment: feedback.comment || '',
    createdAt: new Date().toISOString(),
  }

  existing.push(newFeedback)

  localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(existing))
  return newFeedback
}

export async function apiGetFeedbackSubmissions(): Promise<Feedback[]> {
  const stored = localStorage.getItem(STORAGE_KEY_SUBMISSIONS)
  if (!stored) return []

  try {
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function apiGetAppointmentFeedback(appointmentId: string): Promise<Feedback | null> {
  const submissions = await apiGetFeedbackSubmissions()
  return submissions.find((f) => f.appointmentId === appointmentId) || null
}

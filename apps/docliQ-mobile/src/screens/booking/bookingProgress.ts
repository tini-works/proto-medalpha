export type BookingFlow = 'fast_lane' | 'by_specialty' | 'by_doctor'

const FLOW_TOTAL_STEPS: Record<BookingFlow, number> = {
  fast_lane: 2,
  by_specialty: 3,
  by_doctor: 5,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function getStepLabelKey(step: number, totalSteps: number) {
  const safeTotal = clamp(totalSteps, 2, 5)
  const safeStep = clamp(step, 1, safeTotal)
  return `step${safeStep}Of${safeTotal}` as const
}

export function resolveBookingProgress(args: {
  bookingFlow: BookingFlow | null | undefined
  fallbackFlow: BookingFlow
  currentStep: number
}) {
  const flow = args.bookingFlow ?? args.fallbackFlow
  const totalSteps = FLOW_TOTAL_STEPS[flow]
  const currentStep = clamp(args.currentStep, 1, totalSteps)
  return {
    currentStep,
    totalSteps,
    stepLabelKey: getStepLabelKey(currentStep, totalSteps),
  }
}
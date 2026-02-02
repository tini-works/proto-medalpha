import { useState, useEffect, useCallback, useRef } from 'react'

interface UseCountdownOptions {
  initialSeconds: number
}

export function useCountdown({ initialSeconds }: UseCountdownOptions) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Countdown tick effect
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, secondsLeft])

  // Reset and restart countdown
  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds)
    setIsRunning(true)
  }, [initialSeconds])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    secondsLeft,
    isComplete: secondsLeft <= 0,
    reset,
  }
}

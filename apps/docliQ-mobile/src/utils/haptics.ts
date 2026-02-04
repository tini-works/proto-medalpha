const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
const supportsVibrate =
  typeof navigator !== 'undefined' && 'vibrate' in navigator

export const haptics = {
  success: () => {
    if (supportsVibrate && isAndroid) {
      navigator.vibrate([10, 50, 10])
    }
  },
  error: () => {
    if (supportsVibrate && isAndroid) {
      navigator.vibrate([50, 30, 50, 30, 50])
    }
  },
  light: () => {
    if (supportsVibrate && isAndroid) {
      navigator.vibrate(10)
    }
  },
}

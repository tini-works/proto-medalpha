const STACK_KEY = 'nav.stack'
const MAX_STACK = 50

function readStack(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STACK_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((p) => typeof p === 'string') : []
  } catch {
    return []
  }
}

function writeStack(stack: string[]) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(STACK_KEY, JSON.stringify(stack.slice(-MAX_STACK)))
}

export function recordNavigation(path: string) {
  const stack = readStack()
  const last = stack[stack.length - 1]
  if (last !== path) {
    stack.push(path)
    writeStack(stack)
  }
}

export function popBackPath(currentPath: string): string | null {
  const stack = readStack()

  while (stack.length > 0 && stack[stack.length - 1] === currentPath) {
    stack.pop()
  }

  let backPath: string | null = null
  while (stack.length > 0) {
    const candidate = stack.pop() ?? null
    if (candidate && candidate !== currentPath) {
      backPath = candidate
      break
    }
  }

  writeStack(stack)
  return backPath
}

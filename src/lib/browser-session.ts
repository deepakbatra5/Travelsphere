const AUTH_SESSION_KEY = 'travel-sphere-auth-session'

export function markAuthSessionActive() {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(AUTH_SESSION_KEY, 'active')
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(AUTH_SESSION_KEY)
}

export function hasActiveAuthSession() {
  if (typeof window === 'undefined') return false
  return window.sessionStorage.getItem(AUTH_SESSION_KEY) === 'active'
}

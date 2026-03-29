import type { UserProfile } from '../types'

const USERS_KEY = 'mindsaathi_users_v1'
const SESSION_KEY = 'mindsaathi_session_v1'

function safeParseUsers(raw: string | null): UserProfile[] {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((item): item is UserProfile => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.id === 'string' &&
        typeof item.email === 'string' &&
        Array.isArray(item.enrolledCourseIds) &&
        Array.isArray(item.completedCourseIds)
      )
    })
  } catch {
    return []
  }
}

export function loadUsers(): UserProfile[] {
  return safeParseUsers(localStorage.getItem(USERS_KEY))
}

export function saveUsers(users: UserProfile[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadSessionEmail(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSessionEmail(email: string): void {
  localStorage.setItem(SESSION_KEY, email)
}

export function clearSessionEmail(): void {
  localStorage.removeItem(SESSION_KEY)
}

import { demoUsers } from '../data/demoUsers'
import type { UserProfile } from '../types'

const USERS_KEY = 'mindsaathi_users_v1'
const SESSION_KEY = 'mindsaathi_session_v1'
const DEMO_SEEDED_KEY = 'mindsaathi_demo_seeded_v1'

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

function seedDemoUsersIfNeeded(existing: UserProfile[]): UserProfile[] {
  if (localStorage.getItem(DEMO_SEEDED_KEY) === 'true') {
    return existing
  }

  // Merge demo users — skip any whose email already exists
  const emailSet = new Set(existing.map((u) => u.email.toLowerCase()))
  const toAdd = demoUsers.filter((u) => !emailSet.has(u.email.toLowerCase()))
  const merged = [...existing, ...toAdd]

  localStorage.setItem(USERS_KEY, JSON.stringify(merged))
  localStorage.setItem(DEMO_SEEDED_KEY, 'true')

  return merged
}

export function loadUsers(): UserProfile[] {
  const existing = safeParseUsers(localStorage.getItem(USERS_KEY))
  return seedDemoUsersIfNeeded(existing)
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

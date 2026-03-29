import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { courses } from '../data/courses'
import {
  clearSessionEmail,
  loadSessionEmail,
  loadUsers,
  saveSessionEmail,
  saveUsers,
} from '../lib/storage'
import type {
  ProfilePayload,
  SignupPayload,
  TopicTag,
  UserProfile,
  UserRole,
} from '../types'

interface AuthActionResult {
  ok: boolean
  message: string
}

interface AuthContextValue {
  users: UserProfile[]
  user: UserProfile | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => AuthActionResult
  signup: (payload: SignupPayload) => AuthActionResult
  logout: () => void
  updateProfile: (payload: ProfilePayload) => AuthActionResult
  enrollInCourse: (courseId: string) => void
  completeCourse: (courseId: string) => void
  submitAssignment: (assignmentId: string) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function uniqueCourseIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

function uniqueAssignmentIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

function normalizeRole(role: unknown): UserRole {
  if (role === 'teacher' || role === 'admin') {
    return role
  }

  return 'student'
}

function normalizeUser(profile: UserProfile): UserProfile {
  return {
    ...profile,
    role: normalizeRole((profile as unknown as { role?: unknown }).role),
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    enrolledCourseIds: Array.isArray(profile.enrolledCourseIds)
      ? profile.enrolledCourseIds
      : [],
    completedCourseIds: Array.isArray(profile.completedCourseIds)
      ? profile.completedCourseIds
      : [],
    submittedAssignmentIds: Array.isArray(profile.submittedAssignmentIds)
      ? profile.submittedAssignmentIds
      : [],
  }
}

function buildStarterEnrollment(interests: TopicTag[]): string[] {
  const starter = ['stigma-myth-buster', 'support-a-friend']

  const interestMapped = courses
    .filter((course) => interests.includes(course.topic))
    .slice(0, 3)
    .map((course) => course.id)

  return uniqueCourseIds([...starter, ...interestMapped])
}

function generateUserId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `user-${Date.now()}`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(() =>
    loadUsers().map((item) => normalizeUser(item)),
  )
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionEmail = loadSessionEmail()
    if (!sessionEmail) {
      setUser(null)
      setLoading(false)
      return
    }

    const foundUser = users.find(
      (item) => normalizeEmail(item.email) === normalizeEmail(sessionEmail),
    )

    setUser(foundUser ? normalizeUser(foundUser) : null)
    setLoading(false)
  }, [users])

  function commitUsers(nextUsers: UserProfile[]): void {
    const normalizedUsers = nextUsers.map((item) => normalizeUser(item))
    setUsers(normalizedUsers)
    saveUsers(normalizedUsers)
  }

  function login(email: string, password: string): AuthActionResult {
    const cleanEmail = normalizeEmail(email)

    const foundUser = users.find(
      (item) =>
        normalizeEmail(item.email) === cleanEmail && item.password === password,
    )

    if (!foundUser) {
      return {
        ok: false,
        message: 'Invalid email or password.',
      }
    }

    setUser(normalizeUser(foundUser))
    saveSessionEmail(foundUser.email)

    return {
      ok: true,
      message: 'Welcome back.',
    }
  }

  function signup(payload: SignupPayload): AuthActionResult {
    const cleanEmail = normalizeEmail(payload.email)

    if (
      !payload.name.trim() ||
      !cleanEmail ||
      !payload.password ||
      !payload.school.trim() ||
      !payload.grade.trim()
    ) {
      return {
        ok: false,
        message: 'Please fill all required fields.',
      }
    }

    if (payload.password.length < 6) {
      return {
        ok: false,
        message: 'Password should be at least 6 characters.',
      }
    }

    if (payload.interests.length === 0) {
      return {
        ok: false,
        message: 'Select at least one interest area.',
      }
    }

    const existing = users.some(
      (item) => normalizeEmail(item.email) === cleanEmail,
    )

    if (existing) {
      return {
        ok: false,
        message: 'An account with this email already exists.',
      }
    }

    const newUser: UserProfile = {
      id: generateUserId(),
      name: payload.name.trim(),
      email: cleanEmail,
      password: payload.password,
      role: payload.role,
      school: payload.school.trim(),
      grade: payload.grade.trim(),
      interests: payload.interests,
      enrolledCourseIds: buildStarterEnrollment(payload.interests),
      completedCourseIds: [],
      submittedAssignmentIds: [],
      createdAt: new Date().toISOString(),
    }

    const nextUsers = [...users, newUser]
    commitUsers(nextUsers)

    setUser(normalizeUser(newUser))
    saveSessionEmail(newUser.email)

    return {
      ok: true,
      message: 'Account created successfully.',
    }
  }

  function logout(): void {
    setUser(null)
    clearSessionEmail()
  }

  function updateCurrentUser(nextUser: UserProfile): void {
    const normalizedUser = normalizeUser(nextUser)

    const nextUsers = users.map((item) =>
      item.id === normalizedUser.id ? normalizedUser : item,
    )

    commitUsers(nextUsers)
    setUser(normalizedUser)
    saveSessionEmail(normalizedUser.email)
  }

  function updateProfile(payload: ProfilePayload): AuthActionResult {
    if (!user) {
      return {
        ok: false,
        message: 'You must be logged in.',
      }
    }

    if (!payload.name.trim() || !payload.school.trim() || !payload.grade.trim()) {
      return {
        ok: false,
        message: 'Name, school, and grade are required.',
      }
    }

    if (payload.interests.length === 0) {
      return {
        ok: false,
        message: 'Select at least one interest area.',
      }
    }

    const nextUser: UserProfile = {
      ...user,
      name: payload.name.trim(),
      school: payload.school.trim(),
      grade: payload.grade.trim(),
      interests: payload.interests,
    }

    updateCurrentUser(nextUser)

    return {
      ok: true,
      message: 'Profile updated successfully.',
    }
  }

  function enrollInCourse(courseId: string): void {
    if (!user || user.enrolledCourseIds.includes(courseId)) {
      return
    }

    updateCurrentUser({
      ...user,
      enrolledCourseIds: [...user.enrolledCourseIds, courseId],
    })
  }

  function completeCourse(courseId: string): void {
    if (!user) {
      return
    }

    const enrolled = user.enrolledCourseIds.includes(courseId)
      ? user.enrolledCourseIds
      : [...user.enrolledCourseIds, courseId]

    const completed = uniqueCourseIds([...user.completedCourseIds, courseId])

    updateCurrentUser({
      ...user,
      enrolledCourseIds: enrolled,
      completedCourseIds: completed,
    })
  }

  function submitAssignment(assignmentId: string): void {
    if (!user || user.submittedAssignmentIds.includes(assignmentId)) {
      return
    }

    updateCurrentUser({
      ...user,
      submittedAssignmentIds: uniqueAssignmentIds([
        ...user.submittedAssignmentIds,
        assignmentId,
      ]),
    })
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      users,
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      signup,
      logout,
      updateProfile,
      enrollInCourse,
      completeCourse,
      submitAssignment,
    }),
    [users, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider.')
  }

  return ctx
}

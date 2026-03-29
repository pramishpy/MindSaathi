export type TopicTag =
  | 'anxiety'
  | 'depression'
  | 'bipolar'
  | 'schizophrenia'
  | 'stigma'
  | 'wellbeing'

export type UserRole = 'student' | 'teacher' | 'admin'

export type CourseLevel = 'Beginner' | 'Intermediate'

export interface CourseMyth {
  myth: string
  fact: string
}

export interface CourseGameOption {
  id: string
  label: string
  correct: boolean
  feedback: string
}

export interface CourseGame {
  title: string
  question: string
  options: CourseGameOption[]
}

export interface CourseResource {
  title: string
  description: string
  url: string
}

export interface CourseAssignment {
  id: string
  title: string
  instructions: string
  deliverable: string
  estimatedMinutes: number
}

export interface Course {
  id: string
  title: string
  topic: TopicTag
  level: CourseLevel
  duration: string
  summary: string
  whyItMatters: string
  videoEmbedUrl: string
  myths: CourseMyth[]
  activities: string[]
  assignments: CourseAssignment[]
  game: CourseGame
  resources: CourseResource[]
}

export interface UserProfile {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  school: string
  grade: string
  interests: TopicTag[]
  enrolledCourseIds: string[]
  completedCourseIds: string[]
  submittedAssignmentIds: string[]
  createdAt: string
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  role: UserRole
  school: string
  grade: string
  interests: TopicTag[]
}

export interface ProfilePayload {
  name: string
  school: string
  grade: string
  interests: TopicTag[]
}

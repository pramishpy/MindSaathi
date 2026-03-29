import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'

type AssignmentFilter = 'all' | 'pending' | 'submitted'

interface AssignmentRow {
  submissionId: string
  courseId: string
  courseTitle: string
  topicLabel: string
  assignmentId: string
  title: string
  instructions: string
  deliverable: string
  estimatedMinutes: number
  submitted: boolean
}

function toSubmissionId(courseId: string, assignmentId: string): string {
  return `${courseId}::${assignmentId}`
}

export default function AssignmentsPage() {
  const { user, submitAssignment } = useAuth()
  const [filter, setFilter] = useState<AssignmentFilter>('pending')

  const isStudent = user?.role === 'student'

  const submittedSet = useMemo(
    () => new Set(user?.submittedAssignmentIds ?? []),
    [user?.submittedAssignmentIds],
  )

  const enrolledCourseIds = user?.enrolledCourseIds ?? []

  const enrolledCourses = useMemo(
    () => courses.filter((course) => enrolledCourseIds.includes(course.id)),
    [enrolledCourseIds],
  )

  const assignmentRows = useMemo<AssignmentRow[]>(() => {
    return enrolledCourses.flatMap((course) => {
      return course.assignments.map((assignment) => {
        const submissionId = toSubmissionId(course.id, assignment.id)

        return {
          submissionId,
          courseId: course.id,
          courseTitle: course.title,
          topicLabel: TOPIC_LABELS[course.topic],
          assignmentId: assignment.id,
          title: assignment.title,
          instructions: assignment.instructions,
          deliverable: assignment.deliverable,
          estimatedMinutes: assignment.estimatedMinutes,
          submitted: submittedSet.has(submissionId),
        }
      })
    })
  }, [enrolledCourses, submittedSet])

  const pendingAssignments = assignmentRows.filter((item) => !item.submitted)
  const submittedAssignments = assignmentRows.filter((item) => item.submitted)

  const visibleAssignments = assignmentRows.filter((item) => {
    if (filter === 'pending') {
      return !item.submitted
    }

    if (filter === 'submitted') {
      return item.submitted
    }

    return true
  })

  if (!user) {
    return null
  }

  if (!isStudent) {
    return (
      <section className="panel">
        <h1>Assignments are for student accounts</h1>
        <p>
          Switch to a student account to submit course assignments and track
          completion progress.
        </p>
        <Link className="btn primary" to="/dashboard">
          Back to dashboard
        </Link>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">Student assignments</p>
          <h1>Practice tasks for each module</h1>
          <p>
            Complete short assignments to apply what you learned and build
            real-life support skills.
          </p>
        </div>
        <div className="metric-hero">
          <p>Assignment completion</p>
          <h2>
            {submittedAssignments.length}/{assignmentRows.length}
          </h2>
          <span>{pendingAssignments.length} pending tasks</span>
        </div>
      </section>

      {assignmentRows.length === 0 ? (
        <section className="panel empty-state-card">
          <h2>No assignments yet</h2>
          <p>
            Enroll in at least one course to unlock assignments and submit your
            work.
          </p>
          <Link className="btn primary" to="/courses">
            Browse courses
          </Link>
        </section>
      ) : (
        <>
          <section className="panel">
            <div className="stats-grid">
              <article className="stat-item">
                <span>Total assignments</span>
                <strong>{assignmentRows.length}</strong>
              </article>
              <article className="stat-item">
                <span>Pending</span>
                <strong>{pendingAssignments.length}</strong>
              </article>
              <article className="stat-item">
                <span>Submitted</span>
                <strong>{submittedAssignments.length}</strong>
              </article>
            </div>

            <div className="chip-filter-row" aria-label="Assignment status filters">
              <button
                type="button"
                className={`chip-filter ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button
                type="button"
                className={`chip-filter ${filter === 'submitted' ? 'active' : ''}`}
                onClick={() => setFilter('submitted')}
              >
                Submitted
              </button>
              <button
                type="button"
                className={`chip-filter ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
            </div>
          </section>

          <section className="panel">
            {visibleAssignments.length === 0 ? (
              <div className="empty-state-card">
                <h2>No assignments in this view</h2>
                <p>Switch filters to see other assignments.</p>
              </div>
            ) : (
              <div className="assignment-grid">
                {visibleAssignments.map((item) => (
                  <article key={item.submissionId} className="assignment-card">
                    <div className="course-chip-row">
                      <span className="chip">{item.topicLabel}</span>
                      <span className="chip subtle">{item.estimatedMinutes} min</span>
                      {item.submitted ? (
                        <span className="chip done">Submitted</span>
                      ) : (
                        <span className="chip progress">Pending</span>
                      )}
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.instructions}</p>

                    <div className="assignment-meta">
                      <strong>Deliverable</strong>
                      <p>{item.deliverable}</p>
                    </div>

                    <div className="button-row">
                      <Link className="btn ghost" to={`/courses/${item.courseId}`}>
                        Open module
                      </Link>
                      {item.submitted ? (
                        <button className="btn secondary" type="button" disabled>
                          Submission saved
                        </button>
                      ) : (
                        <button
                          className="btn primary"
                          type="button"
                          onClick={() => submitAssignment(item.submissionId)}
                        >
                          Mark as submitted
                        </button>
                      )}
                    </div>

                    <p className="muted-text">Module: {item.courseTitle}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

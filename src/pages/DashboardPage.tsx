import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const enrolledCourses = courses.filter((course) =>
    user.enrolledCourseIds.includes(course.id),
  )

  const completedCourses = courses.filter((course) =>
    user.completedCourseIds.includes(course.id),
  )

  const submittedAssignmentSet = new Set(user.submittedAssignmentIds)

  const enrolledAssignments = enrolledCourses.flatMap((course) =>
    course.assignments.map((assignment) => ({
      courseId: course.id,
      courseTitle: course.title,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      estimatedMinutes: assignment.estimatedMinutes,
      submissionId: `${course.id}::${assignment.id}`,
    })),
  )

  const submittedAssignments = enrolledAssignments.filter((item) =>
    submittedAssignmentSet.has(item.submissionId),
  )

  const pendingAssignments = enrolledAssignments.filter(
    (item) => !submittedAssignmentSet.has(item.submissionId),
  )

  const inProgressCourses = enrolledCourses.filter(
    (course) => !user.completedCourseIds.includes(course.id),
  )

  const completionRate =
    enrolledCourses.length > 0
      ? Math.round((completedCourses.length / enrolledCourses.length) * 100)
      : 0

  const recommendationPool = courses.filter(
    (course) =>
      user.interests.includes(course.topic) &&
      !user.completedCourseIds.includes(course.id),
  )

  const recommendedCourses =
    recommendationPool.length > 0
      ? recommendationPool.slice(0, 3)
      : courses
          .filter((course) => !user.completedCourseIds.includes(course.id))
          .slice(0, 3)

  const nextCourse = inProgressCourses[0] ?? recommendedCourses[0]
  const nextAssignment = pendingAssignments[0]

  const milestoneText =
    completedCourses.length === 0
      ? 'Complete your first module to unlock a streak.'
      : completionRate < 50
        ? 'Great start. One more module will boost your momentum.'
        : completionRate < 100
          ? 'You are close to finishing your active learning path.'
          : 'Excellent consistency. You finished all enrolled modules.'

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">Personalized dashboard</p>
          <h1>{user.name}, here is your next step</h1>
          <p>
            Built for {user.school}, {user.grade}. Learn at your pace and practice
            stigma-free support skills.
          </p>
        </div>
        <div className="metric-hero">
          <p>Course completion</p>
          <h2>{completionRate}%</h2>
          <div className="bar-track" role="progressbar" aria-valuenow={completionRate} aria-valuemin={0} aria-valuemax={100}>
            <div className="bar-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <span>{milestoneText}</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Quick start in 5 minutes</h2>
          <p className="muted-text">Four actions to move forward today.</p>
        </div>
        <div className="quick-action-grid">
          <article className="quick-action-card accent-teal">
            <p className="quick-action-icon">📚</p>
            <h3>{nextCourse ? 'Continue learning' : 'Pick your first module'}</h3>
            <p>
              {nextCourse
                ? `${nextCourse.title} is your best next module.`
                : 'Start with a short beginner module from the course library.'}
            </p>
            <Link className="btn primary" to={nextCourse ? `/courses/${nextCourse.id}` : '/courses'}>
              {nextCourse ? 'Continue module' : 'Browse modules'}
            </Link>
          </article>

          <article className="quick-action-card accent-coral">
            <p className="quick-action-icon">🎯</p>
            <h3>Play stigma challenge</h3>
            <p>Train your responses using short, classroom-safe mini games.</p>
            <Link className="btn secondary" to="/resources">
              Open challenge
            </Link>
          </article>

          <article className="quick-action-card accent-green">
            <p className="quick-action-icon">✅</p>
            <h3>{nextAssignment ? 'Complete your next assignment' : 'All assignments submitted'}</h3>
            <p>
              {nextAssignment
                ? `${nextAssignment.assignmentTitle} (${nextAssignment.estimatedMinutes} min)`
                : 'Great job. Open assignments to review your submitted work.'}
            </p>
            <Link className="btn primary" to={nextAssignment ? `/courses/${nextAssignment.courseId}` : '/assignments'}>
              {nextAssignment ? 'Open assignment' : 'View assignments'}
            </Link>
          </article>

          <article className="quick-action-card accent-slate">
            <p className="quick-action-icon">👤</p>
            <h3>Tune your interests</h3>
            <p>Update your profile so recommendations match what you need now.</p>
            <Link className="btn ghost" to="/profile">
              Update profile
            </Link>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="stats-grid">
          <article className="stat-item stat-teal">
            <span>Enrolled modules</span>
            <strong>{enrolledCourses.length}</strong>
          </article>
          <article className="stat-item stat-green">
            <span>Completed</span>
            <strong>{completedCourses.length}</strong>
          </article>
          <article className="stat-item stat-blue">
            <span>In progress</span>
            <strong>{inProgressCourses.length}</strong>
          </article>
          <article className="stat-item stat-purple">
            <span>Interest tracks</span>
            <strong>{user.interests.length}</strong>
          </article>
          <article className="stat-item stat-amber">
            <span>Assignments pending</span>
            <strong>{pendingAssignments.length}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Assignment progress</h2>
          <Link className="btn ghost" to="/assignments">
            Open all assignments
          </Link>
        </div>

        {enrolledAssignments.length === 0 ? (
          <p className="muted-text">Enroll in a module to unlock assignments.</p>
        ) : (
          <div className="card-grid">
            {pendingAssignments.slice(0, 3).map((item) => (
              <article key={item.submissionId} className="course-card compact">
                <div className="course-chip-row">
                  <span className="chip progress">Pending</span>
                  <span className="chip subtle">{item.estimatedMinutes} min</span>
                </div>
                <h3>{item.assignmentTitle}</h3>
                <p>{item.courseTitle}</p>
                <Link className="btn primary" to={`/courses/${item.courseId}`}>
                  Open module task
                </Link>
              </article>
            ))}

            {pendingAssignments.length === 0 ? (
              <article className="course-card compact">
                <div className="course-chip-row">
                  <span className="chip done">Submitted</span>
                </div>
                <h3>All caught up</h3>
                <p>
                  You submitted {submittedAssignments.length} assignment
                  {submittedAssignments.length === 1 ? '' : 's'} so far.
                </p>
                <Link className="btn ghost" to="/assignments">
                  Review submissions
                </Link>
              </article>
            ) : null}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Completed modules</h2>
          <Link className="btn ghost" to="/courses">
            Browse all courses
          </Link>
        </div>

        {completedCourses.length === 0 ? (
          <p className="muted-text">
            You have not completed a course yet. Start with a recommended module
            below.
          </p>
        ) : (
          <div className="card-grid">
            {completedCourses.map((course) => (
              <article key={course.id} className="course-card compact">
                <div className="course-chip-row">
                  <span className="chip done">Completed</span>
                  <span className="chip">{TOPIC_LABELS[course.topic]}</span>
                </div>
                <h3>{course.title}</h3>
                <p>{course.summary}</p>
                <Link className="btn ghost" to={`/courses/${course.id}`}>
                  Review module
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Recommended next modules</h2>
          <p className="muted-text">Picked from your interests and current progress.</p>
        </div>

        <div className="card-grid">
          {recommendedCourses.map((course) => (
            <article key={course.id} className="course-card">
              <div className="course-chip-row">
                <span className="chip">{TOPIC_LABELS[course.topic]}</span>
                <span className="chip subtle">{course.duration}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.summary}</p>
              <Link className="btn primary" to={`/courses/${course.id}`}>
                Start module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h3>My learning focus</h3>
          <ul className="bullet-list">
            {user.interests.map((interest) => (
              <li key={interest}>{TOPIC_LABELS[interest]}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>School action prompts</h3>
          <ul className="bullet-list">
            <li>Host a monthly myth-buster circle in classroom advisory time.</li>
            <li>Train student leaders on safe help-seeking language.</li>
            <li>Share one trusted support channel in every club meeting.</li>
          </ul>
          <Link className="btn ghost" to="/resources">
            Open resources toolkit
          </Link>
        </article>
      </section>
    </div>
  )
}

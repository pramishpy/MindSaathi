import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user, enrollInCourse, completeCourse, submitAssignment } = useAuth()

  const course = useMemo(
    () => courses.find((item) => item.id === courseId),
    [courseId],
  )

  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)

  if (!course) {
    return (
      <section className="panel">
        <h1>Course not found</h1>
        <p>The module you requested does not exist.</p>
        <Link className="btn primary" to="/courses">
          Back to courses
        </Link>
      </section>
    )
  }

  const activeCourse = course

  const enrolled = Boolean(user?.enrolledCourseIds.includes(activeCourse.id))
  const completed = Boolean(user?.completedCourseIds.includes(activeCourse.id))
  const submittedAssignments = new Set(user?.submittedAssignmentIds ?? [])

  const assignmentRows = activeCourse.assignments.map((assignment) => {
    const submissionId = `${activeCourse.id}::${assignment.id}`

    return {
      ...assignment,
      submissionId,
      submitted: submittedAssignments.has(submissionId),
    }
  })

  function checkAnswer() {
    const option = activeCourse.game.options.find(
      (item) => item.id === selectedAnswer,
    )
    if (!option) {
      setFeedback('Select an answer first.')
      setIsCorrect(false)
      return
    }

    setFeedback(option.feedback)
    setIsCorrect(option.correct)
  }

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">{TOPIC_LABELS[activeCourse.topic]}</p>
          <h1>{activeCourse.title}</h1>
          <p>{activeCourse.summary}</p>
        </div>
        <div className="metric-hero">
          <p>Module duration</p>
          <h2>{activeCourse.duration}</h2>
          <span>{activeCourse.level}</span>
        </div>
      </section>

      <section className="panel">
        <h2>Why this matters</h2>
        <p>{activeCourse.whyItMatters}</p>
      </section>

      <section className="panel">
        <h2>Embedded learning video</h2>
        <div className="video-wrap">
          <iframe
            title={activeCourse.title}
            src={activeCourse.videoEmbedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h2>Myths vs facts</h2>
          <div className="myth-grid">
            {activeCourse.myths.map((item, idx) => (
              <div className="myth-item" key={`${activeCourse.id}-${idx}`}>
                <h3>Myth</h3>
                <p>{item.myth}</p>
                <h3>Fact</h3>
                <p>{item.fact}</p>
              </div>
            ))}
          </div>
        </article>

        <article>
          <h2>Interactive game</h2>
          <p className="muted-text">{activeCourse.game.title}</p>
          <p>{activeCourse.game.question}</p>

          <div className="quiz-options">
            {activeCourse.game.options.map((option) => (
              <label key={option.id} className="check-chip block">
                <input
                  type="radio"
                  name="quiz-option"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(event) => setSelectedAnswer(event.target.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button className="btn primary" type="button" onClick={checkAnswer}>
              Check answer
            </button>
            <button className="btn ghost" type="button" onClick={() => setSelectedAnswer('')}>
              Reset
            </button>
          </div>

          {feedback ? (
            <p className={isCorrect ? 'success-text' : 'error-text'}>{feedback}</p>
          ) : null}

          <div className="button-row">
            {!enrolled ? (
              <button
                className="btn secondary"
                type="button"
                onClick={() => enrollInCourse(activeCourse.id)}
              >
                Enroll in this module
              </button>
            ) : null}

            {!completed ? (
              <button
                className="btn primary"
                type="button"
                onClick={() => completeCourse(activeCourse.id)}
              >
                Mark as completed
              </button>
            ) : (
              <span className="chip done">Completed</span>
            )}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Student assignments</h2>
          <Link className="btn ghost" to="/assignments">
            View all assignments
          </Link>
        </div>

        <div className="assignment-grid">
          {assignmentRows.map((assignment) => (
            <article key={assignment.submissionId} className="assignment-card">
              <div className="course-chip-row">
                <span className="chip subtle">{assignment.estimatedMinutes} min</span>
                {assignment.submitted ? (
                  <span className="chip done">Submitted</span>
                ) : (
                  <span className="chip progress">Pending</span>
                )}
              </div>

              <h3>{assignment.title}</h3>
              <p>{assignment.instructions}</p>

              <div className="assignment-meta">
                <strong>Deliverable</strong>
                <p>{assignment.deliverable}</p>
              </div>

              <div className="button-row">
                {!enrolled ? (
                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => enrollInCourse(activeCourse.id)}
                  >
                    Enroll to unlock
                  </button>
                ) : assignment.submitted ? (
                  <button className="btn secondary" type="button" disabled>
                    Submission saved
                  </button>
                ) : (
                  <button
                    className="btn primary"
                    type="button"
                    onClick={() => submitAssignment(assignment.submissionId)}
                  >
                    Mark as submitted
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h2>Hands-on activities</h2>
          <ul className="bullet-list">
            {activeCourse.activities.map((activity) => (
              <li key={activity}>{activity}</li>
            ))}
          </ul>
        </article>

        <article>
          <h2>Additional trusted resources</h2>
          <div className="resource-list">
            {activeCourse.resources.map((resource) => (
              <a
                key={resource.title}
                className="resource-item"
                href={resource.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </a>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

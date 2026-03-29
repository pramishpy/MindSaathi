import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'

const PRICING_TICKET_URL = '/support?issueType=pricing'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const interestMatchedCourses = courses.filter((course) =>
    user.interests.includes(course.topic),
  )

  const recommendedCourses =
    interestMatchedCourses.length > 0
      ? interestMatchedCourses.slice(0, 4)
      : courses.slice(0, 4)

  const coveredTopicCount = new Set(recommendedCourses.map((course) => course.topic)).size

  const assignmentTemplateCount = recommendedCourses.reduce(
    (sum, course) => sum + course.assignments.length,
    0,
  )

  const readinessScore = Math.min(
    100,
    35 + coveredTopicCount * 14 + recommendedCourses.length * 8,
  )

  const readinessText =
    readinessScore < 55
      ? 'Start with pricing details and pilot scope to build your approval case.'
      : readinessScore < 80
        ? 'You have a strong shortlist. Confirm budget and onboarding timeline next.'
        : 'Your shortlist is procurement-ready. Request pricing and align rollout dates.'

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">School buyer workspace</p>
          <h1>{user.school}: procurement dashboard</h1>
          <p>
            Tailored for school officials evaluating MindSaathi Schools. Review
            curriculum fit, estimate pilot scope, and request pricing information.
          </p>
        </div>
        <div className="metric-hero">
          <p>Procurement readiness</p>
          <h2>{readinessScore}%</h2>
          <div className="bar-track" role="progressbar" aria-valuenow={readinessScore} aria-valuemin={0} aria-valuemax={100}>
            <div className="bar-fill" style={{ width: `${readinessScore}%` }} />
          </div>
          <span>{readinessText}</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Buyer next steps</h2>
          <p className="muted-text">Four actions to move from evaluation to pilot approval.</p>
        </div>
        <div className="quick-action-grid">
          <article className="quick-action-card accent-teal">
            <p className="quick-action-icon">PRICING</p>
            <h3>Request pricing info</h3>
            <p>
              Send your student count and timeline to receive a pricing proposal
              for your school.
            </p>
            <Link className="btn primary" to={PRICING_TICKET_URL}>
              Open pricing request
            </Link>
          </article>

          <article className="quick-action-card accent-coral">
            <p className="quick-action-icon">DEMO</p>
            <h3>Book a product demo</h3>
            <p>Schedule a walkthrough for counselors, teachers, and leadership staff.</p>
            <Link className="btn secondary" to="/support?issueType=demo">
              Request demo
            </Link>
          </article>

          <article className="quick-action-card accent-green">
            <p className="quick-action-icon">PILOT</p>
            <h3>Review pilot curriculum</h3>
            <p>Validate module content, lesson duration, and assignment workload.</p>
            <Link className="btn primary" to="/courses">
              Review modules
            </Link>
          </article>

          <article className="quick-action-card accent-slate">
            <p className="quick-action-icon">RESOURCE</p>
            <h3>Prepare rollout plan</h3>
            <p>Use implementation resources to align communication and staff training.</p>
            <Link className="btn ghost" to="/resources">
              Open resources
            </Link>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="stats-grid">
          <article className="stat-item stat-teal">
            <span>Catalog modules</span>
            <strong>{courses.length}</strong>
          </article>
          <article className="stat-item stat-green">
            <span>Pilot shortlist</span>
            <strong>{recommendedCourses.length}</strong>
          </article>
          <article className="stat-item stat-blue">
            <span>Topics covered</span>
            <strong>{coveredTopicCount}</strong>
          </article>
          <article className="stat-item stat-purple">
            <span>Priority outcomes</span>
            <strong>{user.interests.length}</strong>
          </article>
          <article className="stat-item stat-amber">
            <span>Assignment templates</span>
            <strong>{assignmentTemplateCount}</strong>
          </article>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Recommended pilot modules</h2>
          <p className="muted-text">Selected from your school priorities.</p>
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
                Review module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h3>Priority outcomes for {user.school}</h3>
          <ul className="bullet-list">
            {user.interests.map((interest) => (
              <li key={interest}>{TOPIC_LABELS[interest]}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Procurement checklist</h3>
          <ul className="bullet-list">
            <li>Request pricing info with your expected student and staff seats.</li>
            <li>Book a demo for leadership, counselors, and implementation leads.</li>
            <li>Confirm pilot timeline, onboarding owner, and success metrics.</li>
          </ul>
          <Link className="btn ghost" to={PRICING_TICKET_URL}>
            Request pricing info
          </Link>
        </article>
      </section>
    </div>
  )
}

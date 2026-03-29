import { useEffect, useMemo, useState, type FormEvent } from 'react'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'
import type { TopicTag } from '../types'

const topicKeys = Object.keys(TOPIC_LABELS) as TopicTag[]

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState('')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<TopicTag[]>([])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    setName(user.name)
    setSchool(user.school)
    setGrade(user.grade)
    setInterests(user.interests)
  }, [user])

  const completedCourseTitles = useMemo(() => {
    if (!user) {
      return []
    }

    return courses
      .filter((course) => user.completedCourseIds.includes(course.id))
      .map((course) => course.title)
  }, [user])

  if (!user) {
    return null
  }

  function toggleInterest(topic: TopicTag) {
    setInterests((current) => {
      if (current.includes(topic)) {
        return current.filter((item) => item !== topic)
      }

      return [...current, topic]
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('')
    setError('')

    const result = updateProfile({
      name,
      school,
      grade,
      interests,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    setStatus(result.message)
  }

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">My account</p>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <p className="muted-text">Role: {user.role}</p>
        </div>
        <div className="metric-hero">
          <p>Member since</p>
          <h2>{new Date(user.createdAt).toLocaleDateString()}</h2>
          <span>{user.school}</span>
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h2>Edit profile</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                required
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label>
              School
              <input
                required
                type="text"
                value={school}
                onChange={(event) => setSchool(event.target.value)}
              />
            </label>

            <label>
              Grade/Class
              <input
                required
                type="text"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
              />
            </label>

            <fieldset className="interest-box">
              <legend>Interests</legend>
              <div className="interest-grid">
                {topicKeys.map((topic) => (
                  <label key={topic} className="check-chip">
                    <input
                      type="checkbox"
                      checked={interests.includes(topic)}
                      onChange={() => toggleInterest(topic)}
                    />
                    <span>{TOPIC_LABELS[topic]}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {status ? <p className="success-text">{status}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}

            <button className="btn primary" type="submit">
              Save profile
            </button>
          </form>
        </article>

        <article>
          <h2>Learning history</h2>
          <p className="muted-text">
            Enrolled: {user.enrolledCourseIds.length} | Completed:{' '}
            {user.completedCourseIds.length}
          </p>

          {completedCourseTitles.length === 0 ? (
            <p>No completed courses yet.</p>
          ) : (
            <ul className="bullet-list">
              {completedCourseTitles.map((title) => (
                <li key={title}>{title}</li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </div>
  )
}

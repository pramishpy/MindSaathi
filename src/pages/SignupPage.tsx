import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { TOPIC_LABELS } from '../data/courses'
import type { TopicTag, UserRole } from '../types'

const topicKeys = Object.keys(TOPIC_LABELS) as TopicTag[]

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<TopicTag[]>(['stigma'])
  const [error, setError] = useState('')

  const interestSet = useMemo(() => new Set(interests), [interests])

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
    setError('')

    const result = signup({
      name,
      email,
      password,
      role,
      school,
      grade,
      interests,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-screen single">
      <section className="auth-card form-card wide">
        <h1>Create student account</h1>
        <p>
          Build a profile so your dashboard can tailor courses, games, and mental
          health resources for your school context.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="grid-two">
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
              Email
              <input
                autoComplete="email"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label>
              I am registering as
              <select
                title="Select account role"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </label>

            <label>
              Grade/Class
              <input
                required
                type="text"
                placeholder="Example: Grade 9"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
              />
            </label>
          </div>

          <label>
            Password
            <input
              autoComplete="new-password"
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <fieldset className="interest-box">
            <legend>Interest areas for your personalized dashboard</legend>
            <div className="interest-grid">
              {topicKeys.map((topic) => (
                <label key={topic} className="check-chip">
                  <input
                    type="checkbox"
                    checked={interestSet.has(topic)}
                    onChange={() => toggleInterest(topic)}
                  />
                  <span>{TOPIC_LABELS[topic]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="btn primary" type="submit">
            Create account
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </div>
  )
}

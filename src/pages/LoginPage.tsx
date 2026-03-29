import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const result = login(email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="auth-screen">
      <section className="auth-card hero-card">
        <p className="eyebrow">School-first mental wellness platform</p>
        <h1>MindSaathi Schools</h1>
        <p>
          A culturally sensitive learning platform to reduce stigma, improve early
          support, and help students understand mental health conditions with facts.
        </p>
        <ul className="feature-list">
          <li>Personalized dashboard by student profile and progress</li>
          <li>Course modules with videos, games, and myth-busting drills</li>
          <li>Action-ready resources for safe help-seeking in school communities</li>
        </ul>

      </section>

      <section className="auth-card form-card">
        <h2>Login</h2>
        <p>Welcome back. Continue your anti-stigma learning journey.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
            Password
            <input
              autoComplete="current-password"
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="btn primary" type="submit">
            Login
          </button>
        </form>

        <p className="switch-link">
          New to MindSaathi? <Link to="/signup">Create your account</Link>
        </p>
      </section>
    </div>
  )
}

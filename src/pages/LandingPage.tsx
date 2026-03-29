import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

interface SupportTicket {
  id: string
  fullName: string
  email: string
  organization: string
  role: string
  phone: string
  issueType: string
  details: string
  createdAt: string
}

interface TicketFormState {
  fullName: string
  email: string
  organization: string
  role: string
  phone: string
  issueType: string
  details: string
}

const TICKETS_KEY = 'mindsaathi_support_tickets_v1'

const issueTypes = [
  'Platform demo request',
  'Pricing and licensing',
  'Technical onboarding',
  'School pilot setup',
  'Other support need',
]

const featureItems = [
  {
    title: 'Student-Centered Learning',
    description:
      'Interactive lessons with videos, myth-vs-fact activities, and practical assignments that teens can complete in class.',
    tag: 'Engagement',
  },
  {
    title: 'Early Support Signals',
    description:
      'Track progress and participation patterns so staff can identify low engagement early and act with supportive interventions.',
    tag: 'Prevention',
  },
  {
    title: 'Teacher and Admin Insights',
    description:
      'Use cohort analytics by school and grade to plan anti-stigma campaigns and evaluate learning outcomes over time.',
    tag: 'Analytics',
  },
  {
    title: 'Safe Help-Seeking Pathways',
    description:
      'Resource hub and guided workflows help students move from awareness to trusted support channels quickly and safely.',
    tag: 'Support',
  },
]

const initialFormState: TicketFormState = {
  fullName: '',
  email: '',
  organization: '',
  role: '',
  phone: '',
  issueType: issueTypes[0],
  details: '',
}

function createTicketId(): string {
  const random = Math.floor(Math.random() * 9000 + 1000)
  return `MS-${Date.now().toString().slice(-6)}-${random}`
}

function getStoredTicketCount(): number {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const raw = window.localStorage.getItem(TICKETS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

function saveTicket(ticket: SupportTicket): number {
  const raw = window.localStorage.getItem(TICKETS_KEY)
  const parsed = raw ? JSON.parse(raw) : []
  const existingTickets: SupportTicket[] = Array.isArray(parsed) ? parsed : []
  const nextTickets = [...existingTickets, ticket]

  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(nextTickets))
  return nextTickets.length
}

export default function LandingPage() {
  const [form, setForm] = useState<TicketFormState>(initialFormState)
  const [ticketCount, setTicketCount] = useState(() => getStoredTicketCount())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof TicketFormState>(
    key: K,
    value: TicketFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.details.trim().length < 25) {
      setError('Please provide at least 25 characters so our team can help accurately.')
      return
    }

    setIsSubmitting(true)

    try {
      const ticket: SupportTicket = {
        id: createTicketId(),
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        organization: form.organization.trim(),
        role: form.role.trim(),
        phone: form.phone.trim(),
        issueType: form.issueType,
        details: form.details.trim(),
        createdAt: new Date().toISOString(),
      }

      const nextCount = saveTicket(ticket)
      setTicketCount(nextCount)
      setSuccess(
        `Ticket ${ticket.id} submitted. Our support team will contact you at ${ticket.email}.`,
      )
      setForm(initialFormState)
    } catch {
      setError('Unable to submit your ticket right now. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="landing-page">
      <header className="landing-header panel">
        <img
          className="landing-logo"
          src="/mindsaathi-schools-logo.svg"
          alt="MindSaathi Schools"
        />

        <div className="landing-header-actions">
          <a className="landing-anchor" href="#features">
            Features
          </a>
          <a className="landing-anchor" href="#support">
            Support
          </a>
          <Link className="btn ghost" to="/login">
            Login
          </Link>
          <Link className="btn primary" to="/signup">
            Signup
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero panel">
          <div>
            <p className="eyebrow">Built for schools and youth programs</p>
            <h1>One platform to reduce mental health stigma and strengthen early support</h1>
            <p>
              MindSaathi Schools helps institutions deliver engaging mental health
              literacy, track student learning, and respond faster with trusted
              support pathways.
            </p>

            <div className="landing-hero-actions">
              <Link className="btn primary" to="/signup">
                Start your pilot
              </Link>
              <a className="btn ghost" href="#support">
                Request support ticket
              </a>
            </div>

            <div className="landing-kpi-grid">
              <article className="landing-kpi-card">
                <span>Role-based workflows</span>
                <strong>Students, Teachers, Admins</strong>
              </article>
              <article className="landing-kpi-card">
                <span>Learning format</span>
                <strong>Videos + Games + Assignments</strong>
              </article>
              <article className="landing-kpi-card">
                <span>Support readiness</span>
                <strong>Help pathways built in</strong>
              </article>
            </div>
          </div>

          <aside className="landing-highlight">
            <h2>Why teams choose MindSaathi</h2>
            <ul className="bullet-list">
              <li>Teen-friendly content that is easy to complete in short school periods.</li>
              <li>Localizable support pathways for safer help-seeking behavior.</li>
              <li>Clear analytics for planning classroom and institution interventions.</li>
              <li>Fast onboarding with ready-to-run modules and assignments.</li>
            </ul>
          </aside>
        </section>

        <section className="panel" id="features">
          <div className="section-head">
            <h2>Platform Features</h2>
            <p className="muted-text">Everything needed for a school-ready stigma reduction rollout.</p>
          </div>

          <div className="landing-feature-grid">
            {featureItems.map((item) => (
              <article key={item.title} className="landing-feature-card">
                <span className="chip subtle">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel landing-support" id="support">
          <article>
            <p className="eyebrow">Support Ticket</p>
            <h2>Talk to our onboarding and support team</h2>
            <p>
              Share your school information and support need. We will respond with
              a pilot setup plan, implementation guidance, or technical help.
            </p>
            <div className="landing-ticket-meta">
              <span>Total tickets submitted from this browser:</span>
              <strong>{ticketCount}</strong>
            </div>
          </article>

          <form className="landing-ticket-form" onSubmit={handleSubmit}>
            <div className="landing-form-grid">
              <label>
                Full name
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                />
              </label>

              <label>
                Work email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </label>

              <label>
                School or organization
                <input
                  required
                  type="text"
                  value={form.organization}
                  onChange={(event) => updateField('organization', event.target.value)}
                />
              </label>

              <label>
                Your role
                <input
                  required
                  type="text"
                  placeholder="Example: School Counselor"
                  value={form.role}
                  onChange={(event) => updateField('role', event.target.value)}
                />
              </label>

              <label>
                Phone number (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </label>

              <label>
                Support type
                <select
                  title="Select support type"
                  value={form.issueType}
                  onChange={(event) => updateField('issueType', event.target.value)}
                >
                  {issueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Ticket details
              <textarea
                required
                minLength={25}
                placeholder="Tell us your context, timeline, and what support you need."
                value={form.details}
                onChange={(event) => updateField('details', event.target.value)}
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}
            {success ? <p className="success-text">{success}</p> : null}

            <button className="btn primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit support ticket'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

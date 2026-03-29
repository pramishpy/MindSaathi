import { useState, type FormEvent } from 'react'

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
    icon: '📚',
  },
  {
    title: 'Early Support Signals',
    description:
      'Track progress and participation patterns so staff can identify low engagement early and act with supportive interventions.',
    tag: 'Prevention',
    icon: '📊',
  },
  {
    title: 'Teacher and Admin Insights',
    description:
      'Use cohort analytics by school and grade to plan anti-stigma campaigns and evaluate learning outcomes over time.',
    tag: 'Analytics',
    icon: '🏫',
  },
  {
    title: 'Safe Help-Seeking Pathways',
    description:
      'Resource hub and guided workflows help students move from awareness to trusted support channels quickly and safely.',
    tag: 'Support',
    icon: '🤝',
  },
]

const initialForm: TicketFormState = {
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
  const existing: SupportTicket[] = Array.isArray(parsed) ? parsed : []
  const next = [...existing, ticket]
  window.localStorage.setItem(TICKETS_KEY, JSON.stringify(next))
  return next.length
}

export default function SupportPage() {
  const [form, setForm] = useState<TicketFormState>(initialForm)
  const [ticketCount, setTicketCount] = useState(() => getStoredTicketCount())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField<K extends keyof TicketFormState>(key: K, value: TicketFormState[K]) {
    setForm((c) => ({ ...c, [key]: value }))
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
      setForm(initialForm)
    } catch {
      setError('Unable to submit right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      {/* Hero */}
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">Platform support</p>
          <h1>Features and support</h1>
          <p>
            Learn what MindSaathi Schools offers and get in touch with our onboarding team for
            pilot setup, technical help, or licensing.
          </p>
        </div>
        <div className="metric-hero">
          <p>Tickets submitted</p>
          <h2>{ticketCount}</h2>
          <span>from this device</span>
        </div>
      </section>

      {/* Platform features */}
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Platform overview</p>
            <h2>What MindSaathi Schools includes</h2>
          </div>
        </div>
        <div className="resources-feature-grid">
          {featureItems.map((item) => (
            <article key={item.title} className="resources-feature-card">
              <span className="resources-feature-icon">{item.icon}</span>
              <span className="chip subtle">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Support ticket */}
      <section className="panel resources-support-section">
        <div className="resources-support-grid">
          <div>
            <p className="eyebrow">Support ticket</p>
            <h2>Talk to our onboarding team</h2>
            <p>
              Share your school information and support need. We will respond with a pilot setup
              plan, implementation guidance, or technical help.
            </p>
            {ticketCount > 0 ? (
              <div className="ticket-meta">
                <span>Tickets submitted from this device</span>
                <strong>{ticketCount}</strong>
              </div>
            ) : null}
          </div>

          <form className="landing-ticket-form" onSubmit={handleSubmit}>
            <div className="landing-form-grid">
              <label>
                Full name
                <input
                  required
                  type="text"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </label>
              <label>
                Work email
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </label>
              <label>
                School or organization
                <input
                  required
                  type="text"
                  value={form.organization}
                  onChange={(e) => updateField('organization', e.target.value)}
                />
              </label>
              <label>
                Your role
                <input
                  required
                  type="text"
                  placeholder="e.g. School Counselor"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                />
              </label>
              <label>
                Phone (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </label>
              <label>
                Support type
                <select
                  title="Select support type"
                  value={form.issueType}
                  onChange={(e) => updateField('issueType', e.target.value)}
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
                onChange={(e) => updateField('details', e.target.value)}
              />
            </label>

            {error ? <p className="error-text">{error}</p> : null}
            {success ? <p className="success-text">{success}</p> : null}

            <button className="btn primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit support ticket'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

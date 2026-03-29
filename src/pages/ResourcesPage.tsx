import { useMemo, useState } from 'react'

interface StigmaChallengeItem {
  statement: string
  isStigma: boolean
  explanation: string
}

const challengeItems: StigmaChallengeItem[] = [
  {
    statement: 'Students with depression are just being lazy.',
    isStigma: true,
    explanation:
      'This is stigma. Depression affects energy, focus, and motivation as a real health condition.',
  },
  {
    statement: 'Asking for counseling support is a healthy and brave step.',
    isStigma: false,
    explanation: 'Correct. Help-seeking should be normalized and encouraged in schools.',
  },
  {
    statement: 'Mental illness can happen to anyone and recovery is possible.',
    isStigma: false,
    explanation: 'Correct. Recovery and symptom management are possible with support.',
  },
  {
    statement: 'People with schizophrenia are always violent.',
    isStigma: true,
    explanation: 'This is a harmful myth. Most people with schizophrenia are not violent.',
  },
]

const schoolResources = [
  {
    title: 'Crisis Text Line',
    description: 'Immediate support by text for emotional distress.',
    link: 'https://www.crisistextline.org/',
  },
  {
    title: '988 Lifeline',
    description: '24/7 crisis and suicide prevention support.',
    link: 'https://988lifeline.org/',
  },
  {
    title: 'Mental Health America',
    description: 'Youth-focused resources and mental health screening tools.',
    link: 'https://mhanational.org/',
  },
  {
    title: 'NAMI Teen and Young Adult HelpLine',
    description: 'Education and support navigation for students and families.',
    link: 'https://www.nami.org/help',
  },
]

export default function ResourcesPage() {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [awaitingNext, setAwaitingNext] = useState(false)

  const activeItem = challengeItems[step]
  const finished = step >= challengeItems.length

  const scoreLabel = useMemo(() => {
    if (score === challengeItems.length) return 'Excellent — you are a stigma-breaker leader.'
    if (score >= Math.ceil(challengeItems.length * 0.7))
      return 'Great work — your responses are strongly anti-stigma.'
    return 'Good start — review the explanations and try again.'
  }, [score])

  function handleAnswer(chooseStigma: boolean) {
    if (!activeItem || awaitingNext) return
    const correct = chooseStigma === activeItem.isStigma
    if (correct) setScore((c) => c + 1)
    setFeedback(`${correct ? 'Correct. ' : 'Not quite. '}${activeItem.explanation}`)
    setAwaitingNext(true)
  }

  function handleNext() {
    setStep((c) => c + 1)
    setFeedback('')
    setAwaitingNext(false)
  }

  function handleReset() {
    setStep(0)
    setScore(0)
    setFeedback('')
    setAwaitingNext(false)
  }

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">Resource hub for schools</p>
          <h1>Videos, games, and support tools</h1>
          <p>
            Use these practical resources to teach facts about mental health conditions and help
            students challenge false stigma narratives.
          </p>
        </div>
        <div className="metric-hero">
          <p>Stigma challenge score</p>
          <h2>
            {score}/{challengeItems.length}
          </h2>
          <span>Keep practicing anti-stigma communication.</span>
        </div>
      </section>

      <section className="panel support-strip" id="support-tools">
        <h2>Need support right now?</h2>
        <p>
          Reach a trusted adult, school counselor, or helpline quickly. Asking for support is
          always a strong step.
        </p>
        <div className="button-row">
          <a
            className="btn secondary"
            href="https://988lifeline.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open 988 Lifeline
          </a>
          <a
            className="btn ghost"
            href="https://www.crisistextline.org/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Open Crisis Text Line
          </a>
        </div>
        <p className="muted-text">
          If there is immediate danger, contact local emergency services and a nearby trusted adult
          now.
        </p>
      </section>

      <section className="panel">
        <h2>Featured classroom video</h2>
        <p className="muted-text">
          Use this video as a discussion starter during homeroom or advisory.
        </p>
        <div className="video-wrap">
          <iframe
            title="Mental health stigma in schools"
            src="https://www.youtube.com/embed/dxIDKZHW3-E"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h2>Stigma challenge game</h2>
          {finished ? (
            <div className="quiz-summary">
              <h3>Challenge complete</h3>
              <p>
                Score: {score}/{challengeItems.length}
              </p>
              <p>{scoreLabel}</p>
              <button className="btn primary" type="button" onClick={handleReset}>
                Play again
              </button>
            </div>
          ) : (
            <div className="quiz-block">
              <p className="muted-text">
                Question {step + 1} of {challengeItems.length}
              </p>
              <h3>{activeItem.statement}</h3>
              <div className="button-row">
                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => handleAnswer(true)}
                >
                  This is stigma
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => handleAnswer(false)}
                >
                  This is a supportive fact
                </button>
              </div>
              {feedback ? <p className="muted-text">{feedback}</p> : null}
              {awaitingNext ? (
                <button className="btn primary" type="button" onClick={handleNext}>
                  Next statement
                </button>
              ) : null}
            </div>
          )}
        </article>

        <article id="trusted-support">
          <h2>Trusted support resources</h2>
          <div className="resource-list">
            {schoolResources.map((resource) => (
              <a
                key={resource.title}
                className="resource-item"
                href={resource.link}
                target="_blank"
                rel="noreferrer"
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

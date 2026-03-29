import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'
import type { TopicTag } from '../types'

type CourseStatusFilter = 'all' | 'not-started' | 'in-progress' | 'completed'
type CourseSortMode = 'recommended' | 'shortest' | 'az'

const topicFilters: Array<TopicTag | 'all'> = [
  'all',
  'anxiety',
  'depression',
  'bipolar',
  'schizophrenia',
  'stigma',
  'wellbeing',
]

const statusFilters: Array<CourseStatusFilter> = [
  'all',
  'not-started',
  'in-progress',
  'completed',
]

const statusLabelMap: Record<CourseStatusFilter, string> = {
  all: 'All progress',
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
}

const sortLabelMap: Record<CourseSortMode, string> = {
  recommended: 'Recommended first',
  shortest: 'Shortest first',
  az: 'A to Z',
}

function getMinutes(duration: string): number {
  const value = Number.parseInt(duration, 10)
  return Number.isNaN(value) ? 999 : value
}

export default function CoursesPage() {
  const { user } = useAuth()

  const completedIds = user?.completedCourseIds ?? []
  const enrolledIds = user?.enrolledCourseIds ?? []
  const interestTags = user?.interests ?? []

  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<TopicTag | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('all')
  const [sortMode, setSortMode] = useState<CourseSortMode>('recommended')

  const completedSet = useMemo(() => new Set(completedIds), [completedIds])
  const enrolledSet = useMemo(() => new Set(enrolledIds), [enrolledIds])
  const interestSet = useMemo(() => new Set(interestTags), [interestTags])

  const filteredCourses = useMemo(() => {
    const queryLower = query.trim().toLowerCase()

    const filtered = courses.filter((course) => {
      const matchesTopic = topic === 'all' || course.topic === topic
      const matchesQuery =
        queryLower.length === 0
          ? true
          : `${course.title} ${course.summary} ${course.topic}`
              .toLowerCase()
              .includes(queryLower)

      const isCompleted = completedSet.has(course.id)
      const isEnrolled = enrolledSet.has(course.id)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'completed' && isCompleted) ||
        (statusFilter === 'in-progress' && isEnrolled && !isCompleted) ||
        (statusFilter === 'not-started' && !isEnrolled && !isCompleted)

      return matchesTopic && matchesQuery && matchesStatus
    })

    return filtered.sort((left, right) => {
      if (sortMode === 'az') {
        return left.title.localeCompare(right.title)
      }

      if (sortMode === 'shortest') {
        const durationDiff = getMinutes(left.duration) - getMinutes(right.duration)
        return durationDiff !== 0
          ? durationDiff
          : left.title.localeCompare(right.title)
      }

      const leftCompleted = completedSet.has(left.id)
      const rightCompleted = completedSet.has(right.id)

      if (leftCompleted !== rightCompleted) {
        return leftCompleted ? 1 : -1
      }

      const leftInProgress = enrolledSet.has(left.id)
      const rightInProgress = enrolledSet.has(right.id)

      if (leftInProgress !== rightInProgress) {
        return leftInProgress ? -1 : 1
      }

      const leftInterest = interestSet.has(left.topic)
      const rightInterest = interestSet.has(right.topic)

      if (leftInterest !== rightInterest) {
        return leftInterest ? -1 : 1
      }

      const durationDiff = getMinutes(left.duration) - getMinutes(right.duration)
      return durationDiff !== 0 ? durationDiff : left.title.localeCompare(right.title)
    })
  }, [query, topic, statusFilter, sortMode, completedSet, enrolledSet, interestSet])

  function resetFilters() {
    setQuery('')
    setTopic('all')
    setStatusFilter('all')
    setSortMode('recommended')
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <h1>Course Library</h1>
        <p>
          Find modules fast with quick topic chips and progress filters.
        </p>

        <div className="filter-row">
          <input
            placeholder="Search topic, condition, or skill"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <select
            title="Filter courses by topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value as TopicTag | 'all')}
          >
            {topicFilters.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All topics' : TOPIC_LABELS[item]}
              </option>
            ))}
          </select>
        </div>

        <div className="course-toolbar">
          <p className="muted-text">{filteredCourses.length} modules found.</p>
          <select
            title="Sort modules"
            value={sortMode}
            onChange={(event) => setSortMode(event.target.value as CourseSortMode)}
          >
            <option value="recommended">{sortLabelMap.recommended}</option>
            <option value="shortest">{sortLabelMap.shortest}</option>
            <option value="az">{sortLabelMap.az}</option>
          </select>
        </div>

        <div className="chip-filter-row" aria-label="Quick topic filters">
          {topicFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip-filter ${topic === item ? 'active' : ''}`}
              onClick={() => setTopic(item)}
            >
              {item === 'all' ? 'All topics' : TOPIC_LABELS[item]}
            </button>
          ))}
        </div>

        <div className="chip-filter-row" aria-label="Progress filters">
          {statusFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip-filter ${statusFilter === item ? 'active' : ''}`}
              onClick={() => setStatusFilter(item)}
            >
              {statusLabelMap[item]}
            </button>
          ))}
        </div>
      </section>

      <section className="panel">
        {filteredCourses.length === 0 ? (
          <div className="empty-state-card">
            <h2>No modules match these filters yet</h2>
            <p>
              Try clearing the search, choosing a different topic, or switching
              progress filters.
            </p>
            <button className="btn ghost" type="button" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {filteredCourses.map((course) => {
              const isCompleted = completedSet.has(course.id)
              const isEnrolled = enrolledSet.has(course.id)

              const statusClass = isCompleted
                ? 'course-card--completed'
                : isEnrolled
                  ? 'course-card--progress'
                  : ''

              return (
                <article key={course.id} className={`course-card ${statusClass}`}>
                  {isCompleted ? (
                    <div className="course-card-status-bar status-completed">
                      Completed
                    </div>
                  ) : isEnrolled ? (
                    <div className="course-card-status-bar status-inprogress">
                      In progress
                    </div>
                  ) : null}
                  <div className="course-chip-row">
                    <span className="chip">{TOPIC_LABELS[course.topic]}</span>
                    <span className="chip subtle">{course.level}</span>
                    <span className="chip subtle">{course.duration}</span>
                  </div>
                  <h3>{course.title}</h3>
                  <p>{course.summary}</p>
                  <Link
                    className={`btn ${isCompleted ? 'ghost' : 'primary'}`}
                    to={`/courses/${course.id}`}
                  >
                    {isCompleted
                      ? 'Review module'
                      : isEnrolled
                        ? 'Continue module'
                        : 'Start module'}
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

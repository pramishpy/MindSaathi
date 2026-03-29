import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { courses, TOPIC_LABELS } from '../data/courses'

function average(values: number[]): number {
  if (values.length === 0) {
    return 0
  }

  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

export default function TeacherDashboardPage() {
  const { user, users } = useAuth()

  const canView = user?.role === 'teacher' || user?.role === 'admin'

  const studentUsers = useMemo(
    () => users.filter((profile) => profile.role === 'student'),
    [users],
  )

  const schoolOptions = useMemo(() => {
    return [...new Set(studentUsers.map((profile) => profile.school))].sort()
  }, [studentUsers])

  const [selectedSchool, setSelectedSchool] = useState(() => user?.school ?? '')
  const [selectedGrade, setSelectedGrade] = useState('all')

  useEffect(() => {
    if (schoolOptions.length === 0) {
      return
    }

    if (!selectedSchool || !schoolOptions.includes(selectedSchool)) {
      setSelectedSchool(schoolOptions[0])
    }
  }, [schoolOptions, selectedSchool])

  const gradeOptions = useMemo(() => {
    if (!selectedSchool) {
      return []
    }

    return [
      ...new Set(
        studentUsers
          .filter((profile) => profile.school === selectedSchool)
          .map((profile) => profile.grade),
      ),
    ].sort()
  }, [selectedSchool, studentUsers])

  useEffect(() => {
    if (selectedGrade === 'all') {
      return
    }

    if (!gradeOptions.includes(selectedGrade)) {
      setSelectedGrade('all')
    }
  }, [gradeOptions, selectedGrade])

  const filteredStudents = useMemo(() => {
    return studentUsers.filter((profile) => {
      const matchesSchool = selectedSchool
        ? profile.school === selectedSchool
        : true
      const matchesGrade =
        selectedGrade === 'all' ? true : profile.grade === selectedGrade

      return matchesSchool && matchesGrade
    })
  }, [selectedSchool, selectedGrade, studentUsers])

  const metrics = useMemo(() => {
    const totalStudents = filteredStudents.length
    const enrolledStudents = filteredStudents.filter(
      (profile) => profile.enrolledCourseIds.length > 0,
    ).length
    const studentsWithCompletion = filteredStudents.filter(
      (profile) => profile.completedCourseIds.length > 0,
    ).length

    const completionRates = filteredStudents.map((profile) => {
      if (profile.enrolledCourseIds.length === 0) {
        return 0
      }

      return (profile.completedCourseIds.length / profile.enrolledCourseIds.length) * 100
    })

    const avgCompletionRate = average(completionRates)
    const avgCompletedCourses = average(
      filteredStudents.map((profile) => profile.completedCourseIds.length),
    )

    const stigmaCourseCompletions = filteredStudents.filter((profile) =>
      profile.completedCourseIds.includes('stigma-myth-buster'),
    ).length

    const lowEngagementCount = filteredStudents.filter(
      (profile) => profile.completedCourseIds.length === 0,
    ).length

    return {
      totalStudents,
      enrolledStudents,
      studentsWithCompletion,
      avgCompletionRate,
      avgCompletedCourses,
      stigmaCourseCompletions,
      lowEngagementCount,
    }
  }, [filteredStudents])

  const coursePerformance = useMemo(() => {
    const rows = courses.map((course) => {
      const completedCount = filteredStudents.filter((profile) =>
        profile.completedCourseIds.includes(course.id),
      ).length

      const completionPercentage =
        metrics.totalStudents > 0
          ? (completedCount / metrics.totalStudents) * 100
          : 0

      return {
        id: course.id,
        title: course.title,
        topicLabel: TOPIC_LABELS[course.topic],
        completedCount,
        completionPercentage,
      }
    })

    return rows.sort((a, b) => b.completedCount - a.completedCount)
  }, [filteredStudents, metrics.totalStudents])

  const topicPerformance = useMemo(() => {
    const tracker = new Map<string, number>()

    for (const profile of filteredStudents) {
      for (const courseId of profile.completedCourseIds) {
        const course = courses.find((item) => item.id === courseId)
        if (!course) {
          continue
        }

        const label = TOPIC_LABELS[course.topic]
        tracker.set(label, (tracker.get(label) ?? 0) + 1)
      }
    }

    return [...tracker.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [filteredStudents])

  const topStudents = useMemo(() => {
    return [...filteredStudents]
      .map((profile) => {
        const completionRate =
          profile.enrolledCourseIds.length > 0
            ? (profile.completedCourseIds.length / profile.enrolledCourseIds.length) * 100
            : 0

        return {
          id: profile.id,
          name: profile.name,
          grade: profile.grade,
          school: profile.school,
          completedCount: profile.completedCourseIds.length,
          completionRate,
        }
      })
      .sort((a, b) => {
        if (b.completedCount !== a.completedCount) {
          return b.completedCount - a.completedCount
        }

        return b.completionRate - a.completionRate
      })
      .slice(0, 8)
  }, [filteredStudents])

  if (!user) {
    return null
  }

  if (!canView) {
    return (
      <section className="panel">
        <h1>Teacher dashboard access required</h1>
        <p>
          This page is intended for teacher or admin accounts with class-level
          analytics responsibilities.
        </p>
        <p>
          To explore this feature, create a teacher/admin account from signup and
          login again.
        </p>
        <Link className="btn primary" to="/dashboard">
          Back to student dashboard
        </Link>
      </section>
    )
  }

  return (
    <div className="page-stack">
      <section className="panel gradient-panel">
        <div>
          <p className="eyebrow">Teacher/Admin Analytics</p>
          <h1>Class-level mental health learning dashboard</h1>
          <p>
            Monitor anti-stigma learning progress, identify low-engagement groups,
            and plan targeted support interventions by school and grade.
          </p>
        </div>
        <div className="metric-hero">
          <p>Average completion rate</p>
          <h2>{Math.round(metrics.avgCompletionRate)}%</h2>
          <span>{metrics.totalStudents} students in view</span>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Filter analytics scope</h2>
          <p className="muted-text">Adjust school and grade to inspect cohorts.</p>
        </div>

        <div className="filter-row teacher-filter-row">
          <select
            title="Filter dashboard by school"
            value={selectedSchool}
            onChange={(event) => setSelectedSchool(event.target.value)}
          >
            {schoolOptions.length === 0 ? (
              <option value="">No school data</option>
            ) : null}
            {schoolOptions.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>

          <select
            title="Filter dashboard by grade"
            value={selectedGrade}
            onChange={(event) => setSelectedGrade(event.target.value)}
          >
            <option value="all">All grades</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="panel">
        <div className="stats-grid teacher-stats-grid">
          <article className="stat-item">
            <span>Total students</span>
            <strong>{metrics.totalStudents}</strong>
          </article>
          <article className="stat-item">
            <span>Enrolled students</span>
            <strong>{metrics.enrolledStudents}</strong>
          </article>
          <article className="stat-item">
            <span>Students with completion</span>
            <strong>{metrics.studentsWithCompletion}</strong>
          </article>
          <article className="stat-item">
            <span>Avg completed modules</span>
            <strong>{metrics.avgCompletedCourses.toFixed(1)}</strong>
          </article>
          <article className="stat-item">
            <span>Stigma module completions</span>
            <strong>{metrics.stigmaCourseCompletions}</strong>
          </article>
          <article className="stat-item">
            <span>Low engagement students</span>
            <strong>{metrics.lowEngagementCount}</strong>
          </article>
        </div>
      </section>

      <section className="panel split two">
        <article>
          <h2>Top topic engagement</h2>
          <div className="analytics-list">
            {topicPerformance.length === 0 ? (
              <p>No completed-course topic data yet.</p>
            ) : (
              topicPerformance.map((topic) => (
                <div className="analytics-item" key={topic.label}>
                  <div>
                    <strong>{topic.label}</strong>
                    <p>{topic.count} completions</p>
                  </div>
                  <progress
                    className="topic-progress"
                    max={100}
                    value={
                      metrics.totalStudents > 0
                        ? Math.min((topic.count / metrics.totalStudents) * 100, 100)
                        : 0
                    }
                  />
                </div>
              ))
            )}
          </div>
        </article>

        <article>
          <h2>Most completed courses</h2>
          <div className="analytics-list">
            {coursePerformance.slice(0, 6).map((course) => (
              <div className="analytics-item" key={course.id}>
                <div>
                  <strong>{course.title}</strong>
                  <p>{course.topicLabel}</p>
                </div>
                <div className="course-stat">
                  <span>{course.completedCount} students</span>
                  <span>{Math.round(course.completionPercentage)}%</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <h2>Top learners in selected cohort</h2>
        {topStudents.length === 0 ? (
          <p>No learner activity yet for this cohort.</p>
        ) : (
          <div className="table-wrap">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Grade</th>
                  <th>Completed</th>
                  <th>Completion rate</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>{student.completedCount}</td>
                    <td>{Math.round(student.completionRate)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <h2>Recommended next actions</h2>
        <ul className="bullet-list">
          <li>
            Run a weekly 10-minute myth-buster discussion in low-engagement
            classes.
          </li>
          <li>
            Prioritize stigma module enrollment for students with zero completions.
          </li>
          <li>
            Use the Resources page game as a classroom warm-up for empathy skills.
          </li>
        </ul>
      </section>
    </div>
  )
}

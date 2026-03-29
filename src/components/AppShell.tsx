import { useMemo } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const studentNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/resources', label: 'Resources' },
  { to: '/profile', label: 'Profile' },
]

const staffNavItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/courses', label: 'Courses' },
  { to: '/resources', label: 'Resources' },
  { to: '/profile', label: 'Profile' },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  const enrolledCount = user.enrolledCourseIds.length
  const completedCount = user.completedCourseIds.length
  const progressRate =
    enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0

  const navItems =
    user.role === 'teacher' || user.role === 'admin'
      ? [...staffNavItems, { to: '/teacher-dashboard', label: 'Teacher Dashboard' }]
      : studentNavItems

  const mobileQuickLinks = useMemo(
    () => [
      { to: '/dashboard', label: 'Home' },
      { to: '/courses', label: 'Learn' },
      { to: '/assignments', label: 'Tasks' },
      { to: '/resources', label: 'Support' },
    ],
    [],
  )

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="brand-block">
          <img
            className="brand-logo"
            src="/mindsaathi-schools-logo.svg"
            alt="MindSaathi Schools"
          />
        </div>

        <nav className="nav-links" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }: { isActive: boolean }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="user-chip-row">
          <div className="user-chip">
            <p>{user.name}</p>
            <span>{progressRate}% course progress</span>
          </div>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="content-wrap">
        <Outlet />
      </main>

      <nav className="mobile-quick-nav" aria-label="Quick navigation">
        {mobileQuickLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }: { isActive: boolean }) =>
              `mobile-quick-link ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

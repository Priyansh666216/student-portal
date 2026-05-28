import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const [theme, setTheme] = useState('light')
  const isStudents = pathname.startsWith('/students')
  const isHome = pathname === '/'
  const isAddStudent = pathname === '/students/new'

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const preferredTheme = storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(preferredTheme)
    document.documentElement.dataset.theme = preferredTheme
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem('theme', nextTheme)
  }

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🎓</span>
        <div>
          <div className="navbar__title">Student Portal</div>
          <div className="navbar__subtitle">Modern student tracking</div>
        </div>
      </div>

      <div className="navbar__menu">
        <Link to="/" className={`nav-link ${isHome ? 'nav-link--active' : ''}`}>Home</Link>
        <Link to="/students" className={`nav-link ${isStudents && !isAddStudent ? 'nav-link--active' : ''}`}>Students</Link>
        <Link to="/students/new" className={`nav-link ${isAddStudent ? 'nav-link--active' : ''}`}>Add Student</Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ minWidth: 112 }}
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  )
}

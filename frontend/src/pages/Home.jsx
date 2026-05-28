import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../services/api.js'

export default function Home() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0])

  useEffect(() => {
    studentAPI.getAll()
      .then((res) => setStudents(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const deptCount = [...new Set(students.map((s) => s.department))].length

  useEffect(() => {
    const targets = [students.length, deptCount, 3]
    const duration = 800
    const steps = 40
    const increments = targets.map((target) => target / steps)
    let current = [0, 0, 0]
    setAnimatedStats([0, 0, 0])

    const interval = window.setInterval(() => {
      current = current.map((value, index) => {
        const next = value + increments[index]
        return next >= targets[index] ? targets[index] : next
      })
      setAnimatedStats(current.map((value) => Math.floor(value)))
      if (current.every((value, index) => value >= targets[index])) {
        window.clearInterval(interval)
      }
    }, duration / steps)

    return () => window.clearInterval(interval)
  }, [students.length, deptCount])

  if (loading) return <div className="loading">⏳ Loading dashboard...</div>
  if (error) return <div className="error-msg">{error}</div>

  const stats = [
    { icon: '👩‍🎓', label: 'Total Students', value: animatedStats[0] },
    { icon: '🏫', label: 'Departments', value: animatedStats[1] },
    { icon: '📄', label: 'Portal Pages', value: animatedStats[2] },
  ]

  return (
    <div>
      <div className="hero-card card--soft hero-card--wide">
        <div>
          <p className="eyebrow">Modern portal</p>
          <h1>Beautiful student management with a clean, modern interface</h1>
          <p className="hero-copy">
            Use the student portal to browse learners, add new profiles, and track academic progress with responsive cards, quick search, and polished forms.
          </p>
          <div className="hero-actions">
            <Link to="/students/new" className="btn btn-primary">+ Enroll Student</Link>
            <Link to="/students" className="btn btn-secondary">Browse Students</Link>
          </div>
        </div>

        <div className="hero-summary">
          <div className="hero-summary-heading">
            <p className="eyebrow">Dashboard snapshot</p>
            <h2>Everything you need, in one place.</h2>
            <p className="hero-copy">
              Keep track of enrollments, departments, and profile activity from a single polished view.
            </p>
          </div>

          <div className="stats-grid hero-summary-grid">
            {stats.map((item, index) => (
              <div key={index} className="stat-card stat-card--compact">
                <span>{item.icon}</span>
                <p>{item.label}</p>
                <h2 style={{ marginTop: 12 }}>{item.value}</h2>
              </div>
            ))}
          </div>

          <div className="hero-summary-note">
            <span>✨</span>
            <div>
              <strong>{students.length} enrolled students</strong> across {deptCount} departments.
            </div>
          </div>
        </div>
      </div>

      <div className="feature-grid" style={{ marginBottom: 24 }}>
        <div className="feature-card">
          <div className="feature-icon">🏠</div>
          <h3>Home dashboard</h3>
          <p>See portal highlights, recent students, and quick actions in one polished workspace.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Student list</h3>
          <p>Search, edit, and manage student profiles with clean, responsive tables and actions.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✏️</div>
          <h3>Add Student</h3>
          <p>Onboard new learners fast using the modern form and save student data instantly.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div>
            <h2>Recent students</h2>
            <p>Fast access to the latest enrollments and quick links to student profiles.</p>
          </div>
          <Link to="/students" className="btn btn-secondary">View all students</Link>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <p>No students have been added yet.</p>
            <Link to="/students/new" className="btn btn-primary">Add your first student</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((student) => (
                  <tr key={student.id}>
                    <td>
                      <Link to={`/students/${student.id}`} className="student-link">
                        {student.name}
                      </Link>
                    </td>
                    <td>{student.rollNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.semester}</td>
                    <td>
                      <Link to={`/students/${student.id}/edit`} className="btn btn-sm">Edit</Link>
                      <Link to={`/results/${student.id}`} className="btn btn-sm btn-secondary">Results</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
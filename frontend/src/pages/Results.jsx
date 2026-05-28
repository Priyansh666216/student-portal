import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { studentAPI, resultAPI } from '../services/api.js'

export default function Results() {
  const { studentId } = useParams()

  const [student, setStudent] = useState(null)
  const [results, setResults] = useState([])
  const [semester, setSemester] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      studentAPI.getById(studentId),
      resultAPI.getByStudent(studentId),
    ])
      .then(([sRes, rRes]) => {
        setStudent(sRes.data)
        setResults(rRes.data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [studentId])

  const filtered = semester === 'all' ? results : results.filter((r) => r.semester === Number(semester))

  const totalObtained = filtered.reduce((sum, r) => sum + r.marksObtained, 0)
  const totalMax = filtered.reduce((sum, r) => sum + r.totalMarks, 0)
  const avgPct = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : '—'

  const gradeColor = (g) => {
    if (['A+', 'A'].includes(g)) return 'badge-green'
    if (['B+', 'B'].includes(g)) return 'badge-blue'
    if (g === 'C') return 'badge-yellow'
    if (g === 'F') return 'badge-red'
    return 'badge-gray'
  }

  if (loading) return <div className="loading">⏳ Loading results...</div>
  if (error) return <div className="error-msg">{error}</div>

  const semesters = [...new Set(results.map((r) => r.semester))].sort((a, b) => a - b)

  return (
    <div>
      <div className="section-header">
        <div>
          <h1>Results</h1>
          <p>{student?.name} · {student?.rollNumber}</p>
        </div>
        <Link to={`/students/${studentId}`} className="btn btn-secondary">← Back to Profile</Link>
      </div>

      <div className="card" style={{ marginBottom: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
          <label style={{ marginBottom: 0, color: 'var(--muted)' }}>Filter by semester:</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)} style={{ width: 180 }}>
            <option value="all">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>Semester {sem}</option>
            ))}
          </select>
          <div style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 14 }}>
            Showing {filtered.length} of {results.length} results
          </div>
        </div>
      </div>

      <div className="summary-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card" style={{ borderTopColor: '#5b54ff' }}>
          <span>📘</span>
          <p>Subjects</p>
          <h2>{filtered.length}</h2>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#06b6d4' }}>
          <span>🧾</span>
          <p>Marks Scored</p>
          <h2>{totalObtained}/{totalMax}</h2>
        </div>
        <div className="stat-card" style={{ borderTopColor: '#22c55e' }}>
          <span>📈</span>
          <p>Average %</p>
          <h2>{avgPct}%</h2>
        </div>
      </div>

      <div className="card">
        <div className="section-header" style={{ marginBottom: 18 }}>
          <div>
            <h2>Detailed Scores</h2>
            <p>All student results are shown here with grade and semester details.</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No results match the selected semester.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
              <tr>
                <th>Subject</th>
                <th>Obtained</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Exam</th>
                <th>Year</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td><strong>{r.subject}</strong></td>
                  <td>{r.marksObtained}</td>
                  <td>{r.totalMarks}</td>
                  <td>{((r.marksObtained / r.totalMarks) * 100).toFixed(1)}%</td>
                  <td><span className={`badge ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                  <td style={{ color: 'var(--muted)' }}>{r.examType}</td>
                  <td style={{ color: 'var(--muted)' }}>{r.academicYear}</td>
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

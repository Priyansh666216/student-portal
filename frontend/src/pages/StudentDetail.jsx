import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { studentAPI, resultAPI } from '../services/api.js'

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [results, setResults] = useState([])
  const [summary, setSummary] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newResult, setNewResult] = useState({
    subject: '', marksObtained: '', totalMarks: 100,
    semester: 1, credits: 4, examType: 'End-Term', academicYear: '2024-25',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      studentAPI.getById(id),
      resultAPI.getByStudent(id),
      resultAPI.getSummary(id),
    ])
      .then(([sRes, rRes, sumRes]) => {
        setStudent(sRes.data)
        setResults(rRes.data)
        setSummary(sumRes.data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const gradeColor = (g) => {
    if (['A+', 'A'].includes(g)) return 'badge-green'
    if (['B+', 'B'].includes(g)) return 'badge-blue'
    if (g === 'C') return 'badge-yellow'
    if (g === 'F') return 'badge-red'
    return 'badge-gray'
  }

  const handleAddResult = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await resultAPI.create(id, {
        ...newResult,
        marksObtained: Number(newResult.marksObtained),
        totalMarks: Number(newResult.totalMarks),
        semester: Number(newResult.semester),
        credits: Number(newResult.credits),
      })
      setResults((prev) => [...prev, res.data])
      setNewResult({ subject: '', marksObtained: '', totalMarks: 100, semester: 1, credits: 4, examType: 'End-Term', academicYear: '2024-25' })
    } catch (err) {
      alert('Failed to add result: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm('Delete this result?')) return
    await resultAPI.delete(resultId)
    setResults((prev) => prev.filter((result) => result.id !== resultId))
  }

  const chartData = Object.entries(summary).map(([sem, avg]) => ({
    semester: `Sem ${sem}`,
    percentage: avg,
  }))

  if (loading) return <div className="loading">⏳ Loading profile...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!student) return null

  return (
    <div>
      <div className="section-header">
        <div>
          <h1>{student.name}</h1>
          <p>{student.rollNumber} · {student.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/students')} className="btn btn-secondary">
            ← Back to Students
          </button>
          <Link to={`/students/${id}/edit`} className="btn btn-primary">
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24, padding: 28 }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ width: 84, height: 84, borderRadius: 24, display: 'grid', placeItems: 'center', background: 'rgba(91,84,255,.12)', fontSize: 32 }}>
              👤
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{student.name}</h2>
              <p style={{ margin: '10px 0 0', color: 'var(--muted)' }}>{student.department} · Semester {student.semester}</p>
              <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{student.department}</span>
                <span className="badge badge-gray">Semester {student.semester}</span>
                <span className="badge badge-green">Enrolled {student.enrollmentYear || '—'}</span>
              </div>
            </div>
          </div>

          <div className="summary-grid">
            <div className="stat-card" style={{ borderTopColor: '#4f46e5' }}>
              <span>📧</span>
              <p>Email</p>
              <h2 style={{ marginTop: 12 }}>{student.email || 'Not available'}</h2>
            </div>
            <div className="stat-card" style={{ borderTopColor: '#06b6d4' }}>
              <span>📱</span>
              <p>Phone</p>
              <h2 style={{ marginTop: 12 }}>{student.phoneNumber || 'Not available'}</h2>
            </div>
            <div className="stat-card" style={{ borderTopColor: '#22c55e' }}>
              <span>🏠</span>
              <p>Address</p>
              <h2 style={{ marginTop: 12 }}>{student.address || 'Not shared'}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Performance Overview</h3>
          {chartData.length === 0 ? (
            <p style={{ color: 'var(--muted)' }}>No performance data available yet.</p>
          ) : (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Bar dataKey="percentage" fill="#5b54ff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Quick Summary</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="stat-card" style={{ borderTopColor: '#f59e0b' }}>
              <span>🎯</span>
              <p>Total Results</p>
              <h2 style={{ marginTop: 12 }}>{results.length}</h2>
            </div>
            <div className="stat-card" style={{ borderTopColor: '#ef4444' }}>
              <span>⭐</span>
              <p>Top Grade</p>
              <h2 style={{ marginTop: 12 }}>{results.length ? results.map((r) => r.grade).sort()[0] : '—'}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header" style={{ marginBottom: 16 }}>
          <div>
            <h2>Add a result</h2>
            <p>Track performance for the selected student quickly.</p>
          </div>
        </div>
        <form onSubmit={handleAddResult} className="form-grid">
          <div className="form-grid form-grid-2">
            <div>
              <label>Subject *</label>
              <input required value={newResult.subject} onChange={(e) => setNewResult((p) => ({ ...p, subject: e.target.value }))} />
            </div>
            <div>
              <label>Exam Type</label>
              <select value={newResult.examType} onChange={(e) => setNewResult((p) => ({ ...p, examType: e.target.value }))}>
                <option>End-Term</option>
                <option>Mid-Term</option>
                <option>Internal</option>
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div>
              <label>Marks Obtained *</label>
              <input required type="number" min={0} value={newResult.marksObtained} onChange={(e) => setNewResult((p) => ({ ...p, marksObtained: e.target.value }))} />
            </div>
            <div>
              <label>Total Marks</label>
              <input type="number" value={newResult.totalMarks} onChange={(e) => setNewResult((p) => ({ ...p, totalMarks: e.target.value }))} />
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div>
              <label>Semester</label>
              <select value={newResult.semester} onChange={(e) => setNewResult((p) => ({ ...p, semester: Number(e.target.value) }))}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Academic Year</label>
              <input value={newResult.academicYear} onChange={(e) => setNewResult((p) => ({ ...p, academicYear: e.target.value }))} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Result'}
          </button>
        </form>
      </div>

      <div className="card">
        <div className="section-header">
          <div>
            <h2>Results ({results.length})</h2>
            <p>Review all available results for this student.</p>
          </div>
          <Link to={`/students/${id}/edit`} className="btn btn-secondary">Edit student</Link>
        </div>
        {results.length === 0 ? (
          <div className="empty-state">
            <p>No results added yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
              <tr>
                <th>Subject</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Semester</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td><strong>{result.subject}</strong></td>
                  <td>{result.marksObtained} / {result.totalMarks}</td>
                  <td>{((result.marksObtained / result.totalMarks) * 100).toFixed(1)}%</td>
                  <td><span className={`badge ${gradeColor(result.grade)}`}>{result.grade}</span></td>
                  <td>Sem {result.semester}</td>
                  <td style={{ color: 'var(--muted)' }}>{result.examType}</td>
                  <td>
                    <button onClick={() => handleDeleteResult(result.id)} className="btn btn-danger" style={{ padding: '8px 12px', fontSize: 13 }}>
                      Delete
                    </button>
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

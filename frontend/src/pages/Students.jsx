import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../services/api.js'

export default function Students() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    studentAPI.getAll()
      .then(res => setStudents(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return
    try {
      await studentAPI.delete(id)
      setStudents(prev => prev.filter((student) => student.id !== id))
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  const filtered = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    student.department.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="loading">⏳ Loading students...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div>
      <div className="section-header">
        <div>
          <h1>Students</h1>
          <p>{students.length} total students enrolled in the portal.</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">+ Add Student</Link>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <input
          type="text"
          placeholder="Search by name, roll number, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No students match your search.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Email</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td><strong>{student.name}</strong></td>
                  <td>{student.rollNumber}</td>
                  <td>{student.email}</td>
                  <td><span className="badge badge-blue">{student.department}</span></td>
                  <td><span className="badge badge-gray">Sem {student.semester}</span></td>
                  <td style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <Link to={`/students/${student.id}`} className="btn btn-outline" style={{ padding: '8px 12px', fontSize: 13 }}>
                      Profile
                    </Link>
                    <Link to={`/students/${student.id}/edit`} className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: 13 }}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(student.id)} className="btn btn-danger" style={{ padding: '8px 12px', fontSize: 13 }}>
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

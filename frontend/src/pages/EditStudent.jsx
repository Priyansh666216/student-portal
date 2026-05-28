import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { studentAPI } from '../services/api.js'

export default function EditStudent() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', department: '',
    semester: 1, phoneNumber: '', address: '',
    dateOfBirth: '', enrollmentYear: String(new Date().getFullYear()),
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    studentAPI.getById(id)
      .then((res) => {
        const s = res.data
        setForm({
          name: s.name || '',
          rollNumber: s.rollNumber || '',
          email: s.email || '',
          department: s.department || '',
          semester: s.semester || 1,
          phoneNumber: s.phoneNumber || '',
          address: s.address || '',
          dateOfBirth: s.dateOfBirth || '',
          enrollmentYear: s.enrollmentYear ? String(s.enrollmentYear) : String(new Date().getFullYear()),
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await studentAPI.update(id, {
        ...form,
        semester: Number(form.semester),
        enrollmentYear: Number(form.enrollmentYear),
      })
      navigate(`/students/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading">⏳ Loading student data...</div>

  return (
    <div>
      <div className="page-title">
        <h1>Edit Student Profile</h1>
        <p>Review the current details and save any updates.</p>
      </div>

      <div className="card form-card" style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-grid form-grid-2">
            <div>
              <label>Full Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label>Roll Number *</label>
              <input name="rollNumber" required value={form.rollNumber} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label>Email *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} />
          </div>

          <div className="form-grid form-grid-2">
            <div>
              <label>Department *</label>
              <select name="department" required value={form.department} onChange={handleChange}>
                <option value="">Select department</option>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
                <option>Mathematics</option>
                <option>Physics</option>
              </select>
            </div>
            <div>
              <label>Semester *</label>
              <select name="semester" required value={form.semester} onChange={handleChange}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-grid form-grid-2">
            <div>
              <label>Phone Number</label>
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </div>
            <div>
              <label>Date of Birth</label>
              <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label>Enrollment Year</label>
            <select name="enrollmentYear" required value={form.enrollmentYear} onChange={handleChange}>
              <option value="">Select year</option>
              {Array.from({ length: new Date().getFullYear() - 1999 }, (_, index) => {
                const year = new Date().getFullYear() - index
                return (
                  <option key={year} value={String(year)}>{year}</option>
                )
              })}
            </select>
          </div>

          <div>
            <label>Address</label>
            <textarea name="address" rows={4} value={form.address} onChange={handleChange} style={{ resize: 'vertical' }} />
          </div>

          {error && <div className="error-msg">❌ {error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/students/${id}`)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentAPI } from '../services/api.js'

export default function AddStudent() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', rollNumber: '', email: '', department: '',
    semester: '1', phoneNumber: '', address: '',
    dateOfBirth: '', enrollmentYear: String(new Date().getFullYear()),
  })
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await studentAPI.create({
        ...form,
        semester: Number(form.semester),
        enrollmentYear: Number(form.enrollmentYear),
      })
      navigate('/students')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-title">
        <h1>Add New Student</h1>
        <p>Fill in the student profile and save it to the portal.</p>
      </div>

      <div className="card form-card" style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-grid form-grid-2">
            <div>
              <label>Full Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Arjun Sharma" />
            </div>
            <div>
              <label>Roll Number *</label>
              <input name="rollNumber" required value={form.rollNumber} onChange={handleChange} placeholder="e.g. CS2024001" />
            </div>
          </div>

          <div>
            <label>Email Address *</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="arjun@college.edu" />
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
              <label>Current Semester *</label>
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
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+91 98765 43210" />
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
            <textarea name="address" rows={4} value={form.address} onChange={handleChange} placeholder="Home address..." style={{ resize: 'vertical' }} />
          </div>

          {error && <div className="error-msg">❌ {error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Create Student'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/students')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

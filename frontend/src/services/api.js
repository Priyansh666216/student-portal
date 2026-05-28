/**
 * api.js – Centralised Axios HTTP client
 *
 * Axios is a promise-based HTTP client.
 * We create a single instance (apiClient) with:
 *   - baseURL  → points to Spring Boot backend
 *   - headers  → sets Content-Type for all requests
 *
 * All API calls are grouped by resource (students, results).
 */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL||'/api',                         // proxied to http://localhost:8080/api via vite.config.js
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,                          // 10 second timeout
})

/* ── Request Interceptor ────────────────────────────────────────
   Runs before every request – useful for adding auth tokens later.
*/
apiClient.interceptors.request.use(
  config => config,
  error  => Promise.reject(error)
)

/* ── Response Interceptor ───────────────────────────────────────
   Centrally handles errors so individual API calls stay clean.
*/
apiClient.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    console.error('[API Error]', message)
    return Promise.reject(new Error(message))
  }
)

/* ═══════════════════════════════════════════════════════════════
   STUDENT API
   ═══════════════════════════════════════════════════════════════ */
export const studentAPI = {
  getAll:          ()           => apiClient.get('/students'),
  getById:         (id)         => apiClient.get(`/students/${id}`),
  getByRoll:       (roll)       => apiClient.get(`/students/roll/${roll}`),
  getByDepartment: (dept)       => apiClient.get(`/students/department/${dept}`),
  search:          (keyword)    => apiClient.get(`/students/search?keyword=${keyword}`),
  create:          (data)       => apiClient.post('/students', data),
  update:          (id, data)   => apiClient.put(`/students/${id}`, data),
  delete:          (id)         => apiClient.delete(`/students/${id}`),
}

/* ═══════════════════════════════════════════════════════════════
   RESULT API
   ═══════════════════════════════════════════════════════════════ */
export const resultAPI = {
  getByStudent:    (studentId)            => apiClient.get(`/results/student/${studentId}`),
  getBySemester:   (studentId, semester)  => apiClient.get(`/results/student/${studentId}/semester/${semester}`),
  getById:         (id)                   => apiClient.get(`/results/${id}`),
  getSummary:      (studentId)            => apiClient.get(`/results/student/${studentId}/summary`),
  getAverage:      (studentId)            => apiClient.get(`/results/student/${studentId}/average`),
  create:          (studentId, data)      => apiClient.post(`/results/student/${studentId}`, data),
  update:          (id, data)             => apiClient.put(`/results/${id}`, data),
  delete:          (id)                   => apiClient.delete(`/results/${id}`),
}

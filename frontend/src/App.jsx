import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Students from './pages/Students.jsx'
import StudentDetail from './pages/StudentDetail.jsx'
import AddStudent from './pages/AddStudent.jsx'
import EditStudent from './pages/EditStudent.jsx'
import Results from './pages/Results.jsx'

/**
 * App.jsx – Root component
 *
 * react-router-dom v6 uses <Routes> + <Route> for declarative routing.
 * <Navigate> handles redirects.
 *
 * Route structure:
 *   /              → Home (dashboard)
 *   /students      → Student list
 *   /students/new  → Add student form
 *   /students/:id  → Student profile + results
 *   /students/:id/edit → Edit student
 *   /results/:id   → Results page for a student
 */
function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/new" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/students/:id/edit" element={<EditStudent />} />
          <Route path="/results/:studentId" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

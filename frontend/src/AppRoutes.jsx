import { Routes, Route } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import Landing from './pages/common/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import UploadNotebook from './pages/student/UploadNotebook';
import StudentResults from './pages/student/Results';
import PerformanceHistory from './pages/student/PerformanceHistory';
import StudentProfile from './pages/student/Profile';
import StudentSettings from './pages/student/Settings';
import DetailedFeedback from './pages/student/DetailedFeedback';
import TeacherDashboard from './pages/teacher/Dashboard';
import BulkUpload from './pages/teacher/BulkUpload';
import TeacherStudentResults from './pages/teacher/StudentResults';
import Analytics from './pages/teacher/Analytics';
import Plagiarism from './pages/teacher/Plagiarism';
import Reports from './pages/teacher/Reports';

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── Student Routes (Protected) ─────────────────── */}
      <Route element={<ProtectedRoute role="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/upload" element={<UploadNotebook />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/performance" element={<PerformanceHistory />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/settings" element={<StudentSettings />} />
          <Route path="/student/feedback/:id" element={<DetailedFeedback />} />
        </Route>
      </Route>

      {/* ── Teacher Routes (Protected) ─────────────────── */}
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/bulk-upload" element={<BulkUpload />} />
          <Route path="/teacher/student-results" element={<TeacherStudentResults />} />
          <Route path="/teacher/analytics" element={<Analytics />} />
          <Route path="/teacher/plagiarism" element={<Plagiarism />} />
          <Route path="/teacher/reports" element={<Reports />} />
          <Route path="/teacher/feedback/:id" element={<DetailedFeedback />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;


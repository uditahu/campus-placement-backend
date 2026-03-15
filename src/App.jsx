import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/student/Dashboard";
import StudentProfile from "./pages/student/Profile";
import Applications from "./pages/student/Applications";

import FacultyDashboard from "./pages/faculty/Dashboard";
import FacultyStudentDetail from "./pages/faculty/StudentDetail";

import CompanyDashboard from "./pages/company/Dashboard";
import PostJob from "./pages/company/PostJob";
import Applicants from "./pages/company/Applicants";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminStudents from "./pages/admin/Students";
import StudentEdit from "./pages/admin/StudentEdit";
import AdminFaculty from "./pages/admin/Faculty";
import AdminCompanies from "./pages/admin/Companies";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";
import AdminAssign from "./pages/admin/Assign";

function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="app-layout">
      {user && !isAuthPage && <Sidebar />}
      <div className={user && !isAuthPage ? "main-content" : ""}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/applications" element={<Applications />} />

          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/student/:studentId" element={<FacultyStudentDetail />} />

          <Route path="/company/dashboard" element={<CompanyDashboard />} />
          <Route path="/company/post-job" element={<PostJob />} />
          <Route path="/company/job/:jobId/applicants" element={<Applicants />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id/edit" element={<StudentEdit />} />
          <Route path="/admin/faculty" element={<AdminFaculty />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/assignments" element={<AdminAssign />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

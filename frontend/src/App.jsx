import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login    from './pages/Login';
import Register from './pages/Register';

import StudentDashboard    from './pages/student/Dashboard';
import StudentProfile      from './pages/student/Profile';
import StudentJobs         from './pages/student/Jobs';
import StudentApplications from './pages/student/Applications';

import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyStudents  from './pages/faculty/Students';

import CompanyDashboard  from './pages/company/Dashboard';
import CompanyJobs       from './pages/company/Jobs';
import CompanyApplicants from './pages/company/Applicants';

import AdminDashboard  from './pages/admin/Dashboard';
import AdminUsers      from './pages/admin/Users';
import AdminStudents   from './pages/admin/Students';
import AdminFaculty    from './pages/admin/Faculty';
import AdminCompanies  from './pages/admin/Companies';
import AdminAssign     from './pages/admin/Assign';

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner" /><span>Loading...</span></div>;
  if (!user)   return <Navigate to="/login" />;
  const map = { student:'/student/dashboard', faculty:'/faculty/dashboard',
                company:'/company/dashboard', admin:'/admin/dashboard' };
  return <Navigate to={map[user.role] || '/login'} />;
}

function S({ roles, children }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"    element={<HomeRedirect />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/dashboard"    element={<S roles={['student']}><StudentDashboard /></S>} />
          <Route path="/student/profile"      element={<S roles={['student']}><StudentProfile /></S>} />
          <Route path="/student/jobs"         element={<S roles={['student']}><StudentJobs /></S>} />
          <Route path="/student/applications" element={<S roles={['student']}><StudentApplications /></S>} />

          <Route path="/faculty/dashboard" element={<S roles={['faculty']}><FacultyDashboard /></S>} />
          <Route path="/faculty/students"  element={<S roles={['faculty']}><FacultyStudents /></S>} />

          <Route path="/company/dashboard"            element={<S roles={['company']}><CompanyDashboard /></S>} />
          <Route path="/company/jobs"                 element={<S roles={['company']}><CompanyJobs /></S>} />
          <Route path="/company/jobs/:id/applicants"  element={<S roles={['company']}><CompanyApplicants /></S>} />

          <Route path="/admin/dashboard" element={<S roles={['admin']}><AdminDashboard /></S>} />
          <Route path="/admin/users"     element={<S roles={['admin']}><AdminUsers /></S>} />
          <Route path="/admin/students"  element={<S roles={['admin']}><AdminStudents /></S>} />
          <Route path="/admin/faculty"   element={<S roles={['admin']}><AdminFaculty /></S>} />
          <Route path="/admin/companies" element={<S roles={['admin']}><AdminCompanies /></S>} />
          <Route path="/admin/assign"    element={<S roles={['admin']}><AdminAssign /></S>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

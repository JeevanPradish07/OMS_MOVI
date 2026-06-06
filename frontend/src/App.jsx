import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute, ROLE_HOME } from './routes/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Intern
import InternDashboard from './pages/intern/Dashboard';
import InternTasks from './pages/intern/Tasks';
import InternStatus from './pages/intern/Status';
import InternLearning from './pages/intern/Learning';
import InternMessages from './pages/intern/Messages';
import InternPerformance from './pages/intern/Performance';
import InternPayments from './pages/intern/Payments';
import InternDocuments from './pages/intern/Documents';

// HR
import HRDashboard from './pages/hr/Dashboard';
import HROnboarding from './pages/hr/Onboarding';
import HRAttendance from './pages/hr/Attendance';
import HRDocuments from './pages/hr/Documents';
import HRPerformance from './pages/hr/Performance';
import HRCommunication from './pages/hr/Communication';

// PMO
import PMODashboard from './pages/pmo/Dashboard';
import PMOProjects from './pages/pmo/Projects';
import PMOTasks from './pages/pmo/Tasks';
import PMOMonitoring from './pages/pmo/Monitoring';
import PMOTimeline from './pages/pmo/Timeline';
import PMOApprovals from './pages/pmo/Approvals';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminReports from './pages/admin/Reports';
import AdminAccess from './pages/admin/Access';
import AdminConfig from './pages/admin/Config';
import AdminPayments from './pages/admin/Payments';

// Profile
import Profile from './pages/Profile';

function RoleRedirect() {
  const { user } = useAuth();
  if (user) return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Intern */}
      <Route path="/intern/dashboard" element={<ProtectedRoute allowedRoles={['intern']}><InternDashboard /></ProtectedRoute>} />
      <Route path="/intern/tasks" element={<ProtectedRoute allowedRoles={['intern']}><InternTasks /></ProtectedRoute>} />
      <Route path="/intern/status" element={<ProtectedRoute allowedRoles={['intern']}><InternStatus /></ProtectedRoute>} />
      <Route path="/intern/learning" element={<ProtectedRoute allowedRoles={['intern']}><InternLearning /></ProtectedRoute>} />
      <Route path="/intern/messages" element={<ProtectedRoute allowedRoles={['intern']}><InternMessages /></ProtectedRoute>} />
      <Route path="/intern/performance" element={<ProtectedRoute allowedRoles={['intern']}><InternPerformance /></ProtectedRoute>} />
      <Route path="/intern/payments" element={<ProtectedRoute allowedRoles={['intern']}><InternPayments /></ProtectedRoute>} />
      <Route path="/intern/documents" element={<ProtectedRoute allowedRoles={['intern']}><InternDocuments /></ProtectedRoute>} />

      {/* HR */}
      <Route path="/hr/dashboard" element={<ProtectedRoute allowedRoles={['hr']}><HRDashboard /></ProtectedRoute>} />
      <Route path="/hr/onboarding" element={<ProtectedRoute allowedRoles={['hr']}><HROnboarding /></ProtectedRoute>} />
      <Route path="/hr/attendance" element={<ProtectedRoute allowedRoles={['hr']}><HRAttendance /></ProtectedRoute>} />
      <Route path="/hr/documents" element={<ProtectedRoute allowedRoles={['hr']}><HRDocuments /></ProtectedRoute>} />
      <Route path="/hr/performance" element={<ProtectedRoute allowedRoles={['hr']}><HRPerformance /></ProtectedRoute>} />
      <Route path="/hr/communication" element={<ProtectedRoute allowedRoles={['hr']}><HRCommunication /></ProtectedRoute>} />

      {/* PMO */}
      <Route path="/pmo/dashboard" element={<ProtectedRoute allowedRoles={['pmo']}><PMODashboard /></ProtectedRoute>} />
      <Route path="/pmo/projects" element={<ProtectedRoute allowedRoles={['pmo']}><PMOProjects /></ProtectedRoute>} />
      <Route path="/pmo/tasks" element={<ProtectedRoute allowedRoles={['pmo']}><PMOTasks /></ProtectedRoute>} />
      <Route path="/pmo/monitoring" element={<ProtectedRoute allowedRoles={['pmo']}><PMOMonitoring /></ProtectedRoute>} />
      <Route path="/pmo/timeline" element={<ProtectedRoute allowedRoles={['pmo']}><PMOTimeline /></ProtectedRoute>} />
      <Route path="/pmo/approvals" element={<ProtectedRoute allowedRoles={['pmo']}><PMOApprovals /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/access" element={<ProtectedRoute allowedRoles={['admin']}><AdminAccess /></ProtectedRoute>} />
      <Route path="/admin/config" element={<ProtectedRoute allowedRoles={['admin']}><AdminConfig /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><AdminPayments /></ProtectedRoute>} />
      
      {/* Global Profile Route */}
      <Route path="/profile" element={<ProtectedRoute allowedRoles={['intern', 'hr', 'pmo', 'admin']}><Profile /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

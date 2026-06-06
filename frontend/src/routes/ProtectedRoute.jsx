import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLE_HOME = {
  intern: '/intern/dashboard',
  hr: '/hr/dashboard',
  pmo: '/pmo/dashboard',
  admin: '/admin/dashboard',
  dept: '/dept/dashboard'
};

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="spinner border-primary/30 border-t-primary" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export { ROLE_HOME };

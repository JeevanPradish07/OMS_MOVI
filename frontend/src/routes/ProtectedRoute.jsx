import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Maps real backend role slugs → dashboard paths
const ROLE_HOME = {
  'super-admin': '/admin/dashboard',
  'admin': '/admin/dashboard',
  'hr-manager': '/hr/dashboard',
  'pmo-lead': '/pmo/dashboard',
  'employee': '/employee/dashboard',
  'intern': '/intern/dashboard',
};

// allowedRoles expects real role slugs from backend (e.g. 'admin', 'hr-manager')
// For backwards-compat with short slugs used in App.jsx we also check legacy mappings
const LEGACY_SLUG_MAP = {
  admin: ['admin', 'super-admin'],
  hr: ['hr-manager'],
  pmo: ['pmo-lead'],
  employee: ['employee'],
  intern: ['intern'],
};

function resolveSlug(user) {
  if (!user) return null;
  // Real backend response: user.role is a populated object with .slug
  if (user.role?.slug) return user.role.slug;
  // Fallback: user.role is already a string slug
  if (typeof user.role === 'string') return user.role;
  return null;
}

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

  if (allowedRoles) {
    const userSlug = resolveSlug(user);

    // Super-admin bypasses all role restrictions
    if (userSlug === 'super-admin') return children;

    // Build the set of accepted real slugs from allowedRoles list
    const accepted = new Set(
      allowedRoles.flatMap((r) => LEGACY_SLUG_MAP[r] ?? [r])
    );

    if (!accepted.has(userSlug)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export { ROLE_HOME };

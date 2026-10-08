import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute — Guards routes based on authentication and role.
 *
 * Props:
 *   - role: "student" | "teacher"  (required)
 *
 * Behavior:
 *   - While auth state is loading → renders nothing (optional spinner)
 *   - If no user is authenticated → redirect to /login with return path
 *   - If user is authenticated but role doesn't match → redirect to /login
 *   - If user is authenticated with correct role → render nested <Outlet />
 */
function ProtectedRoute({ role }) {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  // Wait for auth state to restore from localStorage
  if (loading) {
    return null; // or a full-page spinner
  }

  if (!isAuthenticated) {
    // Save the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;


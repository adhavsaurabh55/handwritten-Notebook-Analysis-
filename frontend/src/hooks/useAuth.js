import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — Custom hook to consume AuthContext.
 *
 * Usage: const { user, token, isAuthenticated, userRole, loading, login, register, logout } = useAuth();
 *
 * Throws an error if used outside of <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default useAuth;


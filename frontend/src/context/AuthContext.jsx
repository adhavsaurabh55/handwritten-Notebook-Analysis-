import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';

/**
 * AuthContext — Provides authentication state and actions to the entire app.
 *
 * Provided state:
 *   - user         : Object | null  — Current user profile
 *   - token        : string | null  — Current JWT
 *   - isAuthenticated : boolean     — Whether a user is logged in
 *   - userRole     : string | null  — "student" | "teacher" | null
 *   - loading      : boolean        — True while restoring session on mount
 *
 * Provided actions:
 *   - login(email, password)   → logs in, sets user + token
 *   - register(data)           → registers, sets user + token
 *   - logout()                 → clears user + token
 */

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on mount ──────────────
  useEffect(() => {
    try {
      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch {
      // If parsing fails, clear everything
      authService.logout();
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Actions ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { user: loggedInUser, token: jwt } = await authService.login(email, password);
    setUser(loggedInUser);
    setToken(jwt);
    return loggedInUser;
  }, []);

  const register = useCallback(async (data) => {
    const { user: newUser, token: jwt } = await authService.register(data);
    setUser(newUser);
    setToken(jwt);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  // ── Derived values ───────────────────────────────────────────
  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      userRole: user?.role || null,
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


import axiosInstance from './axios';

/**
 * AuthService — Handles authentication operations.
 * Supports backend integration with fallback to local persistent storage.
 *
 * Storage pattern:
 *   - "token"            → JWT string (localStorage)
 *   - "user"             → JSON object with { id, name, email, role } (localStorage)
 *   - "registered_users" → Array of registered user objects (localStorage)
 */

const DUMMY_CREDENTIALS = {
  student: {
    email: 'student@test.com',
    password: 'student123',
    user: {
      id: 's-001',
      name: 'Alice Student',
      email: 'student@test.com',
      role: 'student',
    },
    token: 'dummy-jwt-student-token-abc123',
  },
  teacher: {
    email: 'teacher@test.com',
    password: 'teacher123',
    user: {
      id: 't-001',
      name: 'Bob Teacher',
      email: 'teacher@test.com',
      role: 'teacher',
    },
    token: 'dummy-jwt-teacher-token-xyz789',
  },
};

function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem('registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserLocally(user, password) {
  try {
    const users = getRegisteredUsers();
    const filtered = users.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase());
    filtered.push({ ...user, password });
    localStorage.setItem('registered_users', JSON.stringify(filtered));
  } catch (e) {
    console.error('Error saving user locally:', e);
  }
}

const authService = {
  /**
   * Log in a user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: Object, token: string}>}
   */
  async login(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = password || '';

    // 1. Try real backend API
    try {
      const response = await axiosInstance.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      if (response.data && response.data.user && response.data.token) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token };
      }
    } catch (apiError) {
      if (apiError.response && apiError.response.status === 401) {
        // Fallback to local check in case user was registered offline
      }
    }

    // 2. Fallback / Offline local authentication
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check built-in demo credentials
    for (const role of ['student', 'teacher']) {
      const creds = DUMMY_CREDENTIALS[role];
      if (creds.email.toLowerCase() === cleanEmail && creds.password === cleanPassword) {
        localStorage.setItem('token', creds.token);
        localStorage.setItem('user', JSON.stringify(creds.user));
        return { user: creds.user, token: creds.token };
      }
    }

    // Check locally registered users
    const registeredUsers = getRegisteredUsers();
    const match = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword,
    );

    if (match) {
      const userObj = {
        id: match.id,
        name: match.name,
        email: match.email,
        role: match.role || 'student',
      };
      const tokenStr = `dummy-jwt-${userObj.role}-token-${Date.now()}`;
      localStorage.setItem('token', tokenStr);
      localStorage.setItem('user', JSON.stringify(userObj));
      return { user: userObj, token: tokenStr };
    }

    throw new Error('Invalid email or password');
  },

  /**
   * Register a new user.
   * @param {Object} data — { name, email, password, role }
   * @returns {Promise<{user: Object, token: string}>}
   */
  async register(data) {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanName = (data.name || '').trim();
    const cleanRole = data.role || 'student';
    const cleanPassword = data.password || '';

    // 1. Try real backend API
    try {
      const response = await axiosInstance.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: cleanRole,
      });
      if (response.data && response.data.user && response.data.token) {
        const { user, token } = response.data;
        saveUserLocally(user, cleanPassword);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return { user, token };
      }
    } catch (apiError) {
      if (apiError.response && apiError.response.data && apiError.response.data.detail) {
        if (typeof apiError.response.data.detail === 'string') {
          throw new Error(apiError.response.data.detail);
        }
      }
    }

    // 2. Fallback / Offline local registration
    await new Promise((resolve) => setTimeout(resolve, 300));

    const registeredUsers = getRegisteredUsers();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: `${cleanRole === 'student' ? 's' : 't'}-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
    };
    const newToken = `dummy-jwt-${newUser.role}-token-${Date.now()}`;

    saveUserLocally(newUser, cleanPassword);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    return { user: newUser, token: newToken };
  },

  /**
   * Log out the current user — clears stored auth data.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get the current user from localStorage.
   * @returns {Object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Get the stored JWT token.
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Check if a user is currently authenticated (has a token).
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export default authService;

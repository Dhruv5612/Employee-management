/**
 * Session-Scoped Authentication Storage Service
 *
 * Enforces session-based token and user profile management so that closing the
 * browser tab or window automatically clears credentials. This prevents
 * automatic bypass to the protected /dashboard when revisiting the application.
 */

const isBrowser = typeof window !== 'undefined';

// Proactively clear any legacy persistent auth keys left over in localStorage
if (isBrowser) {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (err) {
    // Ignore storage access errors in restricted iframe/private mode
  }
}

export const authStorage = {
  /**
   * Retrieve active authentication token from session
   */
  getToken: () => {
    if (!isBrowser) return null;
    return sessionStorage.getItem('token');
  },

  /**
   * Store active authentication token for current browser session
   */
  setToken: (token) => {
    if (!isBrowser) return;
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
    // Ensure localStorage is cleared of any token
    try {
      localStorage.removeItem('token');
    } catch {}
  },

  /**
   * Retrieve active user profile from session
   */
  getUser: () => {
    if (!isBrowser) return null;
    try {
      const raw = sessionStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Store active user profile for current browser session
   */
  setUser: (user) => {
    if (!isBrowser) return;
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
    // Ensure localStorage is cleared of any user object
    try {
      localStorage.removeItem('user');
    } catch {}
  },

  /**
   * Clear all session and legacy local storage auth credentials
   */
  clear: () => {
    if (!isBrowser) return;
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {}
  },

  /**
   * Check if current session has a valid token
   */
  isAuthenticated: () => {
    if (!isBrowser) return false;
    return !!sessionStorage.getItem('token');
  },
};

export default authStorage;


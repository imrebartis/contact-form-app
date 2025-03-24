/**
 * Auth storage utility to handle authentication state persistence
 * across page refreshes and history navigation
 */
export const AuthStorage = {
  // Store auth data in sessionStorage
  storeAuthData(userData: {
    id: string;
    name: string;
    email: string;
    isAdmin?: boolean;
  }) {
    sessionStorage.setItem('auth_user', JSON.stringify(userData));
    sessionStorage.setItem('auth_timestamp', Date.now().toString());
  },

  // Get auth data from storage
  getAuthData() {
    const userData = sessionStorage.getItem('auth_user');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthData();
  },

  // Clear auth data on logout
  clearAuthData() {
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_timestamp');
  },
};

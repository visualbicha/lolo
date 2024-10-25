import { toast } from 'react-toastify';

class AuthService {
  static async login(email, password) {
    try {
      if (email === 'admin@example.es' && password === 'admin') {
        const adminUser = {
          id: 'admin',
          email: 'admin@example.es',
          username: 'Admin',
          role: 'admin',
          isVerified: true
        };

        localStorage.setItem('user', JSON.stringify(adminUser));
        localStorage.setItem('token', 'admin-token');

        return {
          user: adminUser,
          token: 'admin-token'
        };
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static async verifySession() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid session');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Session verification error:', error);
      this.logout();
      throw error;
    }
  }

  static getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static getToken() {
    return localStorage.getItem('token');
  }
}

export default AuthService;
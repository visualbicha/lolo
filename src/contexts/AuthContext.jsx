import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAudit } from './AuditContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const { addAuditLog } = useAudit();

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Demo admin login
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
        
        setUser(adminUser);
        setIsAuthenticated(true);

        addAuditLog({
          userId: 'admin',
          username: 'Admin',
          action: 'Login',
          details: 'Admin user logged in',
          status: 'success'
        });

        return { user: adminUser };
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      addAuditLog({
        action: 'Login',
        details: `Failed login attempt for email: ${email}`,
        status: 'error'
      });
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      if (user) {
        addAuditLog({
          userId: user.id,
          username: user.username,
          action: 'Logout',
          details: 'User logged out',
          status: 'success'
        });
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error during logout');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const updatedUser = { ...user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
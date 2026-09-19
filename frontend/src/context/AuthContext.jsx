import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../Services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to resolve role from user data and fallbacks
  const resolveRole = (userData) => {
    if (!userData) return 'USER';
    // 1. Direct role property (if string or object from backend)
    if (userData.role) {
      if (typeof userData.role === 'string') return userData.role.toUpperCase();
      if (userData.role.roleName) return userData.role.roleName.toUpperCase();
    }
    // 2. Email-based indicator (standard in PaySphere admin accounts)
    if (userData.email && userData.email.toLowerCase().includes('admin')) {
      return 'ADMIN';
    }
    // 3. Fallback to existing saved role in localStorage
    const savedRole = localStorage.getItem('role');
    if (savedRole) return savedRole.toUpperCase();

    // Default to USER
    return 'USER';
  };

  // Logout clears all stored session data
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  // Fetch current user details with the token
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return null;
    }

    try {
      const resp = await api.get('/users/me');
      const userData = resp.data;
      const resolvedRole = resolveRole(userData);

      setUser(userData);
      setRole(resolvedRole);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', resolvedRole);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout();
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initial session verification on app mount
  useEffect(() => {
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [token, refreshUser]);

  // Login handler
  const login = async (email, password) => {
    const resp = await api.post('/users/login', { email, password });
    const { token: receivedToken, user: userData } = resp.data;

    if (!receivedToken) {
      throw new Error('No authentication token received from server');
    }

    const resolvedRole = resolveRole(userData);

    // Save to local storage
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('role', resolvedRole);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }

    // Update state
    setToken(receivedToken);
    setRole(resolvedRole);
    setUser(userData);

    return { token: receivedToken, user: userData, role: resolvedRole };
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const value = {
    user,
    token,
    role,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    logout,
    refreshUser,
    updateUser,
    setRole: (newRole) => {
      localStorage.setItem('role', newRole);
      setRole(newRole);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

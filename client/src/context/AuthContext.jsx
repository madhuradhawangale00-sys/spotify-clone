import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spotify_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const API_BASE = 'http://localhost:5000/api/auth';

  // Fetch logged in user when token exists (Persist login state)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error verifying auth token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('spotify_token', data.token);
      localStorage.setItem('spotify_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('spotify_token', data.token);
      localStorage.setItem('spotify_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      authError,
      setAuthError,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

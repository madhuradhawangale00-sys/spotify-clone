import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spotify_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch logged-in user using Axios when token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        setUser(response.data);
      } catch (err) {
        console.error('Error verifying auth token:', err);
        logout();
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
      const response = await authApi.login(email, password);
      const data = response.data;

      setUser(data);
      setToken(data.token);
      localStorage.setItem('spotify_token', data.token);
      localStorage.setItem('spotify_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const response = await authApi.register(name, email, password);
      const data = response.data;

      setUser(data);
      setToken(data.token);
      localStorage.setItem('spotify_token', data.token);
      localStorage.setItem('spotify_user', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_user');
  };

  // Toggle Liked Song via API
  const handleToggleLikeSong = async (songId) => {
    if (!token) return;
    try {
      const response = await authApi.toggleLikeSong(songId);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Error toggling liked song:', err);
    }
  };

  // Add Recently Played via API
  const handleAddRecentlyPlayed = async (songId) => {
    if (!token) return;
    try {
      const response = await authApi.addRecentlyPlayed(songId);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Error recording recently played:', err);
    }
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
      handleToggleLikeSong,
      handleAddRecentlyPlayed,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

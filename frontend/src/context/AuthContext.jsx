import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, api } from '../services/api';
import { DEMO_USER } from '../services/demoData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('cengkihtrack_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cengkihtrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('cengkihtrack_demo_mode') === 'true';
  });

  // Periksa konektivitas backend saat aplikasi dimuat
  const checkBackendStatus = useCallback(async () => {
    try {
      // Cek endpoint sederhana (misal fetch root atau api auth)
      await api.get('/actuator/health', { timeout: 3000 });
      setBackendStatus('online');
    } catch (err) {
      if (err.status && err.status < 500) {
        // Jika ada status HTTP (meski 401/403/404), berarti backend aktif
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    }
  }, []);

  // Muat profil pengguna saat token ada
  useEffect(() => {
    const initializeAuth = async () => {
      checkBackendStatus();

      if (token && !isDemoMode) {
        try {
          const res = await authService.getProfile();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('cengkihtrack_user', JSON.stringify(res.data));
            setBackendStatus('online');
          }
        } catch (err) {
          console.warn('Gagal memverifikasi token ke backend:', err.message);
          if (err.isNetworkError) {
            setBackendStatus('offline');
          }
        }
      } else if (isDemoMode && !user) {
        setUser(DEMO_USER);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token, isDemoMode, checkBackendStatus]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      setIsDemoMode(false);
      localStorage.setItem('cengkihtrack_token', jwtToken);
      localStorage.setItem('cengkihtrack_user', JSON.stringify(userData));
      localStorage.removeItem('cengkihtrack_demo_mode');
      setBackendStatus('online');
      return res.data;
    }
    throw new Error(res.message || 'Login gagal');
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    if (res.success && res.data) {
      const { token: jwtToken, user: userData } = res.data;
      setToken(jwtToken);
      setUser(userData);
      setIsDemoMode(false);
      localStorage.setItem('cengkihtrack_token', jwtToken);
      localStorage.setItem('cengkihtrack_user', JSON.stringify(userData));
      localStorage.removeItem('cengkihtrack_demo_mode');
      setBackendStatus('online');
      return res.data;
    }
    throw new Error(res.message || 'Registrasi gagal');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('cengkihtrack_token');
    localStorage.removeItem('cengkihtrack_user');
    localStorage.removeItem('cengkihtrack_demo_mode');
  };

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('cengkihtrack_user', JSON.stringify(updatedUserData));
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setUser(DEMO_USER);
    localStorage.setItem('cengkihtrack_demo_mode', 'true');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('cengkihtrack_demo_mode');
    if (!token) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        backendStatus,
        isDemoMode,
        isAuthenticated: !!token || isDemoMode,
        login,
        register,
        logout,
        updateUser,
        enableDemoMode,
        disableDemoMode,
        checkBackendStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

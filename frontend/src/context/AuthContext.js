import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.profile()
        .then(({ data }) => setUser(data))
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('access_token',  data.access);
    localStorage.setItem('refresh_token', data.refresh);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.username}! 🎉`);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await authAPI.register(formData);
    toast.success('Account created! Please log in.');
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const updateUser = async (data) => {
    const { data: updated } = await authAPI.update(data);
    setUser(updated);
    toast.success('Profile updated!');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

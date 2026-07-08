import { createContext, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('sos_pharma_user')) || null
  );

  const login = async ({ email, password }) => {
    const res = await axiosInstance.post('/auth/login', { email, password });
    const { token, user: userData } = res.data.data;
    const role = userData.roles?.[0]?.name || 'patient';
    localStorage.setItem('sos_pharma_token', token);
    localStorage.setItem('sos_pharma_user', JSON.stringify({ ...userData, role }));
    setUser({ ...userData, role });
    return role;
  };

  const register = async (data) => {
    const res = await axiosInstance.post('/auth/register', data);
    const { token, user: userData } = res.data.data;
    const role = userData.roles?.[0]?.name || 'patient';
    localStorage.setItem('sos_pharma_token', token);
    localStorage.setItem('sos_pharma_user', JSON.stringify({ ...userData, role }));
    setUser({ ...userData, role });
    return role;
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout').catch(() => {});
    localStorage.removeItem('sos_pharma_token');
    localStorage.removeItem('sos_pharma_user');
    setUser(null);
  };

  const isAdmin = () => user?.role === 'administrateur';
  const isPharmacien = () => user?.role === 'pharmacien';
  const isPatient = () => user?.role === 'patient';
  const isConnecte = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isPharmacien, isPatient, isConnecte }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}

import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * @returns {{ user: object|null, login: function, register: function, logout: function, isAdmin: function, isPharmacien: function, isPatient: function, isConnecte: function }}
 */
export default function useAuth() {
  return useAuthContext();
}

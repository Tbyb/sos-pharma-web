import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * @param {{ role: string }} props
 */
export default function RoleRoute({ role }) {
  const { user, isConnecte } = useAuth();

  if (!isConnecte()) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    if (user.role === 'administrateur') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'pharmacien') return <Navigate to="/pharmacien/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

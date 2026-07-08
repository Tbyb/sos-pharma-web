import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { isConnecte } = useAuth();

  if (!isConnecte()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

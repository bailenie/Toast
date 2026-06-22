import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen dot-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 select-none animate-bounce">🦦</div>
          <p className="font-display font-bold text-sm text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

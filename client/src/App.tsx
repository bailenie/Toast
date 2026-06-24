import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { ActiveCircleProvider } from './contexts/ActiveCircleContext';
import { MainLayout } from './components/common/MainLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { ChatPage } from './pages/ChatPage';
import GamePage from './pages/GamePage';
import { SalaryPage } from './pages/SalaryPage';
import { HomePage } from './pages/HomePage';
import CircleManagePage from './pages/CircleManagePage';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐟</div>
          <p className="font-display text-ink">加载中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuthContext();

  return (
    <Routes>
      {/* 公开路由 */}
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />

      {/* 官网 — 公开访问 */}
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <HomePage />} />

      {/* 首页 — 需要登录 */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <ActiveCircleProvider>
              <MainLayout />
            </ActiveCircleProvider>
          </ProtectedRoute>
        }
      >
        {/* 默认显示蛐蛐间 */}
        <Route index element={<ChatPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="game" element={<GamePage />} />
        <Route path="circle-manage" element={<CircleManagePage />} />
        <Route path="salary" element={<SalaryPage />} />
      </Route>

      {/* 404 重定向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

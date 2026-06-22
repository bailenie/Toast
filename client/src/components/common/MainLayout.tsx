import { Outlet, useLocation } from 'react-router-dom';
import { useActiveCircle } from '../../contexts/ActiveCircleContext';
import { CircleSidebar } from '../circle/CircleSidebar';
import { NewUserGuide } from '../circle/NewUserGuide';
import Navbar from './Navbar';

export function MainLayout() {
  const { circles, isLoading } = useActiveCircle();
  const location = useLocation();

  // 窝囊费是个人功能，不需要鱼圈也能访问
  const isSalaryPage = location.pathname === '/home/salary';

  if (isLoading) {
    return (
      <div className="h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🐟</div>
          <p className="font-display text-ink">加载中...</p>
        </div>
      </div>
    );
  }

  // 新用户引导：没有鱼圈时显示（窝囊费页面除外）
  if (circles.length === 0 && !isSalaryPage) {
    return (
      <div className="h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <CircleSidebar />
          <NewUserGuide />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {!isSalaryPage && <CircleSidebar />}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

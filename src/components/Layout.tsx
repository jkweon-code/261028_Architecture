import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { pathname } = useLocation();
  const { error } = useAuth();

  // 페이지를 옮기면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 로그인 오류 안내 */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 text-sm text-red-700" role="alert">
          <p className="container-page py-3">{error}</p>
        </div>
      )}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

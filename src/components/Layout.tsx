import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import DevUserSwitcher from './DevUserSwitcher';

export default function Layout() {
  const { pathname } = useLocation();

  // 페이지를 옮기면 맨 위로 스크롤
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <Footer />
      {/* TODO(Phase2): 제거 */}
      {import.meta.env.DEV && <DevUserSwitcher />}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems, siteConfig } from '../config/site';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import Avatar from './Avatar';

export const roleLabels: Record<UserRole, string> = {
  admin: '교수',
  member: '구성원',
  pending: '승인 대기',
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // 모바일 메뉴에서 페이지를 고르면 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  // 스크롤하면 헤더 아래에 옅은 경계선
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 bg-white/85 backdrop-blur-md transition-shadow ${scrolled || open ? 'shadow-[0_1px_0_rgba(0,0,0,0.08)]' : ''}`}
    >
      <div className="container-page flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3">
          <Logo />
          <span className="flex flex-col leading-tight">
            <span className="text-[15px] font-bold tracking-tight text-neutral-900">{siteConfig.name}</span>
            <span className="text-[10.5px] font-medium tracking-[0.14em] text-neutral-500 uppercase">{siteConfig.nameEn}</span>
          </span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative px-3.5 py-2 text-sm transition-colors after:absolute after:inset-x-3.5 after:-bottom-[1px] after:h-[2px] after:origin-left after:bg-accent after:transition-transform ${
                  isActive
                    ? 'font-semibold text-neutral-900 after:scale-x-100'
                    : 'text-neutral-600 after:scale-x-0 hover:text-neutral-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <span className="mx-3 h-5 w-px bg-neutral-200" />
          <AuthButton />
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="-mr-2 rounded-full p-2 text-neutral-800 hover:bg-neutral-100 md:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav className="border-t border-neutral-100 bg-white md:hidden">
          <div className="container-page flex flex-col py-3">
            {navItems.map((item, i) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 border-b border-neutral-100 py-4 text-lg ${isActive ? 'font-semibold text-neutral-900' : 'text-neutral-700'}`
                }
              >
                <span className="text-xs text-accent tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="py-5">
              <AuthButton />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

/** 로고 표시: 포인트 색 사각형 안의 평면 기호 */
function Logo() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white transition-transform group-hover:rotate-[-4deg]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3.5" y="3.5" width="17" height="17" />
        <path d="M3.5 12h9v8.5M12.5 3.5V8" />
      </svg>
    </span>
  );
}

/** 로그인 버튼 또는 로그인한 사용자 표시 */
function AuthButton() {
  const { user, signInAvailable, signIn, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2.5 text-sm">
        <Avatar name={user.name} photo={user.photoURL} className="h-8 w-8 text-xs" />
        <span className="leading-tight">
          <span className="block font-medium text-neutral-900">{user.name}</span>
          <span className="block text-[11px] text-neutral-500">{roleLabels[user.role]}</span>
        </span>
        <button type="button" onClick={signOut} className="ml-2 text-xs text-neutral-500 underline-offset-4 hover:text-neutral-900 hover:underline">
          로그아웃
        </button>
      </div>
    );
  }

  // TODO(Phase2): signInAvailable 이 true 가 되면 버튼이 활성화됩니다.
  return (
    <span className="group relative inline-block" title={signInAvailable ? undefined : '준비 중'}>
      <button type="button" className="btn-secondary px-4 py-2" disabled={!signInAvailable} onClick={signIn}>
        <GoogleMark />
        Google 로그인
      </button>
      {!signInAvailable && (
        <span className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md bg-neutral-900 px-2.5 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          준비 중
        </span>
      )}
    </span>
  );
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

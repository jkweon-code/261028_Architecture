import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems, siteConfig } from '../config/site';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

export const roleLabels: Record<UserRole, string> = {
  admin: '교수',
  member: '구성원',
  pending: '승인 대기',
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // 모바일 메뉴에서 페이지를 고르면 메뉴 닫기
  useEffect(() => setOpen(false), [pathname]);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? 'font-semibold text-accent' : 'text-neutral-600 hover:text-neutral-900'}`;

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-base font-bold text-neutral-900">{siteConfig.name}</span>
          <span className="text-[11px] tracking-wide text-neutral-500">{siteConfig.nameEn}</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
          <AuthButton />
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav className="border-t border-neutral-200 bg-white md:hidden">
          <div className="container-page flex flex-col py-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={(s) => `${navClass(s)} py-3`}>
                {item.label}
              </NavLink>
            ))}
            <div className="border-t border-neutral-100 py-3">
              <AuthButton />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}

/** 로그인 버튼 또는 로그인한 사용자 표시 */
function AuthButton() {
  const { user, signInAvailable, signIn, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-neutral-700">
          {user.name}
          <span className="ml-1.5 badge bg-neutral-100 text-neutral-600">{roleLabels[user.role]}</span>
        </span>
        <button type="button" onClick={signOut} className="text-neutral-500 hover:text-neutral-900">
          로그아웃
        </button>
      </div>
    );
  }

  // TODO(Phase2): signInAvailable 이 true 가 되면 버튼이 활성화됩니다.
  return (
    <span className="group relative inline-block" title={signInAvailable ? undefined : '준비 중'}>
      <button type="button" className="btn-secondary py-1.5" disabled={!signInAvailable} onClick={signIn}>
        Google 로그인
      </button>
      {!signInAvailable && (
        <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded bg-neutral-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
          준비 중
        </span>
      )}
    </span>
  );
}

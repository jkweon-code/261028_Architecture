import { useState, type ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import PageHeader from './PageHeader';
import LockIcon from './LockIcon';

interface Props {
  allow: UserRole[]; // 들어올 수 있는 역할
  eyebrow: string;
  title: string;
}

/**
 * 역할에 따라 안쪽 화면을 보여 주거나 안내를 보여 주는 입구.
 * 화면에서만 막는 것이므로 실제 데이터는 firestore.rules 가 따로 보호합니다.
 */
export default function RequireRole({ allow, eyebrow, title }: Props) {
  const { user, loading, signInAvailable, signIn, refreshUser } = useAuth();
  const [checking, setChecking] = useState(false);

  if (loading) return <p className="container-page py-16 text-sm text-neutral-500">불러오는 중…</p>;
  if (user && allow.includes(user.role)) return <Outlet />;

  let heading = '로그인이 필요합니다';
  let message = '연구실 구성원만 이용할 수 있습니다. Google 계정으로 로그인해 주세요.';
  let action: ReactNode = signInAvailable ? (
    <button type="button" className="btn-primary mt-6" onClick={signIn}>
      Google 로그인
    </button>
  ) : null;

  if (!user && !signInAvailable) {
    message = '연구실 구성원만 이용할 수 있습니다. 로그인 기능이 아직 설정되지 않았습니다.';
  } else if (user?.role === 'pending') {
    heading = '승인 대기 중입니다';
    message = '가입 요청이 접수되었습니다. 교수님이 승인하시면 토론 게시판을 이용할 수 있습니다.';
    action = (
      <button
        type="button"
        className="btn-secondary mt-6"
        disabled={checking}
        onClick={async () => {
          setChecking(true);
          await refreshUser();
          setChecking(false);
        }}
      >
        {checking ? '확인 중…' : '승인 여부 다시 확인'}
      </button>
    );
  } else if (user) {
    heading = '접근 권한이 없습니다';
    message = '이 페이지는 관리자만 이용할 수 있습니다.';
    action = null;
  }

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-xl border border-neutral-200 p-10 text-center">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <LockIcon />
          </span>
          <h2 className="text-lg font-bold text-neutral-900">{heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{message}</p>
          {action}
        </div>
      </div>
    </>
  );
}

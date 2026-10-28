import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from './PageHeader';

/**
 * 토론 게시판 입구. 승인된 구성원(admin, member)만 안쪽 화면을 보여 주고,
 * 그 외에는 상황에 맞는 안내를 보여 줍니다.
 * (화면에서만 막는 것이므로, 2단계에서는 firestore.rules 로도 반드시 막습니다)
 */
export default function RequireRole() {
  const { user, loading, canUseDiscussion, signInAvailable } = useAuth();

  if (loading) return <p className="container-page py-16 text-sm text-neutral-500">불러오는 중…</p>;
  if (canUseDiscussion) return <Outlet />;

  let title = '로그인이 필요합니다';
  let message = '토론 게시판은 연구실 구성원만 이용할 수 있습니다. Google 계정으로 로그인해 주세요.';
  if (!user && !signInAvailable) {
    message = '토론 게시판은 연구실 구성원만 이용할 수 있습니다. 로그인 기능은 현재 준비 중입니다.';
  }
  if (user?.role === 'pending') {
    title = '승인 대기 중입니다';
    message = '가입 요청이 접수되었습니다. 교수님이 승인하시면 토론 게시판을 이용할 수 있습니다.';
  }

  return (
    <>
      <PageHeader title="토론" />
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-lg border border-neutral-200 p-8 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">{message}</p>
        </div>
      </div>
    </>
  );
}

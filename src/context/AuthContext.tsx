// ─────────────────────────────────────────────────────────────
// 로그인 상태와 사용자 역할을 사이트 전체에 알려 주는 곳
// - Google 로그인(Firebase Authentication)
// - 역할은 Firestore users/{uid} 문서의 role: admin(교수), member(승인된 대학원생), pending(승인 대기)
// - 여기서의 권한 확인은 화면 표시용입니다. 실제 보호는 firestore.rules 가 담당합니다.
// ─────────────────────────────────────────────────────────────

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { firebaseReady, requireAuth } from '../lib/firebase';
import { getOrCreateUser } from '../services/userService';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null; // null 이면 로그인하지 않은 상태
  loading: boolean; // 로그인 상태를 확인하는 중인지
  /** 로그인 기능을 쓸 수 있는지 (Firebase 설정값이 없으면 false) */
  signInAvailable: boolean;
  /** 로그인·사용자 정보 오류 안내 문구 */
  error: string;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  /** 역할을 다시 읽어 오기 (승인 대기 중인 사람이 승인 여부를 확인할 때) */
  refreshUser: () => Promise<void>;
  /** 토론 게시판을 읽고 쓸 수 있는지 (admin, member) */
  canUseDiscussion: boolean;
  /** 이 글쓴이의 글/댓글을 고치거나 지울 수 있는지 (본인 또는 admin) */
  canManage: (authorUid: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(firebaseReady);
  const [error, setError] = useState('');

  const loadUser = useCallback(async () => {
    const fbUser = firebaseReady ? requireAuth().currentUser : null;
    if (!fbUser) {
      setUser(null);
      return;
    }
    try {
      setUser(await getOrCreateUser(fbUser));
      setError('');
    } catch (e) {
      console.error('[사용자 정보 오류]', e);
      setUser(null);
      setError('사용자 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, []);

  // 로그인 상태 변화 감지 (새로고침해도 로그인 유지)
  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(requireAuth(), async () => {
      setLoading(true);
      await loadUser();
      setLoading(false);
    });
  }, [loadUser]);

  const signIn = async () => {
    setError('');
    try {
      await signInWithPopup(requireAuth(), new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') return;
      if (code === 'auth/popup-blocked') setError('팝업이 차단되었습니다. 브라우저 주소창에서 팝업을 허용해 주세요.');
      else if (code === 'auth/unauthorized-domain') setError('이 주소는 Firebase 승인된 도메인에 등록되어 있지 않습니다.');
      else setError('로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      console.error('[로그인 오류]', e);
    }
  };

  const signOut = async () => {
    await fbSignOut(requireAuth());
  };

  const canUseDiscussion = user?.role === 'admin' || user?.role === 'member';

  const value: AuthContextValue = {
    user,
    loading,
    signInAvailable: firebaseReady,
    error,
    signIn,
    signOut,
    refreshUser: loadUser,
    canUseDiscussion,
    canManage: (authorUid) => canUseDiscussion && (user?.role === 'admin' || user?.uid === authorUid),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}

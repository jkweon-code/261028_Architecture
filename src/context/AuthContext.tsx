// ─────────────────────────────────────────────────────────────
// 로그인 상태와 사용자 역할을 사이트 전체에 알려 주는 곳
// - 역할: admin(교수), member(승인된 대학원생), pending(승인 대기)
// - 1단계: 실제 로그인은 없고, 개발 모드에서만 가짜 사용자로 바꿔 볼 수 있습니다.
// TODO(Phase2): Firebase Auth(signInWithPopup) + Firestore users/{uid} 로 교체하고
//               개발용 가짜 사용자(devUsers, switchDevUser)는 제거합니다.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null; // null 이면 로그인하지 않은 상태
  loading: boolean; // 로그인 상태를 확인하는 중인지
  /** 실제 로그인이 가능한지 (1단계는 false → 로그인 버튼 비활성화) */
  signInAvailable: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  /** 토론 게시판을 읽고 쓸 수 있는지 (admin, member) */
  canUseDiscussion: boolean;
  /** 이 글쓴이의 글/댓글을 고치거나 지울 수 있는지 (본인 또는 admin) */
  canManage: (authorUid: string) => boolean;

  // ── 개발 모드 전용 ──
  devUsers: User[];
  switchDevUser: (uid: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// 개발 모드에서 역할별 화면을 확인하기 위한 가짜 사용자들
// TODO(Phase2): 제거
const DEV_USERS: User[] = [
  { uid: 'dev-admin', name: '홍길동', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01T00:00:00.000Z' },
  { uid: 'dev-member', name: '김연구', email: 'member@example.com', role: 'member', createdAt: '2026-01-01T00:00:00.000Z' },
  { uid: 'dev-member-2', name: '이설계', email: 'member2@example.com', role: 'member', createdAt: '2026-01-01T00:00:00.000Z' },
  { uid: 'dev-pending', name: '신입생', email: 'pending@example.com', role: 'pending', createdAt: '2026-01-01T00:00:00.000Z' },
];
const DEV_USER_KEY = 'archlab.devUser';

function initialDevUser(): User | null {
  // 배포된 사이트(운영 모드)에서는 항상 비로그인 상태
  if (!import.meta.env.DEV) return null;
  const saved = localStorage.getItem(DEV_USER_KEY);
  if (saved === 'none') return null;
  // 처음에는 교수(admin)로 시작
  return DEV_USERS.find((u) => u.uid === saved) ?? DEV_USERS[0];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initialDevUser);

  const switchDevUser = (uid: string | null) => {
    if (!import.meta.env.DEV) return;
    localStorage.setItem(DEV_USER_KEY, uid ?? 'none');
    setUser(DEV_USERS.find((u) => u.uid === uid) ?? null);
  };

  const canUseDiscussion = user?.role === 'admin' || user?.role === 'member';

  const value: AuthContextValue = {
    user,
    loading: false,
    signInAvailable: false, // TODO(Phase2): true
    // TODO(Phase2): signInWithPopup(auth, new GoogleAuthProvider())
    signIn: async () => {},
    // TODO(Phase2): firebase signOut(auth)
    signOut: async () => switchDevUser(null),
    canUseDiscussion,
    canManage: (authorUid) =>
      canUseDiscussion && (user?.role === 'admin' || user?.uid === authorUid),
    devUsers: import.meta.env.DEV ? DEV_USERS : [],
    switchDevUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 는 AuthProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}

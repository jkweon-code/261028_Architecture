// ─────────────────────────────────────────────────────────────
// 사용자 문서 (Firestore users/{uid}) 읽기·쓰기
// ─────────────────────────────────────────────────────────────

import type { User as FirebaseUser } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, type DocumentSnapshot } from 'firebase/firestore';
import { requireDb } from '../lib/firebase';
import { toIso } from '../lib/timestamp';
import type { User, UserRole } from '../types';

function fromDoc(snap: DocumentSnapshot): User {
  const d = snap.data({ serverTimestamps: 'estimate' })!;
  return {
    uid: snap.id,
    name: d.name,
    email: d.email,
    photoURL: d.photoURL || undefined,
    role: d.role,
    createdAt: toIso(d.createdAt),
  };
}

/**
 * 로그인한 사람의 users 문서를 가져옵니다.
 * 처음 로그인이면 role='pending'(승인 대기)으로 새로 만듭니다.
 */
export async function getOrCreateUser(fbUser: FirebaseUser): Promise<User> {
  const ref = doc(requireDb(), 'users', fbUser.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return fromDoc(snap);

  await setDoc(ref, {
    name: fbUser.displayName || fbUser.email?.split('@')[0] || '이름 없음',
    email: fbUser.email ?? '',
    photoURL: fbUser.photoURL ?? '',
    role: 'pending',
    createdAt: serverTimestamp(),
  });
  return fromDoc(await getDoc(ref));
}

/** (관리자) 전체 사용자 목록, 최근 가입 순 */
export async function listUsers(): Promise<User[]> {
  const snap = await getDocs(query(collection(requireDb(), 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map(fromDoc);
}

/** (관리자) 역할 변경 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(requireDb(), 'users', uid), { role });
}

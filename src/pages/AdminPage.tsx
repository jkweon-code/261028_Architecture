import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import { roleLabels } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { listUsers, updateUserRole } from '../services/userService';
import { formatDate } from '../lib/format';
import type { User, UserRole } from '../types';

type Filter = 'pending' | 'all';

/** 관리자(교수) 전용: 가입한 사용자의 역할을 바꿔 승인합니다. */
export default function AdminPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[] | null>(null);
  const [filter, setFilter] = useState<Filter>('pending');
  const [savingUid, setSavingUid] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch(() => setError('사용자 목록을 불러오지 못했습니다.'));
  }, []);

  const changeRole = async (target: User, role: UserRole) => {
    if (target.role === role) return;
    if (role === 'pending' && !confirm(`${target.name} 님을 승인 대기 상태로 되돌릴까요? 토론 게시판을 이용할 수 없게 됩니다.`)) return;
    if (role === 'admin' && !confirm(`${target.name} 님에게 관리자 권한(모든 글 관리, 사용자 승인)을 줄까요?`)) return;
    setSavingUid(target.uid);
    setError('');
    try {
      await updateUserRole(target.uid, role);
      setUsers((list) => list?.map((u) => (u.uid === target.uid ? { ...u, role } : u)) ?? null);
    } catch {
      setError('역할을 바꾸지 못했습니다.');
    } finally {
      setSavingUid('');
    }
  };

  const pendingCount = users?.filter((u) => u.role === 'pending').length ?? 0;
  const shown = users?.filter((u) => filter === 'all' || u.role === 'pending') ?? [];

  return (
    <>
      <PageHeader eyebrow="Admin" title="사용자 관리" description="Google로 처음 로그인한 사람은 '승인 대기'로 등록됩니다. 연구실 구성원이면 '구성원'으로 바꿔 승인하세요." />
      <div className="container-page py-10">
        <div className="flex flex-wrap gap-2" role="tablist">
          {(
            [
              ['pending', `승인 대기 ${pendingCount}`],
              ['all', `전체 ${users?.length ?? 0}`],
            ] as [Filter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === value ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
        {users === null && !error && <p className="mt-8 text-sm text-neutral-500">불러오는 중…</p>}
        {users && shown.length === 0 && (
          <p className="mt-8 rounded-xl border border-dashed border-neutral-300 py-16 text-center text-sm text-neutral-500">
            {filter === 'pending' ? '승인을 기다리는 사람이 없습니다.' : '가입한 사용자가 없습니다.'}
          </p>
        )}

        {shown.length > 0 && (
          <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-900">
            {shown.map((u) => {
              const isMe = u.uid === me?.uid;
              return (
                <li key={u.uid} className="flex flex-wrap items-center gap-4 py-4 sm:px-2">
                  <Avatar name={u.name} photo={u.photoURL} className="h-10 w-10 text-sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-900">
                      {u.name} {isMe && <span className="text-xs text-neutral-400">(나)</span>}
                    </p>
                    <p className="truncate text-sm text-neutral-500">{u.email}</p>
                    <p className="text-xs text-neutral-400">가입 {formatDate(u.createdAt)}</p>
                  </div>
                  {u.role === 'pending' && (
                    <button type="button" className="btn-primary px-4 py-2" disabled={savingUid === u.uid} onClick={() => changeRole(u, 'member')}>
                      승인
                    </button>
                  )}
                  <label className="sr-only" htmlFor={`role-${u.uid}`}>
                    역할
                  </label>
                  <select
                    id={`role-${u.uid}`}
                    className="input w-32"
                    value={u.role}
                    // 실수로 내 관리자 권한을 없애지 않도록 내 역할은 바꿀 수 없음
                    disabled={isMe || savingUid === u.uid}
                    onChange={(e) => changeRole(u, e.target.value as UserRole)}
                  >
                    {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                      <option key={r} value={r}>
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

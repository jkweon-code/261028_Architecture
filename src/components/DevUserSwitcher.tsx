// 개발 모드(npm run dev)에서만 보이는 역할 전환 패널. 배포된 사이트에는 나타나지 않습니다.
// TODO(Phase2): 실제 로그인으로 바뀌면 이 파일을 삭제합니다.
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { roleLabels } from './Header';

export default function DevUserSwitcher() {
  const { user, devUsers, switchDevUser } = useAuth();
  const [open, setOpen] = useState(false);

  const choose = (uid: string | null) => {
    switchDevUser(uid);
    setOpen(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 text-xs">
      {open && (
        <div className="mb-2 w-52 rounded-lg border border-amber-300 bg-amber-50 p-3 shadow-lg">
          <p className="mb-2 font-semibold text-amber-900">개발용 사용자 전환</p>
          <ul className="space-y-1">
            {devUsers.map((u) => (
              <li key={u.uid}>
                <button
                  type="button"
                  onClick={() => choose(u.uid)}
                  className={`w-full rounded px-2 py-1 text-left hover:bg-amber-100 ${user?.uid === u.uid ? 'bg-amber-200 font-semibold' : ''}`}
                >
                  {u.name} <span className="text-amber-700">({roleLabels[u.role]})</span>
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => choose(null)}
                className={`w-full rounded px-2 py-1 text-left hover:bg-amber-100 ${user === null ? 'bg-amber-200 font-semibold' : ''}`}
              >
                비로그인
              </button>
            </li>
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="ml-auto block rounded-full border border-amber-300 bg-amber-100 px-3 py-2 font-medium text-amber-900 shadow"
      >
        DEV · {user ? `${user.name}(${roleLabels[user.role]})` : '비로그인'}
      </button>
    </div>
  );
}

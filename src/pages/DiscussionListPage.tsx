import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Avatar from '../components/Avatar';
import { findResearch } from '../data/research';
import { discussionService, type PostCursor } from '../services/discussionService';
import { formatDate } from '../lib/format';
import type { Post } from '../types';

// 한 번에 불러오는 글 수 (2단계에서 Firestore 무료 읽기 한도를 아끼기 위해 20개씩)
const PAGE_SIZE = 20;

export default function DiscussionListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<PostCursor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (from: PostCursor | null) => {
    setLoading(true);
    setError('');
    try {
      const page = await discussionService.listPosts(PAGE_SIZE, from);
      setPosts((prev) => (from ? [...prev, ...page.posts] : page.posts));
      setCursor(page.nextCursor);
    } catch {
      setError('글 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(null);
  }, []);

  return (
    <>
      <PageHeader eyebrow="Discussion" title="토론" description="연구 결과와 아이디어를 함께 나누는 공간입니다.">
        <Link to="/discussion/new" className="btn-primary self-start">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          글쓰기
        </Link>
      </PageHeader>
      <div className="container-page py-10">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {!loading && posts.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-neutral-300 py-20 text-center text-sm text-neutral-500">
            첫 번째 글을 남겨 보세요.
          </div>
        )}

        {posts.length > 0 && (
          <ul className="divide-y divide-neutral-200 border-y border-neutral-900">
            {posts.map((p) => {
              const research = findResearch(p.relatedResearchId);
              return (
                <li key={p.id}>
                  <Link to={`/discussion/${p.id}`} className="group flex items-center gap-5 px-1 py-5 transition-colors hover:bg-neutral-50 sm:px-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge bg-accent/10 text-accent">{p.category}</span>
                        {research && (
                          <span className="truncate text-xs text-neutral-500">
                            <span className="text-neutral-400">관련 연구 ·</span> {research.title}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[17px] font-semibold text-neutral-900 group-hover:text-accent">{p.title}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-500">{p.body}</p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-3 text-right sm:flex">
                      <div className="text-xs leading-relaxed">
                        <p className="font-medium text-neutral-800">{p.authorName}</p>
                        <p className="text-neutral-500 tabular-nums">{formatDate(p.createdAt)}</p>
                      </div>
                      <Avatar name={p.authorName} />
                    </div>
                  </Link>
                  <p className="-mt-3 px-1 pb-4 text-xs text-neutral-500 sm:hidden">
                    {p.authorName} · {formatDate(p.createdAt)}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-8 text-center">
          {loading && <p className="text-sm text-neutral-500">불러오는 중…</p>}
          {!loading && cursor && (
            <button type="button" className="btn-secondary" onClick={() => load(cursor)}>
              더 보기
            </button>
          )}
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
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
      <PageHeader title="토론" description="연구 결과와 아이디어를 함께 나누는 공간입니다.">
        <Link to="/discussion/new" className="btn-primary self-start">
          글쓰기
        </Link>
      </PageHeader>
      <div className="container-page py-8">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {!loading && posts.length === 0 && !error && (
          <p className="py-16 text-center text-sm text-neutral-500">첫 번째 글을 남겨 보세요.</p>
        )}

        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {posts.map((p) => {
            const research = findResearch(p.relatedResearchId);
            return (
              <li key={p.id}>
                <Link to={`/discussion/${p.id}`} className="block px-1 py-4 hover:bg-neutral-50 sm:px-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge bg-accent/10 text-accent">{p.category}</span>
                    {research && <span className="truncate text-xs text-neutral-500">관련 연구: {research.title}</span>}
                  </div>
                  <p className="mt-1.5 font-medium text-neutral-900">{p.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {p.authorName} · {formatDate(p.createdAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-center">
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

import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findResearch } from '../data/research';
import { useAuth } from '../context/AuthContext';
import { discussionService } from '../services/discussionService';
import { formatDateTime } from '../lib/format';
import type { Comment, Post } from '../types';
import NotFoundPage from './NotFoundPage';

export default function PostDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user, canManage } = useAuth();

  const [post, setPost] = useState<Post | null | undefined>(undefined); // undefined = 불러오는 중
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    discussionService.getPost(id).then((p) => alive && setPost(p));
    return () => {
      alive = false;
    };
  }, [id]);

  // 댓글은 실시간 구독 (2단계에서 Firestore onSnapshot)
  useEffect(() => discussionService.subscribeComments(id, setComments), [id]);

  if (post === undefined) return <p className="container-page py-16 text-sm text-neutral-500">불러오는 중…</p>;
  if (post === null) return <NotFoundPage />;

  const research = findResearch(post.relatedResearchId);
  const edited = post.updatedAt !== post.createdAt;

  const handleDelete = async () => {
    if (!confirm('이 글과 모든 댓글을 삭제할까요?')) return;
    setBusy(true);
    try {
      await discussionService.deletePost(post.id);
      navigate('/discussion');
    } catch {
      alert('삭제하지 못했습니다.');
      setBusy(false);
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    const body = commentBody.trim();
    if (!user || !body) return;
    setBusy(true);
    try {
      await discussionService.addComment(post.id, body, user);
      setCommentBody('');
    } catch {
      alert('댓글을 등록하지 못했습니다.');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('댓글을 삭제할까요?')) return;
    try {
      await discussionService.deleteComment(post.id, commentId);
    } catch {
      alert('댓글을 삭제하지 못했습니다.');
    }
  };

  return (
    <article className="container-page max-w-3xl py-10">
      <Link to="/discussion" className="text-sm text-neutral-500 hover:text-accent">
        ← 토론 목록
      </Link>

      <header className="mt-6 border-b border-neutral-200 pb-5">
        <span className="badge bg-accent/10 text-accent">{post.category}</span>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">{post.title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {post.authorName} · {formatDateTime(post.createdAt)}
          {edited && <span> (수정됨 {formatDateTime(post.updatedAt)})</span>}
        </p>
        {research && (
          <p className="mt-3 text-sm">
            <span className="text-neutral-500">관련 연구: </span>
            <Link to={`/research/${research.id}`} className="text-accent hover:underline">
              {research.title}
            </Link>
          </p>
        )}
      </header>

      <div className="py-8 text-[15px] leading-7 whitespace-pre-wrap text-neutral-800">{post.body}</div>

      {canManage(post.authorUid) && (
        <div className="flex gap-2 border-b border-neutral-200 pb-8">
          <Link to={`/discussion/${post.id}/edit`} className="btn-secondary">
            수정
          </Link>
          <button type="button" className="btn-danger" onClick={handleDelete} disabled={busy}>
            삭제
          </button>
        </div>
      )}

      {/* 댓글 */}
      <section className="mt-8">
        <h2 className="text-base font-semibold text-neutral-900">댓글 {comments.length}</h2>
        <ul className="mt-4 space-y-4">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg bg-neutral-50 px-4 py-3">
              <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
                <span>
                  <span className="font-medium text-neutral-700">{c.authorName}</span> · {formatDateTime(c.createdAt)}
                </span>
                {canManage(c.authorUid) && (
                  <button type="button" onClick={() => handleDeleteComment(c.id)} className="hover:text-red-600">
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-sm whitespace-pre-wrap text-neutral-800">{c.body}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddComment} className="mt-6">
          <label htmlFor="comment" className="sr-only">
            댓글
          </label>
          <textarea
            id="comment"
            className="input min-h-24"
            placeholder="댓글을 입력하세요"
            maxLength={2000}
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <div className="mt-2 text-right">
            <button type="submit" className="btn-primary" disabled={busy || !commentBody.trim()}>
              댓글 등록
            </button>
          </div>
        </form>
      </section>
    </article>
  );
}

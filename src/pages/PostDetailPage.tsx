import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { findResearch } from '../data/research';
import { useAuth } from '../context/AuthContext';
import { discussionService } from '../services/discussionService';
import { formatDateTime } from '../lib/format';
import type { Comment, Post } from '../types';
import NotFoundPage from './NotFoundPage';
import Avatar from '../components/Avatar';

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
      <Link to="/discussion" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← 토론 목록
      </Link>

      <header className="mt-8 border-b border-neutral-200 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge bg-accent/10 text-accent">{post.category}</span>
          {research && (
            <Link to={`/research/${research.id}`} className="tag hover:border-accent hover:text-accent">
              관련 연구 · {research.title}
            </Link>
          )}
        </div>
        <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-neutral-900">{post.title}</h1>
        <div className="mt-6 flex items-center gap-3">
          <Avatar name={post.authorName} className="h-10 w-10 text-sm" />
          <div className="text-sm leading-tight">
            <p className="font-medium text-neutral-900">{post.authorName}</p>
            <p className="mt-1 text-xs text-neutral-500 tabular-nums">
              {formatDateTime(post.createdAt)}
              {edited && <span> · 수정됨 {formatDateTime(post.updatedAt)}</span>}
            </p>
          </div>
          {canManage(post.authorUid) && (
            <div className="ml-auto flex gap-2">
              <Link to={`/discussion/${post.id}/edit`} className="btn-secondary px-4 py-1.5">
                수정
              </Link>
              <button type="button" className="btn-danger px-4 py-1.5" onClick={handleDelete} disabled={busy}>
                삭제
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="py-10 text-base leading-8 whitespace-pre-wrap text-neutral-800">{post.body}</div>

      {/* 댓글 */}
      <section className="rounded-xl bg-neutral-50 p-5 sm:p-8">
        <h2 className="font-bold text-neutral-900">
          댓글 <span className="text-accent tabular-nums">{comments.length}</span>
        </h2>
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Avatar name={c.authorName} className="h-8 w-8 text-xs" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-500">
                  <span>
                    <span className="font-semibold text-neutral-800">{c.authorName}</span>
                    <span className="ml-2 tabular-nums">{formatDateTime(c.createdAt)}</span>
                  </span>
                  {canManage(c.authorUid) && (
                    <button type="button" onClick={() => handleDeleteComment(c.id)} className="hover:text-red-600">
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-1.5 rounded-lg rounded-tl-none bg-white px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-neutral-800 ring-1 ring-neutral-200">
                  {c.body}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddComment} className="mt-8 flex gap-3">
          {user && <Avatar name={user.name} photo={user.photoURL} className="hidden h-8 w-8 text-xs sm:inline-flex" />}
          <div className="flex-1">
            <label htmlFor="comment" className="sr-only">
              댓글
            </label>
            <textarea
              id="comment"
              className="input min-h-24 resize-y"
              placeholder="댓글을 입력하세요"
              maxLength={2000}
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <div className="mt-2 text-right">
              <button type="submit" className="btn-primary px-4 py-2" disabled={busy || !commentBody.trim()}>
                댓글 등록
              </button>
            </div>
          </div>
        </form>
      </section>
    </article>
  );
}

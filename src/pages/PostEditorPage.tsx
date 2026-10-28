import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { siteConfig, type PostCategory } from '../config/site';
import { findResearch, researchList } from '../data/research';
import { useAuth } from '../context/AuthContext';
import { discussionService } from '../services/discussionService';
import type { PostInput } from '../types';
import NotFoundPage from './NotFoundPage';

// 입력 길이 제한 (2단계 firestore.rules 에서도 같은 값으로 검사할 예정)
const TITLE_MAX = 100;
const BODY_MAX = 10000;

/** 글쓰기(/discussion/new)와 글 수정(/discussion/:id/edit)을 함께 처리 */
export default function PostEditorPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, canManage } = useAuth();

  const [form, setForm] = useState<PostInput>({
    title: '',
    body: '',
    category: siteConfig.postCategories[0],
    // 연구 상세 페이지의 "토론 글쓰기"로 들어오면 관련 연구가 미리 선택됨
    relatedResearchId: findResearch(searchParams.get('research') ?? undefined)?.id,
  });
  const [status, setStatus] = useState<'loading' | 'ready' | 'notFound' | 'forbidden'>(isEdit ? 'loading' : 'ready');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 수정 모드: 기존 글 불러오기
  useEffect(() => {
    if (!id) return;
    discussionService.getPost(id).then((post) => {
      if (!post) return setStatus('notFound');
      if (!canManage(post.authorUid)) return setStatus('forbidden');
      setForm({ title: post.title, body: post.body, category: post.category, relatedResearchId: post.relatedResearchId });
      setStatus('ready');
    });
    // canManage 는 로그인 사용자가 바뀔 때만 달라지므로 user 를 기준으로 다시 확인
  }, [id, user]);

  if (status === 'loading') return <p className="container-page py-16 text-sm text-neutral-500">불러오는 중…</p>;
  if (status === 'notFound') return <NotFoundPage />;
  if (status === 'forbidden') {
    return (
      <div className="container-page py-16 text-center text-sm text-neutral-600">
        본인이 쓴 글만 수정할 수 있습니다.{' '}
        <Link to={`/discussion/${id}`} className="text-accent hover:underline">
          글로 돌아가기
        </Link>
      </div>
    );
  }

  const update = <K extends keyof PostInput>(key: K, value: PostInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const input: PostInput = {
      ...form,
      title: form.title.trim(),
      body: form.body.trim(),
      relatedResearchId: form.relatedResearchId || undefined,
    };
    if (!input.title || !input.body) return setError('제목과 내용을 입력해 주세요.');
    if (!user) return setError('로그인이 필요합니다.');

    setSaving(true);
    setError('');
    try {
      const saved = id ? await discussionService.updatePost(id, input) : await discussionService.createPost(input, user);
      navigate(`/discussion/${saved.id}`, { replace: true });
    } catch {
      setError('저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Discussion" title={isEdit ? '글 수정' : '글쓰기'} />
      <form onSubmit={handleSubmit} className="container-page max-w-3xl space-y-6 py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              분류
            </label>
            <select
              id="category"
              className="input"
              value={form.category}
              onChange={(e) => update('category', e.target.value as PostCategory)}
            >
              {siteConfig.postCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="research" className="label">
              관련 연구 <span className="font-normal text-neutral-400">(선택)</span>
            </label>
            <select
              id="research"
              className="input"
              value={form.relatedResearchId ?? ''}
              onChange={(e) => update('relatedResearchId', e.target.value || undefined)}
            >
              <option value="">선택 안 함</option>
              {researchList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="label">
            제목
          </label>
          <input
            id="title"
            className="input py-3 text-base font-medium"
            maxLength={TITLE_MAX}
            placeholder="제목을 입력하세요"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="body" className="label">
            내용
          </label>
          <textarea
            id="body"
            className="input min-h-80 resize-y leading-relaxed"
            maxLength={BODY_MAX}
            value={form.body}
            onChange={(e) => update('body', e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-neutral-400">
            {form.body.length.toLocaleString()} / {BODY_MAX.toLocaleString()}
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-neutral-200 pt-6">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
            취소
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? '저장 중…' : isEdit ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </>
  );
}

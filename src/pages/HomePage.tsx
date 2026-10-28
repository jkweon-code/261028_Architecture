import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../config/site';
import { researchList } from '../data/research';
import { useAuth } from '../context/AuthContext';
import { discussionService } from '../services/discussionService';
import { formatDate } from '../lib/format';
import type { Post } from '../types';

export default function HomePage() {
  const featured = researchList.filter((r) => r.featured);

  return (
    <>
      {/* 연구실 소개 */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="container-page py-16 sm:py-24">
          <p className="text-sm font-medium text-accent">{siteConfig.affiliation}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{siteConfig.name}</h1>
          <p className="mt-4 text-lg text-neutral-700">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-600">{siteConfig.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/research" className="btn-primary">
              연구 보기
            </Link>
            <Link to="/people" className="btn-secondary">
              구성원
            </Link>
          </div>
        </div>
      </section>

      {/* 주요 연구 분야 */}
      <section className="container-page py-14">
        <SectionTitle title="주요 연구 분야" to="/research" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((r) => (
            <Link key={r.id} to={`/research/${r.id}`} className="card-link">
              <p className="text-xs text-neutral-500">{r.period}</p>
              <h3 className="mt-2 font-semibold text-neutral-900">{r.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{r.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.keywords.map((k) => (
                  <span key={k} className="badge bg-neutral-100 text-neutral-600">
                    {k}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 최근 토론글 */}
      <section className="container-page pb-6">
        <SectionTitle title="최근 토론" to="/discussion" />
        <RecentPosts />
      </section>
    </>
  );
}

function SectionTitle({ title, to }: { title: string; to: string }) {
  return (
    <div className="mb-5 flex items-baseline justify-between">
      <h2 className="text-xl font-bold text-neutral-900">{title}</h2>
      <Link to={to} className="text-sm text-neutral-500 hover:text-accent">
        전체 보기 →
      </Link>
    </div>
  );
}

/** 최근 토론글 3개 (구성원에게만 표시) */
function RecentPosts() {
  const { canUseDiscussion } = useAuth();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    if (!canUseDiscussion) return;
    let alive = true;
    discussionService.listPosts(3).then((page) => alive && setPosts(page.posts));
    return () => {
      alive = false;
    };
  }, [canUseDiscussion]);

  if (!canUseDiscussion) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        토론 글은 로그인한 연구실 구성원에게만 보입니다.
      </p>
    );
  }
  if (posts === null) return <p className="text-sm text-neutral-500">불러오는 중…</p>;
  if (posts.length === 0) return <p className="text-sm text-neutral-500">아직 글이 없습니다.</p>;

  return (
    <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
      {posts.map((p) => (
        <li key={p.id}>
          <Link to={`/discussion/${p.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-neutral-50">
            <span className="badge shrink-0 bg-accent/10 text-accent">{p.category}</span>
            <span className="flex-1 truncate text-sm font-medium text-neutral-800">{p.title}</span>
            <span className="hidden shrink-0 text-xs text-neutral-500 sm:inline">
              {p.authorName} · {formatDate(p.createdAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
